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

/** Text inputs of "Minha conta": darker than the panel, 48px tall. */
export const accountInput = "min-h-12 bg-bg";

/** Pixel-font titles inside the account panel. */
export const panelTitle = "m-0 font-pixel text-sm leading-normal text-text";
export const subTitle = "m-0 font-pixel text-[11px] leading-normal text-yellow";

/** Dashed divider between the blocks of one tab. */
export const dashedBlock =
  "flex flex-col gap-4 border-t-[3px] border-dashed border-border pt-[22px]";

/** Main save button of the account forms. */
export const saveButtonClass = "min-h-[52px] self-start shadow-[5px_5px_0_var(--color-yellow)]";
