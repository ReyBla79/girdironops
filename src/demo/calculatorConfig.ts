import type { CalculatorConfig } from '@/types/calculatorConfig';

export const CALCULATOR_CONFIG: CalculatorConfig = {
  version: "demo-v1.0",
  currency: "USD",
  asOfYear: 2026,
  revShareBands: {
    LOW: { min: 5000, mid: 15000, max: 20000 },
    MED: { min: 25000, mid: 45000, max: 60000 },
    HIGH: { min: 75000, mid: 110000, max: 150000 }
  },
  roleCostMultipliers: {
    STARTER: 1.15,
    ROTATION: 1.0,
    DEPTH: 0.85,
    DEVELOPMENTAL: 0.7
  },
  positionGroupBudgetWeights: {
    QB: 1.25,
    OL: 1.15,
    DL: 1.10,
    LB: 1.00,
    DB: 1.05,
    WR: 1.05,
    TE: 0.95,
    RB: 0.95,
    ST: 0.60
  },
  budgetGuardrails: {
    maxPerPlayer: 150000,
    maxPositionPercent: 0.25,
    warnPositionPercent: 0.22,
    minRemainingBuffer: 150000
  },
  budgetTotals: {
    totalRevShareBudget: 1800000,
    contingencyReserve: 120000,
    treatReserveAsLocked: true
  },
  allocationAlgorithm: {
    mode: "sum_by_position_group",
    playerCostMethod: "estimatedCost_if_present_else_band_mid_x_role_multiplier_x_position_weight",
    rounding: { method: "nearest", value: 1000 }
  },
  forecasting: {
    years: [1, 2, 3],
    inflationRateYoY: 0.08,
    departures: {
      graduation: {
        leaveIfGradYearLTE: "asOfYear + yearIndex",
        graduatingRoleBoost: {
          STARTER: 1.0,
          ROTATION: 0.9,
          DEPTH: 0.8,
          DEVELOPMENTAL: 0.7
        }
      },
      transfer: {
        useRiskColor: true,
        baseTransferProbByRiskColor: {
          GREEN: 0.06,
          YELLOW: 0.12,
          RED: 0.20
        },
        roleTransferMultiplier: {
          STARTER: 1.15,
          ROTATION: 1.0,
          DEPTH: 0.95,
          DEVELOPMENTAL: 0.9
        }
      }
    },
    gapLogic: {
      targetHeadcountByGroup: {
        QB: 3,
        RB: 4,
        WR: 7,
        TE: 4,
        OL: 9,
        DL: 9,
        LB: 6,
        DB: 8,
        ST: 2
      },
      gapIfBelowTarget: true
    },
    replacementModel: {
      autoReplaceDepartures: false,
      replacementCostMethod: "band_mid_x_role_multiplier",
      defaultReplacementRole: "ROTATION"
    }
  },
  risk: {
    weights: {
      injury: 0.45,
      transfer: 0.45,
      academics: 0.10
    },
    scoreRange: [0, 100],
    colorThresholds: {
      GREEN: [0, 29],
      YELLOW: [30, 59],
      RED: [60, 100]
    },
    driversMinToDisplay: 25
  },
  replacementSuggestion: {
    priorityOrder: [
      "graduating_or_graduate_year_soon",
      "non_starter_depth_low_grade",
      "lowest_grade_in_group"
    ],
    graduationWindowYears: 1,
    excludeRoles: ["STARTER"],
    tieBreakers: [
      "lowest_performanceGrade",
      "lowest_snapsShare",
      "highest_estimatedCost"
    ]
  },
  wowScenario: {
    id: "wow1",
    label: "Fix OL Depth + Keep Budget Clean",
    recruitPlayerId: "p1",
    targetNeedPositionGroup: "OL",
    assumedRecruitRole: "STARTER",
    replacementRulesRef: "replacementSuggestion",
    applyMode: "simulation_only",
    auditEvents: [
      "WOW_SIMULATION_RUN",
      "RECRUIT_SIM_ADDED",
      "SIM_REPLACEMENT_SUGGESTED",
      "BEFORE_AFTER_COMPUTED"
    ],
    expectedOutcomeDisplay: {
      showDeltas: true,
      headlineMetrics: [
        "remainingBudget",
        "positionAllocationPercentChange",
        "year1GapDelta",
        "riskHeatmapDelta"
      ]
    }
  }
};
