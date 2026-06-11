"use client";

import { useEffect, useRef } from "react";

import { gsap } from "./gsap";

interface CounterProps {
  /** Target value, e.g. 48 or 4.9 (decimals preserved). */
  to: number;
  /** Rendered after the number, e.g. "h", "%", "+". */
  suffix?: string;
  className?: string;
  /** Animation duration in seconds (default 1.6). */
  duration?: number;
}

function decimalsOf(value: number): number {
  if (Number.isInteger(value)) return 0;
  return Math.min((String(value).split(".")[1] ?? "").length, 2);
}

/** Mono count-up on viewport enter. Reduced motion → static final value. */
export function Counter({ to, suffix = "", className, duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const decimals = decimalsOf(to);
    const fmt = (v: number) =>
      v.toLocaleString("pl-PL", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(state, {
        v: to,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = fmt(state.v);
        },
      });
      return () => {
        el.textContent = fmt(to);
      };
    });

    return () => mm.revert();
  }, [to, duration]);

  const decimals = decimalsOf(to);

  return (
    <span className={`font-mono tabular-nums ${className ?? ""}`}>
      <span ref={ref}>
        {to.toLocaleString("pl-PL", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </span>
      {suffix}
    </span>
  );
}

export default Counter;
