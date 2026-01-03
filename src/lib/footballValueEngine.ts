import { supabase } from "@/integrations/supabase/client";

/**
 * Football Value Engine V1
 * 
 * Components:
 * - Impact = overall_grade (0–100 normalized to 0–1)
 * - Availability = snaps / team_total_snaps (clamped)
 * - Leverage = leverage_snaps / snaps (clamped)
 * - Scarcity = replacement_risk multiplier (LOW 0.90, MED 1.00, HIGH 1.15)
 * - Position Multiplier = from policy
 * 
 * Formula (multiplicative):
 * total = (impact^wI) * (availability^wA) * (leverage^wL) * (scarcity^wS) * position_multiplier
 */

export interface FootballPlayerInput {
  playerId: string;
  position: string;
  overallGrade: number;       // 0-100
  snaps: number;
  leverageSnaps: number;
  replacementRisk: 'LOW' | 'MED' | 'HIGH';
}

export interface PolicyWeights {
  impact: number;      // Default 0.50
  availability: number; // Default 0.25
  leverage: number;    // Default 0.15
  scarcity: number;    // Default 0.10
}

export interface PolicyMultipliers {
  [position: string]: number;
}

export interface PolicyGuardrails {
  max_pct_per_player: number;
  min_pct_starter: number;
  position_cap_pct: number;
  max_share_pct?: number;
  floor_rotation_usd?: number;
}

export const DEFAULT_WEIGHTS: PolicyWeights = {
  impact: 0.50,
  availability: 0.25,
  leverage: 0.15,
  scarcity: 0.10,
};

export const DEFAULT_POSITION_MULTIPLIERS: PolicyMultipliers = {
  QB: 1.35,
  LT: 1.20,
  RT: 1.20,
  OT: 1.20,
  EDGE: 1.20,
  DE: 1.15,
  CB: 1.15,
  WR: 1.10,
  DT: 1.10,
  NT: 1.10,
  S: 1.05,
  FS: 1.05,
  SS: 1.05,
  LB: 1.05,
  MLB: 1.05,
  OLB: 1.05,
  ILB: 1.05,
  IOL: 1.05,
  OG: 1.05,
  LG: 1.05,
  RG: 1.05,
  C: 1.05,
  RB: 1.00,
  FB: 1.00,
  TE: 1.00,
  SLOT: 1.05,
  NB: 1.05,
  K: 0.95,
  P: 0.95,
  LS: 0.95,
};

export const DEFAULT_GUARDRAILS: PolicyGuardrails = {
  max_pct_per_player: 0.12,
  min_pct_starter: 0.02,
  position_cap_pct: 0.25,
  max_share_pct: 0.25,
  floor_rotation_usd: 15000,
};

export const SCARCITY_MULTIPLIERS = {
  LOW: 0.90,
  MED: 1.00,
  HIGH: 1.15,
} as const;

export interface PlayerScore {
  playerId: string;
  rawScore: number;
  components: {
    impact: number;
    availability: number;
    leverage: number;
    scarcity: number;
    positionMultiplier: number;
  };
}

export interface ValueResult {
  playerId: string;
  totalScore: number;
  sharePct: number;
  dollarsLow: number;
  dollarsMid: number;
  dollarsHigh: number;
  confidence: number;
  rationale: {
    overallGrade: number;
    snaps: number;
    leverageSnaps: number;
    replacementRisk: string;
    positionMultiplier: number;
    components: {
      impact: number;
      availability: number;
      leverage: number;
      scarcity: number;
    };
  };
}

// Helper functions
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

/**
 * Calculate individual player score using the multiplicative formula
 */
export function calculatePlayerScore(
  player: FootballPlayerInput,
  teamTotalSnaps: number,
  weights: PolicyWeights,
  positionMultipliers: PolicyMultipliers
): PlayerScore {
  const impact = Math.min(Math.max(player.overallGrade / 100, 0), 1);
  const availability = teamTotalSnaps > 0 
    ? Math.min(Math.max(player.snaps / teamTotalSnaps, 0), 1)
    : 0;
  const leverage = player.snaps > 0
    ? Math.min(Math.max(player.leverageSnaps / player.snaps, 0), 1)
    : 0;
  const scarcity = SCARCITY_MULTIPLIERS[player.replacementRisk] || 1.0;
  const positionMultiplier = positionMultipliers[player.position] || 1.0;

  const rawScore = 
    Math.pow(impact + 0.01, weights.impact) *
    Math.pow(availability + 0.01, weights.availability) *
    Math.pow(leverage + 0.01, weights.leverage) *
    Math.pow(scarcity, weights.scarcity) *
    positionMultiplier;

  return {
    playerId: player.playerId,
    rawScore,
    components: {
      impact,
      availability,
      leverage,
      scarcity,
      positionMultiplier,
    },
  };
}

