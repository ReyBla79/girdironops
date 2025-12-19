import type { GeoHeat, PipelinePin, Pipeline, PipelineAlert, StaffOwner, PipelineDetail, PipelineUIState, PipelineTiers } from '@/types/pipeline';

export const DEFAULT_PIPELINE_UI: PipelineUIState = {
  mapViewMode: 'STATES',
  mapPositionFilter: 'ALL',
  pipelineSearch: '',
  selectedGeoId: 'TX',
  selectedPipelineId: 'pl_tx_dallas_ol',
  drawerOpen: false,
  drawerTab: 'OVERVIEW',
};

export const DEFAULT_PIPELINE_TIERS: PipelineTiers = {
  tier: 'CORE',
  tierOrder: ['CORE', 'GM', 'ELITE'],
};

export const SEED_GEO_HEAT: GeoHeat[] = [
  { geoId: 'TX', label: 'Texas', energyScore: 88, statusBand: 'HOT', pipelineCount: 7, activeRecruits: 21, alertsOpen: 2, budgetExposure: 420000, roiScore: 77, topPositionGroup: 'OL', forecastVolatility: { y1: 'LOW', y2: 'MED', y3: 'MED' } },
  { geoId: 'FL', label: 'Florida', energyScore: 79, statusBand: 'WARM', pipelineCount: 6, activeRecruits: 18, alertsOpen: 1, budgetExposure: 360000, roiScore: 72, topPositionGroup: 'DB', forecastVolatility: { y1: 'LOW', y2: 'LOW', y3: 'MED' } },
  { geoId: 'CA', label: 'California', energyScore: 61, statusBand: 'WARM', pipelineCount: 4, activeRecruits: 9, alertsOpen: 3, budgetExposure: 310000, roiScore: 60, topPositionGroup: 'DB', forecastVolatility: { y1: 'MED', y2: 'MED', y3: 'HIGH' } },
  { geoId: 'GA', label: 'Georgia', energyScore: 84, statusBand: 'WARM', pipelineCount: 5, activeRecruits: 15, alertsOpen: 2, budgetExposure: 280000, roiScore: 75, topPositionGroup: 'DL', forecastVolatility: { y1: 'LOW', y2: 'MED', y3: 'MED' } },
  { geoId: 'OH', label: 'Ohio', energyScore: 52, statusBand: 'NEUTRAL', pipelineCount: 3, activeRecruits: 6, alertsOpen: 1, budgetExposure: 150000, roiScore: 58, topPositionGroup: 'LB', forecastVolatility: { y1: 'LOW', y2: 'LOW', y3: 'MED' } },
  { geoId: 'LA', label: 'Louisiana', energyScore: 73, statusBand: 'WARM', pipelineCount: 3, activeRecruits: 8, alertsOpen: 1, budgetExposure: 210000, roiScore: 70, topPositionGroup: 'WR', forecastVolatility: { y1: 'LOW', y2: 'MED', y3: 'MED' } },
  { geoId: 'AZ', label: 'Arizona', energyScore: 39, statusBand: 'COLD', pipelineCount: 2, activeRecruits: 3, alertsOpen: 1, budgetExposure: 90000, roiScore: 44, topPositionGroup: 'WR', forecastVolatility: { y1: 'MED', y2: 'MED', y3: 'HIGH' } },
  { geoId: 'NV', label: 'Nevada', energyScore: 92, statusBand: 'HOT', pipelineCount: 4, activeRecruits: 12, alertsOpen: 0, budgetExposure: 180000, roiScore: 85, topPositionGroup: 'ALL', forecastVolatility: { y1: 'LOW', y2: 'LOW', y3: 'LOW' } },
];

