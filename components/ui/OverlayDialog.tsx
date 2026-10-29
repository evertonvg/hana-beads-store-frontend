"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type OverlayProps = {
  open: boolean;
  onClose: () => void;
  /** Dialog name. A string gets the default yellow look; a node (e.g. two-tone) styles itself. */
  title: ReactNode;
  /** Small line above the title (e.g. "+1 NO INVENTÁRIO"). */
  eyebrow?: ReactNode;
  children: ReactNode;
};

type Props = OverlayProps & {
  /** Placement and slide direction of the panel. */
  panelClassName: string;
  /** Grab handle above the header (bottom sheets). */
  handle?: boolean;
};

/**
 * Shared shell of Drawer and BottomSheet: Headless UI Dialog (focus trap, Escape,
 * focus return, scroll lock, `role="dialog" aria-modal`) with the pixel look.
 */
export function OverlayDialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  panelClassName,
  handle = false,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-[rgba(11,10,18,0.72)] duration-200 ease-out data-[closed]:opacity-0 motion-reduce:transition-none"
      />
      <DialogPanel
        transition
        className={cn(
          "fixed flex flex-col border-text bg-surface duration-200 ease-out motion-reduce:transition-none",
          panelClassName,
        )}
      >
        {handle ? (
          <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-12 shrink-0 bg-border" />
        ) : null}
        <div className="flex items-start justify-between gap-4 border-b-[3px] border-border-soft px-4 py-4 md:px-6 md:py-[22px]">
          <div className="flex flex-col gap-2">
            {eyebrow ? (
              <span className="font-pixel text-[8px] text-yellow md:text-[9px]">{eyebrow}</span>
            ) : null}
            <DialogTitle
              className={cn(
                "font-pixel leading-normal",
                typeof title === "string" ? "text-xs text-yellow" : "text-sm md:text-[15px]",
              )}
            >
              {title}
            </DialogTitle>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center border-[3px] border-border text-text outline-offset-2 outline-cyan focus-visible:outline-[3px]"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:px-6 md:py-5">{children}</div>
      </DialogPanel>
    </Dialog>
  );
}
