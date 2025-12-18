import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, DollarSign, AlertTriangle, Target } from 'lucide-react';
import { RosterPlayer, RosterNeed, PositionGroup } from '@/types';

const NIL_BAND_COLORS = {
  ELITE: 'bg-primary text-primary-foreground',
  HIGH: 'bg-chart-1 text-primary-foreground',
  MID: 'bg-chart-2 text-primary-foreground',
  LOW: 'bg-muted text-muted-foreground',
};

const PRIORITY_COLORS = {
  CRITICAL: 'bg-destructive text-destructive-foreground',
  HIGH: 'bg-chart-1 text-primary-foreground',
  MEDIUM: 'bg-chart-2 text-primary-foreground',
  LOW: 'bg-muted text-muted-foreground',
};

const RosterPage = () => {
  const navigate = useNavigate();
  const { roster, needs, budget, programDNA } = useAppStore();

  const totalPlayers = roster.length;
  const starters = roster.filter(p => p.starter).length;
  const atRisk = roster.filter(p => p.riskFlags.length > 0).length;
  const criticalNeeds = needs.filter(n => n.priority === 'CRITICAL' || n.priority === 'HIGH').length;

  const handleNeedClick = (needId: string) => {
    navigate(`/app/fit-lab?need=${needId}`);
  };

  const groupedRoster = roster.reduce((acc, player) => {
    if (!acc[player.positionGroup]) acc[player.positionGroup] = [];
    acc[player.positionGroup].push(player);
    return acc;
  }, {} as Record<PositionGroup, RosterPlayer[]>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Roster Snapshot</h1>
        <p className="text-muted-foreground mt-1">Demo roster + needs detection (no backend).</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPlayers}</p>
                <p className="text-sm text-muted-foreground">Total Roster</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <Target className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">{starters}</p>
                <p className="text-sm text-muted-foreground">Starters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{atRisk}</p>
                <p className="text-sm text-muted-foreground">At-Risk</p>
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
                <p className="text-2xl font-bold">${(budget.available / 1000).toFixed(0)}K</p>
                <p className="text-sm text-muted-foreground">NIL Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program DNA Quick View */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Program Priorities (Demo)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {programDNA.recruitingPriorities.slice(0, 3).map((p, i) => (
            <Badge key={i} variant="secondary">{p}</Badge>
          ))}
        </CardContent>
      </Card>

      {/* Roster Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-center">Starter</TableHead>
                  <TableHead className="text-right">Snaps %</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                  <TableHead className="text-right">Elig</TableHead>
                  <TableHead>NIL Band</TableHead>
                  <TableHead>Risk Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{player.position}</Badge>
                    </TableCell>
                    <TableCell>{player.classYear}</TableCell>
                    <TableCell className="text-center">
                      {player.starter ? '✓' : '—'}
                    </TableCell>
                    <TableCell className="text-right">{player.snapsShare}%</TableCell>
                    <TableCell className="text-right">{player.grade}</TableCell>
                    <TableCell className="text-right">{player.eligibilityRemaining}yr</TableCell>
                    <TableCell>
                      <Badge className={NIL_BAND_COLORS[player.nilBand]}>{player.nilBand}</Badge>
                    </TableCell>
                    <TableCell>
                      {player.riskFlags.length > 0 ? (
                        <span className="text-sm text-destructive">{player.riskFlags.join(', ')}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Needs Board */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Roster Needs ({criticalNeeds} Priority)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {needs.map((need) => (
              <button
                key={need.id}
                onClick={() => handleNeedClick(need.id)}
                className="p-4 border border-border rounded-lg text-left hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{need.positionGroup}</span>
                  <Badge className={PRIORITY_COLORS[need.priority]}>{need.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{need.reason}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span>Depth: {need.currentDepth}/{need.targetDepth}</span>
                  <span className="text-primary">→ Fit Lab</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RosterPage;
