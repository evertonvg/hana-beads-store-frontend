"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

/**
 * Empties the cart when the order is confirmed. Marked in sessionStorage so a reload of this
 * screen does not wipe items the buyer added afterwards. Signed in, the saver stores the empty
 * cart too.
 */
export function ClearCartOnce({ orderId }: { orderId: string }) {
  useEffect(() => {
    const key = `pp_cleared_${orderId}`;
    try {
      if (sessionStorage.getItem(key) !== null) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage blocked: clear anyway (once per mount).
    }
    // The cart loads from storage in an effect of its own; clearing before that would be undone.
    const clear = () => useCartStore.getState().clear();
    if (useCartStore.persist.hasHydrated()) clear();
    else {
      const stop = useCartStore.persist.onFinishHydration(() => {
        stop();
        clear();
      });
    }
  }, [orderId]);
  return null;
}
