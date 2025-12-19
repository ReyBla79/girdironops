import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TierBannerProps {
  text: string;
  variant?: 'info' | 'upgrade';
}

const TierBanner: React.FC<TierBannerProps> = ({ text, variant = 'info' }) => {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${
      variant === 'info' 
        ? 'bg-primary/10 border border-primary/20' 
        : 'bg-gradient-to-r from-primary/20 to-scarlet/20 border border-primary/30'
    }`}>
      <Info className="w-5 h-5 text-primary flex-shrink-0" />
      <p className="text-sm flex-1">{text}</p>
      {variant === 'upgrade' && (
        <Button size="sm" onClick={() => navigate('/app/upgrade')} className="gap-1">
          <Sparkles className="w-4 h-4" />
          Upgrade
        </Button>
      )}
    </div>
  );
};

export default TierBanner;
