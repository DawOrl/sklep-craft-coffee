"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, type ReactNode, useCallback, useMemo } from "react";

import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import type { Grind, Product, Roast } from "@/data/products";

import ProductCard from "./ProductCard";

/* URL query param names (ASCII-safe values → clean, shareable URLs). */
const ROAST_PARAM = "palenie";
const KIND_PARAM = "rodzaj";
const GRIND_PARAM = "mielenie";
const SORT_PARAM = "sort";

const ROAST_OPTIONS: ReadonlyArray<{ value: string; label: string; roast: Roast }> = [
  { value: "jasne", label: "jasne", roast: "jasne" },
  { value: "srednie", label: "średnie", roast: "średnie" },
  { value: "ciemne", label: "ciemne", roast: "ciemne" },
];

const KIND_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
  kind: Product["kind"];
}> = [
  { value: "single-origin", label: "single origin", kind: "single origin" },
  { value: "mieszanka", label: "mieszanka", kind: "mieszanka" },
];

const GRIND_OPTIONS: ReadonlyArray<{ value: string; label: string; grind: Grind }> = [
  { value: "ziarna", label: "ziarna", grind: "ziarna" },
  { value: "drobno", label: "mielona drobno", grind: "mielona drobno" },
  { value: "grubo", label: "mielona grubo", grind: "mielona grubo" },
];

const SORT_OPTIONS = [
  { value: "polecane", label: "Polecane" },
  { value: "cena-rosnaco", label: "Cena rosnąco" },
  { value: "cena-malejaco", label: "Cena malejąco" },
  { value: "nazwa", label: "Nazwa A–Z" },
  { value: "ocena", label: "Ocena" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** Bestsellery first, rest in curated data order (stable sort). */
function recommendedRank(product: Product): number {
  return product.badges?.includes("bestseller") ? 0 : 1;
}

function sortProducts(list: Product[], sort: SortValue): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "cena-rosnaco":
      sorted.sort((a, b) => a.variants[0].priceCents - b.variants[0].priceCents);
      break;
    case "cena-malejaco":
      sorted.sort((a, b) => b.variants[0].priceCents - a.variants[0].priceCents);
      break;
    case "nazwa":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "pl"));
      break;
    case "ocena":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "polecane":
      sorted.sort((a, b) => recommendedRank(a) - recommendedRank(b));
      break;
  }
  return sorted;
}

/** Polish plural: 1 kawa, 2–4 kawy, 5+ kaw. */
function coffeeLabel(count: number): string {
  if (count === 1) return "kawa";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "kawy";
  return "kaw";
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-latte mb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 pointer-coarse:min-h-11 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 motion-reduce:transition-none ${
        active
          ? "border-gold bg-gold text-espresso"
          : "border-line text-latte hover:border-gold hover:text-crema"
      }`}
    >
      {children}
    </button>
  );
}

interface ShopBrowserProps {
  products: Product[];
}

/**
 * Client catalog browser: filter pills (palenie / rodzaj / mielenie) and a
 * sort select, all synced to URL query params via useSearchParams +
 * router.replace (no scroll) - filtered views are shareable links.
 */
export function ShopBrowser({ products }: ShopBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeRoast =
    ROAST_OPTIONS.find((option) => option.value === searchParams.get(ROAST_PARAM)) ?? null;
  const activeKind =
    KIND_OPTIONS.find((option) => option.value === searchParams.get(KIND_PARAM)) ?? null;
  const activeGrind =
    GRIND_OPTIONS.find((option) => option.value === searchParams.get(GRIND_PARAM)) ?? null;

  const sortParam = searchParams.get(SORT_PARAM);
  const sortValue: SortValue = SORT_OPTIONS.some((option) => option.value === sortParam)
    ? (sortParam as SortValue)
    : "polecane";

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const toggleParam = (name: string, value: string, isActive: boolean) =>
    replaceParams((params) => {
      if (isActive) params.delete(name);
      else params.set(name, value);
    });

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    replaceParams((params) => {
      if (value === "polecane") params.delete(SORT_PARAM);
      else params.set(SORT_PARAM, value);
    });
  };

  const clearFilters = () =>
    replaceParams((params) => {
      params.delete(ROAST_PARAM);
      params.delete(KIND_PARAM);
      params.delete(GRIND_PARAM);
    });

  const visible = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        (!activeRoast || product.roast === activeRoast.roast) &&
        (!activeKind || product.kind === activeKind.kind) &&
        (!activeGrind || product.grinds.includes(activeGrind.grind)),
    );
    return sortProducts(filtered, sortValue);
  }, [products, activeRoast, activeKind, activeGrind, sortValue]);

  const hasActiveFilters = Boolean(activeRoast || activeKind || activeGrind);

  return (
    <section aria-label="Katalog kaw">
      {/* Filter bar */}
      <div className="border-line flex flex-col gap-8 border-y py-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          <FilterGroup label="Palenie">
            {ROAST_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={activeRoast?.value === option.value}
                onClick={() =>
                  toggleParam(ROAST_PARAM, option.value, activeRoast?.value === option.value)
                }
              >
                {option.label}
              </FilterPill>
            ))}
          </FilterGroup>
          <FilterGroup label="Rodzaj">
            {KIND_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={activeKind?.value === option.value}
                onClick={() =>
                  toggleParam(KIND_PARAM, option.value, activeKind?.value === option.value)
                }
              >
                {option.label}
              </FilterPill>
            ))}
          </FilterGroup>
          <FilterGroup label="Mielenie">
            {GRIND_OPTIONS.map((option) => (
              <FilterPill
                key={option.value}
                active={activeGrind?.value === option.value}
                onClick={() =>
                  toggleParam(GRIND_PARAM, option.value, activeGrind?.value === option.value)
                }
              >
                {option.label}
              </FilterPill>
            ))}
          </FilterGroup>
        </div>

        <Select
          label="Sortowanie"
          value={sortValue}
          onChange={handleSortChange}
          className="w-full max-w-xs lg:w-56 lg:shrink-0"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Result count + clear */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p
          aria-live="polite"
          className="text-latte font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          {visible.length} {coffeeLabel(visible.length)}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-gold decoration-gold/40 hover:text-gold-soft font-mono text-[11px] uppercase tracking-[0.2em] underline underline-offset-4 transition-colors duration-300 motion-reduce:transition-none"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {/* Grid / empty state */}
      <h2 className="sr-only">Wyniki</h2>
      {visible.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, index) => (
            <li key={product.slug}>
              <Reveal delay={(index % 4) * 0.07} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-line bg-roast mt-10 flex flex-col items-center gap-6 rounded-2xl border px-8 py-16 text-center">
          <p className="font-display text-crema text-3xl font-light md:text-4xl">
            Brak kaw spełniających te kryteria
          </p>
          <p className="text-latte max-w-md">
            Zmień kryteria lub wyczyść filtry, aby zobaczyć pełen katalog.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Wyczyść filtry
          </Button>
        </div>
      )}
    </section>
  );
}

export default ShopBrowser;
