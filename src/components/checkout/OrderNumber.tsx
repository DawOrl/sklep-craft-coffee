"use client";

import { useSearchParams } from "next/navigation";

/**
 * Reads ?nr=CC-XXXXXX on the success page. Must be rendered inside
 * <Suspense> (useSearchParams on a statically rendered route).
 */
export function OrderNumber() {
  const searchParams = useSearchParams();
  const nr = searchParams.get("nr");

  return (
    <p className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]">
      Numer zamówienia <span className="text-gold">{nr ?? "brak"}</span>
    </p>
  );
}

export default OrderNumber;
