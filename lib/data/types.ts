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
