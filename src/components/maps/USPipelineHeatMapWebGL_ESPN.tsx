import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Tier = "CORE" | "GM" | "ELITE";

type GeoHeat = {
  geoId: string;
  label: string;
  energyScore: number;
  statusBand: "HOT" | "WARM" | "NEUTRAL" | "COLD" | "DEAD";
  cx?: number;
  cy?: number;
};

type ESPNTheme = {
  palette: { bg: string; rim: string; hot: string; warm: string; neutral: string; cold: string; dead: string; glass: string };
};

type Props = {
  geoHeat: GeoHeat[];
  theme: ESPNTheme;
  onStateClick?: (geoId: string) => void;
  width?: number;
  height?: number;
};

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

export default function USPipelineHeatMapWebGL_ESPN({ geoHeat, theme, onStateClick, width = 1100, height = 620 }: Props) {
  const columns = useMemo(() => {
    return geoHeat
      .filter((g) => typeof g.cx === "number" && typeof g.cy === "number")
      .map((g) => {
        const h = 0.08 + (g.energyScore / 100) * 0.75;
        return {
          geoId: g.geoId,
          x: ((g.cx as number) / width - 0.5) * 6.5,
          z: ((g.cy as number) / height - 0.5) * 3.8,
          h,
          color: new THREE.Color(bandColor(theme, g.statusBand))
        };
      });
  }, [geoHeat, theme, width, height]);

  return (
    <div style={{ width: "100%", height, background: theme.palette.bg, borderRadius: 18, overflow: "hidden" }}>
      <Canvas shadows camera={{ position: [0, 3.5, 4.5], fov: 40 }}>
        {/* Lights: ESPN broadcast vibe */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <spotLight position={[-4, 6, -3]} intensity={0.5} color={theme.palette.rim} angle={0.5} />

        {/* US surface plane (acts like the 3D "deck") */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#0a0c10" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* Columns */}
        {columns.map((c) => (
          <group key={c.geoId} position={[c.x, c.h / 2, c.z]}>
            <mesh
              onClick={() => onStateClick?.(c.geoId)}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[0.12, 0.12, c.h, 24]} />
              <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.35} metalness={0.5} roughness={0.35} />
            </mesh>
            {/* glow cap */}
            <mesh position={[0, c.h / 2 + 0.02, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
              <meshBasicMaterial color={c.color} transparent opacity={0.7} />
            </mesh>
          </group>
        ))}

        {/* Controls (locked tilt but slight movement feels "broadcast") */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
