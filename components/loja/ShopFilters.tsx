"use client";

import { debounce } from "nuqs";
import { Icon } from "@/components/ui/Icon";
import { PillToggle } from "@/components/ui/PillToggle";
import { Switch } from "@/components/ui/Switch";
import { TextInput } from "@/components/ui/TextInput";
import { cn } from "@/lib/cn";
import type { ColorId } from "@/lib/data/types";
import { CATEGORY_OPTIONS, CLEAR_FILTERS, COLOR_OPTIONS } from "./shop-options";
import { useShopQuery } from "./use-shop-query";

/** Search box. The typed text shows at once; the URL (and the server render) follow after 300ms. */
export function ShopSearch() {
  const [{ q }, setQuery] = useShopQuery();
  return (
    <div className="flex w-full min-w-60 flex-col gap-1.5 md:w-auto md:flex-[0_1_380px]">
      <label htmlFor="busca-loja" className="sr-only text-[13px] text-text-muted md:not-sr-only">
        Buscar na loja
      </label>
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute top-4 left-3.5 text-text-subtle md:hidden"
        />
        <TextInput
          id="busca-loja"
          type="search"
          value={q}
          onChange={(e) => {
            const value = e.target.value;
            void setQuery(
              { q: value === "" ? null : value, pagina: null },
              { limitUrlUpdates: debounce(300) },
            );
          }}
          placeholder="estrela, gatinho, coração..."
          className="min-h-[52px] border-text bg-surface pl-11 md:pl-3 md:text-[15px]"
        />
      </div>
    </div>
  );
}

/** Category chips: one row that scrolls sideways on mobile, wrapping from md. */
export function ShopCategories() {
  const [{ categoria }, setQuery] = useShopQuery();
  return (
    <div className="mx-auto w-full max-w-[1200px] md:px-6 md:pb-6">
      <div
        role="group"
        aria-label="Categorias"
        className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pt-2 pb-3.5 md:flex-wrap md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORY_OPTIONS.map((c) => (
          <PillToggle
            key={c.id}
            pressed={categoria === c.id}
            onPressedChange={() => void setQuery({ categoria: c.id, pagina: null })}
            className="shrink-0 px-3 py-2.5 text-[8px] whitespace-nowrap md:px-3.5 md:py-3 md:text-[9px]"
          >
            {c.mobileLabel ? (
              <>
                <span className="md:hidden">{c.mobileLabel}</span>
                <span className="hidden md:inline">{c.label}</span>
              </>
            ) : (
              c.label
            )}
          </PillToggle>
        ))}
      </div>
    </div>
  );
}

type SwatchesProps = {
  value: ColorId[];
  onChange: (next: ColorId[]) => void;
  /** Gap ring color: must match the surface the swatches sit on. */
  gapClassName: string;
};

/** Multi-select color swatches (`aria-pressed`). Controlled, so the sheet can hold a draft. */
export function ColorSwatches({ value, onChange, gapClassName }: SwatchesProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {COLOR_OPTIONS.map((c) => (
        <PillToggle
          key={c.id}
          aria-label={c.label}
          pressed={value.includes(c.id)}
          onPressedChange={(on) =>
            onChange(on ? [...value, c.id] : value.filter((id) => id !== c.id))
          }
          style={{ background: c.swatch }}
          className={cn(
            "size-11 justify-center gap-0 p-0 aria-pressed:shadow-[0_0_0_3px_var(--color-text)]",
            gapClassName,
          )}
        >
          {null}
        </PillToggle>
      ))}
    </div>
  );
}

/** Desktop filter column: colors, availability and reset. */
export function ShopSidebar() {
  const [{ cores, disponivel }, setQuery] = useShopQuery();
  return (
    <>
      <section
        aria-labelledby="filtro-cor"
        className="flex flex-col gap-3.5 border-[3px] border-border p-[18px]"
      >
        <h2 id="filtro-cor" className="font-pixel text-[9px] text-yellow">
          COR
        </h2>
        <ColorSwatches
          value={cores}
          onChange={(next) => void setQuery({ cores: next, pagina: null })}
          gapClassName="border-bg"
        />
      </section>
      {/*
        Price range (PREÇO Mín./Máx.) is intentionally omitted: every product price is still null,
        so a range filter would have nothing to filter. Pending: add it, together with a price
        range in ShopQuery, once real prices exist (render only with 2+ distinct prices).
      */}
      <div className="border-[3px] border-border px-3.5">
        <Switch
          checked={disponivel}
          onCheckedChange={(on) => void setQuery({ disponivel: on, pagina: null })}
          label="Só disponíveis"
        />
      </div>
      <button
        type="button"
        onClick={() => void setQuery(CLEAR_FILTERS)}
        className="min-h-12 cursor-pointer border-[3px] border-dashed border-border bg-transparent p-3.5 font-pixel text-[9px] text-text outline-offset-4 outline-cyan focus-visible:outline-[3px]"
      >
        LIMPAR FILTROS
      </button>
    </>
  );
}
