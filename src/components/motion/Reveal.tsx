"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { gsap } from "./gsap";

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds. */
  delay?: number;
  className?: string;
  /** Initial vertical offset in px (default 32, per DESIGN.md). */
  y?: number;
}

/** Slide-up + fade reveal on scroll (once, at 85% viewport). */
export function Reveal({ children, delay = 0, className, y = 32 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { y, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });

    return () => mm.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default Reveal;
