"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { inlineLink } from "@/components/conta/styles";
import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";
import { openCookiePreferences } from "@/lib/consent";

/** Placeholder until the controller's contact (DPO) e-mail is defined: never invent it. */
const DPO_PLACEHOLDER = "[e-mail do encarregado]";

const cardButton = cn(
  "inline-flex min-h-11 cursor-pointer items-center self-start bg-text px-3.5 py-3 font-pixel text-[9px] text-bg",
  focusRing,
);

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 border-[3px] border-border p-[18px]">
      <h3 className="m-0 font-pixel text-[9px] leading-relaxed">{title}</h3>
      {children}
    </div>
  );
}

const body = "m-0 text-[13px] leading-normal text-text-muted";

/** LGPD tools: download the data, reopen the cookie choices and reach the data protection contact. */
export function PrivacyCards() {
  return (
    <div className="grid gap-3.5 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <Card title="SEUS DADOS">
        <p className={body}>Receba uma cópia de tudo que guardamos sobre você.</p>
        {/* A plain link: the file comes from a route handler, not from a page. */}
        <a
          href="/api/conta/exportar"
          download="pixel-perfect-meus-dados.json"
          className={cardButton}
        >
          BAIXAR MEUS DADOS
        </a>
      </Card>
      <Card title="COOKIES">
        <p className={body}>Reveja suas escolhas de cookies neste navegador.</p>
        <button type="button" onClick={openCookiePreferences} className={cardButton}>
          GERENCIAR COOKIES
        </button>
      </Card>
      <Card title="FALAR COM O ENCARREGADO">
        <p className={body}>Dúvidas ou pedidos sobre seus dados: {DPO_PLACEHOLDER}.</p>
        <Link href="/privacidade" className={cn(inlineLink, "self-start text-[13px]")}>
          Ver Política de Privacidade
        </Link>
      </Card>
    </div>
  );
}
