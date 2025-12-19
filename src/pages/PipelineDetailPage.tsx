import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  Users,
  Target,
  DollarSign,
  History,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SEED_PIPELINE_PINS, SEED_PIPELINE_ALERTS, SEED_PIPELINE_DETAILS, SEED_STAFF_OWNERS } from '@/demo/pipelineData';
import type { PipelineStatus, TrendDirection } from '@/types/pipeline';

const TrendIcon: React.FC<{ trend: TrendDirection; className?: string }> = ({ trend, className = "w-5 h-5" }) => {
  if (trend === 'UP') return <TrendingUp className={`${className} text-green-500`} />;
  if (trend === 'DOWN') return <TrendingDown className={`${className} text-destructive`} />;
  return <Minus className={`${className} text-muted-foreground`} />;
};

const getStatusBadge = (status: PipelineStatus) => {
  switch (status) {
    case 'STRONG': return <Badge className="bg-green-500 text-white">Strong</Badge>;
    case 'COOLING': return <Badge className="bg-yellow-500 text-black">Cooling</Badge>;
    case 'EMERGING': return <Badge className="bg-blue-500 text-white">Emerging</Badge>;
    case 'DORMANT': return <Badge variant="secondary">Dormant</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const PipelineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const pipeline = SEED_PIPELINE_PINS.find(p => p.pipelineId === id);
  const details = id ? SEED_PIPELINE_DETAILS[id] : null;
  const alerts = SEED_PIPELINE_ALERTS.filter(a => a.pipelineId === id);
  const owner = pipeline ? SEED_STAFF_OWNERS.find(s => s.staffId === pipeline.ownerStaffId) : null;

  if (!pipeline) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Pipeline not found</p>
        <Button variant="outline" onClick={() => navigate('/app/pipelines')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pipelines
        </Button>
      </div>
    );
  }

  // Use default score factors if no detail exists
  const scoreFactors = details?.scoreFactors || {
    historicalSuccess: 70,
    recentActivity: 65,
    relationshipDepth: 72,
    competitionPressure: 50,
    retentionOutcome: 68,
    momentum: 70,
  };

  const trendHistory = details?.trendHistory || [
    { month: 'Jan', score: pipeline.pipelineScore - 8 },
    { month: 'Feb', score: pipeline.pipelineScore - 6 },
    { month: 'Mar', score: pipeline.pipelineScore - 4 },
    { month: 'Apr', score: pipeline.pipelineScore - 2 },
    { month: 'May', score: pipeline.pipelineScore },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate('/app/pipelines')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold">{pipeline.name}</h1>
            {getStatusBadge(pipeline.status)}
            <TrendIcon trend={pipeline.trend} className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{pipeline.level}</Badge>
            <Badge variant="secondary">{pipeline.positionGroup}</Badge>
            <span className="text-sm text-muted-foreground">• {pipeline.geoId}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-primary">{pipeline.pipelineScore}</p>
          <p className="text-sm text-muted-foreground">Pipeline Score</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.activeRecruits}</p>
              <p className="text-xs text-muted-foreground">Active Recruits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.playersSignedLast5Years}</p>
              <p className="text-xs text-muted-foreground">Signed (5 yr)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.roiScore}</p>
              <p className="text-xs text-muted-foreground">ROI Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pipeline.budgetModifier < 1 ? '-' : '+'}{Math.abs((pipeline.budgetModifier - 1) * 100).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Budget Modifier</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(scoreFactors).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{value}</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ownership */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Pipeline Ownership
          </CardTitle>
        </CardHeader>
        <CardContent>
          {owner ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{owner.name}</p>
                <p className="text-sm text-muted-foreground">{owner.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No owner assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active alerts for this pipeline.</p>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.alertId} 
                className={`p-4 rounded-lg border-l-4 bg-card ${
                  alert.severity === 'HIGH' ? 'border-l-destructive' : 
                  alert.severity === 'MED' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    alert.severity === 'HIGH' ? 'text-destructive' : 
                    alert.severity === 'MED' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{alert.title}</span>
                      <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-sm text-primary mt-2 font-medium">→ {alert.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineDetailPage;
