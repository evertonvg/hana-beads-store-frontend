import { beforeEach, describe, expect, it } from "vitest";

import { createMockCatalog } from "@/lib/data/mock/catalog";
import { productFixtures } from "@/lib/data/mock/fixtures";
import { getMockStore } from "@/lib/data/mock/store";
import { PAGE_SIZE, type ShopQuery } from "@/lib/shop-query";

const defaults: ShopQuery = {
  categoria: "todos",
  q: "",
  cores: [],
  disponivel: false,
  ordem: "destaque",
  pagina: 1,
};
const catalog = createMockCatalog();

beforeEach(() => getMockStore().reset());

describe("fixtures", () => {
  it("has 9 products, all without price, 3 with photos", () => {
    expect(productFixtures).toHaveLength(9);
    expect(productFixtures.every((p) => p.priceCents === null)).toBe(true);
    expect(productFixtures.filter((p) => !p.illustrative)).toHaveLength(3);
    expect(productFixtures.find((p) => p.slug === "planeta-pixel")?.stock).toBe(0);
  });
});

describe("fixture invariants", () => {
  it("illustrative <=> no images, with art and alt", () => {
    const rows = productFixtures.map((p) => ({
      slug: p.slug,
      illustrative: p.illustrative,
      noImages: p.images.length === 0,
      artAlt: p.art?.alt.length ?? 0,
      emptyUrls: p.images.filter((i) => i.url === "").length,
    }));
    for (const r of rows) {
      expect(r.illustrative).toBe(r.noImages);
      expect(r.emptyUrls).toBe(0);
    }
    expect(rows.filter((r) => r.illustrative && r.artAlt === 0)).toEqual([]);
  });

  it("does not share arrays between products after reset", () => {
    const store = getMockStore();
    store.reset();
    store.products[0]?.options.push({ type: "argola", value: "estrela", priceDeltaCents: 1 });
    expect(store.products[1]?.options).toEqual([]);
    store.reset();
    expect(store.products[0]?.options).toEqual([]);
  });
});

describe("catalog.list", () => {
  it("returns all fixtures on a single page", async () => {
    const r = await catalog.list(defaults);
    expect(r).toMatchObject({ total: 9, page: 1, pageCount: 1 });
    expect(r.items).toHaveLength(9);
  });

  it("paginates by PAGE_SIZE and clamps out-of-range pages", async () => {
    const store = getMockStore();
    store.products = Array.from({ length: PAGE_SIZE + 3 }, (_, i) => ({
      ...productFixtures[0],
      id: `p${i}`,
      slug: `p${i}`,
      featuredRank: i,
    }));
    const p1 = await catalog.list(defaults);
    expect(p1.items).toHaveLength(PAGE_SIZE);
    expect(p1.pageCount).toBe(2);
    const p2 = await catalog.list({ ...defaults, pagina: 2 });
    expect(p2.items).toHaveLength(3);
    const p9 = await catalog.list({ ...defaults, pagina: 9 });
    expect(p9.page).toBe(2);
    expect(p9.items).toHaveLength(3);
  });

  it("reports an empty result as one empty page", async () => {
    const r = await catalog.list({ ...defaults, q: "zzz" });
    expect(r).toEqual({ items: [], total: 0, page: 1, pageCount: 1 });
  });
});

describe("catalog lookups", () => {
  it("bySlug returns null for unknown slugs", async () => {
    expect(await catalog.bySlug("inexistente")).toBeNull();
    expect((await catalog.bySlug("garota-pixel"))?.id).toBe("garota");
  });

  it("related excludes the product itself and respects limit", async () => {
    const r = await catalog.related("coracao", 4);
    expect(r).toHaveLength(4);
    expect(r.some((p) => p.id === "coracao")).toBe(false);
    expect(r[0].categories).toContain("icones");
  });

  it("featured is ordered by rank", async () => {
    const r = await catalog.featured(3);
    expect(r.map((p) => p.slug)).toEqual(["garota-pixel", "estrela-numero", "estrela-inicial"]);
  });

  it("byIds returns matching products", async () => {
    const r = await catalog.byIds(["cacto", "nope"]);
    expect(r.map((p) => p.slug)).toEqual(["cacto-pixel"]);
  });
});

describe("mock store", () => {
  it("reset discards mutations", async () => {
    getMockStore().products[0].stock = 99;
    getMockStore().reset();
    expect((await catalog.bySlug("garota-pixel"))?.stock).toBe(5);
    expect(productFixtures[0].stock).toBe(5);
  });
});
