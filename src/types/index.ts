export type Role = 'HC' | 'GM_RC' | 'COORDINATOR' | 'POSITION_COACH' | 'ANALYST_GA' | 'COMPLIANCE';

export type PositionGroup = "OL" | "DL" | "LB" | "DB" | "WR" | "RB" | "QB" | "TE" | "ST";
export type ClassYear = "FR" | "SO" | "JR" | "SR" | "GR";
export type Pool = "TRANSFER_PORTAL" | "JUCO" | "HS";
export type PlayerStatus = "NEW" | "UPDATED" | "WITHDRAWN";
export type Readiness = "HIGH" | "MED" | "LOW";
export type Risk = "LOW" | "MED" | "HIGH";
export type NILBand = "HIGH" | "MED" | "LOW";
export type NeedPriority = "MUST_REPLACE" | "UPGRADE" | "DEPTH";
export type VerificationStatus = "VERIFIED_OPT_IN" | "CLAIMED" | "UNVERIFIED";
export type ContactVisibility = "PUBLIC" | "GATED" | "HIDDEN";
export type CoachLevel = "FBS" | "FCS" | "D2" | "D3" | "JUCO" | "HS";
export type CoachRoleType = "HC" | "OC" | "DC" | "POSITION" | "ANALYST" | "RECRUITING";

export interface Player {
  id: string;
  name: string;
  position: string;
  positionGroup: PositionGroup;
  height: string;
  weight: string;
  classYear: ClassYear;
  eligibility: string;
  pool: Pool;
  originSchool: string;
  hometown: string;
  state: string;
  enteredAt: string;
  status: PlayerStatus;
  fitScore: number;
  readiness: Readiness;
  risk: Risk;
  reasons: string[];
  flags: string[];
  filmLinks: { label: string; url: string }[];
  nilRange?: { low: number; mid: number; high: number; rationale: string };
  reviewed?: boolean;
}

export type EventType =
  | "PORTAL_NEW"
  | "PORTAL_UPDATED"
  | "PORTAL_WITHDRAWN"
  | "TASK_CREATED"
  | "PLAYER_REVIEWED"
  | "CONTACT_REQUESTED"
  | "AGENT_QUERY"
  | "NETWORK_ACCESS_REQUESTED"
  | "OUTREACH_DRAFTED";

export interface DemoEvent {
  id: string;
  ts: string;
  type: EventType;
  playerId?: string;
  coachId?: string;
  message: string;
}

export interface Task {
  id: string;
  ts: string;
  title: string;
  owner: string;
  status: "OPEN" | "DONE";
  due?: string;
  playerId?: string;
}

export interface DemoUser {
  id: string;
  name: string;
  role: string;
}

export interface FeatureFlags {
  base_platform: boolean;
  daily_brief: boolean;
  portal_live: boolean;
  players_module: boolean;
  player_profile: boolean;
  tasks_module: boolean;
  program_dna: boolean;
  audit_logging: boolean;
  compliance_guardrails: boolean;
  coach_agent: boolean;
  memory_engine: boolean;
  alerts_realtime: boolean;
  sms_daily: boolean;
  coach_network_pro: boolean;
  enterprise_institutional: boolean;
  api_licensing: boolean;
  film_ai: boolean;
  nil_engine: boolean;
  roster_module: boolean;
  fit_lab: boolean;
}

export interface ProgramDNA {
  program: string;
  recruitingPriorities: string[];
  schemeNotes: {
    offense: string;
    defense: string;
  };
  fitRules: string[];
}

export interface RosterPlayer {
  id: string;
  name: string;
  positionGroup: PositionGroup;
  classYear: ClassYear;
  starter: boolean;
  snapsShare: number;
  grade: number;
  eligibilityRemaining: string;
  nilBand: NILBand;
  riskFlags: string[];
}

export interface RosterNeed {
  id: string;
  label: string;
  positionGroup: PositionGroup;
  priority: NeedPriority;
  reason: string;
}

export interface BudgetAllocation {
  positionGroup: PositionGroup;
  band: string;
}

export interface BudgetCap {
  positionGroup: PositionGroup;
  max: string;
}

export interface Budget {
  nilTotalBand: string;
  allocations: BudgetAllocation[];
  caps: BudgetCap[];
}

export interface ContactMethod {
  type: "email" | "phone" | "twitter";
  value: string;
  visibility: ContactVisibility;
}

export interface Coach {
  id: string;
  name: string;
  roleTitle: string;
  roleType: CoachRoleType;
  program: string;
  level: CoachLevel;
  state: string;
  verificationStatus: VerificationStatus;
  contactMethods: ContactMethod[];
  bio?: string;
  yearsExperience?: number;
}

export interface ContactAccessRequest {
  id: string;
  coachId: string;
  requesterId: string;
  ts: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  reason?: string;
}

export interface OutreachLog {
  id: string;
  coachId: string;
  mode: "email" | "sms";
  ts: string;
  draftContent: string;
}

export interface AppState {
  demoAuthed: boolean;
  demoRole: Role | null;
  programId: string | null;
  flags: FeatureFlags;
  players: Player[];
  events: DemoEvent[];
  tasks: Task[];
  userList: DemoUser[];
  programDNA: ProgramDNA;
  roster: RosterPlayer[];
  needs: RosterNeed[];
  budget: Budget;
  selectedNeedId: string | null;
  selectedProspectId: string | null;
  coaches: Coach[];
  contactAccessRequests: ContactAccessRequest[];
  outreachLogs: OutreachLog[];
}
