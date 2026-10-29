import type { Metadata } from "next";
import { AuthPage } from "@/components/conta/AuthPage";

export const metadata: Metadata = {
  title: "Entrar | Pixel Perfect Artesanato",
  robots: { index: false },
};

export default function EntrarPage(props: PageProps<"/entrar">) {
  return <AuthPage searchParams={props.searchParams} initialTab="entrar" />;
}