/**
 * Run the full value engine for a roster (local calculation)
 */
export function runValueEngine(
  players: FootballPlayerInput[],
  poolAmount: number,
  reservedAmount: number,
  weights: PolicyWeights = DEFAULT_WEIGHTS,
  positionMultipliers: PolicyMultipliers = DEFAULT_POSITION_MULTIPLIERS,
  guardrails: PolicyGuardrails = DEFAULT_GUARDRAILS
): ValueResult[] {
  if (players.length === 0) return [];

  const teamTotalSnaps = players.reduce((sum, p) => sum + p.snaps, 0);
  const scores = players.map(player => 
    calculatePlayerScore(player, teamTotalSnaps, weights, positionMultipliers)
  );
  const totalScore = scores.reduce((sum, s) => sum + s.rawScore, 0);
  const availablePool = poolAmount - reservedAmount;

  const results: ValueResult[] = scores.map(score => {
    const player = players.find(p => p.playerId === score.playerId)!;
    let sharePct = totalScore > 0 ? (score.rawScore / totalScore) : 0;

    if (sharePct > guardrails.max_pct_per_player) {
      sharePct = guardrails.max_pct_per_player;
    }

    const dollarsMid = sharePct * availablePool;
    const dollarsLow = dollarsMid * 0.85;
    const dollarsHigh = dollarsMid * 1.15;

    let confidence = 75;
    if (player.snaps > 0) confidence += 10;
    if (player.overallGrade > 0) confidence += 10;
    if (player.leverageSnaps > 0) confidence += 5;

    return {
      playerId: score.playerId,
      totalScore: score.rawScore,
      sharePct: sharePct * 100,
      dollarsLow,
      dollarsMid,
      dollarsHigh,
      confidence: Math.min(confidence, 100),
      rationale: {
        overallGrade: player.overallGrade,
        snaps: player.snaps,
        leverageSnaps: player.leverageSnaps,
        replacementRisk: player.replacementRisk,
        positionMultiplier: score.components.positionMultiplier,
        components: {
          impact: score.components.impact,
          availability: score.components.availability,
          leverage: score.components.leverage,
          scarcity: score.components.scarcity,
        },
      },
    };
  });

  return results.sort((a, b) => b.sharePct - a.sharePct);
}

/**
 * Run full valuation from database and save snapshots
 */
