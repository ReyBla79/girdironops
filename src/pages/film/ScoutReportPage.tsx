import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { SEED_REPORT_TEMPLATES, OPPONENT_OPTIONS } from '@/demo/filmData';
import type { GeneratedReport } from '@/types/film';

const SITUATIONS = ['1st Down', '3rd Down', 'Red Zone', '2-Minute', 'Backed Up'];

const ScoutReportPage = () => {
  const [reportSettings, setReportSettings] = useState({
    opponent: OPPONENT_OPTIONS[0],
    situations: ['1st Down', '3rd Down'],
    includeClips: true,
  });
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);

  const toggleSituation = (sit: string) => {
    setReportSettings((prev) => ({
      ...prev,
      situations: prev.situations.includes(sit)
        ? prev.situations.filter((s) => s !== sit)
        : [...prev.situations, sit],
    }));
  };

  const handleGenerate = () => {
    toast('Generating scout report (demo)...');
    setTimeout(() => {
      setGeneratedReport(SEED_REPORT_TEMPLATES.demoReport);
      toast.success('Scout report generated!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display">Scout Report Builder</h1>
        <p className="text-muted-foreground">
          One-click staff-ready report. (Demo generates from mock tendencies + tags.)
        </p>
      </div>

      {/* Report Builder Form */}
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opponent */}
          <div className="space-y-2">
            <Label>Opponent</Label>
            <Select
              value={reportSettings.opponent}
              onValueChange={(v) => setReportSettings({ ...reportSettings, opponent: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPPONENT_OPTIONS.map((opp) => (
                  <SelectItem key={opp} value={opp}>{opp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Situations */}
          <div className="space-y-2">
            <Label>Include Situations</Label>
            <div className="flex flex-wrap gap-2">
              {SITUATIONS.map((sit) => (
                <Badge
                  key={sit}
                  variant={reportSettings.situations.includes(sit) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleSituation(sit)}
                >
                  {sit}
                </Badge>
              ))}
            </div>
          </div>

          {/* Include Clips */}
          <div className="flex items-center justify-between">
            <Label>Include Clip Links</Label>
            <Switch
              checked={reportSettings.includeClips}
              onCheckedChange={(v) => setReportSettings({ ...reportSettings, includeClips: v })}
            />
          </div>

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report (Demo)
          </Button>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {generatedReport && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{generatedReport.title}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast('Download started (demo)')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {generatedReport.sections.map((section, i) => (
              <div key={i}>
                <h3 className="font-semibold text-sm mb-2 text-primary">{section.heading}</h3>
                <ul className="space-y-1">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-xs text-muted-foreground border-t pt-4">
              Generated: {new Date().toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScoutReportPage;
