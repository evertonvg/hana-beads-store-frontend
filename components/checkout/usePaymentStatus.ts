"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { OrderStatus } from "@/lib/data/types";
import { isFinalStatus, isPaidStatus } from "@/lib/order-status";

class StatusError extends Error {
  constructor(readonly httpStatus: number) {
    super(`status ${httpStatus}`);
  }
}

async function fetchStatus(orderId: string): Promise<OrderStatus> {
  const res = await fetch(`/api/pedidos/${orderId}/status`);
  if (!res.ok) throw new StatusError(res.status);
  return ((await res.json()) as { status: OrderStatus }).status;
}

/** What the payment screen should say about the wait. */
export type WaitState =
  | "waiting"
  /** Cancelled or refunded: nothing left to wait for. */
  | "closed"
  /** The status route says the order is not ours (404): polling stopped. */
  | "gone"
  /** The check keeps failing (network, server): polling goes on. */
  | "unreachable";

/**
 * Polls the order status every 3 seconds while it awaits payment (TanStack Query pauses it with
 * the tab hidden and refetches on focus). When it turns paid, goes to the confirmation screen.
 * A 404 stops the polling; other failures keep retrying but are reported.
 */
export function usePaymentStatus(orderId: string, initial: OrderStatus) {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => fetchStatus(orderId),
    initialData: initial,
    retry: false,
    refetchInterval: (q) =>
      isFinalStatus(q.state.data) ||
      (q.state.error instanceof StatusError && q.state.error.httpStatus === 404)
        ? false
        : 3000,
    refetchIntervalInBackground: false,
  });

  const status = query.data;
  useEffect(() => {
    if (isPaidStatus(status)) router.replace(`/pedido/${orderId}/confirmado`);
  }, [status, orderId, router]);

  let wait: WaitState = "waiting";
  if (status === "cancelado" || status === "reembolsado") wait = "closed";
  else if (query.error instanceof StatusError && query.error.httpStatus === 404) wait = "gone";
  else if (query.isError) wait = "unreachable";

  return Object.assign(query, { wait });
}
