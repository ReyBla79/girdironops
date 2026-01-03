import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { runScenario } from "@/lib/scenarioEngine";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Play, FlaskConical, UserCog } from "lucide-react";

function getCtx() {
  return {
    programId: localStorage.getItem("gridiron_programId") || "",
    seasonId: localStorage.getItem("gridiron_seasonId") || "",
    policyId: localStorage.getItem("gridiron_policyId") || "",
  };
}

function uid() {
  return "temp_" + Math.random().toString(16).slice(2);
}

export default function ScenarioLab() {
  const ctx = useMemo(getCtx, []);
  const [status, setStatus] = useState("");
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [scenarioId, setScenarioId] = useState<string>("");
  const [scenarioName, setScenarioName] = useState("Scenario: Portal LT + Nickel CB");
  const [notes, setNotes] = useState("");
  const [poolOverride, setPoolOverride] = useState<number | "">("");
  const [reservedOverride, setReservedOverride] = useState<number | "">("");
  const [players, setPlayers] = useState<any[]>([]);
  const [mutations, setMutations] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [removePlayerId, setRemovePlayerId] = useState("");

  // Add-player form (scenario-only player)
  const [addFirst, setAddFirst] = useState("Portal");
  const [addLast, setAddLast] = useState("LT");
  const [addPosGroup, setAddPosGroup] = useState("OL");
  const [addPos, setAddPos] = useState("LT");
  const [addSnaps, setAddSnaps] = useState(700);
  const [addLev, setAddLev] = useState(180);
  const [addGames, setAddGames] = useState(12);
  const [addGrade, setAddGrade] = useState(82);
  const [addRole, setAddRole] = useState("STARTER");
  const [addRisk, setAddRisk] = useState("HIGH");

  // Update selected player
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  // Usage patch
  const [uGames, setUGames] = useState<number>(12);
  const [uSnaps, setUSnaps] = useState<number>(500);
  const [uLev, setULev] = useState<number>(120);
  const [uOff, setUOff] = useState<number>(0);
  const [uDef, setUDef] = useState<number>(0);
  const [uSt, setUSt] = useState<number>(0);

  // Grade patch
  const [gOverall, setGOverall] = useState<number>(80);
  const [gNotes, setGNotes] = useState<string>("");

  // Role patch
  const [rRole, setRRole] = useState<string>("ROTATION");
  const [rDepth, setRDepth] = useState<number>(2);
  const [rRisk, setRRisk] = useState<string>("MED");

  // When selecting a player, preload current values from DB
  async function preloadPlayerInputs(playerId: string) {
    if (!playerId || !ctx.seasonId) return;
    setStatus("Loading current player inputs...");

    // usage
    const { data: usage } = await supabase
      .from("fb_player_season_usage")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", ctx.seasonId)
      .maybeSingle();
    setUGames(Number(usage?.games_played ?? 0));
    setUSnaps(Number(usage?.snaps ?? 0));
    setUOff(Number(usage?.snaps_offense ?? 0));
    setUDef(Number(usage?.snaps_defense ?? 0));
    setUSt(Number(usage?.snaps_st ?? 0));
    setULev(Number(usage?.leverage_snaps ?? 0));

    // grade
    const { data: grade } = await supabase
      .from("fb_player_grades")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", ctx.seasonId)
      .maybeSingle();
    setGOverall(Number(grade?.overall_grade ?? 0));
    setGNotes(String(grade?.notes ?? ""));

    // role
    const { data: role } = await supabase
      .from("fb_player_roles")
      .select("*")
      .eq("player_id", playerId)
      .eq("season_id", ctx.seasonId)
      .maybeSingle();
    setRRole(String(role?.role ?? "ROTATION").toUpperCase());
    setRDepth(Number(role?.depth_rank ?? 2));
    setRRisk(String(role?.replacement_risk ?? "MED").toUpperCase());

    setStatus("Player inputs loaded.");
  }

  useEffect(() => {
    (async () => {
      if (!ctx.programId || !ctx.seasonId || !ctx.policyId) return;
      const { data: ps } = await supabase
        .from("fb_players")
        .select("*")
        .eq("program_id", ctx.programId)
        .order("last_name");
      setPlayers(ps || []);

      const { data: sc } = await (supabase as any)
        .from("fb_scenarios")
        .select("*")
        .eq("program_id", ctx.programId)
        .eq("season_id", ctx.seasonId)
        .eq("policy_id", ctx.policyId)
        .order("created_at", { ascending: false });
      setScenarios(sc || []);
    })();
  }, [ctx.programId, ctx.seasonId, ctx.policyId]);

  async function createScenario() {
    if (!ctx.programId || !ctx.seasonId || !ctx.policyId) {
      return setStatus("Missing context. Go to Setup first.");
    }
    setStatus("Creating scenario...");
    const { data, error } = await (supabase as any)
      .from("fb_scenarios")
      .insert({
        program_id: ctx.programId,
        season_id: ctx.seasonId,
        policy_id: ctx.policyId,
        name: scenarioName,
        notes,
        pool_override: poolOverride === "" ? null : Number(poolOverride),
        reserved_override: reservedOverride === "" ? null : Number(reservedOverride),
      })
      .select("*")
      .single();
    if (error) return setStatus(error.message);
    setScenarioId(data.id);
    setScenarios((prev) => [data, ...prev]);
    setStatus("Scenario created. Now add mutations.");
    setMutations([]);
    setResult(null);
  }

  async function loadScenario(id: string) {
    setScenarioId(id);
    setStatus("Loading scenario...");
    setResult(null);
    const { data: scen, error: sErr } = await (supabase as any)
      .from("fb_scenarios")
      .select("*")
      .eq("id", id)
      .single();
    if (sErr) return setStatus(sErr.message);
    setScenarioName(scen.name);
    setNotes(scen.notes || "");
    setPoolOverride(scen.pool_override ?? "");
    setReservedOverride(scen.reserved_override ?? "");

    const { data: muts } = await (supabase as any)
      .from("fb_scenario_mutations")
      .select("*")
      .eq("scenario_id", id)
      .order("created_at", { ascending: true });
    setMutations(muts || []);

    const { data: res } = await (supabase as any)
      .from("fb_scenario_results")
      .select("*")
      .eq("scenario_id", id)
      .maybeSingle();
    setResult(res?.results || null);
    setStatus("Scenario loaded.");
  }

  async function addMutation(type: string, payload: any) {
    if (!scenarioId) return setStatus("Create or select a scenario first.");
    const { data, error } = await (supabase as any)
      .from("fb_scenario_mutations")
      .insert({ scenario_id: scenarioId, type, payload })
      .select("*")
      .single();
    if (error) return setStatus(error.message);
    setMutations((prev) => [...prev, data]);
    setStatus("Mutation added.");
  }

  async function removeMutation(mutationId: string) {
    await (supabase as any).from("fb_scenario_mutations").delete().eq("id", mutationId);
    setMutations((prev) => prev.filter((m) => m.id !== mutationId));
  }

  async function run() {
    if (!scenarioId) return setStatus("Pick a scenario first.");
    setStatus("Running scenario...");
    try {
      const res = await runScenario({
        scenarioId,
        programId: ctx.programId,
        seasonId: ctx.seasonId,
        policyId: ctx.policyId,
      });
      setResult(res);
      setStatus("Scenario complete.");
    } catch (e: any) {
      setStatus(e.message || "Scenario failed.");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Scenario Lab</h1>
            <p className="text-muted-foreground text-sm">
              Simulate roster moves, usage/grade/role changes, and compare baseline vs scenario allocations
            </p>
          </div>
        </div>
        <Badge variant="secondary">V2.0</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/gridiron/roster">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/gridiron/setup">Setup</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/gridiron/roster/intake">Roster Intake</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/gridiron/roster/usage">Usage</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/gridiron/roster/grades">Grades</Link>
        </Button>
      </div>

      {status && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <strong>Status:</strong> {status}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Create/Select Scenario */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create Scenario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Scenario name"
            />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                value={poolOverride as any}
                onChange={(e) =>
                  setPoolOverride(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Pool override"
              />
              <Input
                type="number"
                value={reservedOverride as any}
                onChange={(e) =>
                  setReservedOverride(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Reserved override"
              />
            </div>
            <Button onClick={createScenario} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Existing Scenarios</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => loadScenario(s.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      scenarioId === s.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.notes || "—"}</div>
                  </button>
                ))}
                {scenarios.length === 0 && (
                  <p className="text-muted-foreground text-sm">No scenarios yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Mutations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mutations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Portal Player */}
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Quick Add: Portal Player (Scenario-only)</h4>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  value={addFirst}
                  onChange={(e) => setAddFirst(e.target.value)}
                  placeholder="First"
                />
                <Input
                  value={addLast}
                  onChange={(e) => setAddLast(e.target.value)}
                  placeholder="Last"
                />
                <Input
                  value={addPosGroup}
                  onChange={(e) => setAddPosGroup(e.target.value.toUpperCase())}
                  placeholder="Pos Group"
                />
                <Input
                  value={addPos}
                  onChange={(e) => setAddPos(e.target.value.toUpperCase())}
                  placeholder="Position"
                />
                <Input
                  type="number"
                  value={addGames}
                  onChange={(e) => setAddGames(Number(e.target.value))}
                  placeholder="Games"
                />
                <Input
                  type="number"
                  value={addSnaps}
                  onChange={(e) => setAddSnaps(Number(e.target.value))}
                  placeholder="Snaps"
                />
                <Input
                  type="number"
                  value={addLev}
                  onChange={(e) => setAddLev(Number(e.target.value))}
                  placeholder="Lev Snaps"
                />
                <Input
                  type="number"
                  value={addGrade}
                  onChange={(e) => setAddGrade(Number(e.target.value))}
                  placeholder="Grade"
                />
                <Input
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value.toUpperCase())}
                  placeholder="Role"
                />
                <Input
                  value={addRisk}
                  onChange={(e) => setAddRisk(e.target.value.toUpperCase())}
                  placeholder="Risk"
                />
              </div>
              <Button
                size="sm"
                onClick={() =>
                  addMutation("ADD_PLAYER", {
                    temp_id: uid(),
                    first_name: addFirst,
                    last_name: addLast,
                    position_group: addPosGroup,
                    position: addPos,
                    usage: {
                      games_played: addGames,
                      snaps: addSnaps,
                      leverage_snaps: addLev,
                      snaps_offense: 0,
                      snaps_defense: 0,
                      snaps_st: 0,
                    },
                    grade: { overall_grade: addGrade },
                    role: { role: addRole, replacement_risk: addRisk, depth_rank: 1 },
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Portal Player
              </Button>
            </div>

            {/* Remove Player */}
            <div className="p-4 border rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Remove Existing Player</h4>
              <Select value={removePlayerId} onValueChange={setRemovePlayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.last_name}, {p.first_name} — {p.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!removePlayerId) return;
                  addMutation("REMOVE_PLAYER", { player_id: removePlayerId });
                  setRemovePlayerId("");
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove Player
              </Button>
            </div>

            {/* Update Existing Player */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <h4 className="font-medium text-sm">Update Existing Player</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Pick a player, auto-load current inputs, then add mutations.
              </p>
              <Select
                value={selectedPlayerId}
                onValueChange={(id) => {
                  setSelectedPlayerId(id);
                  preloadPlayerInputs(id).catch((err) => setStatus(err.message));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select player..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.last_name}, {p.first_name} — {p.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Usage patch */}
              <div className="p-3 border rounded-lg space-y-2">
                <span className="font-medium text-xs">Update Usage</span>
                <div className="grid grid-cols-6 gap-2">
                  <Input type="number" value={uGames} onChange={(e) => setUGames(Number(e.target.value))} placeholder="Games" />
                  <Input type="number" value={uSnaps} onChange={(e) => setUSnaps(Number(e.target.value))} placeholder="Snaps" />
                  <Input type="number" value={uOff} onChange={(e) => setUOff(Number(e.target.value))} placeholder="Off" />
                  <Input type="number" value={uDef} onChange={(e) => setUDef(Number(e.target.value))} placeholder="Def" />
                  <Input type="number" value={uSt} onChange={(e) => setUSt(Number(e.target.value))} placeholder="ST" />
                  <Input type="number" value={uLev} onChange={(e) => setULev(Number(e.target.value))} placeholder="Leverage" />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (!selectedPlayerId) return setStatus("Select a player first.");
                    addMutation("UPDATE_USAGE", {
                      player_id: selectedPlayerId,
                      patch: {
                        games_played: uGames,
                        snaps: uSnaps,
                        snaps_offense: uOff,
                        snaps_defense: uDef,
                        snaps_st: uSt,
                        leverage_snaps: uLev,
                      },
                    });
                  }}
                >
                  Add Usage Mutation
                </Button>
              </div>

              {/* Grade patch */}
              <div className="p-3 border rounded-lg space-y-2">
                <span className="font-medium text-xs">Update Grade</span>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" value={gOverall} onChange={(e) => setGOverall(Number(e.target.value))} placeholder="Overall (0-100)" />
                  <Input className="col-span-2" value={gNotes} onChange={(e) => setGNotes(e.target.value)} placeholder="Notes (optional)" />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (!selectedPlayerId) return setStatus("Select a player first.");
                    addMutation("UPDATE_GRADE", {
                      player_id: selectedPlayerId,
                      patch: {
                        overall_grade: gOverall,
                        notes: gNotes || null,
                      },
                    });
                  }}
                >
                  Add Grade Mutation
                </Button>
              </div>

              {/* Role patch */}
              <div className="p-3 border rounded-lg space-y-2">
                <span className="font-medium text-xs">Update Role</span>
                <div className="grid grid-cols-3 gap-2">
                  <Input value={rRole} onChange={(e) => setRRole(e.target.value.toUpperCase())} placeholder="Role" />
                  <Input type="number" value={rDepth} onChange={(e) => setRDepth(Number(e.target.value))} placeholder="Depth" />
                  <Input value={rRisk} onChange={(e) => setRRisk(e.target.value.toUpperCase())} placeholder="Risk" />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (!selectedPlayerId) return setStatus("Select a player first.");
                    addMutation("UPDATE_ROLE", {
                      player_id: selectedPlayerId,
                      patch: {
                        role: rRole,
                        depth_rank: rDepth,
                        replacement_risk: rRisk,
                      },
                    });
                  }}
                >
                  Add Role Mutation
                </Button>
              </div>
            </div>

            {/* Current Mutations */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Current Mutations</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mutations.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {m.type}
                      </Badge>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {JSON.stringify(m.payload, null, 2)}
                      </pre>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeMutation(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {mutations.length === 0 && (
                  <p className="text-muted-foreground text-sm">No mutations yet.</p>
                )}
              </div>
            </div>

            <Button onClick={run} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Run Scenario
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <p className="text-muted-foreground">Run a scenario to generate results.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Baseline</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      Pool: ${Number(result.baseline_summary.poolAmount).toLocaleString()}
                    </div>
                    <div>
                      Allocatable: $
                      {Number(result.baseline_summary.allocatable).toLocaleString()}
                    </div>
                    <div>
                      Top: {result.baseline_summary.topPlayer} (
                      {(Number(result.baseline_summary.topSharePct) * 100).toFixed(2)}%)
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2">Scenario</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      Pool: ${Number(result.scenario_summary.poolAmount).toLocaleString()}
                    </div>
                    <div>
                      Allocatable: $
                      {Number(result.scenario_summary.allocatable).toLocaleString()}
                    </div>
                    <div>
                      Top: {result.scenario_summary.topPlayer} (
                      {(Number(result.scenario_summary.topSharePct) * 100).toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Changes */}
              <div className="overflow-x-auto">
                <h4 className="font-semibold mb-3">Top Changes (by $ mid delta)</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-right">Baseline Mid</TableHead>
                      <TableHead className="text-right">Scenario Mid</TableHead>
                      <TableHead className="text-right">Δ Mid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.diffs_top.map((d: any) => (
                      <TableRow key={d.player_id}>
                        <TableCell>
                          <span className="font-medium">{d.player_name}</span>{" "}
                          <span className="text-muted-foreground">({d.position})</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{d.change_type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(d.baseline_mid).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(d.scenario_mid).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={d.delta_mid >= 0 ? "text-green-600" : "text-red-600"}>
                            {d.delta_mid >= 0 ? "+" : "-"}$
                            {Math.abs(Number(d.delta_mid)).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-3 text-sm text-muted-foreground">
                  Tip: You can stack mutations (example: remove QB1, then update WR1 usage, then add portal QB).
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
