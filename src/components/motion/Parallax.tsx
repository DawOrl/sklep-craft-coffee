"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { gsap } from "./gsap";

interface ParallaxProps {
  children: ReactNode;
  /**
   * Multiplier of the base ±12 yPercent drift (default 1).
   * Negative values invert direction.
   */
  speed?: number;
  className?: string;
}

/** Scrub-linked vertical parallax: yPercent −12·speed → +12·speed. */
export function Parallax({ children, speed = 1, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { yPercent: -12 * speed },
        {
          yPercent: 12 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default Parallax;
