import React, { useMemo } from "react";
import USPipelineHeatMap3D_ESPN from "./USPipelineHeatMap3D_ESPN";

type Tier = "CORE" | "GM" | "ELITE";

type GeoHeat = {
  geoId: string;
  label: string;
  energyScore: number;
  statusBand: "HOT" | "WARM" | "NEUTRAL" | "COLD" | "DEAD";
  cx: number; // centroid x
  cy: number; // centroid y
  pipelineCount?: number;
  activeRecruits?: number;
  alertsOpen?: number;
  budgetExposure?: number;
  roiScore?: number;
  topPositionGroup?: string;
  forecastVolatility?: { y1: "LOW" | "MED" | "HIGH"; y2: "LOW" | "MED" | "HIGH"; y3: "LOW" | "MED" | "HIGH" };
};

type PipelinePin = {
  pipelineId: string;
  name: string;
  level: string;
  positionGroup: string;
  geoId: string;
  x: number;
  y: number;
  pipelineScore: number;
  status: "STRONG" | "COOLING" | "AT_RISK";
  trend?: "UP" | "DOWN" | "FLAT";
  activeRecruits?: number;
  playersSignedLast5Years?: number;
  alertsOpen?: number;
  budgetModifier?: number;
  roiScore?: number;
  ownerStaffId?: string;
};

type PipelineAlert = {
  alertId: string;
  pipelineId: string;
  geoId: string;
  severity: "LOW" | "MED" | "HIGH";
  title: string;
  message: string;
  recommendedAction?: string;
};

type ESPNTheme = {
  enabled: boolean;
  palette: {
    bg: string;
    glass: string;
    rim: string;
    hot: string;
    warm: string;
    neutral: string;
    cold: string;
    dead: string;
  };
  fx: {
    rimGlow: { blur: number; opacity: number };
    outerGlow: { blur: number; opacity: number };
    innerBevel: { opacity: number };
    dropShadow: { blur: number; opacity: number; dx: number; dy: number };
    scanlines: { opacity: number };
    noise: { opacity: number };
  };
  animation: { pulseHotZones: boolean; pulseSpeedMs: number };
};

type ColumnConfig = {
  maxHeight: number;
  width: number;
  perspective: number;
  showLabels: boolean;
  showValues: boolean;
  glowIntensity: number;
};

type Props = {
  geoHeat: GeoHeat[];
  pipelinePins: PipelinePin[];
  pipelineAlerts: PipelineAlert[];
  tier: Tier;
  mapViewMode?: "STATES" | "PINS";
  overlay: {
    strength: boolean;
    alerts: boolean;
    budget: boolean;
    forecast: boolean;
    ownership: boolean;
    roi: boolean;
  };
  positionFilter?: string;
  search?: string;
  theme: ESPNTheme;
  statePaths?: Record<string, string>;
  onStateClick?: (geoId: string) => void;
  onPinClick?: (pipelineId: string) => void;
  width?: number;
  height?: number;
  columnConfig?: Partial<ColumnConfig>;
  showColumns?: boolean;
};

