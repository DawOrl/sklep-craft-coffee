import Link from "next/link";
import { ViewTransition } from "react";

import ProductBagArt from "@/components/art/ProductBagArt";
import Reveal from "@/components/motion/Reveal";
import Price from "@/components/ui/Price";
import type { Product } from "@/data/products";

interface RelatedCardProps {
  product: Product;
  /** Reveal stagger delay in seconds. */
  delay?: number;
}

/**
 * Simple editorial card for the "Podobne kawy" section.
 * The bag-art wrapper carries vt-product-<slug> so navigating to the
 * linked product morphs into its hero (view-transition contract, §4).
 */
export function RelatedCard({ product, delay = 0 }: RelatedCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/sklep/${product.slug}`}
        className="group bg-roast border-line hover:bg-roast-2 hover:border-gold/40 flex h-full flex-col rounded-2xl border p-6 transition-colors duration-300 motion-reduce:transition-none"
      >
        <div className="text-latte flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>{product.origin}</span>
          <span>{product.roast}</span>
        </div>
        <div className="mt-6 px-8 sm:px-12 md:px-8">
          <ViewTransition name={`vt-product-${product.slug}`}>
            <div>
              <ProductBagArt
                product={product}
                className="h-auto w-full transition-transform duration-500 motion-safe:group-hover:-translate-y-2"
              />
            </div>
          </ViewTransition>
        </div>
        <div className="mt-6 flex flex-1 items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-crema group-hover:text-gold-soft text-xl transition-colors duration-300 motion-reduce:transition-none">
              {product.name}
            </h3>
            <p className="text-latte mt-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              {product.notes.join(" • ")}
            </p>
          </div>
          <Price
            cents={product.variants[0]?.priceCents ?? 0}
            className="text-crema text-lg whitespace-nowrap"
          />
        </div>
      </Link>
    </Reveal>
  );
}

export default RelatedCard;
