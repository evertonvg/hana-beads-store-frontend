"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PillRadioGroup } from "@/components/ui/PillRadioGroup";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import type { ColorId } from "@/lib/data/types";
import type { ShopQuery } from "@/lib/shop-query";
import { ColorSwatches } from "./ShopFilters";
import { SORT_OPTIONS } from "./shop-options";
import { useShopQuery } from "./use-shop-query";

type Draft = { cores: ColorId[]; disponivel: boolean; ordem: ShopQuery["ordem"] };

/**
 * Result count plus ordering. Desktop: count and a sort select. Mobile: FILTRAR / ORDENAR open
 * bottom sheets that hold a draft and only write the URL on APLICAR.
 */
export function ShopToolbar({ total }: { total: number }) {
  const [query, setQuery] = useShopQuery();
  const [sheet, setSheet] = useState<"filtros" | "ordem" | null>(null);
  const [draft, setDraft] = useState<Draft>({ cores: [], disponivel: false, ordem: "destaque" });

  const open = (which: "filtros" | "ordem") => {
    setDraft({ cores: query.cores, disponivel: query.disponivel, ordem: query.ordem });
    setSheet(which);
  };
  const close = () => setSheet(null);
  const apply = () => {
    void setQuery({ ...draft, pagina: null });
    close();
  };

  return (
    <>
      <div className="flex gap-2.5 md:hidden">
        <Button
          variant="secondary"
          size="sm"
          className="min-h-12 flex-1"
          onClick={() => open("filtros")}
        >
          <Icon name="filter" size={16} />
          FILTRAR
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="min-h-12 flex-1"
          onClick={() => open("ordem")}
        >
          <Icon name="sort" size={16} />
          ORDENAR
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-[13px] text-text-muted md:text-sm">
          {total} {total === 1 ? "item" : "itens"}
          <span className="hidden md:inline"> {total === 1 ? "encontrado" : "encontrados"}</span>
        </p>
        <div className="hidden items-center gap-2.5 text-sm md:flex">
          <label htmlFor="ordenar-loja">Ordenar</label>
          <Select
            id="ordenar-loja"
            value={query.ordem}
            onChange={(e) => {
              const next = SORT_OPTIONS.find((o) => o.value === e.target.value);
              if (next) void setQuery({ ordem: next.value, pagina: null });
            }}
            className="w-auto bg-surface"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <BottomSheet open={sheet === "filtros"} onClose={close} title="FILTRAR">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h3 className="font-pixel text-[8px] text-yellow">COR</h3>
            <ColorSwatches
              value={draft.cores}
              onChange={(cores) => setDraft((d) => ({ ...d, cores }))}
              gapClassName="border-surface"
            />
          </div>
          {/* Price range omitted until products have prices (see ShopSidebar). */}
          <div className="border-t-2 border-border-soft pt-2">
            <Switch
              checked={draft.disponivel}
              onCheckedChange={(disponivel) => setDraft((d) => ({ ...d, disponivel }))}
              label="Só disponíveis"
            />
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              className="min-h-[52px] flex-1"
              onClick={() => setDraft((d) => ({ ...d, cores: [], disponivel: false }))}
            >
              LIMPAR
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="mr-1 mb-1 min-h-[52px] flex-[2] shadow-[4px_4px_0_var(--color-yellow)]"
              onClick={apply}
            >
              APLICAR
            </Button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "ordem"} onClose={close} title="ORDENAR">
        <div className="flex flex-col gap-5">
          <PillRadioGroup
            label="Ordenar por"
            options={SORT_OPTIONS}
            value={draft.ordem}
            onChange={(ordem) => setDraft((d) => ({ ...d, ordem }))}
            className="flex-col flex-nowrap"
            optionClassName="min-h-[52px] w-full font-mono text-[15px]"
          />
          <Button variant="primary" size="sm" className="min-h-[52px]" onClick={apply}>
            APLICAR
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
