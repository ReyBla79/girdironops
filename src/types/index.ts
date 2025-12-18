export type Role = 'HC' | 'GM_RC' | 'COORDINATOR' | 'ANALYST_GA' | 'COMPLIANCE';

export type PositionGroup = "OL" | "DL" | "LB" | "DB" | "WR" | "RB" | "QB" | "TE" | "ST";
export type ClassYear = "FR" | "SO" | "JR" | "SR" | "GR";
export type Pool = "TRANSFER_PORTAL" | "JUCO" | "HS";
export type PlayerStatus = "NEW" | "UPDATED" | "WITHDRAWN";
export type Readiness = "HIGH" | "MED" | "LOW";
export type Risk = "LOW" | "MED" | "HIGH";

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
  | "AGENT_QUERY";

export interface DemoEvent {
  id: string;
  ts: string;
  type: EventType;
  playerId?: string;
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
}
