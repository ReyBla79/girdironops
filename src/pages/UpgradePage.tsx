import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Lock, RotateCcw } from 'lucide-react';
import { FeatureFlags } from '@/types';

const ADDONS: { key: keyof FeatureFlags; name: string; description: string; price: string }[] = [
  { key: 'coach_agent', name: 'CoachGPT', description: 'AI-powered recruiting assistant with natural language queries', price: '$500/mo' },
  { key: 'memory_engine', name: 'Memory Engine', description: 'Long-term context retention for CoachGPT conversations', price: '$200/mo' },
  { key: 'alerts_realtime', name: 'Real-time Alerts', description: 'Instant notifications for portal updates and key events', price: '$150/mo' },
  { key: 'sms_daily', name: 'SMS Daily Digest', description: 'Get your daily briefing via text message', price: '$100/mo' },
  { key: 'coach_network_pro', name: 'Coach Network Pro', description: 'Connect with other programs for intel sharing', price: '$300/mo' },
  { key: 'enterprise_institutional', name: 'Enterprise Package', description: 'Multi-sport support and institutional analytics', price: '$2000/mo' },
  { key: 'film_ai', name: 'Film AI', description: 'AI-powered film analysis and highlight generation', price: '$400/mo' },
  { key: 'nil_engine', name: 'NIL Engine', description: 'NIL valuation data and market intelligence', price: '$350/mo' },
];

const BASE_FLAGS: (keyof FeatureFlags)[] = [
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

  const enabledAddons = ADDONS.filter((a) => flags[a.key]).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Upgrade Center
          </h1>
          <p className="text-muted-foreground">Enable premium features (demo toggles)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetFlags}>
            <RotateCcw className="w-4 h-4" />
            Reset to Base
          </Button>
          <Button variant="destructive" onClick={resetDemo}>
            Reset All Demo Data
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Add-ons</p>
            <p className="text-3xl font-display font-bold">
              {enabledAddons} <span className="text-lg text-muted-foreground font-normal">/ {ADDONS.length}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Base Features</p>
            <p className="text-lg font-semibold text-success">{BASE_FLAGS.length} Included</p>
          </div>
        </div>
      </div>

      {/* Base Features */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-success" />
          Base Features (Always On)
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {BASE_FLAGS.map((flag) => (
            <div key={flag} className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <Check className="w-4 h-4 text-success" />
              <span className="text-sm font-medium capitalize">{flag.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add-on Cards */}
      <div>
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Premium Add-ons
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ADDONS.map((addon) => {
            const isEnabled = flags[addon.key];
            return (
              <div 
                key={addon.key}
                className={`rounded-xl border p-5 transition-all ${
                  isEnabled 
                    ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(25_95%_53%_/_0.15)]' 
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold">{addon.name}</h4>
                      {isEnabled && (
                        <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                    <p className="text-sm font-semibold text-primary mt-2">{addon.price}</p>
                  </div>
                  <button
                    onClick={() => toggleFlag(addon.key)}
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

      {/* Demo Note */}
      <div className="p-4 rounded-xl bg-secondary border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is a demo environment. Toggle add-ons to explore how features unlock throughout the platform. 
          Changes are saved to your browser's local storage.
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
