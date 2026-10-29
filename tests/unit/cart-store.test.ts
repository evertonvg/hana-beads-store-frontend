import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/lib/cart/store";

const a = { productId: "a", ring: "mosquetao" as const, qty: 1 };
const b = { productId: "b", ring: "estrela" as const, qty: 2 };
const c = { productId: "c", ring: "mosquetao" as const, qty: 3 };

beforeEach(() => {
  useCartStore.setState({ lines: [], lastRemoved: null });
});

describe("cart store", () => {
  it("sums lines added twice with the same key and clamps", () => {
    const s = useCartStore.getState();
    s.add(a);
    s.add({ ...a, qty: 2 });
    expect(useCartStore.getState().lines).toEqual([{ ...a, qty: 3 }]);
    useCartStore.getState().add({ ...a, qty: 500 });
    expect(useCartStore.getState().lines[0]?.qty).toBe(99);
  });

  it("counts the sum of quantities", () => {
    useCartStore.getState().replace({ lines: [a, b] });
    expect(useCartStore.getState().count()).toBe(3);
  });

  it("setQty clamps to 1..99", () => {
    useCartStore.getState().replace({ lines: [a] });
    useCartStore.getState().setQty("a:mosquetao", 0);
    expect(useCartStore.getState().lines[0]?.qty).toBe(1);
    useCartStore.getState().setQty("a:mosquetao", 1000);
    expect(useCartStore.getState().lines[0]?.qty).toBe(99);
  });

  it("undo restores the removed line at its original position", () => {
    useCartStore.getState().replace({ lines: [a, b, c] });
    useCartStore.getState().remove("b:estrela");
    expect(useCartStore.getState().lines.map((l) => l.productId)).toEqual(["a", "c"]);
    useCartStore.getState().undo();
    expect(useCartStore.getState().lines.map((l) => l.productId)).toEqual(["a", "b", "c"]);
    expect(useCartStore.getState().lastRemoved).toBeNull();
  });

  it("pruneUnknown drops lines whose product no longer exists", () => {
    useCartStore.getState().replace({ lines: [a, b] });
    useCartStore.getState().pruneUnknown(["a"]);
    expect(useCartStore.getState().lines).toEqual([a]);
  });

  it("clear empties the cart", () => {
    useCartStore.getState().replace({ lines: [a] });
    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toEqual([]);
  });
});
