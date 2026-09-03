import { useRef, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";


const WATER_COLOR = "#5fa3b8";
const ROAD_COLOR = "#c9c4b8";
const ZONING_COLOR = "#d4a76a";
const RAIL_COLOR = "#d4b46a";
const PRIMARY_COLOR = "#7dd3fc";
const TERRAIN_COLOR = "#2a3b3f";

type LayerKey = "roads" | "water" | "zoning" | "rail";
type Layers = Record<LayerKey, boolean>;

type Point2 = readonly [number, number];

function terrainHeight(x: number, y: number) {
  return (
    Math.sin(x * 0.12) * 1.2 +
    Math.cos(y * 0.14) * 1.1 +
    Math.sin((x + y) * 0.08) * 1.5 +
    Math.cos(x * 0.3 - y * 0.2) * 0.4
  );
}

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 80, 80);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        color={TERRAIN_COLOR}
        roughness={0.85}
        metalness={0.1}
        flatShading={false}
      />
    </mesh>
  );
}

function WaterLayer({ visible }: { visible: boolean }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-18, -12);
    s.bezierCurveTo(-8, -14, -2, -8, 6, -10);
    s.bezierCurveTo(14, -12, 20, -6, 24, -8);
    s.lineTo(26, -22);
    s.lineTo(-20, -22);
    s.closePath();
    return s;
  }, []);
  if (!visible) return null;


  return (
    <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={WATER_COLOR}
        transparent
        opacity={0.55}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

function ZoningLayer({ visible }: { visible: boolean }) {
  const zones = useMemo(
    () => [
      { x: -14, z: -6, w: 8, d: 6 },
      { x: -2, z: 2, w: 6, d: 5 },
      { x: 10, z: -4, w: 9, d: 7 },
      { x: 14, z: 8, w: 7, d: 5 },
    ],
    []
  );
  if (!visible) return null;


  return (
    <group>
      {zones.map((z, i) => (
        <mesh key={i} position={[z.x, 0.35, z.z]}>
          <boxGeometry args={[z.w, 0.7, z.d]} />
          <meshStandardMaterial
            color={ZONING_COLOR}
            transparent
            opacity={0.35}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

function RoadLayer({ visible }: { visible: boolean }) {
  const roads = useMemo<readonly Point2[][]>(
    () => [
      [
        [-28, 4],
        [28, 4],
      ],
      [
        [-10, -22],
        [-10, 22],
      ],
      [
        [8, -22],
        [8, 12],
      ],
      [
        [20, -22],
        [20, 22],
      ],
      [
        [-28, 12],
        [28, 12],
      ],
      [
        [-28, -4],
        [-8, -2],
        [6, -6],
        [28, -4],
      ],
    ],
    []
  );
  if (!visible) return null;

  return (

    <group>
      {roads.map((points, i) => {
        const curve = new THREE.CatmullRomCurve3(
          points.map(([x, z]) => {
            const y = terrainHeight(x, z) + 0.05;
            return new THREE.Vector3(x, y, z);
          })
        );
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 64, 0.18, 8, false]} />
            <meshStandardMaterial color={ROAD_COLOR} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

function RailLayer({ visible }: { visible: boolean }) {
  const points = useMemo(
    () =>
      ([
        [-28, 10],
        [-12, 8],
        [0, 10],
        [14, 6],
        [28, 8],
      ] as Point2[]).map(([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 0.08, z)),
    []
  );
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  if (!visible) return null;

  return (

    <mesh>
      <tubeGeometry args={[curve, 80, 0.12, 8, false]} />
      <meshStandardMaterial
        color={RAIL_COLOR}
        roughness={0.4}
        metalness={0.4}
      />
    </mesh>
  );
}

function CalibrationPoints() {
  const points = useMemo<Point2[]>(
    () => [
      [-10, 4],
      [8, 12],
      [20, 6],
    ],
    []
  );

  return (
    <group>
      {points.map(([x, z], i) => {
        const y = terrainHeight(x, z) + 0.5;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
              <meshStandardMaterial color={PRIMARY_COLOR} emissive={PRIMARY_COLOR} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <torusGeometry args={[0.35, 0.03, 8, 32]} />
              <meshStandardMaterial color={PRIMARY_COLOR} emissive={PRIMARY_COLOR} emissiveIntensity={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Scene({ layers }: { layers: Layers }) {
  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <fog attach="fog" args={["#0f172a", 45, 130]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[20, 30, 15]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <pointLight position={[-10, 15, -10]} intensity={0.6} color="#7dd3fc" />

      <Terrain />
      <WaterLayer visible={layers.water} />
      <ZoningLayer visible={layers.zoning} />
      <RoadLayer visible={layers.roads} />
      <RailLayer visible={layers.rail} />
      <CalibrationPoints />

      <Grid
        position={[0, 0.05, 0]}
        args={[120, 120]}
        cellSize={4}
        cellThickness={0.5}
        cellColor="#7dd3fc"
        sectionSize={20}
        sectionThickness={0.8}
        sectionColor="#7dd3fc"
        fadeDistance={80}
        fadeStrength={1.2}
        infiniteGrid={false}
      />

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minDistance={15}
        maxDistance={90}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 0, 0]}
      />
    </>
  );
}

function Fallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
      <p className="label-mono text-primary">WebGL non disponible</p>
      <p className="text-sm">Votre navigateur ou appareil ne prend pas en charge WebGL. La démo 3D ne peut pas s'afficher.</p>
    </div>
  );
}

export function GeoScene3D() {
  const [layers, setLayers] = useState<Layers>({
    roads: true,
    water: true,
    zoning: true,
    rail: true,
  });

  const toggle = (key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-background sm:h-[70vh]">
      <Canvas
        shadows
        camera={{ position: [35, 28, 35], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        fallback={<Fallback />}
      >
        <Scene layers={layers} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="pointer-events-auto rounded-md border border-border bg-background/90 p-3 shadow-panel backdrop-blur">
          <p className="label-mono mb-3 text-primary">Calques GeoJSON</p>
          <div className="space-y-2">
            {([
              ["roads", "Routes", ROAD_COLOR],
              ["water", "Eau", WATER_COLOR],
              ["zoning", "Zonage", ZONING_COLOR],
              ["rail", "Rail", RAIL_COLOR],
            ] as Array<[LayerKey, string, string]>).map(([key, label, color]) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color, opacity: layers[key] ? 1 : 0.25 }}
                  aria-hidden
                />
                <span className={layers[key] ? "text-foreground" : "text-muted-foreground line-through"}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
        <p className="text-center text-xs text-muted-foreground">
          Démonstration web uniquement — le rendu final dans Cities: Skylines II dépend de l'API modding du jeu.
        </p>
      </div>
    </div>
  );
}
