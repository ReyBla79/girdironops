export type FilmType = 'game' | 'practice' | 'scrimmage';
export type FilmStatus = 'Pending' | 'Processing' | 'Processed' | 'Error';
export type PlayType = 'RUN' | 'PASS' | 'RPO' | 'PA' | 'SCREEN' | 'ST';
export type TrendDirection = 'UP' | 'DOWN' | 'FLAT';
export type TagSource = 'ai' | 'coach';

export interface FilmTimelineFilters {
  quarter: string;
  down: string;
  playType: string;
  concept: string;
}

export interface PlayOverlays {
  showTracks: boolean;
  showSpeedTrails: boolean;
  showAssignments: boolean;
}

export interface FilmAsset {
  filmId: string;
  title: string;
  type: FilmType;
  opponent: string;
  date: string;
  angles: string[];
  status: FilmStatus;
  confidence: string;
  playsDetected: number;
}

export interface FilmPlayer {
  playerId: string;
  name: string;
  pos: string;
  year: string;
}

export interface PlayResult {
  type: string;
  yards: number;
}

export interface Play {
  playId: string;
  filmId: string;
  clock: string;
  quarter: number;
  down: number;
  distance: number;
  yardline: number;
  aiPlayType: PlayType | string;
  aiConcept: string;
  formation: string;
  motion: string;
  defShell: string;
  pressure: string;
  confidence: number;
  result: PlayResult;
}

export interface PlayTag {
  tag: string;
  source: TagSource;
}

export interface TrackingPlayer {
  playerId: string;
  maxSpeed: number;
  distance: number;
  avgSpeed: number;
}

export interface TrackingSummary {
  teamMaxSpeedYdsPerSec?: number;
  rbMaxSpeedYdsPerSec?: number;
  closingSpeedTopDefender?: number;
  avgSpacingYards?: number;
  qbTimeToThrowSec?: number;
  wr1TopSpeedYdsPerSec?: number;
  separationAtTargetYards?: number;
}

export interface TrackingData {
  confidence: number;
  summary: TrackingSummary;
  players: TrackingPlayer[];
  heatmaps?: {
    runDirection?: number[][];
  };
}

export interface AssignmentFlag {
  type: string;
  playerId: string;
  reason: string;
}

export interface AssignmentInference {
  confidence: number;
  notes: string[];
  flags: AssignmentFlag[];
}

export interface AnalyticsItem {
  label: string;
  value: number;
}

export interface FilmAnalytics {
  runPass: AnalyticsItem[];
  conceptFreq: AnalyticsItem[];
  defShells: AnalyticsItem[];
  runDirectionHeat: number[][];
  targetZoneHeat: number[][];
}

export interface ReportSection {
  heading: string;
  bullets: string[];
}

export interface GeneratedReport {
  title: string;
  sections: ReportSection[];
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

export interface OpsGmFilmContext {
  note: string;
  filmAssetsRef: string;
  playsRef: string;
  analyticsRef: string;
  sampleInsights: string[];
}

export interface FilmDemoData {
  filmAssets: FilmAsset[];
  players: FilmPlayer[];
  plays: Play[];
  playTags: Record<string, PlayTag[]>;
  trackingByPlay: Record<string, TrackingData>;
  assignmentInferenceByPlay: Record<string, AssignmentInference>;
  aiNotesByPlay: Record<string, string[]>;
  recommendedActionsByPlay: Record<string, string[]>;
  analytics: FilmAnalytics;
  reportTemplates: { demoReport: GeneratedReport };
  opponentOptions: string[];
  playTypeOptions: string[];
  posters: Record<string, string>;
  opsGmFilmContext: OpsGmFilmContext;
}
