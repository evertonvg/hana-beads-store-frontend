import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";

const STEPS = [
  { href: "#dados", label: "DADOS", short: "Dados" },
  { href: "#entrega", label: "ENTREGA", short: "Entrega" },
  { href: "#pagamento", label: "PAGAMENTO", short: "Pagamento" },
] as const;

/**
 * "1 DADOS · 2 ENTREGA · 3 PAGAMENTO": a visual guide to the sections of the single form, each
 * step an anchor to its section (nothing is lost moving between them). Desktop shows the
 * pills of the design; mobile shows the three bars.
 */
export function CheckoutSteps() {
  return (
    <nav aria-label="Etapas do pedido">
      <ol className="m-0 grid list-none grid-cols-3 gap-1.5 p-0 md:flex md:flex-wrap md:gap-2">
        {STEPS.map((step, i) => (
          <li key={step.href} className="flex">
            <a
              href={step.href}
              className={cn(
                "flex min-h-11 w-full flex-col justify-end gap-1.5 text-text no-underline",
                "md:justify-center md:px-3.5 md:py-3 md:font-pixel md:text-[9px]",
                i === 0 && "md:bg-yellow md:text-bg",
                i === 1 && "md:bg-accent md:text-bg",
                i === 2 && "md:border-2 md:border-border md:px-3 md:py-2.5 md:text-text-muted",
                focusRing,
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2 md:hidden",
                  i === 0 && "bg-yellow",
                  i === 1 && "bg-accent",
                  i === 2 && "bg-surface-2",
                )}
              />
              <span className="text-[11px] md:hidden">{step.short}</span>
              <span className="hidden md:inline">
                {i === 0 ? "✓ " : ""}
                {i + 1} · {step.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
