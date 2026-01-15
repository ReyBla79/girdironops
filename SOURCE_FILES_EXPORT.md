# Gridiron Ops - Complete Source Files Export

Copy-paste these files into your new Lovable project. Files are organized by folder.

---

## 📁 ROOT CONFIG FILES

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>Gridiron Ops | College Football Recruiting Intelligence Platform</title>
    <meta name="title" content="Gridiron Ops | College Football Recruiting Intelligence Platform" />
    <meta name="description" content="Gridiron Ops transforms NCAA Transfer Portal chaos into actionable recruiting intelligence. Real-time player tracking, NIL compliance tools, and AI-powered insights for college football programs." />
    <meta name="keywords" content="college football recruiting, NCAA Transfer Portal, NIL compliance, recruiting software, college football analytics, transfer portal tracker, CFP recruiting, football recruiting platform, NCAA compliance tools" />
    <meta name="author" content="Gridiron Ops" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://gridironops.com/" />
    
    <!-- Theme Color -->
    <meta name="theme-color" content="#c8102e" />
    <meta name="msapplication-TileColor" content="#c8102e" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gridironops.com/" />
    <meta property="og:title" content="Gridiron Ops | College Football Recruiting Intelligence Platform" />
    <meta property="og:description" content="Transform NCAA Transfer Portal chaos into actionable recruiting intelligence. Real-time player tracking, NIL compliance tools, and AI-powered insights for college football programs." />
    <meta property="og:image" content="https://gridironops.com/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Gridiron Ops - College Football Recruiting Intelligence Platform" />
    <meta property="og:site_name" content="Gridiron Ops" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@GridironOps" />
    <meta name="twitter:creator" content="@GridironOps" />
    <meta name="twitter:url" content="https://gridironops.com/" />
    <meta name="twitter:title" content="Gridiron Ops | College Football Recruiting Intelligence" />
    <meta name="twitter:description" content="Transform NCAA Transfer Portal chaos into actionable recruiting intelligence. Real-time tracking, NIL compliance, and AI-powered insights." />
    <meta name="twitter:image" content="https://gridironops.com/og-image.png" />
    <meta name="twitter:image:alt" content="Gridiron Ops Platform Screenshot" />

    <!-- Additional SEO Tags -->
    <meta name="application-name" content="Gridiron Ops" />
    <meta name="apple-mobile-web-app-title" content="Gridiron Ops" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="format-detection" content="telephone=no" />
    
    <!-- Geo Tags -->
    <meta name="geo.region" content="US" />
    <meta name="geo.placename" content="United States" />
    
    <!-- Language/Content Tags -->
    <meta http-equiv="Content-Language" content="en" />
    <link rel="alternate" hreflang="en-US" href="https://gridironops.com/" />
    <link rel="alternate" hreflang="x-default" href="https://gridironops.com/" />

    <!-- Preconnect to External Resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Sitemap Reference -->
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

    <!-- Base Organization JSON-LD (static fallback) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Gridiron Ops",
      "url": "https://gridironops.com",
      "logo": "https://gridironops.com/logo.png",
      "description": "College football recruiting intelligence platform for NCAA Division I programs.",
      "sameAs": [
        "https://twitter.com/GridironOps"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "coachbrey@wontrack.com",
        "contactType": "sales"
      }
    }
    </script>

    <!-- WebSite JSON-LD for Sitelinks Search Box -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Gridiron Ops",
      "url": "https://gridironops.com",
      "description": "College football recruiting intelligence platform with Transfer Portal tracking, NIL compliance, and AI-powered analytics.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://gridironops.com/app/players?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
    </script>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## 📁 src/

