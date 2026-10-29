import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startCartSaver } from "@/lib/cart/saver";
import { useCartStore } from "@/lib/cart/store";

const a = { productId: "a", ring: "mosquetao" as const, qty: 1 };

beforeEach(() => {
  vi.useFakeTimers();
  useCartStore.setState({ owner: null, lines: [], lastRemoved: null });
});
afterEach(() => vi.useRealTimers());

describe("startCartSaver", () => {
  it("saves once, debounced, after changes while a user owns the cart", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const stop = startCartSaver(save, 600);
    useCartStore.setState({ owner: "ana" });
    useCartStore.getState().add(a);
    useCartStore.getState().add(a);
    await vi.advanceTimersByTimeAsync(599);
    expect(save).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2);
    expect(save).toHaveBeenCalledExactlyOnceWith([{ ...a, qty: 2 }]);
    stop();
  });

  it("does nothing for a guest cart", async () => {
    const save = vi.fn();
    const stop = startCartSaver(save, 600);
    useCartStore.getState().add(a);
    await vi.advanceTimersByTimeAsync(1000);
    expect(save).not.toHaveBeenCalled();
    stop();
  });

  it("skips the save when the owner is gone before the timer fires", async () => {
    const save = vi.fn();
    const stop = startCartSaver(save, 600);
    useCartStore.setState({ owner: "ana" });
    useCartStore.getState().add(a);
    useCartStore.getState().release();
    await vi.advanceTimersByTimeAsync(1000);
    expect(save).not.toHaveBeenCalled();
    stop();
  });

  it("swallows a failed save", async () => {
    const save = vi.fn().mockRejectedValue(new Error("offline"));
    const stop = startCartSaver(save, 600);
    useCartStore.setState({ owner: "ana" });
    useCartStore.getState().add(a);
    await vi.advanceTimersByTimeAsync(700);
    expect(save).toHaveBeenCalledOnce();
    stop();
  });
});
