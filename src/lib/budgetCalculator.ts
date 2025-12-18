import { CALCULATOR_CONFIG } from '@/demo/calculatorConfig';
import type { RosterPlayer, PositionGroup, RiskColor, RosterRole, NILBand, ForecastYear, BudgetForecast, RiskHeatmapRow, Player } from '@/types';
import type { BeforeAfterSummary, BeforeAfterState } from '@/types/beforeAfter';

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

// Full BeforeAfterSummary generation per template
export interface WowScenarioInput {
  recruit: Player;
  replacement: RosterPlayer;
  rosterBefore: RosterPlayer[];
  rosterAfter: RosterPlayer[];
}

export function generateBeforeAfterSummary(input: WowScenarioInput): BeforeAfterState {
  const { recruit, replacement, rosterBefore, rosterAfter } = input;
  const wowConfig = config.wowScenario;
  const positionGroup = wowConfig.targetNeedPositionGroup;

  // Budget calculations
  const budgetBefore = calculateRemainingBudget(rosterBefore);
  const budgetAfter = calculateRemainingBudget(rosterAfter);
  const allocBefore = calculateAllocationsByGroup(rosterBefore);
  const allocAfter = calculateAllocationsByGroup(rosterAfter);

  // Forecast calculations
  const forecastBefore = calculateFullForecast(rosterBefore);
  const forecastAfter = calculateFullForecast(rosterAfter);

  // Heatmap calculations
  const heatmapBefore = calculateRiskHeatmap(rosterBefore);
  const heatmapAfter = calculateRiskHeatmap(rosterAfter);

  // Guardrail checks
  const { status: guardrailStatus, reasons } = calculateGuardrailStatus(rosterAfter);
  const statusMap = {
    within: 'WITHIN_GUARDRAILS' as const,
    near: 'NEAR_LIMIT' as const,
    over: 'OVER_LIMIT' as const
  };
  const statusLabelMap = {
    within: 'Within guardrails',
    near: 'Near limit',
    over: 'Over limit'
  };

  // Position group allocation percentages
  const percentBefore = budgetBefore.allocated > 0 ? allocBefore[positionGroup] / budgetBefore.allocated : 0;
  const percentAfter = budgetAfter.allocated > 0 ? allocAfter[positionGroup] / budgetAfter.allocated : 0;

  // Gap calculations for target position group
  const gapsBefore1 = forecastBefore.year1.gapsByGroup[positionGroup] || 0;
  const gapsAfter1 = forecastAfter.year1.gapsByGroup[positionGroup] || 0;
  const gapsBefore2 = forecastBefore.year2.gapsByGroup[positionGroup] || 0;
  const gapsAfter2 = forecastAfter.year2.gapsByGroup[positionGroup] || 0;
  const gapsBefore3 = forecastBefore.year3.gapsByGroup[positionGroup] || 0;
  const gapsAfter3 = forecastAfter.year3.gapsByGroup[positionGroup] || 0;

  // Heatmap delta for target position group
  const heatmapRowBefore = heatmapBefore.find(r => r.positionGroup === positionGroup) || { GREEN: 0, YELLOW: 0, RED: 0, positionGroup };
  const heatmapRowAfter = heatmapAfter.find(r => r.positionGroup === positionGroup) || { GREEN: 0, YELLOW: 0, RED: 0, positionGroup };

  // Check for new red risks
  const redBefore = heatmapBefore.reduce((sum, r) => sum + r.RED, 0);
  const redAfter = heatmapAfter.reduce((sum, r) => sum + r.RED, 0);
  const newRedIntroduced = redAfter > redBefore;

  // Key risks from roster
  const keyRisks = rosterAfter
    .filter(p => p.riskColor === 'YELLOW' || p.riskColor === 'RED')
    .slice(0, 5)
    .map(p => ({
      playerId: p.id,
      name: p.name,
      riskColor: p.riskColor,
      drivers: Object.entries(p.risk)
        .filter(([_, val]) => val >= config.risk.driversMinToDisplay)
        .map(([key]) => key)
    }));

  // Recruit cost - DETERMINISTIC: Fixed at $127,000 (under $150K cap, clearly "HIGH" band, moves budget without breaking guardrails)
  const DETERMINISTIC_RECRUIT_COST = 127000;
  const recruitCost = DETERMINISTIC_RECRUIT_COST;

  // Build recommended decision
  const why: string[] = [];
  const tradeoffs: string[] = [];

  if (gapsAfter1 < gapsBefore1) {
    why.push(`Year-1 ${positionGroup} gap decreases based on target headcount model.`);
  }
  if (budgetAfter.remaining >= config.budgetGuardrails.minRemainingBuffer) {
    why.push(`${positionGroup} depth improves without breaking runway buffer.`);
  }
  if (!newRedIntroduced) {
    why.push('No new RED risk introduced by simulation.');
  }

  if (percentAfter > config.budgetGuardrails.warnPositionPercent) {
    tradeoffs.push(`${positionGroup} allocation increases; monitor % near cap.`);
  }
  if (budgetAfter.remaining < budgetBefore.remaining) {
    tradeoffs.push('Remaining budget decreases; prioritize high-impact additions.');
  }

  let verdict: 'PROCEED' | 'CAUTION' | 'BLOCK' = 'PROCEED';
  let verdictLabel = 'Proceed (simulation)';
  if (guardrailStatus === 'over') {
    verdict = 'BLOCK';
    verdictLabel = 'Blocked (over limit)';
  } else if (guardrailStatus === 'near' || newRedIntroduced) {
    verdict = 'CAUTION';
    verdictLabel = 'Caution (near limit)';
  }

  const summary: BeforeAfterSummary = {
    scenarioId: wowConfig.id,
    scenarioLabel: wowConfig.label,
    timestampISO: new Date().toISOString(),
    mode: 'SIMULATION_ONLY',
    headline: {
      title: 'GM Simulation Result',
      status: statusMap[guardrailStatus],
      statusLabel: statusLabelMap[guardrailStatus],
      confidenceNote: 'Demo projection using deterministic calculator settings.'
    },
    entities: {
      recruitAdded: {
        sourcePlayerId: recruit.id,
        rosterInsertId: `sim_${recruit.id}`,
        name: recruit.name,
        position: recruit.position,
        positionGroup: recruit.positionGroup,
        assumedRole: wowConfig.assumedRecruitRole,
        nilBand: 'HIGH',
        deterministicCost: recruitCost
      },
      replacementSuggested: {
        rosterPlayerId: replacement.id,
        name: replacement.name,
        positionGroup: replacement.positionGroup,
        role: replacement.role,
        reason: 'Graduating soon or low-grade depth; selected deterministically.',
        simRemoved: true
      }
    },
    budgetDelta: {
      totalAllocatedBefore: budgetBefore.allocated,
      totalAllocatedAfter: budgetAfter.allocated,
      deltaAllocated: budgetAfter.allocated - budgetBefore.allocated,
      remainingBefore: budgetBefore.remaining,
      remainingAfter: budgetAfter.remaining,
      deltaRemaining: budgetAfter.remaining - budgetBefore.remaining,
      reserveLocked: config.budgetTotals.treatReserveAsLocked,
      reserveAmount: config.budgetTotals.contingencyReserve,
      guardrails: {
        minRemainingBuffer: config.budgetGuardrails.minRemainingBuffer,
        maxPerPlayer: config.budgetGuardrails.maxPerPlayer,
        warnPositionPercent: config.budgetGuardrails.warnPositionPercent,
        maxPositionPercent: config.budgetGuardrails.maxPositionPercent
      },
      guardrailChecks: {
        remainingBufferOk: budgetAfter.remaining >= config.budgetGuardrails.minRemainingBuffer,
        anyPositionOverMax: Object.values(allocAfter).some(v => v / budgetAfter.allocated > config.budgetGuardrails.maxPositionPercent),
        anyPositionOverWarn: Object.values(allocAfter).some(v => v / budgetAfter.allocated > config.budgetGuardrails.warnPositionPercent),
        maxPlayerCostOk: recruitCost <= config.budgetGuardrails.maxPerPlayer
      }
    },
    allocationDelta: {
      positionGroup,
      percentBefore: Math.round(percentBefore * 10000) / 100,
      percentAfter: Math.round(percentAfter * 10000) / 100,
      deltaPercent: Math.round((percentAfter - percentBefore) * 10000) / 100,
      note: 'Allocation % = groupAllocated / totalAllocated.'
    },
    forecastDelta: {
      year1: {
        gapsBefore: gapsBefore1,
        gapsAfter: gapsAfter1,
        deltaGaps: gapsAfter1 - gapsBefore1,
        projectedSpendBefore: forecastBefore.year1.projectedSpend,
        projectedSpendAfter: forecastAfter.year1.projectedSpend
      },
      year2: {
        gapsBefore: gapsBefore2,
        gapsAfter: gapsAfter2,
        deltaGaps: gapsAfter2 - gapsBefore2,
        projectedSpendBefore: forecastBefore.year2.projectedSpend,
        projectedSpendAfter: forecastAfter.year2.projectedSpend
      },
      year3: {
        gapsBefore: gapsBefore3,
        gapsAfter: gapsAfter3,
        deltaGaps: gapsAfter3 - gapsBefore3,
        projectedSpendBefore: forecastBefore.year3.projectedSpend,
        projectedSpendAfter: forecastAfter.year3.projectedSpend
      }
    },
    riskDelta: {
      newRedIntroduced,
      heatmapDelta: {
        positionGroup,
        greenBefore: heatmapRowBefore.GREEN,
        greenAfter: heatmapRowAfter.GREEN,
        yellowBefore: heatmapRowBefore.YELLOW,
        yellowAfter: heatmapRowAfter.YELLOW,
        redBefore: heatmapRowBefore.RED,
        redAfter: heatmapRowAfter.RED
      },
      keyRisks
    },
    recommendedDecision: {
      verdict,
      verdictLabel,
      why: why.length > 0 ? why : ['Simulation completed successfully.'],
      tradeoffs: tradeoffs.length > 0 ? tradeoffs : ['No significant tradeoffs identified.']
    },
    nextActions: [
      { label: 'Apply Simulation', action: 'applySimulation' },
      { label: 'Undo', action: 'undoSimulation' },
      { label: 'Open Budget Simulator', action: 'navigate:/app/budget/simulator' },
      { label: 'Open 3-Year Forecast', action: 'navigate:/app/forecast' }
    ],
    audit: {
      eventsWritten: [
        'WOW_SIMULATION_RUN',
        'RECRUIT_SIM_ADDED',
        'SIM_REPLACEMENT_SUGGESTED',
        'BEFORE_AFTER_COMPUTED'
      ]
    }
  };

  return { summary };
}
