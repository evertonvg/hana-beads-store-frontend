import { ContactButton } from "@/components/contact/ContactButton";
import { getContact } from "@/lib/contact";

/** Mobile-only call to action for custom orders (the desktop equivalent lives in HowItWorks). */
export function FinalCta() {
  const { short } = getContact();
  const channel = short.charAt(0) + short.slice(1).toLowerCase();
  return (
    <section
      aria-labelledby="cta-title"
      data-parallax="final-cta"
      className="mx-4 flex flex-col gap-3.5 border-[3px] border-text bg-surface-2 p-[22px] shadow-[8px_8px_0_var(--color-yellow)] md:hidden"
    >
      <p className="font-pixel text-[8px] text-yellow">ENCOMENDAS ABERTAS</p>
      <h2 id="cta-title" className="font-pixel text-sm leading-relaxed">
        TEM UMA IDEIA? <span className="text-accent">A GENTE MONTA.</span>
      </h2>
      <p className="text-sm leading-relaxed text-text-muted">
        Inicial, número, personagem, pet. Manda no {channel} e a gente transforma em pixel.
      </p>
      <ContactButton kind="chamar" />
    </section>
  );
}
