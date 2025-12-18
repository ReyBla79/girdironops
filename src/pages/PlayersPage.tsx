import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { Users, Search, ChevronRight, CheckCircle, AlertCircle, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CompareDrawer from '@/components/CompareDrawer';

const PlayersPage = () => {
  const navigate = useNavigate();
  const { players } = useAppStore();
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [poolFilter, setPoolFilter] = useState<string>('all');
  const [minFit, setMinFit] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredPlayers = players.filter((p) => {
    const searchLower = search.toLowerCase();
    if (search && !(
      p.name.toLowerCase().includes(searchLower) ||
      p.position.toLowerCase().includes(searchLower) ||
      p.originSchool.toLowerCase().includes(searchLower) ||
      p.state.toLowerCase().includes(searchLower)
    )) return false;
    if (positionFilter !== 'all' && p.positionGroup !== positionFilter) return false;
    if (poolFilter !== 'all' && p.pool !== poolFilter) return false;
    if (p.fitScore < minFit) return false;
    return true;
  }).sort((a, b) => b.fitScore - a.fitScore);

  const toggleSelection = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(playerId)) {
      setSelectedIds(selectedIds.filter(id => id !== playerId));
    } else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, playerId]);
    }
  };

  const selectedPlayers = players.filter(p => selectedIds.includes(p.id));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Players
        </h1>
        <p className="text-muted-foreground">Search and compare across pools.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search name, position, school, state…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-card border border-border">
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
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
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm"
        >
          <option value="all">All Pools</option>
          <option value="TRANSFER_PORTAL">Transfer Portal</option>
          <option value="HS">High School</option>
          <option value="JUCO">JUCO</option>
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Min Fit:</span>
          <input
            type="number"
            value={minFit}
            onChange={(e) => setMinFit(Number(e.target.value))}
            min={0}
            max={100}
            className="w-16 px-2 py-2 rounded-lg bg-secondary border border-border text-sm"
          />
        </div>
        {selectedIds.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length}/2 selected
            </span>
            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {positionFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
            {positionFilter}
            <button onClick={() => setPositionFilter('all')} className="ml-1 hover:text-primary/70">×</button>
          </span>
        )}
        {poolFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
            {poolFilter === 'TRANSFER_PORTAL' ? 'Portal' : poolFilter}
            <button onClick={() => setPoolFilter('all')} className="ml-1 hover:text-primary/70">×</button>
          </span>
        )}
        {minFit > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
            Fit ≥ {minFit}
            <button onClick={() => setMinFit(0)} className="ml-1 hover:text-primary/70">×</button>
          </span>
        )}
      </div>

      {/* Players Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{filteredPlayers.length} players found</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scale className="w-4 h-4" />
            Select 2 to compare
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-10"></th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">PLAYER</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">POS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">SIZE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ORIGIN</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">FIT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">READY</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">RISK</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, i) => {
                const isSelected = selectedIds.includes(player.id);
                return (
                  <tr 
                    key={player.id}
                    className={`border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : ''}`}
                    onClick={() => navigate(`/app/player/${player.id}`)}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => toggleSelection(player.id, e)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3 h-3" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-muted-foreground">{i + 1}</span>
                    </td>
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
                    <td className="px-4 py-3 text-sm text-muted-foreground">{player.height} / {player.weight}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{player.originSchool}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${player.fitScore >= 90 ? 'text-success' : player.fitScore >= 80 ? 'text-primary' : 'text-warning'}`}>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compare Drawer */}
      {selectedIds.length === 2 && (
        <CompareDrawer 
          players={selectedPlayers} 
          onClose={() => setSelectedIds([])}
          onRemove={(id) => setSelectedIds(selectedIds.filter(sid => sid !== id))}
        />
      )}
    </div>
  );
};

export default PlayersPage;
