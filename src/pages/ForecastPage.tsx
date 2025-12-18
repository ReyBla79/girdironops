import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, TrendingUp, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { PositionGroup } from '@/types';
import LockedCardUpsell from '@/components/LockedCardUpsell';

const ForecastPage = () => {
  const navigate = useNavigate();
  const { forecast, flags } = useAppStore();

  // Gate check
  if (!flags.budget_forecast) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/budget')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">3-Year Roster Forecast</h1>
            <p className="text-muted-foreground mt-1">Budget runway + projected gaps (demo projections).</p>
          </div>
        </div>
        <LockedCardUpsell 
          title="Unlock 3-Year Forecasting" 
          copy="See Year 1/2/3 departures, gaps, and budget runway — before it becomes a crisis."
        />
      </div>
    );
  }

  const years = [
    { key: 'year1', data: forecast.year1 },
    { key: 'year2', data: forecast.year2 },
    { key: 'year3', data: forecast.year3 },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/budget')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">3-Year Roster Forecast</h1>
          <p className="text-muted-foreground mt-1">Budget runway + projected gaps (demo projections).</p>
        </div>
      </div>

      {/* Inflation Rate Notice */}
      <div className="p-3 bg-secondary rounded-lg flex items-center gap-2 text-sm">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span>Projected inflation rate: <strong>{(forecast.inflationRate * 100).toFixed(0)}%</strong> annual increase</span>
      </div>

      {/* Forecast Tabs */}
      <Tabs defaultValue="year1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="year1">{forecast.year1.label}</TabsTrigger>
          <TabsTrigger value="year2">{forecast.year2.label}</TabsTrigger>
          <TabsTrigger value="year3">{forecast.year3.label}</TabsTrigger>
        </TabsList>

        {years.map(({ key, data }) => (
          <TabsContent key={key} value={key} className="space-y-6 mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${(data.projectedSpend / 1000000).toFixed(2)}M</p>
                      <p className="text-sm text-muted-foreground">Projected Spend</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chart-1/10">
                      <Users className="w-5 h-5 text-chart-1" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.returningCount}</p>
                      <p className="text-sm text-muted-foreground">Returning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.expectedDepartures}</p>
                      <p className="text-sm text-muted-foreground">Departures</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chart-2/10">
                      <Calendar className="w-5 h-5 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{Object.keys(data.gapsByGroup).length}</p>
                      <p className="text-sm text-muted-foreground">Position Gaps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Departure Drivers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Departure Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.topDepartureDrivers.map((driver, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Position Gaps */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Projected Position Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(data.gapsByGroup).length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-right">Starter Gaps</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(data.gapsByGroup).map(([pos, gaps]) => (
                          <TableRow key={pos}>
                            <TableCell>
                              <Badge variant="outline">{pos}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-destructive">
                              {gaps}
                            </TableCell>
                            <TableCell>
                              <Badge variant={gaps >= 2 ? 'destructive' : 'secondary'}>
                                {gaps >= 2 ? 'Critical' : 'Watch'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No significant position gaps projected.</p>
                )}
              </CardContent>
            </Card>

            {/* Departures List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Projected Departures ({data.departures.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Est. Cost</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.departures.map((dep) => (
                        <TableRow key={dep.id}>
                          <TableCell className="font-medium">{dep.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{dep.position}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{dep.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ${dep.estimatedCost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={dep.reason === 'TRANSFER_RISK' ? 'destructive' : 'outline'}>
                              {dep.reason.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {data.notes.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Analysis Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.notes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        All projections are demo estimates. Not real UNLV data.
      </p>
    </div>
  );
};

export default ForecastPage;
