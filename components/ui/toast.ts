import type { ToasterProps } from "sonner";

/**
 * Pixel styling contract for sonner toasts. Mount `<Toaster toastOptions={toastOptions} />`
 * in `app/providers.tsx` and call `toast()` straight from "sonner". No radius, no blur.
 */
export const toastOptions: NonNullable<ToasterProps["toastOptions"]> = {
  unstyled: true,
  classNames: {
    toast:
      "flex w-full items-start gap-3 border-4 border-text bg-surface p-4 font-mono text-sm text-text shadow-hard-sm",
    title: "font-mono text-sm font-bold text-text",
    description: "text-xs text-text-muted",
    success: "border-green",
    error: "border-danger",
    actionButton: "min-h-11 cursor-pointer bg-accent px-3 font-pixel text-[9px] text-bg",
    cancelButton:
      "min-h-11 cursor-pointer border-[3px] border-text px-3 font-pixel text-[9px] text-text",
  },
};
