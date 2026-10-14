import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import ProductPhoto from "@/components/art/ProductPhoto";
import Reveal from "@/components/motion/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductConfigurator from "@/components/product/ProductConfigurator";
import RatingStars from "@/components/product/RatingStars";
import RelatedCard from "@/components/product/RelatedCard";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProduct, products, type Product } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const PROCESS_LABELS: Record<NonNullable<Product["process"]>, string> = {
  washed: "mokry (washed)",
  natural: "suchy (natural)",
  honey: "honey",
};

export function generateStaticParams(): { slug: string }[] {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return { title: "Nie znaleziono" };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

/**
 * First sentence of a paragraph (abbreviation dots are not followed by a
 * space). Operates on a single paragraph so the pull-quote slice below can
 * never span a paragraph boundary.
 */
function firstSentence(paragraph: string): string {
  const index = paragraph.indexOf(". ");
  return index === -1 ? paragraph : paragraph.slice(0, index + 1);
}

/** 3 related coffees: same roast first, then top-rated others as fallback. */
function getRelated(product: Product): Product[] {
  const others = products.filter((p) => p.slug !== product.slug);
  const sameRoast = others.filter((p) => p.roast === product.roast);
  const rest = others
    .filter((p) => p.roast !== product.roast)
    .sort((a, b) => b.rating - a.rating);
  return [...sameRoast, ...rest].slice(0, 3);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    notFound();
  }

  const related = getRelated(product);

  const [firstParagraph = "", ...restParagraphs] = product.story.split("\n\n");
  const pullQuote = firstSentence(firstParagraph);
  const storyParagraphs = [
    firstParagraph.slice(pullQuote.length).trim(),
    ...restParagraphs,
  ].filter(Boolean);

  const specs: [string, string][] = [
    ["Region", product.region ?? product.origin],
    ...(product.process
      ? ([["Proces", PROCESS_LABELS[product.process]]] as [string, string][])
      : []),
    ...(product.altitudeMasl
      ? ([["Wysokość", `${product.altitudeMasl} m n.p.m.`]] as [
          string,
          string,
        ][])
      : []),
    ["Palenie", product.roast],
    ["Skład", "100% arabica"],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: "Craft Coffee" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PLN",
      price: ((product.variants[0]?.priceCents ?? 0) / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: 5,
      reviewCount: Math.round(product.rating * 31),
    },
  };

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Ścieżka nawigacji"
          className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          <ol className="flex flex-wrap items-center gap-3">
            <li>
              <Link
                href="/sklep"
                className="hover:text-gold transition-colors duration-200 motion-reduce:transition-none"
              >
                Sklep
              </Link>
            </li>
            <li aria-hidden="true" className="text-line">
              /
            </li>
            <li aria-current="page" className="text-crema">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Hero: art + sticky info */}
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="border-line bg-roast relative overflow-hidden rounded-2xl border lg:sticky lg:top-28 lg:self-start">
            <p className="text-crema/80 pointer-events-none absolute top-6 left-6 z-10 font-mono text-[11px] uppercase tracking-[0.2em]">
              {product.origin}
            </p>
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-6 right-6 z-10 flex flex-wrap justify-end gap-2">
                {product.badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>
            )}
            <ViewTransition name={`vt-product-${product.slug}`}>
              <div className="aspect-[4/5]">
                <ProductPhoto
                  slug={product.slug}
                  name={product.name}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  preload
                />
              </div>
            </ViewTransition>
          </div>

          <div>
            <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
              {product.origin}
              {product.region ? ` / ${product.region}` : ""}
            </p>
            <SplitHeading
              as="h1"
              className="font-display text-crema mt-4 text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] font-light tracking-tight"
            >
              {product.name}
            </SplitHeading>
            <RatingStars rating={product.rating} className="mt-5" />
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Nuty smakowe">
              {product.notes.map((note) => (
                <li
                  key={note}
                  className="border-line text-latte rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]"
                >
                  {note}
                </li>
              ))}
            </ul>
            <p className="text-latte mt-6 text-base leading-relaxed md:text-lg">
              {product.description}
            </p>

            <div className="mt-8">
              <ProductConfigurator product={product} />
            </div>

            <ProductAccordion product={product} className="mt-10" />
          </div>
        </div>

        {/* Story + spec table */}
        <section
          aria-label="Historia tej kawy"
          className="border-line mt-24 border-t pt-16 md:mt-32 md:pt-20"
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                Historia tej kawy
              </p>
              <Reveal className="mt-6">
                <blockquote className="font-display text-crema text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.2] font-light italic">
                  {pullQuote}
                </blockquote>
              </Reveal>
              <div className="mt-10 max-w-2xl space-y-6">
                {storyParagraphs.map((paragraph, index) => (
                  <Reveal key={paragraph.slice(0, 32)} delay={index * 0.06}>
                    <p className="text-latte text-base leading-relaxed">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="border-line bg-roast rounded-2xl border p-6 md:p-8">
                  <h2 className="text-gold font-mono text-[11px] uppercase tracking-[0.2em]">
                    Specyfikacja
                  </h2>
                  <dl className="mt-4 font-mono text-xs">
                    {specs.map(([label, value], index) => (
                      <div
                        key={label}
                        className={`border-line flex items-baseline justify-between gap-6 py-4 ${index > 0 ? "border-t" : ""}`}
                      >
                        <dt className="text-latte uppercase tracking-[0.2em]">
                          {label}
                        </dt>
                        <dd className="text-crema text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section aria-label="Podobne kawy" className="mt-24 md:mt-32">
            <SectionHeading
              eyebrow="Dobrane pod ten profil"
              title={
                <>
                  Podobne <em>kawy</em>
                </>
              }
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((p, index) => (
                <RelatedCard key={p.slug} product={p} delay={index * 0.08} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
