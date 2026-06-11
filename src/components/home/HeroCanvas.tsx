"use client";

import dynamic from "next/dynamic";

// Fallback imported from its own light module so the three.js chunk
// is NOT pulled into the initial bundle (see note in that file).
import HeroSceneFallback from "@/components/three/HeroSceneFallback";

// `ssr: false` is only allowed inside Client Components (Next 16) —
// this small wrapper exists exactly for that.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <HeroSceneFallback className="absolute inset-0" />,
});

interface HeroCanvasProps {
  className?: string;
}

/** Client wrapper mounting the 3D bean field strictly on the client. */
export function HeroCanvas({ className }: HeroCanvasProps) {
  return (
    <div className={className} aria-hidden="true">
      <HeroScene className="h-full w-full" />
    </div>
  );
}

export default HeroCanvas;
