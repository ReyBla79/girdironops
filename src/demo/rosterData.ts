import { RosterPlayer, RosterNeed, Budget } from '@/types';

export const SEED_ROSTER: RosterPlayer[] = [
  {
    id: "r1",
    name: "Marcus Johnson",
    positionGroup: "QB",
    position: "QB",
    classYear: "SR",
    starter: true,
    snapsShare: 92,
    grade: 88,
    eligibilityRemaining: 1,
    nilBand: "HIGH",
    riskFlags: ["Transfer risk (demo)"]
  },
  {
    id: "r2",
    name: "Davion Williams",
    positionGroup: "RB",
    position: "RB",
    classYear: "JR",
    starter: true,
    snapsShare: 78,
    grade: 82,
    eligibilityRemaining: 2,
    nilBand: "MID",
    riskFlags: []
  },
  {
    id: "r3",
    name: "Chris Thompson",
    positionGroup: "WR",
    position: "WR",
    classYear: "SO",
    starter: true,
    snapsShare: 85,
    grade: 79,
    eligibilityRemaining: 3,
    nilBand: "MID",
    riskFlags: []
  },
  {
    id: "r4",
    name: "Kevin Mitchell",
    positionGroup: "OL",
    position: "LT",
    classYear: "SR",
    starter: true,
    snapsShare: 95,
    grade: 84,
    eligibilityRemaining: 1,
    nilBand: "HIGH",
    riskFlags: ["Graduating (demo)"]
  },
  {
    id: "r5",
    name: "James Rodriguez",
    positionGroup: "OL",
    position: "LG",
    classYear: "JR",
    starter: true,
    snapsShare: 88,
    grade: 76,
    eligibilityRemaining: 2,
    nilBand: "MID",
    riskFlags: []
  },
  {
    id: "r6",
    name: "Tyler Brooks",
    positionGroup: "OL",
    position: "C",
    classYear: "GR",
    starter: true,
    snapsShare: 96,
    grade: 85,
    eligibilityRemaining: 1,
    nilBand: "HIGH",
    riskFlags: ["Graduating (demo)"]
  },
  {
    id: "r7",
    name: "Brandon Lee",
    positionGroup: "OL",
    position: "RG",
    classYear: "SO",
    starter: true,
    snapsShare: 82,
    grade: 72,
    eligibilityRemaining: 3,
    nilBand: "LOW",
    riskFlags: ["Development (demo)"]
  },
  {
    id: "r8",
    name: "Derek Foster",
    positionGroup: "OL",
    position: "RT",
    classYear: "JR",
    starter: true,
    snapsShare: 90,
    grade: 78,
    eligibilityRemaining: 2,
    nilBand: "MID",
    riskFlags: []
  },
  {
    id: "r9",
    name: "Andre Davis",
    positionGroup: "DL",
    position: "DE",
    classYear: "SR",
    starter: true,
    snapsShare: 75,
    grade: 81,
    eligibilityRemaining: 1,
    nilBand: "HIGH",
    riskFlags: ["Graduating (demo)"]
  },
  {
    id: "r10",
    name: "Mike Patterson",
    positionGroup: "DL",
    position: "DT",
    classYear: "JR",
    starter: true,
    snapsShare: 68,
    grade: 77,
    eligibilityRemaining: 2,
    nilBand: "MID",
    riskFlags: []
  },
  {
    id: "r11",
    name: "Jordan Carter",
    positionGroup: "LB",
    position: "MLB",
    classYear: "JR",
    starter: true,
    snapsShare: 88,
    grade: 83,
    eligibilityRemaining: 2,
    nilBand: "HIGH",
    riskFlags: []
  },
  {
    id: "r12",
    name: "Ryan Scott",
    positionGroup: "DB",
    position: "CB",
    classYear: "SO",
    starter: true,
    snapsShare: 80,
    grade: 74,
    eligibilityRemaining: 3,
    nilBand: "MID",
    riskFlags: ["Development (demo)"]
  }
];

export const SEED_NEEDS: RosterNeed[] = [
  {
    id: "n1",
    positionGroup: "OL",
    priority: "CRITICAL",
    reason: "2 starters graduating, depth thin. Need immediate impact OT.",
    currentDepth: 7,
    targetDepth: 10
  },
  {
    id: "n2",
    positionGroup: "DL",
    priority: "HIGH",
    reason: "Need EDGE rusher. Starting DE graduating.",
    currentDepth: 6,
    targetDepth: 9
  },
  {
    id: "n3",
    positionGroup: "QB",
    priority: "HIGH",
    reason: "Starter may transfer. Backup is inexperienced.",
    currentDepth: 2,
    targetDepth: 3
  },
  {
    id: "n4",
    positionGroup: "DB",
    priority: "MEDIUM",
    reason: "Corner depth needs upgrade for scheme fit.",
    currentDepth: 6,
    targetDepth: 8
  },
  {
    id: "n5",
    positionGroup: "WR",
    priority: "LOW",
    reason: "Good depth, but could add explosive playmaker.",
    currentDepth: 8,
    targetDepth: 9
  }
];

export const SEED_BUDGET: Budget = {
  totalNIL: 2500000,
  committed: 1800000,
  available: 700000,
  positionCaps: {
    QB: 400000,
    RB: 150000,
    WR: 300000,
    TE: 100000,
    OL: 500000,
    DL: 400000,
    LB: 200000,
    DB: 350000,
    ST: 100000
  }
};
