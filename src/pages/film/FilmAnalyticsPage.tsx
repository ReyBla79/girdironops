import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Settings, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { SEED_FILM_ANALYTICS } from '@/demo/filmData';
import FeatureGateCard from '@/components/pipeline/FeatureGateCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const FilmAnalyticsPage = () => {
  const navigate = useNavigate();
  const { tiers } = useAppStore();
  const isPro = tiers.tier === 'GM' || tiers.tier === 'ELITE';

  const runPassData = [
    { name: 'Run', value: SEED_FILM_ANALYTICS.runPass.run },
    { name: 'Pass', value: SEED_FILM_ANALYTICS.runPass.pass },
  ];

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
                <BarChart data={SEED_FILM_ANALYTICS.conceptFreq}>
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
                {Object.entries(SEED_FILM_ANALYTICS.runDirectionHeat).map(([dir, val]) => (
                  <div key={dir} className="flex flex-col items-center">
                    <div
                      className="w-12 bg-primary rounded-t"
                      style={{ height: `${val * 2}px` }}
                    />
                    <span className="text-xs mt-2 capitalize">{dir}</span>
                    <span className="text-xs text-muted-foreground">{val}%</span>
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
                <BarChart data={SEED_FILM_ANALYTICS.defShells} layout="vertical">
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
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                {['deep_left', 'deep_middle', 'deep_right', 'short_left', 'short_middle', 'short_right'].map((zone) => {
                  const val = SEED_FILM_ANALYTICS.targetZoneHeat[zone] || 0;
                  const opacity = Math.min(val / 25, 1);
                  return (
                    <div
                      key={zone}
                      className="aspect-square rounded flex items-center justify-center"
                      style={{ backgroundColor: `hsl(var(--primary) / ${opacity})` }}
                    >
                      <span className="font-mono">{val}%</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Deep → Short</p>
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
