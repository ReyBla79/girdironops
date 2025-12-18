import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';

const TodayPage = () => {
  const navigate = useNavigate();
  const { players, events, tasks, demoRole, markPlayerReviewed } = useAppStore();

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const topTargets = [...players]
    .filter(p => p.status !== 'WITHDRAWN')
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 6);
    
  const newEvents = events.filter((e) => {
    const eventDate = new Date(e.ts);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return eventDate > yesterday;
  }).slice(0, 6);
  
  const myTasks = tasks.filter((t) => t.status === 'OPEN').slice(0, 4);

  const getPlayerName = (playerId?: string) => {
    if (!playerId) return null;
    const player = players.find(p => p.id === playerId);
    return player?.name;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Daily Digest Header */}
      <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Today</h1>
            <p className="text-muted-foreground mt-1">
              {greeting} — here's what changed since yesterday.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Last updated: {format(today, 'h:mm a')}
          </div>
        </div>
      </div>

      {/* New Since Yesterday */}
      {newEvents.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            New Since Yesterday
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {newEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  event.type === 'PORTAL_NEW' ? 'bg-primary' :
                  event.type === 'PORTAL_WITHDRAWN' ? 'bg-destructive' :
                  event.type === 'PORTAL_UPDATED' ? 'bg-warning' :
                  'bg-success'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(event.ts), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Top Targets Table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Targets
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/players')}>
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PLAYER</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">SIZE</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ELIG</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POOL</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">FIT</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {topTargets.map((player) => (
                    <tr 
                      key={player.id} 
                      className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/app/player/${player.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.originSchool}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">
                          {player.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {player.height} / {player.weight}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{player.eligibility}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          player.pool === 'TRANSFER_PORTAL' ? 'bg-primary/20 text-primary' :
                          player.pool === 'JUCO' ? 'bg-warning/20 text-warning' :
                          'bg-success/20 text-success'
                        }`}>
                          {player.pool === 'TRANSFER_PORTAL' ? 'Portal' : player.pool}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          player.status === 'NEW' ? 'bg-primary/20 text-primary' :
                          player.status === 'UPDATED' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${player.fitScore >= 90 ? 'text-success' : player.fitScore >= 80 ? 'text-primary' : 'text-warning'}`}>
                          {player.fitScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Tasks Widget */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Open Tasks</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/tasks')}>
                View All
              </Button>
            </div>
            {myTasks.length > 0 ? (
              <div className="space-y-3">
                {myTasks.map((task) => {
                  const playerName = getPlayerName(task.playerId);
                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-secondary border border-border">
                      <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{task.owner}</span>
                        {task.due && (
                          <span className="text-xs text-warning">
                            Due {formatDistanceToNow(new Date(task.due), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No open tasks</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/app/tasks')}>
              + Create Task
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-display font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-primary">{players.filter(p => p.status === 'NEW').length}</p>
                <p className="text-xs text-muted-foreground">New entries</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-success">{players.filter(p => p.fitScore >= 85).length}</p>
                <p className="text-xs text-muted-foreground">High-fit targets</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-warning">{tasks.filter(t => t.status === 'OPEN').length}</p>
                <p className="text-xs text-muted-foreground">Open tasks</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-bold">{players.filter(p => p.reviewed).length}</p>
                <p className="text-xs text-muted-foreground">Reviewed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPage;
