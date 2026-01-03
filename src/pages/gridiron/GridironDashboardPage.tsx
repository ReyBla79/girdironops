import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Users, TrendingUp, Calculator, RefreshCw, BarChart3 } from 'lucide-react';
import { 
  runValueEngine, 
  FootballPlayerInput,
  PolicyWeights,
  PolicyMultipliers,
  PolicyGuardrails,
  DEFAULT_WEIGHTS,
  DEFAULT_POSITION_MULTIPLIERS,
  DEFAULT_GUARDRAILS,
} from '@/lib/footballValueEngine';

interface ValueSnapshot {
  id: string;
  player_id: string;
  total_score: number;
  share_pct: number;
  dollars_low: number;
  dollars_mid: number;
  dollars_high: number;
  confidence: number;
  rationale: any;
  player?: {
    first_name: string;
    last_name: string;
    position: string;
    position_group: string;
  };
}

interface PoolInfo {
  pool_amount: number;
  reserved_amount: number;
}

export default function GridironDashboardPage() {
  const navigate = useNavigate();
  const [snapshots, setSnapshots] = useState<ValueSnapshot[]>([]);
  const [pool, setPool] = useState<PoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);
  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [policyId, setPolicyId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: programs } = await supabase
        .from('programs')
        .select('id')
        .limit(1);

      if (!programs || programs.length === 0) {
        navigate('/gridiron/setup');
        return;
      }

      setProgramId(programs[0].id);

      const { data: seasons } = await supabase
        .from('seasons')
        .select('id')
        .eq('program_id', programs[0].id)
        .limit(1);

      if (seasons && seasons.length > 0) {
        setSeasonId(seasons[0].id);

        const { data: poolData } = await supabase
          .from('fb_revshare_pools')
          .select('pool_amount, reserved_amount')
          .eq('program_id', programs[0].id)
          .eq('season_id', seasons[0].id)
          .maybeSingle();

        if (poolData) setPool(poolData);

        const { data: policyData } = await supabase
          .from('fb_revshare_policies')
          .select('id')
          .eq('program_id', programs[0].id)
          .eq('season_id', seasons[0].id)
          .eq('is_active', true)
          .limit(1);

        if (policyData && policyData.length > 0) {
          setPolicyId(policyData[0].id);
        }

        const { data: snapshotData } = await supabase
          .from('fb_value_snapshots')
          .select('*')
          .eq('program_id', programs[0].id)
          .eq('season_id', seasons[0].id)
          .order('share_pct', { ascending: false });

        if (snapshotData && snapshotData.length > 0) {
          const playerIds = snapshotData.map((s) => s.player_id);
          const { data: playersData } = await supabase
            .from('fb_players')
            .select('id, first_name, last_name, position, position_group')
            .in('id', playerIds);

          const playerMap = new Map(playersData?.map((p) => [p.id, p]) || []);

          const enriched = snapshotData.map((s) => ({
            ...s,
            player: playerMap.get(s.player_id),
          }));

          setSnapshots(enriched);
        }
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const runEngine = async () => {
    if (!programId || !seasonId || !policyId) {
      toast.error('Missing program, season, or policy');
      return;
    }

    setRunning(true);
    try {
      // Get policy
      const { data: policy } = await supabase
        .from('fb_revshare_policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (!policy) throw new Error('Policy not found');

      // Get all players with usage, grades, roles
      const { data: players } = await supabase
        .from('fb_players')
        .select('id, position, position_group')
        .eq('program_id', programId)
        .eq('status', 'ACTIVE');

      if (!players || players.length === 0) {
        toast.error('No active players found');
        setRunning(false);
        return;
      }

      const { data: usageData } = await supabase
        .from('fb_player_season_usage')
        .select('*')
        .eq('season_id', seasonId);

      const { data: gradesData } = await supabase
        .from('fb_player_grades')
        .select('*')
        .eq('season_id', seasonId);

      const { data: rolesData } = await supabase
        .from('fb_player_roles')
        .select('*')
        .eq('season_id', seasonId);

      const usageMap = new Map(usageData?.map((u) => [u.player_id, u]) || []);
      const gradesMap = new Map(gradesData?.map((g) => [g.player_id, g]) || []);
      const rolesMap = new Map(rolesData?.map((r) => [r.player_id, r]) || []);

      // Build input for value engine
      const engineInputs: FootballPlayerInput[] = players.map(player => {
        const usage = usageMap.get(player.id);
        const grade = gradesMap.get(player.id);
        const role = rolesMap.get(player.id);

        return {
          playerId: player.id,
          position: player.position,
          overallGrade: grade?.overall_grade || 50,
          snaps: usage?.snaps || 0,
          leverageSnaps: usage?.leverage_snaps || 0,
          replacementRisk: (role?.replacement_risk as 'LOW' | 'MED' | 'HIGH') || 'MED',
        };
      });

      const poolAmount = pool?.pool_amount || 20000000;
      const reservedAmount = pool?.reserved_amount || 0;
      const weights = (policy.weights as unknown as PolicyWeights) || DEFAULT_WEIGHTS;
      const posMultipliers = (policy.position_multipliers as unknown as PolicyMultipliers) || DEFAULT_POSITION_MULTIPLIERS;
      const guardrails = (policy.guardrails as unknown as PolicyGuardrails) || DEFAULT_GUARDRAILS;

      // Run value engine
      const results = runValueEngine(
        engineInputs,
        poolAmount,
        reservedAmount,
        weights,
        posMultipliers,
        guardrails
      );

      // Delete old snapshots
      await supabase
        .from('fb_value_snapshots')
        .delete()
        .eq('program_id', programId)
        .eq('season_id', seasonId);

      // Insert new snapshots
      for (const result of results) {
        await supabase.from('fb_value_snapshots').insert({
          program_id: programId,
          season_id: seasonId,
          policy_id: policyId,
          player_id: result.playerId,
          total_score: result.totalScore,
          share_pct: result.sharePct,
          dollars_low: result.dollarsLow,
          dollars_mid: result.dollarsMid,
          dollars_high: result.dollarsHigh,
          confidence: result.confidence,
          rationale: result.rationale,
        });
      }

      toast.success('Engine complete! Refreshing...');
      await loadData();
    } catch (error: any) {
      console.error('Engine error:', error);
      toast.error(error.message || 'Engine failed');
    } finally {
      setRunning(false);
    }
  };

  const totalAllocated = snapshots.reduce((sum, s) => sum + s.dollars_mid, 0);
  const topEarners = snapshots.slice(0, 5);
  const availablePool = (pool?.pool_amount || 0) - (pool?.reserved_amount || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gridiron RevShare</h1>
            <p className="text-muted-foreground">
              Football roster value distribution — run the engine to calculate allocations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/gridiron/roster/grades')}>
              ← Edit Data
            </Button>
            <Button variant="outline" onClick={() => navigate('/gridiron/scenarios')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Scenarios
            </Button>
            <Button onClick={runEngine} disabled={running}>
              {running ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Engine
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(pool?.pool_amount || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reserved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(pool?.reserved_amount || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${availablePool.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Players Scored
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshots.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${snapshots.length > 0
                  ? (totalAllocated / snapshots.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Earners */}
        {topEarners.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top 5 Earners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEarners.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-muted-foreground w-8">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {s.player?.first_name} {s.player?.last_name}
                        </span>
                        <Badge variant="outline">{s.player?.position}</Badge>
                      </div>
                      <Progress value={Math.min(s.share_pct * 8, 100)} className="h-2" />
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className="text-xl font-bold">
                        ${s.dollars_mid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {s.share_pct.toFixed(2)}% share
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              All Player Allocations
            </CardTitle>
            <CardDescription>
              Ranked by share percentage — click Run Engine to recalculate
            </CardDescription>
          </CardHeader>
          <CardContent>
            {snapshots.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No allocations yet. Add players, usage, and grades, then run the engine.
                </p>
                <Button onClick={() => navigate('/gridiron/roster/intake')}>
                  Start with Roster Intake
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Share %</TableHead>
                    <TableHead className="text-right">$ Low</TableHead>
                    <TableHead className="text-right">$ Mid</TableHead>
                    <TableHead className="text-right">$ High</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshots.map((s, idx) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-bold text-lg">{idx + 1}</TableCell>
                      <TableCell className="font-medium">
                        {s.player?.first_name} {s.player?.last_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{s.player?.position}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {s.total_score.toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {s.share_pct.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${s.dollars_low.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${s.dollars_mid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${s.dollars_high.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={s.confidence >= 80 ? 'default' : 'secondary'}>
                          {s.confidence}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
