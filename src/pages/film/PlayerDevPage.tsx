import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SEED_PLAYER_DEVELOPMENT } from '@/demo/filmData';
import FeatureGateCard from '@/components/pipeline/FeatureGateCard';
import { 
  POSITION_OPTIONS, 
  POSITION_GROUP_OPTIONS, 
  positionMatchesFilter, 
  getPositionFilterLabel 
} from '@/demo/positionConfig';

const PlayerDevPage = () => {
  const { tiers } = useAppStore();
  const isElite = tiers.tier === 'ELITE';
  const [positionFilter, setPositionFilter] = useState('ALL');

  const filteredPlayers = useMemo(() => {
    if (positionFilter === 'ALL') return SEED_PLAYER_DEVELOPMENT;
    return SEED_PLAYER_DEVELOPMENT.filter(p => positionMatchesFilter(p.position, positionFilter));
  }, [positionFilter]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Player Development</h1>
          <p className="text-muted-foreground">
            Weekly improvement tracking + drill recommendations (ELITE).
          </p>
        </div>
        {isElite && (
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Position">{getPositionFilterLabel(positionFilter)}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="ALL">All Positions</SelectItem>
              <SelectGroup>
                <SelectLabel>Position Groups</SelectLabel>
                {POSITION_GROUP_OPTIONS.filter(g => g !== 'ALL').map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Individual Positions</SelectLabel>
                {POSITION_OPTIONS.filter(p => p !== 'ALL').map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Feature Gate */}
      {!isElite && (
        <FeatureGateCard
          title="Player Development Plans"
          copy="ELITE unlocks per-player development plans, issue detection, drill suggestions, and weekly trends."
          tier="ELITE"
          ctaPrimaryLabel="Upgrade to ELITE"
        />
      )}

      {/* Player Dev Grid */}
      {isElite ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => (
            <Card key={player.playerId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{player.name}</CardTitle>
                    <Badge variant="outline">{player.position}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(player.weeklyTrend)}
                    <span className="text-xs text-muted-foreground">{player.weeklyTrend}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress Score</span>
                    <span className="font-semibold">{player.progressScore}%</span>
                  </div>
                  <Progress value={player.progressScore} className="h-2" />
                </div>

                {/* Issues */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Identified Issues</p>
                  <ul className="text-sm space-y-1">
                    {player.issues.map((issue, i) => (
                      <li key={i} className="text-destructive">• {issue}</li>
                    ))}
                  </ul>
                </div>

                {/* Drills */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Recommended Drills</p>
                  <div className="flex flex-wrap gap-1">
                    {player.drills.map((drill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{drill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  Player {i}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                  Upgrade to ELITE to unlock
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerDevPage;