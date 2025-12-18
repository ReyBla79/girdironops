import { RosterPlayer, RosterNeed, Budget, RosterMeta, BudgetForecast, ForecastDeparture, PositionGroup } from '@/types';

export const ROSTER_META: RosterMeta = {
  programId: "unlv",
  programName: "UNLV Football (Demo)",
  rosterSize: 52,
  asOf: "2025-12-16",
  currency: "USD",
  disclaimer: "Synthetic demo roster and projected NIL costs. Not real UNLV data."
};

export const SEED_BUDGET: Budget = {
  totalBudget: 1800000,
  allocations: {
    QB: 280000,
    OL: 320000,
    DL: 260000,
    LB: 190000,
    DB: 240000,
    WR: 210000,
    TE: 120000,
    RB: 120000,
    ST: 60000
  },
  guardrails: {
    maxPerPlayer: 150000,
    maxPerPositionPercent: 25
  }
};

export const SEED_ROSTER: RosterPlayer[] = [
  { id:"r01", name:"Derek Vaughn", position:"QB", positionGroup:"QB", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"HIGH", estimatedCost:145000, role:"STARTER", snapsShare:86, performanceGrade:82, risk:{injury:18,transfer:28,academics:6}, riskScore:22, riskColor:"GREEN" },
  { id:"r02", name:"Mason Redd", position:"QB", positionGroup:"QB", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"MED", estimatedCost:65000, role:"ROTATION", snapsShare:18, performanceGrade:74, risk:{injury:22,transfer:22,academics:8}, riskScore:20, riskColor:"GREEN" },
  { id:"r03", name:"Tyrell Knox", position:"QB", positionGroup:"QB", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:18000, role:"DEPTH", snapsShare:2, performanceGrade:68, risk:{injury:14,transfer:18,academics:10}, riskScore:16, riskColor:"GREEN" },
  { id:"r04", name:"Jamal Pierce", position:"RB", positionGroup:"RB", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"MED", estimatedCost:52000, role:"STARTER", snapsShare:62, performanceGrade:79, risk:{injury:34,transfer:14,academics:6}, riskScore:25, riskColor:"GREEN" },
  { id:"r05", name:"Kendrick Solis", position:"RB", positionGroup:"RB", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:45000, role:"ROTATION", snapsShare:34, performanceGrade:76, risk:{injury:26,transfer:22,academics:6}, riskScore:22, riskColor:"GREEN" },
  { id:"r06", name:"Noah Benton", position:"RB", positionGroup:"RB", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:14000, role:"DEPTH", snapsShare:10, performanceGrade:70, risk:{injury:20,transfer:18,academics:8}, riskScore:17, riskColor:"GREEN" },
  { id:"r07", name:"Rico Alston", position:"RB", positionGroup:"RB", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:12000, role:"DEPTH", snapsShare:4, performanceGrade:66, risk:{injury:18,transfer:20,academics:10}, riskScore:18, riskColor:"GREEN" },
  { id:"r08", name:"DeShawn Carter", position:"WR", positionGroup:"WR", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"HIGH", estimatedCost:110000, role:"STARTER", snapsShare:78, performanceGrade:83, risk:{injury:24,transfer:20,academics:6}, riskScore:22, riskColor:"GREEN" },
  { id:"r09", name:"Marcus Wynn", position:"WR", positionGroup:"WR", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:62000, role:"STARTER", snapsShare:71, performanceGrade:79, risk:{injury:20,transfer:24,academics:8}, riskScore:22, riskColor:"GREEN" },
  { id:"r10", name:"Tanner Cole", position:"WR", positionGroup:"WR", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:48000, role:"ROTATION", snapsShare:42, performanceGrade:75, risk:{injury:22,transfer:26,academics:8}, riskScore:24, riskColor:"GREEN" },
  { id:"r11", name:"Isaiah Rollins", position:"WR", positionGroup:"WR", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:18000, role:"ROTATION", snapsShare:28, performanceGrade:72, risk:{injury:18,transfer:20,academics:10}, riskScore:19, riskColor:"GREEN" },
  { id:"r12", name:"Camden Lewis", position:"WR", positionGroup:"WR", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:15000, role:"DEPTH", snapsShare:16, performanceGrade:69, risk:{injury:16,transfer:18,academics:10}, riskScore:17, riskColor:"GREEN" },
  { id:"r13", name:"Trey Holloway", position:"WR", positionGroup:"WR", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:22000, role:"DEPTH", snapsShare:12, performanceGrade:71, risk:{injury:14,transfer:18,academics:8}, riskScore:16, riskColor:"GREEN" },
  { id:"r14", name:"Jaylen Stokes", position:"WR", positionGroup:"WR", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:12000, role:"DEPTH", snapsShare:6, performanceGrade:66, risk:{injury:18,transfer:22,academics:12}, riskScore:20, riskColor:"GREEN" },
  { id:"r15", name:"Colton Price", position:"TE", positionGroup:"TE", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"MED", estimatedCost:42000, role:"STARTER", snapsShare:63, performanceGrade:78, risk:{injury:30,transfer:16,academics:6}, riskScore:23, riskColor:"GREEN" },
  { id:"r16", name:"Eli Navarro", position:"TE", positionGroup:"TE", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"LOW", estimatedCost:24000, role:"ROTATION", snapsShare:34, performanceGrade:73, risk:{injury:22,transfer:18,academics:8}, riskScore:19, riskColor:"GREEN" },
  { id:"r17", name:"Bryce Sandoval", position:"TE", positionGroup:"TE", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:14000, role:"DEPTH", snapsShare:18, performanceGrade:70, risk:{injury:18,transfer:18,academics:10}, riskScore:18, riskColor:"GREEN" },
  { id:"r18", name:"Logan Pierce", position:"TE", positionGroup:"TE", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:10000, role:"DEPTH", snapsShare:6, performanceGrade:66, risk:{injury:16,transfer:18,academics:10}, riskScore:17, riskColor:"GREEN" },
  { id:"r19", name:"Avery Bennett", position:"LT", positionGroup:"OL", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"HIGH", estimatedCost:95000, role:"STARTER", snapsShare:90, performanceGrade:80, risk:{injury:26,transfer:18,academics:6}, riskScore:21, riskColor:"GREEN" },
  { id:"r20", name:"Malik Neighbors", position:"RT", positionGroup:"OL", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"HIGH", estimatedCost:110000, role:"STARTER", snapsShare:78, performanceGrade:81, risk:{injury:18,transfer:22,academics:6}, riskScore:20, riskColor:"GREEN" },
  { id:"r21", name:"Dante Willis", position:"LG", positionGroup:"OL", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:62000, role:"STARTER", snapsShare:76, performanceGrade:78, risk:{injury:22,transfer:18,academics:8}, riskScore:19, riskColor:"GREEN" },
  { id:"r22", name:"Preston Reid", position:"RG", positionGroup:"OL", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"MED", estimatedCost:48000, role:"STARTER", snapsShare:68, performanceGrade:75, risk:{injury:24,transfer:22,academics:10}, riskScore:23, riskColor:"GREEN" },
  { id:"r23", name:"Caden Moore", position:"C", positionGroup:"OL", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:26000, role:"ROTATION", snapsShare:34, performanceGrade:72, risk:{injury:18,transfer:18,academics:10}, riskScore:18, riskColor:"GREEN" },
  { id:"r24", name:"Khalil Parks", position:"OT", positionGroup:"OL", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:54000, role:"ROTATION", snapsShare:29, performanceGrade:73, risk:{injury:22,transfer:26,academics:8}, riskScore:24, riskColor:"GREEN" },
  { id:"r25", name:"Nico Harper", position:"OG", positionGroup:"OL", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:18000, role:"DEPTH", snapsShare:18, performanceGrade:69, risk:{injury:20,transfer:20,academics:10}, riskScore:20, riskColor:"GREEN" },
  { id:"r26", name:"Jared Sosa", position:"OT", positionGroup:"OL", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:14000, role:"DEPTH", snapsShare:8, performanceGrade:66, risk:{injury:18,transfer:20,academics:12}, riskScore:20, riskColor:"GREEN" },
  { id:"r27", name:"Miles Dorsey", position:"C", positionGroup:"OL", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:12000, role:"DEPTH", snapsShare:6, performanceGrade:65, risk:{injury:18,transfer:18,academics:12}, riskScore:19, riskColor:"GREEN" },
  { id:"r28", name:"Jalen Cross", position:"EDGE", positionGroup:"DL", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"HIGH", estimatedCost:98000, role:"STARTER", snapsShare:74, performanceGrade:80, risk:{injury:26,transfer:32,academics:6}, riskScore:30, riskColor:"YELLOW" },
  { id:"r29", name:"Trevon Kim", position:"DE", positionGroup:"DL", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:56000, role:"STARTER", snapsShare:70, performanceGrade:77, risk:{injury:22,transfer:22,academics:8}, riskScore:22, riskColor:"GREEN" },
  { id:"r30", name:"Andre Coleman", position:"DT", positionGroup:"DL", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:60000, role:"STARTER", snapsShare:66, performanceGrade:76, risk:{injury:28,transfer:20,academics:8}, riskScore:24, riskColor:"GREEN" },
  { id:"r31", name:"Jordan Tate", position:"DT", positionGroup:"DL", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"MED", estimatedCost:42000, role:"ROTATION", snapsShare:42, performanceGrade:74, risk:{injury:24,transfer:22,academics:10}, riskScore:23, riskColor:"GREEN" },
  { id:"r32", name:"Micah Torres", position:"EDGE", positionGroup:"DL", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:24000, role:"ROTATION", snapsShare:36, performanceGrade:71, risk:{injury:18,transfer:22,academics:10}, riskScore:20, riskColor:"GREEN" },
  { id:"r33", name:"Damien Brooks", position:"DE", positionGroup:"DL", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"MED", estimatedCost:52000, role:"ROTATION", snapsShare:38, performanceGrade:73, risk:{injury:28,transfer:18,academics:6}, riskScore:22, riskColor:"GREEN" },
  { id:"r34", name:"Evan Shaw", position:"DT", positionGroup:"DL", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:22000, role:"DEPTH", snapsShare:18, performanceGrade:69, risk:{injury:26,transfer:18,academics:10}, riskScore:21, riskColor:"GREEN" },
  { id:"r35", name:"Keon Marshall", position:"NT", positionGroup:"DL", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:16000, role:"DEPTH", snapsShare:10, performanceGrade:66, risk:{injury:22,transfer:18,academics:12}, riskScore:20, riskColor:"GREEN" },
  { id:"r36", name:"Carter Simmons", position:"EDGE", positionGroup:"DL", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:14000, role:"DEPTH", snapsShare:8, performanceGrade:65, risk:{injury:20,transfer:20,academics:12}, riskScore:21, riskColor:"GREEN" },
  { id:"r37", name:"Tristan Hale", position:"MLB", positionGroup:"LB", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"MED", estimatedCost:65000, role:"STARTER", snapsShare:79, performanceGrade:78, risk:{injury:26,transfer:18,academics:6}, riskScore:21, riskColor:"GREEN" },
  { id:"r38", name:"Kobe Lang", position:"WLB", positionGroup:"LB", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:54000, role:"STARTER", snapsShare:68, performanceGrade:76, risk:{injury:20,transfer:22,academics:8}, riskScore:21, riskColor:"GREEN" },
  { id:"r39", name:"Riley Donovan", position:"SLB", positionGroup:"LB", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:26000, role:"ROTATION", snapsShare:44, performanceGrade:72, risk:{injury:20,transfer:20,academics:10}, riskScore:20, riskColor:"GREEN" },
  { id:"r40", name:"Darius Webb", position:"OLB", positionGroup:"LB", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:22000, role:"ROTATION", snapsShare:36, performanceGrade:71, risk:{injury:18,transfer:22,academics:10}, riskScore:20, riskColor:"GREEN" },
  { id:"r41", name:"Bennett Collins", position:"ILB", positionGroup:"LB", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:14000, role:"DEPTH", snapsShare:12, performanceGrade:66, risk:{injury:18,transfer:20,academics:12}, riskScore:20, riskColor:"GREEN" },
  { id:"r42", name:"Xavier Pratt", position:"OLB", positionGroup:"LB", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:12000, role:"DEPTH", snapsShare:8, performanceGrade:65, risk:{injury:18,transfer:18,academics:12}, riskScore:19, riskColor:"GREEN" },
  { id:"r43", name:"DeAndre Vale", position:"CB", positionGroup:"DB", year:"GR", gradYear:2026, eligibilityRemaining:1, nilBand:"MED", estimatedCost:78000, role:"STARTER", snapsShare:72, performanceGrade:77, risk:{injury:24,transfer:30,academics:6}, riskScore:27, riskColor:"YELLOW" },
  { id:"r44", name:"Jaylen Booker", position:"CB", positionGroup:"DB", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"MED", estimatedCost:52000, role:"STARTER", snapsShare:70, performanceGrade:76, risk:{injury:18,transfer:22,academics:8}, riskScore:20, riskColor:"GREEN" },
  { id:"r45", name:"Tariq Monroe", position:"NB", positionGroup:"DB", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:28000, role:"STARTER", snapsShare:58, performanceGrade:74, risk:{injury:20,transfer:22,academics:10}, riskScore:22, riskColor:"GREEN" },
  { id:"r46", name:"Owen Grant", position:"S", positionGroup:"DB", year:"SR", gradYear:2026, eligibilityRemaining:1, nilBand:"MED", estimatedCost:60000, role:"STARTER", snapsShare:64, performanceGrade:75, risk:{injury:26,transfer:18,academics:6}, riskScore:21, riskColor:"GREEN" },
  { id:"r47", name:"Kameron Fields", position:"S", positionGroup:"DB", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"LOW", estimatedCost:32000, role:"ROTATION", snapsShare:40, performanceGrade:72, risk:{injury:22,transfer:20,academics:8}, riskScore:21, riskColor:"GREEN" },
  { id:"r48", name:"Eli Thompson", position:"CB", positionGroup:"DB", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:22000, role:"ROTATION", snapsShare:34, performanceGrade:70, risk:{injury:18,transfer:20,academics:10}, riskScore:19, riskColor:"GREEN" },
  { id:"r49", name:"Damon Reese", position:"S", positionGroup:"DB", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:14000, role:"DEPTH", snapsShare:12, performanceGrade:66, risk:{injury:18,transfer:18,academics:12}, riskScore:19, riskColor:"GREEN" },
  { id:"r50", name:"Nolan Ortiz", position:"CB", positionGroup:"DB", year:"FR", gradYear:2029, eligibilityRemaining:4, nilBand:"LOW", estimatedCost:12000, role:"DEPTH", snapsShare:10, performanceGrade:65, risk:{injury:18,transfer:20,academics:12}, riskScore:20, riskColor:"GREEN" },
  { id:"r51", name:"Gavin Holt", position:"K", positionGroup:"ST", year:"JR", gradYear:2027, eligibilityRemaining:2, nilBand:"LOW", estimatedCost:8000, role:"STARTER", snapsShare:100, performanceGrade:78, risk:{injury:10,transfer:10,academics:6}, riskScore:10, riskColor:"GREEN" },
  { id:"r52", name:"Miles Carter", position:"P", positionGroup:"ST", year:"SO", gradYear:2028, eligibilityRemaining:3, nilBand:"LOW", estimatedCost:7000, role:"STARTER", snapsShare:100, performanceGrade:76, risk:{injury:10,transfer:10,academics:6}, riskScore:10, riskColor:"GREEN" }
];

