"use client";

import { useQuery } from "@tanstack/react-query";
import { quoteShippingAction } from "@/app/(loja)/carrinho/actions";
import { lookupCepAction } from "@/app/(checkout)/checkout/actions";
import type { ShippingError, ShippingQuote } from "@/lib/data/ports";
import { isValidCep, onlyDigits } from "@/lib/format";

/** Street data for a valid CEP (null = unknown CEP, the user types the address). */
export function useCepLookup(cep: string) {
  return useQuery({
    queryKey: ["cep", onlyDigits(cep)],
    queryFn: () => lookupCepAction(cep),
    enabled: isValidCep(cep),
  });
}

type Quotes = { quotes: ShippingQuote[]; error: ShippingError["error"] | null; loading: boolean };

/** Shipping options for the CEP, quoted on the server from the cart's ids and quantities. */
export function useCheckoutQuotes(
  cep: string,
  items: { productId: string; qty: number }[],
): Quotes {
  const query = useQuery({
    queryKey: ["checkout-quote", onlyDigits(cep), items],
    queryFn: () => quoteShippingAction({ cep, items }),
    enabled: isValidCep(cep) && items.length > 0,
  });
  const data = query.data;
  return {
    quotes: Array.isArray(data) ? data : [],
    error: data && !Array.isArray(data) ? data.error : null,
    loading: query.isFetching,
  };
}
