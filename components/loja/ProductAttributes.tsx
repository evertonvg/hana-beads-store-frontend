import type { Product } from "@/lib/data/types";

type Props = { product: Product };

/** RPG-style attribute bars. Bar widths come from the design; values stay placeholders until known. */
export function ProductAttributes({ product }: Props) {
  const rows = [
    {
      name: "TAMANHO",
      width: "55%",
      color: "bg-yellow",
      value: product.sizeCm === null ? "[X] cm" : `${product.sizeCm} cm`,
    },
    {
      name: "CONTAS",
      width: "85%",
      color: "bg-accent",
      value: product.beadCount === null ? "[000]" : String(product.beadCount),
    },
    { name: "FOFURA", width: "100%", color: "bg-cyan", value: product.cuteness },
  ];

  return (
    <section
      aria-labelledby="atributos"
      className="mx-4 flex flex-col gap-3 border-[3px] border-border p-4 md:mx-0 md:gap-3.5 md:p-5"
    >
      <h2 id="atributos" className="font-pixel text-[9px] text-yellow md:text-[11px]">
        ATRIBUTOS
      </h2>
      {rows.map((r) => (
        <div
          key={r.name}
          className="grid grid-cols-[76px_1fr_54px] items-center gap-2.5 text-xs md:grid-cols-[110px_1fr_90px] md:gap-3 md:text-[13px]"
        >
          <span>{r.name}</span>
          <div aria-hidden="true" className="h-2.5 bg-surface-2 md:h-3">
            <div className={`h-full ${r.color}`} style={{ width: r.width }} />
          </div>
          <span className="text-right text-text-muted">{r.value}</span>
        </div>
      ))}
    </section>
  );
}