export const SEED_PIPELINE_PINS: PipelinePin[] = [
  {
    pipelineId: 'pl_tx_dallas_ol',
    name: 'Dallas Metro OL',
    level: 'REGION',
    positionGroup: 'OL',
    geoId: 'TX',
    x: 640,
    y: 300,
    pipelineScore: 82,
    status: 'STRONG',
    trend: 'UP',
    activeRecruits: 4,
    playersSignedLast5Years: 6,
    alertsOpen: 1,
    budgetModifier: 0.95,
    roiScore: 81,
    ownerStaffId: 's_ol'
  },
  {
    pipelineId: 'pl_fl_tampa_db',
    name: 'Tampa Bay DB',
    level: 'REGION',
    positionGroup: 'DB',
    geoId: 'FL',
    x: 870,
    y: 460,
    pipelineScore: 78,
    status: 'STRONG',
    trend: 'UP',
    activeRecruits: 3,
    playersSignedLast5Years: 4,
    alertsOpen: 0,
    budgetModifier: 0.95,
    roiScore: 74,
    ownerStaffId: 's_db'
  },
  {
    pipelineId: 'pl_ca_socal_db',
    name: 'SoCal DB',
    level: 'REGION',
    positionGroup: 'DB',
    geoId: 'CA',
    x: 180,
    y: 370,
    pipelineScore: 61,
    status: 'COOLING',
    trend: 'DOWN',
    activeRecruits: 2,
    playersSignedLast5Years: 3,
    alertsOpen: 2,
    budgetModifier: 1.05,
    roiScore: 60,
    ownerStaffId: 's_rc'
  },
  {
    pipelineId: 'pl_ga_atl_dl',
    name: 'Atlanta DL',
    level: 'REGION',
    positionGroup: 'DL',
    geoId: 'GA',
    x: 840,
    y: 420,
    pipelineScore: 84,
    status: 'STRONG',
    trend: 'UP',
    activeRecruits: 3,
    playersSignedLast5Years: 5,
    alertsOpen: 1,
    budgetModifier: 0.95,
    roiScore: 79,
    ownerStaffId: 's_dl'
  },
  {
    pipelineId: 'pl_oh_cincy_lb',
    name: 'Cincinnati LB',
    level: 'REGION',
    positionGroup: 'LB',
    geoId: 'OH',
    x: 760,
    y: 310,
    pipelineScore: 52,
    status: 'COOLING',
    trend: 'DOWN',
    activeRecruits: 2,
    playersSignedLast5Years: 2,
    alertsOpen: 1,
    budgetModifier: 1.05,
    roiScore: 55,
    ownerStaffId: 's_lb'
  },
  {
    pipelineId: 'pl_nv_vegas_all',
    name: 'Las Vegas Metro',
    level: 'REGION',
    positionGroup: 'ALL',
    geoId: 'NV',
    x: 200,
    y: 290,
    pipelineScore: 91,
    status: 'STRONG',
    trend: 'UP',
    activeRecruits: 8,
    playersSignedLast5Years: 10,
    alertsOpen: 0,
    budgetModifier: 0.85,
    roiScore: 88,
    ownerStaffId: 's_rc'
  },
];

export const SEED_PIPELINES: Pipeline[] = [
  { pipelineId: 'pl_tx_dallas_ol', name: 'Dallas Metro OL', level: 'REGION', positionGroup: 'OL', pipelineScore: 82, status: 'STRONG', trend: 'UP', playersSignedLast5Years: 6, activeRecruits: 4, alertsOpen: 1 },
  { pipelineId: 'pl_fl_tampa_db', name: 'Tampa Bay DB', level: 'REGION', positionGroup: 'DB', pipelineScore: 78, status: 'STRONG', trend: 'UP', playersSignedLast5Years: 4, activeRecruits: 3, alertsOpen: 0 },
  { pipelineId: 'pl_ca_socal_db', name: 'SoCal DB', level: 'REGION', positionGroup: 'DB', pipelineScore: 61, status: 'COOLING', trend: 'DOWN', playersSignedLast5Years: 3, activeRecruits: 2, alertsOpen: 2 },
  { pipelineId: 'pl_ga_atl_dl', name: 'Atlanta DL', level: 'REGION', positionGroup: 'DL', pipelineScore: 84, status: 'STRONG', trend: 'UP', playersSignedLast5Years: 5, activeRecruits: 3, alertsOpen: 1 },
  { pipelineId: 'pl_oh_cincy_lb', name: 'Cincinnati LB', level: 'REGION', positionGroup: 'LB', pipelineScore: 52, status: 'COOLING', trend: 'DOWN', playersSignedLast5Years: 2, activeRecruits: 2, alertsOpen: 1 },
  { pipelineId: 'pl_nv_vegas_all', name: 'Las Vegas Metro', level: 'REGION', positionGroup: 'ALL', pipelineScore: 91, status: 'STRONG', trend: 'UP', playersSignedLast5Years: 10, activeRecruits: 8, alertsOpen: 0 },
];

