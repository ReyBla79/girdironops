import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Lock, RotateCcw, Info } from 'lucide-react';
import { FeatureFlags } from '@/types';

const TOGGLES: { key: keyof FeatureFlags; name: string; description: string }[] = [
  { key: 'coach_agent', name: 'CoachGPT', description: 'AI assistant with natural language queries' },
  { key: 'memory_engine', name: 'Memory Engine', description: 'Long-term context for conversations' },
  { key: 'alerts_realtime', name: 'Real-time Alerts', description: 'Instant portal update notifications' },
  { key: 'sms_daily', name: 'SMS Daily Digest', description: 'Morning briefing via text' },
  { key: 'coach_network_pro', name: 'Coach Network Pro', description: 'Inter-program intel sharing' },
  { key: 'enterprise_institutional', name: 'Enterprise / Institutional', description: 'Multi-sport & institutional analytics' },
  { key: 'film_ai', name: 'Film AI', description: 'AI-powered film tagging & highlights' },
  { key: 'revshare_engine', name: 'RevShare Engine', description: 'RevShare valuation & market data' },
];

const BASE_FLAGS: (keyof FeatureFlags)[] = [
  'base_platform',
  'daily_brief',
  'portal_live',
  'players_module',
  'player_profile',
  'tasks_module',
  'program_dna',
  'audit_logging',
  'compliance_guardrails',
];

const UpgradePage = () => {
  const { flags, toggleFlag, resetFlags, resetDemo } = useAppStore();

  const enabledAddons = TOGGLES.filter((t) => flags[t.key]).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Upgrade Center
        </h1>
        <p className="text-muted-foreground">Toggle add-ons for demo (no billing).</p>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-secondary border border-border flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm">
            <strong>Demo-only toggles.</strong> In the real product, these features will be set by your subscription tier.
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Add-ons</p>
            <p className="text-3xl font-display font-bold">
              {enabledAddons} <span className="text-lg text-muted-foreground font-normal">/ {TOGGLES.length}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Base Features</p>
            <p className="text-lg font-semibold text-success flex items-center gap-1 justify-end">
              <Check className="w-4 h-4" /> {BASE_FLAGS.length} Included
            </p>
          </div>
        </div>
      </div>

      {/* Add-on Toggles */}
      <div>
        <h3 className="font-display font-semibold mb-4">Feature Add-ons</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {TOGGLES.map((toggle) => {
            const isEnabled = flags[toggle.key];
            return (
              <div 
                key={toggle.key}
                className={`rounded-xl border p-5 transition-all ${
                  isEnabled 
                    ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(25_95%_53%_/_0.15)]' 
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold">{toggle.name}</h4>
                      {isEnabled && (
                        <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">
                          ON
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{toggle.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFlag(toggle.key)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform ${
                      isEnabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" onClick={resetFlags}>
          <RotateCcw className="w-4 h-4" />
          Reset Flags to Base
        </Button>
        <Button variant="destructive" onClick={resetDemo}>
          Reset Demo Data
        </Button>
      </div>
    </div>
  );
};

export default UpgradePage;