### src/main.tsx
```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### src/App.tsx
```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AppShell from "./pages/AppShell";
import TodayPage from "./pages/TodayPage";
import PortalPage from "./pages/PortalPage";
import PlayersPage from "./pages/PlayersPage";
import PlayerProfile from "./pages/PlayerProfile";
import TasksPage from "./pages/TasksPage";
import CompliancePage from "./pages/CompliancePage";
import UpgradePage from "./pages/UpgradePage";
import RosterPage from "./pages/RosterPage";
import FitLabPage from "./pages/FitLabPage";
import NetworkPage from "./pages/NetworkPage";
import CoachProfilePage from "./pages/CoachProfilePage";
import BudgetPage from "./pages/BudgetPage";
import BudgetSimulatorPage from "./pages/BudgetSimulatorPage";
import ForecastPage from "./pages/ForecastPage";
import GMCenterPage from "./pages/GMCenterPage";
import PipelineMapPage from "./pages/PipelineMapPage";
import PipelineListPage from "./pages/PipelineListPage";
import PipelineDetailPage from "./pages/PipelineDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
// Film Intelligence pages
import FilmInboxPage from "./pages/film/FilmInboxPage";
import GameTimelinePage from "./pages/film/GameTimelinePage";
import PlayDetailPage from "./pages/film/PlayDetailPage";
import FilmAnalyticsPage from "./pages/film/FilmAnalyticsPage";
import ScoutReportPage from "./pages/film/ScoutReportPage";
import OpsGMFilmPage from "./pages/film/OpsGMFilmPage";
import PlayerDevPage from "./pages/film/PlayerDevPage";
import FilmSettingsPage from "./pages/film/FilmSettingsPage";
// SEO Landing Pages
import CollegeFootballOperationsPage from "./pages/seo/CollegeFootballOperationsPage";
import CollegeFootballRecruitingPage from "./pages/seo/CollegeFootballRecruitingPage";
import NCAATransferPortalOpsPage from "./pages/seo/NCAATransferPortalOpsPage";
import CollegeFootballFilmIntelligencePage from "./pages/seo/CollegeFootballFilmIntelligencePage";
import AutomaticPlayRecognitionPage from "./pages/seo/AutomaticPlayRecognitionPage";
import FootballTendencyAnalyticsPage from "./pages/seo/FootballTendencyAnalyticsPage";
import PlayerTrackingFromVideoPage from "./pages/seo/PlayerTrackingFromVideoPage";
import DemoPage from "./pages/seo/DemoPage";
import PricingPage from "./pages/seo/PricingPage";
import FAQPage from "./pages/seo/FAQPage";
import LLMPage from "./pages/seo/LLMPage";
// Gridiron Ops pages
import GridironSetupPage from "./pages/gridiron/GridironSetupPage";
import RosterIntakePage from "./pages/gridiron/RosterIntakePage";
import RosterUsagePage from "./pages/gridiron/RosterUsagePage";
import RosterGradesPage from "./pages/gridiron/RosterGradesPage";
import GridironDashboardPage from "./pages/gridiron/GridironDashboardPage";
import GridironScenariosPage from "./pages/gridiron/GridironScenariosPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          {/* SEO Landing Pages */}
          <Route path="/college-football-operations" element={<CollegeFootballOperationsPage />} />
          <Route path="/college-football-recruiting" element={<CollegeFootballRecruitingPage />} />
          <Route path="/ncaa-transfer-portal-ops" element={<NCAATransferPortalOpsPage />} />
          <Route path="/college-football-film-intelligence" element={<CollegeFootballFilmIntelligencePage />} />
          <Route path="/automatic-play-recognition-football" element={<AutomaticPlayRecognitionPage />} />
          <Route path="/football-tendency-analytics" element={<FootballTendencyAnalyticsPage />} />
          <Route path="/player-tracking-from-video" element={<PlayerTrackingFromVideoPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/llm" element={<LLMPage />} />
          {/* Gridiron Ops routes */}
          <Route path="/gridiron/setup" element={<GridironSetupPage />} />
          <Route path="/gridiron/roster/intake" element={<RosterIntakePage />} />
          <Route path="/gridiron/roster/usage" element={<RosterUsagePage />} />
          <Route path="/gridiron/roster/grades" element={<RosterGradesPage />} />
          <Route path="/gridiron/roster" element={<GridironDashboardPage />} />
          <Route path="/gridiron/scenarios" element={<GridironScenariosPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route
              path="today"
              element={
                <ProtectedRoute requiredFlag="daily_brief">
                  <TodayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="portal"
              element={
                <ProtectedRoute requiredFlag="portal_live">
                  <PortalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="players"
              element={
                <ProtectedRoute requiredFlag="players_module">
                  <PlayersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="player/:id"
              element={
                <ProtectedRoute requiredFlag="player_profile">
                  <PlayerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="tasks"
              element={
                <ProtectedRoute requiredFlag="tasks_module">
                  <TasksPage />
                </ProtectedRoute>
              }
            />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route
              path="roster"
              element={
                <ProtectedRoute requiredFlag="roster_module">
                  <RosterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="fit-lab"
              element={
                <ProtectedRoute requiredFlag="fit_lab">
                  <FitLabPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="network"
              element={
                <ProtectedRoute requiredFlag="coach_network_pro">
                  <NetworkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="network/coach/:id"
              element={
                <ProtectedRoute requiredFlag="coach_network_pro">
                  <CoachProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="budget"
              element={
                <ProtectedRoute requiredFlag="budget_core">
                  <BudgetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="budget/simulator"
              element={
                <ProtectedRoute requiredFlag="budget_core">
                  <BudgetSimulatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="forecast"
              element={
                <ProtectedRoute requiredFlag="budget_core">
                  <ForecastPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="gm"
              element={
                <ProtectedRoute requiredFlag="gm_mode">
                  <GMCenterPage />
                </ProtectedRoute>
              }
            />
            <Route path="pipelines/map" element={<PipelineMapPage />} />
            <Route path="pipelines/:id" element={<PipelineDetailPage />} />
            <Route path="pipelines" element={<PipelineListPage />} />
            {/* Film Intelligence routes */}
            <Route path="film" element={<FilmInboxPage />} />
            <Route path="film/:filmId" element={<GameTimelinePage />} />
            <Route path="film/play/:playId" element={<PlayDetailPage />} />
            <Route path="film/analytics" element={<FilmAnalyticsPage />} />
            <Route path="film/report" element={<ScoutReportPage />} />
            <Route path="film/opsgm" element={<OpsGMFilmPage />} />
            <Route path="film/player-dev" element={<PlayerDevPage />} />
            <Route path="film/settings" element={<FilmSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

## 📁 src/lib/

### src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PipelineTier } from "@/types/pipeline";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TIER_ORDER: PipelineTier[] = ['CORE', 'GM', 'ELITE'];

export function isTierUnlocked(currentTier: PipelineTier, requiresTier: PipelineTier): boolean {
  return TIER_ORDER.indexOf(currentTier) >= TIER_ORDER.indexOf(requiresTier);
}
```

---

## 📁 src/hooks/

### src/hooks/use-mobile.tsx
```tsx
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

---

## 📁 src/demo/

### src/demo/flags.ts
```typescript
import { FeatureFlags } from '@/types';

export const DEFAULT_FLAGS: FeatureFlags = {
  base_platform: true,
  daily_brief: true,
  portal_live: true,
  players_module: true,
  player_profile: true,
  tasks_module: true,
  program_dna: true,
  audit_logging: true,
  compliance_guardrails: true,
  coach_agent: true,
  memory_engine: false,
  alerts_realtime: false,
  sms_daily: false,
  coach_network_pro: true,
  enterprise_institutional: false,
  api_licensing: false,
  film_ai: false,
  revshare_engine: false,
  roster_module: true,
  fit_lab: true,
  budget_core: true,
  budget_simulator: true,
  budget_forecast: true,
  risk_heatmaps: true,
  gm_mode: true,
  wow_button: true,
  tier: 'CORE',
};
```

### src/demo/positionConfig.ts
```typescript
// Position filter options
export const POSITION_OPTIONS = [
  'ALL',
  'QB', 'RB', 'FB', 'WR', 'TE',
  'LT', 'LG', 'C', 'RG', 'RT', 'OL',
  'DE', 'DT', 'NT', 'EDGE', 'DL',
  'ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB',
  'CB', 'NB', 'S', 'FS', 'SS', 'DB',
  'K', 'P', 'LS', 'H', 'KR', 'PR', 'GUN', 'PP',
];

// Position group options
export const POSITION_GROUP_OPTIONS = [
  'ALL',
  'OFFENSE', 'DEFENSE', 'SPECIAL_TEAMS',
  'SKILL', 'OL', 'DL', 'EDGE', 'LB', 'DB',
];

// Position group to positions mapping
export const POSITION_GROUP_MAP: Record<string, string[]> = {
  OFFENSE: ['QB', 'RB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL'],
  SKILL: ['QB', 'RB', 'FB', 'WR', 'TE'],
  OL: ['LT', 'LG', 'C', 'RG', 'RT', 'OL'],
  DEFENSE: ['DE', 'DT', 'NT', 'EDGE', 'DL', 'ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB', 'CB', 'NB', 'S', 'FS', 'SS', 'DB'],
  DL: ['DT', 'NT', 'DL'],
  EDGE: ['DE', 'EDGE'],
  LB: ['ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB'],
  DB: ['CB', 'NB', 'S', 'FS', 'SS', 'DB'],
  SPECIAL_TEAMS: ['K', 'P', 'LS', 'H', 'KR', 'PR', 'GUN', 'PP'],
};

// Helper to check if a position matches a filter (handles both individual positions and groups)
export function positionMatchesFilter(position: string, filter: string): boolean {
  if (filter === 'ALL') return true;
  
  // Check if filter is a position group
  if (POSITION_GROUP_MAP[filter]) {
    return POSITION_GROUP_MAP[filter].includes(position);
  }
  
  // Direct position match
  return position === filter;
}

// Get display label for a filter option
export function getPositionFilterLabel(value: string): string {
  if (value === 'ALL') return 'All Positions';
  if (POSITION_GROUP_MAP[value]) return `${value} (Group)`;
  return value;
}
```

---

## ⚠️ REMAINING FILES

Due to size constraints, the remaining files are documented in the COMPLETE_SETUP_GUIDE.md file.

**To get all files:**
1. Use the shell script `scripts/export-gridiron-ops.sh` to create a complete ZIP
2. Or manually read each file from the code editor in your source project and copy to the new project

**Key files to copy (in order of importance):**

### Types (src/types/)
- `src/types/index.ts` - Core type definitions
- `src/types/pipeline.ts` - Pipeline types
- `src/types/film.ts` - Film analytics types
- `src/types/calculatorConfig.ts` - Calculator config types
- `src/types/beforeAfter.ts` - Before/after comparison types

### Demo Data (src/demo/)
- `src/demo/demoData.ts` - Players, events, tasks
- `src/demo/rosterData.ts` - Roster, needs, budget
- `src/demo/coachData.ts` - Coach network
- `src/demo/filmData.ts` - Film analytics
- `src/demo/pipelineData.ts` - Pipeline intelligence
- `src/demo/calculatorConfig.ts` - RevShare calculator

### Business Logic (src/lib/)
- `src/lib/budgetCalculator.ts` - Budget & scenario engine
- `src/lib/footballValueEngine.ts` - Player value calculations
- `src/lib/scenarioEngine.ts` - Scenario modeling
- `src/lib/csvParser.ts` - CSV import

### Store
- `src/store/useAppStore.ts` - Zustand global state

### Theme (CRITICAL)
- `src/index.css` - CSS variables & theme
- `tailwind.config.ts` - Tailwind theme

### Edge Functions
- `supabase/functions/ops-gm-chat/index.ts` - AI chat function

---

## 📝 QUICK COPY INSTRUCTIONS

1. **Create new project** in Lovable
2. **Enable Cloud** (for database)
3. **Run migrations** from COMPLETE_SETUP_GUIDE.md
4. **Copy theme files first**: `src/index.css` and `tailwind.config.ts`
5. **Copy src/types/** folder
6. **Copy src/demo/** folder
7. **Copy src/lib/** folder
8. **Copy src/store/** folder
9. **Copy src/hooks/** folder
10. **Copy src/components/** folder
11. **Copy src/pages/** folder
12. **Copy src/routes/** folder
13. **Update src/App.tsx and src/main.tsx**
14. **Copy index.html and components.json**
15. **Create edge function** in `supabase/functions/ops-gm-chat/index.ts`

The app should now work!
