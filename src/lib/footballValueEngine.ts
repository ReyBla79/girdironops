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

/**
 * Calculate individual player score using the multiplicative formula
 */
export function calculatePlayerScore(
  player: FootballPlayerInput,
  teamTotalSnaps: number,
  weights: PolicyWeights,
  positionMultipliers: PolicyMultipliers
): PlayerScore {
  // Normalize impact (grade 0-100 to 0-1)
  const impact = Math.min(Math.max(player.overallGrade / 100, 0), 1);

  // Calculate availability (snaps / team_total, clamped 0-1)
  const availability = teamTotalSnaps > 0 
    ? Math.min(Math.max(player.snaps / teamTotalSnaps, 0), 1)
    : 0;

  // Calculate leverage (leverage_snaps / snaps, clamped 0-1)
  const leverage = player.snaps > 0
    ? Math.min(Math.max(player.leverageSnaps / player.snaps, 0), 1)
    : 0;

  // Get scarcity multiplier
  const scarcity = SCARCITY_MULTIPLIERS[player.replacementRisk] || 1.0;

  // Get position multiplier
  const positionMultiplier = positionMultipliers[player.position] || 1.0;

  // Apply multiplicative formula with exponents
  // total = (impact^wI) * (availability^wA) * (leverage^wL) * (scarcity^wS) * position_multiplier
  // Using (value + 0.01) to avoid zero issues with exponents
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
 * Run the full value engine for a roster
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

  // Calculate team total snaps
  const teamTotalSnaps = players.reduce((sum, p) => sum + p.snaps, 0);

  // Calculate raw scores for all players
  const scores = players.map(player => 
    calculatePlayerScore(player, teamTotalSnaps, weights, positionMultipliers)
  );

  // Sum all scores for percentage calculation
  const totalScore = scores.reduce((sum, s) => sum + s.rawScore, 0);

  // Available pool after reserve
  const availablePool = poolAmount - reservedAmount;

  // Convert to final results with dollars
  const results: ValueResult[] = scores.map(score => {
    const player = players.find(p => p.playerId === score.playerId)!;
    
    // Calculate share percentage
    let sharePct = totalScore > 0 ? (score.rawScore / totalScore) : 0;

    // Apply guardrails
    if (sharePct > guardrails.max_pct_per_player) {
      sharePct = guardrails.max_pct_per_player;
    }

    // Calculate dollar amounts
    const dollarsMid = sharePct * availablePool;
    const dollarsLow = dollarsMid * 0.85;
    const dollarsHigh = dollarsMid * 1.15;

    // Confidence based on data completeness
    let confidence = 75;
    if (player.snaps > 0) confidence += 10;
    if (player.overallGrade > 0) confidence += 10;
    if (player.leverageSnaps > 0) confidence += 5;

    return {
      playerId: score.playerId,
      totalScore: score.rawScore,
      sharePct: sharePct * 100, // Store as percentage (e.g., 5.25 for 5.25%)
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

  // Sort by share percentage descending
  return results.sort((a, b) => b.sharePct - a.sharePct);
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
