import { formatPrice } from "@/lib/format";

/** `R$ 12,00`, or the `R$ [VALOR]` placeholder while there is no total. */
export const moneyLabel = (cents: number | null): string =>
  cents === null ? "R$ [VALOR]" : formatPrice(cents);
