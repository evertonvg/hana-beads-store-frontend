import { getContact } from "@/lib/contact";

/** Two wide decorative bands that slide sideways in opposite directions while scrolling. */
export function ParallaxTicker() {
  const { short } = getContact();
  const bandA = "★ FEITO À MÃO ★ PEÇAS ÚNICAS ".repeat(3);
  const bandB = `ENCOMENDAS PELO ${short} ▶ ENVIO P/ TODO BRASIL ▶ `.repeat(2);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex flex-col gap-2 pb-3 md:gap-3.5 md:pb-6"
    >
      <div
        data-layer="faixa-a"
        data-speed="1"
        data-axis="x"
        data-range="400"
        data-base="-200"
        className="font-pixel text-2xl leading-tight whitespace-nowrap will-change-transform md:text-[40px]"
      >
        {bandA}
      </div>
      <div
        data-layer="faixa-b"
        data-speed="-1"
        data-axis="x"
        data-range="400"
        data-base="-200"
        className="font-pixel text-2xl leading-tight whitespace-nowrap text-white will-change-transform [-webkit-text-stroke:2px_var(--color-bg)] md:text-[40px]"
      >
        {bandB}
      </div>
    </div>
  );
}
