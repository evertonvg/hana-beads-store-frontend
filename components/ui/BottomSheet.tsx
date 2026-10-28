"use client";

import type { ReactNode } from "react";
import { OverlayDialog } from "./OverlayDialog";

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode };

/** Sheet that rises from the bottom (mobile pickers, filters). */
export function BottomSheet({ open, onClose, title, children }: Props) {
  return (
    <OverlayDialog
      open={open}
      onClose={onClose}
      title={title}
      panelClassName="inset-x-0 bottom-0 max-h-[85dvh] data-[closed]:translate-y-full"
    >
      {children}
    </OverlayDialog>
  );
}
