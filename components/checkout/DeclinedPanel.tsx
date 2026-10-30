import { ContactButton } from "@/components/contact/ContactButton";
import { Button } from "@/components/ui/Button";
import { DeclinedCountdown } from "./DeclinedCountdown";
import { SwitchToPixButton } from "./SwitchToPixButton";

const REASONS = [
  "Algum dado do cartão foi digitado errado (número, validade ou código de segurança).",
  "Limite insuficiente ou cartão bloqueado para compras online.",
  "O banco pediu uma confirmação no app e ela não foi feita.",
];

/** Declined card, "CONTINUE?" (Falha.dc.html). The cart is kept: nothing here touches it. */
export function DeclinedPanel({ orderId }: { orderId: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-7 px-4 pt-8 pb-24 text-center md:gap-8 md:px-6 md:pt-[72px]">
      <div className="flex flex-col items-center gap-[18px]">
        <p className="m-0 font-pixel text-[9px] leading-relaxed text-danger-text md:text-[10px]">
          PAGAMENTO NÃO APROVADO
        </p>
        <h1 className="m-0 font-pixel text-2xl leading-snug md:text-[40px] md:leading-snug">
          CONTINUE?
        </h1>
        <DeclinedCountdown />
        <p className="m-0 max-w-[560px] text-base leading-relaxed text-text-muted md:text-[17px]">
          Calma, ainda não é game over. O banco não aprovou o pagamento, mas seu carrinho continua
          salvo e dá para tentar de novo agora.
        </p>
      </div>

      <section
        aria-labelledby="motivos"
        className="flex w-full flex-col gap-[18px] border-[3px] border-text bg-surface-2 p-[18px] text-left shadow-[6px_6px_0_var(--color-danger)] md:border-4 md:p-7 md:shadow-[12px_12px_0_var(--color-danger)]"
      >
        <h2 id="motivos" className="m-0 font-pixel text-[11px] text-yellow">
          O QUE PODE TER ACONTECIDO
        </h2>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-normal text-text-muted">
          {REASONS.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <p className="m-0 text-[13px] text-text-subtle">
          Código do retorno: [código do intermediador]
        </p>
      </section>

      <div className="flex flex-wrap items-start justify-center gap-3.5">
        <Button href="/checkout" variant="primary" size="lg">
          TENTAR DE NOVO
        </Button>
        <SwitchToPixButton
          orderId={orderId}
          variant="secondary"
          className="min-h-14 px-5 py-4 text-[11px]"
        />
      </div>

      <div className="flex flex-col items-center gap-3 text-sm text-text-muted">
        <p className="m-0">Continua dando erro?</p>
        <ContactButton kind="falar" />
      </div>
    </div>
  );
}
