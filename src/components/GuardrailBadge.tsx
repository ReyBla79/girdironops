import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateGuardrailStatus, type GuardrailStatus } from '@/lib/budgetCalculator';
import type { RosterPlayer } from '@/types';

interface GuardrailBadgeProps {
  roster: RosterPlayer[];
  showReasons?: boolean;
  className?: string;
}

const statusConfig: Record<GuardrailStatus, {
  label: string;
  icon: typeof CheckCircle;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}> = {
  within: {
    label: 'Within Guardrails',
    icon: CheckCircle,
    variant: 'default',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
  },
  near: {
    label: 'Near Limit',
    icon: AlertTriangle,
    variant: 'secondary',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
  },
  over: {
    label: 'Over Limit',
    icon: XCircle,
    variant: 'destructive',
    className: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
  }
};

export function GuardrailBadge({ roster, showReasons = false, className }: GuardrailBadgeProps) {
  const { status, reasons } = calculateGuardrailStatus(roster);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Badge 
        variant="outline" 
        className={cn('gap-1.5 px-2.5 py-1', config.className)}
      >
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
      {showReasons && reasons.length > 0 && (
        <ul className="text-xs text-muted-foreground pl-2">
          {reasons.map((reason, i) => (
            <li key={i}>• {reason}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
