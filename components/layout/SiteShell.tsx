import { Suspense, type ReactNode } from "react";
import { getSession } from "@/lib/session";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileTabBar, MobileTabBarFallback } from "./MobileTabBar";

/**
 * Header, `<main id="conteudo">`, footer and mobile tab bar: the chrome of every page except the
 * checkout, which has its own minimal one (`app/(checkout)/layout.tsx`).
 */
export function SiteShell({ children }: { children: ReactNode }) {
  // Not awaited here: only the small account bits inside Suspense wait for it, so the header
  // itself stays in the static shell and hydrates with the page.
  // A failed lookup counts as signed out: a rejection would break every page that reads it.
  const session = getSession()
    .then((user) => (user ? { name: user.name } : null))
    .catch(() => null);
  return (
    <>
      <Header session={session} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
      <Suspense fallback={<MobileTabBarFallback />}>
        <MobileTabBar />
      </Suspense>
    </>
  );
}
