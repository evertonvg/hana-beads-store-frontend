import type { EngagementPort } from "@/lib/data/ports";

import { getMockStore } from "./store";

export function createMockEngagement(): EngagementPort {
  return {
    toggleFavorite(userId, productId) {
      const { favorites } = getMockStore();
      const current = favorites[userId] ?? [];
      const favorite = !current.includes(productId);
      favorites[userId] = favorite
        ? [...current, productId]
        : current.filter((id) => id !== productId);
      return Promise.resolve(favorite);
    },

    favorites(userId) {
      return Promise.resolve([...(getMockStore().favorites[userId] ?? [])]);
    },

    requestStockAlert({ userId, email, productId, consentedAt }) {
      const { stockAlerts } = getMockStore();
      const key = email.trim().toLowerCase();
      if (!stockAlerts.some((a) => a.email === key && a.productId === productId)) {
        stockAlerts.push({ userId, email: key, productId, consentedAt });
      }
      return Promise.resolve();
    },
  };
}
