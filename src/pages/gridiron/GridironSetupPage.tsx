import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Settings, DollarSign, Scale, Sliders } from 'lucide-react';

const DEFAULT_WEIGHTS = {
  snaps: 0.25,
  leverage_snaps: 0.20,
  grade: 0.30,
  role: 0.15,
  scarcity: 0.10,
};

const DEFAULT_GUARDRAILS = {
  max_pct_per_player: 0.12,
  min_pct_starter: 0.02,
  position_cap_pct: 0.25,
};

const DEFAULT_POSITION_MULTIPLIERS = {
  QB: 1.4,
  OT: 1.2,
  EDGE: 1.2,
  CB: 1.1,
  WR: 1.0,
  RB: 0.9,
  TE: 0.9,
  OG: 0.95,
  C: 0.9,
  DT: 1.0,
  LB: 0.95,
  S: 0.95,
  K: 0.6,
  P: 0.5,
  LS: 0.4,
};

export default function GridironSetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [programName, setProgramName] = useState('');
  const [seasonLabel, setSeasonLabel] = useState('2025-26');
  const [poolAmount, setPoolAmount] = useState('20000000');

  const handleCreateProgram = async () => {
    if (!programName.trim()) {
      toast.error('Please enter a program name');
      return;
    }

    setLoading(true);
    try {
      // 1. Create program
      const { data: program, error: programError } = await supabase
        .from('programs')
        .insert({ name: programName.trim() })
        .select()
        .single();

      if (programError) throw programError;

      // 2. Create season
      const { data: season, error: seasonError } = await supabase
        .from('seasons')
        .insert({ program_id: program.id, label: seasonLabel })
        .select()
        .single();

      if (seasonError) throw seasonError;

      // 3. Create revshare pool
      const { error: poolError } = await supabase
        .from('fb_revshare_pools')
        .insert({
          program_id: program.id,
          season_id: season.id,
          pool_amount: parseFloat(poolAmount),
        });

      if (poolError) throw poolError;

      // 4. Create default policy
      const { error: policyError } = await supabase
        .from('fb_revshare_policies')
        .insert({
          program_id: program.id,
          season_id: season.id,
          name: 'Default FB Policy',
          weights: DEFAULT_WEIGHTS,
          guardrails: DEFAULT_GUARDRAILS,
          position_multipliers: DEFAULT_POSITION_MULTIPLIERS,
          is_active: true,
        });

      if (policyError) throw policyError;

      toast.success('Program created successfully!');
      navigate('/gridiron/roster/intake');
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gridiron Ops Setup</h1>
          <p className="text-muted-foreground">
            Configure your football program for RevShare calculations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Program Configuration
            </CardTitle>
            <CardDescription>
              Enter your program details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                placeholder="e.g., UNLV Football"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={seasonLabel} onValueChange={setSeasonLabel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                  <SelectItem value="2026-27">2026-27</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pool">Total RevShare Pool ($)</Label>
              <Input
                id="pool"
                type="number"
                placeholder="20000000"
                value={poolAmount}
                onChange={(e) => setPoolAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Formatted: ${Number(poolAmount).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Default Policy Weights
            </CardTitle>
            <CardDescription>
              These defaults will be applied. You can adjust later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(DEFAULT_WEIGHTS).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-muted rounded">
                  <span className="capitalize">{key.replace('_', ' ')}</span>
                  <span className="font-mono">{(value * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Position Multipliers
            </CardTitle>
            <CardDescription>
              Premium positions receive higher allocation weights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {Object.entries(DEFAULT_POSITION_MULTIPLIERS).map(([pos, mult]) => (
                <div key={pos} className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-medium">{pos}</span>
                  <span className="font-mono">{mult.toFixed(2)}x</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={handleCreateProgram}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Program & Continue'}
        </Button>
      </div>
    </div>
  );
}
