import { CALCULATOR_CONFIG } from '@/demo/calculatorConfig';
import type { RosterPlayer, PositionGroup, RiskColor, RosterRole, NILBand, ForecastYear, BudgetForecast, RiskHeatmapRow } from '@/types';

const config = CALCULATOR_CONFIG;

// A) Player Cost (if estimatedCost missing)
export function calculatePlayerCost(player: {
  nilBand: NILBand;
  role: RosterRole;
  positionGroup: PositionGroup;
  estimatedCost?: number;
}): number {
  // Use existing cost if present
  if (player.estimatedCost !== undefined && player.estimatedCost > 0) {
    return player.estimatedCost;
  }

  const bandMid = config.nilBands[player.nilBand].mid;
  const roleMult = config.roleCostMultipliers[player.role];
  const posWeight = config.positionGroupBudgetWeights[player.positionGroup];
  
  const rawCost = bandMid * roleMult * posWeight;
  
  // Apply rounding: nearest $1,000
  const rounded = Math.round(rawCost / config.allocationAlgorithm.rounding.value) * config.allocationAlgorithm.rounding.value;
  
  // Clamp to guardrail
  return Math.min(rounded, config.budgetGuardrails.maxPerPlayer);
}

// B) Allocation by position group
export function calculateAllocationsByGroup(
  roster: RosterPlayer[],
  excludeSimRemoved = true
): Record<PositionGroup, number> {
  const activeRoster = excludeSimRemoved 
    ? roster.filter(p => !(p as any).simRemoved)
    : roster;

  const allocations: Record<PositionGroup, number> = {
    QB: 0, RB: 0, WR: 0, TE: 0, OL: 0, DL: 0, LB: 0, DB: 0, ST: 0
  };

  for (const player of activeRoster) {
    const cost = calculatePlayerCost(player);
    allocations[player.positionGroup] += cost;
  }

  return allocations;
}

export function calculateTotalAllocated(roster: RosterPlayer[], excludeSimRemoved = true): number {
  const allocations = calculateAllocationsByGroup(roster, excludeSimRemoved);
  return Object.values(allocations).reduce((sum, val) => sum + val, 0);
}

// C) Remaining budget
export function calculateRemainingBudget(roster: RosterPlayer[], excludeSimRemoved = true): {
  totalBudget: number;
  available: number;
  allocated: number;
  remaining: number;
  contingencyReserve: number;
} {
  const { totalNILBudget, contingencyReserve, treatReserveAsLocked } = config.budgetTotals;
  const allocated = calculateTotalAllocated(roster, excludeSimRemoved);
  
  const available = treatReserveAsLocked 
    ? totalNILBudget - contingencyReserve 
    : totalNILBudget;
  
  const remaining = available - allocated;

  return {
    totalBudget: totalNILBudget,
    available,
    allocated,
    remaining,
    contingencyReserve
  };
}

// D) Forecast Year N
export function calculateForecastYear(
  roster: RosterPlayer[],
  yearIndex: number, // 1, 2, or 3
  currentAllocated: number
): ForecastYear {
  const { inflationRateYoY, departures: depConfig, gapLogic } = config.forecasting;
  const asOfYear = config.asOfYear;
  
  // Graduation departures: players where gradYear <= asOfYear + yearIndex
  const graduatingPlayers = roster.filter(p => 
    p.gradYear <= asOfYear + yearIndex && !(p as any).simRemoved
  );
  
  // Expected transfer departures (deterministic)
  let expectedTransferCount = 0;
  const transferProbByGroup: Record<PositionGroup, number> = {
    QB: 0, RB: 0, WR: 0, TE: 0, OL: 0, DL: 0, LB: 0, DB: 0, ST: 0
  };

  for (const player of roster) {
    if ((player as any).simRemoved) continue;
    // Skip already graduating players from transfer calc
    if (player.gradYear <= asOfYear + yearIndex) continue;
    
    const baseProb = depConfig.transfer.baseTransferProbByRiskColor[player.riskColor];
    const roleMult = depConfig.transfer.roleTransferMultiplier[player.role];
    const transferProb = baseProb * roleMult;
    transferProbByGroup[player.positionGroup] += transferProb;
  }

  // Round to nearest whole number per group for determinism
  for (const group of Object.keys(transferProbByGroup) as PositionGroup[]) {
    expectedTransferCount += Math.round(transferProbByGroup[group]);
  }

  const graduatingCount = graduatingPlayers.length;
  const rosterSize = roster.filter(p => !(p as any).simRemoved).length;
  const returningCount = rosterSize - graduatingCount - expectedTransferCount;

  // Projected spend with inflation
  const projectedSpend = Math.round(currentAllocated * Math.pow(1 + inflationRateYoY, yearIndex));

  // Calculate gaps by position group
  const activeByGroup: Record<PositionGroup, number> = {
    QB: 0, RB: 0, WR: 0, TE: 0, OL: 0, DL: 0, LB: 0, DB: 0, ST: 0
  };
  
  for (const player of roster) {
    if ((player as any).simRemoved) continue;
    if (player.gradYear <= asOfYear + yearIndex) continue; // Exclude graduating
    activeByGroup[player.positionGroup]++;
  }

  // Subtract expected transfers per group
  for (const group of Object.keys(activeByGroup) as PositionGroup[]) {
    activeByGroup[group] -= Math.round(transferProbByGroup[group]);
    if (activeByGroup[group] < 0) activeByGroup[group] = 0;
  }

  const gapsByGroup: Partial<Record<PositionGroup, number>> = {};
  for (const [group, target] of Object.entries(gapLogic.targetHeadcountByGroup)) {
    const current = activeByGroup[group as PositionGroup];
    if (current < target) {
      gapsByGroup[group as PositionGroup] = target - current;
    }
  }

  // Build departures list
  const departuresList = graduatingPlayers.map(p => ({
    id: p.id,
    name: p.name,
    position: p.position,
    positionGroup: p.positionGroup,
    estimatedCost: p.estimatedCost,
    role: p.role,
    reason: 'GRADUATION' as const
  }));

  const topDrivers: string[] = [];
  if (graduatingCount > 5) topDrivers.push(`${graduatingCount} players graduating`);
  if (expectedTransferCount > 2) topDrivers.push(`${expectedTransferCount} expected transfers`);
  
  const startersLeaving = graduatingPlayers.filter(p => p.role === 'STARTER').length;
  if (startersLeaving > 0) topDrivers.push(`${startersLeaving} starter(s) departing`);

  return {
    label: `Year ${yearIndex}`,
    projectedSpend,
    returningCount: Math.max(0, returningCount),
    expectedDepartures: graduatingCount + expectedTransferCount,
    topDepartureDrivers: topDrivers,
    departures: departuresList,
    gapsByGroup,
    notes: generateForecastNotes(graduatingCount, expectedTransferCount, startersLeaving, gapsByGroup)
  };
}

