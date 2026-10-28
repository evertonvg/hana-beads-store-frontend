import type { Metadata } from "next";
import Link from "next/link";
import { PixelNumber404 } from "@/components/pixel/PixelNumber404";
import { getContact } from "@/lib/contact";

export const metadata: Metadata = { title: "Fase não encontrada" };

const focus = "outline-offset-4 outline-cyan focus-visible:outline-[3px]";

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
          <Link
            href="/"
            className={`flex min-h-11 items-center gap-3 bg-accent p-4 font-pixel text-[10px] text-bg md:gap-3.5 md:px-[18px] md:text-[11px] ${focus}`}
          >
            <span aria-hidden className="animate-pisca motion-reduce:animate-none">
              ▶
            </span>
            SIM · VOLTAR AO INÍCIO
          </Link>
          <Link
            href="/loja"
            className={`flex min-h-11 items-center gap-3 border-[3px] border-text px-4 py-[13px] font-pixel text-[10px] text-text md:gap-3.5 md:px-[18px] md:text-[11px] ${focus}`}
          >
            <span aria-hidden className="w-2.5 md:w-[11px]" />
            NÃO · IR DIRETO PRA LOJA
          </Link>
        </div>
      </section>

      <form
        role="search"
        action="/loja"
        method="get"
        className="flex w-full max-w-[520px] flex-col gap-2 text-left"
      >
        <label htmlFor="busca-404" className="text-sm text-text-muted">
          Ou procure o que você queria
        </label>
        <div className="flex">
          <input
            id="busca-404"
            name="q"
            type="search"
            placeholder="estrela, gatinho, coração..."
            className="min-h-[52px] min-w-0 flex-1 border-[3px] border-r-0 border-text bg-surface p-3 font-mono text-base text-text placeholder:text-text-subtle focus-visible:outline-[3px] focus-visible:outline-cyan"
          />
          <button
            type="submit"
            className="flex min-h-[52px] cursor-pointer items-center bg-text px-[18px] font-pixel text-[9px] text-bg outline-offset-2 outline-cyan focus-visible:outline-[3px]"
          >
            BUSCAR
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-x-5 text-sm md:mt-0">
        {SHORTCUTS.map((s) => (
          <Link key={s.href} href={s.href} className={`py-3 text-link underline ${focus}`}>
            {s.label}
          </Link>
        ))}
        <a
          href={channel.href()}
          target="_blank"
          rel="noopener"
          className={`py-3 text-link underline ${focus}`}
        >
          Falar no {channel.name}
        </a>
      </div>
    </div>
  );
}
