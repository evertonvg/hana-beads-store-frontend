import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutFrame, CheckoutView } from "@/components/checkout/CheckoutView";
import type { CheckoutInitial } from "@/components/checkout/CheckoutForm";
import { getData } from "@/lib/data";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Finalizar compra | Pixel Perfect Artesanato",
  description: "Informe seus dados, a entrega e o pagamento para salvar o jogo.",
  robots: { index: false },
};

/** Who is signed in decides the pre-filled fields; it reads cookies, so it sits inside Suspense. */
async function Loader() {
  const user = await getSession().catch(() => null);
  const profile = user ? await getData().auth.profile(user.id) : null;
  const initial: CheckoutInitial = {
    user: user ? { name: user.name, email: user.email } : null,
    phone: profile?.phone ?? "",
    cpf: profile?.cpf ?? "",
    address: profile?.address ?? null,
  };
  return <CheckoutView initial={initial} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFrame />}>
      <Loader />
    </Suspense>
  );
}
