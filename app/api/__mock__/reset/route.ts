import { env } from "@/lib/env";

// Test-only endpoint. Stub for now; the mock store reset is wired in later.
export function POST() {
  if (env.DATA_SOURCE !== "mock") return new Response(null, { status: 404 });
  return new Response(null, { status: 204 });
}
