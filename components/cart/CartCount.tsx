"use client";

import { useCartStore } from "@/lib/cart/store";

/** Cart item count (sum of quantities). Hydration is handled once by `CartHydrator`. */
export function useCartCount(): number {
  return useCartStore((s) => s.count());
}
