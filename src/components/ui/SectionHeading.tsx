import type { ReactNode } from "react";

import SplitHeading from "@/components/motion/SplitHeading";

interface SectionHeadingProps {
  /** Mono gold uppercase eyebrow, e.g. "01 — BESTSELLERY". */
  eyebrow?: string;
  /** Serif title; may contain <em> for italic accent words. */
  title: ReactNode;
  description?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow + serif SplitHeading title + optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as = "h2",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className ?? ""}`}
    >
      {eyebrow && (
        <p className="text-gold mb-4 font-mono text-[11px] uppercase tracking-[0.2em]">
          {eyebrow}
        </p>
      )}
      <SplitHeading
        as={as}
        className="font-display text-crema text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-light tracking-tight"
      >
        {title}
      </SplitHeading>
      {description && (
        <p className="text-latte mt-5 text-base leading-relaxed md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