export async function runFootballValuation(params: {
  programId: string;
  seasonId: string;
  policyId: string;
}) {
  const { programId, seasonId, policyId } = params;

  // 1) Load pool
  const { data: pool, error: poolErr } = await supabase
    .from("fb_revshare_pools")
    .select("*")
    .eq("program_id", programId)
    .eq("season_id", seasonId)
    .maybeSingle();

  if (poolErr) throw poolErr;
  if (!pool) throw new Error("No pool found for this program/season");

  const poolAmount = Number(pool.pool_amount || 0);
  const reservedAmount = Number(pool.reserved_amount || 0);
  const allocatable = Math.max(0, poolAmount - reservedAmount);

  // 2) Load policy
  const { data: policy, error: polErr } = await supabase
    .from("fb_revshare_policies")
    .select("*")
    .eq("id", policyId)
    .maybeSingle();

  if (polErr) throw polErr;
  if (!policy) throw new Error("Policy not found");

  const weights = policy.weights as unknown as PolicyWeights;
  const guardrails = policy.guardrails as unknown as PolicyGuardrails;
  const posMult = policy.position_multipliers as unknown as PolicyMultipliers;

  // 3) Load roster + usage + grades + roles
  const { data: players, error: pErr } = await supabase
    .from("fb_players")
    .select("*")
    .eq("program_id", programId);

  if (pErr) throw pErr;
  if (!players || players.length === 0) {
    return { ok: true, inserted: 0, message: "No players found for program." };
  }

  const playerIds = players.map((p) => p.id);

  const { data: usageRows, error: uErr } = await supabase
    .from("fb_player_season_usage")
    .select("*")
    .in("player_id", playerIds)
    .eq("season_id", seasonId);

  if (uErr) throw uErr;

  const { data: gradeRows, error: gErr } = await supabase
    .from("fb_player_grades")
    .select("*")
    .in("player_id", playerIds)
    .eq("season_id", seasonId);

  if (gErr) throw gErr;

  const { data: roleRows, error: rErr } = await supabase
    .from("fb_player_roles")
    .select("*")
    .in("player_id", playerIds)
    .eq("season_id", seasonId);

  if (rErr) throw rErr;

  const usageById = new Map<string, (typeof usageRows)[0]>();
  (usageRows || []).forEach((r) => usageById.set(r.player_id!, r));

  const gradeById = new Map<string, (typeof gradeRows)[0]>();
  (gradeRows || []).forEach((r) => gradeById.set(r.player_id!, r));

  const roleById = new Map<string, (typeof roleRows)[0]>();
  (roleRows || []).forEach((r) => roleById.set(r.player_id!, r));

  const teamTotalSnaps = (usageRows || []).reduce((sum, r) => sum + Number(r.snaps || 0), 0) || 1;

  // 4) Compute raw totals per player
  const computed = players.map((p) => {
    const usage = usageById.get(p.id) || ({} as any);
    const grade = gradeById.get(p.id) || ({} as any);
    const role = roleById.get(p.id) || ({} as any);

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
    const confidence = clamp((snapsFactor * 70 + gamesFactor * 30), 0, 100);

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
        replacementRisk: (role.replacement_risk || "MED").toUpperCase()
      },
      roleName
    };
  });

  const teamTotal = computed.reduce((s, x) => s + x.total, 0) || 1;

  // 5) Convert to share % and dollars (pre-guardrails)
  let rows = computed.map((x) => {
    const sharePct = clamp(x.total / teamTotal, 0, 1);
    const baseMid = sharePct * allocatable;
    const conf = x.confidence;
    const width = conf >= 75 ? 0.20 : conf >= 50 ? 0.30 : 0.40;
    const low = baseMid * (1 - width);
    const high = baseMid * (1 + width);

    return {
      program_id: programId,
      season_id: seasonId,
      policy_id: policyId,
      player_id: x.player.id,
      total_score: Number(x.total.toFixed(6)),
      share_pct: Number(sharePct.toFixed(4)),
      dollars_low: Number(low.toFixed(2)),
      dollars_mid: Number(baseMid.toFixed(2)),
      dollars_high: Number(high.toFixed(2)),
      confidence: Number(conf.toFixed(2)),
      rationale: x.rationale,
      __roleName: x.roleName
    };
  });

  // 6) Apply guardrails
  const maxShare = guardrails.max_share_pct ?? 0.25;
  const floorRotation = guardrails.floor_rotation_usd ?? 15000;

  // Cap shares
  rows = rows.map((r) => ({
    ...r,
    share_pct: Math.min(r.share_pct, maxShare),
  }));

  // Recompute dollars after share cap
  const shareSumAfterCap = rows.reduce((s, r) => s + r.share_pct, 0) || 1;
  rows = rows.map((r) => {
    const cappedShareNorm = r.share_pct / shareSumAfterCap;
    const mid = cappedShareNorm * allocatable;
    const conf = r.confidence;
    const width = conf >= 75 ? 0.20 : conf >= 50 ? 0.30 : 0.40;
    return {
      ...r,
      share_pct: Number(cappedShareNorm.toFixed(4)),
      dollars_mid: Number(mid.toFixed(2)),
      dollars_low: Number((mid * (1 - width)).toFixed(2)),
      dollars_high: Number((mid * (1 + width)).toFixed(2)),
    };
  });

  // Floors for rotation/starter
  const floorIds = rows
    .filter((r) => roleIsRotationOrHigher(r.__roleName))
    .map((r) => r.player_id);

  const floored = new Set<string>();
  let floorTotal = 0;

  rows = rows.map((r) => {
    if (floorIds.includes(r.player_id) && r.dollars_mid < floorRotation) {
      floored.add(r.player_id);
      floorTotal += (floorRotation - r.dollars_mid);
      const mid = floorRotation;
      const conf = r.confidence;
      const width = conf >= 75 ? 0.20 : conf >= 50 ? 0.30 : 0.40;
      return {
        ...r,
        dollars_mid: Number(mid.toFixed(2)),
        dollars_low: Number((mid * (1 - width)).toFixed(2)),
        dollars_high: Number((mid * (1 + width)).toFixed(2)),
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
      const width = conf >= 75 ? 0.20 : conf >= 50 ? 0.30 : 0.40;
      return {
        ...r,
        dollars_mid: Number(mid.toFixed(2)),
        dollars_low: Number((mid * (1 - width)).toFixed(2)),
        dollars_high: Number((mid * (1 + width)).toFixed(2)),
      };
    });
  }

  // Remove temp field
  const insertRows = rows.map(({ __roleName, ...rest }) => rest);

  // 7) Clear prior snapshots
  await supabase
    .from("fb_value_snapshots")
    .delete()
    .eq("program_id", programId)
    .eq("season_id", seasonId)
    .eq("policy_id", policyId);

  // 8) Insert new snapshots
  const { error: insErr } = await supabase
    .from("fb_value_snapshots")
    .insert(insertRows);

  if (insErr) throw insErr;

  return { ok: true, inserted: insertRows.length };
}

