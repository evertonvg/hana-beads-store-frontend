import { describe, expect, it } from "vitest";
import { planCartSync } from "@/lib/cart/sync";

const local = { lines: [{ productId: "e13", ring: "mosquetao" as const, qty: 1 }] };
const saved = {
  lines: [
    { productId: "e13", ring: "mosquetao" as const, qty: 1 },
    { productId: "garota", ring: "estrela" as const, qty: 2 },
  ],
};

describe("planCartSync", () => {
  it("sums a guest cart (no owner) into the saved one", () => {
    expect(planCartSync(local, null, "ana", saved).lines).toEqual([
      { productId: "e13", ring: "mosquetao", qty: 2 },
      { productId: "garota", ring: "estrela", qty: 2 },
    ]);
  });

  it("sums when the local cart belongs to another user", () => {
    expect(planCartSync(local, "bruno", "ana", saved).lines[0]?.qty).toBe(2);
  });

  it("keeps the local cart as is when the same user logs in again (no doubling, edits kept)", () => {
    expect(planCartSync(local, "ana", "ana", saved)).toEqual(local);
  });
});
