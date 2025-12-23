import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Film, 
  Lock, 
  Plus, 
  UserCheck,
  TrendingUp,
  Shield,
  Zap,
  MapPin
} from 'lucide-react';

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { players, flags, demoRole, markPlayerReviewed, addTask, userList, addEvent } = useAppStore();

  const player = players.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Player not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/app/players')}>
          Back to Players
        </Button>
      </div>
    );
  }

  const handleCreateTask = () => {
    const coordinator = userList.find((u) => u.role === 'COORDINATOR');
    if (coordinator) {
      addTask({
        title: `Evaluate ${player.name} (${player.position})`,
        owner: coordinator.name,
        playerId: player.id,
        due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'OPEN',
      });
    }
  };

  const handleRequestContact = () => {
    addEvent({
      type: 'CONTACT_REQUESTED',
      playerId: player.id,
      message: `Contact request submitted for ${player.name} — pending compliance approval`,
    });
  };

  const canSeeNIL = ['HC', 'GM_RC'].includes(demoRole || '') && flags.nil_engine;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header */}
      <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold">{player.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  player.status === 'NEW' ? 'bg-primary/20 text-primary' :
                  player.status === 'UPDATED' ? 'bg-warning/20 text-warning' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {player.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-lg bg-secondary text-sm font-medium">
                  {player.position}
                </span>
                <span className="text-muted-foreground">{player.height} / {player.weight} lbs</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{player.classYear} • {player.eligibility}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{player.hometown}, {player.state}</span>
                <span>•</span>
                <span>From {player.originSchool}</span>
              </div>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  player.pool === 'TRANSFER_PORTAL' ? 'bg-primary/20 text-primary' :
                  player.pool === 'HS' ? 'bg-success/20 text-success' :
                  'bg-warning/20 text-warning'
                }`}>
                  {player.pool === 'TRANSFER_PORTAL' ? 'Transfer Portal' : player.pool}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {player.reviewed ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm">
                <CheckCircle className="w-4 h-4" />
                Reviewed
              </span>
            ) : (
              <Button variant="success" size="sm" onClick={() => markPlayerReviewed(player.id)}>
                <UserCheck className="w-4 h-4" />
                Mark Reviewed
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Scores Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fit Score</p>
              <p className={`text-2xl font-bold ${player.fitScore >= 90 ? 'text-success' : player.fitScore >= 80 ? 'text-primary' : 'text-warning'}`}>
                {player.fitScore}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              player.readiness === 'HIGH' ? 'bg-success/20' :
              player.readiness === 'MED' ? 'bg-warning/20' :
              'bg-muted'
            }`}>
              <Zap className={`w-5 h-5 ${
                player.readiness === 'HIGH' ? 'text-success' :
                player.readiness === 'MED' ? 'text-warning' :
                'text-muted-foreground'
              }`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Readiness</p>
              <p className={`text-2xl font-bold ${
                player.readiness === 'HIGH' ? 'text-success' :
                player.readiness === 'MED' ? 'text-warning' :
                'text-muted-foreground'
              }`}>
                {player.readiness}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              player.risk === 'LOW' ? 'bg-success/20' : 
              player.risk === 'MED' ? 'bg-warning/20' : 
              'bg-destructive/20'
            }`}>
              <Shield className={`w-5 h-5 ${
                player.risk === 'LOW' ? 'text-success' : 
                player.risk === 'MED' ? 'text-warning' : 
                'text-destructive'
              }`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk</p>
              <p className={`text-2xl font-bold ${
                player.risk === 'LOW' ? 'text-success' : 
                player.risk === 'MED' ? 'text-warning' : 
                'text-destructive'
              }`}>
                {player.risk}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reasons & Flags */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Fit Reasons
          </h3>
          <ul className="space-y-2">
            {player.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-success mt-0.5">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Flags & Notes
          </h3>
          {player.flags.length > 0 ? (
            <ul className="space-y-2">
              {player.flags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-warning mt-0.5">⚠</span>
                  {flag}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No flags</p>
          )}
        </div>
      </div>

      {/* Film Links */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Film className="w-5 h-5 text-primary" />
          Film
        </h3>

        {player.filmLinks.length > 0 ? (
          <div className="space-y-4">
            {player.filmLinks.map((link, i) => {
              const url = (link.url || '').trim();
              const isPlaceholder = !url || url === '#';
              const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

              if (!isPlaceholder && isVideo) {
                return (
                  <div key={i} className="space-y-2">
                    <div className="text-sm font-medium">{link.label}</div>
                    <div className="overflow-hidden rounded-lg border border-border bg-muted">
                      <video
                        className="w-full h-auto"
                        controls
                        preload="metadata"
                        src={url}
                      />
                    </div>
                  </div>
                );
              }

              if (!isPlaceholder) {
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground opacity-70"
                >
                  {link.label}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No film available</p>
        )}
      </div>

      {/* NIL Snapshot - Conditional */}
      {canSeeNIL && player.nilRange && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-glow">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            💰 NIL Snapshot
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Low Est.</p>
              <p className="font-semibold">${player.nilRange.low.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mid Est.</p>
              <p className="font-semibold">${player.nilRange.mid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">High Est.</p>
              <p className="font-semibold">${player.nilRange.high.toLocaleString()}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs text-muted-foreground">Rationale</p>
              <p className="text-sm">{player.nilRange.rationale}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="hero" onClick={handleCreateTask}>
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
        <Button variant="outline" onClick={handleRequestContact}>
          <Lock className="w-4 h-4" />
          Request Contact
        </Button>
      </div>
    </div>
  );
};

export default PlayerProfile;