const DEFAULT_COLUMN_CONFIG: ColumnConfig = {
  maxHeight: 80,
  width: 24,
  perspective: 0.6,
  showLabels: true,
  showValues: true,
  glowIntensity: 1.0,
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
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
    case "DEAD":
    default:
      return p.dead;
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(128,128,128,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

interface ThermalColumnProps {
  cx: number;
  cy: number;
  energyScore: number;
  statusBand: GeoHeat["statusBand"];
  label: string;
  theme: ESPNTheme;
  config: ColumnConfig;
  pulseEnabled: boolean;
  pulseSpeedMs: number;
  onColumnClick?: () => void;
}

const ThermalColumn: React.FC<ThermalColumnProps> = ({
  cx,
  cy,
  energyScore,
  statusBand,
  label,
  theme,
  config,
  pulseEnabled,
  pulseSpeedMs,
  onColumnClick,
}) => {
  const color = bandColor(theme, statusBand);
  const normalizedScore = clamp(energyScore / 100, 0.05, 1);
  const columnHeight = normalizedScore * config.maxHeight;
  const w = config.width;
  const h = columnHeight;
  const p = config.perspective;

  // 3D column face calculations
  const topOffset = h * p;
  const sideWidth = w * p * 0.5;

  // Gradients for 3D effect
  const frontGradientId = `colFront-${label}`;
  const topGradientId = `colTop-${label}`;
  const sideGradientId = `colSide-${label}`;
  const glowId = `colGlow-${label}`;

  const isHot = statusBand === "HOT";

  return (
    <g
      transform={`translate(${cx - w / 2}, ${cy - h})`}
      style={{ cursor: "pointer" }}
      onClick={onColumnClick}
    >
      <defs>
        {/* Front face gradient */}
        <linearGradient id={frontGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="50%" stopColor={color} stopOpacity="0.75" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>

        {/* Top face gradient */}
        <linearGradient id={topGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>

        {/* Side face gradient */}
        <linearGradient id={sideGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={6 * config.glowIntensity} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow ellipse */}
      <ellipse
        cx={w / 2}
        cy={h + 8}
        rx={w * 0.7}
        ry={w * 0.25}
        fill="rgba(0,0,0,0.45)"
      />

      {/* Pulse ring for hot zones */}
      {isHot && pulseEnabled && (
        <ellipse
          cx={w / 2}
          cy={h + 4}
          rx={w * 0.8}
          ry={w * 0.3}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.4"
        >
          <animate
            attributeName="rx"
            values={`${w * 0.6};${w * 1.2};${w * 0.6}`}
            dur={`${pulseSpeedMs}ms`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values={`${w * 0.2};${w * 0.5};${w * 0.2}`}
            dur={`${pulseSpeedMs}ms`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur={`${pulseSpeedMs}ms`}
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      {/* Right side face (3D depth) */}
      <polygon
        points={`
          ${w},${topOffset}
          ${w + sideWidth},${topOffset - sideWidth * 0.6}
          ${w + sideWidth},${h - sideWidth * 0.6}
          ${w},${h}
        `}
        fill={`url(#${sideGradientId})`}
        filter={`url(#${glowId})`}
      />

      {/* Front face */}
      <rect
        x={0}
        y={topOffset}
        width={w}
        height={h - topOffset}
        fill={`url(#${frontGradientId})`}
        filter={`url(#${glowId})`}
      />

      {/* Top face (3D perspective) */}
      <polygon
        points={`
          0,${topOffset}
          ${sideWidth},${topOffset - sideWidth * 0.6}
          ${w + sideWidth},${topOffset - sideWidth * 0.6}
          ${w},${topOffset}
        `}
        fill={`url(#${topGradientId})`}
      />

      {/* Rim highlight */}
      <line
        x1={0}
        y1={topOffset}
        x2={w}
        y2={topOffset}
        stroke={theme.palette.rim}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <line
        x1={0}
        y1={topOffset}
        x2={0}
        y2={h}
        stroke={theme.palette.rim}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Value label on top */}
      {config.showValues && (
        <text
          x={w / 2 + sideWidth / 2}
          y={topOffset - sideWidth * 0.6 - 8}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#ffffff"
          style={{ textShadow: `0 0 6px ${color}`, userSelect: "none" }}
        >
          {Math.round(energyScore)}
        </text>
      )}

      {/* State label below */}
      {config.showLabels && (
        <text
          x={w / 2}
          y={h + 22}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.75)"
          style={{ userSelect: "none" }}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default function USPipelineHeatMap3D_Columns_ESPN(props: Props) {
  const {
    geoHeat,
    pipelinePins,
    pipelineAlerts,
    tier,
    mapViewMode = "STATES",
    overlay,
    positionFilter = "ALL",
    search = "",
    theme,
    statePaths,
    onStateClick,
    onPinClick,
    width = 1100,
    height = 620,
    columnConfig: userColumnConfig,
    showColumns = true,
  } = props;

  const columnConfig: ColumnConfig = {
    ...DEFAULT_COLUMN_CONFIG,
    ...userColumnConfig,
  };

  // Filter geoHeat to only items with cx, cy
  const columnsData = useMemo(() => {
    return geoHeat.filter((g) => typeof g.cx === "number" && typeof g.cy === "number");
  }, [geoHeat]);

  // Sort by cy so columns in front render last (painter's algorithm)
  const sortedColumns = useMemo(() => {
    return [...columnsData].sort((a, b) => a.cy - b.cy);
  }, [columnsData]);

  return (
    <div style={{ position: "relative" }}>
      {/* Base map layer */}
      <USPipelineHeatMap3D_ESPN
        geoHeat={geoHeat}
        pipelinePins={pipelinePins}
        pipelineAlerts={pipelineAlerts}
        tier={tier}
        mapViewMode={mapViewMode}
        overlay={overlay}
        positionFilter={positionFilter}
        search={search}
        theme={theme}
        statePaths={statePaths}
        onStateClick={onStateClick}
        onPinClick={onPinClick}
        width={width}
        height={height}
      />

      {/* Thermal columns overlay */}
      {showColumns && (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="auto"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            pointerEvents: "none",
          }}
        >
          <g style={{ pointerEvents: "auto" }}>
            {sortedColumns.map((geo) => (
              <ThermalColumn
                key={geo.geoId}
                cx={geo.cx}
                cy={geo.cy}
                energyScore={geo.energyScore}
                statusBand={geo.statusBand}
                label={geo.label}
                theme={theme}
                config={columnConfig}
                pulseEnabled={theme.animation.pulseHotZones}
                pulseSpeedMs={theme.animation.pulseSpeedMs}
                onColumnClick={() => onStateClick?.(geo.geoId)}
              />
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
