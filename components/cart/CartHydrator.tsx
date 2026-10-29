"use client";

import { useEffect } from "react";
import { CART_STORAGE_KEY, useCartStore } from "@/lib/cart/store";

/**
 * Mounted once (in Providers). The store skips hydration so SSR and the first client render
 * both show an empty cart; the persisted cart loads in the first effect and is re-read when
 * another tab changes it.
 */
export function CartHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === CART_STORAGE_KEY) void useCartStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
