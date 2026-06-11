"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

import { gsap, ScrollTrigger } from "./gsap";

// Active Lenis instance (module ref). Modal layers (CartDrawer, mobile menu)
// call getLenis()?.stop()/start() so smooth scrolling cannot bypass their
// scroll lock; null for reduced-motion users (native scroll).
let activeLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return activeLenis;
}

/**
 * Lenis smooth-scroll provider, mounted once in the root layout.
 * Drives ScrollTrigger.update from Lenis and Lenis from gsap.ticker.
 * Disabled entirely for prefers-reduced-motion users (native scroll).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    activeLenis = lenis;
    const unsubscribe = lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker time is in seconds, lenis.raf expects milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      unsubscribe();
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP default
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
