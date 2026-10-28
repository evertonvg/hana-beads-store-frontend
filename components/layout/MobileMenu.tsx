"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export type MobileMenuContact = { label: string; href: string };

type Props = {
  open: boolean;
  onClose: () => void;
  session: { name: string } | null;
  contact: MobileMenuContact;
};

const NAV = [
  { href: "/loja", label: "LOJA" },
  { href: "/encomendas", label: "ENCOMENDAS" },
  { href: "/conta/pedidos", label: "MEUS PEDIDOS" },
  { href: "/#sobre", label: "SOBRE" },
] as const;

const focus = "outline-offset-4 outline-cyan focus-visible:outline-[3px]";

/** Full-screen menu dialog (mobile). Focus trap, Escape and focus return come from Headless UI. */
export function MobileMenu({ open, onClose, session, contact }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-deep-2" />
      <DialogPanel className="fixed inset-0 flex flex-col overflow-y-auto bg-bg text-text">
        <div className="flex items-center justify-between border-b-[3px] border-border-soft px-3 py-2.5">
          <DialogTitle className="font-pixel text-[10px] text-yellow">Menu</DialogTitle>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className={`flex size-12 cursor-pointer items-center justify-center border-[3px] border-border text-text ${focus}`}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="mx-4 mt-4 flex items-center gap-3.5 border-[3px] border-text bg-surface-2 p-3.5">
          <div
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center bg-accent font-pixel text-sm text-bg"
          >
            {session ? session.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-pixel text-[9px] leading-normal">
              OLÁ, {session ? session.name.toUpperCase() : "VISITANTE"}
            </span>
            <span className="text-xs text-text-muted">
              {session ? "Veja seus pedidos e dados" : "Entre para ver seus pedidos"}
            </span>
          </div>
        </div>

        <nav aria-label="Principal" className="flex flex-col px-4 py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex min-h-11 justify-between border-b-[3px] border-border-soft py-5 font-pixel text-base text-text ${focus}`}
            >
              {item.label}
              <span aria-hidden className="text-accent">
                ›
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 p-4">
          {session ? (
            <Link
              href="/conta"
              onClick={onClose}
              className={`bg-accent p-4 text-center font-pixel text-[11px] text-bg shadow-[4px_4px_0_var(--color-yellow)] ${focus}`}
            >
              MINHA CONTA
            </Link>
          ) : (
            <>
              <Link
                href="/entrar"
                onClick={onClose}
                className={`bg-accent p-4 text-center font-pixel text-[11px] text-bg shadow-[4px_4px_0_var(--color-yellow)] ${focus}`}
              >
                ENTRAR
              </Link>
              <Link
                href="/cadastro"
                onClick={onClose}
                className={`border-[3px] border-text p-[13px] text-center font-pixel text-[11px] text-text ${focus}`}
              >
                CRIAR CONTA
              </Link>
            </>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t-[3px] border-border-soft px-4 pt-[18px] pb-6">
          <a
            href={contact.href}
            target="_blank"
            rel="noopener"
            className={`flex min-h-11 items-center gap-2.5 text-sm text-link ${focus}`}
          >
            <Icon name="send" size={18} />
            {contact.label}
          </a>
          <div className="flex gap-5 text-[13px]">
            <Link href="/trocas" onClick={onClose} className={`py-3 text-link ${focus}`}>
              Trocas
            </Link>
            <Link href="/privacidade" onClick={onClose} className={`py-3 text-link ${focus}`}>
              Privacidade
            </Link>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
