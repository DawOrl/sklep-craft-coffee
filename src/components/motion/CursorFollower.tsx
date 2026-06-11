"use client";

import { useEffect, useRef } from "react";

import { gsap } from "./gsap";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, select, textarea, label, summary, [data-cursor='hover']";

/**
 * Custom cursor: 8px gold dot (instant) + 36px ring (lerp 0.15),
 * mix-blend-difference. Ring grows over interactive elements.
 * Hidden on touch devices and under prefers-reduced-motion.
 * Mounted once in the root layout.
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const target = { ...pos };
        let visible = false;

        const dotX = gsap.quickSetter(dot, "x", "px") as (v: number) => void;
        const dotY = gsap.quickSetter(dot, "y", "px") as (v: number) => void;
        const ringX = gsap.quickSetter(ring, "x", "px") as (v: number) => void;
        const ringY = gsap.quickSetter(ring, "y", "px") as (v: number) => void;

        const tick = () => {
          pos.x += (target.x - pos.x) * 0.15;
          pos.y += (target.y - pos.y) * 0.15;
          ringX(pos.x);
          ringY(pos.y);
        };
        gsap.ticker.add(tick);

        const onMove = (e: MouseEvent) => {
          target.x = e.clientX;
          target.y = e.clientY;
          dotX(target.x);
          dotY(target.y);
          if (!visible) {
            visible = true;
            pos.x = target.x;
            pos.y = target.y;
            gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
          }
        };

        const onOver = (e: MouseEvent) => {
          const t = e.target as Element | null;
          const interactive = !!t?.closest?.(INTERACTIVE_SELECTOR);
          gsap.to(ring, {
            scale: interactive ? 1.6 : 1,
            duration: 0.3,
            ease: "power3.out",
          });
        };

        const onLeaveDoc = () => {
          visible = false;
          gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 });
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseover", onOver, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeaveDoc);

        return () => {
          gsap.ticker.remove(tick);
          window.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseover", onOver);
          document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 mix-blend-difference"
    >
      <div
        ref={ringRef}
        className="border-gold absolute top-0 left-0 h-9 w-9 rounded-full border opacity-0"
      />
      <div
        ref={dotRef}
        className="bg-gold absolute top-0 left-0 h-2 w-2 rounded-full opacity-0"
      />
    </div>
  );
}

export default CursorFollower;
