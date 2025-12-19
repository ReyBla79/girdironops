import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { GeoHeat } from '@/types/pipeline';

// Simplified US state positions (normalized to -5 to 5 range for 3D space)
const STATE_POSITIONS: Record<string, { x: number; z: number; label: string }> = {
  TX: { x: -1.5, z: 1.5, label: 'TX' },
  CA: { x: -4.5, z: 0, label: 'CA' },
  FL: { x: 2.5, z: 2.5, label: 'FL' },
  GA: { x: 1.8, z: 1.2, label: 'GA' },
  OH: { x: 1.2, z: -0.8, label: 'OH' },
  PA: { x: 2.2, z: -1.2, label: 'PA' },
  NY: { x: 2.8, z: -1.8, label: 'NY' },
  IL: { x: 0.2, z: -0.5, label: 'IL' },
  MI: { x: 0.8, z: -1.5, label: 'MI' },
  NC: { x: 2.2, z: 0.5, label: 'NC' },
  NJ: { x: 2.8, z: -1, label: 'NJ' },
  VA: { x: 2, z: 0, label: 'VA' },
  WA: { x: -4.2, z: -2.5, label: 'WA' },
  AZ: { x: -3.5, z: 1.2, label: 'AZ' },
  MA: { x: 3.5, z: -2, label: 'MA' },
  TN: { x: 0.8, z: 0.8, label: 'TN' },
  IN: { x: 0.5, z: -0.3, label: 'IN' },
  MO: { x: -0.5, z: 0.2, label: 'MO' },
  MD: { x: 2.5, z: -0.5, label: 'MD' },
  WI: { x: 0, z: -1.5, label: 'WI' },
  CO: { x: -2.5, z: 0, label: 'CO' },
  AL: { x: 1.2, z: 1.5, label: 'AL' },
  SC: { x: 2, z: 1, label: 'SC' },
  LA: { x: -0.5, z: 2, label: 'LA' },
  KY: { x: 1, z: 0.3, label: 'KY' },
  OR: { x: -4.5, z: -1.8, label: 'OR' },
  OK: { x: -1.5, z: 0.8, label: 'OK' },
  CT: { x: 3.2, z: -1.5, label: 'CT' },
  UT: { x: -3.2, z: -0.5, label: 'UT' },
  IA: { x: -0.5, z: -1, label: 'IA' },
  NV: { x: -4, z: 0.2, label: 'NV' },
  AR: { x: -0.5, z: 1, label: 'AR' },
  MS: { x: 0.5, z: 1.8, label: 'MS' },
  KS: { x: -1.5, z: 0, label: 'KS' },
  NM: { x: -2.8, z: 1.2, label: 'NM' },
  NE: { x: -1.5, z: -0.8, label: 'NE' },
  ID: { x: -3.8, z: -1.5, label: 'ID' },
  WV: { x: 1.8, z: 0, label: 'WV' },
  HI: { x: -4.5, z: 3, label: 'HI' },
  NH: { x: 3.5, z: -2.3, label: 'NH' },
  ME: { x: 4, z: -2.8, label: 'ME' },
  MT: { x: -3, z: -2, label: 'MT' },
  RI: { x: 3.5, z: -1.7, label: 'RI' },
  DE: { x: 2.8, z: -0.6, label: 'DE' },
  SD: { x: -1.5, z: -1.5, label: 'SD' },
  ND: { x: -1.2, z: -2.2, label: 'ND' },
  AK: { x: -5, z: -3, label: 'AK' },
  VT: { x: 3.2, z: -2.5, label: 'VT' },
  WY: { x: -2.8, z: -1, label: 'WY' },
};

// ESPN-style color palette
const getESPNColor = (score: number): THREE.Color => {
  if (score >= 80) return new THREE.Color('#c41e3a'); // ESPN Red - Hot
  if (score >= 60) return new THREE.Color('#ff6b35'); // Orange - Warm
  if (score >= 40) return new THREE.Color('#ffc107'); // Gold - Neutral
  if (score >= 20) return new THREE.Color('#4a90d9'); // Blue - Cool
  return new THREE.Color('#2d3748'); // Dark - Cold
};

const getGlowIntensity = (score: number): number => {
  return 0.5 + (score / 100) * 2;
};

interface StatePillarProps {
  position: [number, number, number];
  height: number;
  color: THREE.Color;
  label: string;
  score: number;
  isSelected: boolean;
  onClick: () => void;
}

