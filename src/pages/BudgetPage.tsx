import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Users, TrendingUp, AlertTriangle, Calculator, Calendar } from 'lucide-react';
import { PositionGroup, RosterRole, RiskColor } from '@/types';
import { ROSTER_META } from '@/demo/rosterData';
import LockedCardUpsell from '@/components/LockedCardUpsell';
import RiskHeatmapTable from '@/components/RiskHeatmapTable';

const REVSHARE_BAND_COLORS = {
  HIGH: 'bg-chart-1 text-primary-foreground',
  MED: 'bg-chart-2 text-primary-foreground',
  LOW: 'bg-muted text-muted-foreground',
};

const ROLE_VARIANTS: Record<RosterRole, 'default' | 'secondary' | 'outline'> = {
  STARTER: 'default',
  ROTATION: 'secondary',
  DEPTH: 'outline',
  DEVELOPMENTAL: 'outline',
};

const RISK_COLOR_CLASSES: Record<RiskColor, string> = {
  GREEN: 'text-chart-1',
  YELLOW: 'text-chart-2',
  RED: 'text-destructive',
};

const BudgetPage = () => {
  const navigate = useNavigate();
  const { budget, roster, flags, riskHeatmap } = useAppStore();

  // Calculate spending by position
  const spendingByPosition = roster.reduce((acc, player) => {
    acc[player.positionGroup] = (acc[player.positionGroup] || 0) + player.estimatedCost;
    return acc;
  }, {} as Record<PositionGroup, number>);

  // Calculate totals
  const totalSpent = roster.reduce((sum, p) => sum + p.estimatedCost, 0);
  const totalRemaining = budget.totalBudget - totalSpent;
  const utilizationPercent = (totalSpent / budget.totalBudget) * 100;

  // Calculate players at guardrail limits
  const playersOverMax = roster.filter(p => p.estimatedCost > budget.guardrails.maxPerPlayer);
  const positionsOverLimit = Object.entries(spendingByPosition).filter(([_, spent]) => {
    const maxForPosition = budget.totalBudget * (budget.guardrails.maxPerPositionPercent / 100);
    return spent > maxForPosition;
  });

  const handleRiskCellClick = (group: PositionGroup, risk: 'GREEN' | 'YELLOW' | 'RED') => {
    // Could filter roster table or navigate
    console.log('Filter by', group, risk);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Team Budget</h1>
          <p className="text-muted-foreground mt-1">52-man roster costs + allocations (demo projections).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/forecast')} className="gap-2">
            <Calendar className="w-4 h-4" />
            Forecast
          </Button>
          <Button onClick={() => navigate('/app/budget/simulator')} className="gap-2">
            <Calculator className="w-4 h-4" />
            Simulator
          </Button>
        </div>
      </div>

      {/* Summary Cards - requires budget_core */}
      {flags.budget_core ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(budget.totalBudget / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-1/10">
                  <TrendingUp className="w-5 h-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(totalSpent / 1000000).toFixed(2)}M</p>
                  <p className="text-sm text-muted-foreground">Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <DollarSign className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(totalRemaining / 1000000).toFixed(2)}M</p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roster.length}</p>
                  <p className="text-sm text-muted-foreground">Rostered Players</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <LockedCardUpsell 
          title="Unlock Budget Core" 
          copy="View total budget, allocations, and spending breakdowns."
        />
      )}

      {/* Budget Utilization */}
      {flags.budget_core && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{utilizationPercent.toFixed(1)}% utilized</span>
                <span className="text-muted-foreground">
                  ${(totalSpent / 1000).toFixed(0)}K / ${(budget.totalBudget / 1000).toFixed(0)}K
                </span>
              </div>
              <Progress value={utilizationPercent} className="h-3" />
            </div>
            {(playersOverMax.length > 0 || positionsOverLimit.length > 0) && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  {playersOverMax.length > 0 && (
                    <p>{playersOverMax.length} player(s) exceed max per player (${(budget.guardrails.maxPerPlayer / 1000).toFixed(0)}K)</p>
                  )}
                  {positionsOverLimit.length > 0 && (
                    <p>{positionsOverLimit.length} position(s) exceed {budget.guardrails.maxPerPositionPercent}% cap</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Position Allocation Table */}
      {flags.budget_core && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Position Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(budget.allocations).map(([pos, allocated]) => {
                    const spent = spendingByPosition[pos as PositionGroup] || 0;
                    const remaining = allocated - spent;
                    const util = (spent / allocated) * 100;
                    return (
                      <TableRow key={pos}>
                        <TableCell>
                          <Badge variant="outline">{pos}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${(allocated / 1000).toFixed(0)}K</TableCell>
                        <TableCell className="text-right">${(spent / 1000).toFixed(0)}K</TableCell>
                        <TableCell className={`text-right ${remaining < 0 ? 'text-destructive' : ''}`}>
                          ${(remaining / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(util, 100)} className="h-2 w-20" />
                            <span className={`text-xs ${util > 100 ? 'text-destructive' : ''}`}>
                              {util.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Heatmap - requires risk_heatmaps */}
      {flags.risk_heatmaps ? (
        <RiskHeatmapTable riskHeatmap={riskHeatmap} onCellClick={handleRiskCellClick} />
      ) : (
        <LockedCardUpsell 
          title="Unlock Risk Heatmaps" 
          copy="See red-yellow-green risk by position group. Spot churn before it hits you."
        />
      )}

      {/* Roster Budget Table */}
      {flags.budget_core && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Roster RevShare Commitments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pos</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Grad</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>RevShare Band</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roster.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.position}</Badge>
                      </TableCell>
                      <TableCell>{player.year}</TableCell>
                      <TableCell>{player.gradYear}</TableCell>
                      <TableCell>
                        <Badge variant={ROLE_VARIANTS[player.role]}>{player.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={REVSHARE_BAND_COLORS[player.revShareBand]}>{player.revShareBand}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${player.estimatedCost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${RISK_COLOR_CLASSES[player.riskColor]}`}>
                          {player.riskScore}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">{ROSTER_META.disclaimer}</p>
    </div>
  );
};

export default BudgetPage;
