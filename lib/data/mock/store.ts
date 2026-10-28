import type { Product } from "@/lib/data/types";

import { productFixtures } from "./fixtures";

export type MockStore = {
  products: Product[];
  newsletter: { email: string; consentVersion: string }[];
  reset(): void;
};

declare global {
  var __ppMock: MockStore | undefined;
}

function createStore(): MockStore {
  const store: MockStore = {
    products: structuredClone([...productFixtures]),
    newsletter: [],
    reset() {
      store.products = structuredClone([...productFixtures]);
      store.newsletter = [];
    },
  };
  return store;
}

/** Singleton on globalThis so state survives HMR and shared module graphs. */
export function getMockStore(): MockStore {
  globalThis.__ppMock ??= createStore();
  return globalThis.__ppMock;
}
