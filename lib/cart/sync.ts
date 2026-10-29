import { mergeCarts } from "./merge";
import type { CartData } from "./types";

/**
 * Cart to keep after signing in as `userId`. A local cart last synced with the same user already
 * contains the saved lines (plus any edits made since, which are saved while signed in), so it
 * wins as is: summing would double it. Last writer wins across devices. A guest cart (no owner) or
 * one left by another user is summed into the saved one.
 */
export function planCartSync(
  local: CartData,
  owner: string | null,
  userId: string,
  saved: CartData,
): CartData {
  return owner === userId ? local : mergeCarts(local, saved);
}
