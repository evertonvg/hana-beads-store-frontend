import Link from "next/link";
import { PixelGrid } from "@/components/pixel/PixelGrid";
import { getContact } from "@/lib/contact";
import { CartLink } from "./CartLink";
import { MobileHeader } from "./MobileHeader";

export type HeaderSession = { name: string } | null;

const LOGO_ROWS = ["aya", "yty", "aya"];
const LOGO_PALETTE = {
  a: "var(--color-accent)",
  y: "var(--color-yellow)",
  t: "var(--color-text)",
};

const focus = "outline-offset-4 outline-cyan focus-visible:outline-[3px]";

/** Site header: desktop bar from `md`, compact bar with menu button below it. */
export function Header({ session }: { session: HeaderSession }) {
  const channel = getContact();
  return (
    <>
      <header className="hidden border-b-4 border-border-soft md:block">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className={`flex items-center gap-3 text-text ${focus}`}>
            <PixelGrid rows={LOGO_ROWS} palette={LOGO_PALETTE} cell={10} gap={2} />
            <span className="font-pixel text-sm leading-normal">
              PIXEL PERFECT
              <br />
              <span className="text-[9px] text-text-subtle">ARTESANATO</span>
            </span>
          </Link>
          <nav
            aria-label="Principal"
            className="flex flex-wrap gap-6 font-pixel text-[10px] text-text"
          >
            <Link href="/loja" className={`py-3 ${focus}`}>
              LOJA
            </Link>
            <Link href="/encomendas" className={`py-3 ${focus}`}>
              ENCOMENDAS
            </Link>
            <Link href="/#sobre" className={`py-3 ${focus}`}>
              SOBRE
            </Link>
            {session ? (
              <Link href="/conta" className={`py-3 ${focus}`}>
                MINHA CONTA
              </Link>
            ) : (
              <Link href="/entrar" className={`py-3 ${focus}`}>
                ENTRAR
              </Link>
            )}
          </nav>
          <CartLink variant="desktop" />
        </div>
      </header>
      <MobileHeader
        session={session}
        contact={{ label: `Falar no ${channel.name}`, href: channel.href() }}
      />
    </>
  );
}
