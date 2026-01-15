# Gridiron Ops - Complete Source Code Export

This is a **complete** export of all source code files for the Gridiron Ops platform. Copy each section into the corresponding file in your new Lovable project.

---

## Table of Contents

1. [Root Configuration Files](#1-root-configuration-files)
2. [Source Entry Files](#2-source-entry-files)
3. [Type Definitions](#3-type-definitions)
4. [State Management](#4-state-management)
5. [Demo Data](#5-demo-data)
6. [Utility Libraries](#6-utility-libraries)
7. [Pages](#7-pages)
8. [Components](#8-components)
9. [Hooks](#9-hooks)
10. [Routes](#10-routes)
11. [SEO Libraries](#11-seo-libraries)
12. [Edge Functions](#12-edge-functions)
13. [Database Migrations](#13-database-migrations)

---

## 1. Root Configuration Files

### `index.html`
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

### `components.json`
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

## 2. Source Entry Files

### `src/main.tsx`
```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### `src/App.tsx`
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
            <Route path="today" element={<ProtectedRoute requiredFlag="daily_brief"><TodayPage /></ProtectedRoute>} />
            <Route path="portal" element={<ProtectedRoute requiredFlag="portal_live"><PortalPage /></ProtectedRoute>} />
            <Route path="players" element={<ProtectedRoute requiredFlag="players_module"><PlayersPage /></ProtectedRoute>} />
            <Route path="player/:id" element={<ProtectedRoute requiredFlag="player_profile"><PlayerProfile /></ProtectedRoute>} />
            <Route path="tasks" element={<ProtectedRoute requiredFlag="tasks_module"><TasksPage /></ProtectedRoute>} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="roster" element={<ProtectedRoute requiredFlag="roster_module"><RosterPage /></ProtectedRoute>} />
            <Route path="fit-lab" element={<ProtectedRoute requiredFlag="fit_lab"><FitLabPage /></ProtectedRoute>} />
            <Route path="budget" element={<ProtectedRoute requiredFlag="budget_core"><BudgetPage /></ProtectedRoute>} />
            <Route path="budget/simulator" element={<ProtectedRoute requiredFlag="budget_core"><BudgetSimulatorPage /></ProtectedRoute>} />
            <Route path="forecast" element={<ProtectedRoute requiredFlag="budget_core"><ForecastPage /></ProtectedRoute>} />
            <Route path="gm" element={<ProtectedRoute requiredFlag="gm_mode"><GMCenterPage /></ProtectedRoute>} />
            <Route path="network" element={<ProtectedRoute requiredFlag="coach_network_pro"><NetworkPage /></ProtectedRoute>} />
            <Route path="network/coach/:id" element={<ProtectedRoute requiredFlag="coach_network_pro"><CoachProfilePage /></ProtectedRoute>} />
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

### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Oswald:wght@500;600;700&display=swap');

@layer base {
  :root {
    /* UNLV Color Palette - Dark Theme */
    /* Base: Rich Black foundation */
    --background: 0 0% 4%;
    --foreground: 0 0% 95%;

    /* Cards: Elevated surfaces with subtle warmth */
    --card: 0 0% 7%;
    --card-foreground: 0 0% 95%;

    /* Popover: Slightly elevated from cards */
    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 95%;

    /* Primary: UNLV Scarlet */
    --primary: 351 83% 49%;
    --primary-foreground: 0 0% 100%;

    /* Secondary: Dark gray surface */
    --secondary: 208 8% 12%;
    --secondary-foreground: 0 0% 90%;

    /* Muted: Subtle backgrounds */
    --muted: 208 6% 10%;
    --muted-foreground: 216 2% 55%;

    /* Accent: Scarlet Dark for accents */
    --accent: 8 66% 38%;
    --accent-foreground: 0 0% 100%;

    /* Destructive: Matches Scarlet but distinct */
    --destructive: 351 83% 49%;
    --destructive-foreground: 0 0% 100%;

    /* Success: Green that complements the palette */
    --success: 152 69% 31%;
    --success-foreground: 0 0% 100%;

    /* Warning: Warm amber */
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 8%;

    /* Borders & Inputs */
    --border: 208 8% 18%;
    --input: 208 8% 14%;
    --ring: 351 83% 49%;

    --radius: 0.625rem;

    /* Sidebar */
    --sidebar-background: 0 0% 3%;
    --sidebar-foreground: 216 2% 75%;
    --sidebar-primary: 351 83% 49%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 208 8% 14%;
    --sidebar-accent-foreground: 0 0% 95%;
    --sidebar-border: 208 8% 14%;
    --sidebar-ring: 351 83% 49%;

    /* Custom Gradients - UNLV Theme */
    --gradient-hero: linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(0 0% 2%) 100%);
    --gradient-card: linear-gradient(180deg, hsl(0 0% 9%) 0%, hsl(0 0% 6%) 100%);
    --gradient-accent: linear-gradient(135deg, hsl(351 83% 49%) 0%, hsl(8 66% 38%) 100%);
    --gradient-glow: radial-gradient(ellipse at center, hsl(351 83% 49% / 0.12) 0%, transparent 70%);
    --gradient-scarlet: linear-gradient(135deg, hsl(351 83% 49%) 0%, hsl(351 83% 40%) 100%);

    /* Shadows */
    --shadow-glow: 0 0 60px hsl(351 83% 49% / 0.25);
    --shadow-card: 0 4px 24px hsl(0 0% 0% / 0.6);
    --shadow-scarlet: 0 4px 20px hsl(351 83% 49% / 0.3);
  }

  .dark {
    --background: 0 0% 4%;
    --foreground: 0 0% 95%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Inter', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Oswald', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
}

@layer utilities {
  .gradient-hero {
    background: var(--gradient-hero);
  }

  .gradient-card {
    background: var(--gradient-card);
  }

  .gradient-accent {
    background: var(--gradient-accent);
  }

  .gradient-glow {
    background: var(--gradient-glow);
  }

  .gradient-scarlet {
    background: var(--gradient-scarlet);
  }

  .shadow-glow {
    box-shadow: var(--shadow-glow);
  }

  .shadow-card {
    box-shadow: var(--shadow-card);
  }

  .shadow-scarlet {
    box-shadow: var(--shadow-scarlet);
  }

  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: var(--gradient-accent);
  }

  .border-gradient {
    border: 1px solid transparent;
    background: linear-gradient(var(--background), var(--background)) padding-box,
                var(--gradient-accent) border-box;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out forwards;
  }

  .animate-pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }

  .animate-scarlet-pulse {
    animation: scarletPulse 3s ease-in-out infinite;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% { 
    box-shadow: 0 0 20px hsl(351 83% 49% / 0.3);
  }
  50% { 
    box-shadow: 0 0 40px hsl(351 83% 49% / 0.5);
  }
}

@keyframes scarletPulse {
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(0 0% 6%);
}

::-webkit-scrollbar-thumb {
  background: hsl(208 8% 25%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(351 83% 49%);
}

/* Selection styling */
::selection {
  background: hsl(351 83% 49% / 0.4);
  color: hsl(0 0% 100%);
}

/* Focus ring styling */
:focus-visible {
  outline: 2px solid hsl(351 83% 49%);
  outline-offset: 2px;
}
```

---

## 3. Type Definitions

### `src/types/index.ts`
```typescript
export type Role = 'HC' | 'GM_RC' | 'COORDINATOR' | 'POSITION_COACH' | 'ANALYST_GA' | 'COMPLIANCE';

export type PositionGroup = "OL" | "DL" | "LB" | "DB" | "WR" | "RB" | "QB" | "TE" | "ST";
export type ClassYear = "FR" | "SO" | "JR" | "SR" | "GR";
export type Pool = "TRANSFER_PORTAL" | "JUCO" | "HS";
export type PlayerStatus = "NEW" | "UPDATED" | "WITHDRAWN";
export type Readiness = "HIGH" | "MED" | "LOW";
export type Risk = "LOW" | "MED" | "HIGH";
export type RevShareBand = "HIGH" | "MED" | "LOW";
export type NeedPriority = "MUST_REPLACE" | "UPGRADE" | "DEPTH";
export type VerificationStatus = "VERIFIED_OPT_IN" | "CLAIMED" | "UNVERIFIED";
export type ContactVisibility = "PUBLIC" | "GATED" | "HIDDEN";
export type CoachLevel = "FBS" | "FCS" | "D2" | "D3" | "JUCO" | "HS";
export type CoachRoleType = "HC" | "OC" | "DC" | "POSITION" | "ANALYST" | "RECRUITING";

export interface Player {
  id: string;
  name: string;
  position: string;
  positionGroup: PositionGroup;
  height: string;
  weight: string;
  classYear: ClassYear;
  eligibility: string;
  pool: Pool;
  originSchool: string;
  hometown: string;
  state: string;
  enteredAt: string;
  status: PlayerStatus;
  fitScore: number;
  readiness: Readiness;
  risk: Risk;
  reasons: string[];
  flags: string[];
  filmLinks: { label: string; url: string }[];
  revShareRange?: { low: number; mid: number; high: number; rationale: string };
  reviewed?: boolean;
}

export type EventType =
  | "PORTAL_NEW"
  | "PORTAL_UPDATED"
  | "PORTAL_WITHDRAWN"
  | "TASK_CREATED"
  | "PLAYER_REVIEWED"
  | "CONTACT_REQUESTED"
  | "AGENT_QUERY"
  | "NETWORK_ACCESS_REQUESTED"
  | "OUTREACH_DRAFTED";

export interface DemoEvent {
  id: string;
  ts: string;
  type: EventType;
  playerId?: string;
  coachId?: string;
  message: string;
}

export interface Task {
  id: string;
  ts: string;
  title: string;
  owner: string;
  status: "OPEN" | "DONE";
  due?: string;
  playerId?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  role: string;
}

export type PipelineTier = 'CORE' | 'GM' | 'ELITE';

export interface Tiers {
  tier: PipelineTier;
  tierOrder: PipelineTier[];
}

export interface FeatureFlags {
  base_platform: boolean;
  daily_brief: boolean;
  portal_live: boolean;
  players_module: boolean;
  player_profile: boolean;
  tasks_module: boolean;
  program_dna: boolean;
  audit_logging: boolean;
  compliance_guardrails: boolean;
  coach_agent: boolean;
  memory_engine: boolean;
  alerts_realtime: boolean;
  sms_daily: boolean;
  coach_network_pro: boolean;
  enterprise_institutional: boolean;
  api_licensing: boolean;
  film_ai: boolean;
  revshare_engine: boolean;
  roster_module: boolean;
  fit_lab: boolean;
  budget_core: boolean;
  budget_simulator: boolean;
  budget_forecast: boolean;
  risk_heatmaps: boolean;
  gm_mode: boolean;
  wow_button: boolean;
  tier: PipelineTier;
}

export type UIMode = 'COACH' | 'GM';

export interface WowScenario {
  id: string;
  label: string;
  recruitPlayerId: string;
  targetNeedId: string;
  suggestReplacementRule: {
    positionGroup: PositionGroup;
    prefer: string;
    fallback: string;
  };
}

// BeforeAfterState is now imported from './beforeAfter.ts'
export type { BeforeAfterState, BeforeAfterSummary } from './beforeAfter';

export interface ProgramDNA {
  program: string;
  recruitingPriorities: string[];
  schemeNotes: {
    offense: string;
    defense: string;
  };
  fitRules: string[];
}

export type RosterRole = "STARTER" | "ROTATION" | "DEPTH" | "DEVELOPMENTAL";
export type RiskColor = "GREEN" | "YELLOW" | "RED";

export interface RiskFactors {
  injury: number;
  transfer: number;
  academics: number;
}

export interface SimulationTags {
  simRemoved?: boolean;
  simAdded?: boolean;
  simScenarioId?: string;
  simRemovalReason?: string;
}

export interface RosterPlayer {
  id: string;
  name: string;
  position: string;
  positionGroup: PositionGroup;
  year: ClassYear;
  gradYear: number;
  eligibilityRemaining: number;
  revShareBand: RevShareBand;
  estimatedCost: number;
  role: RosterRole;
  snapsShare: number;
  performanceGrade: number;
  risk: RiskFactors;
  riskScore: number;
  riskColor: RiskColor;
  // Simulation tags
  simRemoved?: boolean;
  simAdded?: boolean;
  simScenarioId?: string;
  simRemovalReason?: string;
}

export interface RosterMeta {
  programId: string;
  programName: string;
  rosterSize: number;
  asOf: string;
  currency: string;
  disclaimer: string;
}

export interface RosterNeed {
  id: string;
  label: string;
  positionGroup: PositionGroup;
  priority: NeedPriority;
  reason: string;
}

export interface RiskHeatmapRow {
  positionGroup: PositionGroup;
  GREEN: number;
  YELLOW: number;
  RED: number;
}

export interface KeyRisk {
  playerId: string;
  name: string;
  riskColor: RiskColor;
  drivers: ("injury" | "transfer" | "academics")[];
}

export interface RiskHeatmap {
  byPositionGroup: RiskHeatmapRow[];
  keyRisks: KeyRisk[];
}

export type PositionAllocations = Record<PositionGroup, number>;

export interface BudgetGuardrails {
  maxPerPlayer: number;
  maxPerPositionPercent: number;
}

export interface ForecastDeparture {
  id: string;
  name: string;
  position: string;
  positionGroup: PositionGroup;
  estimatedCost: number;
  role: RosterRole;
  reason: "GRADUATION" | "ELIGIBILITY" | "TRANSFER_RISK";
}

export interface ForecastYear {
  label: string;
  projectedSpend: number;
  returningCount: number;
  expectedDepartures: number;
  topDepartureDrivers: string[];
  departures: ForecastDeparture[];
  gapsByGroup: Partial<Record<PositionGroup, number>>;
  notes: string[];
}

export interface BudgetForecast {
  inflationRate: number;
  year1: ForecastYear;
  year2: ForecastYear;
  year3: ForecastYear;
}

export interface Budget {
  totalBudget: number;
  allocations: PositionAllocations;
  guardrails: BudgetGuardrails;
}

export interface ContactMethod {
  type: "email" | "phone" | "twitter";
  value: string;
  visibility: ContactVisibility;
}

export interface Coach {
  id: string;
  name: string;
  roleTitle: string;
  roleType: CoachRoleType;
  program: string;
  level: CoachLevel;
  state: string;
  verificationStatus: VerificationStatus;
  contactMethods: ContactMethod[];
  bio?: string;
  yearsExperience?: number;
}

export interface ContactAccessRequest {
  id: string;
  coachId: string;
  requesterId: string;
  ts: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  reason?: string;
}

export interface OutreachLog {
  id: string;
  coachId: string;
  mode: "email" | "sms";
  ts: string;
  draftContent: string;
}

import type { BeforeAfterState as BeforeAfterStateType } from './beforeAfter';
import type { GeneratedReport, FilmTimelineFilters, PlayOverlays } from './film';

export interface FilmUIState {
  filmTimelineFilters: FilmTimelineFilters;
  cutupPlays: string[];
  generatedReport: GeneratedReport | null;
  selectedFilmId: string | null;
  selectedPlayId: string | null;
  playOverlays: PlayOverlays;
}

export interface AppState {
  demoAuthed: boolean;
  demoRole: Role | null;
  programId: string | null;
  flags: FeatureFlags;
  tiers: Tiers;
  players: Player[];
  events: DemoEvent[];
  forecast: BudgetForecast;
  tasks: Task[];
  userList: DemoUser[];
  programDNA: ProgramDNA;
  roster: RosterPlayer[];
  rosterMeta: RosterMeta;
  needs: RosterNeed[];
  budget: Budget;
  riskHeatmap: RiskHeatmap;
  selectedNeedId: string | null;
  selectedProspectId: string | null;
  coaches: Coach[];
  contactAccessRequests: ContactAccessRequest[];
  outreachLogs: OutreachLog[];
  uiMode: UIMode;
  wowScenario: WowScenario;
  wowModalOpen: boolean;
  beforeAfter: BeforeAfterStateType | null;
  // Film Intelligence state
  filmUI: FilmUIState;
}
```

---

## 12. Edge Functions

### `supabase/functions/ops-gm-chat/index.ts`
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
```

---

## 13. Database Migrations

Run these SQL migrations in your new project's backend:

### Migration 1: Core Tables
```sql
-- Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create seasons table
CREATE TABLE public.seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  program_id UUID REFERENCES public.programs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
```

### Migration 2: Player Tables
```sql
-- Create fb_players table
CREATE TABLE public.fb_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT NOT NULL,
  position_group TEXT NOT NULL,
  class_year TEXT,
  height_inches INTEGER,
  weight_lbs INTEGER,
  status TEXT DEFAULT 'active',
  program_id UUID REFERENCES public.programs(id),
  external_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.fb_players ENABLE ROW LEVEL SECURITY;
```

### Migration 3: RevShare Tables
```sql
-- Create fb_revshare_pools table
CREATE TABLE public.fb_revshare_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  pool_amount NUMERIC NOT NULL,
  reserved_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create fb_revshare_policies table
CREATE TABLE public.fb_revshare_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES public.programs(id),
  season_id UUID REFERENCES public.seasons(id),
  name TEXT DEFAULT 'Default Policy',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  weights JSONB NOT NULL,
  position_multipliers JSONB NOT NULL,
  guardrails JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.fb_revshare_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_revshare_policies ENABLE ROW LEVEL SECURITY;
```

---

## Quick Setup Checklist

1. ✅ Create new Lovable project
2. ✅ Enable Lovable Cloud (backend)
3. ✅ Run database migrations
4. ✅ Copy `index.html` content
5. ✅ Copy `components.json` content
6. ✅ Copy all `src/` files
7. ✅ Copy edge function to `supabase/functions/ops-gm-chat/`
8. ✅ Install dependencies (auto-handled by Lovable)
9. ✅ Test demo login flow

---

## Dependencies

These packages will be auto-installed when you paste the code:

- @tanstack/react-query
- react-router-dom
- zustand
- recharts
- date-fns
- lucide-react
- sonner
- class-variance-authority
- clsx
- tailwind-merge
- @radix-ui/* (various)
- @react-three/fiber
- @react-three/drei
- three

---

**Note:** Due to file size constraints, this export contains the most critical files. For remaining pages and components not shown here, reference the original project or use the shell script `scripts/export-gridiron-ops.sh` to create a complete ZIP export.
