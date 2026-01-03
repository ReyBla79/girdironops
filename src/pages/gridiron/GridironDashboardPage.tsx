import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { runFootballValuation } from "@/lib/footballValueEngine";
import { Link } from "react-router-dom";

function getCtx() {
  return {
    programId: localStorage.getItem("gridiron_programId") || "",
    seasonId: localStorage.getItem("gridiron_seasonId") || "",
    policyId: localStorage.getItem("gridiron_policyId") || "",
  };
}

export default function GridironDashboardPage() {
  const ctx = useMemo(getCtx, []);
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<any[]>([]);

  async function loadSnapshots() {
    if (!ctx.programId || !ctx.seasonId || !ctx.policyId) return;
    const { data, error } = await supabase
      .from("fb_value_snapshots")
      .select(`
        *,
        fb_players:player_id ( first_name, last_name, position, position_group )
      `)
      .eq("program_id", ctx.programId)
      .eq("season_id", ctx.seasonId)
      .eq("policy_id", ctx.policyId)
      .order("share_pct", { ascending: false });
    if (error) return setStatus(error.message);
    setRows(data || []);
  }

  useEffect(() => {
    loadSnapshots().catch((err) => setStatus(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runEngine() {
    if (!ctx.programId || !ctx.seasonId || !ctx.policyId) {
      return setStatus("Missing context. Go to Setup and Save Context.");
    }
    setStatus("Running valuation engine...");
    try {
      const res = await runFootballValuation({
        programId: ctx.programId,
        seasonId: ctx.seasonId,
        policyId: ctx.policyId,
      });
      setStatus(`Engine complete. Inserted ${res.inserted} rows.`);
      await loadSnapshots();
    } catch (e: any) {
      setStatus(e.message || "Engine failed.");
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Gridiron Ops — Revenue Share Dashboard</h1>
      <p>Run the engine to generate a budget-constrained allocation range per athlete.</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <Link to="/gridiron/setup">Setup</Link>
        <Link to="/gridiron/roster/intake">Roster Intake</Link>
        <Link to="/gridiron/roster/usage">Usage</Link>
        <Link to="/gridiron/roster/grades">Grades</Link>
        <button onClick={runEngine}>Run Baseline Valuation</button>
      </div>
      <p style={{ opacity: 0.75 }}>
        Context: programId=<code>{ctx.programId || "missing"}</code> seasonId=<code>{ctx.seasonId || "missing"}</code> policyId=<code>{ctx.policyId || "missing"}</code>
      </p>
      {status ? <p><b>Status:</b> {status}</p> : null}
      <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7f7f7" }}>
              <th style={{ textAlign: "left", padding: 10 }}>Player</th>
              <th style={{ padding: 10 }}>Share %</th>
              <th style={{ padding: 10 }}>Low</th>
              <th style={{ padding: 10 }}>Mid</th>
              <th style={{ padding: 10 }}>High</th>
              <th style={{ padding: 10 }}>Conf</th>
              <th style={{ textAlign: "left", padding: 10 }}>Drivers</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const p = (r as any).fb_players || {};
              const rationale = r.rationale || {};
              return (
                <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 10 }}>
                    <div><b>{p.last_name}, {p.first_name}</b></div>
                    <div style={{ opacity: 0.75 }}>{p.position} • {p.position_group}</div>
                  </td>
                  <td style={{ padding: 10, textAlign: "center" }}>{(Number(r.share_pct) * 100).toFixed(2)}%</td>
                  <td style={{ padding: 10, textAlign: "right" }}>${Number(r.dollars_low).toLocaleString()}</td>
                  <td style={{ padding: 10, textAlign: "right" }}>${Number(r.dollars_mid).toLocaleString()}</td>
                  <td style={{ padding: 10, textAlign: "right" }}>${Number(r.dollars_high).toLocaleString()}</td>
                  <td style={{ padding: 10, textAlign: "center" }}>{Number(r.confidence).toFixed(0)}</td>
                  <td style={{ padding: 10, fontSize: 12, opacity: 0.85 }}>
                    Grade: {rationale.overallGrade ?? 0} • Snaps: {rationale.snaps ?? 0} • Lev: {rationale.leverageSnaps ?? 0} • PosMult: {rationale.posMultiplier ?? 1}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 12, opacity: 0.7 }}>
                  No snapshots yet. Enter roster + usage + grades, then click "Run Baseline Valuation."
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
