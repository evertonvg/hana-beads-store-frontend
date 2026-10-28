import type { NewsletterPort } from "@/lib/data/ports";

import { getMockStore } from "./store";

export function createMockNewsletter(): NewsletterPort {
  return {
    subscribe({ email, consentVersion }) {
      const { newsletter } = getMockStore();
      const key = email.trim().toLowerCase();
      if (newsletter.some((s) => s.email === key)) return Promise.resolve({ status: "already" });
      newsletter.push({ email: key, consentVersion });
      return Promise.resolve({ status: "ok" });
    },
  };
}
