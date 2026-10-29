import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "@/lib/cart/store";

const a = { productId: "a", ring: "mosquetao" as const, qty: 1 };
const b = { productId: "b", ring: "estrela" as const, qty: 2 };
const c = { productId: "c", ring: "mosquetao" as const, qty: 3 };

beforeEach(() => {
  vi.stubGlobal("localStorage", fakeStorage());
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

describe("cart store extra cases", () => {
  it("clamps a new line added with qty 500 to 99", () => {
    useCartStore.getState().add({ ...a, qty: 500 });
    expect(useCartStore.getState().lines[0]?.qty).toBe(99);
  });

  it("setQty on an unknown key leaves the other lines untouched", () => {
    useCartStore.getState().replace({ lines: [a, b] });
    useCartStore.getState().setQty("zzz:estrela", 7);
    expect(useCartStore.getState().lines).toEqual([a, b]);
  });

  it("clear resets lastRemoved", () => {
    useCartStore.getState().replace({ lines: [a, b] });
    useCartStore.getState().remove("a:mosquetao");
    expect(useCartStore.getState().lastRemoved).not.toBeNull();
    useCartStore.getState().clear();
    expect(useCartStore.getState().lastRemoved).toBeNull();
  });
});

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

async function rehydrateFrom(raw: string) {
  vi.stubGlobal("localStorage", fakeStorage({ pp_cart_v1: raw }));
  await useCartStore.persist.rehydrate();
  return useCartStore.getState().lines;
}

describe("cart store persistence wiring", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to an empty cart on corrupted JSON", async () => {
    useCartStore.setState({ lines: [a] });
    expect(await rehydrateFrom("{lixo")).toEqual([]);
  });

  it("sanitizes data from an old version through migrate", async () => {
    const raw = JSON.stringify({
      state: { lines: [{ productId: "garota", ring: "mosquetao", qty: 999 }] },
      version: 0,
    });
    expect(await rehydrateFrom(raw)).toEqual([{ productId: "garota", ring: "mosquetao", qty: 99 }]);
  });

  it("falls back to an empty cart on a wrong shape", async () => {
    useCartStore.setState({ lines: [a] });
    expect(await rehydrateFrom('{"state":{"lines":"x"},"version":1}')).toEqual([]);
  });

  it("sums duplicated lines and clamps the current version through merge", async () => {
    const raw = JSON.stringify({
      state: {
        lines: [
          { productId: "garota", ring: "mosquetao", qty: 2 },
          { productId: "garota", ring: "mosquetao", qty: 3 },
          { productId: "x", ring: "estrela", qty: 0 },
        ],
      },
      version: 1,
    });
    expect(await rehydrateFrom(raw)).toEqual([
      { productId: "garota", ring: "mosquetao", qty: 5 },
      { productId: "x", ring: "estrela", qty: 1 },
    ]);
  });

  it("keeps in-memory lines when storage is unavailable", async () => {
    vi.stubGlobal("localStorage", fakeStorage());
    useCartStore.setState({ lines: [a, b] });
    const broken = () => {
      throw new Error("SecurityError");
    };
    vi.stubGlobal("localStorage", { getItem: broken, setItem: broken, removeItem: broken });
    await useCartStore.persist.rehydrate();
    expect(useCartStore.getState().lines).toEqual([a, b]);
  });
});