export const SEED_PIPELINE_ALERTS: PipelineAlert[] = [
  {
    alertId: 'a1',
    pipelineId: 'pl_ca_socal_db',
    geoId: 'CA',
    severity: 'HIGH',
    title: 'Pipeline Cooling',
    message: 'SoCal DB activity down 34% over 60 days. Two competitors increased offer volume.',
    recommendedAction: 'Schedule HS coach touchpoint + spring eval visit.'
  },
  {
    alertId: 'a2',
    pipelineId: 'pl_tx_dallas_ol',
    geoId: 'TX',
    severity: 'MED',
    title: 'Touchpoint Lag',
    message: 'Dallas Metro OL: last contact 26 days ago. Maintain cadence to protect advantage.',
    recommendedAction: 'Owner to log contact within 7 days.'
  },
  {
    alertId: 'a3',
    pipelineId: 'pl_ga_atl_dl',
    geoId: 'GA',
    severity: 'MED',
    title: 'Rival Pressure',
    message: 'Atlanta DL: competitor activity trending up. Keep visits scheduled.',
    recommendedAction: 'Confirm 2 eval windows + re-activate top 3 targets.'
  }
];

export const SEED_STAFF_OWNERS: StaffOwner[] = [
  { staffId: 's_ol', name: 'OL Coach', role: 'Position Coach' },
  { staffId: 's_db', name: 'DB Coach', role: 'Position Coach' },
  { staffId: 's_dl', name: 'DL Coach', role: 'Position Coach' },
  { staffId: 's_lb', name: 'LB Coach', role: 'Position Coach' },
  { staffId: 's_rc', name: 'Recruiting Coordinator', role: 'Recruiting' }
];

export const SEED_PIPELINE_DETAILS: Record<string, PipelineDetail> = {
  'pl_tx_dallas_ol': {
    pipelineId: 'pl_tx_dallas_ol',
    name: 'Dallas Metro OL',
    scoreFactors: {
      historicalSuccess: 88,
      recentActivity: 79,
      relationshipDepth: 84,
      competitionPressure: 65,
      retentionOutcome: 80,
      momentum: 86
    },
    trendHistory: [
      { month: 'Jan', score: 74 },
      { month: 'Feb', score: 76 },
      { month: 'Mar', score: 78 },
      { month: 'Apr', score: 80 },
      { month: 'May', score: 82 }
    ]
  },
  'pl_nv_vegas_all': {
    pipelineId: 'pl_nv_vegas_all',
    name: 'Las Vegas Metro',
    scoreFactors: {
      historicalSuccess: 92,
      recentActivity: 95,
      relationshipDepth: 90,
      competitionPressure: 40,
      retentionOutcome: 88,
      momentum: 94
    },
    trendHistory: [
      { month: 'Jan', score: 85 },
      { month: 'Feb', score: 87 },
      { month: 'Mar', score: 89 },
      { month: 'Apr', score: 90 },
      { month: 'May', score: 91 }
    ]
  },
};

// Pipeline-related feature flags
export const PIPELINE_FLAGS = {
  pipeline_intelligence: true,
  pipeline_map: true,
  pipeline_scoring: true,
  pipeline_alerts: true,
  overlay_strength: true,
  overlay_budget: true,
  overlay_forecast: true,
  overlay_ownership: false,
  overlay_roi: false,
  ops_gm_region_brief: true,
};
