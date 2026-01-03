import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Save, Upload, Download } from 'lucide-react';
import { parseUsageGradesCSV, CSV_TEMPLATE_B_HEADER, CSV_TEMPLATE_B_EXAMPLE } from '@/lib/footballValueEngine';

interface PlayerWithUsage {
  id: string;
  first_name: string;
  last_name: string;
  position_group: string;
  position: string;
  external_ref: string | null;
  usage?: {
    id?: string;
    games_played: number;
    snaps: number;
    snaps_offense: number;
    snaps_defense: number;
    snaps_st: number;
    leverage_snaps: number;
  };
}

export default function RosterUsagePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [players, setPlayers] = useState<PlayerWithUsage[]>([]);
  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      const { data: seasons } = await supabase
        .from('seasons')
        .select('id')
        .eq('program_id', programs[0].id)
        .limit(1);

      if (seasons && seasons.length > 0) {
        setSeasonId(seasons[0].id);

        const { data: playersData } = await supabase
          .from('fb_players')
          .select('id, first_name, last_name, position_group, position, external_ref')
          .eq('program_id', programs[0].id)
          .eq('status', 'ACTIVE')
          .order('position_group');

        if (playersData) {
          const { data: usageData } = await supabase
            .from('fb_player_season_usage')
            .select('*')
            .eq('season_id', seasons[0].id);

          const usageMap = new Map(usageData?.map((u) => [u.player_id, u]) || []);

          const playersWithUsage = playersData.map((p) => ({
            ...p,
            usage: usageMap.get(p.id) || {
              games_played: 0,
              snaps: 0,
              snaps_offense: 0,
              snaps_defense: 0,
              snaps_st: 0,
              leverage_snaps: 0,
            },
          }));

          setPlayers(playersWithUsage);
        }
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUsage = (playerId: string, field: string, value: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, usage: { ...p.usage!, [field]: value } }
          : p
      )
    );
  };

  const handleSave = async () => {
    if (!seasonId) return;

    setSaving(true);
    try {
      for (const player of players) {
        if (!player.usage) continue;

        const usageRecord = {
          player_id: player.id,
          season_id: seasonId,
          games_played: player.usage.games_played,
          snaps: player.usage.snaps,
          snaps_offense: player.usage.snaps_offense,
          snaps_defense: player.usage.snaps_defense,
          snaps_st: player.usage.snaps_st,
          leverage_snaps: player.usage.leverage_snaps,
        };

        if (player.usage.id) {
          await supabase
            .from('fb_player_season_usage')
            .update(usageRecord)
            .eq('id', player.usage.id);
        } else {
          await supabase.from('fb_player_season_usage').insert(usageRecord);
        }
      }

      toast.success('Usage data saved');
      navigate('/gridiron/roster/grades');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save usage data');
    } finally {
      setSaving(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !seasonId) return;

    try {
      const text = await file.text();
      const parsed = parseUsageGradesCSV(text);

      if (parsed.length === 0) {
        toast.error('No valid rows found in CSV');
        return;
      }

      // Build external_ref to player_id map
      const refMap = new Map<string, string>();
      players.forEach(p => {
        if (p.external_ref) refMap.set(p.external_ref, p.id);
      });

      let updated = 0;
      for (const row of parsed) {
        const playerId = refMap.get(row.external_ref);
        if (!playerId) continue;

        // Update usage in state
        setPlayers(prev => prev.map(p => {
          if (p.id === playerId) {
            return {
              ...p,
              usage: {
                ...p.usage,
                games_played: row.games_played,
                snaps: row.snaps,
                snaps_offense: row.snaps_offense,
                snaps_defense: row.snaps_defense,
                snaps_st: row.snaps_st,
                leverage_snaps: row.leverage_snaps,
              },
            };
          }
          return p;
        }));
        updated++;
      }

      toast.success(`Updated ${updated} player usage records from CSV`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to parse CSV');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const content = CSV_TEMPLATE_B_HEADER + '\n' + CSV_TEMPLATE_B_EXAMPLE;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage_grades_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Usage Data</h1>
            <p className="text-muted-foreground">
              Enter games played, snaps, and leverage snaps for each player
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/gridiron/roster/intake')}>
              ← Back to Roster
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Season Usage ({players.length} players)
            </CardTitle>
            <CardDescription>
              Leverage snaps = 3rd/4th down, red zone, 1-score games, 2-minute drills
            </CardDescription>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No players found. Add players in the Roster Intake step.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Player</TableHead>
                      <TableHead>Pos</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead className="text-center">GP</TableHead>
                      <TableHead className="text-center">Total Snaps</TableHead>
                      <TableHead className="text-center">OFF</TableHead>
                      <TableHead className="text-center">DEF</TableHead>
                      <TableHead className="text-center">ST</TableHead>
                      <TableHead className="text-center">Leverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          {player.first_name} {player.last_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {player.external_ref || '-'}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="15"
                            className="w-16 text-center"
                            value={player.usage?.games_played || 0}
                            onChange={(e) =>
                              updateUsage(player.id, 'games_played', parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            className="w-20 text-center"
                            value={player.usage?.snaps || 0}
                            onChange={(e) =>
                              updateUsage(player.id, 'snaps', parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            className="w-20 text-center"
                            value={player.usage?.snaps_offense || 0}
                            onChange={(e) =>
                              updateUsage(player.id, 'snaps_offense', parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            className="w-20 text-center"
                            value={player.usage?.snaps_defense || 0}
                            onChange={(e) =>
                              updateUsage(player.id, 'snaps_defense', parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            className="w-20 text-center"
                            value={player.usage?.snaps_st || 0}
                            onChange={(e) =>
                              updateUsage(player.id, 'snaps_st', parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            className="w-20 text-center"
                            value={player.usage?.leverage_snaps || 0}
                            onChange={(e) =>
                              updateUsage(player.id, 'leverage_snaps', parseInt(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
