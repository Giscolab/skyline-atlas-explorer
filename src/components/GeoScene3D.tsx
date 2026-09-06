import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const WATER_COLOR = "#5fa3b8";
const ROAD_COLOR = "#c9c4b8";
const ZONING_COLOR = "#d4a76a";
const RAIL_COLOR = "#d4b46a";
const PATH_COLOR = "#8fbf9f";
const SERVICE_COLOR = "#c79ad8";
const PRIMARY_COLOR = "#7dd3fc";
const TERRAIN_COLOR = "#2a3b3f";

const WORLD_WIDTH = 60;
const VERTICAL_EXAGGERATION = 2.6;

type LayerKey = "roads" | "paths" | "water" | "zoning" | "rail" | "services";
type Layers = Record<LayerKey, boolean>;

type Bundle = {
  metadata: {
    source: string;
    area: string;
    bbox: [number, number, number, number];
    origin: { lon: number; lat: number };
    sizeMeters: [number, number];
    elevation: { grid: number; min: number; max: number; values: number[] };
  };
  features: Array<{
    properties: { layer: LayerKey; kind?: string; name?: string };
    geometry:
      | { type: "LineString"; coordinates: [number, number][] }
      | { type: "Point"; coordinates: [number, number] }
      | { type: "Polygon"; coordinates: [number, number][][] };
  }>;
};


/** Convertit un bundle RealMap (mètres locaux + grille SRTM) en espace de scène. */
function createTransform(meta: Bundle["metadata"]) {
  const [sizeX, sizeY] = meta.sizeMeters;
  const scale = WORLD_WIDTH / sizeX;
  const worldDepth = sizeY * scale;
  const { grid, min, max, values } = meta.elevation;
  const heightScale = scale * VERTICAL_EXAGGERATION;

  // x = est (mètres), z = -nord (mètres)
  const toWorldXZ = (mx: number, my: number): [number, number] => [mx * scale, -my * scale];

  const sampleGrid = (i: number, j: number) => {
    const ci = Math.min(grid - 1, Math.max(0, i));
    const cj = Math.min(grid - 1, Math.max(0, j));
    return values[cj * grid + ci] ?? min;
  };

  /** Altitude interpolée (unités de scène) pour un point du monde. */
  const heightAt = (x: number, z: number) => {
    const u = (x / WORLD_WIDTH + 0.5) * (grid - 1);
    const v = (0.5 - z / worldDepth) * (grid - 1);
    const i = Math.floor(u);
    const j = Math.floor(v);
    const fu = u - i;
    const fv = v - j;
    const h =
      sampleGrid(i, j) * (1 - fu) * (1 - fv) +
      sampleGrid(i + 1, j) * fu * (1 - fv) +
      sampleGrid(i, j + 1) * (1 - fu) * fv +
      sampleGrid(i + 1, j + 1) * fu * fv;
    return (h - min) * heightScale;
  };

  return { scale, worldDepth, grid, toWorldXZ, heightAt, minElevation: min, maxElevation: max };
}

type Transform = ReturnType<typeof createTransform>;

function useTerrainGeometry(t: Transform) {
  return useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_WIDTH, t.worldDepth, t.grid - 1, t.grid - 1);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, t.heightAt(pos.getX(i), pos.getZ(i)));
    }
    geo.computeVertexNormals();
    return geo;
  }, [t]);
}

