import type { NewsletterPort } from "@/lib/data/ports";

import { getMockStore } from "./store";

/** Subscribing this e-mail makes the mock reject (error-path tests). */
export const FAIL_EMAIL = "falha@teste.dev";

export function createMockNewsletter(): NewsletterPort {
  return {
    subscribe({ email, consentVersion }) {
      // Test-only switch: lets E2E exercise the server-error path.
      if (email.trim().toLowerCase() === FAIL_EMAIL) {
        return Promise.reject(new Error("mock newsletter failure"));
      }
      const { newsletter } = getMockStore();
      const key = email.trim().toLowerCase();
      if (newsletter.some((s) => s.email === key)) return Promise.resolve({ status: "already" });
      newsletter.push({ email: key, consentVersion });
      return Promise.resolve({ status: "ok" });
    },
  };
}
