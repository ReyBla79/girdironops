# Gridiron Ops - Export Package

A comprehensive college football operations platform featuring RevShare calculations, roster management, film analytics, transfer portal tracking, and scenario modeling.

---

## 📁 Folder Structure

```
gridiron-ops/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── videos/
│       ├── malik-neighbors-2025-cutups.mp4
│       └── malik-neighbors-pass-pro-snaps.mp4
│
├── src/
│   ├── components/
│   │   ├── ui/                          # Shadcn UI components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── maps/                        # Geographic visualizations
│   │   │   ├── USPipelineHeatMap3D_Columns_ESPN.tsx
│   │   │   ├── USPipelineHeatMap3D_ESPN.tsx
│   │   │   └── USPipelineHeatMapWebGL_ESPN.tsx
│   │   │
│   │   ├── pipeline/                    # Pipeline/recruiting components
│   │   │   ├── FeatureGateCard.tsx
│   │   │   ├── MapDrawer.tsx
│   │   │   ├── PipelineMapToolbar.tsx
│   │   │   ├── PipelinePins.tsx
│   │   │   ├── TierBanner.tsx
│   │   │   └── USMapSVG.tsx
│   │   │
│   │   ├── CompareDrawer.tsx
│   │   ├── DemoTierSwitcher.tsx
│   │   ├── GuardrailBadge.tsx
│   │   ├── LockedCardUpsell.tsx
│   │   ├── NavLink.tsx
│   │   ├── OpsGMChat.tsx
│   │   ├── OpsGMPanel.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RiskHeatmapTable.tsx
│   │
│   ├── demo/                            # Demo/seed data
│   │   ├── calculatorConfig.ts          # RevShare calculator configuration
│   │   ├── coachData.ts                 # Coach directory seed data
│   │   ├── demoData.ts                  # General demo data
│   │   ├── filmData.ts                  # Film analytics seed data
│   │   ├── flags.ts                     # Feature flags
│   │   ├── pipelineData.ts              # Transfer portal pipeline data
│   │   ├── positionConfig.ts            # Position groups & filters
│   │   └── rosterData.ts                # Roster management data
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useFilmSelectors.ts
│   │
│   ├── lib/                             # Core business logic
│   │   ├── seo/                         # SEO utilities
│   │   │   ├── AISummary.tsx
│   │   │   ├── JsonLd.tsx
│   │   │   ├── PageMeta.tsx
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── budgetCalculator.ts          # RevShare budget calculations
│   │   ├── csvParser.ts                 # CSV import utilities
│   │   ├── footballValueEngine.ts       # Player value calculations
│   │   ├── scenarioEngine.ts            # Scenario modeling engine
│   │   └── utils.ts                     # General utilities
│   │
│   ├── pages/                           # Route pages
│   │   ├── film/                        # Film analytics pages
│   │   │   ├── FilmAnalyticsPage.tsx
│   │   │   ├── FilmInboxPage.tsx
│   │   │   ├── FilmSettingsPage.tsx
│   │   │   ├── GameTimelinePage.tsx
│   │   │   ├── OpsGMFilmPage.tsx
│   │   │   ├── PlayDetailPage.tsx
│   │   │   ├── PlayerDevPage.tsx
│   │   │   └── ScoutReportPage.tsx
│   │   │
│   │   ├── gridiron/                    # Gridiron-specific pages
│   │   │   ├── GridironDashboardPage.tsx
│   │   │   ├── GridironScenariosPage.tsx
│   │   │   ├── GridironSetupPage.tsx
│   │   │   ├── RosterGradesPage.tsx
│   │   │   ├── RosterIntakePage.tsx
│   │   │   ├── RosterUsagePage.tsx
│   │   │   └── ScenarioLab.tsx
│   │   │
│   │   ├── seo/                         # SEO landing pages
│   │   │   ├── AutomaticPlayRecognitionPage.tsx
│   │   │   ├── CollegeFootballFilmIntelligencePage.tsx
│   │   │   ├── CollegeFootballOperationsPage.tsx
│   │   │   ├── CollegeFootballRecruitingPage.tsx
│   │   │   ├── DemoPage.tsx
│   │   │   ├── FAQPage.tsx
│   │   │   ├── FootballTendencyAnalyticsPage.tsx
│   │   │   ├── LLMPage.tsx
│   │   │   ├── NCAATransferPortalOpsPage.tsx
│   │   │   ├── PlayerTrackingFromVideoPage.tsx
│   │   │   └── PricingPage.tsx
│   │   │
│   │   ├── AppShell.tsx                 # Main app layout
│   │   ├── BudgetPage.tsx               # Budget management
│   │   ├── BudgetSimulatorPage.tsx      # Budget simulator
│   │   ├── CoachProfilePage.tsx         # Coach profiles
│   │   ├── CompliancePage.tsx           # Compliance tracking
│   │   ├── FitLabPage.tsx               # Player fit analysis
│   │   ├── ForecastPage.tsx             # Forecasting
│   │   ├── GMCenterPage.tsx             # GM command center
│   │   ├── Index.tsx                    # Home/dashboard
│   │   ├── Landing.tsx                  # Public landing page
│   │   ├── Login.tsx                    # Authentication
│   │   ├── NetworkPage.tsx              # Network/relationships
│   │   ├── NotFound.tsx                 # 404 page
│   │   ├── PipelineDetailPage.tsx       # Pipeline player details
│   │   ├── PipelineListPage.tsx         # Pipeline list view
│   │   ├── PipelineMapPage.tsx          # Geographic pipeline map
│   │   ├── PlayerProfile.tsx            # Player profile page
│   │   ├── PlayersPage.tsx              # Players list
│   │   ├── PortalPage.tsx               # Transfer portal
│   │   ├── RosterPage.tsx               # Roster management
│   │   ├── TasksPage.tsx                # Task management
│   │   ├── TodayPage.tsx                # Daily dashboard
│   │   └── UpgradePage.tsx              # Upgrade prompts
│   │
│   ├── routes/
│   │   └── GridironRoutes.tsx           # Route definitions
│   │
│   ├── store/
│   │   └── useAppStore.ts               # Zustand state management
│   │
│   ├── types/                           # TypeScript definitions
│   │   ├── beforeAfter.ts               # Before/after comparison types
│   │   ├── calculatorConfig.ts          # Calculator config types
│   │   ├── film.ts                      # Film analytics types
│   │   ├── index.ts                     # Main type exports
│   │   └── pipeline.ts                  # Pipeline types
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                # Supabase client (auto-generated)
│   │       └── types.ts                 # Database types (auto-generated)
│   │
│   ├── App.tsx                          # Root app component
│   ├── App.css                          # Global styles
│   ├── index.css                        # Tailwind & CSS variables
│   ├── main.tsx                         # React entry point
│   └── vite-env.d.ts                    # Vite type declarations
│
├── supabase/
│   ├── config.toml                      # Supabase configuration
│   └── functions/
│       └── ops-gm-chat/
│           └── index.ts                 # AI chat edge function
│
├── .env                                 # Environment variables
├── components.json                      # Shadcn UI config
├── eslint.config.js                     # ESLint configuration
├── index.html                           # HTML entry point
├── package.json                         # Dependencies
├── postcss.config.js                    # PostCSS configuration
├── tailwind.config.ts                   # Tailwind configuration
├── tsconfig.json                        # TypeScript config
├── tsconfig.app.json                    # App TypeScript config
├── tsconfig.node.json                   # Node TypeScript config
└── vite.config.ts                       # Vite configuration
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Clone or copy the project
cd gridiron-ops

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

---

## 📦 Dependencies

### Core Framework
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "vite": "latest",
  "typescript": "latest"
}
```

