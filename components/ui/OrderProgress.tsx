import { cn } from "@/lib/cn";

type Props = {
  step: 0 | 1 | 2 | 3 | 4;
  /** Fill color of the completed segments. */
  color: string;
  labels?: [string, string, string, string];
};

const DEFAULT_LABELS: [string, string, string, string] = [
  "Pago",
  "Produção",
  "Enviado",
  "Entregue",
];
const EMPTY = "#2C2840";

/** Four-phase order progress bar. */
export function OrderProgress({ step, color, labels = DEFAULT_LABELS }: Props) {
  return (
    <div
      role="progressbar"
      aria-label="Progresso do pedido"
      aria-valuemin={0}
      aria-valuemax={4}
      aria-valuenow={step}
      aria-valuetext={step === 0 ? undefined : labels[step - 1]}
      className="grid grid-cols-4 gap-1.5"
    >
      {labels.map((name, i) => {
        const done = i < step;
        return (
          <div key={name} className="flex flex-col gap-2">
            <div data-segment className="h-2.5" style={{ background: done ? color : EMPTY }} />
            <span className={cn("text-[11px]", done ? "text-text" : "text-phase-off-text")}>
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
