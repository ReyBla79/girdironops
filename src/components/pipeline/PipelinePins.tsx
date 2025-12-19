import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { PipelinePin } from '@/types/pipeline';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PipelinePinsProps {
  pins: PipelinePin[];
  onPinClick: (pipelineId: string) => void;
}

const getPinSize = (activeRecruits: number): number => {
  return Math.max(6, Math.min(14, 6 + activeRecruits));
};

const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'STRONG': return 'border-green-500';
    case 'COOLING': return 'border-yellow-500';
    case 'EMERGING': return 'border-blue-500';
    case 'DORMANT': return 'border-muted-foreground';
    default: return 'border-muted-foreground';
  }
};

const TrendIcon: React.FC<{ trend: string; className?: string }> = ({ trend, className }) => {
  if (trend === 'UP') return <TrendingUp className={`${className} text-green-500`} />;
  if (trend === 'DOWN') return <TrendingDown className={`${className} text-destructive`} />;
  return <Minus className={`${className} text-muted-foreground`} />;
};

const PipelinePins: React.FC<PipelinePinsProps> = ({ pins, onPinClick }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {pins.map(pin => {
        const size = getPinSize(pin.activeRecruits);
        // Convert SVG coords to percentages (viewBox is 960x600)
        const left = (pin.x / 960) * 100;
        const top = (pin.y / 600) * 100;

        return (
          <Tooltip key={pin.pipelineId}>
            <TooltipTrigger asChild>
              <button
                className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 
                  rounded-full bg-primary border-2 ${getStatusBorderColor(pin.status)}
                  shadow-lg hover:scale-125 transition-transform cursor-pointer z-10`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size * 2}px`,
                  height: `${size * 2}px`,
                }}
                onClick={() => onPinClick(pin.pipelineId)}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{pin.name}</span>
                  <TrendIcon trend={pin.trend} className="w-3 h-3" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>{pin.positionGroup} | Score: {pin.pipelineScore}</p>
                  <p>{pin.activeRecruits} active recruits | {pin.playersSignedLast5Years} signed (5yr)</p>
                  {pin.alertsOpen > 0 && (
                    <p className="text-destructive">⚠ {pin.alertsOpen} alert{pin.alertsOpen > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default PipelinePins;
