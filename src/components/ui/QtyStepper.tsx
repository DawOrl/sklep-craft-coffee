"use client";

interface QtyStepperProps {
  value: number;
  onChange: (qty: number) => void;
  /** Minimum quantity (default 1). */
  min?: number;
  /** Maximum quantity (default 99). */
  max?: number;
  size?: "sm" | "md";
  className?: string;
  /** Accessible context, e.g. the product name. */
  label?: string;
}

/** − / qty / + stepper, border-line, mono (DESIGN.md §5). */
export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
  label,
}: QtyStepperProps) {
  const height = size === "sm" ? "h-8" : "h-11";
  const btn =
    "flex h-full w-8 items-center justify-center text-latte transition-colors duration-200 motion-reduce:transition-none hover:text-gold disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      role="group"
      aria-label={label ? `Ilość — ${label}` : "Ilość"}
      className={`border-line inline-flex items-stretch rounded-full border font-mono text-sm ${height} ${className ?? ""}`}
    >
      <button
        type="button"
        className={`${btn} pl-1`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Zmniejsz ilość"
      >
        −
      </button>
      <span
        className="text-crema flex min-w-8 items-center justify-center px-1 tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={`${btn} pr-1`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Zwiększ ilość"
      >
        +
      </button>
    </div>
  );
}

export default QtyStepper;
