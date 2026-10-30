import { connection } from "next/server";
import { getMockStore } from "@/lib/data/mock/store";
import { env } from "@/lib/env";

// Test-only endpoint: `GET /api/__mock__/pedidos?count` tells how many orders exist.
export async function GET() {
  if (env.DATA_SOURCE !== "mock") return new Response(null, { status: 404 });
  await connection();
  return Response.json({ count: getMockStore().orders.length });
}
