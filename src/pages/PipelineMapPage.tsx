import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List, LayoutDashboard } from 'lucide-react';
import USMapSVG from '@/components/pipeline/USMapSVG';
import PipelineMapToolbar from '@/components/pipeline/PipelineMapToolbar';
import PipelinePins from '@/components/pipeline/PipelinePins';
import MapDrawer from '@/components/pipeline/MapDrawer';
import TierBanner from '@/components/pipeline/TierBanner';
import { SEED_GEO_HEAT, SEED_PIPELINE_PINS, SEED_PIPELINE_ALERTS, SEED_STAFF_OWNERS, DEFAULT_PIPELINE_TIERS } from '@/demo/pipelineData';
import type { PipelineTier } from '@/types/pipeline';

type OverlayMode = 'strength' | 'alerts' | 'budget' | 'roi';

const PipelineMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [mapViewMode, setMapViewMode] = useState<'STATES' | 'PINS'>('STATES');
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

  const currentTier: PipelineTier = DEFAULT_PIPELINE_TIERS.tier;

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
      pins = pins.filter(p => p.positionGroup === positionFilter);
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

      <TierBanner 
        text="Demo Tier: CORE (Strength + Alerts). GM Tier unlocks Budget/Forecast overlays. ELITE unlocks Ownership/ROI overlays + advanced Ops GM briefs."
      />

      <PipelineMapToolbar
        mapViewMode={mapViewMode}
        setMapViewMode={setMapViewMode}
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
