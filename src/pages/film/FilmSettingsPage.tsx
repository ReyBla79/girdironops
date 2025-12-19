import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DemoTierSwitcher from '@/components/DemoTierSwitcher';

const FilmSettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display">Film Demo Settings</h1>
        <p className="text-muted-foreground">Live tier switch for meetings.</p>
      </div>

      {/* Demo Tier Switcher */}
      <DemoTierSwitcher
        label="Demo Tier"
        note="Switch tiers to demo locked vs unlocked features."
      />

      {/* How to Demo */}
      <Card>
        <CardHeader>
          <CardTitle>How to demo this</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">1</span>
              <span><strong>Start CORE</strong> → show Inbox → Timeline → Cutup builder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">2</span>
              <span><strong>Switch to GM (PRO)</strong> → show Play overlays + Analytics charts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">3</span>
              <span><strong>Switch to ELITE</strong> → show Assignment Inference + Player Dev plans</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Tier Feature Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Feature Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">CORE</th>
                  <th className="text-center py-2">GM (PRO)</th>
                  <th className="text-center py-2">ELITE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Auto-tagging</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Cutup Builder</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Scout Reports</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Tracking Overlays</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Analytics Charts</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Assignment Inference</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Player Development</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-2">Playbook Learning</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center text-muted-foreground">—</td>
                  <td className="text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilmSettingsPage;
