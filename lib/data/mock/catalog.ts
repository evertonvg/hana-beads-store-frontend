import type { CatalogPort } from "@/lib/data/ports";
import type { Product } from "@/lib/data/types";
import { filterProducts, PAGE_SIZE } from "@/lib/shop-query";

import { getMockStore } from "./store";

export function createMockCatalog(): CatalogPort {
  const all = () => getMockStore().products;

  return {
    list(q) {
      const filtered = filterProducts(all(), q);
      const total = filtered.length;
      const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const page = Math.min(Math.max(1, q.pagina), pageCount);
      const start = (page - 1) * PAGE_SIZE;
      return Promise.resolve({
        items: filtered.slice(start, start + PAGE_SIZE),
        total,
        page,
        pageCount,
      });
    },

    bySlug(slug) {
      return Promise.resolve(all().find((p) => p.slug === slug) ?? null);
    },

    related(productId, limit) {
      const current = all().find((p) => p.id === productId);
      if (!current) return Promise.resolve([]);
      const others = all().filter((p) => p.id !== productId);
      const shares = (p: Product) => p.categories.some((c) => current.categories.includes(c));
      // same-category products first, then the rest in catalog order
      const ordered = [...others.filter(shares), ...others.filter((p) => !shares(p))];
      return Promise.resolve(ordered.slice(0, Math.max(0, limit)));
    },

    featured(limit) {
      const ranked = all()
        .filter((p) => p.featuredRank !== null)
        .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0));
      return Promise.resolve(ranked.slice(0, Math.max(0, limit)));
    },

    byIds(ids) {
      return Promise.resolve(ids.flatMap((id) => all().filter((p) => p.id === id)));
    },
  };
}
