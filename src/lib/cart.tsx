'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type JSX,
  type ReactNode,
} from 'react';
import type { Grind, Product } from '@/data/products';

const STORAGE_KEY = 'craft-coffee-cart-v1';

export interface CartItem {
  key: string; // `${slug}|${weight}|${grind}`
  slug: string;
  name: string;
  weight: 250 | 1000;
  grind: Grind;
  qty: number;
  priceCents: number; // unit price
  palette: { bag: string; accent: string };
}

interface CartContextValue {
  items: CartItem[];
  add(product: Product, opts: { weight: 250 | 1000; grind: Grind }, qty?: number): void;
  remove(key: string): void;
  setQty(key: string, qty: number): void;
  clear(): void;
  totalCents: number;
  count: number;
  isDrawerOpen: boolean;
  openDrawer(): void;
  closeDrawer(): void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  const palette = item.palette as Record<string, unknown> | null | undefined;
  return (
    typeof item.key === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    (item.weight === 250 || item.weight === 1000) &&
    (item.grind === 'ziarna' ||
      item.grind === 'mielona drobno' ||
      item.grind === 'mielona grubo') &&
    typeof item.qty === 'number' &&
    Number.isInteger(item.qty) &&
    item.qty > 0 &&
    item.qty <= 99 &&
    typeof item.priceCents === 'number' &&
    Number.isInteger(item.priceCents) &&
    item.priceCents >= 0 &&
    typeof palette === 'object' &&
    palette !== null &&
    typeof palette.bag === 'string' &&
    typeof palette.accent === 'string'
  );
}

// --- External store (localStorage-backed) ------------------------------------
// Hydration-safe by construction: the server snapshot is always an empty cart,
// the stored cart is read lazily on the client and applied right after
// hydration (no SSR mismatch, no setState-in-effect).

const EMPTY_ITEMS: CartItem[] = [];

let storeItems: CartItem[] = EMPTY_ITEMS;
let storeLoaded = false;
const storeListeners = new Set<() => void>();

function loadFromStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(isCartItem);
        if (valid.length > 0) return valid;
      }
    }
  } catch {
    // Corrupted/unavailable storage - start with an empty cart.
  }
  return EMPTY_ITEMS;
}

function getItemsSnapshot(): CartItem[] {
  if (!storeLoaded) {
    storeLoaded = true;
    storeItems = loadFromStorage();
  }
  return storeItems;
}

function getServerItemsSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function subscribeToStore(listener: () => void): () => void {
  storeListeners.add(listener);
  return () => {
    storeListeners.delete(listener);
  };
}

function setStoreItems(update: (prev: CartItem[]) => CartItem[]): void {
  const next = update(getItemsSnapshot());
  if (next === storeItems) return;
  storeItems = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode / quota) - cart stays in memory.
  }
  for (const listener of storeListeners) listener();
}

// ------------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  const items = useSyncExternalStore(
    subscribeToStore,
    getItemsSnapshot,
    getServerItemsSnapshot,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const add = useCallback(
    (product: Product, opts: { weight: 250 | 1000; grind: Grind }, qty: number = 1) => {
      const variant = product.variants.find((v) => v.weight === opts.weight);
      if (!variant || qty < 1) return;
      const key = `${product.slug}|${opts.weight}|${opts.grind}`;
      setStoreItems((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key ? { ...item, qty: item.qty + qty } : item,
          );
        }
        return [
          ...prev,
          {
            key,
            slug: product.slug,
            name: product.name,
            weight: opts.weight,
            grind: opts.grind,
            qty,
            priceCents: variant.priceCents,
            palette: product.palette,
          },
        ];
      });
      setIsDrawerOpen(true);
    },
    [],
  );

  const remove = useCallback((key: string) => {
    setStoreItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setStoreItems((prev) => {
      if (qty <= 0) return prev.filter((item) => item.key !== key);
      return prev.map((item) => (item.key === key ? { ...item, qty } : item));
    });
  }, []);

  const clear = useCallback(() => setStoreItems(() => EMPTY_ITEMS), []);

  const value = useMemo<CartContextValue>(() => {
    const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.qty, 0);
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    return {
      items,
      add,
      remove,
      setQty,
      clear,
      totalCents,
      count,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [items, add, remove, setQty, clear, isDrawerOpen, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within <CartProvider>.');
  }
  return context;
}
