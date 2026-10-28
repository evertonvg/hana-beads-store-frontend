"use client";

import type { ReactNode } from "react";
import { OverlayDialog } from "./OverlayDialog";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right";
};

/** Side panel that slides in from the right (cart, mobile menu). */
export function Drawer({ open, onClose, title, children, side = "right" }: Props) {
  return (
    <OverlayDialog
      open={open}
      onClose={onClose}
      title={title}
      panelClassName={
        side === "right"
          ? "inset-y-0 right-0 w-full max-w-[420px] data-[closed]:translate-x-full"
          : ""
      }
    >
      {children}
    </OverlayDialog>
  );
}
