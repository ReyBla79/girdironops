import { Player } from '@/types';
import { X, Scale, CheckCircle, AlertTriangle, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompareDrawerProps {
  players: Player[];
  onClose: () => void;
  onRemove: (playerId: string) => void;
}

const CompareDrawer = ({ players, onClose, onRemove }: CompareDrawerProps) => {
  if (players.length < 2) return null;

  const [p1, p2] = players;

  const getFitColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    return 'text-warning';
  };

  const getReadinessColor = (readiness: string) => {
    if (readiness === 'HIGH') return 'text-success bg-success/20';
    if (readiness === 'MED') return 'text-warning bg-warning/20';
    return 'text-muted-foreground bg-muted';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'LOW') return 'text-success bg-success/20';
    if (risk === 'MED') return 'text-warning bg-warning/20';
    return 'text-destructive bg-destructive/20';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-card border-t border-border shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold">Compare Players</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Comparison Grid */}
        <div className="p-4 overflow-x-auto">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-4 min-w-[600px]">
            {/* Headers */}
            <div />
            {[p1, p2].map((player) => (
              <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.position} • {player.classYear}</p>
                </div>
                <button 
                  onClick={() => onRemove(player.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Fit Score */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              Fit Score
            </div>
            {[p1, p2].map((player) => (
              <div key={player.id} className="flex items-center">
                <span className={`text-2xl font-bold ${getFitColor(player.fitScore)}`}>
                  {player.fitScore}
                </span>
              </div>
            ))}

            {/* Readiness */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap className="w-4 h-4 text-muted-foreground" />
              Readiness
            </div>
            {[p1, p2].map((player) => (
              <div key={player.id}>
                <span className={`text-xs px-2 py-1 rounded ${getReadinessColor(player.readiness)}`}>
                  {player.readiness}
                </span>
              </div>
            ))}

            {/* Risk */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-muted-foreground" />
              Risk
            </div>
            {[p1, p2].map((player) => (
              <div key={player.id}>
                <span className={`text-xs px-2 py-1 rounded ${getRiskColor(player.risk)}`}>
                  {player.risk}
                </span>
              </div>
            ))}

            {/* Reasons */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
              Fit Reasons
            </div>
            {[p1, p2].map((player) => (
              <div key={player.id} className="space-y-1">
                {player.reasons.slice(0, 3).map((reason, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-success">✓</span>
                    <span className="line-clamp-1">{reason}</span>
                  </p>
                ))}
              </div>
            ))}

            {/* Flags */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              Flags
            </div>
            {[p1, p2].map((player) => (
              <div key={player.id} className="space-y-1">
                {player.flags.slice(0, 2).map((flag, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-warning">⚠</span>
                    <span className="line-clamp-1">{flag}</span>
                  </p>
                ))}
                {player.flags.length === 0 && (
                  <p className="text-xs text-muted-foreground">No flags</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDrawer;
