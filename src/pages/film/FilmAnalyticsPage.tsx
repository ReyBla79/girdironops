import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Settings, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SEED_FILM_ANALYTICS } from '@/demo/filmData';
import FeatureGateCard from '@/components/pipeline/FeatureGateCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--destructive))'];

const FilmAnalyticsPage = () => {
  const navigate = useNavigate();
  const { tiers } = useAppStore();
  const isPro = tiers.tier === 'GM' || tiers.tier === 'ELITE';

  // Transform analytics data for charts
  const runPassData = SEED_FILM_ANALYTICS.runPass.map(item => ({
    name: item.label,
    value: item.value
  }));

  const conceptFreqData = SEED_FILM_ANALYTICS.conceptFreq.map(item => ({
    concept: item.label,
    count: item.value
  }));

  const defShellsData = SEED_FILM_ANALYTICS.defShells.map(item => ({
    shell: item.label,
    count: item.value
  }));

  // Calculate run direction totals for display
  const runDirectionTotals = {
    left: SEED_FILM_ANALYTICS.runDirectionHeat.reduce((sum, row) => sum + row[0], 0),
    middle: SEED_FILM_ANALYTICS.runDirectionHeat.reduce((sum, row) => sum + row[1] + row[2], 0),
    right: SEED_FILM_ANALYTICS.runDirectionHeat.reduce((sum, row) => sum + row[3], 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Film Analytics</h1>
          <p className="text-muted-foreground">
            Tendencies by situation + heatmaps. (Demo charts rendered from mock aggregated data.)
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/app/film/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          Tier Switch
        </Button>
      </div>

      {/* Feature Gate */}
      {!isPro && (
        <FeatureGateCard
          title="Advanced Analytics"
          copy="PRO unlocks heatmaps, zones, and deeper breakdowns (coverage shells, pressures, concept success)."
          tier="GM"
          ctaPrimaryLabel="Upgrade to PRO"
          ctaSecondaryLabel="Upgrade to ELITE"
        />
      )}

      {/* Analytics Grid */}
      {isPro ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Run vs Pass */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Run vs Pass
                <Badge variant="secondary">PRO</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={runPassData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {runPassData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Concept Frequency */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Concept Frequency
                <Badge variant="secondary">PRO</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={conceptFreqData}>
                  <XAxis dataKey="concept" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Run Direction Heat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Run Direction Heat
                <Badge variant="secondary">PRO</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end h-32">
                {Object.entries(runDirectionTotals).map(([dir, val]) => (
                  <div key={dir} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-primary rounded-t"
                      style={{ height: `${val * 3}px` }}
                    />
                    <span className="text-xs mt-2 capitalize">{dir}</span>
                    <span className="text-xs text-muted-foreground">{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Defensive Shells */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Defensive Shells Faced
                <Badge variant="secondary">PRO</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={defShellsData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="shell" type="category" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Target Zone Heat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Target Zone Heat
                <Badge variant="secondary">PRO</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-1 text-center text-xs">
                {SEED_FILM_ANALYTICS.targetZoneHeat.map((row, rowIdx) => (
                  row.map((val, colIdx) => {
                    const maxVal = Math.max(...SEED_FILM_ANALYTICS.targetZoneHeat.flat());
                    const opacity = maxVal > 0 ? val / maxVal : 0;
                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className="aspect-square rounded flex items-center justify-center"
                        style={{ backgroundColor: `hsl(var(--primary) / ${opacity})` }}
                      >
                        <span className="font-mono">{val}</span>
                      </div>
                    );
                  })
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Deep → Short (top to bottom)</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {['Run vs Pass', 'Concept Frequency', 'Run Direction Heat', 'Target Zone Heat', 'Defensive Shells'].map((title) => (
            <Card key={title} className="opacity-60">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  Upgrade to PRO to unlock
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmAnalyticsPage;
