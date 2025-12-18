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
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

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
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
export default App;
