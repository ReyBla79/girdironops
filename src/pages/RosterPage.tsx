import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, DollarSign, AlertTriangle, Target } from 'lucide-react';
import { RosterPlayer, RosterNeed, PositionGroup } from '@/types';

const NIL_BAND_COLORS = {
  HIGH: 'bg-chart-1 text-primary-foreground',
  MED: 'bg-chart-2 text-primary-foreground',
  LOW: 'bg-muted text-muted-foreground',
};

const PRIORITY_COLORS = {
  MUST_REPLACE: 'bg-destructive text-destructive-foreground',
  UPGRADE: 'bg-chart-1 text-primary-foreground',
  DEPTH: 'bg-muted text-muted-foreground',
};

const RISK_COLORS = {
  NONE: 'text-muted-foreground',
  LOW: 'text-chart-2',
  MED: 'text-chart-1',
  HIGH: 'text-destructive',
};

const RosterPage = () => {
  const navigate = useNavigate();
  const { roster, needs, budget, programDNA } = useAppStore();

  const totalPlayers = roster.length;
  const starters = roster.filter(p => p.role === 'STARTER').length;
  const atRisk = roster.filter(p => p.risk !== 'NONE').length;
  const urgentNeeds = needs.filter(n => n.priority === 'MUST_REPLACE' || n.priority === 'UPGRADE').length;

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
                <p className="text-lg font-bold">{budget.nilTotalBand}</p>
                <p className="text-sm text-muted-foreground">NIL Band</p>
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
                  <TableHead>Pos Group</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Snaps %</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead>Grad Year</TableHead>
                  <TableHead>NIL Band</TableHead>
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
                    <TableCell>
                      <Badge variant={player.role === 'STARTER' ? 'default' : 'secondary'}>
                        {player.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{player.snapsShare}%</TableCell>
                    <TableCell className="text-right">${player.estimatedCost.toLocaleString()}</TableCell>
                    <TableCell>{player.gradYear}</TableCell>
                    <TableCell>
                      <Badge className={NIL_BAND_COLORS[player.nilBand]}>{player.nilBand}</Badge>
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

      {/* Needs Board */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Roster Needs ({urgentNeeds} Priority)
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
                  <span className="font-semibold">{need.label}</span>
                  <Badge className={PRIORITY_COLORS[need.priority]}>{need.priority.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{need.reason}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span>{need.positionGroup}</span>
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
