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
import { GuardrailBadge } from '@/components/GuardrailBadge';
import { calculateRemainingBudget, calculateFullForecast } from '@/lib/budgetCalculator';

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

  // Calculate using deterministic formulas
  const budgetCalc = calculateRemainingBudget(roster);
  const forecastCalc = calculateFullForecast(roster);
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Budget Snapshot
                </CardTitle>
                <GuardrailBadge roster={roster} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Allocated</span>
                <span className="font-semibold">${(budgetCalc.allocated / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-semibold text-chart-1">${(budgetCalc.remaining / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reserve (Locked)</span>
                <span className="text-xs text-muted-foreground">${(budgetCalc.contingencyReserve / 1000).toFixed(0)}K</span>
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
                <span className="font-semibold">{forecastCalc.year1.expectedDepartures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year 2 Departures</span>
                <span className="font-semibold">{forecastCalc.year2.expectedDepartures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year 1 Projected</span>
                <span className="text-xs text-muted-foreground">${(forecastCalc.year1.projectedSpend / 1000000).toFixed(2)}M</span>
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
            <DialogTitle className="font-display text-xl">{beforeAfter?.summary.headline.title || 'GM Simulation Result'}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={
                beforeAfter?.summary.headline.status === 'WITHIN_GUARDRAILS' ? 'default' :
                beforeAfter?.summary.headline.status === 'NEAR_LIMIT' ? 'secondary' : 'destructive'
              } className={
                beforeAfter?.summary.headline.status === 'WITHIN_GUARDRAILS' ? 'bg-emerald-500/10 text-emerald-500' :
                beforeAfter?.summary.headline.status === 'NEAR_LIMIT' ? 'bg-amber-500/10 text-amber-500' : ''
              }>
                {beforeAfter?.summary.headline.statusLabel}
              </Badge>
              <p className="text-xs text-muted-foreground">{beforeAfter?.summary.headline.confidenceNote}</p>
            </div>
          </DialogHeader>

          {beforeAfter && (
            <div className="space-y-6 py-4">
              {/* Entities: Recruit Added & Replacement Suggested */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Recruit Added</p>
                  <p className="font-semibold">{beforeAfter.summary.entities.recruitAdded.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {beforeAfter.summary.entities.recruitAdded.position} • {beforeAfter.summary.entities.recruitAdded.assumedRole}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    ${(beforeAfter.summary.entities.recruitAdded.deterministicCost / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <p className="text-xs text-destructive font-medium mb-1">Replacement Suggested</p>
                  <p className="font-semibold">{beforeAfter.summary.entities.replacementSuggested.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {beforeAfter.summary.entities.replacementSuggested.positionGroup} • {beforeAfter.summary.entities.replacementSuggested.role}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{beforeAfter.summary.entities.replacementSuggested.reason}</p>
                </div>
              </div>

              {/* Budget Delta */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget Impact
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Before</p>
                    <p className="text-xl font-bold">${(beforeAfter.summary.budgetDelta.totalAllocatedBefore / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Remaining: ${(beforeAfter.summary.budgetDelta.remainingBefore / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg text-center flex flex-col items-center justify-center">
                    {beforeAfter.summary.budgetDelta.deltaAllocated > 0 ? (
                      <TrendingUp className="w-5 h-5 text-destructive mb-1" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-chart-1 mb-1" />
                    )}
                    <p className={`font-bold ${beforeAfter.summary.budgetDelta.deltaAllocated > 0 ? 'text-destructive' : 'text-chart-1'}`}>
                      {beforeAfter.summary.budgetDelta.deltaAllocated > 0 ? '+' : ''}${(beforeAfter.summary.budgetDelta.deltaAllocated / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">After</p>
                    <p className="text-xl font-bold">${(beforeAfter.summary.budgetDelta.totalAllocatedAfter / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Remaining: ${(beforeAfter.summary.budgetDelta.remainingAfter / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                {/* Guardrail Checks */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {beforeAfter.summary.budgetDelta.guardrailChecks.remainingBufferOk ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">Buffer OK</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive">Buffer Low</Badge>
                  )}
                  {!beforeAfter.summary.budgetDelta.guardrailChecks.anyPositionOverMax && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">No Position Over Cap</Badge>
                  )}
                  {beforeAfter.summary.budgetDelta.guardrailChecks.anyPositionOverWarn && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Position Near Cap</Badge>
                  )}
                </div>
              </div>

              {/* Allocation Delta */}
              <div>
                <h4 className="font-semibold mb-3">Position Allocation: {beforeAfter.summary.allocationDelta.positionGroup}</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground">Before</p>
                    <p className="font-semibold">{beforeAfter.summary.allocationDelta.percentBefore.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground">Delta</p>
                    <p className={`font-semibold ${beforeAfter.summary.allocationDelta.deltaPercent > 0 ? 'text-destructive' : 'text-chart-1'}`}>
                      {beforeAfter.summary.allocationDelta.deltaPercent > 0 ? '+' : ''}{beforeAfter.summary.allocationDelta.deltaPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">After</p>
                    <p className="font-semibold">{beforeAfter.summary.allocationDelta.percentAfter.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Forecast Delta */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Forecast Impact ({beforeAfter.summary.allocationDelta.positionGroup} Gaps)
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Gaps Before</TableHead>
                      <TableHead className="text-right">Gaps After</TableHead>
                      <TableHead className="text-right">Delta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(['year1', 'year2', 'year3'] as const).map((yr, i) => (
                      <TableRow key={yr}>
                        <TableCell>Year {i + 1}</TableCell>
                        <TableCell className="text-right">{beforeAfter.summary.forecastDelta[yr].gapsBefore}</TableCell>
                        <TableCell className="text-right">{beforeAfter.summary.forecastDelta[yr].gapsAfter}</TableCell>
                        <TableCell className={`text-right ${beforeAfter.summary.forecastDelta[yr].deltaGaps < 0 ? 'text-chart-1' : beforeAfter.summary.forecastDelta[yr].deltaGaps > 0 ? 'text-destructive' : ''}`}>
                          {beforeAfter.summary.forecastDelta[yr].deltaGaps > 0 ? '+' : ''}{beforeAfter.summary.forecastDelta[yr].deltaGaps}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Risk Delta */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Heatmap Delta
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center mb-3">
                  <div className="p-2 rounded bg-emerald-500/10">
                    <p className="text-xs text-muted-foreground">Green</p>
                    <p className="font-semibold">{beforeAfter.summary.riskDelta.heatmapDelta.greenBefore} → {beforeAfter.summary.riskDelta.heatmapDelta.greenAfter}</p>
                  </div>
                  <div className="p-2 rounded bg-amber-500/10">
                    <p className="text-xs text-muted-foreground">Yellow</p>
                    <p className="font-semibold">{beforeAfter.summary.riskDelta.heatmapDelta.yellowBefore} → {beforeAfter.summary.riskDelta.heatmapDelta.yellowAfter}</p>
                  </div>
                  <div className="p-2 rounded bg-destructive/10">
                    <p className="text-xs text-muted-foreground">Red</p>
                    <p className="font-semibold">{beforeAfter.summary.riskDelta.heatmapDelta.redBefore} → {beforeAfter.summary.riskDelta.heatmapDelta.redAfter}</p>
                  </div>
                </div>
                {beforeAfter.summary.riskDelta.newRedIntroduced && (
                  <Badge variant="destructive" className="mb-2">New RED Risk Introduced</Badge>
                )}
                {beforeAfter.summary.riskDelta.keyRisks.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {beforeAfter.summary.riskDelta.keyRisks.map(risk => (
                      <Badge key={risk.playerId} variant="outline" className={
                        risk.riskColor === 'YELLOW' ? 'bg-amber-500/10 text-amber-600' : 
                        risk.riskColor === 'RED' ? 'bg-destructive/10 text-destructive' : ''
                      }>
                        {risk.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Decision */}
              <div className={`p-4 rounded-lg border ${
                beforeAfter.summary.recommendedDecision.verdict === 'PROCEED' ? 'bg-emerald-500/5 border-emerald-500/20' :
                beforeAfter.summary.recommendedDecision.verdict === 'CAUTION' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-destructive/5 border-destructive/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    beforeAfter.summary.recommendedDecision.verdict === 'PROCEED' ? 'default' :
                    beforeAfter.summary.recommendedDecision.verdict === 'CAUTION' ? 'secondary' : 'destructive'
                  } className={
                    beforeAfter.summary.recommendedDecision.verdict === 'PROCEED' ? 'bg-emerald-500 text-white' :
                    beforeAfter.summary.recommendedDecision.verdict === 'CAUTION' ? 'bg-amber-500 text-white' : ''
                  }>
                    {beforeAfter.summary.recommendedDecision.verdictLabel}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Why:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {beforeAfter.summary.recommendedDecision.why.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Tradeoffs:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {beforeAfter.summary.recommendedDecision.tradeoffs.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
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
