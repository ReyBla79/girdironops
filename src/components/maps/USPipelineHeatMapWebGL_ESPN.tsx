import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

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

type PipelinePin = {
  pipelineId: string;
  name: string;
  positionGroup: string;
  geoId: string;
  x: number;
  y: number;
  pipelineScore: number;
  status: "STRONG" | "COOLING" | "AT_RISK";
  activeRecruits?: number;
  alertsOpen?: number;
};

type PipelineAlert = {
  alertId: string;
  pipelineId: string;
  geoId: string;
  severity: "LOW" | "MED" | "HIGH";
  title: string;
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
  overlay: { strength: boolean; alerts: boolean; budget: boolean; forecast: boolean; ownership: boolean; roi: boolean };
  theme: ESPNTheme;
  onStateClick?: (geoId: string) => void;
  onPinClick?: (pipelineId: string) => void;
  width?: number;
  height?: number;
};

// Convert hex to THREE.Color
function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

function bandColor(theme: ESPNTheme, band: GeoHeat["statusBand"]): string {
  const p = theme.palette;
  switch (band) {
    case "HOT": return p.hot;
    case "WARM": return p.warm;
    case "NEUTRAL": return p.neutral;
    case "COLD": return p.cold;
    default: return p.dead;
  }
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

// SVG coords to 3D world coords (center at origin, scale down)
function svgTo3D(cx: number, cy: number, svgW = 1100, svgH = 620): [number, number] {
  const x = ((cx - svgW / 2) / svgW) * 20;
  const z = ((cy - svgH / 2) / svgH) * 12;
  return [x, z];
}

// --- State Column Component ---
interface StateColumnProps {
  geoId: string;
  label: string;
  position: [number, number, number];
  height: number;
  color: string;
  isHot: boolean;
  pulseEnabled: boolean;
  pulseSpeed: number;
  rimColor: string;
  onClick?: () => void;
}

const StateColumn: React.FC<StateColumnProps> = ({
  geoId,
  label,
  position,
  height,
  color,
  isHot,
  pulseEnabled,
  pulseSpeed,
  rimColor,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const threeColor = useMemo(() => hexToThreeColor(color), [color]);
  const rimThreeColor = useMemo(() => hexToThreeColor(rimColor), [rimColor]);

  useFrame((state) => {
    if (meshRef.current && isHot && pulseEnabled) {
      const pulse = Math.sin(state.clock.elapsedTime * (2000 / pulseSpeed)) * 0.1 + 1;
      meshRef.current.scale.x = pulse;
      meshRef.current.scale.z = pulse;
    }
    if (glowRef.current && isHot) {
      glowRef.current.rotation.y += 0.01;
    }
  });

  const columnHeight = clamp(height, 0.2, 4);

  return (
    <group position={position}>
      {/* Shadow ellipse on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Glow ring for hot zones */}
      {isHot && pulseEnabled && (
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.5, 0.8, 32]} />
          <meshBasicMaterial color={threeColor} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Main column */}
      <mesh
        ref={meshRef}
        position={[0, columnHeight / 2, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedBox args={[0.6, columnHeight, 0.6]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={threeColor}
            emissive={threeColor}
            emissiveIntensity={hovered ? 0.6 : 0.25}
            metalness={0.5}
            roughness={0.3}
          />
        </RoundedBox>
      </mesh>

      {/* Top cap - glossy */}
      <mesh position={[0, columnHeight + 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={rimThreeColor}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Rim highlight ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, columnHeight + 0.11, 0]}>
        <ringGeometry args={[0.28, 0.35, 32]} />
        <meshBasicMaterial color={rimThreeColor} transparent opacity={0.6} />
      </mesh>

      {/* State label */}
      <Text
        position={[0, columnHeight + 0.4, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Score value */}
      <Text
        position={[0, columnHeight + 0.65, 0]}
        fontSize={0.18}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(height * 25)}
      </Text>
    </group>
  );
};

// --- Pipeline Pin Component (3D sphere) ---
interface PipelinePinProps {
  pin: PipelinePin;
  position: [number, number, number];
  color: string;
  onClick?: () => void;
}

const PipelinePin3D: React.FC<PipelinePinProps> = ({ pin, position, color, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const threeColor = useMemo(() => hexToThreeColor(color), [color]);
  const radius = clamp((pin.activeRecruits ?? 2) * 0.08, 0.15, 0.5);

  return (
    <group position={position}>
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[radius * 1.2, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Pin sphere */}
      <mesh
        position={[0, radius + 0.1, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Alert indicator */}
      {(pin.alertsOpen ?? 0) > 0 && (
        <mesh position={[radius * 0.7, radius * 2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ff3333" />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, radius * 2 + 0.3, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {pin.positionGroup}
      </Text>
    </group>
  );
};

// --- Ground Plane ---
const GroundPlane: React.FC<{ theme: ESPNTheme }> = ({ theme }) => {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 16]} />
        <meshStandardMaterial
          color="#0a0a12"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Grid */}
      <gridHelper args={[25, 25, "#1a1a2e", "#1a1a2e"]} position={[0, 0.01, 0]} />

      {/* Outer glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[11, 12, 64]} />
        <meshBasicMaterial color={theme.palette.rim} transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

// --- Legend Component ---
const Legend3D: React.FC<{ theme: ESPNTheme; position: [number, number, number] }> = ({ theme, position }) => {
  const levels = [
    { label: "HOT", color: theme.palette.hot },
    { label: "WARM", color: theme.palette.warm },
    { label: "NEUTRAL", color: theme.palette.neutral },
    { label: "COLD", color: theme.palette.cold },
    { label: "DEAD", color: theme.palette.dead },
  ];

  return (
    <group position={position}>
      <Text position={[0, 1.5, 0]} fontSize={0.2} color="#ffffff" anchorX="center">
        PIPELINE STRENGTH
      </Text>
      {levels.map((level, i) => (
        <group key={level.label} position={[0, 1.1 - i * 0.35, 0]}>
          <mesh position={[-0.6, 0, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.05]} />
            <meshBasicMaterial color={level.color} />
          </mesh>
          <Text position={[-0.3, 0, 0]} fontSize={0.12} color="#ffffff" anchorX="left">
            {level.label}
          </Text>
        </group>
      ))}
    </group>
  );
};

// --- Main Scene ---
interface SceneProps {
  geoHeat: GeoHeat[];
  pipelinePins: PipelinePin[];
  theme: ESPNTheme;
  mapViewMode: "STATES" | "PINS";
  overlay: Props["overlay"];
  onStateClick?: (geoId: string) => void;
  onPinClick?: (pipelineId: string) => void;
}

const Scene: React.FC<SceneProps> = ({
  geoHeat,
  pipelinePins,
  theme,
  mapViewMode,
  overlay,
  onStateClick,
  onPinClick,
}) => {
  const columns = useMemo(() => {
    if (!overlay.strength) return [];
    return geoHeat
      .filter((g) => typeof g.cx === "number" && typeof g.cy === "number")
      .map((g) => {
        const [x, z] = svgTo3D(g.cx!, g.cy!);
        const height = (g.energyScore / 100) * 4;
        return {
          geoId: g.geoId,
          label: g.label,
          position: [x, 0, z] as [number, number, number],
          height,
          color: bandColor(theme, g.statusBand),
          isHot: g.statusBand === "HOT",
        };
      });
  }, [geoHeat, theme, overlay.strength]);

  const pins = useMemo(() => {
    if (mapViewMode !== "PINS") return [];
    return pipelinePins
      .filter((p) => typeof p.x === "number" && typeof p.y === "number")
      .map((p) => {
        const [x, z] = svgTo3D(p.x, p.y);
        const geo = geoHeat.find((g) => g.geoId === p.geoId);
        const color = geo ? bandColor(theme, geo.statusBand) : theme.palette.neutral;
        return {
          pin: p,
          position: [x, 0, z] as [number, number, number],
          color,
        };
      });
  }, [pipelinePins, geoHeat, theme, mapViewMode]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={45} />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <spotLight position={[-8, 12, -8]} intensity={0.6} color={theme.palette.rim} angle={0.4} />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffff" />

      {/* Fog */}
      <fog attach="fog" args={["#0a0a12", 15, 35]} />

      {/* Ground */}
      <GroundPlane theme={theme} />

      {/* State Columns */}
      {columns.map((col) => (
        <StateColumn
          key={col.geoId}
          geoId={col.geoId}
          label={col.label}
          position={col.position}
          height={col.height}
          color={col.color}
          isHot={col.isHot}
          pulseEnabled={theme.animation.pulseHotZones}
          pulseSpeed={theme.animation.pulseSpeedMs}
          rimColor={theme.palette.rim}
          onClick={() => onStateClick?.(col.geoId)}
        />
      ))}

      {/* Pipeline Pins */}
      {pins.map((p) => (
        <PipelinePin3D
          key={p.pin.pipelineId}
          pin={p.pin}
          position={p.position}
          color={p.color}
          onClick={() => onPinClick?.(p.pin.pipelineId)}
        />
      ))}

      {/* Legend */}
      <Legend3D theme={theme} position={[10, 0, -5]} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </>
  );
};

// --- Main Component ---
export default function USPipelineHeatMapWebGL_ESPN(props: Props) {
  const {
    geoHeat,
    pipelinePins,
    theme,
    mapViewMode = "STATES",
    overlay,
    onStateClick,
    onPinClick,
    width = 1100,
    height = 620,
  } = props;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: height,
        background: `radial-gradient(ellipse at 50% 20%, rgba(57,182,255,0.12), #05060a 70%)`,
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* ESPN top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${theme.palette.hot}, ${theme.palette.rim}, ${theme.palette.hot})`,
          zIndex: 10,
        }}
      />

      {/* Stats overlay */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          background: "rgba(8,12,18,0.7)",
          backdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: "8px 12px",
          border: `1px solid ${theme.palette.rim}33`,
        }}
      >
        <div style={{ fontSize: 10, color: theme.palette.hot, fontWeight: 700, letterSpacing: 1 }}>
          LIVE 3D
        </div>
        <div style={{ fontSize: 13, color: "#fff" }}>{geoHeat.length} Regions</div>
      </div>

      {/* WebGL Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene
            geoHeat={geoHeat}
            pipelinePins={pipelinePins}
            theme={theme}
            mapViewMode={mapViewMode}
            overlay={overlay}
            onStateClick={onStateClick}
            onPinClick={onPinClick}
          />
        </Suspense>
      </Canvas>

      {/* ESPN bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          zIndex: 10,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 16px 10px",
        }}
      >
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          Drag to rotate • Scroll to zoom • Click column for details
        </span>
      </div>
    </div>
  );
}
