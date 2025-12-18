import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { Radio, Filter, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PortalPage = () => {
  const navigate = useNavigate();
  const { players, events, simulatePortalEntry } = useAppStore();
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [poolFilter, setPoolFilter] = useState<string>('all');

  const portalEvents = events.filter((e) => 
    e.type === 'PORTAL_NEW' || e.type === 'PORTAL_UPDATED' || e.type === 'PORTAL_WITHDRAWN'
  );

  const filteredPlayers = players.filter((p) => {
    if (positionFilter !== 'all' && p.positionGroup !== positionFilter) return false;
    if (poolFilter !== 'all' && p.pool !== poolFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" />
            Portal Live
          </h1>
          <p className="text-muted-foreground">Real-time transfer portal monitoring</p>
        </div>
        <Button variant="hero" onClick={simulatePortalEntry}>
          <Plus className="w-4 h-4" />
          Simulate Portal Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm"
        >
          <option value="all">All Positions</option>
          <option value="OL">Offensive Line</option>
          <option value="DL">Defensive Line</option>
          <option value="LB">Linebackers</option>
          <option value="DB">Defensive Backs</option>
          <option value="WR">Wide Receivers</option>
          <option value="RB">Running Backs</option>
          <option value="QB">Quarterbacks</option>
          <option value="TE">Tight Ends</option>
        </select>
        <select
          value={poolFilter}
          onChange={(e) => setPoolFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm"
        >
          <option value="all">All Pools</option>
          <option value="TRANSFER_PORTAL">Transfer Portal</option>
          <option value="HS">High School</option>
          <option value="JUCO">JUCO</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portal Updates Feed */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-display font-semibold">Recent Updates</h2>
            </div>
            <div className="max-h-[500px] overflow-auto">
              {portalEvents.length > 0 ? (
                <div className="divide-y divide-border">
                  {portalEvents.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          event.type === 'PORTAL_NEW' ? 'bg-primary' :
                          event.type === 'PORTAL_WITHDRAWN' ? 'bg-destructive' :
                          'bg-warning'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{event.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(event.ts), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No portal updates yet</p>
                  <p className="text-sm mt-1">Click "Simulate Portal Entry" to add one</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Players Table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-semibold">Portal Players ({filteredPlayers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PLAYER</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POS</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ORIGIN</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">FIT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POOL</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr 
                      key={player.id}
                      className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/app/player/${player.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.eligibility}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">
                          {player.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{player.originSchool}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${player.fitScore >= 90 ? 'text-success' : player.fitScore >= 80 ? 'text-primary' : 'text-warning'}`}>
                          {player.fitScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          player.pool === 'TRANSFER_PORTAL' ? 'bg-primary/20 text-primary' :
                          player.pool === 'HS' ? 'bg-success/20 text-success' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {player.pool === 'TRANSFER_PORTAL' ? 'Portal' : player.pool}
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
      </div>
    </div>
  );
};

export default PortalPage;
