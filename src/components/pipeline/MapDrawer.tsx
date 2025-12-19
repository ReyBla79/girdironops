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
  currentTier?: PipelineTier; // Optional - will use store if not provided
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
                title="Budget & Forecast" 
                copy="Unlock detailed budget exposure and forecast volatility in GM tier."
                tier="GM"
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

            {/* ROI (ELITE tier) */}
            {!tierUnlocked('ELITE') && (
              <FeatureGateCard 
                title="ROI Intelligence" 
                copy="ROI overlay and scoring unlock in ELITE tier."
                tier="ELITE"
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
