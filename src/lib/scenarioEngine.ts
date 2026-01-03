import { supabase } from "@/integrations/supabase/client";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function powSafe(base: number, exp: number) {
  if (base <= 0) return 0;
  return Math.pow(base, exp);
}

function scarcityMultiplier(replacementRisk: string): number {
  const r = (replacementRisk || "MED").toUpperCase();
  if (r === "LOW") return 0.9;
  if (r === "HIGH") return 1.15;
  return 1.0;
}

function roleIsRotationOrHigher(role: string): boolean {
  const r = (role || "ROTATION").toUpperCase();
  return r === "STARTER" || r === "ROTATION";
}

type Weights = { impact: number; availability: number; leverage: number; scarcity: number };
type Guardrails = { max_share_pct: number; floor_rotation_usd: number };
type PositionMultipliers = Record<string, number>;
type PlayerRow = any;
type UsageRow = any;
type GradeRow = any;
type RoleRow = any;

export type Mutation =
  | { type: "REMOVE_PLAYER"; payload: { player_id: string } }
  | {
      type: "ADD_PLAYER";
      payload: {
        temp_id: string;
        first_name: string;
        last_name: string;
        position_group: string;
        position: string;
        class_year?: string;
        status?: string;
        usage?: Partial<UsageRow>;
        grade?: Partial<GradeRow>;
        role?: Partial<RoleRow>;
      };
    }
  | { type: "UPDATE_USAGE"; payload: { player_id: string; patch: Partial<UsageRow> } }
  | { type: "UPDATE_GRADE"; payload: { player_id: string; patch: Partial<GradeRow> } }
  | { type: "UPDATE_ROLE"; payload: { player_id: string; patch: Partial<RoleRow> } };

function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