function generateForecastNotes(
  graduatingCount: number,
  transferCount: number,
  startersLeaving: number,
  gaps: Partial<Record<PositionGroup, number>>
): string[] {
  const notes: string[] = [];
  
  if (graduatingCount > 0) {
    notes.push(`${graduatingCount} player(s) graduating this cycle.`);
  }
  if (startersLeaving > 0) {
    notes.push(`${startersLeaving} starter(s) departing.`);
  }
  if (transferCount > 0) {
    notes.push(`~${transferCount} player(s) expected transfer risk.`);
  }
  
  const gapGroups = Object.entries(gaps).filter(([_, v]) => v && v > 0);
  if (gapGroups.length > 0) {
    const gapStr = gapGroups.map(([g, v]) => `${g}: ${v}`).join(', ');
    notes.push(`Position gaps: ${gapStr}`);
  }

  return notes;
}

export function calculateFullForecast(roster: RosterPlayer[]): BudgetForecast {
  const currentAllocated = calculateTotalAllocated(roster, true);
  
  return {
    inflationRate: config.forecasting.inflationRateYoY,
    year1: calculateForecastYear(roster, 1, currentAllocated),
    year2: calculateForecastYear(roster, 2, currentAllocated),
    year3: calculateForecastYear(roster, 3, currentAllocated)
  };
}

// E) Risk score → color
export function calculateRiskScore(risk: { injury: number; transfer: number; academics: number }): number {
  const { weights } = config.risk;
  return Math.round(risk.injury * weights.injury + risk.transfer * weights.transfer + risk.academics * weights.academics);
}

export function getRiskColor(riskScore: number): RiskColor {
  const { colorThresholds } = config.risk;
  
  if (riskScore >= colorThresholds.RED[0] && riskScore <= colorThresholds.RED[1]) {
    return 'RED';
  }
  if (riskScore >= colorThresholds.YELLOW[0] && riskScore <= colorThresholds.YELLOW[1]) {
    return 'YELLOW';
  }
  return 'GREEN';
}

// F) Heatmap calculation
export function calculateRiskHeatmap(roster: RosterPlayer[]): RiskHeatmapRow[] {
  const groups: PositionGroup[] = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'ST'];
  
  return groups.map(group => {
    const playersInGroup = roster.filter(p => p.positionGroup === group && !(p as any).simRemoved);
    
    return {
      positionGroup: group,
      GREEN: playersInGroup.filter(p => p.riskColor === 'GREEN').length,
      YELLOW: playersInGroup.filter(p => p.riskColor === 'YELLOW').length,
      RED: playersInGroup.filter(p => p.riskColor === 'RED').length
    };
  });
}

// Guardrail status calculation
export type GuardrailStatus = 'within' | 'near' | 'over';

