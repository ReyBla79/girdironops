import React from 'react';
import type { StatusBand } from '@/types/pipeline';

// US State paths - simplified for demo
const US_STATES: Record<string, { path: string; cx: number; cy: number }> = {
  AL: { path: "M628,370 L628,420 L658,420 L658,370 Z", cx: 643, cy: 395 },
  AK: { path: "M100,450 L100,490 L180,490 L180,450 Z", cx: 140, cy: 470 },
  AZ: { path: "M185,320 L185,400 L250,400 L250,320 Z", cx: 218, cy: 360 },
  AR: { path: "M540,350 L540,400 L600,400 L600,350 Z", cx: 570, cy: 375 },
  CA: { path: "M100,200 L100,380 L170,380 L170,200 Z", cx: 135, cy: 290 },
  CO: { path: "M280,260 L280,330 L370,330 L370,260 Z", cx: 325, cy: 295 },
  CT: { path: "M820,200 L820,220 L845,220 L845,200 Z", cx: 832, cy: 210 },
  DE: { path: "M790,265 L790,290 L805,290 L805,265 Z", cx: 797, cy: 277 },
  FL: { path: "M680,400 L680,500 L780,500 L780,400 Z", cx: 730, cy: 450 },
  GA: { path: "M670,340 L670,410 L730,410 L730,340 Z", cx: 700, cy: 375 },
  HI: { path: "M200,480 L200,510 L260,510 L260,480 Z", cx: 230, cy: 495 },
  ID: { path: "M190,120 L190,230 L250,230 L250,120 Z", cx: 220, cy: 175 },
  IL: { path: "M580,230 L580,320 L620,320 L620,230 Z", cx: 600, cy: 275 },
  IN: { path: "M620,240 L620,320 L660,320 L660,240 Z", cx: 640, cy: 280 },
  IA: { path: "M500,210 L500,270 L570,270 L570,210 Z", cx: 535, cy: 240 },
  KS: { path: "M380,290 L380,340 L490,340 L490,290 Z", cx: 435, cy: 315 },
  KY: { path: "M620,300 L620,340 L710,340 L710,300 Z", cx: 665, cy: 320 },
  LA: { path: "M530,400 L530,460 L600,460 L600,400 Z", cx: 565, cy: 430 },
  ME: { path: "M850,100 L850,170 L890,170 L890,100 Z", cx: 870, cy: 135 },
  MD: { path: "M750,260 L750,290 L800,290 L800,260 Z", cx: 775, cy: 275 },
  MA: { path: "M830,180 L830,200 L875,200 L875,180 Z", cx: 852, cy: 190 },
  MI: { path: "M590,140 L590,220 L670,220 L670,140 Z", cx: 630, cy: 180 },
  MN: { path: "M480,120 L480,200 L550,200 L550,120 Z", cx: 515, cy: 160 },
  MS: { path: "M580,360 L580,440 L620,440 L620,360 Z", cx: 600, cy: 400 },
  MO: { path: "M510,280 L510,360 L580,360 L580,280 Z", cx: 545, cy: 320 },
  MT: { path: "M220,100 L220,170 L350,170 L350,100 Z", cx: 285, cy: 135 },
  NE: { path: "M360,230 L360,280 L470,280 L470,230 Z", cx: 415, cy: 255 },
  NV: { path: "M160,180 L160,320 L220,320 L220,180 Z", cx: 190, cy: 250 },
  NH: { path: "M850,140 L850,180 L870,180 L870,140 Z", cx: 860, cy: 160 },
  NJ: { path: "M800,220 L800,270 L820,270 L820,220 Z", cx: 810, cy: 245 },
  NM: { path: "M260,330 L260,420 L350,420 L350,330 Z", cx: 305, cy: 375 },
  NY: { path: "M750,160 L750,230 L830,230 L830,160 Z", cx: 790, cy: 195 },
  NC: { path: "M680,310 L680,350 L790,350 L790,310 Z", cx: 735, cy: 330 },
  ND: { path: "M380,120 L380,170 L470,170 L470,120 Z", cx: 425, cy: 145 },
  OH: { path: "M660,240 L660,310 L720,310 L720,240 Z", cx: 690, cy: 275 },
  OK: { path: "M380,340 L380,390 L510,390 L510,340 Z", cx: 445, cy: 365 },
  OR: { path: "M100,120 L100,200 L190,200 L190,120 Z", cx: 145, cy: 160 },
  PA: { path: "M720,210 L720,260 L800,260 L800,210 Z", cx: 760, cy: 235 },
  RI: { path: "M845,195 L845,210 L860,210 L860,195 Z", cx: 852, cy: 202 },
  SC: { path: "M700,340 L700,380 L760,380 L760,340 Z", cx: 730, cy: 360 },
  SD: { path: "M380,170 L380,220 L470,220 L470,170 Z", cx: 425, cy: 195 },
  TN: { path: "M580,320 L580,360 L700,360 L700,320 Z", cx: 640, cy: 340 },
  TX: { path: "M350,360 L350,500 L540,500 L540,360 Z", cx: 445, cy: 430 },
  UT: { path: "M220,200 L220,300 L280,300 L280,200 Z", cx: 250, cy: 250 },
  VT: { path: "M830,130 L830,165 L850,165 L850,130 Z", cx: 840, cy: 147 },
  VA: { path: "M700,270 L700,320 L790,320 L790,270 Z", cx: 745, cy: 295 },
  WA: { path: "M120,80 L120,140 L200,140 L200,80 Z", cx: 160, cy: 110 },
  WV: { path: "M700,260 L700,300 L750,300 L750,260 Z", cx: 725, cy: 280 },
  WI: { path: "M550,150 L550,220 L610,220 L610,150 Z", cx: 580, cy: 185 },
  WY: { path: "M260,170 L260,240 L350,240 L350,170 Z", cx: 305, cy: 205 },
};

