import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Users, Plus, Upload, Trash2, Download, FileText } from 'lucide-react';
import { parseCSV } from '@/lib/csvParser';

const CSV_TEMPLATE_HEADER = 'first_name,last_name,position_group,position,class_year,height_inches,weight_lbs,status,role,depth_rank,replacement_risk,external_ref';
const CSV_TEMPLATE_EXAMPLE = 'John,Doe,QB,QB,Jr,74,210,ACTIVE,STARTER,1,LOW,player_001';

function getCtx() {
  return {
    programId: localStorage.getItem("gridiron_programId") || "",
    seasonId: localStorage.getItem("gridiron_seasonId") || "",
  };
}
const POSITION_GROUPS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'ST'];
const POSITIONS = {
  QB: ['QB'],
  RB: ['RB', 'FB'],
  WR: ['WR', 'SLOT'],
  TE: ['TE'],
  OL: ['LT', 'LG', 'C', 'RG', 'RT', 'OT', 'OG'],
  DL: ['EDGE', 'DT', 'NT', 'DE'],
  LB: ['MLB', 'OLB', 'ILB', 'LB'],
  DB: ['CB', 'S', 'FS', 'SS', 'NB'],
  ST: ['K', 'P', 'LS'],
};
const CLASS_YEARS = ['Fr', 'So', 'Jr', 'Sr', 'Gr'];
const ROLES = ['STARTER', 'ROTATION', 'BACKUP', 'DEVELOPMENTAL'];
const RISK_LEVELS = ['LOW', 'MED', 'HIGH'];

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  position_group: string;
  position: string;
  class_year: string;
  height_inches: number | null;
  weight_lbs: number | null;
  status: string;
  external_ref: string | null;
}

interface PlayerRole {
  player_id: string;
  role: string;
  depth_rank: number;
  replacement_risk: string;
}

