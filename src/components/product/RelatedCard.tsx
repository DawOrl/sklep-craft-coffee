import Link from "next/link";
import { ViewTransition } from "react";

import ProductPhoto from "@/components/art/ProductPhoto";
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
        className="group bg-roast border-line hover:border-gold/40 flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-300 motion-reduce:transition-none"
      >
        <div className="relative">
          <div className="text-crema/80 absolute inset-x-5 top-5 z-10 flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>{product.origin}</span>
            <span>{product.roast}</span>
          </div>
          <ViewTransition name={`vt-product-${product.slug}`}>
            <div className="aspect-[4/5] overflow-hidden">
              <ProductPhoto
                slug={product.slug}
                name={product.name}
                sizes="(min-width: 768px) 30vw, 92vw"
                className="transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
              />
            </div>
          </ViewTransition>
        </div>
        <div className="border-line flex flex-1 items-end justify-between gap-4 border-t p-5">
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
