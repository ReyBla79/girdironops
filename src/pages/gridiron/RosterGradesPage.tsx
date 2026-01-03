import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Star, Save } from 'lucide-react';

const ROLES = ['STARTER', 'ROTATION', 'BACKUP', 'DEVELOPMENT'];
const RISK_LEVELS = ['LOW', 'MED', 'HIGH'];

interface PlayerWithGrades {
  id: string;
  first_name: string;
  last_name: string;
  position_group: string;
  position: string;
  grade?: {
    id?: string;
    overall_grade: number;
    unit_grade: number;
    notes: string;
  };
  role?: {
    id?: string;
    role: string;
    depth_rank: number;
    replacement_risk: string;
  };
}

export default function RosterGradesPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerWithGrades[]>([]);
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
          .select('id, first_name, last_name, position_group, position')
          .eq('program_id', programs[0].id)
          .eq('status', 'ACTIVE')
          .order('position_group');

        if (playersData) {
          const { data: gradesData } = await supabase
            .from('fb_player_grades')
            .select('*')
            .eq('season_id', seasons[0].id);

          const { data: rolesData } = await supabase
            .from('fb_player_roles')
            .select('*')
            .eq('season_id', seasons[0].id);

          const gradesMap = new Map(gradesData?.map((g) => [g.player_id, g]) || []);
          const rolesMap = new Map(rolesData?.map((r) => [r.player_id, r]) || []);

          const playersWithData = playersData.map((p) => ({
            ...p,
            grade: gradesMap.get(p.id) || {
              overall_grade: 70,
              unit_grade: 70,
              notes: '',
            },
            role: rolesMap.get(p.id) || {
              role: 'ROTATION',
              depth_rank: 2,
              replacement_risk: 'MED',
            },
          }));

          setPlayers(playersWithData);
        }
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = (playerId: string, field: string, value: any) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, grade: { ...p.grade!, [field]: value } }
          : p
      )
    );
  };

  const updateRole = (playerId: string, field: string, value: any) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, role: { ...p.role!, [field]: value } }
          : p
      )
    );
  };

  const handleSave = async () => {
    if (!seasonId) return;

    setSaving(true);
    try {
      for (const player of players) {
        // Save grades
        if (player.grade) {
          const gradeRecord = {
            player_id: player.id,
            season_id: seasonId,
            overall_grade: player.grade.overall_grade,
            unit_grade: player.grade.unit_grade,
            notes: player.grade.notes || null,
          };

          if (player.grade.id) {
            await supabase
              .from('fb_player_grades')
              .update(gradeRecord)
              .eq('id', player.grade.id);
          } else {
            await supabase.from('fb_player_grades').insert(gradeRecord);
          }
        }

        // Save roles
        if (player.role) {
          const roleRecord = {
            player_id: player.id,
            season_id: seasonId,
            role: player.role.role,
            depth_rank: player.role.depth_rank,
            replacement_risk: player.role.replacement_risk,
          };

          if (player.role.id) {
            await supabase
              .from('fb_player_roles')
              .update(roleRecord)
              .eq('id', player.role.id);
          } else {
            await supabase.from('fb_player_roles').insert(roleRecord);
          }
        }
      }

      toast.success('Grades & roles saved');
      navigate('/gridiron/roster');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return 'text-green-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
            <h1 className="text-3xl font-bold tracking-tight">Grades & Roles</h1>
            <p className="text-muted-foreground">
              Enter performance grades and depth chart positions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/gridiron/roster/usage')}>
              ← Back to Usage
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save & Run Engine'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Player Grades & Depth ({players.length} players)
            </CardTitle>
            <CardDescription>
              Overall grade (0-100), role, depth rank, and replacement risk
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
                      <TableHead className="text-center">Overall</TableHead>
                      <TableHead className="text-center">Unit</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Depth</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Notes</TableHead>
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
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className={`w-20 text-center font-mono ${getGradeColor(
                              player.grade?.overall_grade || 0
                            )}`}
                            value={player.grade?.overall_grade || 0}
                            onChange={(e) =>
                              updateGrade(
                                player.id,
                                'overall_grade',
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className="w-20 text-center font-mono"
                            value={player.grade?.unit_grade || 0}
                            onChange={(e) =>
                              updateGrade(
                                player.id,
                                'unit_grade',
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={player.role?.role || 'ROTATION'}
                            onValueChange={(v) => updateRole(player.id, 'role', v)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            className="w-16 text-center"
                            value={player.role?.depth_rank || 2}
                            onChange={(e) =>
                              updateRole(
                                player.id,
                                'depth_rank',
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={player.role?.replacement_risk || 'MED'}
                            onValueChange={(v) =>
                              updateRole(player.id, 'replacement_risk', v)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {RISK_LEVELS.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Notes..."
                            className="min-w-[120px]"
                            value={player.grade?.notes || ''}
                            onChange={(e) =>
                              updateGrade(player.id, 'notes', e.target.value)
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
