export type FilmType = 'GAME' | 'PRACTICE' | 'SCRIMMAGE';
export type FilmStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'ERROR';
export type PlayType = 'RUN' | 'PASS' | 'RPO' | 'PLAY_ACTION' | 'SPECIAL_TEAMS';
export type TrendDirection = 'UP' | 'DOWN' | 'FLAT';

export interface FilmAsset {
  id: string;
  title: string;
  type: FilmType;
  opponent: string;
  date: string;
  angles: string[];
  status: FilmStatus;
  confidence: number;
  playsDetected: number;
}

export interface AssignmentGrade {
  player: string;
  task: string;
  grade: string;
}

export interface AssignmentInference {
  bustDetected: boolean;
  bustReason?: string;
  assignments: AssignmentGrade[];
}

export interface TrackingSummary {
  avgSpeed: number;
  maxSpeed: number;
  totalDistance: number;
  topPlayer: string;
}

export interface Play {
  playId: string;
  filmId: string;
  quarter: number;
  clock: string;
  down: number;
  distance: number;
  yardline: number;
  aiPlayType: PlayType | string;
  aiConcept: string;
  defShell: string;
  confidence: number;
  tags: string[];
  aiNotes: string;
  recommendedActions: string[];
  poster: string;
  trackingSummary?: TrackingSummary;
  assignmentInference?: AssignmentInference;
}

export interface FilmAnalytics {
  runPass: { run: number; pass: number };
  conceptFreq: { concept: string; count: number }[];
  runDirectionHeat: { left: number; middle: number; right: number };
  targetZoneHeat: Record<string, number>;
  defShells: { shell: string; count: number }[];
}

export interface PlayerDevelopment {
  playerId: string;
  name: string;
  position: string;
  weeklyTrend: TrendDirection;
  issues: string[];
  drills: string[];
  progressScore: number;
}

export interface ReportSection {
  heading: string;
  bullets: string[];
}

export interface GeneratedReport {
  title: string;
  generatedAt: string;
  sections: ReportSection[];
}

export interface FilmUIState {
  filmTimelineFilters: {
    quarter: string;
    down: string;
    playType: string;
    concept: string;
  };
  playOverlays: {
    showTracks: boolean;
    showSpeedTrails: boolean;
    showAssignments: boolean;
  };
  opsGmPrompt: string;
  reportBuilder: {
    opponent: string;
    situations: string[];
    includeClips: boolean;
  };
}

export interface FilmCutup {
  plays: string[];
}

export interface FilmFeatureFlags {
  film_intelligence: boolean;
  film_upload: boolean;
  film_auto_tag: boolean;
  film_clip_builder: boolean;
  film_tracking_pro: boolean;
  film_analytics_pro: boolean;
  film_playbook_elite: boolean;
  film_assignment_inference_elite: boolean;
  film_player_dev_elite: boolean;
}
