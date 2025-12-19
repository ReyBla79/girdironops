import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Search, TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { SEED_PIPELINES } from '@/demo/pipelineData';
import type { Pipeline, TrendDirection, PipelineStatus } from '@/types/pipeline';

type SortKey = 'name' | 'pipelineScore' | 'activeRecruits' | 'alertsOpen';
type SortDir = 'asc' | 'desc';

const TrendIcon: React.FC<{ trend: TrendDirection }> = ({ trend }) => {
  if (trend === 'UP') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'DOWN') return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const getStatusBadge = (status: PipelineStatus) => {
  switch (status) {
    case 'STRONG': return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Strong</Badge>;
    case 'COOLING': return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Cooling</Badge>;
    case 'EMERGING': return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Emerging</Badge>;
    case 'DORMANT': return <Badge variant="secondary">Dormant</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const PipelineListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('pipelineScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filteredPipelines = useMemo(() => {
    let result = [...SEED_PIPELINES];
    
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (positionFilter !== 'ALL') {
      result = result.filter(p => p.positionGroup === positionFilter);
    }
    
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    
    return result;
  }, [search, positionFilter, sortKey, sortDir]);

  const totalRecruits = SEED_PIPELINES.reduce((sum, p) => sum + p.activeRecruits, 0);
  const totalAlerts = SEED_PIPELINES.reduce((sum, p) => sum + p.alertsOpen, 0);
  const avgScore = Math.round(SEED_PIPELINES.reduce((sum, p) => sum + p.pipelineScore, 0) / SEED_PIPELINES.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Pipeline Intelligence</h1>
          <p className="text-muted-foreground text-sm">
            Pipelines as an owned asset — score, trend, alerts, ownership, and ROI.
          </p>
        </div>
        <Button onClick={() => navigate('/app/pipelines/map')}>
          <Map className="w-4 h-4 mr-2" />
          View Map
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{SEED_PIPELINES.length}</p>
            <p className="text-xs text-muted-foreground">Total Pipelines</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{avgScore}</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalRecruits}</p>
            <p className="text-xs text-muted-foreground">Active Recruits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <div>
              <p className="text-2xl font-bold">{totalAlerts}</p>
              <p className="text-xs text-muted-foreground">Open Alerts</p>
            </div>
            {totalAlerts > 0 && <AlertTriangle className="w-5 h-5 text-destructive" />}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pipelines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Positions</SelectItem>
            <SelectItem value="QB">QB</SelectItem>
            <SelectItem value="OL">OL</SelectItem>
            <SelectItem value="DL">DL</SelectItem>
            <SelectItem value="LB">LB</SelectItem>
            <SelectItem value="DB">DB</SelectItem>
            <SelectItem value="WR">WR</SelectItem>
            <SelectItem value="RB">RB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Pipeline <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Position</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('pipelineScore')}
                >
                  <div className="flex items-center gap-1">
                    Score <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Signed (5yr)</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('activeRecruits')}
                >
                  <div className="flex items-center gap-1">
                    Active <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('alertsOpen')}
                >
                  <div className="flex items-center gap-1">
                    Alerts <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPipelines.map(pipeline => (
                <TableRow 
                  key={pipeline.pipelineId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/app/pipelines/${pipeline.pipelineId}`)}
                >
                  <TableCell className="font-medium">{pipeline.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{pipeline.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{pipeline.positionGroup}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      pipeline.pipelineScore >= 80 ? 'text-green-500' :
                      pipeline.pipelineScore >= 60 ? 'text-yellow-500' : 'text-destructive'
                    }`}>
                      {pipeline.pipelineScore}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(pipeline.status)}</TableCell>
                  <TableCell><TrendIcon trend={pipeline.trend} /></TableCell>
                  <TableCell>{pipeline.playersSignedLast5Years}</TableCell>
                  <TableCell>{pipeline.activeRecruits}</TableCell>
                  <TableCell>
                    {pipeline.alertsOpen > 0 ? (
                      <Badge variant="destructive">{pipeline.alertsOpen}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineListPage;
