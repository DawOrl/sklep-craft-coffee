"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { gsap } from "./gsap";

interface MagneticProps {
  children: ReactNode;
  /** Pull strength (default 0.35 per DESIGN.md). */
  strength?: number;
  className?: string;
}

/**
 * Magnetic hover wrapper — content is pulled toward the cursor.
 * Active only on `(hover: hover) and (pointer: fine)` without reduced motion.
 */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
        let rect: DOMRect | null = null;

        const onEnter = () => {
          rect = el.getBoundingClientRect();
        };
        const onMove = (e: MouseEvent) => {
          if (!rect) rect = el.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          rect = null;
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        };

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        };
      },
    );

    return () => mm.revert();
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </div>
  );
}

export default Magnetic;
