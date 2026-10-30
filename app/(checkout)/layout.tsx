import Link from "next/link";
import { focusRing } from "@/components/ui/focus";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Minimal checkout chrome (Checkout.dc.html / CelCheckout.dc.html): no navigation, no footer, no
 * tab bar, so nothing pulls the buyer away. Desktop shows the logo and "COMPRA SEGURA"; mobile
 * shows a back link to the cart, the logo and "Seguro". The cookie banner and consent scripts
 * live in the root layout and still apply here.
 */
export default function CheckoutLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b-[3px] border-border-soft bg-bg md:static md:border-b-4">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-3 py-2.5 md:flex-wrap md:gap-4 md:px-6 md:py-5">
          <Link
            href="/carrinho"
            aria-label="Voltar para o carrinho"
            className={cn(
              "flex size-12 flex-none items-center justify-center border-[3px] border-border text-text md:hidden",
              focusRing,
            )}
          >
            <Icon name="chevron-left" size={22} />
          </Link>
          <Link
            href="/"
            className={cn(
              "flex min-h-11 flex-1 flex-col justify-center font-pixel text-[11px] leading-normal text-text no-underline md:flex-none md:text-sm md:leading-normal",
              focusRing,
            )}
          >
            PIXEL PERFECT
            <span className="text-[8px] text-text-subtle md:text-[9px]">ARTESANATO</span>
          </Link>
          <span className="hidden font-pixel text-[9px] text-text-subtle md:inline">
            COMPRA SEGURA
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-text-subtle md:hidden">
            <Icon name="lock" size={14} />
            Seguro
          </span>
        </div>
      </header>
      <main id="conteudo" className="flex-1">
        {children}
      </main>
    </>
  );
}
