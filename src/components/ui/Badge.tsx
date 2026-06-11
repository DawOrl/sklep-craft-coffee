import type { ReactNode } from "react";

type BadgeTone = "gold" | "ember";

interface BadgeProps {
  children: ReactNode;
  /**
   * Explicit tone override. When omitted and children is a string,
   * the tone is inferred: "nowość"/"limitowana" → ember, otherwise gold.
   */
  tone?: BadgeTone;
  className?: string;
}

const TONES: Record<BadgeTone, string> = {
  gold: "border-gold/60 text-gold",
  ember: "border-ember/70 text-ember",
};

/** Mono uppercase label badge per DESIGN.md §5. */
export function Badge({ children, tone, className }: BadgeProps) {
  const inferred: BadgeTone =
    typeof children === "string" &&
    ["nowość", "limitowana"].includes(children.toLowerCase())
      ? "ember"
      : "gold";
  const resolved = tone ?? inferred;

  return (
    <span
      className={`bg-espresso/60 inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${TONES[resolved]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export default Badge;
