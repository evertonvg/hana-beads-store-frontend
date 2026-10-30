import { connection } from "next/server";
import { z } from "zod";
import { getMockStore } from "@/lib/data/mock/store";
import { getData } from "@/lib/data";
import { env } from "@/lib/env";

const bodySchema = z.object({
  status: z.enum([
    "aguardando_aprovacao",
    "aguardando_pagamento",
    "pago",
    "em_producao",
    "enviado",
    "entregue",
    "cancelado",
    "reembolsado",
  ]),
});

type Ctx = { params: Promise<{ id: string }> };

// Test-only endpoints. `POST { status }` moves a mock order to that status (as the payment
// webhook would); `GET` returns the order as stored.
export async function POST(request: Request, ctx: Ctx) {
  if (env.DATA_SOURCE !== "mock") return new Response(null, { status: 404 });
  await connection();
  const { id } = await ctx.params;
  if (!getMockStore().orders.some((o) => o.id === id)) return new Response(null, { status: 404 });
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return new Response(null, { status: 400 });
  await getData().orders.setStatus(id, body.data.status);
  return new Response(null, { status: 204 });
}

export async function GET(_request: Request, ctx: Ctx) {
  if (env.DATA_SOURCE !== "mock") return new Response(null, { status: 404 });
  await connection();
  const { id } = await ctx.params;
  const order = getMockStore().orders.find((o) => o.id === id);
  return order ? Response.json(order) : new Response(null, { status: 404 });
}
