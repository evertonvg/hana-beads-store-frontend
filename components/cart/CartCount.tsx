"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/lib/cart/store";

/**
 * Cart item count (sum of quantities). Hydration of the store is handled once by `CartHydrator`.
 * The server snapshot is always 0: a layout can hydrate after the store loaded from localStorage,
 * and it must still match the (empty-cart) HTML it was rendered from.
 */
export function useCartCount(): number {
  return useSyncExternalStore(
    useCartStore.subscribe,
    () => useCartStore.getState().count(),
    () => 0,
  );
}
