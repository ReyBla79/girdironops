import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import type { PipelineTier } from '@/types';

interface FeatureGateCardProps {
  title: string;
  copy: string;
  tier: PipelineTier;
  showCTA?: boolean;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
}

const FeatureGateCard: React.FC<FeatureGateCardProps> = ({ 
  title, 
  copy, 
  tier,
  showCTA = true,
  ctaPrimaryLabel,
  ctaSecondaryLabel
}) => {
  const { tiers, setTier } = useAppStore();
  const currentTier = tiers.tier;

  const handleUpgradeToGM = () => {
    setTier('GM');
    toast.success('Demo switched to GM tier.', {
      description: 'Budget and Forecast overlays are now unlocked.',
    });
  };

  const handleUpgradeToElite = () => {
    setTier('ELITE');
    toast.success('Demo switched to ELITE tier.', {
      description: 'All overlays and advanced features are now unlocked.',
    });
  };

  // Determine which upgrade options to show based on required tier
  const showGMButton = tier === 'GM' && currentTier === 'CORE';
  const showEliteButton = tier === 'ELITE' || (tier === 'GM' && currentTier !== 'ELITE');

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-scarlet/5 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-base">{title}</h4>
              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                {tier}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
            
            {showCTA && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {showGMButton && (
                    <Button 
                      size="sm" 
                      onClick={handleUpgradeToGM}
                      className="gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {ctaPrimaryLabel || 'Upgrade to GM'}
                    </Button>
                  )}
                  {showEliteButton && currentTier !== 'ELITE' && (
                    <Button 
                      size="sm" 
                      variant={showGMButton ? 'outline' : 'default'}
                      onClick={handleUpgradeToElite}
                      className="gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {ctaSecondaryLabel || 'Upgrade to ELITE'}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 italic">
                  Demo-only tier switch. In production this would route to checkout/contract.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureGateCard;
