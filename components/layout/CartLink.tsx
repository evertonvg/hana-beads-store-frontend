"use client";

import Link from "next/link";
import { useCartCount } from "@/components/cart/CartCount";
import { focusRing } from "@/components/ui/focus";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = { variant: "desktop" | "mobile" };

/** Header cart button. Client island: it reads the cart count. */
export function CartLink({ variant }: Props) {
  const count = useCartCount();

  if (variant === "desktop") {
    return (
      <Link
        href="/carrinho"
        className={cn(
          "inline-flex min-h-11 items-center bg-yellow px-4 py-3.5 font-pixel text-[10px] text-bg shadow-hard-sm",
          focusRing,
        )}
      >
        CARRINHO [{count}]
      </Link>
    );
  }

  return (
    <Link
      href="/carrinho"
      aria-label={`Carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
      className={cn(
        "relative flex size-12 items-center justify-center bg-yellow text-bg shadow-[3px_3px_0_var(--color-accent)]",
        focusRing,
      )}
    >
      <Icon name="cart" size={22} />
      <span
        aria-hidden
        className="absolute -top-2 -right-2 flex h-[22px] min-w-[22px] items-center justify-center bg-accent font-pixel text-[9px] text-bg"
      >
        {count}
      </span>
    </Link>
  );
}
