import {
  createLoader,
  createParser,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsStringLiteral,
} from "nuqs/server";

import {
  CATEGORY_IDS,
  COLOR_IDS,
  type CategoryId,
  type ColorId,
  type Product,
} from "@/lib/data/types";

export const PAGE_SIZE = 12;

export type ShopQuery = {
  categoria: CategoryId | "todos";
  q: string;
  cores: ColorId[];
  disponivel: boolean;
  ordem: "destaque" | "novo" | "menor" | "maior";
  pagina: number;
};

const Q_MAX = 80;

const parseAsSearch = createParser({
  parse: (value) => {
    const q = value.trim().slice(0, Q_MAX).trim();
    return q === "" ? null : q;
  },
  serialize: (value) => value,
});

const parseAsPage = createParser({
  parse: (value) => {
    if (!/^\d+$/.test(value)) return null;
    const n = Number(value);
    return Number.isSafeInteger(n) && n >= 1 ? n : null;
  },
  serialize: (value) => String(value),
});

export const shopParsers = {
  categoria: parseAsStringLiteral(["todos", ...CATEGORY_IDS] as const).withDefault("todos"),
  q: parseAsSearch.withDefault(""),
  cores: parseAsArrayOf(parseAsStringLiteral(COLOR_IDS), ",").withDefault([]),
  disponivel: parseAsBoolean.withDefault(false),
  ordem: parseAsStringLiteral(["destaque", "novo", "menor", "maior"] as const).withDefault(
    "destaque",
  ),
  pagina: parseAsPage.withDefault(1),
};

export const shopUrlKeys = { cores: "cor" } as const;

export const loadShopQuery = createLoader(shopParsers, {
  urlKeys: shopUrlKeys,
});

export const serializeShopQuery = createSerializer(shopParsers, {
  urlKeys: shopUrlKeys,
});

/** Lowercase and strip diacritics so "coracao" matches "CORAÇÃO". */
function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function nullsLast(a: number | null, b: number | null, direction: 1 | -1): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * direction;
}

export function filterProducts(all: Product[], q: ShopQuery): Product[] {
  const needle = normalize(q.q.trim());
  const filtered = all.filter(
    (p) =>
      (q.categoria === "todos" || p.categories.includes(q.categoria)) &&
      (needle === "" ||
        normalize(p.name).includes(needle) ||
        normalize(p.categoryLabel).includes(needle)) &&
      (q.cores.length === 0 || p.colors.some((c) => q.cores.includes(c))) &&
      (!q.disponivel || p.stock > 0),
  );

  // filter() returned a fresh array and sort is stable: ties keep catalog order.
  switch (q.ordem) {
    case "novo":
      return filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "menor":
      return filtered.sort((a, b) => nullsLast(a.priceCents, b.priceCents, 1));
    case "maior":
      return filtered.sort((a, b) => nullsLast(a.priceCents, b.priceCents, -1));
    case "destaque":
      return filtered.sort(
        (a, b) =>
          nullsLast(a.featuredRank, b.featuredRank, 1) || a.name.localeCompare(b.name, "pt-BR"),
      );
  }
}
