import "server-only";

import type { OrderViewer } from "@/lib/data/ports";
import { readGuestTokens } from "@/lib/guest-orders";
import { getSession } from "@/lib/session";

/** Who is asking: the signed-in user and the guest order tokens in the cookie. Reads cookies. */
export async function getOrderViewer(): Promise<OrderViewer> {
  const [session, guestTokens] = await Promise.all([
    getSession().catch(() => null),
    readGuestTokens(),
  ]);
  return { userId: session?.id ?? null, guestTokens };
}
