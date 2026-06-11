"use client";

import Link from "next/link";
import { ViewTransition } from "react";

import ProductBagArt from "@/components/art/ProductBagArt";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Price from "@/components/ui/Price";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
}

/**
 * Catalog card: bag art on a roast tile (view-transition wrapper), badges,
 * serif name, tasting notes, base price and mono rating. Hover: subtle lift,
 * art scale, gold border and a quick-add button (default 250 g / ziarna).
 * The quick-add button is a SIBLING of the link — no nested interactives.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const baseVariant = product.variants[0];
  const rating = product.rating.toFixed(1).replace(".", ",");

  return (
    <article className="group relative h-full transition-transform duration-500 ease-out hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        href={`/sklep/${product.slug}`}
        className="border-line bg-roast group-hover:border-gold/40 group-hover:bg-roast-2 flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-500 motion-reduce:transition-none"
      >
        {/* Art tile */}
        <div className="relative px-8 pt-10 pb-6">
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <Badge key={badge}>{badge}</Badge>
              ))}
            </div>
          )}
          <ViewTransition name={`vt-product-${product.slug}`}>
            <div className="mx-auto w-full max-w-44">
              <ProductBagArt
                product={product}
                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </ViewTransition>
        </div>

        {/* Meta */}
        <div className="border-line flex flex-1 flex-col gap-2 border-t p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-crema text-xl">{product.name}</h3>
            <span
              role="img"
              className="text-latte shrink-0 font-mono text-[11px] tracking-[0.15em]"
              aria-label={`Ocena ${rating} na 5`}
            >
              ★ {rating}
            </span>
          </div>
          <p className="text-latte font-mono text-[10px] uppercase tracking-[0.2em]">
            {product.notes.join(" • ")}
          </p>
          <p className="mt-auto pt-3 pr-24">
            <Price cents={baseVariant.priceCents} className="text-crema text-lg" />
            <span className="text-latte ml-2 font-mono text-[10px] uppercase tracking-[0.2em]">
              / 250 g
            </span>
          </p>
        </div>
      </Link>

      {/* Quick add — appears on hover/focus; always visible on touch. */}
      <div className="pointer-events-none absolute right-4 bottom-4 translate-y-2 opacity-0 transition-[opacity,transform] duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 pointer-coarse:pointer-events-auto pointer-coarse:translate-y-0 pointer-coarse:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
        <Button
          size="sm"
          onClick={() => add(product, { weight: 250, grind: "ziarna" })}
          aria-label={`Dodaj ${product.name} do koszyka — 250 g, ziarna`}
        >
          Dodaj
        </Button>
      </div>
    </article>
  );
}

export default ProductCard;
