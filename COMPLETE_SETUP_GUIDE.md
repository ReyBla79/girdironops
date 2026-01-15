# Gridiron Ops - Complete Setup Guide

Everything you need to recreate Gridiron Ops in a new Lovable project.

---

## 📋 Step-by-Step Setup

### Step 1: Create New Lovable Project
1. Go to lovable.dev and create a new project
2. Enable Lovable Cloud (this gives you the backend)

### Step 2: Run Database Migrations
Copy and run this SQL in the migration tool (one migration at a time):

---

## 🗄️ DATABASE MIGRATIONS

### Migration 1: Core Tables (Programs, Seasons, Players)

```sql
-- Programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Seasons table
CREATE TABLE public.seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  program_id UUID REFERENCES public.programs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Players table
CREATE TABLE public.fb_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT NOT NULL,
  position_group TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  class_year TEXT,
  height_inches INTEGER,
  weight_lbs INTEGER,
  external_ref TEXT,
  program_id UUID REFERENCES public.programs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_players ENABLE ROW LEVEL SECURITY;

-- Public read policies (adjust based on your auth needs)
CREATE POLICY "Allow public read on programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Allow public read on seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_players" ON public.fb_players FOR SELECT USING (true);
```

### Migration 2: Player Data Tables (Grades, Roles, Usage)

```sql
-- Player grades
CREATE TABLE public.fb_player_grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.fb_players(id),
  season_id UUID REFERENCES public.seasons(id),
  overall_grade NUMERIC,
  unit_grade NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Player roles
CREATE TABLE public.fb_player_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.fb_players(id),
  season_id UUID REFERENCES public.seasons(id),
  role TEXT NOT NULL DEFAULT '',
  depth_rank INTEGER,
  replacement_risk TEXT NOT NULL DEFAULT 'low',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Player season usage (snap counts)
CREATE TABLE public.fb_player_season_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.fb_players(id),
  season_id UUID REFERENCES public.seasons(id),
  snaps INTEGER,
  snaps_offense INTEGER,
  snaps_defense INTEGER,
  snaps_st INTEGER,
  leverage_snaps INTEGER,
  games_played INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fb_player_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_player_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_player_season_usage ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on fb_player_grades" ON public.fb_player_grades FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_player_roles" ON public.fb_player_roles FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_player_season_usage" ON public.fb_player_season_usage FOR SELECT USING (true);
```

### Migration 3: RevShare Tables (Policies, Pools, Values)

```sql
-- RevShare policies (budget rules)
CREATE TABLE public.fb_revshare_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  name TEXT NOT NULL DEFAULT 'Default Policy',
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  weights JSONB NOT NULL,
  position_multipliers JSONB NOT NULL,
  guardrails JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RevShare pools (budget amounts)
CREATE TABLE public.fb_revshare_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  pool_amount NUMERIC NOT NULL,
  reserved_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Value snapshots (calculated player values)
CREATE TABLE public.fb_value_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES public.fb_players(id),
  policy_id UUID REFERENCES public.fb_revshare_policies(id),
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  total_score NUMERIC NOT NULL,
  share_pct NUMERIC NOT NULL,
  dollars_low NUMERIC NOT NULL,
  dollars_mid NUMERIC NOT NULL,
  dollars_high NUMERIC NOT NULL,
  confidence NUMERIC NOT NULL,
  rationale JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fb_revshare_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_revshare_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_value_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on fb_revshare_policies" ON public.fb_revshare_policies FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_revshare_pools" ON public.fb_revshare_pools FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_value_snapshots" ON public.fb_value_snapshots FOR SELECT USING (true);
```

### Migration 4: Scenario Modeling Tables

