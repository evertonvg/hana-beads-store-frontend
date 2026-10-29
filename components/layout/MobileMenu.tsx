"use client";

import Link from "next/link";
import { Suspense, use } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { focusRing } from "@/components/ui/focus";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type MobileMenuContact = { label: string; href: string };

type Props = {
  open: boolean;
  onClose: () => void;
  session: Promise<{ name: string } | null>;
  contact: MobileMenuContact;
};

const NAV = [
  { href: "/loja", label: "LOJA" },
  { href: "/encomendas", label: "ENCOMENDAS" },
  { href: "/conta/pedidos", label: "MEUS PEDIDOS" },
  { href: "/#sobre", label: "SOBRE" },
] as const;

const primaryLink = cn(
  "flex min-h-11 items-center justify-center bg-accent p-4 text-center font-pixel text-[11px] text-bg shadow-[4px_4px_0_var(--color-yellow)]",
  focusRing,
);
const smallLink = cn("inline-flex min-h-11 items-center text-link", focusRing);

type Session = { name: string } | null;

function Identity({ name }: { name: string | null }) {
  return (
    <>
      <div
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center bg-accent font-pixel text-sm text-bg"
      >
        {name ? name.charAt(0).toUpperCase() : "?"}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-pixel text-[9px] leading-normal">
          OLÁ, {name ? name.toUpperCase() : "VISITANTE"}
        </span>
        <span className="text-xs text-text-muted">
          {name ? "Veja seus pedidos e dados" : "Entre para ver seus pedidos"}
        </span>
      </div>
    </>
  );
}

function Actions({ signedIn, onClose }: { signedIn: boolean; onClose: () => void }) {
  if (signedIn) {
    return (
      <Link href="/conta" onClick={onClose} className={primaryLink}>
        MINHA CONTA
      </Link>
    );
  }
  return (
    <>
      <Link href="/entrar" onClick={onClose} className={primaryLink}>
        ENTRAR
      </Link>
      <Link
        href="/cadastro"
        onClick={onClose}
        className={cn(
          "flex min-h-11 items-center justify-center border-[3px] border-text p-[13px] text-center font-pixel text-[11px] text-text",
          focusRing,
        )}
      >
        CRIAR CONTA
      </Link>
    </>
  );
}

// The session arrives as a promise (request-time data): these read it inside Suspense, showing
// the signed-out content until it resolves.
function SessionIdentity({ session }: { session: Promise<Session> }) {
  return <Identity name={use(session)?.name ?? null} />;
}

function SessionActions({ session, onClose }: { session: Promise<Session>; onClose: () => void }) {
  return <Actions signedIn={use(session) !== null} onClose={onClose} />;
}

/** Mobile menu: the kit Drawer (focus trap, Escape and focus return) with the menu content. */
export function MobileMenu({ open, onClose, session, contact }: Props) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu">
      <div className="flex min-h-full flex-col">
        <div className="flex items-center gap-3.5 border-[3px] border-text bg-surface-2 p-3.5">
          <Suspense fallback={<Identity name={null} />}>
            <SessionIdentity session={session} />
          </Suspense>
        </div>

        <nav aria-label="Principal" className="flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex min-h-11 justify-between border-b-[3px] border-border-soft py-5 font-pixel text-base text-text",
                focusRing,
              )}
            >
              {item.label}
              <span aria-hidden className="text-accent">
                ›
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 py-4">
          <Suspense fallback={<Actions signedIn={false} onClose={onClose} />}>
            <SessionActions session={session} onClose={onClose} />
          </Suspense>
        </div>

        <div className="mt-auto flex flex-col gap-1 border-t-[3px] border-border-soft pt-[18px]">
          <a
            href={contact.href}
            target="_blank"
            rel="noopener"
            className={cn(smallLink, "gap-2.5 text-sm")}
          >
            <Icon name="send" size={18} />
            {contact.label}
          </a>
          <div className="flex gap-5 text-[13px]">
            <Link href="/trocas" onClick={onClose} className={smallLink}>
              Trocas
            </Link>
            <Link href="/privacidade" onClick={onClose} className={smallLink}>
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
