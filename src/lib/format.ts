const PLN = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

/** Formats price in grosze (cents) to Polish złoty, e.g. 4900 → "49,00 zł". */
export function formatPrice(cents: number): string {
  return PLN.format(cents / 100);
}
