import React, { useMemo, useState } from "react";

type Tier = "CORE" | "GM" | "ELITE";

type GeoHeat = {
  geoId: string;
  label: string;
  energyScore: number;
  statusBand: "HOT" | "WARM" | "NEUTRAL" | "COLD" | "DEAD";
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
};

const FALLBACK_STATE_PATHS: Record<string, string> = {
  TX: "M260,220 L360,220 L380,280 L300,320 L240,280 Z",
  FL: "M420,320 L500,320 L520,340 L540,360 L520,380 L460,380 Z",
  CA: "M80,220 L140,220 L160,280 L120,320 L60,280 Z",
  GA: "M420,260 L470,260 L490,300 L450,330 L410,300 Z",
  OH: "M360,180 L410,180 L430,210 L400,240 L360,220 Z"
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function tierIndex(t: Tier) {
  return t === "CORE" ? 0 : t === "GM" ? 1 : 2;
}

function requires(tier: Tier, requiresTier: Tier) {
  return tierIndex(tier) >= tierIndex(requiresTier);
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

function statusStroke(theme: ESPNTheme, status: PipelinePin["status"]) {
  if (status === "STRONG") return theme.palette.rim;
  if (status === "COOLING") return theme.palette.warm;
  return theme.palette.hot;
}

export default function USPipelineHeatMap3D_ESPN(props: Props) {
  const {
    geoHeat,
    pipelinePins,
    pipelineAlerts,
    tier,
    overlay,
    mapViewMode = "STATES",
    positionFilter = "ALL",
    search = "",
    theme,
    statePaths = FALLBACK_STATE_PATHS,
    onStateClick,
    onPinClick,
    width = 1100,
    height = 620
  } = props;

  const [hoverState, setHoverState] = useState<string | null>(null);

  const heatById = useMemo(() => {
    const m = new Map<string, GeoHeat>();
    geoHeat.forEach((g) => m.set(g.geoId, g));
    return m;
  }, [geoHeat]);

  const alertsByGeo = useMemo(() => {
    const m = new Map<string, number>();
    pipelineAlerts.forEach((a) => m.set(a.geoId, (m.get(a.geoId) || 0) + 1));
    return m;
  }, [pipelineAlerts]);

  const filteredPins = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pipelinePins.filter((p) => {
      const positionOk = positionFilter === "ALL" ? true : p.positionGroup === positionFilter;
      const searchOk = !q ? true : p.name.toLowerCase().includes(q) || p.pipelineId.toLowerCase().includes(q);
      return positionOk && searchOk;
    });
  }, [pipelinePins, positionFilter, search]);

  const budgetUnlocked = requires(tier, "GM") && overlay.budget;
  const forecastUnlocked = requires(tier, "GM") && overlay.forecast;
  const roiUnlocked = requires(tier, "ELITE") && overlay.roi;

  const getStateFill = (geoId: string) => {
    const g = heatById.get(geoId);
    if (!g) return theme.palette.glass;
    if (roiUnlocked) return bandColor(theme, scoreToBand(g.roiScore ?? 0));
    if (budgetUnlocked) return bandColor(theme, scoreToBand(scoreFromBudget(g.budgetExposure ?? 0)));
    if (forecastUnlocked) return bandColor(theme, volatilityToBand(g.forecastVolatility));
    if (overlay.alerts) return bandColor(theme, alertsToBand(alertsByGeo.get(geoId) || 0));
    return bandColor(theme, g.statusBand);
  };

  const getStateGlowStrength = (geoId: string) => {
    const g = heatById.get(geoId);
    const s = g?.energyScore ?? 0;
    return clamp(s / 100, 0, 1);
  };

  return (
    <div
      style={{
        background: `radial-gradient(1200px 600px at 50% 20%, rgba(57,182,255,0.18), rgba(5,6,10,1) 60%)`,
        borderRadius: 18,
        padding: 16,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={scanlines(theme)} />
      <div style={noise(theme)} />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        style={{ display: "block" }}
      >
        <defs>
          <filter id="espnDrop" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx={theme.fx.dropShadow.dx}
              dy={theme.fx.dropShadow.dy}
              stdDeviation={theme.fx.dropShadow.blur / 2}
              floodColor={`rgba(0,0,0,${theme.fx.dropShadow.opacity})`}
            />
          </filter>
          <filter id="espnGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={theme.fx.outerGlow.blur / 3} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.9 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="espnBevel" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="shadow" />
            <feOffset dx="-2" dy="-2" result="offsetShadow" />
            <feComposite in="offsetShadow" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="inner" />
            <feColorMatrix
              in="inner"
              type="matrix"
              values={`
                1 0 0 0 0.2
                0 1 0 0 0.6
                0 0 1 0 1
                0 0 0 ${theme.fx.innerBevel.opacity} 0`}
              result="innerColor"
            />
            <feMerge>
              <feMergeNode in="innerColor" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rimGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={theme.fx.rimGlow.blur / 4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="pulseGrad">
            <stop offset="0%" stopColor={theme.palette.rim} stopOpacity="0.0" />
            <stop offset="50%" stopColor={theme.palette.rim} stopOpacity="0.25" />
            <stop offset="100%" stopColor={theme.palette.rim} stopOpacity="0.0" />
          </radialGradient>
          <radialGradient id="pinGlass" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="35%" stopColor={theme.palette.rim} stopOpacity="0.20" />
            <stop offset="100%" stopColor={theme.palette.glass} stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* DEPTH LAYER */}
        <g filter="url(#espnDrop)" opacity={0.95} transform="translate(0,10)">
          {Object.entries(statePaths).map(([geoId, d]) => (
            <path key={`depth-${geoId}`} d={d} fill="#05060a" opacity="0.95" />
          ))}
        </g>

        {/* SURFACE LAYER */}
        <g>
          {Object.entries(statePaths).map(([geoId, d]) => {
            const fill = getStateFill(geoId);
            const glowStrength = getStateGlowStrength(geoId);
            const isHot = (heatById.get(geoId)?.statusBand ?? "DEAD") === "HOT";
            return (
              <g key={`surface-${geoId}`}>
                <path
                  d={d}
                  fill={fill}
                  opacity={0.92}
                  filter="url(#espnBevel)"
                  onMouseEnter={() => setHoverState(geoId)}
                  onMouseLeave={() => setHoverState(null)}
                  onClick={() => onStateClick?.(geoId)}
                  style={{ cursor: "pointer" }}
                />
                <path
                  d={d}
                  fill="none"
                  stroke={theme.palette.rim}
                  strokeOpacity={0.18 + 0.25 * glowStrength}
                  strokeWidth={1.4}
                  filter="url(#rimGlow)"
                  pointerEvents="none"
                />
                {isHot && theme.animation.pulseHotZones && (
                  <path
                    d={d}
                    fill="none"
                    stroke={theme.palette.hot}
                    strokeOpacity={0.22 + 0.18 * glowStrength}
                    strokeWidth={2.2}
                    filter="url(#espnGlow)"
                    pointerEvents="none"
                  />
                )}
                {hoverState === geoId && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity={0.25}
                    strokeWidth={2.2}
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* PINS LAYER */}
        {mapViewMode === "PINS" && (
          <g>
            {filteredPins.map((p) => {
              const g = heatById.get(p.geoId);
              const isHotZone = (g?.statusBand ?? "DEAD") === "HOT";
              const r = clamp((p.activeRecruits ?? 2) * 2.2, 6, 14);
              const stroke = statusStroke(theme, p.status);
              return (
                <g
                  key={p.pipelineId}
                  transform={`translate(${p.x},${p.y})`}
                  onClick={() => onPinClick?.(p.pipelineId)}
                  style={{ cursor: "pointer" }}
                >
                  <ellipse cx="0" cy={r + 6} rx={r * 1.2} ry={r * 0.55} fill="rgba(0,0,0,0.40)" />
                  {isHotZone && theme.animation.pulseHotZones && (
                    <circle r={r * 2.6} fill="url(#pulseGrad)">
                      <animate
                        attributeName="r"
                        values={`${r * 1.6};${r * 3.0};${r * 1.6}`}
                        dur={`${theme.animation.pulseSpeedMs}ms`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.15;0.35;0.15"
                        dur={`${theme.animation.pulseSpeedMs}ms`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <circle r={r} fill="url(#pinGlass)" filter="url(#pinGlow)" />
                  <circle r={r} fill="none" stroke={stroke} strokeWidth="2" opacity="0.95" />
                  {overlay.alerts && (p.alertsOpen ?? 0) > 0 && (
                    <circle cx={r - 2} cy={-r + 2} r={4} fill={theme.palette.hot} opacity="0.95" />
                  )}
                  <text
                    x={0}
                    y={r + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="rgba(255,255,255,0.85)"
                    style={{ userSelect: "none" }}
                  >
                    {p.positionGroup}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Legend */}
      <div style={legend(theme)}>
        <LegendRow label="HOT" color={theme.palette.hot} />
        <LegendRow label="WARM" color={theme.palette.warm} />
        <LegendRow label="NEUTRAL" color={theme.palette.neutral} />
        <LegendRow label="COLD" color={theme.palette.cold} />
        <LegendRow label="DEAD" color={theme.palette.dead} />
      </div>
    </div>
  );
}

function scoreToBand(score: number): GeoHeat["statusBand"] {
  const s = clamp(score ?? 0, 0, 100);
  if (s >= 85) return "HOT";
  if (s >= 65) return "WARM";
  if (s >= 45) return "NEUTRAL";
  if (s >= 25) return "COLD";
  return "DEAD";
}

function scoreFromBudget(budgetExposure: number) {
  const s = clamp((budgetExposure / 500000) * 100, 0, 100);
  return s;
}

function volatilityToBand(v?: GeoHeat["forecastVolatility"]): GeoHeat["statusBand"] {
  const v3 = v?.y3 ?? "LOW";
  if (v3 === "HIGH") return "HOT";
  if (v3 === "MED") return "WARM";
  return "NEUTRAL";
}

function alertsToBand(alertCount: number): GeoHeat["statusBand"] {
  if (alertCount >= 3) return "HOT";
  if (alertCount === 2) return "WARM";
  if (alertCount === 1) return "NEUTRAL";
  return "COLD";
}

function scanlines(theme: ESPNTheme): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: theme.fx.scanlines.opacity,
    backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)"
  };
}

function noise(theme: ESPNTheme): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: theme.fx.noise.opacity,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
    mixBlendMode: "overlay"
  };
}

function legend(theme: ESPNTheme): React.CSSProperties {
  return {
    position: "absolute",
    left: 16,
    bottom: 16,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(8,12,18,0.62)",
    border: "1px solid rgba(57,182,255,0.25)",
    backdropFilter: "blur(8px)"
  };
}

function LegendRow({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "6px 0" }}>
      <span style={{ width: 10, height: 10, borderRadius: 99, background: color, boxShadow: `0 0 12px ${color}` }} />
      <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{label}</span>
    </div>
  );
}
