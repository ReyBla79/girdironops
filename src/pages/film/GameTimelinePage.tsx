import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, FileText, Play as PlayIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { SEED_FILM_ASSETS, getPlaysForFilm, SEED_PLAY_TAGS, SEED_AI_NOTES_BY_PLAY, PLAY_TYPE_OPTIONS } from '@/demo/filmData';
import { useAppStore } from '@/store/useAppStore';

const GameTimelinePage = () => {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const { 
    filmUI, 
    setFilmTimelineFilters, 
    addPlayToCutup, 
    removePlayFromCutup,
    clearCutup,
    setSelectedPlay 
  } = useAppStore();
  
  const filters = filmUI.filmTimelineFilters;
  const cutup = filmUI.cutupPlays;

  const film = SEED_FILM_ASSETS.find((f) => f.filmId === filmId);
  const plays = getPlaysForFilm(filmId || '');

  const filteredPlays = plays.filter((play) => {
    if (!play) return false;
    if (filters.quarter !== 'ALL' && play.quarter !== parseInt(filters.quarter)) return false;
    if (filters.down !== 'ALL' && play.down !== parseInt(filters.down)) return false;
    if (filters.playType !== 'ALL' && play.aiPlayType !== filters.playType) return false;
    if (filters.concept && !play.aiConcept.toLowerCase().includes(filters.concept.toLowerCase())) return false;
    return true;
  });

  if (!film) {
    return (
      <div className="p-6">
        <p>Film not found.</p>
        <Button onClick={() => navigate('/app/film')} className="mt-4">Back to Inbox</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/film')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-display">{film.title}</h1>
          <p className="text-muted-foreground">
            {film.opponent} • {film.date} • {film.playsDetected} plays detected
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <Select value={filters.quarter} onValueChange={(v) => setFilmTimelineFilters({ quarter: v })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Quarters</SelectItem>
                <SelectItem value="1">Q1</SelectItem>
                <SelectItem value="2">Q2</SelectItem>
                <SelectItem value="3">Q3</SelectItem>
                <SelectItem value="4">Q4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.down} onValueChange={(v) => setFilmTimelineFilters({ down: v })}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Down" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Downs</SelectItem>
                <SelectItem value="1">1st</SelectItem>
                <SelectItem value="2">2nd</SelectItem>
                <SelectItem value="3">3rd</SelectItem>
                <SelectItem value="4">4th</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.playType} onValueChange={(v) => setFilmTimelineFilters({ playType: v })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Play Type" />
              </SelectTrigger>
              <SelectContent>
                {PLAY_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt === 'ALL' ? 'All Types' : opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Search concept/tag..."
              value={filters.concept}
              onChange={(e) => setFilmTimelineFilters({ concept: e.target.value })}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Play Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPlays.map((play) => {
          if (!play) return null;
          const tags = SEED_PLAY_TAGS[play.playId] || [];
          const aiNotes = SEED_AI_NOTES_BY_PLAY[play.playId] || [];
          
          return (
            <Card key={play.playId} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">
                      Q{play.quarter} {play.clock} • {play.down}&{play.distance} @ {play.yardline}
                    </p>
                    <h3 className="font-semibold text-lg">{play.aiConcept}</h3>
                  </div>
                  <Badge variant={play.aiPlayType === 'RUN' ? 'default' : 'secondary'}>
                    {play.aiPlayType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{play.defShell}</Badge>
                  <Badge variant="outline">{play.formation}</Badge>
                  {tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag.tag}</Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {aiNotes[0] || `${play.result.type} for ${play.result.yards} yards`}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Confidence: {Math.round(play.confidence * 100)}%
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addPlayToCutup(play.playId)}
                      disabled={cutup.includes(play.playId)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Cutup
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setSelectedPlay(play.playId);
                        navigate(`/app/film/play/${play.playId}`);
                      }}
                    >
                      <PlayIcon className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cutup Builder Dock */}
      {cutup.length > 0 && (
        <Card className="fixed bottom-4 right-4 w-80 shadow-xl border-primary">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Cutup Builder ({cutup.length} plays)</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearCutup}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs text-muted-foreground max-h-20 overflow-auto space-y-1">
              {cutup.map((id) => {
                const p = plays.find((pl) => pl?.playId === id);
                return (
                  <div key={id} className="flex items-center justify-between">
                    <span>{p?.aiConcept} (Q{p?.quarter})</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removePlayFromCutup(id)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast('Cutup link generated (demo).')}>
                Generate Link
              </Button>
              <Button size="sm" onClick={() => navigate('/app/film/report')}>
                <FileText className="w-4 h-4 mr-1" />
                Scout Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameTimelinePage;
