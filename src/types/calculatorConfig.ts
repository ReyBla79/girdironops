import type { PositionGroup, RosterRole, RiskColor, NILBand } from './index';

export interface NILBandRange {
  min: number;
  mid: number;
  max: number;
}

export interface CalculatorConfig {
  version: string;
  currency: string;
  asOfYear: number;
  nilBands: Record<NILBand, NILBandRange>;
  roleCostMultipliers: Record<RosterRole, number>;
  positionGroupBudgetWeights: Record<PositionGroup, number>;
  budgetGuardrails: {
    maxPerPlayer: number;
    maxPositionPercent: number;
    warnPositionPercent: number;
    minRemainingBuffer: number;
  };
  budgetTotals: {
    totalNILBudget: number;
    contingencyReserve: number;
    treatReserveAsLocked: boolean;
  };
  allocationAlgorithm: {
    mode: string;
    playerCostMethod: string;
    rounding: {
      method: string;
      value: number;
    };
  };
  forecasting: {
    years: number[];
    inflationRateYoY: number;
    departures: {
      graduation: {
        leaveIfGradYearLTE: string;
        graduatingRoleBoost: Record<RosterRole, number>;
      };
      transfer: {
        useRiskColor: boolean;
        baseTransferProbByRiskColor: Record<RiskColor, number>;
        roleTransferMultiplier: Record<RosterRole, number>;
      };
    };
    gapLogic: {
      targetHeadcountByGroup: Record<PositionGroup, number>;
      gapIfBelowTarget: boolean;
    };
    replacementModel: {
      autoReplaceDepartures: boolean;
      replacementCostMethod: string;
      defaultReplacementRole: RosterRole;
    };
  };
  risk: {
    weights: {
      injury: number;
      transfer: number;
      academics: number;
    };
    scoreRange: [number, number];
    colorThresholds: Record<RiskColor, [number, number]>;
    driversMinToDisplay: number;
  };
  replacementSuggestion: {
    priorityOrder: string[];
    graduationWindowYears: number;
    excludeRoles: RosterRole[];
    tieBreakers: string[];
  };
  wowScenario: {
    id: string;
    label: string;
    recruitPlayerId: string;
    targetNeedPositionGroup: PositionGroup;
    assumedRecruitRole: RosterRole;
    replacementRulesRef: string;
    applyMode: string;
    auditEvents: string[];
    expectedOutcomeDisplay: {
      showDeltas: boolean;
      headlineMetrics: string[];
    };
  };
}
