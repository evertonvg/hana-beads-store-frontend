"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { OrderStatus } from "@/lib/data/types";
import { isFinalStatus, isPaidStatus } from "@/lib/order-status";

async function fetchStatus(orderId: string): Promise<OrderStatus> {
  const res = await fetch(`/api/pedidos/${orderId}/status`);
  if (!res.ok) throw new Error(`status ${res.status}`);
  return ((await res.json()) as { status: OrderStatus }).status;
}

/**
 * Polls the order status every 3 seconds while it awaits payment (TanStack Query pauses it with
 * the tab hidden and refetches on focus). When it turns paid, goes to the confirmation screen.
 */
export function usePaymentStatus(orderId: string, initial: OrderStatus) {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => fetchStatus(orderId),
    initialData: initial,
    refetchInterval: (q) => (isFinalStatus(q.state.data) ? false : 3000),
    refetchIntervalInBackground: false,
  });

  const status = query.data;
  useEffect(() => {
    if (isPaidStatus(status)) router.replace(`/pedido/${orderId}/confirmado`);
  }, [status, orderId, router]);

  return query;
}
