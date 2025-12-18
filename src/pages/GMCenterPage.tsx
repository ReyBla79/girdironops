import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Target, 
  Sparkles, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Undo2,
  X,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { UIMode, PositionGroup } from '@/types';
import { useToast } from '@/hooks/use-toast';

const GMCenterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    uiMode, 
    setUIMode, 
    flags, 
    budget, 
    roster, 
    riskHeatmap, 
    forecast,
    runWowScenario,
    openWowModal,
    closeWowModal,
    wowModalOpen,
    beforeAfter,
    applySimulation,
    undoSimulation
  } = useAppStore();

  const isGMMode = uiMode === 'GM';

  const handleModeToggle = (mode: UIMode) => {
    setUIMode(mode);
    toast({
      title: `Switched to ${mode === 'GM' ? 'GM' : 'Coach'} Mode`,
      description: mode === 'GM' 
        ? 'Budget, forecasting, and risk intelligence unlocked.'
        : 'Standard coaching view active.',
    });
  };

  const handleRunWow = () => {
    runWowScenario();
    openWowModal();
  };

  const handleApply = () => {
    applySimulation();
    toast({
      title: 'Simulation Applied',
      description: 'Changes applied to demo roster (demo only).',
    });
  };

  // Calculate quick stats
  const totalSpent = roster.reduce((sum, p) => sum + p.estimatedCost, 0);
  const totalRemaining = budget.totalBudget - totalSpent;
  const yellowRisks = riskHeatmap.keyRisks.filter(r => r.riskColor === 'YELLOW').length;
  const redRisks = riskHeatmap.keyRisks.filter(r => r.riskColor === 'RED').length;

  const quickLinks = [
    { label: 'Budget', to: '/app/budget', icon: DollarSign },
    { label: 'Budget Simulator', to: '/app/budget/simulator', icon: BarChart3 },
    { label: '3-Year Forecast', to: '/app/forecast', icon: Calendar },
    { label: 'Roster', to: '/app/roster', icon: Users },
    { label: 'Fit Lab', to: '/app/fit-lab', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">GM Center</h1>
        <p className="text-muted-foreground mt-1">Roster + budget + forecast — in one decision cockpit.</p>
      </div>

      {/* Mode Toggle Strip */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Mode</p>
              <p className="text-xs text-muted-foreground">GM Mode unlocks budget, forecasting, and risk intelligence (demo).</p>
            </div>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => handleModeToggle('COACH')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  uiMode === 'COACH' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                Coach Mode
              </button>
              <button
                onClick={() => handleModeToggle('GM')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  uiMode === 'GM' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background hover:bg-muted'
                }`}
              >
                GM Mode
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WOW Button Card */}
      {flags.wow_button && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">One-Click WOW</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Simulate adding a best-fit portal OT, auto-replace a graduating/depth piece, and instantly see budget + Year 1/2/3 impact.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    No backend. Uses demo roster + demo recruits + deterministic math.
                  </p>
                </div>
              </div>
              <Button onClick={handleRunWow} size="lg" className="gap-2 shrink-0">
                <Sparkles className="w-4 h-4" />
                Run GM Simulation (1 click)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GM Overview Row */}
      {isGMMode ? (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Budget Summary Mini */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Budget Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Allocated</span>
                <span className="font-semibold">${(totalSpent / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-semibold text-chart-1">${(totalRemaining / 1000000).toFixed(2)}M</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate('/app/budget')}>
                View Full Budget <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Risk Heatmap Mini */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-chart-2" />
                Risk Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Yellow Risks</span>
                <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">{yellowRisks}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Red Risks</span>
                <Badge variant="secondary" className="bg-destructive/20 text-destructive">{redRisks}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {riskHeatmap.keyRisks.slice(0, 2).map(risk => (
                  <Badge key={risk.playerId} variant="outline" className="text-xs">
                    {risk.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forecast Mini */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-chart-1" />
                3-Year Outlook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year 1 Departures</span>
                <span className="font-semibold">{forecast.year1.expectedDepartures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year 2 Departures</span>
                <span className="font-semibold">{forecast.year2.expectedDepartures}</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate('/app/forecast')}>
                View Forecast <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-4">
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Switch to GM Mode</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              GM Mode unlocks budget allocation, risk heatmaps, and Year 1/2/3 forecasting.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => handleModeToggle('GM')}>
              Enable GM Mode
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickLinks.map(link => (
              <Button 
                key={link.to} 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate(link.to)}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-sm">{link.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WOW Before/After Modal */}
      <Dialog open={wowModalOpen} onOpenChange={closeWowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">GM Simulation Result (Before → After)</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Roster + budget + risk + forecast updated in one click.
            </p>
          </DialogHeader>

          {beforeAfter && (
            <div className="space-y-6 py-4">
              {/* Budget Before/After */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget Impact
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Before</p>
                    <p className="text-xl font-bold">${(beforeAfter.budget.before.spent / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg text-center flex flex-col items-center justify-center">
                    {beforeAfter.budget.delta > 0 ? (
                      <TrendingUp className="w-5 h-5 text-destructive mb-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-chart-1 mb-1" />
                    )}
                    <p className={`font-bold ${beforeAfter.budget.delta > 0 ? 'text-destructive' : 'text-chart-1'}`}>
                      {beforeAfter.summary.budgetImpact}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">After</p>
                    <p className="text-xl font-bold">${(beforeAfter.budget.after.spent / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              {/* Allocations */}
              <div>
                <h4 className="font-semibold mb-3">Position Allocation Changes</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Before</TableHead>
                      <TableHead className="text-right">After</TableHead>
                      <TableHead className="text-right">Delta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beforeAfter.allocations.map(alloc => (
                      <TableRow key={alloc.positionGroup}>
                        <TableCell>
                          <Badge variant="outline">{alloc.positionGroup}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${(alloc.before / 1000).toFixed(0)}K</TableCell>
                        <TableCell className="text-right">${(alloc.after / 1000).toFixed(0)}K</TableCell>
                        <TableCell className={`text-right ${alloc.after - alloc.before > 0 ? 'text-destructive' : 'text-chart-1'}`}>
                          {alloc.after - alloc.before > 0 ? '+' : ''}{((alloc.after - alloc.before) / 1000).toFixed(0)}K
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Forecast Impact */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Forecast Impact
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-secondary rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Year 1</p>
                    <p className="font-semibold">
                      {beforeAfter.forecast.year1Delta < 0 ? '-' : '+'}${(Math.abs(beforeAfter.forecast.year1Delta) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Year 2</p>
                    <p className="font-semibold">
                      +${(beforeAfter.forecast.year2Delta / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Year 3</p>
                    <p className="font-semibold">
                      +${(beforeAfter.forecast.year3Delta / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* Decision Summary */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2">Decision Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Recruit Added:</span> {beforeAfter.summary.recruitAdded}</p>
                  <p><span className="text-muted-foreground">Player Removed:</span> {beforeAfter.summary.playerRemoved}</p>
                  <p><span className="text-muted-foreground">Budget Impact:</span> {beforeAfter.summary.budgetImpact}</p>
                  <p><span className="text-muted-foreground">Note:</span> {beforeAfter.summary.forecastNote}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={closeWowModal}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button variant="outline" onClick={undoSimulation}>
              <Undo2 className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button onClick={handleApply}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Simulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GMCenterPage;
