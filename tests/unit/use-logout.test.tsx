import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { calls, push, refresh } = vi.hoisted(() => ({
  calls: [] as string[],
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/app/(conta)/actions", () => ({
  saveCartAction: vi.fn((lines: unknown[]) => {
    calls.push(`save:${lines.length}`);
    return Promise.resolve();
  }),
  logoutAction: vi.fn(() => {
    calls.push("logout");
    return Promise.resolve();
  }),
}));

import { useLogout } from "@/components/conta/use-logout";
import { useCartStore } from "@/lib/cart/store";

beforeEach(() => {
  calls.length = 0;
  useCartStore.setState({
    owner: "ana",
    lines: [{ productId: "e13", ring: "mosquetao", qty: 2 }],
  });
});

describe("useLogout", () => {
  it("saves the cart, then ends the session, then empties the local cart", async () => {
    const { result } = renderHook(() => useLogout());
    await result.current();
    expect(calls).toEqual(["save:1", "logout"]);
    expect(useCartStore.getState().lines).toEqual([]);
    expect(useCartStore.getState().owner).toBeNull();
    expect(push).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalled();
  });

  it("does not clear the local cart when saving it failed", async () => {
    const { saveCartAction } = await import("@/app/(conta)/actions");
    vi.mocked(saveCartAction).mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useLogout());
    await expect(result.current()).rejects.toThrow();
    expect(useCartStore.getState().lines).toHaveLength(1);
    expect(calls).toEqual([]);
  });
});
