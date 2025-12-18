import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';

interface LockedCardUpsellProps {
  title: string;
  copy: string;
  ctaLabel?: string;
  ctaTo?: string;
}

const LockedCardUpsell = ({ 
  title, 
  copy, 
  ctaLabel = 'Upgrade', 
  ctaTo = '/app/upgrade' 
}: LockedCardUpsellProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-2 border-muted bg-muted/20">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-md">{copy}</p>
          </div>
          <Button onClick={() => navigate(ctaTo)} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LockedCardUpsell;
