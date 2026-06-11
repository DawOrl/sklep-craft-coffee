import { Suspense } from "react";
import type { Metadata } from "next";

import SplitHeading from "@/components/motion/SplitHeading";
import ShopBrowser from "@/components/shop/ShopBrowser";
import Container from "@/components/ui/Container";
import { products } from "@/data/products";

export const metadata: Metadata = { title: "Sklep" };

/**
 * Static placeholder rendered while the client browser island
 * (useSearchParams → Suspense REQUIRED) streams in.
 */
function BrowserFallback() {
  return (
    <div aria-hidden="true">
      <div className="border-line border-y py-7">
        <div className="bg-roast h-10 w-full max-w-2xl animate-pulse rounded-full motion-reduce:animate-none" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="border-line bg-roast aspect-4/5 animate-pulse rounded-2xl border motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}

export default function SklepPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <Container>
        {/* Hero strip */}
        <header className="max-w-3xl">
          <p className="text-gold mb-4 font-mono text-[11px] uppercase tracking-[0.2em]">
            Katalog
          </p>
          <SplitHeading
            as="h1"
            className="font-display text-crema text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] font-light tracking-tight"
          >
            Nasze kawy
          </SplitHeading>
          <p className="text-latte mt-5 max-w-xl text-base leading-relaxed md:text-lg">
            Dziesięć kaw, jeden standard — świeży wypał w małych seriach.
            Filtruj według palenia i rodzaju, a resztę zostaw ziarnu.
          </p>
        </header>

        <div className="mt-12 md:mt-16">
          <Suspense fallback={<BrowserFallback />}>
            <ShopBrowser products={products} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
