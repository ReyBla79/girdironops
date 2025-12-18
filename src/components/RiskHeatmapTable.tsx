import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { RiskHeatmap, PositionGroup } from '@/types';

interface RiskHeatmapTableProps {
  riskHeatmap: RiskHeatmap;
  onCellClick?: (group: PositionGroup, risk: 'GREEN' | 'YELLOW' | 'RED') => void;
}

const RISK_BG: Record<string, string> = {
  GREEN: 'bg-chart-1/20 text-chart-1',
  YELLOW: 'bg-chart-2/20 text-chart-2',
  RED: 'bg-destructive/20 text-destructive',
};

const RiskHeatmapTable = ({ riskHeatmap, onCellClick }: RiskHeatmapTableProps) => {
  const totalsByRisk = riskHeatmap.byPositionGroup.reduce(
    (acc, row) => ({
      GREEN: acc.GREEN + row.GREEN,
      YELLOW: acc.YELLOW + row.YELLOW,
      RED: acc.RED + row.RED,
    }),
    { GREEN: 0, YELLOW: 0, RED: 0 }
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Risk Heatmap by Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead className="text-center">🟢 GREEN</TableHead>
                <TableHead className="text-center">🟡 YELLOW</TableHead>
                <TableHead className="text-center">🔴 RED</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskHeatmap.byPositionGroup.map((row) => {
                const total = row.GREEN + row.YELLOW + row.RED;
                return (
                  <TableRow key={row.positionGroup}>
                    <TableCell>
                      <Badge variant="outline">{row.positionGroup}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => onCellClick?.(row.positionGroup, 'GREEN')}
                        className={`px-3 py-1 rounded-md font-medium ${row.GREEN > 0 ? RISK_BG.GREEN : 'text-muted-foreground'}`}
                        disabled={row.GREEN === 0}
                      >
                        {row.GREEN}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => onCellClick?.(row.positionGroup, 'YELLOW')}
                        className={`px-3 py-1 rounded-md font-medium ${row.YELLOW > 0 ? RISK_BG.YELLOW : 'text-muted-foreground'}`}
                        disabled={row.YELLOW === 0}
                      >
                        {row.YELLOW}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => onCellClick?.(row.positionGroup, 'RED')}
                        className={`px-3 py-1 rounded-md font-medium ${row.RED > 0 ? RISK_BG.RED : 'text-muted-foreground'}`}
                        disabled={row.RED === 0}
                      >
                        {row.RED}
                      </button>
                    </TableCell>
                    <TableCell className="text-right font-medium">{total}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-semibold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-center">
                  <span className={RISK_BG.GREEN + ' px-3 py-1 rounded-md'}>{totalsByRisk.GREEN}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={RISK_BG.YELLOW + ' px-3 py-1 rounded-md'}>{totalsByRisk.YELLOW}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={RISK_BG.RED + ' px-3 py-1 rounded-md'}>{totalsByRisk.RED}</span>
                </TableCell>
                <TableCell className="text-right">{totalsByRisk.GREEN + totalsByRisk.YELLOW + totalsByRisk.RED}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Key Risks */}
        {riskHeatmap.keyRisks.length > 0 && (
          <div className="mt-4 p-3 bg-chart-2/10 rounded-lg">
            <p className="text-sm font-medium mb-2">Key Risk Players:</p>
            <div className="flex flex-wrap gap-2">
              {riskHeatmap.keyRisks.map((risk) => (
                <Badge 
                  key={risk.playerId} 
                  variant="secondary"
                  className="gap-1"
                >
                  <span className={risk.riskColor === 'YELLOW' ? 'text-chart-2' : 'text-destructive'}>●</span>
                  {risk.name}
                  <span className="text-muted-foreground">({risk.drivers.join(', ')})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskHeatmapTable;
