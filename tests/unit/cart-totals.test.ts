import { describe, expect, it } from "vitest";
import { computeTotals, freeShippingRemaining, type PricedLine } from "@/lib/cart/totals";
import type { Product } from "@/lib/data/types";

const product = {} as Product;
const line = (qty: number, unit: number | null): PricedLine => ({
  productId: "p",
  ring: "mosquetao",
  qty,
  product,
  unitCents: unit,
  lineCents: unit === null ? null : unit * qty,
});

describe("computeTotals", () => {
  it("sums subtotal and applies shipping and discount", () => {
    expect(computeTotals([line(2, 1000), line(1, 500)], 1500, 300)).toEqual({
      subtotalCents: 2500,
      totalCents: 3700,
      itemCount: 3,
    });
  });

  it("returns null when any price or shipping is unknown", () => {
    const t = computeTotals([line(2, 1000), line(1, null)], 1500, 0);
    expect(t.subtotalCents).toBeNull();
    expect(t.totalCents).toBeNull();
    expect(t.itemCount).toBe(3);
    expect(computeTotals([line(1, 100)], null, 0).totalCents).toBeNull();
  });

  it("never goes below zero", () => {
    expect(computeTotals([line(1, 100)], 0, 500).totalCents).toBe(0);
  });
});

describe("freeShippingRemaining", () => {
  it("computes the remaining amount", () => {
    expect(freeShippingRemaining(3000, 5000)).toBe(2000);
    expect(freeShippingRemaining(6000, 5000)).toBe(0);
    expect(freeShippingRemaining(null, 5000)).toBeNull();
    expect(freeShippingRemaining(3000, null)).toBeNull();
  });
});
