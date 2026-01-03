import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GridironSetupPage from "@/pages/gridiron/GridironSetupPage";
import RosterIntakePage from "@/pages/gridiron/RosterIntakePage";
import RosterUsagePage from "@/pages/gridiron/RosterUsagePage";
import RosterGradesPage from "@/pages/gridiron/RosterGradesPage";
import GridironDashboardPage from "@/pages/gridiron/GridironDashboardPage";
import ScenarioLab from "@/pages/gridiron/ScenarioLab";

export default function GridironRoutes() {
  return (
    <Routes>
      <Route path="/gridiron/setup" element={<GridironSetupPage />} />
      <Route path="/gridiron/roster/intake" element={<RosterIntakePage />} />
      <Route path="/gridiron/roster/usage" element={<RosterUsagePage />} />
      <Route path="/gridiron/roster/grades" element={<RosterGradesPage />} />
      <Route path="/gridiron/roster" element={<GridironDashboardPage />} />
      <Route path="/gridiron/scenarios" element={<ScenarioLab />} />
      <Route path="/gridiron" element={<Navigate to="/gridiron/setup" replace />} />
    </Routes>
  );
}
