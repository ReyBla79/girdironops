import React from 'react';
import type { GeoHeat, PipelinePin } from '@/types/pipeline';

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

// UNLV HQ location (Las Vegas, NV)
const HQ = { x: 190, y: 280 };

type OverlayMode = 'strength' | 'alerts' | 'budget' | 'roi';

interface USMapSVGProps {
  geoHeat: GeoHeat[];
  selectedGeoId: string | null;
  onStateClick: (geoId: string) => void;
  overlayMode?: OverlayMode;
  showRecruitingFlow?: boolean;
  pipelinePins?: PipelinePin[];
}

// Thermal color scale - from cold (blue) to hot (red/white)
const getThermalColor = (value: number, max: number = 100): string => {
  const normalized = Math.max(0, Math.min(1, value / max));
  
  if (normalized < 0.2) {
    const t = normalized / 0.2;
    return `rgb(${Math.round(20 + t * 20)}, ${Math.round(40 + t * 60)}, ${Math.round(100 + t * 55)})`;
  } else if (normalized < 0.4) {
    const t = (normalized - 0.2) / 0.2;
    return `rgb(${Math.round(40 + t * 20)}, ${Math.round(100 + t * 80)}, ${Math.round(155 - t * 55)})`;
  } else if (normalized < 0.6) {
    const t = (normalized - 0.4) / 0.2;
    return `rgb(${Math.round(60 + t * 195)}, ${Math.round(180 + t * 55)}, ${Math.round(100 - t * 80)})`;
  } else if (normalized < 0.8) {
    const t = (normalized - 0.6) / 0.2;
    return `rgb(${Math.round(255)}, ${Math.round(235 - t * 100)}, ${Math.round(20 - t * 20)})`;
  } else {
    const t = (normalized - 0.8) / 0.2;
    return `rgb(${Math.round(255)}, ${Math.round(135 - t * 100)}, ${Math.round(t * 80)})`;
  }
};

const getOverlayValue = (geo: GeoHeat, mode: OverlayMode): number => {
  switch (mode) {
    case 'strength':
      return geo.energyScore;
    case 'alerts':
      return Math.min(100, geo.alertsOpen * 30 + (geo.statusBand === 'COLD' || geo.statusBand === 'DEAD' ? 40 : 0));
    case 'budget':
      return Math.min(100, (geo.budgetExposure / 5000));
    case 'roi':
      return geo.roiScore;
    default:
      return geo.energyScore;
  }
};

// Generate curved arc path between two points
const getArcPath = (from: { x: number; y: number }, to: { x: number; y: number }): string => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Control point offset perpendicular to the line, scaled by distance
  const curvature = Math.min(dist * 0.3, 80);
  const perpX = -dy / dist * curvature;
  const perpY = dx / dist * curvature;
  
  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY - curvature * 0.5; // Bias upward for better visual

  return `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`;
};

