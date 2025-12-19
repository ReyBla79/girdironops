import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Upload, Settings, Film, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SEED_FILM_ASSETS } from '@/demo/filmData';
import { useAppStore } from '@/store/useAppStore';
import DemoTierSwitcher from '@/components/DemoTierSwitcher';

const FilmInboxPage = () => {
  const navigate = useNavigate();
  const { tiers, setSelectedFilm } = useAppStore();

  const handleUpload = () => {
    toast('Demo upload queued. (No backend)');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Processed</Badge>;
      case 'Processing':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Film Inbox</h1>
          <p className="text-muted-foreground">
            Upload game/practice film → auto-segment → auto-tag → clip → report. (Demo uses mock data.)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpload} variant="default">
            <Upload className="w-4 h-4 mr-2" />
            Upload (Demo)
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/film/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Tier Switch
          </Button>
        </div>
      </div>

      {/* Tier Banner */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="py-3">
          <p className="text-sm">
            <span className="font-semibold">Demo Tier: {tiers.tier}.</span>{' '}
            PRO unlocks Tracking + Advanced Analytics. ELITE unlocks Playbook Learning + Assignment Inference + Player Development.
          </p>
        </CardContent>
      </Card>

      {/* Film Inbox Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Film Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Angles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SEED_FILM_ASSETS.map((film) => (
                <TableRow key={film.filmId}>
                  <TableCell className="font-medium">{film.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{film.type}</Badge>
                  </TableCell>
                  <TableCell>{film.opponent || '—'}</TableCell>
                  <TableCell>{film.date}</TableCell>
                  <TableCell>{film.angles.join(', ')}</TableCell>
                  <TableCell>{getStatusBadge(film.status)}</TableCell>
                  <TableCell>{film.confidence}</TableCell>
                  <TableCell>{film.playsDetected || '—'}</TableCell>
                  <TableCell>
                    {film.status === 'Processed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFilm(film.filmId);
                          navigate(`/app/film/${film.filmId}`);
                        }}
                      >
                        Open Timeline
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Callout */}
      <Card>
        <CardHeader>
          <CardTitle>What Film Intelligence does</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Auto-recognizes run/pass/RPO/PA/special teams</li>
            <li>Tags formation/motion/personnel + defensive shell (demo tags)</li>
            <li>One-click cutups + scouting report generator</li>
            <li>Tracking + speed/heatmaps (PRO), Playbook learning (ELITE)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Demo Tier Switcher */}
      <DemoTierSwitcher />
    </div>
  );
};

export default FilmInboxPage;
