"use client";

import { type ReactNode, useRef } from "react";

import { gsap, SplitText, useIsomorphicLayoutEffect } from "./gsap";

interface SplitHeadingProps {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
  /** Delay in seconds. */
  delay?: number;
}

/**
 * Headline split into lines; each line rises from an overflow mask
 * (y: 110% → 0, staggered). Re-splits on font load / resize (autoSplit).
 * Italic <em> accent words inside headlines are always gold (site-wide rule).
 */
export function SplitHeading({
  as: Tag = "h2",
  className,
  children,
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.05,
            ease: "power3.out",
            stagger: 0.08,
            delay,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }),
      });
      return () => split.revert();
    });

    return () => mm.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={`[&_em]:text-gold [&_em]:italic ${className ?? ""}`}>
      {children}
    </Tag>
  );
}

export default SplitHeading;
