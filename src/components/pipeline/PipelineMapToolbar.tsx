import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Search, Lock } from 'lucide-react';
import type { PipelineTier } from '@/types/pipeline';

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
  positionFilter: string;
  setPositionFilter: (filter: string) => void;
  search: string;
  setSearch: (search: string) => void;
  currentTier: PipelineTier;
  overlays: OverlaysState;
  toggleOverlay: (key: keyof OverlaysState) => void;
}

const POSITION_OPTIONS = [
  { value: 'ALL', label: 'All Positions' },
  { value: 'QB', label: 'QB' },
  { value: 'OL', label: 'OL' },
  { value: 'DL', label: 'DL' },
  { value: 'LB', label: 'LB' },
  { value: 'DB', label: 'DB' },
  { value: 'WR', label: 'WR' },
  { value: 'RB', label: 'RB' },
  { value: 'TE', label: 'TE' },
  { value: 'ST', label: 'ST' },
];

const PipelineMapToolbar: React.FC<PipelineMapToolbarProps> = ({
  mapViewMode,
  setMapViewMode,
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
      {/* View Mode Toggle */}
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
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Position" />
        </SelectTrigger>
        <SelectContent>
          {POSITION_OPTIONS.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
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
