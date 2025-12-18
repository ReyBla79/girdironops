import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { Radio, Filter, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const PortalPage = () => {
  const navigate = useNavigate();
  const { players, simulatePortalEntry } = useAppStore();
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [poolFilter, setPoolFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [minFit, setMinFit] = useState<number>(0);

  const filteredPlayers = players.filter((p) => {
    if (positionFilter !== 'all' && p.positionGroup !== positionFilter) return false;
    if (poolFilter !== 'all' && p.pool !== poolFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (p.fitScore < minFit) return false;
    return true;
  }).sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime());

  const handleSimulate = () => {
    simulatePortalEntry();
    toast.success('1 new portal match found.');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" />
            Portal Live
          </h1>
          <p className="text-muted-foreground">Simulated real-time feed for demo.</p>
        </div>
      </div>

      {/* Portal Filters */}
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm"
        >
          <option value="all">All Status</option>
          <option value="NEW">New</option>
          <option value="UPDATED">Updated</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Min Fit:</span>
          <input
            type="number"
            value={minFit}
            onChange={(e) => setMinFit(Number(e.target.value))}
            min={0}
            max={100}
            className="w-16 px-2 py-1.5 rounded-lg bg-secondary border border-border text-sm"
          />
        </div>
      </div>

      {/* Portal Updates Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold">Portal Updates ({filteredPlayers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PLAYER</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POOL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ENTERED</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">FIT</th>
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
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      player.status === 'NEW' ? 'bg-primary/20 text-primary' :
                      player.status === 'UPDATED' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {player.status}
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
                    <span className={`text-xs px-2 py-1 rounded ${
                      player.pool === 'TRANSFER_PORTAL' ? 'bg-primary/20 text-primary' :
                      player.pool === 'HS' ? 'bg-success/20 text-success' :
                      'bg-warning/20 text-warning'
                    }`}>
                      {player.pool === 'TRANSFER_PORTAL' ? 'Portal' : player.pool}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(player.enteredAt), { addSuffix: true })}
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

      {/* Button Row */}
      <div className="flex justify-center">
        <Button variant="hero" size="lg" onClick={handleSimulate}>
          <Plus className="w-4 h-4" />
          Simulate New Portal Entry
        </Button>
      </div>
    </div>
  );
};

export default PortalPage;
