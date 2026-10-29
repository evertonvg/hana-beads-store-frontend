import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { getData } from "@/lib/data";
import {
  liveUserId,
  REMEMBER_SECONDS,
  sessionOptions,
  SHORT_SECONDS,
  type SessionPayload,
} from "@/lib/session-seal";

export type SessionUser = { id: string; name: string; email: string };

/**
 * Current signed-in user, or null (no cookie, tampered or expired seal, or a user that no longer
 * exists). Reads the request cookies, so callers must sit inside a Suspense boundary.
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  // Checking expiry reads the clock, which Next forbids in prefetch renders: opt out of them.
  await connection();
  const session = await getIronSession<SessionPayload>(await cookies(), sessionOptions());
  const userId = liveUserId(session);
  return userId ? getData().auth.userById(userId) : null;
});

/** Signs the user in: server actions only. `remember` keeps the cookie for 30 days. */
export async function createSession(userId: string, remember: boolean): Promise<void> {
  const session = await getIronSession<SessionPayload>(await cookies(), sessionOptions(remember));
  session.userId = userId;
  session.expiresAt = Date.now() + (remember ? REMEMBER_SECONDS : SHORT_SECONDS) * 1000;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getIronSession<SessionPayload>(await cookies(), sessionOptions());
  session.destroy();
}
