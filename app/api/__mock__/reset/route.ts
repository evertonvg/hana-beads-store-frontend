import { getMockStore } from "@/lib/data/mock/store";
import { env } from "@/lib/env";

// Test-only endpoint: restores the in-memory mock store to its fixtures.
export function POST() {
  if (env.DATA_SOURCE !== "mock") return new Response(null, { status: 404 });
  getMockStore().reset();
  return new Response(null, { status: 204 });
}
