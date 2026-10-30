import { beforeEach, describe, expect, it } from "vitest";
import { createMockOrders } from "@/lib/data/mock/orders";
import { createMockPayments } from "@/lib/data/mock/payments";
import { getMockStore } from "@/lib/data/mock/store";
import type { CreateOrderInput } from "@/lib/data/ports";

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

const viewer = { userId: null, guestTokens: ["guest-1"] };

describe("mock payments", () => {
  beforeEach(() => getMockStore().reset());

  it("starts a Pix that expires in 30 minutes, once per order", async () => {
    const orders = createMockOrders();
    const payments = createMockPayments();
    const order = await orders.create(input(), "k1");
    expect(order.payment).toBeNull();
    const before = Date.now();
    const pix = await payments.start(order.id, "pix");
    if (pix.kind !== "pix") throw new Error("expected pix");
    expect(pix.copyPaste).toBe("[codigo-pix]");
    expect(Date.parse(pix.expiresAt) - before).toBeGreaterThanOrEqual(30 * 60 * 1000 - 50);
    expect(await payments.start(order.id, "pix")).toEqual(pix);
  });

  it("renews the Pix with a new 30 minute window", async () => {
    const orders = createMockOrders();
    const payments = createMockPayments();
    const order = await orders.create(input(), "k1");
    await payments.start(order.id, "pix");
    const stored = getMockStore().orders[0];
    if (stored?.payment?.kind === "pix") stored.payment.expiresAt = new Date(0).toISOString();
    const renewed = await payments.renewPix(order.id);
    expect(Date.parse(renewed.expiresAt)).toBeGreaterThan(Date.now() + 29 * 60 * 1000);
  });

  it("starts a boleto with placeholders", async () => {
    const orders = createMockOrders();
    const order = await orders.create(input({ paymentMethod: "boleto" }), "k1");
    expect(await createMockPayments().start(order.id, "boleto")).toEqual({
      kind: "boleto",
      line: "[linha digitável]",
      pdfUrl: null,
      dueDate: null,
    });
  });

  it("approves a card token and marks the order paid", async () => {
    const orders = createMockOrders();
    const order = await orders.create(input({ paymentMethod: "cartao" }), "k1");
    const payment = await createMockPayments().start(order.id, "cartao", {
      token: "mock_tok_abc12345",
      last4: "1111",
    });
    expect(payment).toEqual({ kind: "cartao", result: "aprovado", last4: "1111" });
    expect((await orders.get(order.id, viewer))?.status).toBe("pago");
  });

  it("declines the decline token and keeps the order awaiting payment", async () => {
    const orders = createMockOrders();
    const order = await orders.create(input({ paymentMethod: "cartao" }), "k1");
    const payment = await createMockPayments().start(order.id, "cartao", {
      token: "mock_tok_declined_abc12345",
      last4: "0002",
    });
    expect(payment).toMatchObject({ kind: "cartao", result: "recusado" });
    expect((await orders.get(order.id, viewer))?.status).toBe("aguardando_pagamento");
  });

  it("switches a declined card order to Pix", async () => {
    const orders = createMockOrders();
    const payments = createMockPayments();
    const order = await orders.create(input({ paymentMethod: "cartao" }), "k1");
    await payments.start(order.id, "cartao", {
      token: "mock_tok_declined_abc12345",
      last4: "0002",
    });
    const pix = await payments.start(order.id, "pix");
    expect(pix.kind).toBe("pix");
    const after = await orders.get(order.id, viewer);
    expect(after?.paymentMethod).toBe("pix");
    expect(after?.payment?.kind).toBe("pix");
  });

  it("refuses a card without a token and a paid order", async () => {
    const orders = createMockOrders();
    const payments = createMockPayments();
    const order = await orders.create(input({ paymentMethod: "cartao" }), "k1");
    await expect(payments.start(order.id, "cartao")).rejects.toThrow();
    await orders.setStatus(order.id, "pago");
    await expect(payments.start(order.id, "pix")).rejects.toThrow();
    await expect(payments.start("nope", "pix")).rejects.toThrow();
  });

  it("reads the status", async () => {
    const orders = createMockOrders();
    const order = await orders.create(input(), "k1");
    const payments = createMockPayments();
    expect(await payments.status(order.id)).toBe("aguardando_pagamento");
    await orders.setStatus(order.id, "pago");
    expect(await payments.status(order.id)).toBe("pago");
  });
});
