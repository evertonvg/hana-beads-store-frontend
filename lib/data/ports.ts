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

export type ShippingQuote = {
  id: string;
  service: string;
  carrier: string;
  /** null = price not defined yet (shown as the `[VALOR]` placeholder). */
  priceCents: number | null;
  /** Delivery deadline text, `"[X] dias"` while the real one is not defined. */
  days: string;
};

export type ShippingError = { error: "cep_invalido" | "cep_nao_atendido" };

export interface ShippingPort {
  quote(i: {
    cep: string;
    items: { productId: string; qty: number }[];
  }): Promise<ShippingQuote[] | ShippingError>;
}

export type CouponResult =
  | { ok: true; code: string; discountCents: number | null; label: string }
  | { ok: false; reason: "invalido" | "expirado" };

export interface CouponPort {
  validate(code: string, subtotalCents: number | null): Promise<CouponResult>;
}

export type Ports = {
  catalog: CatalogPort;
  newsletter: NewsletterPort;
  engagement: EngagementPort;
  shipping: ShippingPort;
  coupons: CouponPort;
  // other ports are added by the tasks that use them
};
