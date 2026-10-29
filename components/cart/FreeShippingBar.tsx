import { publicEnv } from "@/lib/env";
import { freeShippingRemaining } from "@/lib/cart/totals";
import { formatPrice } from "@/lib/format";

type Props = {
  /** Cart subtotal in cents, or `null` when it cannot be computed (prices are placeholders). */
  subtotalCents: number | null;
  /** Free-shipping threshold; defaults to `NEXT_PUBLIC_FREE_SHIPPING_CENTS`. */
  thresholdCents?: number | null;
};

/** "Faltam R$ X para frete grátis" with a progress bar. Unknown threshold or subtotal: placeholder. */
export function FreeShippingBar({
  subtotalCents,
  thresholdCents = publicEnv.freeShippingCents,
}: Props) {
  const remaining = freeShippingRemaining(subtotalCents, thresholdCents);
  const known = remaining !== null && subtotalCents !== null && thresholdCents !== null;
  // The design draws the placeholder at 70%.
  const percent = known
    ? thresholdCents === 0
      ? 100
      : Math.min(100, Math.round((subtotalCents / thresholdCents) * 100))
    : 70;

  return (
    <div className="flex flex-col gap-2.5 border-[3px] border-dashed border-border p-3.5">
      <span className="text-xs md:text-[13px]">
        {!known
          ? "[Faltam R$ X para frete grátis]"
          : remaining === 0
            ? "Você ganhou frete grátis"
            : `Faltam ${formatPrice(remaining)} para frete grátis`}
      </span>
      <div aria-hidden="true" className="h-2.5 bg-bg md:h-3">
        <div className="h-full bg-green" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