function computeSnapshots(params: {
  programId: string;
  seasonId: string;
  policyId: string;
  poolAmount: number;
  reservedAmount: number;
  policy: { weights: Weights; guardrails: Guardrails; position_multipliers: PositionMultipliers };
  players: PlayerRow[];
  usageRows: UsageRow[];
  gradeRows: GradeRow[];
  roleRows: RoleRow[];
}) {
  const { programId, seasonId, policyId, poolAmount, reservedAmount, policy, players } = params;
  const allocatable = Math.max(0, poolAmount - reservedAmount);
  const weights = policy.weights;
  const guardrails = policy.guardrails;
  const posMult = policy.position_multipliers;

  const usageById = new Map<string, UsageRow>();
  params.usageRows.forEach((r: any) => usageById.set(r.player_id, r));
  const gradeById = new Map<string, GradeRow>();
  params.gradeRows.forEach((r: any) => gradeById.set(r.player_id, r));
  const roleById = new Map<string, RoleRow>();
  params.roleRows.forEach((r: any) => roleById.set(r.player_id, r));

  const teamTotalSnaps =
    params.usageRows.reduce((sum: number, r: any) => sum + Number(r.snaps || 0), 0) || 1;

  const computed = players.map((p: any) => {
    const usage = usageById.get(p.id) || {};
    const grade = gradeById.get(p.id) || {};
    const role = roleById.get(p.id) || {};

    const snaps = Number(usage.snaps || 0);
    const leverageSnaps = Number(usage.leverage_snaps || 0);
    const games = Number(usage.games_played || 0);
    const overallGrade = Number(grade.overall_grade || 0);

    const impact = clamp(overallGrade / 100, 0, 1);
    const availability = clamp(snaps / teamTotalSnaps, 0, 1);
    const leverage = snaps > 0 ? clamp(leverageSnaps / snaps, 0, 1) : 0;
    const scarcity = scarcityMultiplier(role.replacement_risk || "MED");

    const posKey = (p.position || "").toUpperCase();
    const posMultiplier = Number(posMult[posKey] ?? 1.0);

    const snapsFactor = clamp(snaps / 600, 0, 1);
    const gamesFactor = clamp(games / 12, 0, 1);
    const confidence = clamp(snapsFactor * 70 + gamesFactor * 30, 0, 100);

    const total =
      powSafe(impact, weights.impact) *
      powSafe(availability, weights.availability) *
      powSafe(leverage, weights.leverage) *
      powSafe(scarcity, weights.scarcity) *
      posMultiplier;

    const roleName = (role.role || "ROTATION").toUpperCase();

    return {
      player: p,
      total,
      confidence,
      roleName,
      rationale: {
        impact,
        availability,
        leverage,
        scarcity,
        posMultiplier,
        overallGrade,
        snaps,
        leverageSnaps,
        games,
        role: roleName,
        replacementRisk: (role.replacement_risk || "MED").toUpperCase(),
      },
    };
  });

  const teamTotal = computed.reduce((s, x) => s + x.total, 0) || 1;

  let rows = computed.map((x) => {
    const sharePct = clamp(x.total / teamTotal, 0, 1);
    const baseMid = sharePct * allocatable;
    const conf = x.confidence;
    const width = conf >= 75 ? 0.2 : conf >= 50 ? 0.3 : 0.4;

    return {
      program_id: programId,
      season_id: seasonId,
      policy_id: policyId,
      player_id: x.player.id,
      player_name: `${x.player.last_name}, ${x.player.first_name}`,
      position: x.player.position,
      position_group: x.player.position_group,
      role: x.rationale.role,
      total_score: Number(x.total.toFixed(6)),
      share_pct: Number(sharePct.toFixed(4)),
      dollars_low: Number((baseMid * (1 - width)).toFixed(2)),
      dollars_mid: Number(baseMid.toFixed(2)),
      dollars_high: Number((baseMid * (1 + width)).toFixed(2)),
      confidence: Number(conf.toFixed(2)),
      rationale: x.rationale,
    };
  });

  // Guardrails: cap share
  const maxShare = guardrails.max_share_pct ?? 0.25;
  rows = rows.map((r) => ({ ...r, share_pct: Math.min(r.share_pct, maxShare) }));

  // Renormalize shares after cap and recompute dollars
  const shareSumAfterCap = rows.reduce((s, r) => s + r.share_pct, 0) || 1;
  rows = rows.map((r) => {
    const cappedShareNorm = r.share_pct / shareSumAfterCap;
    const mid = cappedShareNorm * allocatable;
    const conf = r.confidence;
    const width = conf >= 75 ? 0.2 : conf >= 50 ? 0.3 : 0.4;
    return {
      ...r,
      share_pct: Number(cappedShareNorm.toFixed(4)),
      dollars_mid: Number(mid.toFixed(2)),
      dollars_low: Number((mid * (1 - width)).toFixed(2)),
      dollars_high: Number((mid * (1 + width)).toFixed(2)),
    };
  });

  // Floors for rotation/starter
  const floorRotation = guardrails.floor_rotation_usd ?? 15000;
  const floored = new Set<string>();
  let floorTotal = 0;

  rows = rows.map((r) => {
    if (roleIsRotationOrHigher(r.role) && r.dollars_mid < floorRotation) {
      floored.add(r.player_id);
      floorTotal += floorRotation - r.dollars_mid;
      const conf = r.confidence;
      const width = conf >= 75 ? 0.2 : conf >= 50 ? 0.3 : 0.4;
      return {
        ...r,
        dollars_mid: Number(floorRotation.toFixed(2)),
        dollars_low: Number((floorRotation * (1 - width)).toFixed(2)),
        dollars_high: Number((floorRotation * (1 + width)).toFixed(2)),
      };
    }
    return r;
  });

  if (floorTotal > 0) {
    const adjustable = rows.filter((r) => !floored.has(r.player_id));
    const adjustableTotal = adjustable.reduce((s, r) => s + r.dollars_mid, 0) || 1;
    rows = rows.map((r) => {
      if (floored.has(r.player_id)) return r;
      const reduction = (r.dollars_mid / adjustableTotal) * floorTotal;
      const mid = Math.max(0, r.dollars_mid - reduction);
      const conf = r.confidence;
      const width = conf >= 75 ? 0.2 : conf >= 50 ? 0.3 : 0.4;
      return {
        ...r,
        dollars_mid: Number(mid.toFixed(2)),
        dollars_low: Number((mid * (1 - width)).toFixed(2)),
        dollars_high: Number((mid * (1 + width)).toFixed(2)),
      };
    });
  }

  rows.sort((a, b) => b.share_pct - a.share_pct);

  const summary = {
    poolAmount,
    reservedAmount,
    allocatable,
    totalPlayers: rows.length,
    topSharePct: rows[0]?.share_pct ?? 0,
    topPlayer: rows[0]?.player_name ?? "",
  };

  return { rows, summary };
}

