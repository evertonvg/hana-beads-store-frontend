import type { Product, RingOption } from "@/lib/data/types";

/** Unit price of a product with the chosen ring (its `priceDeltaCents` included); null = unknown. */
export function unitCents(product: Product, ring: RingOption): number | null {
  if (product.priceCents === null) return null;
  const delta = product.options.find((o) => o.value === ring)?.priceDeltaCents ?? 0;
  return product.priceCents + delta;
}
