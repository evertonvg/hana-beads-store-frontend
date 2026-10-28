import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";
import { serializeShopQuery, type ShopQuery } from "@/lib/shop-query";

type Props = { query: ShopQuery; page: number; pageCount: number };

const box = "flex size-11 items-center justify-center border-[3px] font-pixel text-[10px]";

/** First, last and the neighbors of the current page; gaps become `null` (an ellipsis). */
function pagesToShow(page: number, pageCount: number): (number | null)[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  return pages.flatMap((n, i) => (i > 0 && n - pages[i - 1] > 1 ? [null, n] : [n]));
}

/** Plain links, so every page is a shareable URL that keeps the active filters. */
export function ShopPagination({ query, page, pageCount }: Props) {
  if (pageCount <= 1) return null;
  const href = (n: number) => serializeShopQuery("/loja", { ...query, pagina: n });

  return (
    <nav aria-label="Páginas" className="pt-4">
      <ul className="m-0 flex list-none justify-center gap-2 p-0">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              aria-label="Página anterior"
              className={cn(box, "border-border text-text", focusRing)}
            >
              <Icon name="chevron-left" size={16} />
            </Link>
          ) : (
            <span aria-hidden="true" className={cn(box, "border-border-soft text-text-subtle")}>
              <Icon name="chevron-left" size={16} />
            </span>
          )}
        </li>
        {pagesToShow(page, pageCount).map((n, i) => (
          <li key={n ?? `gap-${i}`}>
            {n === null ? (
              <span aria-hidden="true" className={cn(box, "border-transparent text-text-subtle")}>
                …
              </span>
            ) : (
              <Link
                href={href(n)}
                aria-label={`Página ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  box,
                  focusRing,
                  n === page ? "border-text bg-text text-bg" : "border-border text-text",
                )}
              >
                {n}
              </Link>
            )}
          </li>
        ))}
        <li>
          {page < pageCount ? (
            <Link
              href={href(page + 1)}
              aria-label="Próxima página"
              className={cn(box, "border-border text-text", focusRing)}
            >
              <Icon name="chevron-right" size={16} />
            </Link>
          ) : (
            <span aria-hidden="true" className={cn(box, "border-border-soft text-text-subtle")}>
              <Icon name="chevron-right" size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