function buildLineGeometry(
  bundle: Bundle,
  t: Transform,
  layer: LayerKey,
  lift: number
): THREE.BufferGeometry | null {
  const verts: number[] = [];
  for (const f of bundle.features) {
    if (f.properties.layer !== layer || f.geometry.type !== "LineString") continue;
    const pts = f.geometry.coordinates;
    for (let i = 0; i < pts.length - 1; i++) {
      for (const p of [pts[i], pts[i + 1]]) {
        if (!p) continue;
        const [x, z] = t.toWorldXZ(p[0], p[1]);
        verts.push(x, t.heightAt(x, z) + lift, z);
      }
    }
  }
  if (!verts.length) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

function buildPointsGeometry(
  bundle: Bundle,
  t: Transform,
  layer: LayerKey,
  lift: number
): THREE.BufferGeometry | null {
  const verts: number[] = [];
  for (const f of bundle.features) {
    if (f.properties.layer !== layer || f.geometry.type !== "Point") continue;
    const p = f.geometry.coordinates;
    const [x, z] = t.toWorldXZ(p[0], p[1]);
    verts.push(x, t.heightAt(x, z) + lift, z);
  }
  if (!verts.length) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}



function buildPolygonGeometry(
  bundle: Bundle,
  t: Transform,
  layer: LayerKey,
  options: { lift: number; flatten?: boolean }
): THREE.BufferGeometry | null {
  const parts: THREE.BufferGeometry[] = [];
  for (const f of bundle.features) {
    if (f.properties.layer !== layer || f.geometry.type !== "Polygon") continue;
    const outer = f.geometry.coordinates[0];
    if (!outer) continue;
    const ring = outer.map(([mx, my]) => {
      const [x, z] = t.toWorldXZ(mx, my);
      return new THREE.Vector2(x, z);
    });
    if (ring.length < 4) continue;
    const shape = new THREE.Shape(ring);
    let geo: THREE.BufferGeometry;
    try {
      geo = new THREE.ShapeGeometry(shape);
    } catch {
      continue;
    }
    const pos = geo.getAttribute("position");
    if (!pos || pos.count < 3) continue;
    // ShapeGeometry est dans le plan XY : (x, y) => (x, hauteur, y)
    let level = 0;
    if (options.flatten) {
      let sum = 0;
      for (let i = 0; i < pos.count; i++) sum += t.heightAt(pos.getX(i), pos.getY(i));
      level = sum / pos.count;
    }
    const out = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const y = (options.flatten ? level : t.heightAt(x, z)) + options.lift;
      out[i * 3] = x;
      out[i * 3 + 1] = y;
      out[i * 3 + 2] = z;
    }
    const flat = new THREE.BufferGeometry();
    flat.setAttribute("position", new THREE.Float32BufferAttribute(out, 3));
    if (geo.index) flat.setIndex(Array.from(geo.index.array));
    flat.computeVertexNormals();
    parts.push(flat);
    geo.dispose();
  }
  if (!parts.length) return null;
  return mergeGeometries(parts, false);
}