const USMapSVG: React.FC<USMapSVGProps> = ({ 
  geoHeat, 
  selectedGeoId, 
  onStateClick,
  overlayMode = 'strength',
  showRecruitingFlow = true,
  pipelinePins = []
}) => {
  const geoMap = new Map(geoHeat.map(g => [g.geoId, g]));

  // Calculate flow arcs from pipelines to HQ
  const flowArcs = pipelinePins
    .filter(pin => pin.playersSignedLast5Years > 0 && pin.geoId !== 'NV')
    .map(pin => {
      const state = US_STATES[pin.geoId];
      if (!state) return null;
      return {
        id: pin.pipelineId,
        from: { x: state.cx, y: state.cy },
        to: HQ,
        thickness: Math.max(1, Math.min(6, pin.playersSignedLast5Years * 0.8)),
        score: pin.pipelineScore,
        signed: pin.playersSignedLast5Years,
      };
    })
    .filter(Boolean);

  return (
    <svg 
      viewBox="0 0 960 600" 
      className="w-full h-full"
      style={{ maxHeight: '500px' }}
    >
      <defs>
        {/* Thermal glow filter */}
        <filter id="thermalGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        
        {/* Hot spot glow */}
        <filter id="hotGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Selection glow */}
        <filter id="selectGlow">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.8"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Arc glow */}
        <filter id="arcGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Radial gradient for thermal effect */}
        <radialGradient id="thermalCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>

        {/* HQ pulse gradient */}
        <radialGradient id="hqPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--scarlet))" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="hsl(var(--scarlet))" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="hsl(var(--scarlet))" stopOpacity="0"/>
        </radialGradient>

        {/* Background gradient */}
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(220, 20%, 8%)" />
          <stop offset="100%" stopColor="hsl(220, 25%, 5%)" />
        </linearGradient>

        {/* Grid pattern for thermal effect */}
        <pattern id="thermalGrid" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
        </pattern>

        {/* Animated arc gradient */}
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--scarlet))" stopOpacity="0.2">
            <animate attributeName="stop-opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" stopColor="hsl(var(--scarlet))" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6">
            <animate attributeName="stop-opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>

        {/* Flow animation marker */}
        <marker id="flowDot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
          <circle cx="5" cy="5" r="3" fill="hsl(var(--primary))"/>
        </marker>
      </defs>
      
      {/* Dark background */}
      <rect width="960" height="600" fill="url(#mapBg)" rx="8" />
      <rect width="960" height="600" fill="url(#thermalGrid)" rx="8" />

      {/* Thermal blur layer (background glow) */}
      <g filter="url(#thermalGlow)" opacity="0.6">
        {geoHeat.map(geo => {
          const state = US_STATES[geo.geoId];
          if (!state) return null;
          const value = getOverlayValue(geo, overlayMode);
          const color = getThermalColor(value);
          return (
            <path
              key={`blur-${geo.geoId}`}
              d={state.path}
              fill={color}
              opacity={0.4 + (value / 100) * 0.4}
            />
          );
        })}
      </g>

      {/* States base layer */}
      {Object.entries(US_STATES).map(([stateId, { path }]) => {
        const geo = geoMap.get(stateId);
        const isSelected = selectedGeoId === stateId;
        const hasData = !!geo;
        
        const value = hasData ? getOverlayValue(geo, overlayMode) : 0;
        const color = hasData ? getThermalColor(value) : 'rgb(30, 35, 45)';
        const isHot = value >= 75;
        
        return (
          <g key={stateId}>
            <path
              d={path}
              fill={color}
              fillOpacity={hasData ? 0.7 + (value / 100) * 0.3 : 0.15}
              stroke={isSelected ? 'hsl(var(--primary))' : hasData ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}
              strokeWidth={isSelected ? 3 : 1}
              className={`transition-all duration-500 ${hasData ? 'cursor-pointer' : ''}`}
              filter={isSelected ? 'url(#selectGlow)' : isHot ? 'url(#hotGlow)' : undefined}
              onClick={() => hasData && onStateClick(stateId)}
              style={{
                animation: isHot && hasData ? 'pulse 2s ease-in-out infinite' : undefined,
              }}
            />
            {/* Hot spot center glow */}
            {hasData && value >= 80 && (
              <ellipse
                cx={US_STATES[stateId].cx}
                cy={US_STATES[stateId].cy}
                rx="15"
                ry="12"
                fill="url(#thermalCenter)"
                className="pointer-events-none animate-pulse"
              />
            )}
          </g>
        );
      })}

      {/* Recruiting Flow Arcs */}
      {showRecruitingFlow && flowArcs.map((arc, index) => {
        if (!arc) return null;
        const path = getArcPath(arc.from, arc.to);
        const animationDelay = index * 0.3;
        
        return (
          <g key={arc.id} filter="url(#arcGlow)">
            {/* Background arc (glow) */}
            <path
              d={path}
              fill="none"
              stroke="hsl(var(--scarlet))"
              strokeWidth={arc.thickness + 4}
              strokeOpacity={0.2}
              strokeLinecap="round"
            />
            {/* Main arc */}
            <path
              d={path}
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth={arc.thickness}
              strokeLinecap="round"
              strokeDasharray="8 4"
              className="animate-pulse"
              style={{
                animationDelay: `${animationDelay}s`,
              }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="24"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            {/* Flow particles */}
            <circle r="3" fill="hsl(var(--primary))">
              <animateMotion
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
                path={path}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2" fill="white" opacity="0.8">
              <animateMotion
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
                path={path}
                begin={`${0.5}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                dur={`${2 + index * 0.2}s`}
                repeatCount="indefinite"
                begin={`${0.5}s`}
              />
            </circle>
          </g>
        );
      })}

      {/* HQ Marker (UNLV - Las Vegas) */}
      {showRecruitingFlow && (
        <g className="pointer-events-none">
          {/* Outer pulse ring */}
          <circle cx={HQ.x} cy={HQ.y} r="25" fill="url(#hqPulse)">
            <animate attributeName="r" values="20;35;20" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
          </circle>
          {/* Inner ring */}
          <circle 
            cx={HQ.x} 
            cy={HQ.y} 
            r="12" 
            fill="hsl(var(--scarlet))" 
            stroke="white" 
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          {/* HQ Label */}
          <text
            x={HQ.x}
            y={HQ.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-xs font-bold"
            style={{ fontSize: '8px' }}
          >
            HQ
          </text>
          <text
            x={HQ.x}
            y={HQ.y + 28}
            textAnchor="middle"
            className="fill-gray-300 font-semibold"
            style={{ fontSize: '9px' }}
          >
            UNLV
          </text>
        </g>
      )}
      
      {/* State labels for states with data */}
      {geoHeat.map(geo => {
        const state = US_STATES[geo.geoId];
        if (!state) return null;
        const value = getOverlayValue(geo, overlayMode);
        const isHot = value >= 70;
        
        return (
          <g key={`label-${geo.geoId}`} className="pointer-events-none">
            {/* Label background for readability */}
            <rect
              x={state.cx - 16}
              y={state.cy - 10}
              width="32"
              height="24"
              rx="4"
              fill="rgba(0,0,0,0.6)"
              className="opacity-80"
            />
            <text
              x={state.cx}
              y={state.cy - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-bold ${isHot ? 'fill-white' : 'fill-gray-200'}`}
              style={{ fontSize: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {geo.geoId}
            </text>
            <text
              x={state.cx}
              y={state.cy + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-semibold ${isHot ? 'fill-yellow-300' : 'fill-gray-400'}`}
              style={{ fontSize: '9px' }}
            >
              {Math.round(value)}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(30, 510)">
        <rect x="0" y="0" width="200" height="60" rx="6" fill="rgba(0,0,0,0.7)" />
        <text x="10" y="16" className="fill-gray-300" style={{ fontSize: '11px', fontWeight: 600 }}>
          {overlayMode === 'strength' ? 'Energy Score' : 
           overlayMode === 'alerts' ? 'Alert Intensity' :
           overlayMode === 'budget' ? 'Budget Exposure' : 'ROI Score'}
        </text>
        {/* Color scale */}
        <defs>
          <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getThermalColor(0)} />
            <stop offset="25%" stopColor={getThermalColor(25)} />
            <stop offset="50%" stopColor={getThermalColor(50)} />
            <stop offset="75%" stopColor={getThermalColor(75)} />
            <stop offset="100%" stopColor={getThermalColor(100)} />
          </linearGradient>
        </defs>
        <rect x="10" y="24" width="140" height="10" rx="2" fill="url(#legendGradient)" />
        <text x="10" y="42" className="fill-gray-400" style={{ fontSize: '9px' }}>Cold</text>
        <text x="150" y="42" className="fill-gray-400" style={{ fontSize: '9px' }} textAnchor="end">Hot</text>
        {showRecruitingFlow && (
          <text x="10" y="54" className="fill-gray-500" style={{ fontSize: '8px' }}>
            ━━ Recruiting Flow (thickness = signed players)
          </text>
        )}
      </g>
    </svg>
  );
};

export default USMapSVG;