/**
 * CSV Template A: Roster Intake
 */
export const CSV_TEMPLATE_A_HEADER = 
  'first_name,last_name,position_group,position,class_year,height_inches,weight_lbs,status,role,depth_rank,replacement_risk,external_ref';

export const CSV_TEMPLATE_A_EXAMPLE = `John,Smith,QB,QB,Jr,74,210,ACTIVE,STARTER,1,MED,player_001
Mike,Johnson,WR,WR,Sr,72,185,ACTIVE,ROTATION,2,LOW,player_002`;

/**
 * CSV Template B: Usage + Grades
 */
export const CSV_TEMPLATE_B_HEADER = 
  'external_ref,games_played,snaps,snaps_offense,snaps_defense,snaps_st,leverage_snaps,overall_grade';

export const CSV_TEMPLATE_B_EXAMPLE = `player_001,12,450,450,0,0,120,82
player_002,12,380,380,0,0,95,75`;

/**
 * Parse CSV Template A (Roster)
 */
export function parseRosterCSV(csvContent: string): Array<{
  first_name: string;
  last_name: string;
  position_group: string;
  position: string;
  class_year: string;
  height_inches: number | null;
  weight_lbs: number | null;
  status: string;
  role: string;
  depth_rank: number;
  replacement_risk: string;
  external_ref: string;
}> {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  if (!header.includes('first_name') || !header.includes('last_name')) {
    throw new Error('Invalid CSV format. Expected roster columns.');
  }

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    return {
      first_name: cols[0] || '',
      last_name: cols[1] || '',
      position_group: cols[2] || 'QB',
      position: cols[3] || 'QB',
      class_year: cols[4] || 'Jr',
      height_inches: cols[5] ? parseInt(cols[5]) : null,
      weight_lbs: cols[6] ? parseInt(cols[6]) : null,
      status: cols[7] || 'ACTIVE',
      role: cols[8] || 'ROTATION',
      depth_rank: cols[9] ? parseInt(cols[9]) : 2,
      replacement_risk: cols[10] || 'MED',
      external_ref: cols[11] || '',
    };
  }).filter(row => row.first_name && row.last_name);
}

/**
 * Parse CSV Template B (Usage + Grades)
 */
export function parseUsageGradesCSV(csvContent: string): Array<{
  external_ref: string;
  games_played: number;
  snaps: number;
  snaps_offense: number;
  snaps_defense: number;
  snaps_st: number;
  leverage_snaps: number;
  overall_grade: number;
}> {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  if (!header.includes('external_ref')) {
    throw new Error('Invalid CSV format. Expected external_ref column.');
  }

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    return {
      external_ref: cols[0] || '',
      games_played: parseInt(cols[1]) || 0,
      snaps: parseInt(cols[2]) || 0,
      snaps_offense: parseInt(cols[3]) || 0,
      snaps_defense: parseInt(cols[4]) || 0,
      snaps_st: parseInt(cols[5]) || 0,
      leverage_snaps: parseInt(cols[6]) || 0,
      overall_grade: parseFloat(cols[7]) || 0,
    };
  }).filter(row => row.external_ref);
}
