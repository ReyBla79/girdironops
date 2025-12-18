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
  { id: "r1", name: "Starter OT A", positionGroup: "OL", year: "SR", gradYear: 2025, nilBand: "MED", estimatedCost: 45000, role: "STARTER", snapsShare: 88, risk: "LOW" },
  { id: "r2", name: "OT Depth B", positionGroup: "OL", year: "SO", gradYear: 2027, nilBand: "LOW", estimatedCost: 15000, role: "DEPTH", snapsShare: 22, risk: "NONE" },
  { id: "r3", name: "EDGE Starter", positionGroup: "DL", year: "JR", gradYear: 2026, nilBand: "MED", estimatedCost: 55000, role: "STARTER", snapsShare: 74, risk: "MED" },
  { id: "r4", name: "Nickel DB", positionGroup: "DB", year: "SR", gradYear: 2025, nilBand: "LOW", estimatedCost: 25000, role: "STARTER", snapsShare: 67, risk: "NONE" },
  { id: "r5", name: "WR1", positionGroup: "WR", year: "JR", gradYear: 2026, nilBand: "MED", estimatedCost: 50000, role: "STARTER", snapsShare: 81, risk: "NONE" },
  { id: "r12", name: "Starting OT", positionGroup: "OL", year: "SR", gradYear: 2026, nilBand: "HIGH", estimatedCost: 95000, role: "STARTER", snapsShare: 82, risk: "NONE" }
];

export const SEED_NEEDS: RosterNeed[] = [
  { id: "n1", label: "OT Depth (Urgent)", positionGroup: "OL", priority: "MUST_REPLACE", reason: "Starter OT nearing eligibility end; depth snaps low." },
  { id: "n2", label: "EDGE Pressure (Upgrade)", positionGroup: "DL", priority: "UPGRADE", reason: "Need higher pressure rate vs top offenses." },
  { id: "n3", label: "Nickel DB Speed (Depth)", positionGroup: "DB", priority: "DEPTH", reason: "Rotation speed needed for tempo opponents." }
];
