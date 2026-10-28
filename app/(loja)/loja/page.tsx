import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactButton } from "@/components/contact/ContactButton";
import { ProductCard } from "@/components/loja/ProductCard";
import { ShopCategories, ShopSearch, ShopSidebar } from "@/components/loja/ShopFilters";
import { ShopPagination } from "@/components/loja/ShopPagination";
import { ShopToolbar } from "@/components/loja/ShopToolbar";
import { Button } from "@/components/ui/Button";
import { focusRing } from "@/components/ui/focus";
import { getContact } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { getData } from "@/lib/data";
import { loadShopQuery } from "@/lib/shop-query";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Loja | Pixel Perfect Artesanato",
  description: "Chaveiros de continhas feitos à mão: filtre por categoria, cor e disponibilidade.",
};

const topRow =
  "mx-auto flex w-full max-w-[1200px] flex-wrap items-end justify-between gap-4 px-4 pt-5 pb-3 md:gap-6 md:px-6 md:pt-10 md:pb-6";

function ShopHeading() {
  return (
    <div className="flex flex-col gap-3">
      <nav
        aria-label="Você está em"
        className="hidden items-center gap-2 text-[13px] text-text-subtle md:flex"
      >
        <Link
          href="/"
          className={cn("inline-flex min-h-11 items-center text-link hover:text-yellow", focusRing)}
        >
          Início
        </Link>
        <span aria-hidden="true">›</span>
        <span className="text-text">Loja</span>
      </nav>
      <h1 className="font-pixel text-base leading-normal md:text-[28px] md:leading-snug">
        SELECIONE SEU <span className="text-accent">ITEM</span>
      </h1>
    </div>
  );
}

/** Pre-filter layout, so the page does not jump when the real content streams in. */
function ShopFallback() {
  return (
    <>
      <div className={topRow}>
        <ShopHeading />
        <div className="h-[52px] w-full md:w-[380px]" />
      </div>
      <div className="h-[58px] md:h-[68px]" />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-24 md:px-6">
        <div className="h-[900px]" />
      </div>
    </>
  );
}

function OrderCard({ className }: { className: string }) {
  return (
    <Link
      href="/encomendas"
      className={cn(
        "flex-col gap-2 border-[3px] border-text bg-surface-2 p-4 text-text no-underline md:gap-2.5 md:p-[18px]",
        focusRing,
        className,
      )}
    >
      <span className="font-pixel text-[8px] text-accent md:text-[9px]">NÃO ACHOU?</span>
      <span className="text-sm leading-normal">
        A gente monta o seu sob encomenda pelo {getContact().name}.
        <span aria-hidden="true" className="md:hidden">
          {" "}
          ›
        </span>
      </span>
    </Link>
  );
}

async function Shop({ searchParams }: { searchParams: PageProps<"/loja">["searchParams"] }) {
  const query = await loadShopQuery(searchParams);
  const session = await getSession();
  const data = getData();
  const [{ items, total, page, pageCount }, favoriteIds] = await Promise.all([
    data.catalog.list(query),
    session ? data.engagement.favorites(session.id) : Promise.resolve<string[]>([]),
  ]);
  const favorites = new Set(favoriteIds);

  return (
    <>
      <div className={topRow}>
        <ShopHeading />
        <ShopSearch />
      </div>
      <ShopCategories />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pt-2 pb-24 md:flex-row md:flex-wrap md:items-start md:px-6">
        <aside aria-label="Filtros" className="hidden flex-col gap-5 md:flex md:flex-[1_1_240px]">
          <ShopSidebar />
          <OrderCard className="flex" />
        </aside>
        <section
          aria-labelledby="itens-loja"
          className="flex min-w-0 flex-col gap-5 md:flex-[999_1_640px]"
        >
          <h2 id="itens-loja" className="sr-only">
            Itens
          </h2>
          <ShopToolbar total={total} />
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-[18px] border-[3px] border-dashed border-border px-6 py-14 text-center">
              <p className="font-pixel text-sm leading-normal">NENHUM ITEM ENCONTRADO</p>
              <p className="text-[15px] text-text-muted">
                Tente outra palavra, tire alguns filtros ou peça sob encomenda.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href="/loja" variant="primary" className="shadow-none">
                  LIMPAR FILTROS
                </Button>
                <ContactButton kind="encomendar" />
              </div>
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:gap-[22px]">
              {items.map((product) => (
                <li key={product.id} className="flex flex-col [&>article]:flex-1">
                  <ProductCard
                    product={product}
                    favorite={favorites.has(product.id)}
                    loggedIn={session !== null}
                  />
                </li>
              ))}
            </ul>
          )}
          <ShopPagination query={query} page={page} pageCount={pageCount} />
        </section>
        <OrderCard className="flex md:hidden" />
      </div>
    </>
  );
}

export default function LojaPage(props: PageProps<"/loja">) {
  return (
    <Suspense fallback={<ShopFallback />}>
      <Shop searchParams={props.searchParams} />
    </Suspense>
  );
}
