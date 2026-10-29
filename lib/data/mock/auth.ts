import type { AuthPort, AuthUser } from "@/lib/data/ports";

import type { MockUser } from "./fixtures";
import { getMockStore } from "./store";

const normalize = (email: string) => email.trim().toLowerCase();
const toUser = ({ id, name, email }: MockUser): AuthUser => ({ id, name, email });

export function createMockAuth(): AuthPort {
  return {
    signIn(email, password) {
      const user = getMockStore().users.find((u) => u.email === normalize(email));
      return Promise.resolve(user && user.password === password ? toUser(user) : null);
    },

    signUp(input) {
      const store = getMockStore();
      const email = normalize(input.email);
      if (store.users.some((u) => u.email === email)) {
        return Promise.resolve({ error: "email_em_uso" as const });
      }
      const user: MockUser = {
        id: `u${store.users.length + 1}`,
        name: input.name.trim(),
        email,
        phone: input.phone,
        password: input.password,
      };
      store.users.push(user);
      const at = new Date().toISOString();
      const version = input.termsVersion;
      store.consents.push(
        { userId: user.id, type: "terms", version, at },
        { userId: user.id, type: "privacy", version, at },
      );
      if (input.marketingEmail) {
        store.consents.push({ userId: user.id, type: "email_marketing", version, at });
      }
      return Promise.resolve(toUser(user));
    },

    signInWithProvider() {
      // The mock has no real OAuth: every provider logs in as the "ana" fixture.
      const ana = getMockStore().users.find((u) => u.id === "ana");
      return ana ? Promise.resolve(toUser(ana)) : Promise.reject(new Error("fixture ana missing"));
    },

    requestPasswordReset(email) {
      const store = getMockStore();
      const key = normalize(email);
      if (store.users.some((u) => u.email === key)) store.passwordResets.push(key);
      return Promise.resolve();
    },

    userById(id) {
      const user = getMockStore().users.find((u) => u.id === id);
      return Promise.resolve(user ? toUser(user) : null);
    },

    savedCart(userId) {
      const cart = getMockStore().savedCarts[userId];
      return Promise.resolve(cart ? structuredClone(cart) : null);
    },

    saveCart(userId, cart) {
      getMockStore().savedCarts[userId] = structuredClone(cart);
      return Promise.resolve();
    },
  };
}
