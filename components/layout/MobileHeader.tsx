"use client";

import Link from "next/link";
import { useState } from "react";
import { focusRing } from "@/components/ui/focus";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { CartLink } from "./CartLink";
import { MobileMenu, type MobileMenuContact } from "./MobileMenu";

type Props = {
  session: { name: string } | null;
  contact: MobileMenuContact;
};

/** Compact sticky header (below `md`): menu button, logo and cart. */
export function MobileHeader({ session, contact }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b-[3px] border-border-soft bg-bg px-3 py-2.5 md:hidden">
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className={cn(
          "flex size-12 cursor-pointer items-center justify-center border-[3px] border-border text-text",
          focusRing,
        )}
      >
        <Icon name="menu" size={22} />
      </button>
      <Link
        href="/"
        className={cn(
          "inline-flex min-h-11 flex-col items-center justify-center text-center font-pixel text-xs leading-normal text-text",
          focusRing,
        )}
      >
        PIXEL PERFECT
        <br />
        <span className="text-[7px] text-text-subtle">ARTESANATO</span>
      </Link>
      <CartLink variant="mobile" />
      <MobileMenu open={open} onClose={() => setOpen(false)} session={session} contact={contact} />
    </header>
  );
}
