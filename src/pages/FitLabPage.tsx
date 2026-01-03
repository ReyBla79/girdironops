import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { DollarSign, TrendingUp, Shield, Target, Info } from 'lucide-react';
import { useState } from 'react';
import { Player, RosterNeed } from '@/types';

const PRIORITY_COLORS = {
  MUST_REPLACE: 'bg-destructive text-destructive-foreground',
  UPGRADE: 'bg-chart-1 text-primary-foreground',
  DEPTH: 'bg-muted text-muted-foreground',
};

const READINESS_COLORS = {
  HIGH: 'text-chart-1',
  MED: 'text-chart-2',
  LOW: 'text-muted-foreground',
};

const RISK_COLORS = {
  LOW: 'text-chart-1',
  MED: 'text-chart-2',
  HIGH: 'text-destructive',
};

// Demo impact metrics computation
const computeImpact = (player: Player, need: RosterNeed | null) => {
  const baseImpact = player.fitScore / 100;
  const readinessMultiplier = player.readiness === 'HIGH' ? 1.2 : player.readiness === 'MED' ? 1.0 : 0.8;
  const needMatch = need && player.positionGroup === need.positionGroup ? 1.3 : 1.0;
  
  return {
    passProWinDelta: Math.round((baseImpact * readinessMultiplier * needMatch) * 4.5 * 10) / 10,
    pressureAllowedDelta: -Math.round((baseImpact * readinessMultiplier) * 2.8 * 10) / 10,
    explosivePlaysDelta: Math.round((baseImpact * readinessMultiplier * needMatch) * 3.2 * 10) / 10,
    thirdDownStopDelta: Math.round((baseImpact * readinessMultiplier) * 2.1 * 10) / 10,
  };
};

// Demo budget fit computation
const computeBudgetFit = (player: Player, allocations: Record<string, number>, guardrails: { maxPerPlayer: number }) => {
  if (!player.revShareRange) return { status: 'UNKNOWN', label: 'Unknown' };
  
  const positionBudget = allocations[player.positionGroup] || 100000;
  const maxPlayer = guardrails.maxPerPlayer;
  const midValue = player.revShareRange.mid;
  
  if (midValue <= Math.min(positionBudget * 0.3, maxPlayer * 0.8)) {
    return { status: 'GOOD', label: 'Within Budget' };
  } else if (midValue <= maxPlayer) {
    return { status: 'STRETCH', label: 'Stretch' };
  } else {
    return { status: 'OVER', label: 'Over Budget' };
  }
};

const FitLabPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const needIdFromQuery = searchParams.get('need');
  
  const { 
    players, 
    needs, 
    budget, 
    programDNA, 
    selectedNeedId, 
    selectedProspectId,
    setSelectedNeed,
    selectProspect 
  } = useAppStore();
  
  const [minFit, setMinFit] = useState(70);

  // Set selected need from query param on mount
  useEffect(() => {
    if (needIdFromQuery && needIdFromQuery !== selectedNeedId) {
      setSelectedNeed(needIdFromQuery);
    }
  }, [needIdFromQuery, selectedNeedId, setSelectedNeed]);

  const selectedNeed = needs.find(n => n.id === selectedNeedId);
  const selectedProspect = players.find(p => p.id === selectedProspectId);

  // Filter and sort players based on selected need and fit score
  const filteredPlayers = players
    .filter(p => p.status !== 'WITHDRAWN')
    .filter(p => p.fitScore >= minFit)
    .filter(p => !selectedNeed || p.positionGroup === selectedNeed.positionGroup)
    .sort((a, b) => b.fitScore - a.fitScore);

  const impactMetrics = selectedProspect ? computeImpact(selectedProspect, selectedNeed) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Fit & Roster Matching</h1>
        <p className="text-muted-foreground mt-1">
          Roster gaps + style + budget → best-fit recommendations + impact forecast.
        </p>
      </div>

      {/* Program DNA Compact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Program DNA
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Scheme Notes</p>
            <p className="text-muted-foreground">OFF: {programDNA.schemeNotes.offense}</p>
            <p className="text-muted-foreground">DEF: {programDNA.schemeNotes.defense}</p>
          </div>
          <div>
            <p className="font-medium mb-2">Fit Rules</p>
            {programDNA.fitRules.slice(0, 2).map((rule, i) => (
              <p key={i} className="text-muted-foreground">• {rule}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Guardrails */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Guardrails (Read-Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Budget</p>
                <p className="text-xl font-bold">${(budget.totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Max per player: ${(budget.guardrails.maxPerPlayer / 1000).toFixed(0)}K</p>
                <p>Max per position: {budget.guardrails.maxPerPositionPercent}%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {Object.entries(budget.allocations).map(([pos, amount]) => (
                <div key={pos} className="p-2 bg-secondary rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">{pos}</p>
                  <p className="font-semibold text-sm">${(amount / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Needs Board */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Filter by Need
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedNeed(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !selectedNeedId ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
              }`}
            >
              All Positions
            </button>
            {needs.map((need) => (
              <button
                key={need.id}
                onClick={() => setSelectedNeed(need.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedNeedId === need.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
                }`}
              >
                {need.label}
                <Badge className={`${PRIORITY_COLORS[need.priority]} text-xs`}>{need.priority.replace('_', ' ')}</Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Min Fit Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Min Fit Score: {minFit}</span>
            <Slider
              value={[minFit]}
              onValueChange={([v]) => setMinFit(v)}
              min={50}
              max={100}
              step={5}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Best-Fit Recommendations ({filteredPlayers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Pool</TableHead>
                  <TableHead className="text-right">Fit Score</TableHead>
                  <TableHead>Readiness</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Budget Fit</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => {
                  const budgetFit = computeBudgetFit(player, budget.allocations, budget.guardrails);
                  const impact = computeImpact(player, selectedNeed);
                  
                  return (
                    <TableRow 
                      key={player.id}
                      className={`cursor-pointer hover:bg-accent/50 ${selectedProspectId === player.id ? 'bg-accent' : ''}`}
                      onClick={() => selectProspect(player.id)}
                    >
                      <TableCell className="font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/player/${player.id}`);
                          }}
                          className="hover:text-primary hover:underline"
                        >
                          {player.name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.position}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{player.pool.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold ${player.fitScore >= 90 ? 'text-chart-1' : player.fitScore >= 80 ? 'text-chart-2' : ''}`}>
                          {player.fitScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={READINESS_COLORS[player.readiness]}>{player.readiness}</span>
                      </TableCell>
                      <TableCell>
                        <span className={RISK_COLORS[player.risk]}>{player.risk}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={budgetFit.status === 'GOOD' ? 'default' : budgetFit.status === 'STRETCH' ? 'secondary' : 'destructive'}>
                          {budgetFit.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-chart-1">+{impact.passProWinDelta}%</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Impact Forecast Panel */}
      {selectedProspect && impactMetrics && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Impact Forecast: {selectedProspect.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-chart-1">+{impactMetrics.passProWinDelta}%</p>
                <p className="text-sm text-muted-foreground">Pass Pro Win Rate</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-chart-1">{impactMetrics.pressureAllowedDelta}%</p>
                <p className="text-sm text-muted-foreground">Pressure Allowed</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-chart-1">+{impactMetrics.explosivePlaysDelta}%</p>
                <p className="text-sm text-muted-foreground">Explosive Plays</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-chart-1">+{impactMetrics.thirdDownStopDelta}%</p>
                <p className="text-sm text-muted-foreground">3rd Down Stops</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Forecasts are demo projections based on simplified model. Real impact analysis requires game film and advanced metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FitLabPage;
