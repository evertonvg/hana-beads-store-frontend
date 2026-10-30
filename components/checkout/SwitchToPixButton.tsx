"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { switchToPixAction } from "@/app/(checkout)/pedido/[id]/actions";
import { Button } from "@/components/ui/Button";

type Props = {
  orderId: string;
  variant: "primary" | "secondary";
  className?: string;
};

/** Pays the same order with Pix instead of the card or the boleto. */
export function SwitchToPixButton({ orderId, variant, className }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function switchToPix() {
    setError(null);
    startTransition(async () => {
      const result = await switchToPixAction(orderId).catch(
        () => ({ status: "error", message: "Não foi possível agora. Tente de novo." }) as const,
      );
      if (result.status === "ok") router.refresh();
      else setError(result.message);
    });
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={variant}
        onClick={switchToPix}
        disabled={pending}
        aria-busy={pending}
        className={className}
      >
        PAGAR COM PIX
      </Button>
      {error ? (
        <p role="alert" className="text-[13px] text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
