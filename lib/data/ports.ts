import type { CartData } from "@/lib/cart/types";
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

export type AuthUser = { id: string; name: string; email: string };

export type SignUpInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: true;
  marketingEmail: boolean;
  /** Version of the Terms/Privacy text the user accepted. */
  termsVersion: string;
};

export type AuthProvider = "google" | "facebook" | "apple";

export interface AuthPort {
  /** null = wrong e-mail or password (the caller must not tell which). */
  signIn(email: string, password: string): Promise<AuthUser | null>;
  signUp(i: SignUpInput): Promise<AuthUser | { error: "email_em_uso" }>;
  signInWithProvider(p: AuthProvider): Promise<AuthUser>;
  /** Resolves the same way whether or not the e-mail has an account. */
  requestPasswordReset(email: string): Promise<void>;
  /** Turns a session cookie into a user; null if the account is gone. */
  userById(id: string): Promise<AuthUser | null>;
  savedCart(userId: string): Promise<CartData | null>;
  saveCart(userId: string, cart: CartData): Promise<void>;
}

export type Ports = {
  catalog: CatalogPort;
  newsletter: NewsletterPort;
  engagement: EngagementPort;
  shipping: ShippingPort;
  coupons: CouponPort;
  auth: AuthPort;
  // other ports are added by the tasks that use them
};
