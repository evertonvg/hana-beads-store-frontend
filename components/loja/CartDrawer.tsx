"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BeadArt } from "@/components/pixel/BeadArt";
import { FreeShippingBar } from "@/components/cart/FreeShippingBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Drawer } from "@/components/ui/Drawer";
import { Button, buttonVariants } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart/store";
import { computeTotals, type PricedLine } from "@/lib/cart/totals";
import type { Product, RingOption } from "@/lib/data/types";
import { formatTotal } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";
import { RING_NAME } from "./ring";

export type LastAdded = { product: Product; ring: RingOption; qty: number };

type Props = { open: boolean; onClose: () => void; lastAdded: LastAdded };

function unitCents(product: Product, ring: RingOption): number | null {
  if (product.priceCents === null) return null;
  const delta = product.options.find((o) => o.value === ring)?.priceDeltaCents ?? 0;
  return product.priceCents + delta;
}

function Thumb({ product }: { product: Product }) {
  const photo = product.images[0];
  return (
    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden border-2 border-text bg-deep md:size-[72px]">
      {photo ? (
        <Image
          src={photo.url}
          alt={photo.alt}
          width={72}
          height={72}
          className="size-full object-cover"
        />
      ) : product.art ? (
        <BeadArt
          rows={product.art.rows}
          palette={product.art.palette}
          cell={6}
          gap={1}
          label={product.art.alt}
        />
      ) : null}
    </div>
  );
}

const ARM_DELAY_MS = 400;

const actionClass = "w-full";

/** "ITEM COLETADO!": side drawer on desktop, bottom sheet on mobile. */
export function CartDrawer({ open, onClose, lastAdded }: Props) {
  const desktop = useMediaQuery("(min-width: 768px)");
  // A fast double click on "+ PEGAR ITEM" lands its second click where the drawer now is. For a
  // moment the panel ignores the pointer and the backdrop does not dismiss it; Escape always does.
  const [armed, setArmed] = useState(false);
  const armedRef = useRef(false);
  useEffect(() => {
    const arm = () => {
      armedRef.current = true;
      setArmed(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") armedRef.current = true;
    };
    const t = setTimeout(arm, ARM_DELAY_MS);
    window.addEventListener("keydown", onKey, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);
  const dismiss = () => {
    if (armedRef.current) onClose();
  };
  const lines = useCartStore((s) => s.lines);
  const itemCount = useCartStore((s) => s.count());
  const { product, ring, qty } = lastAdded;

  // Only this page's product is loaded: with any other line the subtotal is unknown.
  const onlyThisProduct = lines.every((l) => l.productId === product.id);
  const priced: PricedLine[] = onlyThisProduct
    ? lines.map((l) => {
        const unit = unitCents(product, l.ring);
        return {
          ...l,
          product,
          unitCents: unit,
          lineCents: unit === null ? null : unit * l.qty,
        };
      })
    : [];
  const subtotal = onlyThisProduct ? computeTotals(priced, 0, 0).subtotalCents : null;

  const body = (
    <div className={cn("flex min-h-full flex-col gap-4", !armed && "pointer-events-none")}>
      <p className="font-pixel text-[8px] text-yellow md:text-[9px]">+{qty} NO INVENTÁRIO</p>
      <div className="flex items-center gap-3 border-[3px] border-accent bg-surface-2 p-2.5 md:gap-3.5 md:p-3">
        <Thumb product={product} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="font-pixel text-[9px] leading-normal md:text-[10px]">
            {product.name}
          </span>
          <span className="text-xs text-text-muted">
            Argola: {RING_NAME[ring]} · <span>×{qty}</span>
          </span>
        </div>
      </div>
      <FreeShippingBar subtotalCents={subtotal} />
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-pixel text-[9px] md:text-[10px]">
            SUBTOTAL · {itemCount} {itemCount === 1 ? "ITEM" : "ITENS"}
          </span>
          <span className="font-pixel text-[11px] text-yellow md:text-xs">
            {formatTotal(subtotal)}
          </span>
        </div>
        <Link
          href="/checkout"
          className={cn(
            buttonVariants({ variant: "primary" }),
            actionClass,
            "shadow-[4px_4px_0_var(--color-yellow)]",
          )}
        >
          FINALIZAR COMPRA ›
        </Link>
        <Button href="/carrinho" variant="secondary" className={actionClass}>
          VER CARRINHO
        </Button>
        <Button variant="ghost" onClick={onClose} className={cn(actionClass, "no-underline")}>
          ‹ CONTINUAR JOGANDO
        </Button>
      </div>
    </div>
  );

  return desktop ? (
    <Drawer open={open} onClose={dismiss} title="ITEM COLETADO!">
      {body}
    </Drawer>
  ) : (
    <BottomSheet open={open} onClose={dismiss} title="ITEM COLETADO!">
      {body}
    </BottomSheet>
  );
}