function applyMutations(params: {
  players: PlayerRow[];
  usageRows: UsageRow[];
  gradeRows: GradeRow[];
  roleRows: RoleRow[];
  mutations: Mutation[];
}) {
  const players = deepClone(params.players);
  const usageRows = deepClone(params.usageRows);
  const gradeRows = deepClone(params.gradeRows);
  const roleRows = deepClone(params.roleRows);

  const usageById = new Map<string, any>();
  usageRows.forEach((r: any) => usageById.set(r.player_id, r));
  const gradeById = new Map<string, any>();
  gradeRows.forEach((r: any) => gradeById.set(r.player_id, r));
  const roleById = new Map<string, any>();
  roleRows.forEach((r: any) => roleById.set(r.player_id, r));

  for (const m of params.mutations) {
    if (m.type === "REMOVE_PLAYER") {
      const id = m.payload.player_id;
      const idx = players.findIndex((p: any) => p.id === id);
      if (idx >= 0) players.splice(idx, 1);
      const uIdx = usageRows.findIndex((r: any) => r.player_id === id);
      if (uIdx >= 0) usageRows.splice(uIdx, 1);
      const gIdx = gradeRows.findIndex((r: any) => r.player_id === id);
      if (gIdx >= 0) gradeRows.splice(gIdx, 1);
      const rIdx = roleRows.findIndex((r: any) => r.player_id === id);
      if (rIdx >= 0) roleRows.splice(rIdx, 1);
    }

    if (m.type === "ADD_PLAYER") {
      const p = m.payload;
      const id = p.temp_id;
      players.push({
        id,
        program_id: "scenario",
        first_name: p.first_name,
        last_name: p.last_name,
        position_group: p.position_group,
        position: p.position,
        class_year: p.class_year ?? "",
        status: p.status ?? "ACTIVE",
      });
      const usage = { player_id: id, snaps: 0, leverage_snaps: 0, games_played: 0, ...p.usage, season_id: "scenario" };
      const grade = { player_id: id, overall_grade: 0, ...p.grade, season_id: "scenario" };
      const role = { player_id: id, role: "ROTATION", replacement_risk: "MED", depth_rank: 2, ...p.role, season_id: "scenario" };
      usageRows.push(usage);
      gradeRows.push(grade);
      roleRows.push(role);
      usageById.set(id, usage);
      gradeById.set(id, grade);
      roleById.set(id, role);
    }

    if (m.type === "UPDATE_USAGE") {
      const id = m.payload.player_id;
      const existing = usageById.get(id) || { player_id: id, snaps: 0, leverage_snaps: 0, games_played: 0 };
      const patched = { ...existing, ...m.payload.patch };
      usageById.set(id, patched);
      const idx = usageRows.findIndex((r: any) => r.player_id === id);
      if (idx >= 0) usageRows[idx] = patched;
      else usageRows.push(patched);
    }

    if (m.type === "UPDATE_GRADE") {
      const id = m.payload.player_id;
      const existing = gradeById.get(id) || { player_id: id, overall_grade: 0 };
      const patched = { ...existing, ...m.payload.patch };
      gradeById.set(id, patched);
      const idx = gradeRows.findIndex((r: any) => r.player_id === id);
      if (idx >= 0) gradeRows[idx] = patched;
      else gradeRows.push(patched);
    }

    if (m.type === "UPDATE_ROLE") {
      const id = m.payload.player_id;
      const existing = roleById.get(id) || { player_id: id, role: "ROTATION", replacement_risk: "MED", depth_rank: 2 };
      const patched = { ...existing, ...m.payload.patch };
      roleById.set(id, patched);
      const idx = roleRows.findIndex((r: any) => r.player_id === id);
      if (idx >= 0) roleRows[idx] = patched;
      else roleRows.push(patched);
    }
  }

  return { players, usageRows, gradeRows, roleRows };
}

function diffBaselineScenario(baselineRows: any[], scenarioRows: any[]) {
  const baseMap = new Map<string, any>();
  baselineRows.forEach((r) => baseMap.set(r.player_id, r));
  const scenMap = new Map<string, any>();
  scenarioRows.forEach((r) => scenMap.set(r.player_id, r));

  const allIds = new Set<string>([...baseMap.keys(), ...scenMap.keys()]);
  const diffs: any[] = [];

  for (const id of allIds) {
    const b = baseMap.get(id);
    const s = scenMap.get(id);

    if (b && !s) {
      diffs.push({
        player_id: id,
        player_name: b.player_name,
        position: b.position,
        change_type: "REMOVED",
        baseline_mid: b.dollars_mid,
        scenario_mid: 0,
        delta_mid: -b.dollars_mid,
        baseline_share: b.share_pct,
        scenario_share: 0,
        delta_share: -b.share_pct,
      });
      continue;
    }

    if (!b && s) {
      diffs.push({
        player_id: id,
        player_name: s.player_name,
        position: s.position,
        change_type: "ADDED",
        baseline_mid: 0,
        scenario_mid: s.dollars_mid,
        delta_mid: s.dollars_mid,
        baseline_share: 0,
        scenario_share: s.share_pct,
        delta_share: s.share_pct,
      });
      continue;
    }

    const deltaMid = Number((s.dollars_mid - b.dollars_mid).toFixed(2));
    const deltaShare = Number((s.share_pct - b.share_pct).toFixed(4));

    diffs.push({
      player_id: id,
      player_name: s.player_name,
      position: s.position,
      change_type: "CHANGED",
      baseline_mid: b.dollars_mid,
      scenario_mid: s.dollars_mid,
      delta_mid: deltaMid,
      baseline_share: b.share_pct,
      scenario_share: s.share_pct,
      delta_share: deltaShare,
    });
  }

  diffs.sort((a, b) => Math.abs(b.delta_mid) - Math.abs(a.delta_mid));
  return diffs;
}

