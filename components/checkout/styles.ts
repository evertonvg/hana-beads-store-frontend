import { cn } from "@/lib/cn";

/** Text inputs of the checkout: darker than the page card, 52px tall on mobile. */
export const checkoutInput = "min-h-[52px] bg-bg md:min-h-12";

/** Form section: bare on mobile, framed from `md` (the legend sits on the frame). */
export const section = cn(
  "m-0 flex min-w-0 flex-col gap-3.5 border-0 p-0",
  "md:gap-[18px] md:border-[3px] md:border-border md:p-6",
);

export const legend = "p-0 pb-3.5 font-pixel text-[10px] text-yellow md:px-2 md:pb-0";
