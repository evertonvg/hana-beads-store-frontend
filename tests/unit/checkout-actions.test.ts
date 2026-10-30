import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSession, getSession, jar } = vi.hoisted(() => ({
  createSession: vi.fn(),
  getSession: vi.fn(),
  jar: new Map<string, string>(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ createSession, getSession }));
vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) } : undefined),
      set: (name: string, value: string) => void jar.set(name, value),
    }),
}));

import { lookupCepAction, placeOrderAction } from "@/app/(checkout)/checkout/actions";
import { getMockStore } from "@/lib/data/mock/store";

const base = {
  name: "Nova Pessoa",
  email: "nova@teste.dev",
  phone: "(11) 91234-5678",
  cpf: "529.982.247-25",
  cep: "01001-000",
  street: "Praça da Sé",
  number: "100",
  complement: "",
  district: "Sé",
  city: "São Paulo",
  state: "SP",
  shippingId: "pac",
  couponCode: "",
  payment: "pix",
  checkoutToken: "3f6c1b1e-6d3b-4c6e-9d27-6f1b7a2d9c11",
  saveAccount: false,
  password: "",
  lines: [{ productId: "garota", ring: "mosquetao", qty: 1 }],
};

beforeEach(() => {
  getMockStore().reset();
  createSession.mockReset();
  getSession.mockReset();
  getSession.mockResolvedValue(null);
  jar.clear();
});

describe("placeOrderAction", () => {
  it("creates one order per checkout token and remembers it for the guest", async () => {
    const a = await placeOrderAction(base);
    const b = await placeOrderAction(base);
    expect(a.status).toBe("ok");
    expect(a.redirectTo).toMatch(/^\/pedido\/[^/]+\/pagamento$/);
    expect(b.redirectTo).toBe(a.redirectTo);
    const { orders } = getMockStore();
    expect(orders).toHaveLength(1);
    expect(orders[0]?.userId).toBeNull();
    expect(JSON.parse(jar.get("pp_guest_orders") ?? "[]")).toEqual([orders[0]?.guestToken]);
  });

  it("keeps at most 10 guest tokens", async () => {
    for (let i = 0; i < 12; i++) {
      const suffix = String(i).padStart(2, "0");
      await placeOrderAction({
        ...base,
        checkoutToken: `3f6c1b1e-6d3b-4c6e-9d27-6f1b7a2d9c${suffix}`,
      });
    }
    expect(JSON.parse(jar.get("pp_guest_orders") ?? "[]")).toHaveLength(10);
  });

  it("revalidates with the schema and reports field errors", async () => {
    const r = await placeOrderAction({ ...base, cpf: "111.111.111-11" });
    expect(r.status).toBe("error");
    expect(r.fieldErrors?.cpf).toBe("Informe um CPF válido.");
    expect(getMockStore().orders).toHaveLength(0);
  });

  it("rejects an empty cart and a shipping id the server did not quote", async () => {
    expect((await placeOrderAction({ ...base, lines: [] })).status).toBe("error");
    const r = await placeOrderAction({ ...base, shippingId: "gratis" });
    expect(r.fieldErrors?.shippingId).toBeDefined();
    expect(getMockStore().orders).toHaveLength(0);
  });

  it("re-validates the coupon on the server", async () => {
    const bad = await placeOrderAction({ ...base, couponCode: "EXPIRADO" });
    expect(bad.status).toBe("error");
    expect(getMockStore().orders).toHaveLength(0);
    const ok = await placeOrderAction({ ...base, couponCode: "teste10" });
    expect(ok.status).toBe("ok");
  });

  it("uses the signed-in user and no guest token", async () => {
    getSession.mockResolvedValue({ id: "ana", name: "Ana Souza", email: "ana@teste.dev" });
    await placeOrderAction(base);
    expect(getMockStore().orders[0]).toMatchObject({ userId: "ana", guestToken: null });
    expect(jar.has("pp_guest_orders")).toBe(false);
  });

  it("creates the account when asked, signs in and keeps the order", async () => {
    const r = await placeOrderAction({ ...base, saveAccount: true, password: "Senha@123" });
    expect(r).toMatchObject({ status: "ok", accountCreated: true });
    const user = getMockStore().users.find((u) => u.email === "nova@teste.dev");
    expect(user).toBeDefined();
    expect(createSession).toHaveBeenCalledWith(user?.id, false);
    expect(getMockStore().orders[0]?.userId).toBe(user?.id);
  });

  it("answers an e-mail already in use with a field error and no order", async () => {
    const r = await placeOrderAction({
      ...base,
      email: "ana@teste.dev",
      saveAccount: true,
      password: "Senha@123",
    });
    expect(r.status).toBe("error");
    expect(r.fieldErrors?.email).toBe("E-mail já cadastrado.");
    expect(getMockStore().orders).toHaveLength(0);
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("lookupCepAction", () => {
  it("fills the Praça da Sé and returns null for other valid CEPs", async () => {
    expect(await lookupCepAction("01001-000")).toMatchObject({
      street: "Praça da Sé",
      district: "Sé",
      city: "São Paulo",
      state: "SP",
    });
    expect(await lookupCepAction("13400-000")).toBeNull();
    expect(await lookupCepAction("123")).toBeNull();
  });
});
