"use client";

import Image from "next/image";
import { useState } from "react";
import { BeadArt } from "@/components/pixel/BeadArt";
import { Badge } from "@/components/ui/Badge";
import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/data/types";

const MAX_PHOTOS = 4;

const RARITY_LABEL = { epico: "★★★ ÉPICO", raro: "★★ RARO" } as const;

function BigArt({ art }: { art: NonNullable<Product["art"]> }) {
  const props = { rows: art.rows, palette: art.palette, label: art.alt };
  return (
    <div className="relative">
      <div className="md:hidden">
        <BeadArt {...props} cell={28} gap={3} />
      </div>
      <div className="hidden md:block">
        <BeadArt {...props} cell={40} gap={4} />
      </div>
      {art.letter ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pb-[10%] font-pixel text-[40px] text-white [text-shadow:2px_2px_0_var(--color-bg)] md:text-[64px]"
        >
          {art.letter}
        </span>
      ) : null}
    </div>
  );
}

type Props = { product: Product };

/** Main picture (or large bead art) with rarity badge and up to four thumbnails. */
export function ProductGallery({ product }: Props) {
  const photos = product.images.slice(0, MAX_PHOTOS);
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  const rarity = product.rarity === "comum" || product.rarity === null ? null : product.rarity;
  const soldOut = product.stock === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative bg-surface-2 md:border-4 md:border-text md:p-4 md:shadow-hard-lg">
        <span className="absolute top-3.5 left-3.5 z-10 flex flex-col items-start gap-1.5 md:top-7 md:left-7">
          {rarity ? (
            <span className="bg-bg px-2.5 py-2 font-pixel text-[8px] text-yellow md:text-[9px]">
              {RARITY_LABEL[rarity]}
            </span>
          ) : null}
          {soldOut ? <Badge tone="muted">ESGOTADO</Badge> : null}
        </span>
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-deep md:aspect-auto md:h-[560px]">
          {photo ? (
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              priority
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover"
            />
          ) : product.art ? (
            <BigArt art={product.art} />
          ) : null}
        </div>
      </div>
      {photos.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 px-4 md:px-0">
          {photos.map((p, i) => (
            <button
              key={p.url}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-20 cursor-pointer overflow-hidden border-[3px] bg-surface-2 p-0 md:h-24",
                i === index ? "border-accent" : "border-border",
                focusRing,
              )}
            >
              <Image src={p.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
