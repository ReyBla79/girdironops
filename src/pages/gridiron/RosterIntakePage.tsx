import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Users, Plus, Upload, Trash2 } from 'lucide-react';

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
}

export default function RosterIntakePage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [programId, setProgramId] = useState<string | null>(null);

  // New player form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [positionGroup, setPositionGroup] = useState('QB');
  const [position, setPosition] = useState('QB');
  const [classYear, setClassYear] = useState('Jr');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get first program (demo mode)
      const { data: programs } = await supabase
        .from('programs')
        .select('id')
        .limit(1);

      if (programs && programs.length > 0) {
        setProgramId(programs[0].id);

        const { data: playersData } = await supabase
          .from('fb_players')
          .select('*')
          .eq('program_id', programs[0].id)
          .order('position_group', { ascending: true });

        setPlayers(playersData || []);
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

    if (!programId) {
      toast.error('No program found. Please run Setup first.');
      navigate('/gridiron/setup');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fb_players')
        .insert({
          program_id: programId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          position_group: positionGroup,
          position: position,
          class_year: classYear,
          status: 'ACTIVE',
        })
        .select()
        .single();

      if (error) throw error;

      setPlayers([...players, data]);
      setFirstName('');
      setLastName('');
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roster Intake</h1>
            <p className="text-muted-foreground">
              Add players to your roster for RevShare calculations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
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
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
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
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <p className="text-muted-foreground text-center py-8">
                No players added yet. Add players above or import from CSV.
              </p>
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
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupPlayers.map((player) => (
                            <TableRow key={player.id}>
                              <TableCell className="font-medium">
                                {player.first_name} {player.last_name}
                              </TableCell>
                              <TableCell>{player.position}</TableCell>
                              <TableCell>{player.class_year}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    player.status === 'ACTIVE'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  {player.status}
                                </Badge>
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
                          ))}
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
