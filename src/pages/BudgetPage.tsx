import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Users, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';
import { PositionGroup, RosterRole, RosterRisk } from '@/types';

const NIL_BAND_COLORS = {
  HIGH: 'bg-chart-1 text-primary-foreground',
  MED: 'bg-chart-2 text-primary-foreground',
  LOW: 'bg-muted text-muted-foreground',
};

const ROLE_COLORS: Record<RosterRole, string> = {
  STARTER: 'default',
  ROTATIONAL: 'secondary',
  DEPTH: 'outline',
  DEVELOPMENTAL: 'outline',
};

const RISK_COLORS: Record<RosterRisk, string> = {
  NONE: 'text-muted-foreground',
  LOW: 'text-chart-2',
  MED: 'text-chart-1',
  HIGH: 'text-destructive',
};

const BudgetPage = () => {
  const navigate = useNavigate();
  const { budget, roster } = useAppStore();

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Team Budget Overview</h1>
          <p className="text-muted-foreground mt-1">52-man roster + NIL budget (demo projections).</p>
        </div>
        <Button onClick={() => navigate('/app/budget/simulator')} className="gap-2">
          <Calculator className="w-4 h-4" />
          Budget Simulator
        </Button>
      </div>

      {/* Summary Cards */}
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

      {/* Budget Utilization */}
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

      {/* Position Allocation Table */}
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

      {/* Roster Budget Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Roster NIL Commitments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Grad Year</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>NIL Band</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{player.positionGroup}</Badge>
                    </TableCell>
                    <TableCell>{player.year}</TableCell>
                    <TableCell>{player.gradYear}</TableCell>
                    <TableCell>
                      <Badge variant={ROLE_COLORS[player.role] as any}>{player.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={NIL_BAND_COLORS[player.nilBand]}>{player.nilBand}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${player.estimatedCost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${RISK_COLORS[player.risk]}`}>
                        {player.risk === 'NONE' ? '—' : player.risk}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPage;