export const SEED_NEEDS: RosterNeed[] = [
  { id: "n1", label: "OT Depth (Urgent)", positionGroup: "OL", priority: "MUST_REPLACE", reason: "Senior LT nearing eligibility end; depth snaps low." },
  { id: "n2", label: "EDGE Pressure (Upgrade)", positionGroup: "DL", priority: "UPGRADE", reason: "Need higher pressure rate vs top offenses. Jalen Cross transfer risk." },
  { id: "n3", label: "Nickel DB Speed (Depth)", positionGroup: "DB", priority: "DEPTH", reason: "Rotation speed needed for tempo opponents." },
  { id: "n4", label: "RB Depth", positionGroup: "RB", priority: "DEPTH", reason: "Senior RB1 with high injury risk; need insurance." }
];

// Use predefined forecast defaults with computed departures
export const SEED_FORECAST: BudgetForecast = {
  inflationRate: 0.08,
  year1: {
    label: "Year 1 (Next Season)",
    projectedSpend: 1609000,
    returningCount: 36,
    expectedDepartures: 16,
    topDepartureDrivers: ["Graduation-heavy at SR/GR", "2 Yellow-risk starters"],
    departures: SEED_ROSTER
      .filter(p => p.gradYear === 2026)
      .map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        positionGroup: p.positionGroup,
        estimatedCost: p.estimatedCost,
        role: p.role,
        reason: "GRADUATION" as const
      })),
    gapsByGroup: { OL: 2, DL: 1, DB: 2, WR: 2, LB: 1 },
    notes: [
      "Heavy attrition year: 10 players graduating.",
      "8 starter(s) departing including key positions.",
      "2 player(s) flagged as transfer risk."
    ]
  },
  year2: {
    label: "Year 2",
    projectedSpend: 1738000,
    returningCount: 30,
    expectedDepartures: 22,
    topDepartureDrivers: ["Starter turnover", "Roster churn in WR/DB/OL"],
    departures: SEED_ROSTER
      .filter(p => p.gradYear === 2027)
      .map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        positionGroup: p.positionGroup,
        estimatedCost: p.estimatedCost,
        role: p.role,
        reason: "GRADUATION" as const
      })),
    gapsByGroup: { QB: 1, OL: 2, DL: 2, DB: 2, WR: 2, TE: 1 },
    notes: [
      "11 players graduating this cycle.",
      "Starter turnover at QB, OL, and DB.",
      "Plan replacements for WR depth."
    ]
  },
  year3: {
    label: "Year 3",
    projectedSpend: 1877000,
    returningCount: 24,
    expectedDepartures: 28,
    topDepartureDrivers: ["Eligibility cycle + transfer churn"],
    departures: SEED_ROSTER
      .filter(p => p.gradYear === 2028)
      .map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        positionGroup: p.positionGroup,
        estimatedCost: p.estimatedCost,
        role: p.role,
        reason: "GRADUATION" as const
      })),
    gapsByGroup: { QB: 1, OL: 2, DL: 2, LB: 2, DB: 2, WR: 3 },
    notes: [
      "14 players graduating.",
      "Significant rebuild needed at WR and DB.",
      "Begin recruiting pipeline investments now."
    ]
  }
};
