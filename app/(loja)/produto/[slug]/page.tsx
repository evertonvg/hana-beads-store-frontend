import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContactButton } from "@/components/contact/ContactButton";
import { AddToCartForm, PurchaseProvider } from "@/components/loja/AddToCartForm";
import { ProductAttributes } from "@/components/loja/ProductAttributes";
import { ProductCard } from "@/components/loja/ProductCard";
import { ProductGallery } from "@/components/loja/ProductGallery";
import { StickyBuyBar } from "@/components/loja/StickyBuyBar";
import { Accordion } from "@/components/ui/Accordion";
import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";
import { getData } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { getSession } from "@/lib/session";

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getData().catalog.bySlug(slug);
  if (!product) return { title: "Fase não encontrada" };
  return { title: `${product.name} — Pixel Perfect`, description: product.description };
}

const linkClass = cn(
  "inline-flex min-h-11 items-center text-link underline underline-offset-4 hover:text-yellow",
  focusRing,
);

function Fallback() {
  return <div aria-hidden="true" className="min-h-[1400px]" />;
}

async function Product({ params }: { params: PageProps<"/produto/[slug]">["params"] }) {
  const { slug } = await params;
  const data = getData();
  const product = await data.catalog.bySlug(slug);
  if (!product) notFound();

  const [related, session] = await Promise.all([data.catalog.related(product.id, 3), getSession()]);
  const favoriteIds = session ? await data.engagement.favorites(session.id) : [];
  const favorites = new Set(favoriteIds);
  const category = product.categories[0];
  const price = formatPrice(product.priceCents);

  return (
    <PurchaseProvider product={product}>
      <div className="flex flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 pb-8 md:gap-10 md:px-6 md:pt-8 md:pb-24">
          <nav
            aria-label="Você está em"
            className="hidden flex-wrap items-center gap-2 text-[13px] text-text-subtle md:flex"
          >
            <Link href="/loja" className={linkClass}>
              Loja
            </Link>
            <span aria-hidden="true">›</span>
            {category ? (
              <>
                <Link href={`/loja?categoria=${category}`} className={linkClass}>
                  {product.categoryLabel}
                </Link>
                <span aria-hidden="true">›</span>
              </>
            ) : null}
            <span className="text-text">{product.name}</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-12">
            <div className="min-w-0 md:flex-[1_1_480px]">
              <ProductGallery product={product} />
            </div>

            <div className="flex min-w-0 flex-col gap-6 md:flex-[1_1_420px] md:gap-7">
              <div className="flex flex-col gap-3.5 px-4 md:px-0">
                <p className="hidden font-pixel text-[10px] text-yellow md:block">
                  {product.categoryLabel.toUpperCase()}
                </p>
                <h1 className="font-pixel text-xl leading-snug md:text-[30px] md:leading-snug">
                  {product.name}
                </h1>
                <p className="font-pixel text-base text-yellow md:text-xl">{price}</p>
                <p className="text-[15px] leading-relaxed text-text-muted md:text-base">
                  {product.description}
                </p>
              </div>

              <ProductAttributes product={product} />
              <AddToCartForm loggedIn={session !== null} priceLabel={price} />

              <div className="px-4 md:px-0">
                <Accordion
                  items={[
                    {
                      id: "detalhes",
                      title: "DETALHES",
                      content: "[Tamanho, material das contas, tipo de argola.]",
                    },
                    {
                      id: "cuidados",
                      title: "CUIDADOS",
                      content: "[Como limpar e conservar a peça.]",
                    },
                    {
                      id: "envio",
                      title: "ENVIO E TROCAS",
                      content: (
                        <>
                          [Prazo de produção e envio.]{" "}
                          <Link href="/trocas" className={linkClass}>
                            Ver política de trocas
                          </Link>
                        </>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <section aria-labelledby="relacionados" className="flex flex-col gap-4 md:gap-7 md:pt-10">
            <h2
              id="relacionados"
              className="px-4 font-pixel text-xs leading-relaxed md:px-0 md:text-lg"
            >
              VOCÊ TAMBÉM PODE <span className="text-accent">DESBLOQUEAR</span>
            </h2>
            <ul className="m-0 flex list-none gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:gap-6 md:overflow-visible md:px-0 md:pb-0">
              {related.map((item) => (
                <li
                  key={item.id}
                  className="flex w-[170px] shrink-0 flex-col md:w-auto [&>article]:flex-1"
                >
                  <ProductCard
                    product={item}
                    favorite={favorites.has(item.id)}
                    loggedIn={session !== null}
                  />
                </li>
              ))}
              <li className="flex w-[170px] shrink-0 flex-col md:w-auto">
                <div className="flex flex-1 flex-col items-center justify-center gap-3 border-[3px] border-dashed border-accent bg-surface p-3 text-center md:min-h-[280px] md:gap-4 md:p-6">
                  <span
                    aria-hidden="true"
                    className="font-pixel text-[28px] text-accent md:text-[40px]"
                  >
                    +
                  </span>
                  <p className="font-pixel text-[8px] leading-relaxed md:text-[11px]">
                    QUER OUTRO MODELO?
                    <br />
                    ENCOMENDE O SEU
                  </p>
                  <ContactButton kind="encomendar" />
                </div>
              </li>
            </ul>
          </section>
        </div>
        <StickyBuyBar />
      </div>
    </PurchaseProvider>
  );
}

export default function ProdutoPage(props: PageProps<"/produto/[slug]">) {
  return (
    <Suspense fallback={<Fallback />}>
      <Product params={props.params} />
    </Suspense>
  );
}