export async function runScenario(params: {
  scenarioId: string;
  programId: string;
  seasonId: string;
  policyId: string;
}) {
  const { scenarioId, programId, seasonId, policyId } = params;

  // Load policy
  const { data: policyRow, error: polErr } = await supabase
    .from("fb_revshare_policies")
    .select("*")
    .eq("id", policyId)
    .single();
  if (polErr) throw polErr;

  // Load pool baseline
  const { data: poolRow, error: poolErr } = await supabase
    .from("fb_revshare_pools")
    .select("*")
    .eq("program_id", programId)
    .eq("season_id", seasonId)
    .single();
  if (poolErr) throw poolErr;

  // Load scenario
  const { data: scenRow, error: sErr } = await supabase
    .from("fb_scenarios")
    .select("*")
    .eq("id", scenarioId)
    .single();
  if (sErr) throw sErr;

  const poolAmountBaseline = Number(poolRow.pool_amount || 0);
  const reservedBaseline = Number(poolRow.reserved_amount || 0);
  const poolAmountScenario = scenRow.pool_override != null ? Number(scenRow.pool_override) : poolAmountBaseline;
  const reservedScenario = scenRow.reserved_override != null ? Number(scenRow.reserved_override) : reservedBaseline;

  // Load roster
  const { data: players, error: pErr } = await supabase
    .from("fb_players")
    .select("*")
    .eq("program_id", programId);
  if (pErr) throw pErr;

  const ids = (players || []).map((p: any) => p.id);
  const placeholderId = "00000000-0000-0000-0000-000000000000";

  const { data: usageRows, error: uErr } = await supabase
    .from("fb_player_season_usage")
    .select("*")
    .in("player_id", ids.length ? ids : [placeholderId])
    .eq("season_id", seasonId);
  if (uErr) throw uErr;

  const { data: gradeRows, error: gErr } = await supabase
    .from("fb_player_grades")
    .select("*")
    .in("player_id", ids.length ? ids : [placeholderId])
    .eq("season_id", seasonId);
  if (gErr) throw gErr;

  const { data: roleRows, error: rErr } = await supabase
    .from("fb_player_roles")
    .select("*")
    .in("player_id", ids.length ? ids : [placeholderId])
    .eq("season_id", seasonId);
  if (rErr) throw rErr;

  // Load mutations
  const { data: muts, error: mErr } = await supabase
    .from("fb_scenario_mutations")
    .select("*")
    .eq("scenario_id", scenarioId)
    .order("created_at", { ascending: true });
  if (mErr) throw mErr;

  const mutations: Mutation[] = (muts || []).map((m: any) => ({ type: m.type, payload: m.payload }));

  // Compute baseline
  const baseline = computeSnapshots({
    programId,
    seasonId,
    policyId,
    poolAmount: poolAmountBaseline,
    reservedAmount: reservedBaseline,
    policy: policyRow as any,
    players: players || [],
    usageRows: usageRows || [],
    gradeRows: gradeRows || [],
    roleRows: roleRows || [],
  });

  // Apply mutations and compute scenario
  const mutated = applyMutations({
    players: players || [],
    usageRows: usageRows || [],
    gradeRows: gradeRows || [],
    roleRows: roleRows || [],
    mutations,
  });

  const scenario = computeSnapshots({
    programId,
    seasonId,
    policyId,
    poolAmount: poolAmountScenario,
    reservedAmount: reservedScenario,
    policy: policyRow as any,
    players: mutated.players,
    usageRows: mutated.usageRows,
    gradeRows: mutated.gradeRows,
    roleRows: mutated.roleRows,
  });

  const diffs = diffBaselineScenario(baseline.rows, scenario.rows);

  const results = {
    generated_at: new Date().toISOString(),
    scenario: { id: scenarioId, name: scenRow.name, notes: scenRow.notes || "" },
    baseline_summary: baseline.summary,
    scenario_summary: scenario.summary,
    diffs_top: diffs.slice(0, 25),
    baseline_top: baseline.rows.slice(0, 25),
    scenario_top: scenario.rows.slice(0, 25),
  };

  // Save results (upsert)
  await supabase.from("fb_scenario_results").upsert({
    scenario_id: scenarioId,
    program_id: programId,
    season_id: seasonId,
    policy_id: policyId,
    results,
  });

  return results;
}
