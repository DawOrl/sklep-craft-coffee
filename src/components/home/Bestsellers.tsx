import Link from "next/link";
import { ViewTransition } from "react";

import ProductBagArt from "@/components/art/ProductBagArt";
import Reveal from "@/components/motion/Reveal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Price from "@/components/ui/Price";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBestsellers, type Product } from "@/data/products";

/** Asymmetric editorial placement for the 4 numbered cards. */
const CARD_LAYOUT: { wrapper: string; art: string }[] = [
  { wrapper: "md:col-span-7", art: "aspect-[5/4]" },
  { wrapper: "md:col-span-5 md:mt-28", art: "aspect-[4/5]" },
  { wrapper: "md:col-span-5 md:-mt-12", art: "aspect-[4/5]" },
  { wrapper: "md:col-span-7 md:mt-16", art: "aspect-[5/4]" },
];

interface BestsellerCardProps {
  product: Product;
  index: number;
}

function BestsellerCard({ product, index }: BestsellerCardProps) {
  const layout = CARD_LAYOUT[index % CARD_LAYOUT.length];
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={index * 0.08} className={layout.wrapper}>
      <Link
        href={`/sklep/${product.slug}`}
        className="group block"
        aria-label={`${product.name} — zobacz produkt`}
      >
        {/* art surface */}
        <div className="bg-roast border-line group-hover:border-gold/40 group-hover:bg-roast-2 relative overflow-hidden rounded-2xl border transition-colors duration-500 motion-reduce:transition-none">
          <span
            aria-hidden="true"
            className="text-latte absolute top-5 left-6 font-mono text-xs tracking-[0.2em]"
          >
            {number} — {product.origin.toUpperCase()}
          </span>
          {product.badges?.[0] && (
            <Badge className="bg-espresso/60 absolute top-4 right-4 backdrop-blur-sm">
              {product.badges[0]}
            </Badge>
          )}

          {/* shared-element morph target for /sklep/[slug] */}
          <ViewTransition name={`vt-product-${product.slug}`}>
            <div
              className={`flex items-center justify-center px-10 py-12 md:px-14 ${layout.art}`}
            >
              <ProductBagArt
                product={product}
                className="h-full w-full transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:scale-[1.02]"
              />
            </div>
          </ViewTransition>
        </div>

        {/* meta row */}
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <div>
            <h3 className="font-display text-crema group-hover:text-gold-soft text-2xl font-light tracking-tight transition-colors duration-300 md:text-3xl">
              {product.name}
            </h3>
            <p className="text-latte mt-2 font-mono text-[11px] uppercase tracking-[0.2em]">
              {product.notes.join(" • ")}
            </p>
          </div>
          <p className="shrink-0 text-right">
            <span className="text-latte mr-2 font-mono text-[11px] uppercase tracking-[0.2em]">
              od
            </span>
            <Price
              cents={product.variants[0].priceCents}
              className="text-crema text-xl md:text-2xl"
            />
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

/**
 * Section 3 — bestsellers in an asymmetric, numbered editorial grid.
 * Server component; cards link to /sklep/[slug] and carry the
 * vt-product-<slug> view-transition name on the art wrapper.
 */
export function Bestsellers() {
  const bestsellers = getBestsellers();

  return (
    <section className="overflow-hidden py-24 md:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="01 — Bestsellery"
            title={
              <>
                Najczęściej <em>wybierane</em>
              </>
            }
            description="Cztery wypały, które schodzą z półek najszybciej. Sprawdzone profile — dobre na początek przygody ze specialty i na co dzień."
          />
          <Reveal delay={0.2} className="hidden md:block">
            <Button variant="outline" href="/sklep">
              Zobacz wszystkie
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 md:mt-24 md:grid-cols-12 md:gap-y-0">
          {bestsellers.map((product, index) => (
            <BestsellerCard key={product.slug} product={product} index={index} />
          ))}
        </div>

        <Reveal className="mt-16 text-center md:hidden">
          <Button variant="outline" href="/sklep">
            Zobacz wszystkie kawy
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

export default Bestsellers;
