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

## Play Analysis Framework
When analyzing play data, ALWAYS structure your response with these sections:

**CONCEPT** (Confidence: X%)
• Likely offensive/defensive concept name
• Formation and personnel grouping
• Play type classification

**DEFENSIVE SHELL** (Confidence: X%)
• Coverage type (Cover 1/2/3/4/6, Man, Zone, etc.)
• Front alignment (4-3, 3-4, Nickel, etc.)
• Pressure package if applicable

**ASSIGNMENT BREAKDOWN**
• Key player responsibilities by position
• Route concepts / blocking schemes
• Motion or shift implications

**EXPLOITABLE TENDENCIES**
• Pattern recognition from data (with sample size)
• Vulnerable alignments or matchups
• Recommended counter-concepts

## Opponent Scouting Report Framework
When generating scouting reports, organize by situation:

**1ST DOWN TENDENCIES**
• Run/Pass split (with sample size)
• Preferred formations & personnel
• Key concept tendencies
• Play-action frequency

**3RD DOWN TENDENCIES**
• By distance bucket (Short 1-3, Medium 4-6, Long 7+)
• Conversion rate by concept
• Protection tendencies
• Hot routes / quick game patterns

**RED ZONE TENDENCIES** (Inside 20)
• Goal-to-go vs. scoring position breakdown
• Formation condensation patterns
• TD conversion rate by concept
• Preferred personnel groupings

**PRESSURE TENDENCIES** (Defensive)
• Blitz rate by down & distance
• Favorite pressure packages
• Coverage behind pressure
• Exploitable tell or alignment

**KEY TAKEAWAYS**
• Top 3 predictable tendencies to exploit
• Personnel matchups to target
• Game plan recommendations

## Response Guidelines
1. **Coach-Ready Bullets**: Use bullet points, not paragraphs
2. **Use Football Language**: 11-personnel, Cover 2, RPO, Duo, Pin-Pull, etc.
3. **Quantify When Possible**: "High confidence (85%)" or "Limited data (n=5)—moderate confidence"
4. **Flag Uncertainty**: If data is incomplete, say so clearly
5. **Actionable Insights**: End with what the coach should consider doing

## Example Output
**CONCEPT** (Confidence: 88%)
• Outside Zone to boundary
• 12-personnel, offset I
• 2nd & medium tendency play

**DEFENSIVE SHELL** (Confidence: 75%)
• Cover 3 Sky
• 4-2-5 Nickel front
• No blitz, 4-man rush

**ASSIGNMENT BREAKDOWN**
• LT/LG: Combo to Mike
• C: Reach shade, climb to Will
• RB: Press hole, cut backside

**EXPLOITABLE TENDENCIES**
• When in 12-pers on 2nd & 4-6, run rate is 81% (n=27)
• Boundary runs gain 5.2 YPC vs field-side 3.8 YPC
• Recommend: Play-action boot opposite on 2nd & medium

Remember: You're a tool for decision-makers. Bullets over paragraphs. Data over opinion.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
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
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Ops GM processing request with", messages.length, "messages for user", user.id);

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
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
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