const StatePillar: React.FC<StatePillarProps> = ({
  position,
  height,
  color,
  label,
  score,
  isSelected,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
      meshRef.current.scale.x = scale;
      meshRef.current.scale.z = scale;
    }
    if (glowRef.current && isSelected) {
      glowRef.current.rotation.y += 0.02;
    }
  });

  const pillarHeight = Math.max(0.3, height * 3);

  return (
    <group position={position}>
      {/* Base glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.35, 0.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3 + (score / 100) * 0.4}
        />
      </mesh>

      {/* Main pillar */}
      <mesh
        ref={meshRef}
        position={[0, pillarHeight / 2, 0]}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.6, pillarHeight, 0.6]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.3}
        />
      </mesh>

      {/* Top cap with ESPN shine */}
      <mesh position={[0, pillarHeight + 0.05, 0]}>
        <boxGeometry args={[0.65, 0.1, 0.65]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      )}

      {/* State label */}
      <Text
        position={[0, pillarHeight + 0.4, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {label}
      </Text>

      {/* Score label */}
      <Text
        position={[0, pillarHeight + 0.7, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {score}
      </Text>
    </group>
  );
};

interface GridFloorProps {
  size?: number;
}

const GridFloor: React.FC<GridFloorProps> = ({ size = 12 }) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  return (
    <group>
      {/* Base plane with ESPN dark gradient feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Grid overlay */}
      <gridHelper
        ref={gridRef}
        args={[size, 20, '#1a1a2e', '#1a1a2e']}
        position={[0, 0.01, 0]}
      />

      {/* Outer ring glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[5.5, 6, 64]} />
        <meshBasicMaterial color="#c41e3a" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

interface ESPNTitleProps {
  title: string;
}

const ESPNTitle: React.FC<ESPNTitleProps> = ({ title }) => {
  return (
    <group position={[0, 4, -5]}>
      <Text
        fontSize={0.6}
        color="#c41e3a"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        RECRUITING PIPELINE INTELLIGENCE
      </Text>
    </group>
  );
};

interface LegendProps {
  position: [number, number, number];
}

const Legend: React.FC<LegendProps> = ({ position }) => {
  const levels = [
    { label: 'HOT', color: '#c41e3a', score: '80+' },
    { label: 'WARM', color: '#ff6b35', score: '60-79' },
    { label: 'NEUTRAL', color: '#ffc107', score: '40-59' },
    { label: 'COOL', color: '#4a90d9', score: '20-39' },
    { label: 'COLD', color: '#2d3748', score: '0-19' },
  ];

  return (
    <group position={position}>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
      >
        PIPELINE STRENGTH
      </Text>
      {levels.map((level, i) => (
        <group key={level.label} position={[0, 0.8 - i * 0.35, 0]}>
          <mesh position={[-0.8, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshBasicMaterial color={level.color} />
          </mesh>
          <Text
            position={[-0.4, 0, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="left"
          >
            {level.label}
          </Text>
          <Text
            position={[0.5, 0, 0]}
            fontSize={0.1}
            color="#888888"
            anchorX="left"
          >
            {level.score}
          </Text>
        </group>
      ))}
    </group>
  );
};

interface SceneProps {
  geoHeat: GeoHeat[];
  selectedGeoId: string | null;
  onStateClick: (geoId: string) => void;
}

const Scene: React.FC<SceneProps> = ({ geoHeat, selectedGeoId, onStateClick }) => {
  const pillars = useMemo(() => {
    return geoHeat.map((geo) => {
      const statePos = STATE_POSITIONS[geo.geoId];
      if (!statePos) return null;

      const score = geo.energyScore;
      const color = getESPNColor(score);
      const height = score / 100;

      return {
        geoId: geo.geoId,
        position: [statePos.x, 0, statePos.z] as [number, number, number],
        height,
        color,
        label: statePos.label,
        score,
      };
    }).filter(Boolean);
  }, [geoHeat]);

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />

      {/* Lighting - ESPN broadcast style */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-10, 10, -10]}
        intensity={0.5}
        color="#c41e3a"
        angle={0.3}
      />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />

      {/* Environment */}
      <fog attach="fog" args={['#0a0a0f', 10, 25]} />

      {/* Floor */}
      <GridFloor />

      {/* State Pillars */}
      {pillars.map((pillar) => pillar && (
        <StatePillar
          key={pillar.geoId}
          position={pillar.position}
          height={pillar.height}
          color={pillar.color}
          label={pillar.label}
          score={pillar.score}
          isSelected={selectedGeoId === pillar.geoId}
          onClick={() => onStateClick(pillar.geoId)}
        />
      ))}

      {/* Title */}
      <ESPNTitle title="PIPELINE MAP" />

      {/* Legend */}
      <Legend position={[5.5, 0.5, 0]} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
};

export interface USPipelineHeatMap3D_ESPNProps {
  geoHeat: GeoHeat[];
  selectedGeoId: string | null;
  onStateClick: (geoId: string) => void;
  className?: string;
}

const USPipelineHeatMap3D_ESPN: React.FC<USPipelineHeatMap3D_ESPNProps> = ({
  geoHeat,
  selectedGeoId,
  onStateClick,
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full min-h-[500px] bg-[#0a0a0f] rounded-lg overflow-hidden ${className}`}>
      {/* ESPN-style top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c41e3a] via-[#ff6b35] to-[#c41e3a] z-10" />
      
      {/* Stats overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded px-3 py-2 border border-[#c41e3a]/30">
        <div className="text-xs text-[#c41e3a] font-bold tracking-wider">LIVE DATA</div>
        <div className="text-white text-sm font-medium">{geoHeat.length} Regions Active</div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene
            geoHeat={geoHeat}
            selectedGeoId={selectedGeoId}
            onStateClick={onStateClick}
          />
        </Suspense>
      </Canvas>

      {/* ESPN-style bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end pb-2 px-4">
        <div className="text-xs text-gray-400">
          Drag to rotate • Scroll to zoom • Click state for details
        </div>
      </div>
    </div>
  );
};

export default USPipelineHeatMap3D_ESPN;
