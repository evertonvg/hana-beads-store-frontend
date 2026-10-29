import type { Metadata } from "next";
import { Suspense } from "react";
import { CartSuggestions } from "@/components/cart/CartSuggestions";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Inventário | Pixel Perfect Artesanato",
  description: "Revise os itens do seu carrinho, calcule o frete e aplique um cupom.",
  robots: { index: false },
};

export default function CarrinhoPage() {
  return (
    <CartView
      suggestions={
        <Suspense fallback={<div aria-hidden="true" className="min-h-[420px]" />}>
          <CartSuggestions />
        </Suspense>
      }
    />
  );
}
