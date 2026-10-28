import type { Product } from "@/lib/data/types";
import type { ShopQuery } from "@/lib/shop-query";

export interface CatalogPort {
  list(q: ShopQuery): Promise<{
    items: Product[];
    total: number;
    page: number;
    pageCount: number;
  }>;
  bySlug(slug: string): Promise<Product | null>;
  related(productId: string, limit: number): Promise<Product[]>;
  featured(limit: number): Promise<Product[]>;
  byIds(ids: string[]): Promise<Product[]>;
}

export interface NewsletterPort {
  subscribe(input: {
    email: string;
    consent: true;
    consentVersion: string;
  }): Promise<{ status: "ok" | "already" }>;
}

export interface EngagementPort {
  /** Flips the favorite and returns the new state (true = now a favorite). */
  toggleFavorite(userId: string, productId: string): Promise<boolean>;
  favorites(userId: string): Promise<string[]>;
  requestStockAlert(i: {
    userId: string | null;
    email: string;
    productId: string;
    consentedAt: string;
  }): Promise<void>;
}

export type Ports = {
  catalog: CatalogPort;
  newsletter: NewsletterPort;
  engagement: EngagementPort;
  // other ports are added by the tasks that use them
};
