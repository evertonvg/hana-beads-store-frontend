import type { CartData } from "@/lib/cart/types";
import type { Order, Product } from "@/lib/data/types";

import { productFixtures, savedCartFixtures, userFixtures, type MockUser } from "./fixtures";

export type MockConsent = {
  userId: string;
  type: "terms" | "privacy" | "email_marketing";
  version: string;
  at: string;
};

export type MockStore = {
  products: Product[];
  newsletter: { email: string; consentVersion: string }[];
  /** userId -> favorite product ids, in the order they were added. */
  favorites: Record<string, string[]>;
  stockAlerts: { userId: string | null; email: string; productId: string; consentedAt: string }[];
  users: MockUser[];
  consents: MockConsent[];
  /** userId -> cart saved on the server (merged with the guest cart at sign-in). */
  savedCarts: Record<string, CartData>;
  /** E-mails a password-reset link would have been sent to (accounts that exist only). */
  passwordResets: string[];
  orders: Order[];
  /** idempotency key -> id of the order it created. */
  orderKeys: Record<string, string>;
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
    users: structuredClone([...userFixtures]),
    consents: [],
    savedCarts: structuredClone(savedCartFixtures),
    passwordResets: [],
    orders: [],
    orderKeys: {},
    reset() {
      store.products = structuredClone([...productFixtures]);
      store.newsletter = [];
      store.favorites = {};
      store.stockAlerts = [];
      store.users = structuredClone([...userFixtures]);
      store.consents = [];
      store.savedCarts = structuredClone(savedCartFixtures);
      store.passwordResets = [];
      store.orders = [];
      store.orderKeys = {};
    },
  };
  return store;
}

/** Singleton on globalThis so state survives HMR and shared module graphs. */
export function getMockStore(): MockStore {
  globalThis.__ppMock ??= createStore();
  return globalThis.__ppMock;
}
