import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import { Suspense } from "react";
import { ConsentScripts } from "@/components/layout/ConsentScripts";
import { CookieConsentBanner } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileTabBar, MobileTabBarFallback } from "@/components/layout/MobileTabBar";
import { getSession } from "@/lib/session";
import { Providers } from "./providers";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel-face",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-face",
});

export const metadata: Metadata = {
  title: "Pixel Perfect Artesanato",
  description: "Loja online de artesanato em continhas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Not awaited here: only the small account bits inside Suspense wait for it, so the header
  // itself stays in the static shell and hydrates with the page.
  const session = getSession().then((user) => (user ? { name: user.name } : null));
  return (
    <html lang="pt-BR" className={`${pixel.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-yellow focus:px-4 focus:py-3 focus:font-pixel focus:text-[10px] focus:text-bg focus:outline-[3px] focus:outline-cyan"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <Header session={session} />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
          <Suspense fallback={<MobileTabBarFallback />}>
            <MobileTabBar />
          </Suspense>
        </Providers>
        <CookieConsentBanner />
        <ConsentScripts />
      </body>
    </html>
  );
}
