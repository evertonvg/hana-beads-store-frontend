"use client";

import { ContactButton } from "@/components/contact/ContactButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { WaitState } from "./usePaymentStatus";

const MESSAGES: Record<Exclude<WaitState, "waiting">, string> = {
  closed: "Este pedido foi cancelado ou reembolsado e não está mais aguardando pagamento.",
  gone: "Não encontramos mais este pedido nesta sessão, então a página não consegue acompanhar o pagamento.",
  unreachable: "Não conseguimos checar o pagamento agora. Vamos tentar de novo sozinhos.",
};

type Props = {
  wait: WaitState;
  /** Text while everything is normal. */
  waiting: string;
  className?: string;
};

/** The `role="status"` line of the payment screens: waiting, cancelled, lost or unreachable. */
export function PaymentWaitNote({ wait, waiting, className }: Props) {
  return (
    <div role="status" className={cn("flex flex-col gap-3 text-[13px] md:text-sm", className)}>
      {wait === "waiting" ? (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="size-3 flex-none animate-pisca bg-yellow motion-reduce:animate-none"
          />
          <span>{waiting}</span>
        </div>
      ) : (
        <>
          <p className="m-0 text-danger-text">{MESSAGES[wait]}</p>
          <div className="flex flex-wrap items-center gap-3">
            <ContactButton kind="falar" />
            <Button href="/loja" variant="secondary" size="sm">
              VOLTAR PARA A LOJA
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
