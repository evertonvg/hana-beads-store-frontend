import { connection } from "next/server";
import { getData } from "@/lib/data";
import { getOrderViewer } from "@/lib/order-viewer";

/**
 * Payment status for the polling on the payment screen. Same ownership rule as the order page:
 * a missing order and somebody else's order both answer 404 with no body.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/pedidos/[id]/status">) {
  await connection();
  const { id } = await ctx.params;
  const { orders, payments } = getData();
  const order = await orders.get(id, await getOrderViewer());
  if (!order) return new Response(null, { status: 404 });
  return Response.json({ status: await payments.status(order.id) });
}
