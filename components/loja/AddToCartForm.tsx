"use client";

import { createContext, use, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PillRadioGroup } from "@/components/ui/PillRadioGroup";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/lib/cart/store";
import { RING_OPTIONS } from "@/lib/cart/types";
import type { Product, RingOption } from "@/lib/data/types";
import { CartDrawer, type LastAdded } from "./CartDrawer";
import { RING_NAME } from "./ring";
import { StockAlertButton } from "./StockAlertButton";

type Purchase = {
  product: Product;
  ring: RingOption;
  setRing: (ring: RingOption) => void;
  qty: number;
  setQty: (qty: number) => void;
  adding: boolean;
  add: () => void;
};

const PurchaseContext = createContext<Purchase | null>(null);

export function usePurchase(): Purchase {
  const ctx = use(PurchaseContext);
  if (!ctx) throw new Error("usePurchase must be used inside <PurchaseProvider>");
  return ctx;
}

/**
 * Holds the ring and quantity choice shared by the form and the mobile buy bar, adds to the
 * cart and shows the "ITEM COLETADO!" drawer.
 */
export function PurchaseProvider({ product, children }: { product: Product; children: ReactNode }) {
  const [ring, setRing] = useState<RingOption>("mosquetao");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const [addCount, setAddCount] = useState(0);
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null);
  // State updates are batched: a second click event in the same tick still sees `adding` false.
  // The ref is synchronous, so exactly one add happens per drawer cycle.
  const busy = useRef(false);

  const add = () => {
    if (busy.current) return;
    busy.current = true;
    setAdding(true);
    useCartStore.getState().add({ productId: product.id, ring, qty });
    setLastAdded({ product, ring, qty });
    setAddCount((n) => n + 1);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    busy.current = false;
    setAdding(false);
  };

  return (
    <PurchaseContext value={{ product, ring, setRing, qty, setQty, adding, add }}>
      {children}
      {lastAdded ? (
        <CartDrawer key={addCount} open={open} onClose={close} lastAdded={lastAdded} />
      ) : null}
    </PurchaseContext>
  );
}

const RING_CHOICES = RING_OPTIONS.map((value) => ({
  value,
  label: RING_NAME[value].toUpperCase(),
}));

type Props = { loggedIn: boolean; priceLabel: string };

/** Ring, quantity and "+ PEGAR ITEM" (or "AVISE-ME" when sold out). */
export function AddToCartForm({ loggedIn, priceLabel }: Props) {
  const { product, ring, setRing, qty, setQty, adding, add } = usePurchase();

  if (product.stock === 0) {
    return (
      <div className="mx-4 flex flex-col gap-3 md:mx-0">
        <StockAlertButton productId={product.id} loggedIn={loggedIn}>
          <span className="font-pixel text-[11px] text-yellow">{priceLabel}</span>
        </StockAlertButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 md:gap-7 md:px-0">
      <section aria-labelledby="argola" className="flex flex-col gap-3">
        <h2 id="argola" className="font-pixel text-[9px] md:text-[10px]">
          ARGOLA
        </h2>
        <PillRadioGroup
          label="Argola"
          options={RING_CHOICES}
          value={ring}
          onChange={setRing}
          className="grid grid-cols-2 gap-2.5 md:flex"
          optionClassName="min-h-[52px] items-center justify-center md:min-h-12 md:px-4 md:text-[10px]"
        />
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4 md:justify-start">
        <h2 className="font-pixel text-[9px] md:hidden">QUANTIDADE</h2>
        <QuantityStepper label="Quantidade" value={qty} onChange={setQty} />
        <Button
          variant="primary"
          size="lg"
          onClick={add}
          disabled={adding}
          aria-busy={adding}
          className="max-md:hidden md:min-w-[220px] md:flex-1"
        >
          + PEGAR ITEM
        </Button>
      </div>
    </div>
  );
}
