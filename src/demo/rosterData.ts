import { RosterPlayer, RosterNeed, Budget } from '@/types';

export const SEED_BUDGET: Budget = {
  nilTotalBand: "$250K–$500K (demo)",
  allocations: [
    { positionGroup: "QB", band: "$60K–$120K" },
    { positionGroup: "OL", band: "$70K–$140K" },
    { positionGroup: "DL", band: "$50K–$100K" },
    { positionGroup: "DB", band: "$40K–$80K" },
    { positionGroup: "WR", band: "$30K–$60K" }
  ],
  caps: [
    { positionGroup: "QB", max: "$150K" },
    { positionGroup: "OL", max: "$90K" },
    { positionGroup: "DL", max: "$75K" }
  ]
};

export const SEED_ROSTER: RosterPlayer[] = [
  { id: "r1", name: "Starter OT A", positionGroup: "OL", classYear: "SR", starter: true, snapsShare: 88, grade: 78, eligibilityRemaining: "0–1", nilBand: "MED", riskFlags: [] },
  { id: "r2", name: "OT Depth B", positionGroup: "OL", classYear: "SO", starter: false, snapsShare: 22, grade: 71, eligibilityRemaining: "2–3", nilBand: "LOW", riskFlags: [] },
  { id: "r3", name: "EDGE Starter", positionGroup: "DL", classYear: "JR", starter: true, snapsShare: 74, grade: 75, eligibilityRemaining: "1–2", nilBand: "MED", riskFlags: ["transfer_risk_demo"] },
  { id: "r4", name: "Nickel DB", positionGroup: "DB", classYear: "SR", starter: true, snapsShare: 67, grade: 73, eligibilityRemaining: "0–1", nilBand: "LOW", riskFlags: [] },
  { id: "r5", name: "WR1", positionGroup: "WR", classYear: "JR", starter: true, snapsShare: 81, grade: 80, eligibilityRemaining: "1–2", nilBand: "MED", riskFlags: [] }
];

export const SEED_NEEDS: RosterNeed[] = [
  { id: "n1", label: "OT Depth (Urgent)", positionGroup: "OL", priority: "MUST_REPLACE", reason: "Starter OT nearing eligibility end; depth snaps low." },
  { id: "n2", label: "EDGE Pressure (Upgrade)", positionGroup: "DL", priority: "UPGRADE", reason: "Need higher pressure rate vs top offenses." },
  { id: "n3", label: "Nickel DB Speed (Depth)", positionGroup: "DB", priority: "DEPTH", reason: "Rotation speed needed for tempo opponents." }
];
