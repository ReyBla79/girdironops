import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, UserPlus, UserMinus, Undo2, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Player, RosterPlayer, PositionGroup } from '@/types';

const BudgetSimulatorPage = () => {
  const navigate = useNavigate();
  const { budget, roster, players, selectedProspectId, selectProspect } = useAppStore();

  const [simulatedRoster, setSimulatedRoster] = useState<RosterPlayer[]>(roster);
  const [addedProspects, setAddedProspects] = useState<Player[]>([]);
  const [removedPlayerIds, setRemovedPlayerIds] = useState<string[]>([]);

  const selectedProspect = players.find(p => p.id === selectedProspectId);

  // Calculate current (before) spending
  const currentSpent = roster.reduce((sum, p) => sum + p.estimatedCost, 0);

  // Calculate simulated (after) spending
  const simulatedSpent = useMemo(() => {
    const rosterCost = simulatedRoster
      .filter(p => !removedPlayerIds.includes(p.id))
      .reduce((sum, p) => sum + p.estimatedCost, 0);
    const prospectCost = addedProspects.reduce((sum, p) => {
      return sum + (p.nilRange?.mid || 50000);
    }, 0);
    return rosterCost + prospectCost;
  }, [simulatedRoster, removedPlayerIds, addedProspects]);

  const budgetDelta = simulatedSpent - currentSpent;
  const remainingBefore = budget.totalBudget - currentSpent;
  const remainingAfter = budget.totalBudget - simulatedSpent;

  // Calculate position spending changes
  const spendingByPosition = useMemo(() => {
    const before: Record<string, number> = {};
    const after: Record<string, number> = {};

    roster.forEach(p => {
      before[p.positionGroup] = (before[p.positionGroup] || 0) + p.estimatedCost;
    });

    simulatedRoster
      .filter(p => !removedPlayerIds.includes(p.id))
      .forEach(p => {
        after[p.positionGroup] = (after[p.positionGroup] || 0) + p.estimatedCost;
      });

    addedProspects.forEach(p => {
      after[p.positionGroup] = (after[p.positionGroup] || 0) + (p.nilRange?.mid || 50000);
    });

    return { before, after };
  }, [roster, simulatedRoster, removedPlayerIds, addedProspects]);

  // Get replacement suggestions for selected prospect
  const replacementSuggestions = useMemo(() => {
    if (!selectedProspect) return [];
    return simulatedRoster
      .filter(p => !removedPlayerIds.includes(p.id))
      .filter(p => p.positionGroup === selectedProspect.positionGroup)
      .sort((a, b) => a.snapsShare - b.snapsShare)
      .slice(0, 3);
  }, [selectedProspect, simulatedRoster, removedPlayerIds]);

  const handleAddProspect = () => {
    if (!selectedProspect || addedProspects.find(p => p.id === selectedProspect.id)) return;
    setAddedProspects([...addedProspects, selectedProspect]);
  };

  const handleRemovePlayer = (playerId: string) => {
    if (removedPlayerIds.includes(playerId)) {
      setRemovedPlayerIds(removedPlayerIds.filter(id => id !== playerId));
    } else {
      setRemovedPlayerIds([...removedPlayerIds, playerId]);
    }
  };

  const handleUndo = () => {
    setAddedProspects([]);
    setRemovedPlayerIds([]);
    setSimulatedRoster(roster);
  };

  const hasChanges = addedProspects.length > 0 || removedPlayerIds.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/budget')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Recruit Budget Simulator</h1>
          <p className="text-muted-foreground mt-1">Plug-and-play impact before you recruit.</p>
        </div>
      </div>

      {/* Prospect Selection Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Select Prospect to Simulate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedProspect ? (
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold">{selectedProspect.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedProspect.position}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedProspect.originSchool}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Est. NIL Cost</p>
                  <p className="font-bold text-lg">
                    ${selectedProspect.nilRange?.mid?.toLocaleString() || '50,000'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleAddProspect}
                disabled={addedProspects.find(p => p.id === selectedProspect.id) !== undefined}
              >
                {addedProspects.find(p => p.id === selectedProspect.id) ? 'Added' : 'Add to Simulation'}
              </Button>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No prospect selected. Go to <button onClick={() => navigate('/app/fit-lab')} className="text-primary hover:underline">Fit Lab</button> to select a prospect.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Impact Comparison */}
      <Card className={budgetDelta !== 0 ? 'border-primary/50' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Budget Impact Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Spending</p>
              <p className="text-2xl font-bold">${(currentSpent / 1000).toFixed(0)}K</p>
              <p className="text-sm text-muted-foreground">Remaining: ${(remainingBefore / 1000).toFixed(0)}K</p>
            </div>

            <div className="p-4 bg-secondary rounded-lg text-center flex flex-col items-center justify-center">
              {budgetDelta !== 0 ? (
                <>
                  {budgetDelta > 0 ? (
                    <TrendingUp className="w-6 h-6 text-destructive mb-1" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-chart-1 mb-1" />
                  )}
                  <p className={`text-xl font-bold ${budgetDelta > 0 ? 'text-destructive' : 'text-chart-1'}`}>
                    {budgetDelta > 0 ? '+' : ''}{(budgetDelta / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-muted-foreground">Impact</p>
                </>
              ) : (
                <p className="text-muted-foreground">No changes</p>
              )}
            </div>

            <div className={`p-4 rounded-lg text-center ${remainingAfter < 0 ? 'bg-destructive/10' : 'bg-chart-1/10'}`}>
              <p className="text-sm text-muted-foreground mb-1">Projected Spending</p>
              <p className="text-2xl font-bold">${(simulatedSpent / 1000).toFixed(0)}K</p>
              <p className={`text-sm ${remainingAfter < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                Remaining: ${(remainingAfter / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          {remainingAfter < 0 && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm">Budget exceeded by ${(Math.abs(remainingAfter) / 1000).toFixed(0)}K. Consider removing a player below.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Replacement Suggestions */}
      {selectedProspect && replacementSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserMinus className="w-5 h-5" />
              Replacement Suggestions ({selectedProspect.positionGroup})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Snaps %</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {replacementSuggestions.map((player) => {
                    const isRemoved = removedPlayerIds.includes(player.id);
                    return (
                      <TableRow key={player.id} className={isRemoved ? 'opacity-50' : ''}>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{player.role}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{player.snapsShare}%</TableCell>
                        <TableCell className="text-right">${player.estimatedCost.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant={isRemoved ? 'default' : 'destructive'}
                            size="sm"
                            onClick={() => handleRemovePlayer(player.id)}
                          >
                            {isRemoved ? 'Restore' : 'Remove'}
                          </Button>
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

      {/* Simulation Actions */}
      {hasChanges && (
        <Card className="border-primary/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  {addedProspects.length > 0 && (
                    <Badge variant="default" className="gap-1">
                      <UserPlus className="w-3 h-3" />
                      {addedProspects.length} added
                    </Badge>
                  )}
                  {removedPlayerIds.length > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <UserMinus className="w-3 h-3" />
                      {removedPlayerIds.length} removed
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  All values are demo projections only.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleUndo} className="gap-2">
                  <Undo2 className="w-4 h-4" />
                  Undo All
                </Button>
                <Button variant="default" className="gap-2" disabled>
                  <CheckCircle className="w-4 h-4" />
                  Apply (Demo Only)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Added Prospects List */}
      {addedProspects.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Simulated Additions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {addedProspects.map((prospect) => (
                <div key={prospect.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{prospect.position}</Badge>
                    <span className="font-medium">{prospect.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">${prospect.nilRange?.mid?.toLocaleString() || '50,000'}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddedProspects(addedProspects.filter(p => p.id !== prospect.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetSimulatorPage;
