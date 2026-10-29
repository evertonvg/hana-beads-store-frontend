import type { Product } from "@/lib/data/types";
import type { CartLine } from "./types";

export type PricedLine = CartLine & {
  product: Product;
  unitCents: number | null;
  lineCents: number | null;
};

export type Totals = {
  subtotalCents: number | null;
  totalCents: number | null;
  itemCount: number;
};

/** Any unknown (null) value makes the dependent amounts null. Formatting stays in the UI. */
export function computeTotals(
  lines: PricedLine[],
  shippingCents: number | null,
  discountCents: number,
): Totals {
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  let subtotalCents: number | null = 0;
  for (const l of lines) {
    if (l.lineCents === null) {
      subtotalCents = null;
      break;
    }
    subtotalCents += l.lineCents;
  }
  const totalCents =
    subtotalCents === null || shippingCents === null
      ? null
      : Math.max(0, subtotalCents + shippingCents - discountCents);
  return { subtotalCents, totalCents, itemCount };
}

export function freeShippingRemaining(
  subtotal: number | null,
  threshold: number | null,
): number | null {
  if (subtotal === null || threshold === null) return null;
  return Math.max(0, threshold - subtotal);
}
