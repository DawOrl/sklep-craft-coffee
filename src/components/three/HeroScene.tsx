'use client';

import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import { Color, Euler, MathUtils, Matrix4, MeshPhysicalMaterial, Quaternion, Vector3 } from 'three';
import type { BufferGeometry, Group, InstancedMesh, Mesh } from 'three';

export { HeroSceneFallback } from './HeroSceneFallback';

export interface HeroSceneProps {
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Model: 4 warianty palonego ziarna z Blendera                         */
/* (scripts/blender/coffee_beans.py). Siatki maja dlugosc ~2 jednostek, */
/* plaska strona z bruzda w +Y, kolor wypalenia w atrybucie COLOR_0.     */
/* ------------------------------------------------------------------ */

const MODEL_URL = '/models/coffee-beans.glb';
const VARIANTS = ['bean-0', 'bean-1', 'bean-2', 'bean-3'] as const;
const UNIT = 0.52;

// Satyna z lekkim, oleistym polyskiem swiezego wypalu. Kolor bazowy jest
// bialy: barwe niesie COLOR_0 (siatka) razy instanceColor (jitter).
const beanMaterial = new MeshPhysicalMaterial({
  vertexColors: true,
  roughness: 0.46,
  metalness: 0,
  clearcoat: 0.32,
  clearcoatRoughness: 0.38,
  sheen: 0.25,
  sheenRoughness: 0.6,
  sheenColor: new Color('#c99a5f'),
});

interface BeanSpec {
  p: [number, number, number];
  r: [number, number, number];
  s: number;
  v: 0 | 1 | 2 | 3;
}

/* Desktop: jedno duze ziarno blisko kamery (bruzda do widza) i pole
   mniejszych w glebi; lewa polowa kadru zostaje dla naglowka. */
const DESKTOP: BeanSpec[] = [
  { p: [2.0, -0.1, 1.8], r: [1.35, 0.35, 0.5], s: 1.5, v: 0 },
  { p: [3.64, 1.6, 0.5], r: [0.3, 2.2, 1.0], s: 1.05, v: 2 },
  { p: [1.58, 1.91, -0.8], r: [2.5, 0.8, 0.2], s: 0.85, v: 1 },
  { p: [3.67, -1.4, 0.9], r: [1.6, 1.4, 2.4], s: 1.15, v: 3 },
  { p: [1.69, -1.94, 0.2], r: [1.9, 2.8, 0.7], s: 0.9, v: 2 },
  { p: [3.34, -3.05, -1.2], r: [0.2, 0.6, 1.9], s: 1.0, v: 1 },
  { p: [5.34, 0.17, -1.6], r: [2.2, 1.1, 0.4], s: 1.05, v: 0 },
  { p: [3.56, 3.1, -2.4], r: [1.3, 2.0, 2.2], s: 0.85, v: 3 },
  { p: [1.19, 0.56, -2.8], r: [0.8, 0.2, 1.4], s: 0.75, v: 0 },
  { p: [4.35, 0.95, -3.0], r: [2.9, 1.7, 0.9], s: 0.9, v: 2 },
  { p: [5.36, -3.18, -2.2], r: [1.0, 2.6, 0.3], s: 0.95, v: 1 },
  { p: [4.54, 2.41, 0.0], r: [0.4, 0.9, 2.7], s: 0.8, v: 3 },
  { p: [-5.38, 2.63, -2.6], r: [2.0, 0.5, 1.1], s: 0.85, v: 1 },
  { p: [-4.98, -2.46, -1.4], r: [0.7, 1.9, 0.6], s: 0.95, v: 2 },
  { p: [-2.3, -3.3, -2.4], r: [1.5, 0.3, 2.0], s: 0.75, v: 0 },
  { p: [0.86, -2.33, 1.2], r: [2.4, 2.2, 1.3], s: 0.7, v: 3 },
  { p: [1.51, 1.77, 1.5], r: [0.9, 1.2, 0.2], s: 0.65, v: 1 },
  { p: [3.5, -0.75, 2.2], r: [1.7, 2.9, 1.6], s: 0.8, v: 2 },
];

/* Pion (telefon, tablet): drobniejsze ziarna nad i pod blokiem tekstu. */
const PORTRAIT: BeanSpec[] = [
  { p: [0.65, 1.6, 0.8], r: [1.35, 0.4, 0.5], s: 0.55, v: 0 },
  { p: [-0.86, 2.12, -0.6], r: [0.3, 2.2, 1.0], s: 0.45, v: 2 },
  { p: [1.57, 1.87, -1.8], r: [2.5, 0.8, 0.2], s: 0.45, v: 1 },
  { p: [-1.13, 1.47, 1.2], r: [0.6, 1.4, 2.4], s: 0.4, v: 3 },
  { p: [0.0, 3.2, -2.6], r: [1.9, 2.8, 0.7], s: 0.4, v: 1 },
  { p: [0.7, -1.56, 1.0], r: [1.4, 0.6, 1.9], s: 0.6, v: 2 },
  { p: [-0.75, -2.37, -0.4], r: [2.2, 1.1, 0.4], s: 0.5, v: 0 },
  { p: [1.46, -3.17, -1.6], r: [1.3, 2.0, 2.2], s: 0.5, v: 3 },
  { p: [-1.62, -1.94, -2.2], r: [0.8, 0.2, 1.4], s: 0.42, v: 1 },
  { p: [0.4, -2.45, 1.6], r: [2.9, 1.7, 0.9], s: 0.4, v: 0 },
];

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

// deterministyczny "losowy" ciag na ziarno (bez Math.random w renderze)
function hash(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const tmpMatrix = new Matrix4();
const tmpPos = new Vector3();
const tmpQuat = new Quaternion();
const tmpEuler = new Euler();
const tmpScale = new Vector3();

function BeanField({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  const { nodes } = useGLTF(MODEL_URL, false) as unknown as {
    nodes: Record<string, Mesh>;
  };
  const aspect = useThree((s) => s.viewport.aspect);
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef<(InstancedMesh | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const start = useRef<number | null>(null);

  const layout = useMemo(() => {
    if (aspect >= 1) return DESKTOP;
    // pion: rozsun ziarna proporcjonalnie do szerokosci kadru
    const k = MathUtils.clamp(aspect / 0.46, 1, 1.6);
    return PORTRAIT.map((b) => ({ ...b, p: [b.p[0] * k, b.p[1], b.p[2]] as BeanSpec['p'] }));
  }, [aspect]);

  const groups = useMemo(
    () =>
      VARIANTS.map((_, v) =>
        layout.map((bean, i) => ({ bean, i })).filter(({ bean }) => bean.v === v),
      ),
    [layout],
  );

  const geometries = useMemo(
    () => VARIANTS.map((name) => nodes[name]?.geometry as BufferGeometry | undefined),
    [nodes],
  );

  // jitter jasnosci per ziarno (instanceColor mnozy COLOR_0)
  useEffect(() => {
    const color = new Color();
    groups.forEach((list, v) => {
      const mesh = meshRefs.current[v];
      if (!mesh) return;
      list.forEach(({ i }, k) => {
        const l = 0.82 + hash(i, 3) * 0.34;
        mesh.setColorAt(k, color.setRGB(l, l * 0.98, l * 0.95));
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    onReady();
  }, [groups, onReady]);

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame(({ clock, invalidate }, delta) => {
    const t = clock.getElapsedTime();
    if (start.current === null) start.current = t;
    const since = t - start.current;
    let settling = false;

    groups.forEach((list, v) => {
      const mesh = meshRefs.current[v];
      if (!mesh) return;
      list.forEach(({ bean, i }, k) => {
        // wejscie: ziarna opadaja i dociagaja do pozycji (1.6 s, stagger)
        const raw = reduced ? 1 : MathUtils.clamp((since - 0.15 - i * 0.045) / 1.6, 0, 1);
        if (raw < 1) settling = true;
        const e = easeOutCubic(raw);
        const phase = hash(i, 1) * Math.PI * 2;
        const speed = 0.35 + hash(i, 2) * 0.35;
        const float = reduced ? 0 : Math.sin(t * speed + phase) * 0.12;
        const spin = reduced ? 0 : t * (0.04 + hash(i, 4) * 0.05) * (i % 2 ? 1 : -1);
        const wobble = reduced ? 0 : Math.sin(t * speed * 0.8 + phase) * 0.14;

        tmpPos.set(bean.p[0], bean.p[1] + float + (1 - e) * 2.6, bean.p[2]);
        tmpEuler.set(
          bean.r[0] + wobble + (1 - e) * 1.4,
          bean.r[1] + spin,
          bean.r[2] + wobble * 0.5,
        );
        tmpQuat.setFromEuler(tmpEuler);
        const s = bean.s * UNIT * (0.6 + 0.4 * e);
        tmpScale.set(s, s, s);
        tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
        mesh.setMatrixAt(k, tmpMatrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });

    const group = groupRef.current;
    if (group && !reduced) {
      const scroll = window.scrollY;
      const targetY = pointer.current.x * 0.14 + scroll * 0.00012;
      const targetX = pointer.current.y * 0.08 + scroll * 0.0003;
      group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 2.4, delta);
      group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 2.4, delta);
      group.position.y = MathUtils.damp(group.position.y, scroll * 0.0016, 4, delta);
    }
    if (reduced && settling) invalidate();
  });

  return (
    <group ref={groupRef}>
      {groups.map((list, v) => {
        const geometry = geometries[v];
        if (!geometry || list.length === 0) return null;
        return (
          <instancedMesh
            key={`${VARIANTS[v]}-${list.length}`}
            ref={(mesh) => {
              meshRefs.current[v] = mesh;
            }}
            args={[geometry, beanMaterial, list.length]}
            frustumCulled={false}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload(MODEL_URL, false);

/**
 * Pole palonych ziaren kawy: tlo hero na stronie glownej.
 * Mount via `next/dynamic` with `ssr: false` inside a client wrapper;
 * size it from outside (e.g. `className="absolute inset-0"`).
 * Renders only while the hero is on screen; reduced motion = static frame.
 */
export function HeroScene({ className }: HeroSceneProps) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleReady = useMemo(() => () => setReady(true), []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
        ready ? 'opacity-100' : 'opacity-0'
      } ${className ?? ''}`}
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={reduced || !inView ? 'demand' : 'always'}
      >
        <fog attach="fog" args={['#120d0a', 10, 20]} />
        <ambientLight intensity={0.25} />
        {/* cieply, miekki klucz z lewej gory */}
        <directionalLight position={[-3, 5, 6]} intensity={2.2} color="#f3e4cc" />
        {/* zloty kontur z tylu po prawej */}
        <directionalLight position={[6, 2, -5]} intensity={3.2} color="#c99a5f" />
        <pointLight position={[3.5, -1, -4]} intensity={14} distance={14} decay={2} color="#e0b070" />
        <Suspense fallback={null}>
          <BeanField reduced={reduced} onReady={handleReady} />
          {/* odbicia: proceduralne panele swiatla, bez pobierania HDR */}
          <Environment resolution={128} frames={1} environmentIntensity={0.55}>
            <Lightformer form="rect" intensity={2.4} color="#f6e7cf" position={[-4, 4, 6]} scale={[8, 5, 1]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={3} color="#d9a463" position={[6, 1, -4]} scale={[2, 9, 1]} target={[0, 0, 0]} />
            <Lightformer form="ring" intensity={0.8} color="#ffffff" position={[0, 6, 2]} scale={4} target={[0, 0, 0]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
