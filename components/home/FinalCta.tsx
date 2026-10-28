import { ContactButton } from "@/components/contact/ContactButton";
import { getContact } from "@/lib/contact";
import { ParallaxCity } from "./ParallaxCity";
import { ParallaxRoot } from "./ParallaxRoot";

/** Mobile-only call to action for custom orders (the desktop equivalent lives in HowItWorks). */
export function FinalCta() {
  const { short } = getContact();
  const channel = short.charAt(0) + short.slice(1).toLowerCase();
  return (
    <ParallaxRoot
      aria-labelledby="cta-title"
      data-parallax="final-cta"
      className="relative mx-4 flex flex-col gap-3.5 overflow-hidden border-[3px] border-text bg-surface-2 p-[22px] pb-20 shadow-[8px_8px_0_var(--color-yellow)] md:hidden"
    >
      <ParallaxCity cityClassName="h-14" />
      <div
        data-layer="cta"
        data-speed="-0.2"
        className="relative flex flex-col gap-3.5 will-change-transform"
      >
        <p className="relative font-pixel text-[8px] text-yellow">ENCOMENDAS ABERTAS</p>
        <h2 id="cta-title" className="relative font-pixel text-sm leading-relaxed">
          TEM UMA IDEIA? <span className="text-accent">A GENTE MONTA.</span>
        </h2>
        <p className="relative text-sm leading-relaxed text-text-muted">
          Inicial, número, personagem, pet. Manda no {channel} e a gente transforma em pixel.
        </p>
        <div className="flex flex-col">
          <ContactButton kind="chamar" />
        </div>
      </div>
    </ParallaxRoot>
  );
}
