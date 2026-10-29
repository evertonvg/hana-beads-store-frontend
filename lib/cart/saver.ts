import { useCartStore } from "./store";
import type { CartLine } from "./types";

export const CART_SAVE_DELAY_MS = 600;

/**
 * While a user owns the cart, sends its lines to `save` shortly after the last change (debounced).
 * A failed save is ignored: the next change or the sign-out save tries again. Returns a stopper.
 */
export function startCartSaver(
  save: (lines: CartLine[]) => Promise<unknown>,
  delay: number = CART_SAVE_DELAY_MS,
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const unsubscribe = useCartStore.subscribe((state, prev) => {
    if (!state.owner || state.lines === prev.lines) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const { owner, lines } = useCartStore.getState();
      if (!owner) return;
      void save(lines).catch(() => undefined);
    }, delay);
  });
  return () => {
    clearTimeout(timer);
    unsubscribe();
  };
}
