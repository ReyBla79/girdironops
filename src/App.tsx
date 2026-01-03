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
