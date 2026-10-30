import { addMinutes } from "date-fns";

import { DECLINED_TOKEN_PREFIX } from "@/lib/mock-card-token";
import { PIX_TTL_SECONDS } from "@/lib/pix-countdown";
import type { PaymentsPort } from "@/lib/data/ports";
import type { Order, PixPayment } from "@/lib/data/types";

import { getMockStore } from "./store";

function findOrder(id: string): Order {
  const order = getMockStore().orders.find((o) => o.id === id);
  if (!order) throw new Error(`order ${id} not found`);
  return order;
}

const newPix = (): PixPayment => ({
  kind: "pix",
  copyPaste: "[codigo-pix]",
  expiresAt: addMinutes(new Date(), PIX_TTL_SECONDS / 60).toISOString(),
});

/** Runs synchronous mock work and turns a throw into a rejected promise, like a real gateway call. */
function settle<T>(work: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      resolve(work());
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

/**
 * In-memory gateway. Pix and boleto carry placeholders. A card token starting with
 * `mock_tok_declined_` is declined (the order stays awaiting payment); any other
 * `mock_tok_` token is approved and the order becomes paid.
 */
export function createMockPayments(): PaymentsPort {
  return {
    start: (orderId, method, card) =>
      settle(() => {
        const order = findOrder(orderId);
        if (order.status !== "aguardando_pagamento") {
          throw new Error("order is not awaiting payment");
        }
        if (order.payment && order.paymentMethod === method) {
          return structuredClone(order.payment);
        }
        if (method === "cartao") {
          if (!card?.token.startsWith("mock_tok_")) throw new Error("card token missing");
          const approved = !card.token.startsWith(DECLINED_TOKEN_PREFIX);
          order.paymentMethod = method;
          order.payment = {
            kind: "cartao",
            result: approved ? "aprovado" : "recusado",
            last4: card.last4,
          };
          if (approved) {
            order.status = "pago";
            order.events.push({ status: "pago", at: new Date().toISOString() });
          }
          return structuredClone(order.payment);
        }
        order.paymentMethod = method;
        order.payment =
          method === "pix"
            ? newPix()
            : { kind: "boleto", line: "[linha digitável]", pdfUrl: null, dueDate: null };
        return structuredClone(order.payment);
      }),

    renewPix: (orderId) =>
      settle(() => {
        const order = findOrder(orderId);
        if (order.status !== "aguardando_pagamento" || order.payment?.kind !== "pix") {
          throw new Error("order has no Pix to renew");
        }
        const pix = newPix();
        order.payment = pix;
        return structuredClone(pix);
      }),

    status: (orderId) => settle(() => findOrder(orderId).status),
  };
}
