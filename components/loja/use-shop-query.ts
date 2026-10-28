"use client";

import { useQueryStates } from "nuqs";
import { shopParsers, shopUrlKeys } from "@/lib/shop-query";

/**
 * Shop filters kept in the URL. `shallow: false` re-runs the server page on every change, so the
 * list is always rendered from the same query a shared link would carry.
 */
export function useShopQuery() {
  return useQueryStates(shopParsers, {
    urlKeys: shopUrlKeys,
    shallow: false,
    history: "replace",
    scroll: false,
  });
}
