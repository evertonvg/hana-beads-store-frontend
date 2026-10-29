"use client";

import { OverlayDialog, type OverlayProps } from "./OverlayDialog";

/** Sheet that rises from the bottom (mobile pickers, filters, item collected). */
export function BottomSheet(props: OverlayProps) {
  return (
    <OverlayDialog
      {...props}
      handle
      panelClassName="inset-x-0 bottom-0 max-h-[85dvh] border-x-0 border-b-0 border-t-4 shadow-[0_-8px_0_var(--color-accent)] data-[closed]:translate-y-full"
    />
  );
}
