import React, { useMemo } from "react";
import USPipelineHeatMap3D_ESPN from "./USPipelineHeatMap3D_ESPN";

type Tier = "CORE" | "GM" | "ELITE";

type GeoHeat = {
  geoId: string;
  label: string;
  energyScore: number;
  statusBand: "HOT" | "WARM" | "NEUTRAL" | "COLD" | "DEAD";
  cx?: number;
  cy?: number;
  budgetExposure?: number;
  roiScore?: number;
  forecastVolatility?: { y1: "LOW" | "MED" | "HIGH"; y2: "LOW" | "MED" | "HIGH"; y3: "LOW" | "MED" | "HIGH" };
};

type PipelinePin = any;
type PipelineAlert = any;
type ESPNTheme = any;

type Props = {
  geoHeat: GeoHeat[];
  pipelinePins: PipelinePin[];
  pipelineAlerts: PipelineAlert[];
  tier: Tier;
  mapViewMode?: "STATES" | "PINS";
  overlay: { strength: boolean; alerts: boolean; budget: boolean; forecast: boolean; ownership: boolean; roi: boolean };
  positionFilter?: string;
  search?: string;
  theme: ESPNTheme;
  statePaths?: Record<string, string>;
  onStateClick?: (geoId: string) => void;
  onPinClick?: (pipelineId: string) => void;
  width?: number;
  height?: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function USPipelineHeatMap3D_Columns_ESPN(props: Props) {
  const { geoHeat, theme, overlay, mapViewMode = "STATES" } = props;

  const columns = useMemo(() => {
    const enabled = overlay.strength && mapViewMode === "STATES";
    if (!enabled) return [];
    return geoHeat
      .filter((g) => typeof g.cx === "number" && typeof g.cy === "number")
      .map((g) => {
        const heightPx = 10 + g.energyScore * 1.25;
        const w = 16;
        const h = clamp(heightPx, 10, 150);
        return {
          geoId: g.geoId,
          x: g.cx as number,
          y: g.cy as number,
          w,
          h,
          color: bandColor(theme, g.statusBand)
        };
      });
  }, [geoHeat, overlay.strength, mapViewMode, theme]);

  return (
    <div style={{ position: "relative" }}>
      {/* Base 3D map + pins */}
      <USPipelineHeatMap3D_ESPN {...props} />

      {/* Overlay SVG columns on top (absolute) */}
      <div style={{ position: "absolute", inset: 16, pointerEvents: "none" }}>
        <svg viewBox={`0 0 ${props.width ?? 1100} ${props.height ?? 620}`} width="100%" height="100%">
          <defs>
            <filter id="colGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="colGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="40%" stopColor={theme.palette.rim} stopOpacity="0.18" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
            </linearGradient>
          </defs>
          {columns.map((c) => (
            <g key={`col-${c.geoId}`} filter="url(#colGlow)">
              {/* shadow */}
              <ellipse cx={c.x} cy={c.y + 10} rx={c.w * 1.2} ry={c.w * 0.45} fill="rgba(0,0,0,0.35)" />
              {/* column */}
              <rect
                x={c.x - c.w / 2}
                y={c.y - c.h}
                width={c.w}
                height={c.h}
                rx={6}
                fill={c.color}
                opacity={0.85}
              />
              {/* glossy overlay */}
              <rect
                x={c.x - c.w / 2}
                y={c.y - c.h}
                width={c.w}
                height={c.h}
                rx={6}
                fill="url(#colGrad)"
                opacity={0.8}
              />
              {/* cap */}
              <ellipse cx={c.x} cy={c.y - c.h} rx={c.w / 2} ry={6} fill="rgba(255,255,255,0.25)" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function bandColor(theme: ESPNTheme, band: GeoHeat["statusBand"]) {
  const p = theme.palette;
  switch (band) {
    case "HOT":
      return p.hot;
    case "WARM":
      return p.warm;
    case "NEUTRAL":
      return p.neutral;
    case "COLD":
      return p.cold;
    default:
      return p.dead;
  }
}