interface USMapSVGProps {
  geoHeat: { geoId: string; statusBand: StatusBand; energyScore: number }[];
  selectedGeoId: string | null;
  onStateClick: (geoId: string) => void;
}

const getHeatColor = (statusBand: StatusBand): string => {
  switch (statusBand) {
    case 'HOT': return 'hsl(var(--scarlet))';
    case 'WARM': return 'hsl(var(--scarlet-dark))';
    case 'NEUTRAL': return 'hsl(var(--unlv-gray))';
    case 'COLD': return 'hsl(var(--unlv-gray-dark))';
    case 'DEAD': return 'hsl(var(--muted))';
    default: return 'hsl(var(--muted))';
  }
};

const getHeatOpacity = (energyScore: number): number => {
  return Math.max(0.3, Math.min(1, energyScore / 100));
};

const USMapSVG: React.FC<USMapSVGProps> = ({ geoHeat, selectedGeoId, onStateClick }) => {
  const geoMap = new Map(geoHeat.map(g => [g.geoId, g]));

  return (
    <svg 
      viewBox="0 0 960 600" 
      className="w-full h-full"
      style={{ maxHeight: '500px' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--background))" />
          <stop offset="100%" stopColor="hsl(var(--card))" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="960" height="600" fill="url(#mapBg)" rx="8" />
      
      {/* States */}
      {Object.entries(US_STATES).map(([stateId, { path }]) => {
        const geo = geoMap.get(stateId);
        const isSelected = selectedGeoId === stateId;
        const hasData = !!geo;
        
        return (
          <path
            key={stateId}
            d={path}
            fill={hasData ? getHeatColor(geo.statusBand) : 'hsl(var(--muted))'}
            fillOpacity={hasData ? getHeatOpacity(geo.energyScore) : 0.2}
            stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
            strokeWidth={isSelected ? 3 : 1}
            className={`transition-all duration-300 ${hasData ? 'cursor-pointer hover:brightness-110' : ''}`}
            filter={isSelected ? 'url(#glow)' : undefined}
            onClick={() => hasData && onStateClick(stateId)}
          />
        );
      })}
      
      {/* State labels for states with data */}
      {geoHeat.map(geo => {
        const state = US_STATES[geo.geoId];
        if (!state) return null;
        return (
          <g key={`label-${geo.geoId}`}>
            <text
              x={state.cx}
              y={state.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-xs font-bold pointer-events-none"
              style={{ fontSize: '11px' }}
            >
              {geo.geoId}
            </text>
            <text
              x={state.cx}
              y={state.cy + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs pointer-events-none"
              style={{ fontSize: '9px' }}
            >
              {geo.energyScore}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default USMapSVG;
