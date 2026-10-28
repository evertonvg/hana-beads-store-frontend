import type { CategoryId, ColorId } from "@/lib/data/types";
import type { ShopQuery } from "@/lib/shop-query";

export const CATEGORY_OPTIONS: { id: CategoryId | "todos"; label: string; mobileLabel?: string }[] =
  [
    { id: "todos", label: "TODOS" },
    { id: "personagens", label: "PERSONAGENS" },
    { id: "estrelas", label: "ESTRELAS" },
    { id: "iniciais", label: "INICIAIS E NÚMEROS", mobileLabel: "INICIAIS" },
    { id: "bichinhos", label: "BICHINHOS" },
    { id: "icones", label: "MINI ÍCONES" },
  ];

export const COLOR_OPTIONS: { id: ColorId; label: string; swatch: string }[] = [
  { id: "rosa", label: "Rosa", swatch: "var(--color-accent)" },
  { id: "vermelho", label: "Vermelho", swatch: "var(--color-bead-red)" },
  { id: "roxo", label: "Roxo", swatch: "var(--color-purple)" },
  { id: "laranja", label: "Laranja", swatch: "var(--color-bead-orange)" },
  { id: "verde", label: "Verde", swatch: "var(--color-bead-green)" },
  { id: "preto", label: "Preto", swatch: "var(--color-bead-black)" },
];

export const SORT_OPTIONS: { value: ShopQuery["ordem"]; label: string }[] = [
  { value: "destaque", label: "Destaques" },
  { value: "novo", label: "Novidades" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
];

/** Resets every filter (not the sort order) and goes back to page 1. */
export const CLEAR_FILTERS = {
  categoria: null,
  q: null,
  cores: null,
  disponivel: null,
  pagina: null,
} as const;