export default function RosterIntakePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roles, setRoles] = useState<Map<string, PlayerRole>>(new Map());
  const [loading, setLoading] = useState(true);
  const [programId, setProgramId] = useState<string | null>(null);
  const [seasonId, setSeasonId] = useState<string | null>(null);

  // New player form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [positionGroup, setPositionGroup] = useState('QB');
  const [position, setPosition] = useState('QB');
  const [classYear, setClassYear] = useState('Jr');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [role, setRole] = useState('ROTATION');
  const [depthRank, setDepthRank] = useState('2');
  const [replacementRisk, setReplacementRisk] = useState('MED');
  const [externalRef, setExternalRef] = useState('');

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
        toast.error('No program found. Please run Setup first.');
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

        const { data: playersData } = await supabase
          .from('fb_players')
          .select('*')
          .eq('program_id', programs[0].id)
          .order('position_group', { ascending: true });

        setPlayers(playersData || []);

        // Load roles
        const { data: rolesData } = await supabase
          .from('fb_player_roles')
          .select('*')
          .eq('season_id', seasons[0].id);

        const roleMap = new Map<string, PlayerRole>();
        rolesData?.forEach(r => roleMap.set(r.player_id, r));
        setRoles(roleMap);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter first and last name');
      return;
    }

    if (!programId || !seasonId) {
      toast.error('No program found. Please run Setup first.');
      navigate('/gridiron/setup');
      return;
    }

    try {
      // Create player
      const { data: player, error } = await supabase
        .from('fb_players')
        .insert({
          program_id: programId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          position_group: positionGroup,
          position: position,
          class_year: classYear,
          height_inches: heightInches ? parseInt(heightInches) : null,
          weight_lbs: weightLbs ? parseInt(weightLbs) : null,
          status: 'ACTIVE',
          external_ref: externalRef.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Create role
      await supabase.from('fb_player_roles').insert({
        player_id: player.id,
        season_id: seasonId,
        role: role,
        depth_rank: parseInt(depthRank),
        replacement_risk: replacementRisk,
      });

      setPlayers([...players, player]);
      setRoles(new Map(roles.set(player.id, {
        player_id: player.id,
        role,
        depth_rank: parseInt(depthRank),
        replacement_risk: replacementRisk,
      })));

      // Reset form
      setFirstName('');
      setLastName('');
      setHeightInches('');
      setWeightLbs('');
      setExternalRef('');
      toast.success('Player added');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add player');
    }
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      await supabase.from('fb_players').delete().eq('id', id);
      setPlayers(players.filter((p) => p.id !== id));
      toast.success('Player removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove player');
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !programId || !seasonId) return;

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast.error('No valid rows found in CSV');
        return;
      }

      let added = 0;
      for (const row of rows) {
        const { data: player, error } = await supabase
          .from('fb_players')
          .insert({
            program_id: programId,
            first_name: row.first_name,
            last_name: row.last_name,
            position_group: row.position_group || 'WR',
            position: row.position || row.position_group || 'WR',
            class_year: row.class_year || '',
            height_inches: row.height_inches ? parseInt(row.height_inches) : null,
            weight_lbs: row.weight_lbs ? parseInt(row.weight_lbs) : null,
            status: row.status || 'ACTIVE',
            external_ref: row.external_ref || null,
          })
          .select()
          .single();

        if (!error && player) {
          await supabase.from('fb_player_roles').insert({
            player_id: player.id,
            season_id: seasonId,
            role: (row.role || 'ROTATION').toUpperCase(),
            depth_rank: row.depth_rank ? parseInt(row.depth_rank) : 2,
            replacement_risk: (row.replacement_risk || 'MED').toUpperCase(),
          });
          added++;
        }
      }

      toast.success(`Imported ${added} players`);
      await loadData();
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
    a.download = 'roster_intake_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const groupedPlayers = POSITION_GROUPS.reduce((acc, group) => {
    acc[group] = players.filter((p) => p.position_group === group);
    return acc;
  }, {} as Record<string, Player[]>);

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
            <h1 className="text-3xl font-bold tracking-tight">Roster Intake</h1>
            <p className="text-muted-foreground">
              Add players with role, depth rank, and replacement risk
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template CSV
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
            <Button onClick={() => navigate('/gridiron/roster/usage')}>
              Continue to Usage →
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Player
            </CardTitle>
            <CardDescription>
              Enter player info with role and risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Position Group</Label>
                <Select
                  value={positionGroup}
                  onValueChange={(v) => {
                    setPositionGroup(v);
                    setPosition(POSITIONS[v as keyof typeof POSITIONS][0]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITION_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS[positionGroup as keyof typeof POSITIONS].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class Year</Label>
                <Select value={classYear} onValueChange={setClassYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_YEARS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Height (in)</Label>
                <Input
                  type="number"
                  placeholder="74"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (lbs)</Label>
                <Input
                  type="number"
                  placeholder="210"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Depth Rank</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={depthRank}
                  onChange={(e) => setDepthRank(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Replace Risk</Label>
                <Select value={replacementRisk} onValueChange={setReplacementRisk}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_LEVELS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>External Ref</Label>
                <Input
                  placeholder="player_001"
                  value={externalRef}
                  onChange={(e) => setExternalRef(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddPlayer} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Roster ({players.length} players)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  No players added yet. Add players above or import from CSV.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {POSITION_GROUPS.map((group) => {
                  const groupPlayers = groupedPlayers[group];
                  if (groupPlayers.length === 0) return null;

                  return (
                    <div key={group}>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge variant="outline">{group}</Badge>
                        <span className="text-muted-foreground text-sm">
                          ({groupPlayers.length})
                        </span>
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Depth</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Ref</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupPlayers.map((player) => {
                            const playerRole = roles.get(player.id);
                            return (
                              <TableRow key={player.id}>
                                <TableCell className="font-medium">
                                  {player.first_name} {player.last_name}
                                </TableCell>
                                <TableCell>{player.position}</TableCell>
                                <TableCell>{player.class_year}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {playerRole?.role || 'ROTATION'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{playerRole?.depth_rank || 2}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      playerRole?.replacement_risk === 'HIGH' ? 'destructive' :
                                      playerRole?.replacement_risk === 'LOW' ? 'default' : 'secondary'
                                    }
                                  >
                                    {playerRole?.replacement_risk || 'MED'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                  {player.external_ref || '-'}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeletePlayer(player.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
