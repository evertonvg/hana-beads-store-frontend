"use client";

import { useEffect } from "react";
import { CART_STORAGE_KEY, useCartStore } from "@/lib/cart/store";

/**
 * Cart item count. The store skips hydration so SSR and the first client render both show 0;
 * the persisted cart is loaded in the first effect and re-read when another tab changes it.
 */
export function useCartCount(): number {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === CART_STORAGE_KEY) void useCartStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return useCartStore((s) => s.count());
}
