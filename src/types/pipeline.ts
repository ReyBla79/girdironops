export type PipelineTier = 'CORE' | 'GM' | 'ELITE';

export type StatusBand = 'HOT' | 'WARM' | 'NEUTRAL' | 'COLD' | 'DEAD';

export type PipelineStatus = 'STRONG' | 'COOLING' | 'EMERGING' | 'DORMANT';

export type TrendDirection = 'UP' | 'DOWN' | 'FLAT';

export type ForecastVolatility = 'LOW' | 'MED' | 'HIGH';

export type AlertSeverity = 'HIGH' | 'MED' | 'LOW';

export interface GeoHeat {
  geoId: string;
  label: string;
  energyScore: number;
  statusBand: StatusBand;
  pipelineCount: number;
  activeRecruits: number;
  alertsOpen: number;
  budgetExposure: number;
  roiScore: number;
  topPositionGroup: string;
  forecastVolatility: {
    y1: ForecastVolatility;
    y2: ForecastVolatility;
    y3: ForecastVolatility;
  };
  cx?: number; // centroid x (SVG coords)
  cy?: number; // centroid y (SVG coords)
}

export interface PipelinePin {
  pipelineId: string;
  name: string;
  level: string;
  positionGroup: string;
  geoId: string;
  x: number;
  y: number;
  pipelineScore: number;
  status: PipelineStatus;
  trend: TrendDirection;
  activeRecruits: number;
  playersSignedLast5Years: number;
  alertsOpen: number;
  budgetModifier: number;
  roiScore: number;
  ownerStaffId: string;
}

export interface Pipeline {
  pipelineId: string;
  name: string;
  level: string;
  positionGroup: string;
  pipelineScore: number;
  status: PipelineStatus;
  trend: TrendDirection;
  playersSignedLast5Years: number;
  activeRecruits: number;
  alertsOpen: number;
}

export interface PipelineAlert {
  alertId: string;
  pipelineId: string;
  geoId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  recommendedAction: string;
}

export interface StaffOwner {
  staffId: string;
  name: string;
  role: string;
}

export interface PipelineScoreFactors {
  historicalSuccess: number;
  recentActivity: number;
  relationshipDepth: number;
  competitionPressure: number;
  retentionOutcome: number;
  momentum: number;
}

export interface TrendHistoryPoint {
  month: string;
  score: number;
}

export interface PipelineDetail {
  pipelineId: string;
  name: string;
  scoreFactors: PipelineScoreFactors;
  trendHistory: TrendHistoryPoint[];
}

export interface PipelineUIState {
  mapViewMode: 'STATES' | 'PINS';
  mapPositionFilter: string;
  pipelineSearch: string;
  selectedGeoId: string | null;
  selectedPipelineId: string | null;
  drawerOpen: boolean;
  drawerTab: 'OVERVIEW' | 'PIPELINES' | 'ALERTS' | 'BUDGET_ROI' | 'OWNERSHIP' | 'FORECAST';
}

export interface PipelineTiers {
  tier: PipelineTier;
  tierOrder: PipelineTier[];
}

export interface PipelineState {
  pipelineUI: PipelineUIState;
  pipelineTiers: PipelineTiers;
  geoHeat: GeoHeat[];
  pipelinePins: PipelinePin[];
  pipelines: Pipeline[];
  pipelineAlerts: PipelineAlert[];
  staffOwners: StaffOwner[];
  pipelineDetails: Record<string, PipelineDetail>;
}
