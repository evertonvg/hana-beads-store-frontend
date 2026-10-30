import type { OrderStatus } from "@/lib/data/types";

/** Paid and everything after it: the buyer sees the confirmation screen. */
const PAID_OR_LATER: readonly OrderStatus[] = ["pago", "em_producao", "enviado", "entregue"];

export const isPaidStatus = (s: OrderStatus): boolean => PAID_OR_LATER.includes(s);

/** Nothing left to wait for on the payment screen: stop polling. */
export const isFinalStatus = (s: OrderStatus | undefined): boolean =>
  s !== undefined && s !== "aguardando_pagamento";

type StatusTone = "yellow" | "green" | "cyan" | "accent" | "muted" | "purple";

/** Badge text and color of each order status, as shown in the account area. */
export const ORDER_STATUS_BADGE: Record<OrderStatus, { label: string; tone: StatusTone }> = {
  aguardando_aprovacao: { label: "EM ANÁLISE", tone: "purple" },
  aguardando_pagamento: { label: "AGUARDANDO PAGAMENTO", tone: "yellow" },
  pago: { label: "PAGO", tone: "green" },
  em_producao: { label: "EM PRODUÇÃO", tone: "accent" },
  enviado: { label: "ENVIADO", tone: "cyan" },
  entregue: { label: "ENTREGUE", tone: "yellow" },
  cancelado: { label: "CANCELADO", tone: "muted" },
  reembolsado: { label: "REEMBOLSADO", tone: "muted" },
};
