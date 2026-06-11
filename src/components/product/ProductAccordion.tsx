import Link from "next/link";
import type { ReactNode } from "react";

import type { Product } from "@/data/products";

const PROCESS_LABELS: Record<NonNullable<Product["process"]>, string> = {
  washed: "mokra (washed)",
  natural: "sucha (natural)",
  honey: "honey",
};

function originBody(product: Product): string {
  if (product.kind === "mieszanka") {
    return `Mieszanka ziaren: ${product.origin}. Każdy komponent palimy osobno i łączymy dopiero po wypale — tak pilnujemy powtarzalności profilu. Od wypału do wysyłki mijają maksymalnie 48 godzin.`;
  }
  const sentences = [
    `Single origin: ${product.origin}${product.region ? `, region ${product.region}` : ""}.`,
  ];
  if (product.process) {
    sentences.push(`Obróbka ${PROCESS_LABELS[product.process]}.`);
  }
  if (product.altitudeMasl) {
    sentences.push(
      `Uprawa na wysokości około ${product.altitudeMasl} m n.p.m.`,
    );
  }
  sentences.push(
    "Palimy w małych seriach — od wypału do wysyłki mijają maksymalnie 48 godzin.",
  );
  return sentences.join(" ");
}

function brewBody(roast: Product["roast"]): string {
  switch (roast) {
    case "jasne":
      return "Najlepiej pokazuje się w metodach przelewowych — V60, Chemex albo Aeropress. Zacznij od 6 g kawy na 100 ml wody o temperaturze 92–94°C i miel tuż przed parzeniem.";
    case "średnie":
      return "Kawa uniwersalna — zaparzysz ją dripem, w kawiarce i w ekspresie ciśnieniowym. Zacznij od 6 g na 100 ml wody w przelewie albo od przelicznika 1:2 w espresso, a potem dostosuj do swojego smaku.";
    case "ciemne":
      return "Stworzona do espresso i french pressa. W espresso zacznij od przelicznika 1:2 i 25–28 sekund ekstrakcji, w prasie daj jej pełne cztery minuty. Mleko bardzo ją lubi.";
  }
}

interface ProductAccordionProps {
  product: Product;
  className?: string;
}

/** Native details/summary accordion: pochodzenie, parzenie, dostawa. */
export function ProductAccordion({ product, className }: ProductAccordionProps) {
  const items: { title: string; body: ReactNode }[] = [
    { title: "Pochodzenie i proces", body: originBody(product) },
    { title: "Jak parzyć", body: brewBody(product.roast) },
    {
      title: "Dostawa i zwroty",
      body: (
        <>
          Paczka opuszcza palarnię najpóźniej 48 godzin od wypału, od
          poniedziałku do piątku. InPost Paczkomat 12,99 zł, kurier 16,99 zł,
          a od 149 zł dostawa jest darmowa. Nieotwarte opakowanie możesz
          zwrócić w ciągu 14 dni.
          Szczegóły znajdziesz na stronie{" "}
          <Link
            href="/dostawa-i-zwroty"
            className="text-gold hover:text-gold-soft underline underline-offset-4 transition-colors duration-200 motion-reduce:transition-none"
          >
            Dostawa i zwroty
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <div className={className}>
      {items.map((item, index) => (
        <details
          key={item.title}
          className={`group border-line border-b ${index === 0 ? "border-t" : ""}`}
        >
          <summary className="text-crema hover:text-gold flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 select-none motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden="true"
              className="text-gold text-sm transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <div className="text-latte pb-6 text-sm leading-relaxed">
            {item.body}
          </div>
        </details>
      ))}
    </div>
  );
}

export default ProductAccordion;
