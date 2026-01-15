# Recruiting Radar - Complete Code Export

This file contains all the source code for the "Recruiting Radar" feature (Pipeline Map and related components).

---

## Table of Contents
1. [Types](#types)
2. [Demo Data](#demo-data)
3. [Position Config](#position-config)
4. [Pages](#pages)
5. [Pipeline Components](#pipeline-components)
6. [3D Map Components](#3d-map-components)

---

## Types

### src/types/pipeline.ts
```typescript
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
```

---

## Demo Data

### src/demo/pipelineData.ts
```typescript
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
  { geoId: 'TX', label: 'Texas', energyScore: 88, statusBand: 'HOT', pipelineCount: 7, activeRecruits: 21, alertsOpen: 2, budgetExposure: 420000, roiScore: 77, topPositionGroup: 'OL', forecastVolatility: { y1: 'LOW', y2: 'MED', y3: 'MED' }, cx: 520, cy: 380 },
  { geoId: 'FL', label: 'Florida', energyScore: 79, statusBand: 'WARM', pipelineCount: 6, activeRecruits: 18, alertsOpen: 1, budgetExposure: 360000, roiScore: 72, topPositionGroup: 'DB', forecastVolatility: { y1: 'LOW', y2: 'LOW', y3: 'MED' }, cx: 870, cy: 450 },
  { geoId: 'CA', label: 'California', energyScore: 61, statusBand: 'WARM', pipelineCount: 4, activeRecruits: 9, alertsOpen: 3, budgetExposure: 310000, roiScore: 60, topPositionGroup: 'DB', forecastVolatility: { y1: 'MED', y2: 'MED', y3: 'HIGH' }, cx: 150, cy: 300 },
  { geoId: 'GA', label: 'Georgia', energyScore: 84, statusBand: 'WARM', pipelineCount: 5, activeRecruits: 15, alertsOpen: 2, budgetExposure: 280000, roiScore: 75, topPositionGroup: 'DL', forecastVolatility: { y1: 'LOW', y2: 'MED', y3: 'MED' }, cx: 820, cy: 360 },
  { geoId: 'OH', label: 'Ohio', energyScore: 52, statusBand: 'NEUTRAL', pipelineCount: 3, activeRecruits: 6, alertsOpen: 1, budgetExposure: 150000, roiScore: 58, topPositionGroup: 'LB', forecastVolatility: { y1: 'LOW', y2: 'LOW', y3: 'MED' }, cx: 760, cy: 240 },
  { geoId: 'LA', label: 'Louisiana', energyScore: 73, statusBand: 'WARM', pipelineCount: 3, activeRecruits: 8, alertsOpen: 1, budgetExposure: 210000, roiScore: 70, topPositionGroup: 'WR', forecastVolatility: { y1: 'LOW', y2: 'MED', y3: 'MED' }, cx: 620, cy: 400 },
  { geoId: 'AZ', label: 'Arizona', energyScore: 39, statusBand: 'COLD', pipelineCount: 2, activeRecruits: 3, alertsOpen: 1, budgetExposure: 90000, roiScore: 44, topPositionGroup: 'WR', forecastVolatility: { y1: 'MED', y2: 'MED', y3: 'HIGH' }, cx: 280, cy: 350 },
  { geoId: 'NV', label: 'Nevada', energyScore: 92, statusBand: 'HOT', pipelineCount: 4, activeRecruits: 12, alertsOpen: 0, budgetExposure: 180000, roiScore: 85, topPositionGroup: 'ALL', forecastVolatility: { y1: 'LOW', y2: 'LOW', y3: 'LOW' }, cx: 220, cy: 260 },
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
```

---

## Position Config

### src/demo/positionConfig.ts
```typescript
// Position filter options
export const POSITION_OPTIONS = [
  'ALL',
  'QB', 'RB', 'FB', 'WR', 'TE',
  'LT', 'LG', 'C', 'RG', 'RT', 'OL',
  'DE', 'DT', 'NT', 'EDGE', 'DL',
  'ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB',
  'CB', 'NB', 'S', 'FS', 'SS', 'DB',
  'K', 'P', 'LS', 'H', 'KR', 'PR', 'GUN', 'PP',
];

// Position group options
export const POSITION_GROUP_OPTIONS = [
  'ALL',
  'OFFENSE', 'DEFENSE', 'SPECIAL_TEAMS',
  'SKILL', 'OL', 'DL', 'EDGE', 'LB', 'DB',
];

// Position group to positions mapping
export const POSITION_GROUP_MAP: Record<string, string[]> = {
  OFFENSE: ['QB', 'RB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL'],
  SKILL: ['QB', 'RB', 'FB', 'WR', 'TE'],
  OL: ['LT', 'LG', 'C', 'RG', 'RT', 'OL'],
  DEFENSE: ['DE', 'DT', 'NT', 'EDGE', 'DL', 'ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB', 'CB', 'NB', 'S', 'FS', 'SS', 'DB'],
  DL: ['DT', 'NT', 'DL'],
  EDGE: ['DE', 'EDGE'],
  LB: ['ILB', 'OLB', 'MLB', 'MIKE', 'WILL', 'SAM', 'LB'],
  DB: ['CB', 'NB', 'S', 'FS', 'SS', 'DB'],
  SPECIAL_TEAMS: ['K', 'P', 'LS', 'H', 'KR', 'PR', 'GUN', 'PP'],
};

// Helper to check if a position matches a filter (handles both individual positions and groups)
export function positionMatchesFilter(position: string, filter: string): boolean {
  if (filter === 'ALL') return true;
  
  // Check if filter is a position group
  if (POSITION_GROUP_MAP[filter]) {
    return POSITION_GROUP_MAP[filter].includes(position);
  }
  
  // Direct position match
  return position === filter;
}

// Get display label for a filter option
export function getPositionFilterLabel(value: string): string {
  if (value === 'ALL') return 'All Positions';
  if (POSITION_GROUP_MAP[value]) return `${value} (Group)`;
  return value;
}
```

---

## Pages

### src/pages/PipelineMapPage.tsx
```tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List, LayoutDashboard } from 'lucide-react';
import USMapSVG from '@/components/pipeline/USMapSVG';
import USPipelineHeatMapWebGL_ESPN from '@/components/maps/USPipelineHeatMapWebGL_ESPN';
import PipelineMapToolbar from '@/components/pipeline/PipelineMapToolbar';
import PipelinePins from '@/components/pipeline/PipelinePins';
import MapDrawer from '@/components/pipeline/MapDrawer';
import TierBanner from '@/components/pipeline/TierBanner';
import DemoTierSwitcher from '@/components/DemoTierSwitcher';
import { useAppStore } from '@/store/useAppStore';
import { SEED_GEO_HEAT, SEED_PIPELINE_PINS, SEED_PIPELINE_ALERTS, SEED_STAFF_OWNERS } from '@/demo/pipelineData';
import { positionMatchesFilter } from '@/demo/positionConfig';

type OverlayMode = 'strength' | 'alerts' | 'budget' | 'roi';

// ESPN Theme for 3D map
const ESPN_THEME = {
  palette: {
    bg: '#05060a',
    glass: 'rgba(20,25,35,0.85)',
    rim: '#39b6ff',
    hot: '#ff4136',
    warm: '#ff851b',
    neutral: '#ffdc00',
    cold: '#0074d9',
    dead: '#2d3748',
  },
};

const PipelineMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { tiers } = useAppStore();
  const [mapViewMode, setMapViewMode] = useState<'STATES' | 'PINS'>('STATES');
  const [mapDimension, setMapDimension] = useState<'2D' | '3D'>('2D');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlays, setOverlays] = useState({
    strength: true,
    alerts: false,
    budget: false,
    forecast: false,
    ownership: false,
    roi: false,
  });

  const currentTier = tiers.tier;

  // Determine active overlay mode based on toggles
  const activeOverlay: OverlayMode = useMemo(() => {
    if (overlays.roi) return 'roi';
    if (overlays.budget) return 'budget';
    if (overlays.alerts) return 'alerts';
    return 'strength';
  }, [overlays]);

  const selectedGeo = useMemo(() => 
    SEED_GEO_HEAT.find(g => g.geoId === selectedGeoId) || null,
    [selectedGeoId]
  );

  const filteredPins = useMemo(() => {
    let pins = SEED_PIPELINE_PINS;
    if (positionFilter !== 'ALL') {
      pins = pins.filter(p => positionMatchesFilter(p.positionGroup, positionFilter));
    }
    if (search) {
      pins = pins.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return pins;
  }, [positionFilter, search]);

  const geoPipelines = useMemo(() => 
    selectedGeoId ? SEED_PIPELINE_PINS.filter(p => p.geoId === selectedGeoId) : [],
    [selectedGeoId]
  );

  const geoAlerts = useMemo(() => 
    selectedGeoId ? SEED_PIPELINE_ALERTS.filter(a => a.geoId === selectedGeoId) : [],
    [selectedGeoId]
  );

  const handleStateClick = (geoId: string) => {
    setSelectedGeoId(geoId);
    setDrawerOpen(true);
  };

  const handlePinClick = (pipelineId: string) => {
    navigate(`/app/pipelines/${pipelineId}`);
  };

  const toggleOverlay = (key: keyof typeof overlays) => {
    // For mutually exclusive overlays (strength, alerts, budget, roi)
    const mutuallyExclusive = ['strength', 'alerts', 'budget', 'roi'];
    if (mutuallyExclusive.includes(key)) {
      setOverlays(prev => ({
        ...prev,
        strength: key === 'strength',
        alerts: key === 'alerts',
        budget: key === 'budget',
        roi: key === 'roi',
        forecast: prev.forecast,
        ownership: prev.ownership,
      }));
    } else {
      setOverlays(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Recruiting Radar</h1>
          <p className="text-muted-foreground text-sm">
            US pipeline heat map — hot zones, cooling zones, alerts, and ROI overlays.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/pipelines')}>
            <List className="w-4 h-4 mr-2" />
            Pipeline List
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/gm')}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            GM Center
          </Button>
        </div>
      </div>

      <DemoTierSwitcher />

      <TierBanner 
        text="Demo Tier: CORE (Strength + Alerts). GM Tier unlocks Budget/Forecast overlays. ELITE unlocks Ownership/ROI overlays + advanced Ops GM briefs."
      />

      <PipelineMapToolbar
        mapViewMode={mapViewMode}
        setMapViewMode={setMapViewMode}
        mapDimension={mapDimension}
        setMapDimension={setMapDimension}
        positionFilter={positionFilter}
        setPositionFilter={setPositionFilter}
        search={search}
        setSearch={setSearch}
        currentTier={currentTier}
        overlays={overlays}
        toggleOverlay={toggleOverlay}
      />

      {/* Map Container */}
      <div className="relative bg-card rounded-xl border border-border overflow-hidden min-h-[520px] shadow-2xl">
        {mapDimension === '2D' ? (
          <>
            <USMapSVG 
              geoHeat={SEED_GEO_HEAT}
              selectedGeoId={selectedGeoId}
              onStateClick={handleStateClick}
              overlayMode={activeOverlay}
              showRecruitingFlow={true}
              pipelinePins={SEED_PIPELINE_PINS}
            />
            {mapViewMode === 'PINS' && (
              <PipelinePins pins={filteredPins} onPinClick={handlePinClick} />
            )}
          </>
        ) : (
          <USPipelineHeatMapWebGL_ESPN
            geoHeat={SEED_GEO_HEAT}
            theme={ESPN_THEME}
            onStateClick={handleStateClick}
            height={520}
          />
        )}
      </div>

      <MapDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedGeo={selectedGeo}
        geoPipelines={geoPipelines}
        geoAlerts={geoAlerts}
        staffOwners={SEED_STAFF_OWNERS}
        currentTier={currentTier}
        onPipelineClick={handlePinClick}
      />
    </div>
  );
};

export default PipelineMapPage;
```

### src/pages/PipelineListPage.tsx
```tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Search, TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { SEED_PIPELINES } from '@/demo/pipelineData';
import type { Pipeline, TrendDirection, PipelineStatus } from '@/types/pipeline';

type SortKey = 'name' | 'pipelineScore' | 'activeRecruits' | 'alertsOpen';
type SortDir = 'asc' | 'desc';

const TrendIcon: React.FC<{ trend: TrendDirection }> = ({ trend }) => {
  if (trend === 'UP') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'DOWN') return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const getStatusBadge = (status: PipelineStatus) => {
  switch (status) {
    case 'STRONG': return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Strong</Badge>;
    case 'COOLING': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Cooling</Badge>;
    case 'EMERGING': return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Emerging</Badge>;
    case 'DORMANT': return <Badge variant="secondary">Dormant</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const PipelineListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('pipelineScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filteredPipelines = useMemo(() => {
    let result = [...SEED_PIPELINES];
    
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (positionFilter !== 'ALL') {
      result = result.filter(p => p.positionGroup === positionFilter);
    }
    
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    
    return result;
  }, [search, positionFilter, sortKey, sortDir]);

  const totalRecruits = SEED_PIPELINES.reduce((sum, p) => sum + p.activeRecruits, 0);
  const totalAlerts = SEED_PIPELINES.reduce((sum, p) => sum + p.alertsOpen, 0);
  const avgScore = Math.round(SEED_PIPELINES.reduce((sum, p) => sum + p.pipelineScore, 0) / SEED_PIPELINES.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Pipeline Intelligence</h1>
          <p className="text-muted-foreground text-sm">
            Pipelines as an owned asset — score, trend, alerts, ownership, and ROI.
          </p>
        </div>
        <Button onClick={() => navigate('/app/pipelines/map')}>
          <Map className="w-4 h-4 mr-2" />
          View Map
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{SEED_PIPELINES.length}</p>
            <p className="text-xs text-muted-foreground">Total Pipelines</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{avgScore}</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalRecruits}</p>
            <p className="text-xs text-muted-foreground">Active Recruits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <div>
              <p className="text-2xl font-bold">{totalAlerts}</p>
              <p className="text-xs text-muted-foreground">Open Alerts</p>
            </div>
            {totalAlerts > 0 && <AlertTriangle className="w-5 h-5 text-destructive" />}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pipelines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Positions</SelectItem>
            <SelectItem value="QB">QB</SelectItem>
            <SelectItem value="OL">OL</SelectItem>
            <SelectItem value="DL">DL</SelectItem>
            <SelectItem value="LB">LB</SelectItem>
            <SelectItem value="DB">DB</SelectItem>
            <SelectItem value="WR">WR</SelectItem>
            <SelectItem value="RB">RB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Pipeline <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Position</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('pipelineScore')}
                >
                  <div className="flex items-center gap-1">
                    Score <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Signed (5yr)</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('activeRecruits')}
                >
                  <div className="flex items-center gap-1">
                    Active <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('alertsOpen')}
                >
                  <div className="flex items-center gap-1">
                    Alerts <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPipelines.map(pipeline => (
                <TableRow 
                  key={pipeline.pipelineId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/app/pipelines/${pipeline.pipelineId}`)}
                >
                  <TableCell className="font-medium">{pipeline.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pipeline.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{pipeline.positionGroup}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      pipeline.pipelineScore >= 80 ? 'text-green-500' :
                      pipeline.pipelineScore >= 60 ? 'text-yellow-500' : 'text-destructive'
                    }`}>
                      {pipeline.pipelineScore}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(pipeline.status)}</TableCell>
                  <TableCell><TrendIcon trend={pipeline.trend} /></TableCell>
                  <TableCell>{pipeline.playersSignedLast5Years}</TableCell>
                  <TableCell>{pipeline.activeRecruits}</TableCell>
                  <TableCell>
                    {pipeline.alertsOpen > 0 ? (
                      <Badge variant="destructive">{pipeline.alertsOpen}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineListPage;
```

### src/pages/PipelineDetailPage.tsx
```tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  Users,
  Target,
  DollarSign,
  History,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SEED_PIPELINE_PINS, SEED_PIPELINE_ALERTS, SEED_PIPELINE_DETAILS, SEED_STAFF_OWNERS } from '@/demo/pipelineData';
import type { PipelineStatus, TrendDirection } from '@/types/pipeline';

const TrendIcon: React.FC<{ trend: TrendDirection; className?: string }> = ({ trend, className = "w-5 h-5" }) => {
  if (trend === 'UP') return <TrendingUp className={`${className} text-green-500`} />;
  if (trend === 'DOWN') return <TrendingDown className={`${className} text-destructive`} />;
  return <Minus className={`${className} text-muted-foreground`} />;
};

const getStatusBadge = (status: PipelineStatus) => {
  switch (status) {
    case 'STRONG': return <Badge className="bg-green-500 text-white">Strong</Badge>;
    case 'COOLING': return <Badge className="bg-yellow-500 text-black">Cooling</Badge>;
    case 'EMERGING': return <Badge className="bg-blue-500 text-white">Emerging</Badge>;
    case 'DORMANT': return <Badge variant="secondary">Dormant</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const PipelineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pipeline = SEED_PIPELINE_PINS.find(p => p.pipelineId === id);
  const details = id ? SEED_PIPELINE_DETAILS[id] : null;
  const alerts = SEED_PIPELINE_ALERTS.filter(a => a.pipelineId === id);
  const owner = pipeline ? SEED_STAFF_OWNERS.find(s => s.staffId === pipeline.ownerStaffId) : null;

  if (!pipeline) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Pipeline not found</p>
        <Button variant="outline" onClick={() => navigate('/app/pipelines')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pipelines
        </Button>
      </div>
    );
  }

  // Use default score factors if no detail exists
  const scoreFactors = details?.scoreFactors || {
    historicalSuccess: 70,
    recentActivity: 65,
    relationshipDepth: 72,
    competitionPressure: 50,
    retentionOutcome: 68,
    momentum: 70,
  };

  const trendHistory = details?.trendHistory || [
    { month: 'Jan', score: pipeline.pipelineScore - 8 },
    { month: 'Feb', score: pipeline.pipelineScore - 6 },
    { month: 'Mar', score: pipeline.pipelineScore - 4 },
    { month: 'Apr', score: pipeline.pipelineScore - 2 },
    { month: 'May', score: pipeline.pipelineScore },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate('/app/pipelines')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold">{pipeline.name}</h1>
            {getStatusBadge(pipeline.status)}
            <TrendIcon trend={pipeline.trend} className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{pipeline.level}</Badge>
            <Badge variant="secondary">{pipeline.positionGroup}</Badge>
            <span className="text-sm text-muted-foreground">• {pipeline.geoId}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-primary">{pipeline.pipelineScore}</p>
          <p className="text-sm text-muted-foreground">Pipeline Score</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.activeRecruits}</p>
              <p className="text-xs text-muted-foreground">Active Recruits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.playersSignedLast5Years}</p>
              <p className="text-xs text-muted-foreground">Signed (5 yr)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.roiScore}</p>
              <p className="text-xs text-muted-foreground">ROI Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.budgetModifier < 1 ? '-' : '+'}{Math.abs((pipeline.budgetModifier - 1) * 100).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Budget Modifier</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(scoreFactors).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{value}</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ownership */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Pipeline Ownership
          </CardTitle>
        </CardHeader>
        <CardContent>
          {owner ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{owner.name}</p>
                <p className="text-sm text-muted-foreground">{owner.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No owner assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active alerts for this pipeline.</p>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.alertId} 
                className={`p-4 rounded-lg border-l-4 bg-card ${
                  alert.severity === 'HIGH' ? 'border-l-destructive' : 
                  alert.severity === 'MED' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    alert.severity === 'HIGH' ? 'text-destructive' : 
                    alert.severity === 'MED' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{alert.title}</span>
                      <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-sm text-primary mt-2 font-medium">→ {alert.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineDetailPage;
```

---

## Pipeline Components

### src/components/pipeline/USMapSVG.tsx
```tsx
import React from 'react';
import type { GeoHeat, PipelinePin } from '@/types/pipeline';

// US State paths - simplified for demo
const US_STATES: Record<string, { path: string; cx: number; cy: number }> = {
  AL: { path: "M628,370 L628,420 L658,420 L658,370 Z", cx: 643, cy: 395 },
  AK: { path: "M100,450 L100,490 L180,490 L180,450 Z", cx: 140, cy: 470 },
  AZ: { path: "M185,320 L185,400 L250,400 L250,320 Z", cx: 218, cy: 360 },
  AR: { path: "M540,350 L540,400 L600,400 L600,350 Z", cx: 570, cy: 375 },
  CA: { path: "M100,200 L100,380 L170,380 L170,200 Z", cx: 135, cy: 290 },
  CO: { path: "M280,260 L280,330 L370,330 L370,260 Z", cx: 325, cy: 295 },
  CT: { path: "M820,200 L820,220 L845,220 L845,200 Z", cx: 832, cy: 210 },
  DE: { path: "M790,265 L790,290 L805,290 L805,265 Z", cx: 797, cy: 277 },
  FL: { path: "M680,400 L680,500 L780,500 L780,400 Z", cx: 730, cy: 450 },
  GA: { path: "M670,340 L670,410 L730,410 L730,340 Z", cx: 700, cy: 375 },
  HI: { path: "M200,480 L200,510 L260,510 L260,480 Z", cx: 230, cy: 495 },
  ID: { path: "M190,120 L190,230 L250,230 L250,120 Z", cx: 220, cy: 175 },
  IL: { path: "M580,230 L580,320 L620,320 L620,230 Z", cx: 600, cy: 275 },
  IN: { path: "M620,240 L620,320 L660,320 L660,240 Z", cx: 640, cy: 280 },
  IA: { path: "M500,210 L500,270 L570,270 L570,210 Z", cx: 535, cy: 240 },
  KS: { path: "M380,290 L380,340 L490,340 L490,290 Z", cx: 435, cy: 315 },
  KY: { path: "M620,300 L620,340 L710,340 L710,300 Z", cx: 665, cy: 320 },
  LA: { path: "M530,400 L530,460 L600,460 L600,400 Z", cx: 565, cy: 430 },
  ME: { path: "M850,100 L850,170 L890,170 L890,100 Z", cx: 870, cy: 135 },
  MD: { path: "M750,260 L750,290 L800,290 L800,260 Z", cx: 775, cy: 275 },
  MA: { path: "M830,180 L830,200 L875,200 L875,180 Z", cx: 852, cy: 190 },
  MI: { path: "M590,140 L590,220 L670,220 L670,140 Z", cx: 630, cy: 180 },
  MN: { path: "M480,120 L480,200 L550,200 L550,120 Z", cx: 515, cy: 160 },
  MS: { path: "M580,360 L580,440 L620,440 L620,360 Z", cx: 600, cy: 400 },
  MO: { path: "M510,280 L510,360 L580,360 L580,280 Z", cx: 545, cy: 320 },
  MT: { path: "M220,100 L220,170 L350,170 L350,100 Z", cx: 285, cy: 135 },
  NE: { path: "M360,230 L360,280 L470,280 L470,230 Z", cx: 415, cy: 255 },
  NV: { path: "M160,180 L160,320 L220,320 L220,180 Z", cx: 190, cy: 250 },
  NH: { path: "M850,140 L850,180 L870,180 L870,140 Z", cx: 860, cy: 160 },
  NJ: { path: "M800,220 L800,270 L820,270 L820,220 Z", cx: 810, cy: 245 },
  NM: { path: "M260,330 L260,420 L350,420 L350,330 Z", cx: 305, cy: 375 },
  NY: { path: "M750,160 L750,230 L830,230 L830,160 Z", cx: 790, cy: 195 },
  NC: { path: "M680,310 L680,350 L790,350 L790,310 Z", cx: 735, cy: 330 },
  ND: { path: "M380,120 L380,170 L470,170 L470,120 Z", cx: 425, cy: 145 },
  OH: { path: "M660,240 L660,310 L720,310 L720,240 Z", cx: 690, cy: 275 },
  OK: { path: "M380,340 L380,390 L510,390 L510,340 Z", cx: 445, cy: 365 },
  OR: { path: "M100,120 L100,200 L190,200 L190,120 Z", cx: 145, cy: 160 },
  PA: { path: "M720,210 L720,260 L800,260 L800,210 Z", cx: 760, cy: 235 },
  RI: { path: "M845,195 L845,210 L860,210 L860,195 Z", cx: 852, cy: 202 },
  SC: { path: "M700,340 L700,380 L760,380 L760,340 Z", cx: 730, cy: 360 },
  SD: { path: "M380,170 L380,220 L470,220 L470,170 Z", cx: 425, cy: 195 },
  TN: { path: "M580,320 L580,360 L700,360 L700,320 Z", cx: 640, cy: 340 },
  TX: { path: "M350,360 L350,500 L540,500 L540,360 Z", cx: 445, cy: 430 },
  UT: { path: "M220,200 L220,300 L280,300 L280,200 Z", cx: 250, cy: 250 },
  VT: { path: "M830,130 L830,165 L850,165 L850,130 Z", cx: 840, cy: 147 },
  VA: { path: "M700,270 L700,320 L790,320 L790,270 Z", cx: 745, cy: 295 },
  WA: { path: "M120,80 L120,140 L200,140 L200,80 Z", cx: 160, cy: 110 },
  WV: { path: "M700,260 L700,300 L750,300 L750,260 Z", cx: 725, cy: 280 },
  WI: { path: "M550,150 L550,220 L610,220 L610,150 Z", cx: 580, cy: 185 },
  WY: { path: "M260,170 L260,240 L350,240 L350,170 Z", cx: 305, cy: 205 },
};

// UNLV HQ location (Las Vegas, NV)
const HQ = { x: 190, y: 280 };

type OverlayMode = 'strength' | 'alerts' | 'budget' | 'roi';

interface USMapSVGProps {
  geoHeat: GeoHeat[];
  selectedGeoId: string | null;
  onStateClick: (geoId: string) => void;
  overlayMode?: OverlayMode;
  showRecruitingFlow?: boolean;
  pipelinePins?: PipelinePin[];
}

// Thermal color scale - from cold (blue) to hot (red/white)
const getThermalColor = (value: number, max: number = 100): string => {
  const normalized = Math.max(0, Math.min(1, value / max));
  
  if (normalized < 0.2) {
    const t = normalized / 0.2;
    return `rgb(${Math.round(20 + t * 20)}, ${Math.round(40 + t * 60)}, ${Math.round(100 + t * 55)})`;
  } else if (normalized < 0.4) {
    const t = (normalized - 0.2) / 0.2;
    return `rgb(${Math.round(40 + t * 20)}, ${Math.round(100 + t * 80)}, ${Math.round(155 - t * 55)})`;
  } else if (normalized < 0.6) {
    const t = (normalized - 0.4) / 0.2;
    return `rgb(${Math.round(60 + t * 195)}, ${Math.round(180 + t * 55)}, ${Math.round(100 - t * 80)})`;
  } else if (normalized < 0.8) {
    const t = (normalized - 0.6) / 0.2;
    return `rgb(${Math.round(255)}, ${Math.round(235 - t * 100)}, ${Math.round(20 - t * 20)})`;
  } else {
    const t = (normalized - 0.8) / 0.2;
    return `rgb(${Math.round(255)}, ${Math.round(135 - t * 100)}, ${Math.round(t * 80)})`;
  }
};

const getOverlayValue = (geo: GeoHeat, mode: OverlayMode): number => {
  switch (mode) {
    case 'strength':
      return geo.energyScore;
    case 'alerts':
      return Math.min(100, geo.alertsOpen * 30 + (geo.statusBand === 'COLD' || geo.statusBand === 'DEAD' ? 40 : 0));
    case 'budget':
      return Math.min(100, (geo.budgetExposure / 5000));
    case 'roi':
      return geo.roiScore;
    default:
      return geo.energyScore;
  }
};

// Generate curved arc path between two points
const getArcPath = (from: { x: number; y: number }, to: { x: number; y: number }): string => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Control point offset perpendicular to the line, scaled by distance
  const curvature = Math.min(dist * 0.3, 80);
  const perpX = -dy / dist * curvature;
  const perpY = dx / dist * curvature;
  
  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY - curvature * 0.5; // Bias upward for better visual

  return `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`;
};

const USMapSVG: React.FC<USMapSVGProps> = ({ 
  geoHeat, 
  selectedGeoId, 
  onStateClick,
  overlayMode = 'strength',
  showRecruitingFlow = true,
  pipelinePins = []
}) => {
  const geoMap = new Map(geoHeat.map(g => [g.geoId, g]));

  // Calculate flow arcs from pipelines to HQ
  const flowArcs = pipelinePins
    .filter(pin => pin.playersSignedLast5Years > 0 && pin.geoId !== 'NV')
    .map(pin => {
      const state = US_STATES[pin.geoId];
      if (!state) return null;
      return {
        id: pin.pipelineId,
        from: { x: state.cx, y: state.cy },
        to: HQ,
        thickness: Math.max(1, Math.min(6, pin.playersSignedLast5Years * 0.8)),
        score: pin.pipelineScore,
        signed: pin.playersSignedLast5Years,
      };
    })
    .filter(Boolean);

  return (
    <svg 
      viewBox="0 0 960 600" 
      className="w-full h-full"
      style={{ maxHeight: '500px' }}
    >
      <defs>
        {/* Thermal glow filter */}
        <filter id="thermalGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        
        {/* Hot spot glow */}
        <filter id="hotGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Selection glow */}
        <filter id="selectGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.8"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Arc glow */}
        <filter id="arcGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Radial gradient for thermal effect */}
        <radialGradient id="thermalCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>

        {/* HQ pulse gradient */}
        <radialGradient id="hqPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--scarlet))" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="hsl(var(--scarlet))" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="hsl(var(--scarlet))" stopOpacity="0"/>
        </radialGradient>

        {/* Background gradient */}
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(220, 20%, 8%)" />
          <stop offset="100%" stopColor="hsl(220, 25%, 5%)" />
        </linearGradient>

        {/* Grid pattern for thermal effect */}
        <pattern id="thermalGrid" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
        </pattern>

        {/* Animated arc gradient */}
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--scarlet))" stopOpacity="0.2">
            <animate attributeName="stop-opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" stopColor="hsl(var(--scarlet))" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6">
            <animate attributeName="stop-opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>

        {/* Flow animation marker */}
        <marker id="flowDot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
          <circle cx="5" cy="5" r="3" fill="hsl(var(--primary))"/>
        </marker>
      </defs>
      
      {/* Dark background */}
      <rect width="960" height="600" fill="url(#mapBg)" rx="8" />
      <rect width="960" height="600" fill="url(#thermalGrid)" rx="8" />

      {/* Thermal blur layer (background glow) */}
      <g filter="url(#thermalGlow)" opacity="0.6">
        {geoHeat.map(geo => {
          const state = US_STATES[geo.geoId];
          if (!state) return null;
          const value = getOverlayValue(geo, overlayMode);
          const color = getThermalColor(value);
          return (
            <path
              key={`blur-${geo.geoId}`}
              d={state.path}
              fill={color}
              opacity={0.4 + (value / 100) * 0.4}
            />
          );
        })}
      </g>

      {/* States base layer */}
      {Object.entries(US_STATES).map(([stateId, { path }]) => {
        const geo = geoMap.get(stateId);
        const isSelected = selectedGeoId === stateId;
        const hasData = !!geo;
        
        const value = hasData ? getOverlayValue(geo, overlayMode) : 0;
        const color = hasData ? getThermalColor(value) : 'rgb(30, 35, 45)';
        const isHot = value >= 75;
        
        return (
          <g key={stateId}>
            <path
              d={path}
              fill={color}
              fillOpacity={hasData ? 0.7 + (value / 100) * 0.3 : 0.15}
              stroke={isSelected ? 'hsl(var(--primary))' : hasData ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={isSelected ? 3 : 1}
              className={`transition-all duration-500 ${hasData ? 'cursor-pointer' : ''}`}
              filter={isSelected ? 'url(#selectGlow)' : isHot ? 'url(#hotGlow)' : undefined}
              onClick={() => hasData && onStateClick(stateId)}
              style={{
                animation: isHot && hasData ? 'pulse 2s ease-in-out infinite' : undefined,
              }}
            />
            {/* Hot spot center glow */}
            {hasData && value >= 80 && (
              <ellipse
                cx={US_STATES[stateId].cx}
                cy={US_STATES[stateId].cy}
                rx="15"
                ry="12"
                fill="url(#thermalCenter)"
                className="pointer-events-none animate-pulse"
              />
            )}
          </g>
        );
      })}

      {/* Recruiting Flow Arcs */}
      {showRecruitingFlow && flowArcs.map((arc, index) => {
        if (!arc) return null;
        const path = getArcPath(arc.from, arc.to);
        const animationDelay = index * 0.3;
        
        return (
          <g key={arc.id} filter="url(#arcGlow)">
            {/* Background arc (glow) */}
            <path
              d={path}
              fill="none"
              stroke="hsl(var(--scarlet))"
              strokeWidth={arc.thickness + 4}
              strokeOpacity={0.2}
              strokeLinecap="round"
            />
            {/* Main arc */}
            <path
              d={path}
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth={arc.thickness}
              strokeLinecap="round"
              strokeDasharray="8 4"
              className="animate-pulse"
              style={{
                animationDelay: `${animationDelay}s`,
              }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="24"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* Flow particles */}
            <circle r="3" fill="hsl(var(--primary))">
              <animateMotion
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
                path={path}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2" fill="white" opacity="0.8">
              <animateMotion
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
                path={path}
                begin={`${0.5}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
                begin={`${0.5}s`}
              />
            </circle>
          </g>
        );
      })}

      {/* HQ Marker (UNLV - Las Vegas) */}
      {showRecruitingFlow && (
        <g className="pointer-events-none">
          {/* Outer pulse ring */}
          <circle cx={HQ.x} cy={HQ.y} r="25" fill="url(#hqPulse)">
            <animate attributeName="r" values="20;35;20" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
          </circle>
          {/* Inner ring */}
          <circle 
            cx={HQ.x} 
            cy={HQ.y} 
            r="12" 
            fill="hsl(var(--scarlet))" 
            stroke="white" 
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          {/* HQ Label */}
          <text
            x={HQ.x}
            y={HQ.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-bold"
            style={{ fontSize: '8px' }}
          >
            HQ
          </text>
          <text
            x={HQ.x}
            y={HQ.y + 28}
            textAnchor="middle"
            className="fill-gray-300 font-semibold"
            style={{ fontSize: '9px' }}
          >
            UNLV
          </text>
        </g>
      )}
      
      {/* State labels for states with data */}
      {geoHeat.map(geo => {
        const state = US_STATES[geo.geoId];
        if (!state) return null;
        const value = getOverlayValue(geo, overlayMode);
        const isHot = value >= 70;
        
        return (
          <g key={`label-${geo.geoId}`} className="pointer-events-none">
            {/* Label background for readability */}
            <rect
              x={state.cx - 16}
              y={state.cy - 10}
              width="32"
              height="24"
              rx="4"
              fill="rgba(0,0,0,0.6)"
              className="opacity-80"
            />
            <text
              x={state.cx}
              y={state.cy - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-bold ${isHot ? 'fill-white' : 'fill-gray-200'}`}
              style={{ fontSize: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {geo.geoId}
            </text>
            <text
              x={state.cx}
              y={state.cy + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-semibold ${isHot ? 'fill-yellow-300' : 'fill-gray-400'}`}
              style={{ fontSize: '9px' }}
            >
              {Math.round(value)}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(30, 510)">
        <rect x="0" y="0" width="200" height="60" rx="6" fill="rgba(0,0,0,0.7)" />
        <text x="10" y="16" className="fill-gray-300" style={{ fontSize: '11px', fontWeight: 600 }}>
          {overlayMode === 'strength' ? 'Energy Score' : 
           overlayMode === 'alerts' ? 'Alert Intensity' :
           overlayMode === 'budget' ? 'Budget Exposure' : 'ROI Score'}
        </text>
        {/* Color scale */}
        <defs>
          <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getThermalColor(0)} />
            <stop offset="25%" stopColor={getThermalColor(25)} />
            <stop offset="50%" stopColor={getThermalColor(50)} />
            <stop offset="75%" stopColor={getThermalColor(75)} />
            <stop offset="100%" stopColor={getThermalColor(100)} />
          </linearGradient>
        </defs>
        <rect x="10" y="24" width="140" height="10" rx="2" fill="url(#legendGradient)" />
        <text x="10" y="42" className="fill-gray-400" style={{ fontSize: '9px' }}>Cold</text>
        <text x="150" y="42" className="fill-gray-400" style={{ fontSize: '9px' }} textAnchor="end">Hot</text>
        {showRecruitingFlow && (
          <text x="10" y="54" className="fill-gray-500" style={{ fontSize: '8px' }}>
            ━━ Recruiting Flow (thickness = signed players)
          </text>
        )}
      </g>
    </svg>
  );
};

export default USMapSVG;
```

### src/components/pipeline/PipelineMapToolbar.tsx
```tsx
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Search, Lock, Layers, Box } from 'lucide-react';
import type { PipelineTier } from '@/types/pipeline';
import { POSITION_OPTIONS, POSITION_GROUP_OPTIONS, getPositionFilterLabel } from '@/demo/positionConfig';

interface OverlaysState {
  strength: boolean;
  alerts: boolean;
  budget: boolean;
  forecast: boolean;
  ownership: boolean;
  roi: boolean;
}

interface PipelineMapToolbarProps {
  mapViewMode: 'STATES' | 'PINS';
  setMapViewMode: (mode: 'STATES' | 'PINS') => void;
  mapDimension: '2D' | '3D';
  setMapDimension: (mode: '2D' | '3D') => void;
  positionFilter: string;
  setPositionFilter: (filter: string) => void;
  search: string;
  setSearch: (search: string) => void;
  currentTier: PipelineTier;
  overlays: OverlaysState;
  toggleOverlay: (key: keyof OverlaysState) => void;
}

const PipelineMapToolbar: React.FC<PipelineMapToolbarProps> = ({
  mapViewMode,
  setMapViewMode,
  mapDimension,
  setMapDimension,
  positionFilter,
  setPositionFilter,
  search,
  setSearch,
  currentTier,
  overlays,
  toggleOverlay,
}) => {
  const tierUnlocked = (required: PipelineTier) => {
    const order: PipelineTier[] = ['CORE', 'GM', 'ELITE'];
    return order.indexOf(currentTier) >= order.indexOf(required);
  };

  const overlayConfig = [
    { key: 'strength' as const, label: 'Strength', tier: 'CORE' as PipelineTier },
    { key: 'alerts' as const, label: 'Alerts', tier: 'CORE' as PipelineTier },
    { key: 'budget' as const, label: 'Budget', tier: 'GM' as PipelineTier },
    { key: 'forecast' as const, label: 'Forecast', tier: 'GM' as PipelineTier },
    { key: 'ownership' as const, label: 'Ownership', tier: 'ELITE' as PipelineTier },
    { key: 'roi' as const, label: 'ROI', tier: 'ELITE' as PipelineTier },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border mb-4">
      {/* 2D/3D Map Mode Toggle */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        <Button
          variant={mapDimension === '2D' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMapDimension('2D')}
          className="gap-1"
        >
          <Layers className="w-4 h-4" />
          2D
        </Button>
        <Button
          variant={mapDimension === '3D' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMapDimension('3D')}
          className="gap-1"
        >
          <Box className="w-4 h-4" />
          3D
        </Button>
      </div>

      {/* View Mode Toggle (2D only) */}
      {mapDimension === '2D' && (
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <Button
            variant={mapViewMode === 'STATES' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMapViewMode('STATES')}
            className="gap-1"
          >
            <Map className="w-4 h-4" />
            States
          </Button>
          <Button
            variant={mapViewMode === 'PINS' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMapViewMode('PINS')}
            className="gap-1"
          >
            <MapPin className="w-4 h-4" />
            Pins
          </Button>
        </div>
      )}

      {/* Overlays */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Overlays:</span>
        {overlayConfig.map(({ key, label, tier }) => {
          const unlocked = tierUnlocked(tier);
          return (
            <Badge
              key={key}
              variant={overlays[key] && unlocked ? 'default' : 'secondary'}
              className={`cursor-pointer transition-all ${!unlocked ? 'opacity-50' : ''}`}
              onClick={() => unlocked && toggleOverlay(key)}
            >
              {!unlocked && <Lock className="w-3 h-3 mr-1" />}
              {label}
              {!unlocked && <span className="ml-1 text-xs">({tier})</span>}
            </Badge>
          );
        })}
      </div>

      {/* Position Filter */}
      <Select value={positionFilter} onValueChange={setPositionFilter}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Position">{getPositionFilterLabel(positionFilter)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectItem value="ALL">All Positions</SelectItem>
          <SelectGroup>
            <SelectLabel>Position Groups</SelectLabel>
            {POSITION_GROUP_OPTIONS.filter(g => g !== 'ALL').map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Individual Positions</SelectLabel>
            {POSITION_OPTIONS.filter(p => p !== 'ALL').map(pos => (
              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Find pipeline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default PipelineMapToolbar;
```

### src/components/pipeline/MapDrawer.tsx
```tsx
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  AlertTriangle, 
  DollarSign,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import FeatureGateCard from './FeatureGateCard';
import type { GeoHeat, PipelinePin, PipelineAlert, StaffOwner, PipelineTier } from '@/types/pipeline';

interface MapDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedGeo: GeoHeat | null;
  geoPipelines: PipelinePin[];
  geoAlerts: PipelineAlert[];
  staffOwners: StaffOwner[];
  currentTier?: PipelineTier;
  onPipelineClick: (pipelineId: string) => void;
}

const getStatusColor = (band: string) => {
  switch (band) {
    case 'HOT': return 'bg-scarlet text-white';
    case 'WARM': return 'bg-scarlet-dark text-white';
    case 'NEUTRAL': return 'bg-unlv-gray text-white';
    case 'COLD': return 'bg-unlv-gray-dark text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const TrendIcon: React.FC<{ trend: string }> = ({ trend }) => {
  if (trend === 'UP') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'DOWN') return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const MapDrawer: React.FC<MapDrawerProps> = ({
  open,
  onClose,
  selectedGeo,
  geoPipelines,
  geoAlerts,
  staffOwners,
  currentTier: propTier,
  onPipelineClick,
}) => {
  const { tiers } = useAppStore();
  const currentTier = propTier || tiers.tier;
  
  if (!selectedGeo) return null;

  const tierUnlocked = (required: PipelineTier) => {
    const order: PipelineTier[] = ['CORE', 'GM', 'ELITE'];
    return order.indexOf(currentTier) >= order.indexOf(required);
  };

  const getOwnerName = (staffId: string) => {
    return staffOwners.find(s => s.staffId === staffId)?.name || 'Unassigned';
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(selectedGeo.statusBand)}>
              {selectedGeo.statusBand}
            </Badge>
            <SheetTitle className="text-xl">{selectedGeo.label}</SheetTitle>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedGeo.energyScore}</p>
                    <p className="text-xs text-muted-foreground">Energy Score</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Target className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedGeo.pipelineCount}</p>
                    <p className="text-xs text-muted-foreground">Pipelines</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Users className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedGeo.activeRecruits}</p>
                    <p className="text-xs text-muted-foreground">Active Recruits</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedGeo.alertsOpen}</p>
                    <p className="text-xs text-muted-foreground">Open Alerts</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top Position Group</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-lg py-1 px-3">
                  {selectedGeo.topPositionGroup}
                </Badge>
              </CardContent>
            </Card>

            {/* Budget Exposure (GM tier preview) */}
            {!tierUnlocked('GM') ? (
              <FeatureGateCard 
                title="Budget / ROI Overlay" 
                copy="Budget and ROI overlays unlock in GM/Elite tiers. Switch tiers to preview live."
                tier="GM"
                ctaPrimaryLabel="Upgrade to GM"
                ctaSecondaryLabel="Upgrade to Elite"
              />
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${(selectedGeo.budgetExposure / 1000).toFixed(0)}K</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">Y1: {selectedGeo.forecastVolatility.y1}</Badge>
                    <Badge variant="secondary">Y2: {selectedGeo.forecastVolatility.y2}</Badge>
                    <Badge variant="secondary">Y3: {selectedGeo.forecastVolatility.y3}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forecast (GM tier) */}
            {!tierUnlocked('GM') && (
              <FeatureGateCard 
                title="Forecast Overlay"
                copy="Forecast overlays unlock in GM tier. Switch tiers to preview live."
                tier="GM"
                ctaPrimaryLabel="Upgrade to GM"
                ctaSecondaryLabel="Upgrade to Elite"
              />
            )}

            {/* Ownership (ELITE tier) */}
            {!tierUnlocked('ELITE') && (
              <FeatureGateCard 
                title="Ownership Overlay"
                copy="Ownership overlays unlock in ELITE tier. Switch tiers to preview live."
                tier="ELITE"
                ctaPrimaryLabel="Upgrade to GM"
                ctaSecondaryLabel="Upgrade to Elite"
              />
            )}

            {/* ROI (ELITE tier) */}
            {!tierUnlocked('ELITE') && (
              <FeatureGateCard 
                title="ROI Overlay"
                copy="ROI overlays unlock in ELITE tier. Switch tiers to preview live."
                tier="ELITE"
                ctaPrimaryLabel="Upgrade to GM"
                ctaSecondaryLabel="Upgrade to Elite"
              />
            )}
          </TabsContent>

          <TabsContent value="pipelines" className="space-y-3">
            {geoPipelines.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pipelines in this region.</p>
            ) : (
              geoPipelines.map(pipeline => (
                <Card 
                  key={pipeline.pipelineId} 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onPipelineClick(pipeline.pipelineId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pipeline.name}</span>
                          <TrendIcon trend={pipeline.trend} />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{pipeline.positionGroup}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Score: {pipeline.pipelineScore} | {pipeline.activeRecruits} active
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Owner: {getOwnerName(pipeline.ownerStaffId)}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-3">
            {geoAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No alerts for this region.</p>
            ) : (
              geoAlerts.map(alert => (
                <Card key={alert.alertId} className={`border-l-4 ${
                  alert.severity === 'HIGH' ? 'border-l-destructive' : 
                  alert.severity === 'MED' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'HIGH' ? 'text-destructive' : 
                        alert.severity === 'MED' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{alert.title}</span>
                          <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'secondary'} className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-primary mt-2 font-medium">→ {alert.recommendedAction}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default MapDrawer;
```

### src/components/pipeline/PipelinePins.tsx
```tsx
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { PipelinePin } from '@/types/pipeline';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PipelinePinsProps {
  pins: PipelinePin[];
  onPinClick: (pipelineId: string) => void;
}

const getPinSize = (activeRecruits: number): number => {
  return Math.max(6, Math.min(14, 6 + activeRecruits));
};

const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'STRONG': return 'border-green-500';
    case 'COOLING': return 'border-yellow-500';
    case 'EMERGING': return 'border-blue-500';
    case 'DORMANT': return 'border-muted-foreground';
    default: return 'border-muted-foreground';
  }
};

const TrendIcon: React.FC<{ trend: string; className?: string }> = ({ trend, className }) => {
  if (trend === 'UP') return <TrendingUp className={`${className} text-green-500`} />;
  if (trend === 'DOWN') return <TrendingDown className={`${className} text-destructive`} />;
  return <Minus className={`${className} text-muted-foreground`} />;
};

const PipelinePins: React.FC<PipelinePinsProps> = ({ pins, onPinClick }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {pins.map(pin => {
        const size = getPinSize(pin.activeRecruits);
        // Convert SVG coords to percentages (viewBox is 960x600)
        const left = (pin.x / 960) * 100;
        const top = (pin.y / 600) * 100;

        return (
          <Tooltip key={pin.pipelineId}>
            <TooltipTrigger asChild>
              <button
                className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 
                  rounded-full bg-primary border-2 ${getStatusBorderColor(pin.status)}
                  shadow-lg hover:scale-125 transition-transform cursor-pointer z-10`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size * 2}px`,
                  height: `${size * 2}px`,
                }}
                onClick={() => onPinClick(pin.pipelineId)}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{pin.name}</span>
                  <TrendIcon trend={pin.trend} className="w-3 h-3" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>{pin.positionGroup} | Score: {pin.pipelineScore}</p>
                  <p>{pin.activeRecruits} active recruits | {pin.playersSignedLast5Years} signed (5yr)</p>
                  {pin.alertsOpen > 0 && (
                    <p className="text-destructive">⚠ {pin.alertsOpen} alert{pin.alertsOpen > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default PipelinePins;
```

### src/components/pipeline/TierBanner.tsx
```tsx
import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TierBannerProps {
  text: string;
  variant?: 'info' | 'upgrade';
}

const TierBanner: React.FC<TierBannerProps> = ({ text, variant = 'info' }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${
      variant === 'info' 
        ? 'bg-primary/10 border border-primary/20' 
        : 'bg-gradient-to-r from-primary/20 to-scarlet/20 border border-primary/30'
    }`}>
      <Info className="w-5 h-5 text-primary flex-shrink-0" />
      <p className="text-sm flex-1">{text}</p>
      {variant === 'upgrade' && (
        <Button size="sm" onClick={() => navigate('/app/upgrade')} className="gap-1">
          <Sparkles className="w-4 h-4" />
          Upgrade
        </Button>
      )}
    </div>
  );
};

export default TierBanner;
```

### src/components/pipeline/FeatureGateCard.tsx
```tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import type { PipelineTier } from '@/types';

interface FeatureGateCardProps {
  title: string;
  copy: string;
  tier: PipelineTier;
  showCTA?: boolean;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
}

const FeatureGateCard: React.FC<FeatureGateCardProps> = ({ 
  title, 
  copy, 
  tier,
  showCTA = true,
  ctaPrimaryLabel,
  ctaSecondaryLabel
}) => {
  const { tiers, setTier } = useAppStore();
  const currentTier = tiers.tier;

  const handleUpgradeToGM = () => {
    setTier('GM');
    toast.success('Demo switched to GM tier.', {
      description: 'Budget and Forecast overlays are now unlocked.',
    });
  };

  const handleUpgradeToElite = () => {
    setTier('ELITE');
    toast.success('Demo switched to ELITE tier.', {
      description: 'All overlays and advanced features are now unlocked.',
    });
  };

  // Determine which upgrade options to show based on required tier
  const showGMButton = tier === 'GM' && currentTier === 'CORE';
  const showEliteButton = tier === 'ELITE' || (tier === 'GM' && currentTier !== 'ELITE');

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-scarlet/5 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-base">{title}</h4>
              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                {tier}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
            
            {showCTA && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {showGMButton && (
                    <Button 
                      size="sm" 
                      onClick={handleUpgradeToGM}
                      className="gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {ctaPrimaryLabel || 'Upgrade to GM'}
                    </Button>
                  )}
                  {showEliteButton && currentTier !== 'ELITE' && (
                    <Button 
                      size="sm" 
                      variant={showGMButton ? 'outline' : 'default'}
                      onClick={handleUpgradeToElite}
                      className="gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {ctaSecondaryLabel || 'Upgrade to ELITE'}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 italic">
                  Demo-only tier switch. In production this would route to checkout/contract.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureGateCard;
```

---

## 3D Map Components

### src/components/maps/USPipelineHeatMapWebGL_ESPN.tsx
```tsx
import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Tier = "CORE" | "GM" | "ELITE";

type GeoHeat = {
  geoId: string;
  label: string;
  energyScore: number;
  statusBand: "HOT" | "WARM" | "NEUTRAL" | "COLD" | "DEAD";
  cx?: number;
  cy?: number;
};

type ESPNTheme = {
  palette: { bg: string; rim: string; hot: string; warm: string; neutral: string; cold: string; dead: string; glass: string };
};

type Props = {
  geoHeat: GeoHeat[];
  theme: ESPNTheme;
  onStateClick?: (geoId: string) => void;
  width?: number;
  height?: number;
};

function bandColor(theme: ESPNTheme, band: GeoHeat["statusBand"]) {
  const p = theme.palette;
  switch (band) {
    case "HOT":
      return p.hot;
    case "WARM":
      return p.warm;
    case "NEUTRAL":
      return p.neutral;
    case "COLD":
      return p.cold;
    default:
      return p.dead;
  }
}

export default function USPipelineHeatMapWebGL_ESPN({ geoHeat, theme, onStateClick, width = 1100, height = 620 }: Props) {
  const columns = useMemo(() => {
    return geoHeat
      .filter((g) => typeof g.cx === "number" && typeof g.cy === "number")
      .map((g) => {
        const h = 0.08 + (g.energyScore / 100) * 0.75;
        return {
          geoId: g.geoId,
          x: ((g.cx as number) / width - 0.5) * 6.5,
          z: ((g.cy as number) / height - 0.5) * 3.8,
          h,
          color: new THREE.Color(bandColor(theme, g.statusBand))
        };
      });
  }, [geoHeat, theme, width, height]);

  return (
    <div style={{ width: "100%", height, background: theme.palette.bg, borderRadius: 18, overflow: "hidden" }}>
      <Canvas shadows camera={{ position: [0, 3.5, 4.5], fov: 40 }}>
        {/* Lights: ESPN broadcast vibe */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <spotLight position={[-4, 6, -3]} intensity={0.5} color={theme.palette.rim} angle={0.5} />

        {/* US surface plane (acts like the 3D "deck") */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#0a0c10" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* Columns */}
        {columns.map((c) => (
          <group key={c.geoId} position={[c.x, c.h / 2, c.z]}>
            <mesh
              onClick={() => onStateClick?.(c.geoId)}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[0.12, 0.12, c.h, 24]} />
              <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.35} metalness={0.5} roughness={0.35} />
            </mesh>
            {/* glow cap */}
            <mesh position={[0, c.h / 2 + 0.02, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
              <meshBasicMaterial color={c.color} transparent opacity={0.7} />
            </mesh>
          </group>
        ))}

        {/* Controls (locked tilt but slight movement feels "broadcast") */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
```

---

## File Summary

| File | Lines | Description |
|------|-------|-------------|
| `src/types/pipeline.ts` | 117 | Type definitions |
| `src/demo/pipelineData.ts` | 240 | Seed data |
| `src/demo/positionConfig.ts` | 50 | Position filters |
| `src/pages/PipelineMapPage.tsx` | 195 | Main map page |
| `src/pages/PipelineListPage.tsx` | 240 | Pipeline list |
| `src/pages/PipelineDetailPage.tsx` | 274 | Pipeline detail |
| `src/components/pipeline/USMapSVG.tsx` | 488 | 2D SVG map |
| `src/components/pipeline/PipelineMapToolbar.tsx` | 164 | Toolbar |
| `src/components/pipeline/MapDrawer.tsx` | 285 | Side drawer |
| `src/components/pipeline/PipelinePins.tsx` | 78 | Pipeline pins |
| `src/components/pipeline/TierBanner.tsx` | 32 | Tier banner |
| `src/components/pipeline/FeatureGateCard.tsx` | 101 | Feature gate |
| `src/components/maps/USPipelineHeatMapWebGL_ESPN.tsx` | 106 | 3D WebGL map |

**Total: ~2,370 lines of code**
