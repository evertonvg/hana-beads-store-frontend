"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "INÍCIO", icon: "home" },
  { href: "/loja", label: "LOJA", icon: "shop" },
  { href: "/encomendas", label: "ENCOMENDA", icon: "send" },
  { href: "/conta", label: "CONTA", icon: "user" },
];

/** Routes with their own fixed buy bar: the tab bar steps aside. */
const HIDDEN_ON = ["/produto/", "/carrinho", "/checkout", "/pedido/"];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Bottom navigation (mobile only). Sticky at the end of the page flow, so it never covers
 * content. `aria-current="page"` marks the active tab.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <nav
      aria-label="Atalhos"
      className="sticky bottom-0 z-10 grid grid-cols-4 border-t-[3px] border-text bg-surface md:hidden"
    >
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-col items-center gap-1.5 px-1 pt-2.5 pb-3 font-pixel text-[7px] outline-offset-[-4px] outline-cyan focus-visible:outline-[3px]",
              active ? "text-accent" : "text-text",
            )}
          >
            <Icon name={tab.icon} size={22} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
