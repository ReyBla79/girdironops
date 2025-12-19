import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import type { PipelineTier } from '@/types/pipeline';

interface DemoTierSwitcherProps {
  label?: string;
  note?: string;
}

const DemoTierSwitcher: React.FC<DemoTierSwitcherProps> = ({
  label = 'Demo Tier Switcher',
  note = 'Flip tiers live during the meeting to show locked vs unlocked modules.',
}) => {
  const { tiers, setTier } = useAppStore();

  const handleTierChange = (value: PipelineTier) => {
    setTier(value);
    const messages: Record<PipelineTier, string> = {
      CORE: 'Demo: CORE tier active.',
      GM: 'Demo: GM tier active.',
      ELITE: 'Demo: ELITE tier active.',
    };
    toast(messages[value]);
  };

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between">
      <div>
        <span className="font-semibold text-sm">{label}</span>
        <p className="text-xs text-muted-foreground">{note}</p>
      </div>
      <Select value={tiers.tier} onValueChange={handleTierChange}>
        <SelectTrigger className="w-[280px] bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value="CORE">CORE (Strength + Alerts)</SelectItem>
          <SelectItem value="GM">GM (Budget + Forecast)</SelectItem>
          <SelectItem value="ELITE">ELITE (Ownership + ROI + Advanced Ops GM)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DemoTierSwitcher;
