"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "./store";

function subscribeHydration(onChange: () => void) {
  return useCartStore.persist.onFinishHydration(onChange);
}

/** The store skips hydration (SSR shows an empty cart), so the real cart is only known after it. */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
