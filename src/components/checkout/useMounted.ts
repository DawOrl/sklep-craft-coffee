"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False during SSR and hydration, true after mount. Hydration-safe gate for
 * cart-dependent UI (cart is always empty server-side) without the
 * setState-in-effect pattern.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default useMounted;
