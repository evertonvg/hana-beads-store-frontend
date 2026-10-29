"use client";

import { unitCents } from "@/lib/cart/price";
import { formatPrice } from "@/lib/format";
import { usePurchase } from "./AddToCartForm";

/** Price of the product with the selected ring. */
export function ProductPrice({ className }: { className?: string }) {
  const { product, ring } = usePurchase();
  return <p className={className}>{formatPrice(unitCents(product, ring))}</p>;
}
