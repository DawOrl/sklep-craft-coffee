'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MathUtils, MeshPhysicalMaterial, MeshStandardMaterial, SphereGeometry, TorusGeometry } from 'three';
import type { Group } from 'three';

export { HeroSceneFallback } from './HeroSceneFallback';

export interface HeroSceneProps {
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Shared geometry & materials (module-level: created once, reused by  */
/* every bean — the scene lives for the lifetime of the app).          */
/* ------------------------------------------------------------------ */

// Unit sphere, squashed per-mesh to [1, 0.62, 0.5] → coffee-bean ellipsoid.
const beanGeometry = new SphereGeometry(0.5, 40, 28);

// Seam: torus segment (120°). Rotated [π/2, 0, π/6] + offset z −0.26 it arcs
// across the bean's flat (+z) face from x −0.45 to +0.45, apex at z 0.26 —
// just proud of the 0.25 surface, ends buried inside the bean.
const seamGeometry = new TorusGeometry(0.52, 0.02, 8, 32, (Math.PI * 2) / 3);

// Roast browns + gold accent (3D material palette per spec, not UI tokens).
// Clearcoat = the oily sheen of a fresh roast; without it the beans read as
// matte clay against the dark background. Colors lifted 1–2 stops above the
// page background so the silhouettes separate.
const beanMaterials = [
  new MeshPhysicalMaterial({ color: '#4a2c16', roughness: 0.45, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
  new MeshPhysicalMaterial({ color: '#5d3a20', roughness: 0.5, metalness: 0.06, clearcoat: 0.55, clearcoatRoughness: 0.3 }),
  new MeshPhysicalMaterial({ color: '#6e4527', roughness: 0.42, metalness: 0.05, clearcoat: 0.65, clearcoatRoughness: 0.22 }),
  new MeshPhysicalMaterial({ color: '#7d5130', roughness: 0.38, metalness: 0.08, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
  new MeshPhysicalMaterial({ color: '#d8ab6b', roughness: 0.3, metalness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
];

const seamMaterial = new MeshStandardMaterial({ color: '#241710', roughness: 0.9 });

/* ------------------------------------------------------------------ */
/* Bean field layout — hand-placed, biased right + screen edges so the */
/* headline (center-left) stays clear. z spread −3…2 for depth + fog.  */
/* ------------------------------------------------------------------ */

interface BeanSpec {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  material: number;
}

const BEANS: BeanSpec[] = [
  { position: [2.6, 1.4, 0.6], rotation: [0.4, 0.8, 0.2], scale: 1.2, material: 0 },
  { position: [4.1, -0.6, 0.2], rotation: [1.9, 0.3, 0.7], scale: 1.0, material: 1 },
  { position: [1.8, -1.7, 1.4], rotation: [0.7, 2.1, 0.4], scale: 1.3, material: 2 },
  { position: [3.3, 2.3, -1.2], rotation: [2.4, 1.1, 1.6], scale: 0.9, material: 3 },
  { position: [5.2, 1.1, -2.2], rotation: [0.2, 1.5, 2.3], scale: 0.95, material: 0 },
  { position: [2.2, 0.3, -0.8], rotation: [1.2, 2.6, 0.9], scale: 0.7, material: 4 }, // gold
  { position: [4.6, -2.1, -1.6], rotation: [2.8, 0.5, 1.1], scale: 1.05, material: 1 },
  { position: [0.9, 2.6, -2.6], rotation: [0.9, 1.8, 2.7], scale: 0.8, material: 2 },
  { position: [-1.2, 3.1, -2.9], rotation: [1.6, 0.2, 0.5], scale: 0.75, material: 3 },
  { position: [-4.9, 2.4, -1.8], rotation: [0.5, 2.9, 1.4], scale: 0.85, material: 0 },
  { position: [-5.6, -1.9, -2.4], rotation: [2.1, 1.3, 0.3], scale: 0.9, material: 1 },
  { position: [-3.1, -2.9, -1.1], rotation: [1.4, 0.7, 2.0], scale: 0.65, material: 2 },
  { position: [6.3, 0.2, -3.0], rotation: [0.8, 2.2, 1.8], scale: 1.0, material: 3 },
  { position: [0.4, -2.5, 0.9], rotation: [2.6, 1.0, 0.6], scale: 0.6, material: 4 }, // gold
  { position: [-0.4, 2.1, 1.6], rotation: [0.3, 1.6, 2.5], scale: 0.55, material: 0 },
  { position: [3.0, -3.0, -2.8], rotation: [1.1, 2.4, 1.2], scale: 0.95, material: 1 },
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

function BeanField({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<Group>(null);
  // Tracked on `window` (not Canvas events) so it works with DOM overlaid
  // on top of the hero; normalized to −1…1.
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (reduced || !group) return;
    const scroll = window.scrollY;
    const targetY = pointer.current.x * 0.16 + scroll * 0.00012;
    const targetX = pointer.current.y * 0.09 + scroll * 0.00035;
    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 2.4, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 2.4, delta);
  });

  return (
    <group ref={groupRef}>
      {BEANS.map((bean, i) => (
        <Float
          key={`${bean.position[0]}-${bean.position[1]}-${bean.position[2]}`}
          enabled={!reduced}
          speed={0.55 + ((i * 7) % 5) * 0.16}
          rotationIntensity={0.2 + ((i * 3) % 4) * 0.12}
          floatIntensity={0.4 + ((i * 5) % 4) * 0.2}
          floatingRange={[-0.14, 0.14]}
        >
          <group position={bean.position} rotation={bean.rotation} scale={bean.scale}>
            <mesh
              geometry={beanGeometry}
              material={beanMaterials[bean.material]}
              scale={[1, 0.62, 0.5]}
            />
            <mesh
              geometry={seamGeometry}
              material={seamMaterial}
              position={[0, 0, -0.26]}
              rotation={[Math.PI / 2, 0, Math.PI / 6]}
            />
          </group>
        </Float>
      ))}
    </group>
  );
}

/**
 * Pole unoszących się ziaren kawy — tło hero na stronie głównej.
 * Mount via `next/dynamic` with `ssr: false` inside a client wrapper;
 * size it from outside (e.g. `className="absolute inset-0"`).
 */
export function HeroScene({ className }: HeroSceneProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        {/* Camera sits at z 9, beans at z −3…2 (7–12 away) — fog must start
            past the nearest beans or the whole field drowns in background. */}
        <fog attach="fog" args={['#120d0a', 11, 21]} />
        <ambientLight intensity={0.35} />
        {/* soft warm key */}
        <directionalLight position={[4, 5, 6]} intensity={1.6} color="#f3e9d7" />
        {/* gold rim from back-left */}
        <directionalLight position={[-6, 3, -4]} intensity={2.6} color="#c99a5f" />
        {/* warm glow behind the right-side cluster — separates beans from bg */}
        <pointLight position={[3.5, -1, -4]} intensity={18} distance={14} decay={2} color="#e0b070" />
        <BeanField reduced={reduced} />
      </Canvas>
    </div>
  );
}

export default HeroScene;
