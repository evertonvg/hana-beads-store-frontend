"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Placement and slide direction of the panel. */
  panelClassName: string;
};

/**
 * Shared shell of Drawer and BottomSheet: Headless UI Dialog (focus trap, Escape,
 * focus return, scroll lock, `role="dialog" aria-modal`) with the pixel look.
 */
export function OverlayDialog({ open, onClose, title, children, panelClassName }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[rgba(11,10,18,0.72)] duration-200 ease-out data-[closed]:opacity-0 motion-reduce:transition-none"
      />
      <DialogPanel
        transition
        className={cn(
          "fixed flex flex-col border-4 border-text bg-surface shadow-hard-lg duration-200 ease-out motion-reduce:transition-none",
          panelClassName,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b-4 border-border-soft p-4">
          <DialogTitle className="font-pixel text-xs text-yellow">{title}</DialogTitle>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex size-11 cursor-pointer items-center justify-center border-2 border-border text-text outline-offset-2 outline-cyan focus-visible:outline-[3px]"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </DialogPanel>
    </Dialog>
  );
}
