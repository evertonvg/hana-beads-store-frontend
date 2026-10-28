import type { Metadata } from "next";
import Link from "next/link";
import { PixelNumber404 } from "@/components/pixel/PixelNumber404";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { focusRing } from "@/components/ui/focus";
import { TextInput } from "@/components/ui/TextInput";
import { cn } from "@/lib/cn";
import { getContact } from "@/lib/contact";

export const metadata: Metadata = { title: "Fase não encontrada" };

const shortcutClass = cn("inline-flex min-h-11 items-center text-link underline", focusRing);

const SHORTCUTS = [
  { href: "/encomendas", label: "Encomendas" },
  { href: "/conta/pedidos", label: "Meus pedidos" },
  { href: "/trocas", label: "Trocas" },
] as const;

export default function NotFound() {
  const channel = getContact();
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-6 px-4 pt-9 pb-7 text-center md:gap-9 md:px-6 md:pt-[72px] md:pb-24">
      <PixelNumber404 />

      <div className="flex flex-col items-center gap-3 md:gap-4">
        <p className="font-pixel text-[9px] text-yellow md:text-[10px]">ERRO 404</p>
        <h1 className="font-pixel text-lg leading-normal md:text-3xl md:leading-snug">
          FASE NÃO <span className="text-accent">ENCONTRADA</span>
        </h1>
        <p className="max-w-[540px] text-[15px] leading-relaxed text-text-muted md:text-[17px]">
          Parece que esta peça se perdeu no caminho. O link pode estar quebrado ou a página mudou de
          lugar.
        </p>
      </div>

      <section
        aria-labelledby="continue"
        className="flex w-full max-w-[520px] flex-col gap-3 border-[3px] border-text bg-surface-2 p-[18px] shadow-[6px_6px_0_var(--color-accent)] md:gap-[18px] md:border-4 md:p-7 md:shadow-[10px_10px_0_var(--color-accent)]"
      >
        <h2 id="continue" className="text-left font-pixel text-[13px] md:text-base">
          CONTINUE?
        </h2>
        <div className="flex flex-col gap-2.5 text-left">
          <Button
            href="/"
            variant="primary"
            className="justify-start gap-3 px-4 py-4 text-[10px] shadow-none md:gap-3.5 md:px-[18px] md:text-[11px]"
          >
            <span aria-hidden className="animate-pisca motion-reduce:animate-none">
              ▶
            </span>
            SIM · VOLTAR AO INÍCIO
          </Button>
          <Button
            href="/loja"
            variant="secondary"
            className="justify-start gap-3 px-4 py-[13px] text-[10px] md:gap-3.5 md:px-[18px] md:text-[11px]"
          >
            <span aria-hidden className="w-2.5 md:w-[11px]" />
            NÃO · IR DIRETO PRA LOJA
          </Button>
        </div>
      </section>

      <form role="search" action="/loja" method="get" className="w-full max-w-[520px] text-left">
        <Field label="Ou procure o que você queria">
          <div className="flex">
            <TextInput
              name="q"
              type="search"
              placeholder="estrela, gatinho, coração..."
              className="min-h-[52px] min-w-0 flex-1 border-r-0 bg-surface"
            />
            <Button
              type="submit"
              variant="primary"
              className="bg-text px-[18px] py-0 text-[9px] shadow-none"
            >
              BUSCAR
            </Button>
          </div>
        </Field>
      </form>

      <div className="flex flex-wrap justify-center gap-x-5">
        {SHORTCUTS.map((s) => (
          <Link key={s.href} href={s.href} className={shortcutClass}>
            {s.label}
          </Link>
        ))}
        <a href={channel.href()} target="_blank" rel="noopener" className={shortcutClass}>
          Falar no {channel.name}
        </a>
      </div>
    </div>
  );
}
