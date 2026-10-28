import type { Product } from "@/lib/data/types";

import { productFixtures } from "./fixtures";

export type MockStore = {
  products: Product[];
  newsletter: { email: string; consentVersion: string }[];
  /** userId -> favorite product ids, in the order they were added. */
  favorites: Record<string, string[]>;
  stockAlerts: { userId: string | null; email: string; productId: string; consentedAt: string }[];
  reset(): void;
};

declare global {
  var __ppMock: MockStore | undefined;
}

function createStore(): MockStore {
  const store: MockStore = {
    products: structuredClone([...productFixtures]),
    newsletter: [],
    favorites: {},
    stockAlerts: [],
    reset() {
      store.products = structuredClone([...productFixtures]);
      store.newsletter = [];
      store.favorites = {};
      store.stockAlerts = [];
    },
  };
  return store;
}

/** Singleton on globalThis so state survives HMR and shared module graphs. */
export function getMockStore(): MockStore {
  globalThis.__ppMock ??= createStore();
  return globalThis.__ppMock;
}
