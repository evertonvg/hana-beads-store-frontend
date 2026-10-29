import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";

/** Form card of the auth screens: bare on mobile, framed with a hard shadow from `md`. */
export const authCard =
  "md:border-4 md:border-text md:bg-surface-2 md:p-7 md:shadow-[10px_10px_0_var(--color-accent)]";

/** Text inputs of the auth forms: darker than the card, 52px tall on mobile. */
export const authInput = "min-h-[52px] bg-bg md:min-h-12";

/** Link-looking button ("Esqueci minha senha", "Voltar para o login"). */
export const textButton = cn(
  "min-h-11 cursor-pointer p-0 text-sm text-link underline hover:text-yellow",
  focusRing,
);

/**
 * Link inside running text. Vertical padding gives a 44px hit area without stretching the line
 * (padding on an inline box does not change the line height).
 */
export const inlineLink = cn(
  "inline py-3.5 text-link underline underline-offset-4 hover:text-yellow",
  focusRing,
);
