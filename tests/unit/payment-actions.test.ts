import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, jar } = vi.hoisted(() => ({
  getSession: vi.fn(),
  jar: new Map<string, string>(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ getSession }));
vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) } : undefined),
    }),
}));

import { renewPixAction, switchToPixAction } from "@/app/(checkout)/pedido/[id]/actions";
import { getData } from "@/lib/data";
import { getMockStore } from "@/lib/data/mock/store";
import type { CreateOrderInput } from "@/lib/data/ports";
import type { PaymentMethod } from "@/lib/data/types";

const GENERIC = "Não foi possível agora. Tente de novo.";

const input = (over: Partial<CreateOrderInput> = {}): CreateOrderInput => ({
  userId: null,
  guestToken: "guest-1",
  paymentMethod: "pix",
  items: [],
  subtotalCents: null,
  shippingCents: null,
  discountCents: 0,
  totalCents: null,
  shippingAddress: {
    cep: "01001-000",
    street: "Praça da Sé",
    number: "100",
    district: "Sé",
    city: "São Paulo",
    state: "SP",
  },
  customer: {
    name: "Ana",
    email: "ana@teste.dev",
    phone: "(11) 91234-5678",
    cpf: "529.982.247-25",
  },
  shippingService: "PAC",
  ...over,
});

let n = 0;
/** An order of the guest `guest-1` with its payment started. */
async function startedOrder(method: PaymentMethod, over: Partial<CreateOrderInput> = {}) {
  const { orders, payments } = getData();
  const order = await orders.create(input({ paymentMethod: method, ...over }), `k${++n}`);
  await payments.start(
    order.id,
    method,
    method === "cartao" ? { token: "mock_tok_declined_abc12345", last4: "0002" } : undefined,
  );
  return order.id;
}

const stored = (id: string) => getMockStore().orders.find((o) => o.id === id);

function expirePix(id: string) {
  const payment = stored(id)?.payment;
  if (payment?.kind === "pix") payment.expiresAt = new Date(Date.now() - 1000).toISOString();
}

beforeEach(() => {
  getMockStore().reset();
  getSession.mockReset();
  getSession.mockResolvedValue(null);
  jar.clear();
  jar.set("pp_guest_orders", JSON.stringify(["guest-1"]));
});

describe("renewPixAction", () => {
  it("renews an expired Pix of the owner", async () => {
    const id = await startedOrder("pix");
    expirePix(id);
    const r = await renewPixAction(id);
    expect(r.status).toBe("ok");
    const pix = stored(id)?.payment;
    expect(pix?.kind === "pix" && Date.parse(pix.expiresAt)).toBeGreaterThan(Date.now());
  });

  it("refuses to renew a Pix that has not expired yet", async () => {
    const id = await startedOrder("pix");
    const before = JSON.stringify(stored(id));
    expect(await renewPixAction(id)).toEqual({ status: "error", message: GENERIC });
    expect(JSON.stringify(stored(id))).toBe(before);
  });

  it("refuses a guest without the token and another signed-in user", async () => {
    const id = await startedOrder("pix");
    expirePix(id);
    const before = JSON.stringify(stored(id));
    jar.set("pp_guest_orders", JSON.stringify(["other"]));
    expect(await renewPixAction(id)).toEqual({ status: "error", message: GENERIC });
    getSession.mockResolvedValue({ id: "bruno", name: "Bruno", email: "bruno@teste.dev" });
    expect(await renewPixAction(id)).toEqual({ status: "error", message: GENERIC });
    expect(JSON.stringify(stored(id))).toBe(before);
  });

  it("refuses a paid order and an order that does not exist", async () => {
    const id = await startedOrder("pix");
    expirePix(id);
    await getData().orders.setStatus(id, "pago");
    expect(await renewPixAction(id)).toEqual({ status: "error", message: GENERIC });
    expect(await renewPixAction("ord_nope")).toEqual({ status: "error", message: GENERIC });
    expect(await renewPixAction("")).toEqual({ status: "error", message: GENERIC });
  });

  it("refuses an order that is not paid with Pix", async () => {
    const boleto = await startedOrder("boleto");
    const card = await startedOrder("cartao");
    expect((await renewPixAction(boleto)).status).toBe("error");
    expect((await renewPixAction(card)).status).toBe("error");
    expect(stored(boleto)?.payment?.kind).toBe("boleto");
  });
});

describe("switchToPixAction", () => {
  it("switches a declined card and a boleto of the owner to Pix", async () => {
    const card = await startedOrder("cartao");
    const boleto = await startedOrder("boleto");
    expect((await switchToPixAction(card)).status).toBe("ok");
    expect((await switchToPixAction(boleto)).status).toBe("ok");
    expect(stored(card)).toMatchObject({ paymentMethod: "pix", payment: { kind: "pix" } });
    expect(stored(boleto)).toMatchObject({ paymentMethod: "pix", payment: { kind: "pix" } });
  });

  it("works for an order awaiting payment whose payment was not started", async () => {
    const order = await getData().orders.create(input(), "k-unstarted");
    expect((await switchToPixAction(order.id)).status).toBe("ok");
    expect(stored(order.id)?.payment?.kind).toBe("pix");
  });

  it("refuses a guest without the token and another signed-in user", async () => {
    const id = await startedOrder("boleto");
    const before = JSON.stringify(stored(id));
    jar.set("pp_guest_orders", JSON.stringify(["other"]));
    expect(await switchToPixAction(id)).toEqual({ status: "error", message: GENERIC });
    jar.clear();
    getSession.mockResolvedValue({ id: "bruno", name: "Bruno", email: "bruno@teste.dev" });
    expect(await switchToPixAction(id)).toEqual({ status: "error", message: GENERIC });
    expect(JSON.stringify(stored(id))).toBe(before);
  });

  it("refuses paid, cancelled and missing orders", async () => {
    for (const status of ["pago", "cancelado", "reembolsado", "enviado"] as const) {
      const id = await startedOrder("boleto");
      await getData().orders.setStatus(id, status);
      const before = JSON.stringify(stored(id));
      expect(await switchToPixAction(id)).toEqual({ status: "error", message: GENERIC });
      expect(JSON.stringify(stored(id))).toBe(before);
    }
    expect((await switchToPixAction("ord_nope")).status).toBe("error");
  });

  it("lets a signed-in owner switch their own order", async () => {
    getSession.mockResolvedValue({ id: "ana", name: "Ana", email: "ana@teste.dev" });
    jar.clear();
    const id = await startedOrder("boleto", { userId: "ana", guestToken: null });
    expect((await switchToPixAction(id)).status).toBe("ok");
  });
});
