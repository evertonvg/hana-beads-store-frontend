import { describe, expect, it } from "vitest";
import { mergeCarts, sanitizeCart } from "@/lib/cart/merge";

describe("sanitizeCart", () => {
  it("returns an empty cart for invalid shapes", () => {
    expect(sanitizeCart("lixo")).toEqual({ lines: [] });
    expect(sanitizeCart(null)).toEqual({ lines: [] });
    expect(sanitizeCart({ lines: "x" })).toEqual({ lines: [] });
  });

  it("clamps quantities to 1..99", () => {
    const out = sanitizeCart({
      lines: [
        { productId: "a", ring: "mosquetao", qty: 0 },
        { productId: "b", ring: "estrela", qty: 999 },
      ],
    });
    expect(out.lines.map((l) => l.qty)).toEqual([1, 99]);
  });

  it("drops malformed lines and sums repeated keys", () => {
    const out = sanitizeCart({
      lines: [
        { productId: "a", ring: "mosquetao", qty: 2 },
        { productId: "a", ring: "mosquetao", qty: 3 },
        { productId: "a", ring: "bogus", qty: 1 },
        { productId: 5, ring: "estrela", qty: 1 },
        null,
      ],
    });
    expect(out.lines).toEqual([{ productId: "a", ring: "mosquetao", qty: 5 }]);
  });
});

describe("mergeCarts", () => {
  it("sums by key, clamps at 99 and keeps saved lines first", () => {
    const guest = {
      lines: [
        { productId: "garota", ring: "mosquetao" as const, qty: 2 },
        { productId: "er", ring: "estrela" as const, qty: 1 },
      ],
    };
    const saved = {
      lines: [
        { productId: "x", ring: "estrela" as const, qty: 4 },
        { productId: "garota", ring: "mosquetao" as const, qty: 98 },
      ],
    };
    expect(mergeCarts(guest, saved).lines).toEqual([
      { productId: "x", ring: "estrela", qty: 4 },
      { productId: "garota", ring: "mosquetao", qty: 99 },
      { productId: "er", ring: "estrela", qty: 1 },
    ]);
  });
});

describe("sanitizeCart numeric edge cases", () => {
  it("clamps negative and NaN quantities to 1", () => {
    const out = sanitizeCart({
      lines: [
        { productId: "a", ring: "mosquetao", qty: -5 },
        { productId: "b", ring: "estrela", qty: Number.NaN },
      ],
    });
    expect(out.lines.map((l) => l.qty)).toEqual([1, 1]);
  });
});
