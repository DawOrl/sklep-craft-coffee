interface RatingStarsProps {
  /** Rating 4.5–5.0 per data contract. */
  rating: number;
  className?: string;
}

const STARS = "★★★★★";

/** Gold star row with partial fill + mono numeric rating. */
export function RatingStars({ rating, className }: RatingStarsProps) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  const formatted = rating.toFixed(1).replace(".", ",");

  return (
    <div
      className={`flex items-center gap-3 ${className ?? ""}`}
      role="img"
      aria-label={`Ocena ${formatted} na 5`}
    >
      <span className="relative inline-block text-sm leading-none tracking-[0.2em]">
        <span aria-hidden="true" className="text-line">
          {STARS}
        </span>
        <span
          aria-hidden="true"
          className="text-gold absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${percent}%` }}
        >
          {STARS}
        </span>
      </span>
      <span aria-hidden="true" className="text-latte font-mono text-xs tabular-nums">
        {formatted} / 5
      </span>
    </div>
  );
}

export default RatingStars;
