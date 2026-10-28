"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleFavoriteAction, type FavoriteResult } from "@/app/(loja)/loja/actions";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = { productId: string; name: string; initialFavorite: boolean };

/** Heart toggle. Signed out, it sends the visitor to /entrar and back to this exact URL. */
export function FavoriteButton({ productId, name, initialFavorite }: Props) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      let result: FavoriteResult;
      try {
        result = await toggleFavoriteAction(productId);
      } catch {
        result = { status: "error", message: "Não foi possível agora. Tente de novo." };
      }
      if (result.status === "auth_required") {
        const here = window.location.pathname + window.location.search;
        router.push(`/entrar?next=${encodeURIComponent(here)}`);
      } else if (result.status === "ok") {
        setFavorite(result.favorite);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <button
      type="button"
      aria-label={`Favoritar ${name}`}
      aria-pressed={favorite}
      aria-busy={pending}
      onClick={toggle}
      className={cn(
        "absolute top-2 right-2 flex size-11 cursor-pointer items-center justify-center border-2 border-border bg-bg",
        "outline-offset-2 outline-cyan focus-visible:outline-[3px]",
        favorite ? "text-accent" : "text-text-subtle",
      )}
    >
      <Icon name="heart" size={18} className={favorite ? "fill-current" : undefined} />
    </button>
  );
}
