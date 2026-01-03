import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Star, Save, Upload, Download } from 'lucide-react';
import { parseCSV } from '@/lib/csvParser';

const CSV_TEMPLATE_HEADER = 'external_ref,overall_grade,notes';
const CSV_TEMPLATE_EXAMPLE = 'player_001,85,Excellent pass blocker';

function getCtx() {
  return {
    programId: localStorage.getItem("gridiron_programId") || "",
    seasonId: localStorage.getItem("gridiron_seasonId") || "",
  };
}

interface PlayerWithGrades {
  id: string;
  first_name: string;
  last_name: string;
  position_group: string;
  position: string;
  external_ref: string | null;
  grade?: {
    id?: string;
    overall_grade: number;
    unit_grade: number;
    notes: string;
  };
}

export default function RosterGradesPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          .select('id, first_name, last_name, position_group, position, external_ref')
          .eq('program_id', programs[0].id)
          .eq('status', 'ACTIVE')
          .order('position_group');

        if (playersData) {
          const { data: gradesData } = await supabase
            .from('fb_player_grades')
            .select('*')
            .eq('season_id', seasons[0].id);

          const gradesMap = new Map(gradesData?.map((g) => [g.player_id, g]) || []);

          const playersWithData = playersData.map((p) => ({
            ...p,
            grade: gradesMap.get(p.id) || {
              overall_grade: 70,
              unit_grade: 70,
              notes: '',
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

  const handleSave = async () => {
    if (!seasonId) return;

    setSaving(true);
    try {
      for (const player of players) {
        if (!player.grade) continue;

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

      toast.success('Grades saved');
      navigate('/gridiron/roster');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast.error('No valid rows found in CSV');
        return;
      }

      // Build external_ref to player_id map
      const refMap = new Map<string, string>();
      players.forEach(p => {
        if (p.external_ref) refMap.set(p.external_ref, p.id);
      });

      let updated = 0;
      for (const row of rows) {
        const playerId = refMap.get(row.external_ref);
        if (!playerId) continue;

        setPlayers(prev => prev.map(p => {
          if (p.id === playerId) {
            return {
              ...p,
              grade: {
                ...p.grade,
                overall_grade: parseInt(row.overall_grade) || 0,
                notes: row.notes || '',
              },
            };
          }
          return p;
        }));
        updated++;
      }

      toast.success(`Updated ${updated} player grades from CSV`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to parse CSV');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const content = CSV_TEMPLATE_HEADER + '\n' + CSV_TEMPLATE_EXAMPLE;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades_template.csv';
    a.click();
    URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold tracking-tight">Impact Grades</h1>
            <p className="text-muted-foreground">
              Enter overall grade (0-100) for each player — this is the secret sauce
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/gridiron/roster/usage')}>
              ← Back to Usage
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
              {saving ? 'Saving...' : 'Save & Run Engine'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Player Grades ({players.length} players)
            </CardTitle>
            <CardDescription>
              Staff can enter grades manually, or import from analytics vendors. V1 just needs something consistent.
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
                      <TableHead>Position</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead className="text-center">Overall Grade</TableHead>
                      <TableHead className="text-center">Unit Grade</TableHead>
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
                        <TableCell className="text-muted-foreground text-xs">
                          {player.external_ref || '-'}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            className={`w-24 text-center font-mono text-lg ${getGradeColor(
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
                            className="w-24 text-center font-mono"
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
                          <Input
                            placeholder="Notes..."
                            className="min-w-[200px]"
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
