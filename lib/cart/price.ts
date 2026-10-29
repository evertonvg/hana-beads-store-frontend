import type { Product, RingOption } from "@/lib/data/types";
import type { PricedLine } from "./totals";
import type { CartLine } from "./types";

/** Unit price of a product with the chosen ring (its `priceDeltaCents` included); null = unknown. */
export function unitCents(product: Product, ring: RingOption): number | null {
  if (product.priceCents === null) return null;
  const delta = product.options.find((o) => o.value === ring)?.priceDeltaCents ?? 0;
  return product.priceCents + delta;
}

/** A cart line with its product and amounts; any unknown price makes the line amount null. */
export function priceLine(line: CartLine, product: Product): PricedLine {
  const unit = unitCents(product, line.ring);
  return { ...line, product, unitCents: unit, lineCents: unit === null ? null : unit * line.qty };
}