export function calculateGuardrailStatus(
  roster: RosterPlayer[]
): { status: GuardrailStatus; reasons: string[] } {
  const { remaining } = calculateRemainingBudget(roster);
  const allocations = calculateAllocationsByGroup(roster);
  const totalAllocated = calculateTotalAllocated(roster);
  
  const { maxPositionPercent, warnPositionPercent, minRemainingBuffer } = config.budgetGuardrails;
  
  const reasons: string[] = [];
  let isOver = false;
  let isNear = false;

  // Check remaining budget
  if (remaining < 0) {
    isOver = true;
    reasons.push('Budget exceeded');
  } else if (remaining < minRemainingBuffer) {
    isNear = true;
    reasons.push(`Remaining below $${(minRemainingBuffer / 1000).toFixed(0)}K buffer`);
  }

  // Check position group percentages
  for (const [group, amount] of Object.entries(allocations)) {
    const percent = amount / totalAllocated;
    
    if (percent > maxPositionPercent) {
      isOver = true;
      reasons.push(`${group} over ${(maxPositionPercent * 100).toFixed(0)}% cap`);
    } else if (percent > warnPositionPercent) {
      isNear = true;
      reasons.push(`${group} nearing ${(maxPositionPercent * 100).toFixed(0)}% cap`);
    }
  }

  const status: GuardrailStatus = isOver ? 'over' : isNear ? 'near' : 'within';

  return { status, reasons };
}

// WOW Scenario: Deterministic replacement selection
export function findReplacementCandidate(
  roster: RosterPlayer[],
  positionGroup: PositionGroup
): RosterPlayer | null {
  const { priorityOrder, graduationWindowYears, excludeRoles, tieBreakers } = config.replacementSuggestion;
  const asOfYear = config.asOfYear;

  // Filter to position group, exclude starters
  let candidates = roster.filter(p => 
    p.positionGroup === positionGroup && 
    !excludeRoles.includes(p.role) &&
    !(p as any).simRemoved
  );

  if (candidates.length === 0) return null;

  // Apply priority order
  // Priority 1: Graduating or graduate year soon
  const graduatingSoon = candidates.filter(p => p.gradYear <= asOfYear + graduationWindowYears);
  if (graduatingSoon.length > 0) {
    candidates = graduatingSoon;
  }

  // Priority 2: Non-starter depth with low grade
  if (candidates.length > 1) {
    const lowGradeDepth = candidates.filter(p => 
      (p.role === 'DEPTH' || p.role === 'DEVELOPMENTAL') && 
      p.performanceGrade <= 68 && 
      p.snapsShare <= 20
    );
    if (lowGradeDepth.length > 0) {
      candidates = lowGradeDepth;
    }
  }

  // Apply tie-breakers
  candidates.sort((a, b) => {
    // lowest performanceGrade first
    if (a.performanceGrade !== b.performanceGrade) {
      return a.performanceGrade - b.performanceGrade;
    }
    // lowest snapsShare
    if (a.snapsShare !== b.snapsShare) {
      return a.snapsShare - b.snapsShare;
    }
    // highest estimatedCost (to maximize savings)
    return b.estimatedCost - a.estimatedCost;
  });

  return candidates[0] || null;
}

// Decision summary generation
export function generateDecisionSummary(
  beforeRemaining: number,
  afterRemaining: number,
  recruitName: string,
  replacedName: string,
  positionGroup: PositionGroup,
  beforeGaps: Partial<Record<PositionGroup, number>>,
  afterGaps: Partial<Record<PositionGroup, number>>,
  beforeAllocPercent: number,
  afterAllocPercent: number
): {
  recruitAdded: string;
  playerRemoved: string;
  budgetImpact: string;
  forecastNote: string;
} {
  const delta = afterRemaining - beforeRemaining;
  const { warnPositionPercent } = config.budgetGuardrails;

  let forecastNote = '';

  // Check Year 1 gap reduction
  const beforeGap = beforeGaps[positionGroup] || 0;
  const afterGap = afterGaps[positionGroup] || 0;
  if (afterGap < beforeGap) {
    forecastNote = `Reduced Year-1 ${positionGroup} gap by ${beforeGap - afterGap}.`;
  }

  // Check runway buffer
  if (afterRemaining >= config.budgetGuardrails.minRemainingBuffer && delta < 0) {
    forecastNote += forecastNote ? ' ' : '';
    forecastNote += 'Stayed within runway buffer.';
  }

  // Check position allocation warning
  if (afterAllocPercent > warnPositionPercent) {
    forecastNote += forecastNote ? ' ' : '';
    forecastNote += `${positionGroup} allocation nearing cap.`;
  }

  return {
    recruitAdded: recruitName,
    playerRemoved: replacedName,
    budgetImpact: delta >= 0 
      ? `-$${(Math.abs(delta) / 1000).toFixed(0)}K` 
      : `+$${(Math.abs(delta) / 1000).toFixed(0)}K`,
    forecastNote: forecastNote || 'Simulation applied successfully.'
  };
}