function CalibrationPoints({ bundle, t }: { bundle: Bundle; t: Transform }) {
  const marks = useMemo(() => {
    const named = bundle.features.filter((f) => f.properties.name && f.properties.layer === "roads");
    const picks = [named[0], named[Math.floor(named.length / 2)], named[named.length - 1]].filter(
      (f): f is NonNullable<typeof f> => Boolean(f)
    );
    return picks.flatMap((f) => {
      const coords = (f.geometry as { coordinates: [number, number][] }).coordinates;
      const mid = coords[Math.floor(coords.length / 2)];
      if (!mid) return [];
      const [x, z] = t.toWorldXZ(mid[0], mid[1]);
      return [{ x, z, y: t.heightAt(x, z), label: f.properties.name ?? "" }];
    });
  }, [bundle, t]);

  return (
    <group>
      {marks.map((m, i) => (
        <group key={i} position={[m.x, m.y + 0.6, m.z]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 1.2, 12]} />
            <meshStandardMaterial
              color={PRIMARY_COLOR}
              emissive={PRIMARY_COLOR}
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <torusGeometry args={[0.3, 0.03, 8, 24]} />
            <meshStandardMaterial
              color={PRIMARY_COLOR}
              emissive={PRIMARY_COLOR}
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({ bundle, layers }: { bundle: Bundle; layers: Layers }) {
  const t = useMemo(() => createTransform(bundle.metadata), [bundle]);
  const terrain = useTerrainGeometry(t);

  const roads = useMemo(() => buildLineGeometry(bundle, t, "roads", 0.06), [bundle, t]);
  const paths = useMemo(() => buildLineGeometry(bundle, t, "paths", 0.04), [bundle, t]);
  const waterLines = useMemo(() => buildLineGeometry(bundle, t, "water", 0.08), [bundle, t]);

  const rail = useMemo(() => buildLineGeometry(bundle, t, "rail", 0.1), [bundle, t]);
  const services = useMemo(() => buildPointsGeometry(bundle, t, "services", 0.35), [bundle, t]);
  const water = useMemo(
    () => buildPolygonGeometry(bundle, t, "water", { lift: 0.05, flatten: true }),
    [bundle, t]
  );
  const zoning = useMemo(
    () => buildPolygonGeometry(bundle, t, "zoning", { lift: 0.2 }),
    [bundle, t]
  );


  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <fog attach="fog" args={["#0f172a", 45, 140]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 15]} intensity={1.3} />
      <pointLight position={[-10, 15, -10]} intensity={0.5} color="#7dd3fc" />

      <mesh geometry={terrain}>
        <meshStandardMaterial color={TERRAIN_COLOR} roughness={0.9} metalness={0.05} />
      </mesh>

      {layers.water && water ? (
        <mesh geometry={water}>
          <meshStandardMaterial
            color={WATER_COLOR}
            transparent
            opacity={0.6}
            roughness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}

      {layers.water && waterLines ? (
        <lineSegments geometry={waterLines}>
          <lineBasicMaterial color={WATER_COLOR} transparent opacity={0.85} />
        </lineSegments>
      ) : null}


      {layers.zoning && zoning ? (
        <mesh geometry={zoning}>
          <meshStandardMaterial
            color={ZONING_COLOR}
            transparent
            opacity={0.28}
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}

      {layers.roads && roads ? (
        <lineSegments geometry={roads}>
          <lineBasicMaterial color={ROAD_COLOR} transparent opacity={0.9} />
        </lineSegments>
      ) : null}

      {layers.paths && paths ? (
        <lineSegments geometry={paths}>
          <lineBasicMaterial color={PATH_COLOR} transparent opacity={0.5} />
        </lineSegments>
      ) : null}

      {layers.rail && rail ? (
        <lineSegments geometry={rail}>
          <lineBasicMaterial color={RAIL_COLOR} transparent opacity={0.85} />
        </lineSegments>
      ) : null}

      {layers.services && services ? (
        <points geometry={services}>
          <pointsMaterial
            color={SERVICE_COLOR}
            size={0.45}
            sizeAttenuation
            transparent
            opacity={0.95}
          />
        </points>
      ) : null}


      <CalibrationPoints bundle={bundle} t={t} />

      <Grid
        position={[0, 0.02, 0]}
        args={[140, 140]}
        cellSize={4}
        cellThickness={0.5}
        cellColor="#7dd3fc"
        sectionSize={20}
        sectionThickness={0.8}
        sectionColor="#7dd3fc"
        fadeDistance={90}
        fadeStrength={1.2}
        infiniteGrid={false}
      />

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        minDistance={12}
        maxDistance={110}
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
      <p className="text-sm">
        Votre navigateur ou appareil ne prend pas en charge WebGL. La démo 3D ne peut pas s'afficher.
      </p>
    </div>
  );
}

export function GeoScene3D() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layers>({
    roads: true,
    paths: true,
    water: true,
    zoning: true,
    rail: true,
    services: true,
  });


  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL ?? "/";
    fetch(`${base}data/realmap-lyon.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Bundle>;
      })
      .then((b) => {
        if (!cancelled) setBundle(b);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur de chargement");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (key: LayerKey) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const counts = useMemo(() => {
    const c: Record<LayerKey, number> = {
      roads: 0,
      paths: 0,
      water: 0,
      zoning: 0,
      rail: 0,
      services: 0,
    };

    bundle?.features.forEach((f) => {
      if (f.properties.layer in c) c[f.properties.layer] += 1;
    });
    return c;
  }, [bundle]);

  return (
    <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-background sm:h-[70vh]">
      {bundle ? (
        <Canvas
          camera={{ position: [42, 34, 50], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
          fallback={<Fallback />}
        >
          <Scene bundle={bundle} layers={layers} />
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="label-mono text-primary">
            {error ? `Bundle indisponible — ${error}` : "Chargement du bundle GeoJSON…"}
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="pointer-events-auto rounded-md border border-border bg-background/90 p-3 shadow-panel backdrop-blur">
          <p className="label-mono mb-1 text-primary">Calques GeoJSON</p>
          <p className="mb-3 font-mono text-[10px] text-muted-foreground">
            {bundle ? bundle.metadata.area : "—"}
          </p>
          <div className="space-y-2">
            {(
              [
                ["roads", "Routes", ROAD_COLOR],
                ["paths", "Chemins", PATH_COLOR],
                ["water", "Eau", WATER_COLOR],
                ["zoning", "Zonage", ZONING_COLOR],
                ["rail", "Rail", RAIL_COLOR],
                ["services", "Services", SERVICE_COLOR],

              ] as Array<[LayerKey, string, string]>
            ).map(([key, label, color]) => (
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
                <span
                  className={
                    layers[key] ? "text-foreground" : "text-muted-foreground line-through"
                  }
                >
                  {label}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {bundle ? (
          <div className="pointer-events-auto hidden rounded-md border border-border bg-background/90 p-3 text-right shadow-panel backdrop-blur sm:block">
            <p className="label-mono text-primary">Relief SRTM</p>
            <p className="mt-1 font-mono text-xs text-foreground">
              {Math.round(bundle.metadata.elevation.min)} – {Math.round(bundle.metadata.elevation.max)} m
            </p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              emprise {(bundle.metadata.sizeMeters[0] / 1000).toFixed(1)} ×{" "}
              {(bundle.metadata.sizeMeters[1] / 1000).toFixed(1)} km
            </p>
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
        <div className="max-w-xl rounded-md border border-border bg-background/85 px-3 py-2 text-center backdrop-blur">
          <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
            Données réelles : OpenStreetMap (ODbL) via Overpass API · altitudes SRTM
            (open-elevation).
          </p>
          <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
            Démonstration web uniquement — le rendu final dans Cities: Skylines II dépend de l'API
            modding du jeu.
          </p>
        </div>
      </div>

    </div>
  );
}