### UI Components
```json
{
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-tooltip": "^1.2.7",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.462.0",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

### State & Data
```json
{
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.83.0",
  "@supabase/supabase-js": "^2.89.0"
}
```

### Visualization
```json
{
  "recharts": "^2.15.4",
  "three": "^0.160.1",
  "@react-three/fiber": "^8.18.0",
  "@react-three/drei": "^9.122.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.61.1",
  "@hookform/resolvers": "^3.10.0",
  "zod": "^3.25.76"
}
```

### Utilities
```json
{
  "date-fns": "^3.6.0",
  "sonner": "^1.7.4",
  "vaul": "^0.9.9"
}
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# Supabase (if using backend)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

---

## 🎯 Key Features

### 1. RevShare Calculator
- Position-weighted value calculations
- Guardrail enforcement (max share, floor rules)
- Multi-scenario comparison

### 2. Roster Management
- Full roster tracking with grades
- Position group analytics
- Usage/snap tracking

### 3. Film Analytics
- Play-by-play breakdown
- AI-powered tagging
- Player tracking data

### 4. Transfer Portal Pipeline
- Geographic heat maps
- Player scoring & ranking
- Staff assignment tracking

### 5. Scenario Modeling
- What-if analysis
- Budget impact simulations
- Position group rebalancing

---

## 🗄️ Database Schema (Supabase)

Key tables:
- `fb_players` - Player roster
- `fb_player_grades` - Performance grades
- `fb_player_roles` - Role assignments
- `fb_player_season_usage` - Snap counts
- `fb_revshare_policies` - Budget policies
- `fb_revshare_pools` - Budget pools
- `fb_scenarios` - Scenario definitions
- `fb_scenario_results` - Calculated results
- `fb_value_snapshots` - Player valuations
- `film_assets` - Film uploads
- `plays` - Play data
- `play_tags` - AI tags
- `player_tracks` - Tracking data

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      React App                          │
├─────────────┬─────────────┬─────────────┬──────────────┤
│   Pages     │ Components  │    Hooks    │    Store     │
├─────────────┼─────────────┼─────────────┼──────────────┤
│             │             │             │   Zustand    │
│  Routing    │  UI Layer   │  Business   │   Global     │
│  (react-    │  (shadcn/   │   Logic     │    State     │
│   router)   │   radix)    │             │              │
├─────────────┴─────────────┴─────────────┴──────────────┤
│                    Libraries                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐│
│  │ scenarioEngine│ │budgetCalculator│ │footballValueEngine││
│  └──────────────┘ └──────────────┘ └──────────────────┘│
├─────────────────────────────────────────────────────────┤
│                   Demo Data Layer                       │
│  (filmData, pipelineData, rosterData, coachData, etc.) │
├─────────────────────────────────────────────────────────┤
│                   Supabase Backend                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │ Database │ │   Auth   │ │ Storage  │ │Edge Funcs  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Customization

### Theming
Edit `src/index.css` for CSS variables and `tailwind.config.ts` for Tailwind theme.

### Demo Data
Replace files in `src/demo/` with your own seed data.

### Position Config
Modify `src/demo/positionConfig.ts` for position groups and filters.

### Feature Flags
Toggle features in `src/demo/flags.ts`.

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
# or
bun run build
```

Output will be in the `dist/` folder.

### Deploy Options
- **Lovable**: Click Publish in editor
- **Vercel**: Connect GitHub repo
- **Netlify**: Drag & drop dist folder
- **Self-hosted**: Serve dist with any static host

---

## 📄 License

Proprietary - Gridiron Ops

---

## 🤝 Support

For questions or customization requests, contact the development team.