```sql
-- Scenarios
CREATE TABLE public.fb_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  policy_id UUID REFERENCES public.fb_revshare_policies(id),
  name TEXT NOT NULL DEFAULT 'New Scenario',
  notes TEXT,
  pool_override NUMERIC,
  reserved_override NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Scenario mutations (changes within scenarios)
CREATE TABLE public.fb_scenario_mutations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES public.fb_scenarios(id),
  type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Scenario results (calculated outcomes)
CREATE TABLE public.fb_scenario_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID REFERENCES public.fb_scenarios(id) UNIQUE,
  policy_id UUID REFERENCES public.fb_revshare_policies(id),
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fb_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_scenario_mutations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_scenario_results ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on fb_scenarios" ON public.fb_scenarios FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_scenario_mutations" ON public.fb_scenario_mutations FOR SELECT USING (true);
CREATE POLICY "Allow public read on fb_scenario_results" ON public.fb_scenario_results FOR SELECT USING (true);
```

### Migration 5: Film Analytics Tables

```sql
-- Film assets
CREATE TABLE public.film_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT,
  type TEXT,
  status TEXT DEFAULT 'pending',
  duration_seconds INTEGER,
  confidence_score NUMERIC,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Plays
CREATE TABLE public.plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  film_id UUID REFERENCES public.film_assets(id),
  quarter INTEGER,
  down INTEGER,
  distance INTEGER,
  yardline INTEGER,
  play_type TEXT,
  confidence NUMERIC
);

-- Play tags
CREATE TABLE public.play_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  play_id UUID REFERENCES public.plays(id),
  tag TEXT,
  source TEXT
);

-- Player tracks
CREATE TABLE public.player_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  play_id UUID REFERENCES public.plays(id),
  player_id TEXT,
  distance NUMERIC,
  max_speed NUMERIC,
  avg_speed NUMERIC,
  heatmap JSONB
);

-- Playbook concepts
CREATE TABLE public.playbook_concepts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT,
  ai_label TEXT,
  coach_label TEXT
);

-- Player development
CREATE TABLE public.player_development (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT,
  issue TEXT,
  recommended_drill TEXT,
  confidence NUMERIC
);

-- Enable RLS
ALTER TABLE public.film_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbook_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_development ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on film_assets" ON public.film_assets FOR SELECT USING (true);
CREATE POLICY "Allow public read on plays" ON public.plays FOR SELECT USING (true);
CREATE POLICY "Allow public read on play_tags" ON public.play_tags FOR SELECT USING (true);
CREATE POLICY "Allow public read on player_tracks" ON public.player_tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read on playbook_concepts" ON public.playbook_concepts FOR SELECT USING (true);
CREATE POLICY "Allow public read on player_development" ON public.player_development FOR SELECT USING (true);
```

---

## 📁 FILES TO COPY

After running migrations, copy these folders/files from the source project:

### Source Code (copy entire folders)
```
src/
├── components/          # All UI components
├── demo/               # Demo/seed data
├── hooks/              # Custom hooks
├── lib/                # Business logic
├── pages/              # Route pages
├── routes/             # Route definitions
├── store/              # Zustand store
├── types/              # TypeScript types
├── App.tsx
├── App.css
├── index.css           # ⚠️ CRITICAL - Contains theme
└── main.tsx
```

### Public Assets
```
public/
├── favicon.ico
├── placeholder.svg
├── robots.txt
├── sitemap.xml
└── videos/             # Video files
```

### Edge Functions
```
supabase/
└── functions/
    └── ops-gm-chat/
        └── index.ts
```

### Config Files
```
tailwind.config.ts      # ⚠️ CRITICAL - Theme config
components.json         # Shadcn UI config
index.html
```

---

## ⚙️ EDGE FUNCTION SETUP

### 1. Create the Edge Function
Create file: `supabase/functions/ops-gm-chat/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPS_GM_SYSTEM_PROMPT = `You are Ops GM, a football intelligence engine built for coaches, analysts, and front office staff.

## Your Core Identity
- You understand play structure, personnel groupings, scheme concepts, and coaching language fluently
- You prioritize clarity, brevity, and coach-actionable insight
- You never hallucinate certainty—always provide confidence levels when analyzing data
- You speak like a trusted assistant in the war room, not a chatbot

