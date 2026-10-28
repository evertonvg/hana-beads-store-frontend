import { describe, expect, it } from "vitest";

import { productFixtures } from "@/lib/data/mock/fixtures";
import type { Product } from "@/lib/data/types";
import {
  filterProducts,
  loadShopQuery,
  serializeShopQuery,
  type ShopQuery,
} from "@/lib/shop-query";

const defaults: ShopQuery = {
  categoria: "todos",
  q: "",
  cores: [],
  disponivel: false,
  ordem: "destaque",
  pagina: 1,
};
const fixtures = [...productFixtures];
const slugs = (ps: Product[]) => ps.map((p) => p.slug);
const withPrice = (priceCents: number | null, i: number): Product => ({
  ...fixtures[0],
  id: `t${i}`,
  slug: `t${i}`,
  priceCents,
});

describe("loadShopQuery", () => {
  it("falls back to defaults for invalid values", () => {
    expect(loadShopQuery("?pagina=-3&ordem=xpto&cor=azul&categoria=nada")).toEqual(defaults);
  });

  it("parses comma-separated colors from the cor key", () => {
    expect(loadShopQuery("?cor=rosa,roxo").cores).toEqual(["rosa", "roxo"]);
  });

  it("truncates q to 80 chars", () => {
    expect(loadShopQuery(`?q=${"a".repeat(500)}`).q).toHaveLength(80);
  });
});

describe("serializeShopQuery", () => {
  it("emits only non-default params", () => {
    const url = serializeShopQuery("/loja", {
      categoria: "estrelas",
      ordem: "menor",
    });
    const params = new URLSearchParams(url.split("?")[1]);
    expect([...params.entries()]).toEqual([
      ["categoria", "estrelas"],
      ["ordem", "menor"],
    ]);
  });
});

describe("filterProducts", () => {
  it("searches accent- and case-insensitively", () => {
    expect(slugs(filterProducts(fixtures, { ...defaults, q: "coracao" }))).toEqual([
      "coracao-pixel",
      "coracao-inicial",
    ]);
    expect(filterProducts(fixtures, { ...defaults, q: "MINI ICONES" })).toHaveLength(5);
  });

  it("intersects colors with availability", () => {
    expect(
      filterProducts(fixtures, {
        ...defaults,
        cores: ["roxo"],
        disponivel: true,
      }),
    ).toEqual([]);
    expect(slugs(filterProducts(fixtures, { ...defaults, cores: ["roxo"] }))).toEqual([
      "planeta-pixel",
    ]);
  });

  it("filters by category", () => {
    expect(slugs(filterProducts(fixtures, { ...defaults, categoria: "bichinhos" }))).toEqual([
      "gatinho-pixel",
    ]);
  });

  it("puts new products first for ordem=novo", () => {
    const out = slugs(filterProducts(fixtures, { ...defaults, ordem: "novo" }));
    expect(out.slice(0, 2)).toEqual(["sorvete-pixel", "gatinho-pixel"]);
  });

  it("sorts prices with null last in both directions", () => {
    const ps = [withPrice(500, 1), withPrice(null, 2), withPrice(200, 3)];
    const prices = (ordem: ShopQuery["ordem"]) =>
      filterProducts(ps, { ...defaults, ordem }).map((p) => p.priceCents);
    expect(prices("menor")).toEqual([200, 500, null]);
    expect(prices("maior")).toEqual([500, 200, null]);
  });

  it("orders destaque by rank, nulls last, then name", () => {
    const a = { ...withPrice(1, 1), name: "B", featuredRank: null };
    const b = { ...withPrice(1, 2), name: "A", featuredRank: null };
    const c = { ...withPrice(1, 3), name: "Z", featuredRank: 1 };
    expect(slugs(filterProducts([a, b, c], defaults))).toEqual(["t3", "t2", "t1"]);
  });

  it("does not mutate the input", () => {
    const before = slugs(fixtures);
    filterProducts(fixtures, { ...defaults, ordem: "maior" });
    expect(slugs(fixtures)).toEqual(before);
  });
});
