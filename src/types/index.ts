export type Role = 'HC' | 'GM' | 'Assistant' | 'Analyst' | 'Compliance' | 'Admin';

export interface Player {
  id: string;
  name: string;
  position: string;
  positionGroup: string;
  size: string;
  eligibility: string;
  origin: string;
  pool: 'Transfer' | 'HS' | 'JUCO';
  fitScore: number;
  readinessScore: number;
  riskScore: number;
  reasons: string[];
  flags: string[];
  filmLinks: string[];
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  type: 'portal_entry' | 'portal_update' | 'portal_withdrawn' | 'task_created' | 'player_reviewed' | 'contact_requested';
  playerId?: string;
  playerName?: string;
  description: string;
  timestamp: string;
  userId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  playerId?: string;
  playerName?: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface DemoUser {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface FeatureFlags {
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

export interface AppState {
  demoAuthed: boolean;
  demoRole: Role | null;
  programId: string | null;
  flags: FeatureFlags;
  players: Player[];
  events: Event[];
  tasks: Task[];
  userList: DemoUser[];
}
