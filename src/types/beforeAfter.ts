import type { PositionGroup, RosterRole, RiskColor, NILBand } from './index';

export interface BeforeAfterHeadline {
  title: string;
  status: 'WITHIN_GUARDRAILS' | 'NEAR_LIMIT' | 'OVER_LIMIT';
  statusLabel: string;
  confidenceNote: string;
}

export interface RecruitAddedEntity {
  sourcePlayerId: string;
  rosterInsertId: string;
  name: string;
  position: string;
  positionGroup: PositionGroup;
  assumedRole: RosterRole;
  nilBand: NILBand;
  deterministicCost: number;
}

export interface ReplacementSuggestedEntity {
  rosterPlayerId: string;
  name: string;
  positionGroup: PositionGroup;
  role: RosterRole;
  reason: string;
  simRemoved: boolean;
}

export interface BudgetDeltaGuardrails {
  minRemainingBuffer: number;
  maxPerPlayer: number;
  warnPositionPercent: number;
  maxPositionPercent: number;
}

export interface BudgetDeltaGuardrailChecks {
  remainingBufferOk: boolean;
  anyPositionOverMax: boolean;
  anyPositionOverWarn: boolean;
  maxPlayerCostOk: boolean;
}

export interface BudgetDelta {
  totalAllocatedBefore: number;
  totalAllocatedAfter: number;
  deltaAllocated: number;
  remainingBefore: number;
  remainingAfter: number;
  deltaRemaining: number;
  reserveLocked: boolean;
  reserveAmount: number;
  guardrails: BudgetDeltaGuardrails;
  guardrailChecks: BudgetDeltaGuardrailChecks;
}

export interface AllocationDelta {
  positionGroup: PositionGroup;
  percentBefore: number;
  percentAfter: number;
  deltaPercent: number;
  note: string;
}

export interface ForecastYearDelta {
  gapsBefore: number;
  gapsAfter: number;
  deltaGaps: number;
  projectedSpendBefore: number;
  projectedSpendAfter: number;
}

export interface ForecastDelta {
  year1: ForecastYearDelta;
  year2: ForecastYearDelta;
  year3: ForecastYearDelta;
}

export interface HeatmapDelta {
  positionGroup: PositionGroup;
  greenBefore: number;
  greenAfter: number;
  yellowBefore: number;
  yellowAfter: number;
  redBefore: number;
  redAfter: number;
}

export interface KeyRiskEntry {
  playerId: string;
  name: string;
  riskColor: RiskColor;
  drivers: string[];
}

export interface RiskDelta {
  newRedIntroduced: boolean;
  heatmapDelta: HeatmapDelta;
  keyRisks: KeyRiskEntry[];
}

export interface RecommendedDecision {
  verdict: 'PROCEED' | 'CAUTION' | 'BLOCK';
  verdictLabel: string;
  why: string[];
  tradeoffs: string[];
}

export interface NextAction {
  label: string;
  action: string;
}

export interface Audit {
  eventsWritten: string[];
}

export interface BeforeAfterSummary {
  scenarioId: string;
  scenarioLabel: string;
  timestampISO: string;
  mode: 'SIMULATION_ONLY' | 'APPLIED';
  headline: BeforeAfterHeadline;
  entities: {
    recruitAdded: RecruitAddedEntity;
    replacementSuggested: ReplacementSuggestedEntity;
  };
  budgetDelta: BudgetDelta;
  allocationDelta: AllocationDelta;
  forecastDelta: ForecastDelta;
  riskDelta: RiskDelta;
  recommendedDecision: RecommendedDecision;
  nextActions: NextAction[];
  audit: Audit;
}

export interface BeforeAfterState {
  summary: BeforeAfterSummary;
}
