import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, ArrowLeft } from 'lucide-react';

export default function GridironScenariosPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Scenarios
              <Badge variant="secondary">V1.5</Badge>
            </h1>
            <p className="text-muted-foreground">
              What-if modeling for roster and budget changes
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/gridiron/roster')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Coming in V1.5
            </CardTitle>
            <CardDescription>
              Scenario modeling is planned for the next release
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Planned Features:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Add Player</strong> — Model the impact of adding a transfer or recruit
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Remove Player</strong> — See how departures affect allocation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Adjust Pool</strong> — Model different total budget scenarios
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Weight Tuning</strong> — Test different policy weight configurations
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Compare Scenarios</strong> — Side-by-side comparison of allocations
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/gridiron/roster')} className="flex-1">
                View Current Allocations
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/gridiron/setup')}
                className="flex-1"
              >
                Adjust Program Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
