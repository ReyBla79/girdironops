import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Play, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { 
  getEnrichedPlay, 
  SEED_PLAY_TAGS, 
  SEED_AI_NOTES_BY_PLAY, 
  SEED_RECOMMENDED_ACTIONS_BY_PLAY,
  SEED_TRACKING_BY_PLAY,
  SEED_ASSIGNMENT_INFERENCE_BY_PLAY,
  SEED_FILM_PLAYERS
} from '@/demo/filmData';
import { useAppStore } from '@/store/useAppStore';
import FeatureGateCard from '@/components/pipeline/FeatureGateCard';

const PlayDetailPage = () => {
  const { playId } = useParams();
  const navigate = useNavigate();
  const { tiers } = useAppStore();
  const [overlays, setOverlays] = useState({
    showTracks: false,
    showSpeedTrails: false,
    showAssignments: false,
  });

  const play = getEnrichedPlay(playId || '');
  const isPro = tiers.tier === 'GM' || tiers.tier === 'ELITE';
  const isElite = tiers.tier === 'ELITE';

  // Get enriched data
  const tags = SEED_PLAY_TAGS[playId || ''] || [];
  const aiNotes = SEED_AI_NOTES_BY_PLAY[playId || ''] || [];
  const recommendedActions = SEED_RECOMMENDED_ACTIONS_BY_PLAY[playId || ''] || [];
  const tracking = SEED_TRACKING_BY_PLAY[playId || ''];
  const assignmentInference = SEED_ASSIGNMENT_INFERENCE_BY_PLAY[playId || ''];

  // Helper to get player name
  const getPlayerName = (playerId: string) => {
    const player = SEED_FILM_PLAYERS.find(p => p.playerId === playerId);
    return player?.name || playerId;
  };

  if (!play) {
    return (
      <div className="p-6">
        <p>Play not found.</p>
        <Button onClick={() => navigate('/app/film')} className="mt-4">Back to Inbox</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-display">{play.aiConcept}</h1>
          <p className="text-muted-foreground">
            Q{play.quarter} {play.clock} • {play.down}&{play.distance} @ {play.yardline}
          </p>
        </div>
        <Badge variant={play.aiPlayType === 'RUN' ? 'default' : 'secondary'} className="ml-auto">
          {play.aiPlayType}
        </Badge>
      </div>

      {/* Video Mock Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Demo mode: video is a placeholder.</p>
              <p className="text-xs text-muted-foreground">Insights + overlays render from mock tracking + tags.</p>
            </div>
            {overlays.showTracks && isPro && (
              <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-lg pointer-events-none flex items-center justify-center">
                <span className="bg-primary/80 text-primary-foreground px-3 py-1 rounded text-sm">Tracking Overlay Active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overlay Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Overlay Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Player Tracks</Label>
              {!isPro && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>
            <Switch
              checked={overlays.showTracks}
              onCheckedChange={(v) => setOverlays({ ...overlays, showTracks: v })}
              disabled={!isPro}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Speed Trails</Label>
              {!isPro && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>
            <Switch
              checked={overlays.showSpeedTrails}
              onCheckedChange={(v) => setOverlays({ ...overlays, showSpeedTrails: v })}
              disabled={!isPro}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Assignment Zones</Label>
              {!isElite && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>
            <Switch
              checked={overlays.showAssignments}
              onCheckedChange={(v) => setOverlays({ ...overlays, showAssignments: v })}
              disabled={!isElite}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Gate */}
      {!isPro && (
        <FeatureGateCard
          title="Tracking & Overlays"
          copy="PRO unlocks speed, distance, heatmaps, and tracking overlays. ELITE adds assignment inference + bust detection."
          tier="GM"
          ctaPrimaryLabel="Upgrade to PRO"
          ctaSecondaryLabel="Upgrade to ELITE"
        />
      )}

      {/* Play Insight Panel */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <Badge key={i} variant="outline">{tag.tag}</Badge>
              ))}
              <Badge variant="outline">{play.defShell}</Badge>
              <Badge variant="outline">{play.formation}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ops GM Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {aiNotes.length > 0 ? (
              <ul className="text-sm text-muted-foreground space-y-1">
                {aiNotes.map((note, i) => (
                  <li key={i}>• {note}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {play.result.type} for {play.result.yards} yards
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Coach Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {recommendedActions.length > 0 ? (
                recommendedActions.map((action, i) => (
                  <li key={i} className="text-muted-foreground">• {action}</li>
                ))
              ) : (
                <li className="text-muted-foreground">• Review play execution</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Summary (PRO) */}
      {isPro && tracking && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              Tracking Summary
              <Badge variant="secondary">PRO</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {tracking.summary.teamMaxSpeedYdsPerSec && (
                <div>
                  <p className="text-xs text-muted-foreground">Team Max Speed</p>
                  <p className="text-lg font-semibold">{tracking.summary.teamMaxSpeedYdsPerSec} yds/s</p>
                </div>
              )}
              {tracking.summary.rbMaxSpeedYdsPerSec && (
                <div>
                  <p className="text-xs text-muted-foreground">RB Max Speed</p>
                  <p className="text-lg font-semibold">{tracking.summary.rbMaxSpeedYdsPerSec} yds/s</p>
                </div>
              )}
              {tracking.summary.qbTimeToThrowSec && (
                <div>
                  <p className="text-xs text-muted-foreground">Time to Throw</p>
                  <p className="text-lg font-semibold">{tracking.summary.qbTimeToThrowSec}s</p>
                </div>
              )}
              {tracking.summary.separationAtTargetYards && (
                <div>
                  <p className="text-xs text-muted-foreground">Separation</p>
                  <p className="text-lg font-semibold">{tracking.summary.separationAtTargetYards} yds</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Player Tracking</p>
              {tracking.players.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm bg-muted/50 px-3 py-2 rounded">
                  <span className="font-medium">{getPlayerName(p.playerId)}</span>
                  <span className="text-muted-foreground">
                    Max: {p.maxSpeed} yds/s • Dist: {p.distance} yds
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Inference (ELITE) */}
      {isElite && assignmentInference && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              Assignment Inference
              <Badge className="bg-amber-600">ELITE</Badge>
              {assignmentInference.flags.length > 0 ? (
                <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Bust Risk</Badge>
              ) : (
                <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Clean</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignmentInference.notes.map((note, i) => (
                <p key={i} className="text-sm text-muted-foreground">• {note}</p>
              ))}
              {assignmentInference.flags.map((flag, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{getPlayerName(flag.playerId)}: {flag.reason}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Confidence: {Math.round(assignmentInference.confidence * 100)}%
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayDetailPage;
