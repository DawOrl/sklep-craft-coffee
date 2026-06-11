import { formatPrice } from "@/lib/format";

interface PriceProps {
  /** Price in grosze (cents), e.g. 4900 → "49,00 zł". */
  cents: number;
  className?: string;
}

/** Formatted PLN price set in Fraunces (font-display). */
export function Price({ cents, className }: PriceProps) {
  return (
    <span className={`font-display tabular-nums ${className ?? ""}`}>
      {formatPrice(cents)}
    </span>
  );
}

export default Price;
