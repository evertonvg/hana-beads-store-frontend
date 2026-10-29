import type { Metadata } from "next";
import { AuthPage } from "@/components/conta/AuthPage";

export const metadata: Metadata = {
  title: "Criar conta | Pixel Perfect Artesanato",
  robots: { index: false },
};

export default function CadastroPage(props: PageProps<"/cadastro">) {
  return <AuthPage searchParams={props.searchParams} initialTab="criar" />;
}