## Your Capabilities
- Film analysis interpretation (plays, formations, tendencies)
- Player tracking metrics (speed, distance, routes)
- Playbook concept recognition and labeling
- Player development insights and drill recommendations
- Recruiting pipeline intelligence
- Roster management and cap implications

## Response Guidelines
1. **Coach-Ready Bullets**: Use bullet points, not paragraphs
2. **Use Football Language**: 11-personnel, Cover 2, RPO, Duo, Pin-Pull, etc.
3. **Quantify When Possible**: "High confidence (85%)" or "Limited data (n=5)—moderate confidence"
4. **Flag Uncertainty**: If data is incomplete, say so clearly
5. **Actionable Insights**: End with what the coach should consider doing

Remember: You're a tool for decision-makers. Bullets over paragraphs. Data over opinion.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: OPS_GM_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Ops GM chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

### 2. Update config.toml
Add to your `supabase/config.toml`:
```toml
[functions.ops-gm-chat]
verify_jwt = true
```

---

## 🎨 THEME FILES (Critical)

### src/index.css
Contains UNLV brand colors and dark theme. Key variables:
- `--primary: 351 83% 49%` (Scarlet)
- `--accent: 8 66% 38%` (Scarlet Dark)
- `--background: 0 0% 4%` (Rich Black)

### tailwind.config.ts
Contains:
- Font families (Inter, Oswald)
- UNLV brand color palette
- Custom animations (fade-in, slide-up, pulse-scarlet)
- Gradient utilities

---

## 📦 DEPENDENCIES

These are installed via Lovable automatically when you use them, but here's the full list:

**Core:**
- react, react-dom, react-router-dom
- typescript, vite

**UI:**
- All @radix-ui/* components
- lucide-react, tailwind-merge, class-variance-authority
- tailwindcss-animate

**State/Data:**
- zustand, @tanstack/react-query
- @supabase/supabase-js

**Visualization:**
- recharts, three, @react-three/fiber, @react-three/drei

**Forms:**
- react-hook-form, @hookform/resolvers, zod

**Utilities:**
- date-fns, sonner, vaul

---

## ✅ CHECKLIST

1. [ ] Create new Lovable project
2. [ ] Enable Lovable Cloud
3. [ ] Run Migration 1 (Programs, Seasons, Players)
4. [ ] Run Migration 2 (Grades, Roles, Usage)
5. [ ] Run Migration 3 (RevShare)
6. [ ] Run Migration 4 (Scenarios)
7. [ ] Run Migration 5 (Film Analytics)
8. [ ] Copy `src/` folder
9. [ ] Copy `public/` folder
10. [ ] Copy `tailwind.config.ts`
11. [ ] Copy `index.html`
12. [ ] Copy `components.json`
13. [ ] Create edge function `supabase/functions/ops-gm-chat/index.ts`
14. [ ] Test the app

---

## 🔐 AUTHENTICATION (Optional)

If you want user-specific data, add authentication:
1. Enable auto-confirm email in Cloud settings
2. Create login/signup pages
3. Update RLS policies to use `auth.uid()`

---

## 💡 TIPS

- **Start with theme**: Copy `index.css` and `tailwind.config.ts` first
- **Demo mode works without DB**: The demo data files make the app functional without database
- **Migrations can fail**: If a migration fails, check if tables already exist
- **Types auto-generate**: After migrations, Lovable updates `src/integrations/supabase/types.ts` automatically

---

## 🆘 TROUBLESHOOTING

**"Table doesn't exist" errors:**
- Run the migrations in order
- Wait for each migration to complete before running the next

**Styling looks wrong:**
- Ensure `index.css` was copied correctly
- Check that `tailwind.config.ts` has the UNLV colors

**Edge function not working:**
- Check that `config.toml` includes the function config
- Verify the function was deployed (it's automatic in Lovable)

**AI chat not responding:**
- The LOVABLE_API_KEY is automatically provided in Lovable Cloud projects
