import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const TodayPage = () => {
  const navigate = useNavigate();
  const { players, events, tasks, demoRole, markPlayerReviewed } = useAppStore();

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const topTargets = [...players].sort((a, b) => b.fitScore - a.fitScore).slice(0, 6);
  const newEvents = events.filter((e) => {
    const eventDate = new Date(e.ts);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return eventDate > yesterday;
  });
  const myTasks = tasks.filter((t) => t.status !== 'DONE').slice(0, 3);

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
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Calendar className="w-4 h-4" />
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              {greeting}, Coach
            </h1>
            <p className="text-muted-foreground mt-1">
              {topTargets.length} top targets • {newEvents.length} new since yesterday
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 text-success text-sm">
              <CheckCircle className="w-4 h-4" />
              Digest Ready
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Top Targets */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Since Yesterday */}
          {newEvents.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-display font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                New Since Yesterday
              </h2>
              <div className="space-y-2">
                {newEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'PORTAL_NEW' ? 'bg-primary' :
                      event.type === 'PORTAL_WITHDRAWN' ? 'bg-destructive' :
                      'bg-success'
                    }`} />
                    <span className="text-sm flex-1">{event.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(event.ts), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Targets Table */}
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">RANK</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PLAYER</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">FIT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">READY</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">RISK</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {topTargets.map((player, i) => (
                    <tr 
                      key={player.id} 
                      className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/app/player/${player.id}`)}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          i === 0 ? 'gradient-accent text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
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
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${player.fitScore >= 90 ? 'text-success' : player.fitScore >= 80 ? 'text-primary' : 'text-warning'}`}>
                          {player.fitScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          player.readiness === 'HIGH' ? 'bg-success/20 text-success' :
                          player.readiness === 'MED' ? 'bg-warning/20 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {player.readiness}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          player.risk === 'LOW' ? 'bg-success/20 text-success' :
                          player.risk === 'MED' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {player.risk}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {player.reviewed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-success">
                            <CheckCircle className="w-3 h-3" /> Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-warning">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
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

        {/* Right Column - Tasks */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-display font-semibold mb-4">Open Tasks</h2>
            {myTasks.length > 0 ? (
              <div className="space-y-3">
                {myTasks.map((task) => {
                  const playerName = getPlayerName(task.playerId);
                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-secondary border border-border">
                      <p className="font-medium text-sm">{task.title}</p>
                      {playerName && (
                        <p className="text-xs text-muted-foreground mt-1">Player: {playerName}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          task.status === 'OPEN' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                        }`}>
                          {task.status}
                        </span>
                        {task.due && (
                          <span className="text-xs text-muted-foreground">
                            Due {formatDistanceToNow(new Date(task.due), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No pending tasks</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/app/tasks')}>
              View All Tasks
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-display font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => navigate('/app/tasks')}>
                Create Task
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => navigate('/app/portal')}>
                Check Portal
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => {
                const unreviewed = players.find(p => !p.reviewed);
                if (unreviewed) markPlayerReviewed(unreviewed.id);
              }}>
                Mark Next Reviewed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPage;
