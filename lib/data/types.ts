export type Rarity = "comum" | "raro" | "epico";

export const COLOR_IDS = ["rosa", "vermelho", "roxo", "laranja", "verde", "preto"] as const;
export type ColorId = (typeof COLOR_IDS)[number];

export const CATEGORY_IDS = ["personagens", "estrelas", "iniciais", "bichinhos", "icones"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type RingOption = "mosquetao" | "estrela";

export type ProductImage = { url: string; alt: string };

export type BeadArtSpec = {
  rows: string[];
  palette: Record<string, string>;
  letter?: string;
  /** Accessible label (illustrative products have no photo alt). */
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number | null;
  rarity: Rarity | null;
  isNew: boolean;
  stock: number;
  categories: CategoryId[];
  categoryLabel: string;
  colors: ColorId[];
  images: ProductImage[];
  art: BeadArtSpec | null;
  illustrative: boolean;
  sizeCm: number | null;
  beadCount: number | null;
  cuteness: "MAX";
  options: { type: "argola"; value: RingOption; priceDeltaCents: number }[];
  featuredRank: number | null;
};

export type OrderStatus =
  | "aguardando_aprovacao"
  | "aguardando_pagamento"
  | "pago"
  | "em_producao"
  | "enviado"
  | "entregue"
  | "cancelado"
  | "reembolsado";

export type PaymentMethod = "pix" | "cartao" | "boleto";

export type Address = {
  id?: string;
  label?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isDefault?: boolean;
};

export type Customer = { name: string; email: string; phone: string; cpf: string };

// Refined by the payment task (Pix code, boleto line, card brand...).
export type PixPayment = { kind: "pix" } & Record<string, unknown>;
export type BoletoPayment = { kind: "boleto" } & Record<string, unknown>;
export type CardPayment = { kind: "cartao" } & Record<string, unknown>;

export type OrderItem = {
  productId: string | null;
  name: string;
  ring: RingOption;
  unitPriceCents: number | null;
  qty: number;
  image: ProductImage | null;
};

export type Order = {
  id: string;
  number: string;
  userId: string | null;
  guestToken: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotalCents: number | null;
  shippingCents: number | null;
  discountCents: number;
  totalCents: number | null;
  shippingAddress: Address;
  customer: Customer;
  shippingService: string;
  trackingCode: string | null;
  isCustom: boolean;
  createdAt: string;
  events: { status: OrderStatus; at: string; note?: string }[];
  payment: PixPayment | BoletoPayment | CardPayment;
};
