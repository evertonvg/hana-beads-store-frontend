"use client";

import { OverlayDialog, type OverlayProps } from "./OverlayDialog";

type Props = OverlayProps & { side?: "right" };

/** Side panel that slides in from the right (cart, mobile menu). */
export function Drawer({ side = "right", ...rest }: Props) {
  return (
    <OverlayDialog
      {...rest}
      panelClassName={
        side === "right"
          ? "inset-y-0 right-0 w-[min(440px,100%)] border-y-0 border-r-0 border-l-4 shadow-[-10px_0_0_var(--color-accent)] data-[closed]:translate-x-full"
          : ""
      }
    />
  );
}
