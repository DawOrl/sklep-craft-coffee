import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** One full loop duration in seconds (default 28). */
  speed?: number;
  className?: string;
}

/**
 * Pure-CSS marquee: content duplicated, track translates −50%.
 * Animation is disabled under prefers-reduced-motion (globals.css).
 * Server component — no JS shipped.
 */
export function Marquee({ children, speed = 28, className }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div
        className="animate-marquee flex w-max will-change-transform"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
