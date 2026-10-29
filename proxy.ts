import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, userIdFromSeal } from "@/lib/session-seal";

/** Sends visitors without a valid session cookie to /entrar, remembering where they were going. */
export async function proxy(request: NextRequest) {
  const userId = await userIdFromSeal(request.cookies.get(SESSION_COOKIE)?.value);
  if (userId) return NextResponse.next();
  const url = request.nextUrl.clone();
  const next = `${url.pathname}${url.search}`;
  url.pathname = "/entrar";
  url.search = "";
  url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/conta/:path*"] };
