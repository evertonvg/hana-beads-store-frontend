import { ContactButton } from "@/components/contact/ContactButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getContact } from "@/lib/contact";
import { BlocksSection } from "./BlocksSection";
import { ParallaxRoot } from "./ParallaxRoot";

/** "Como funciona a encomenda": the three phases. */
export function HowItWorks() {
  const phases = [
    {
      n: "01",
      title: `CHAMA NO ${getContact().short.toUpperCase()}`,
      text: "Conta sua ideia: personagem, inicial, cores.",
    },
    { n: "02", title: "CONTA POR CONTA", text: "Você aprova o desenho e a gente monta." },
    {
      n: "03",
      title: "ITEM COLETADO!",
      text: "Chega na sua casa embalado com carinho.",
      desktopNote: "Prazo: [X] dias úteis.",
    },
  ];
  return (
    <ParallaxRoot
      id="fases"
      aria-labelledby="fases-title"
      data-parallax="phases"
      className="relative overflow-hidden md:border-y-4 md:border-border-soft md:bg-surface"
    >
      <BlocksSection />
      <Container className="relative z-10 flex flex-col gap-4 pt-12 pb-6 md:gap-12 md:bg-surface md:py-24">
        <h2 id="fases-title" className="font-pixel text-sm leading-normal md:text-2xl">
          COMO FUNCIONA
          <span className="hidden md:inline">
            {" "}
            A <span className="text-accent">ENCOMENDA</span>
          </span>
        </h2>
        <ol className="m-0 flex list-none flex-col gap-4 p-0 md:grid md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-6">
          {phases.map((phase) => (
            <li
              key={phase.n}
              className="flex items-start gap-3.5 border-[3px] border-border p-4 md:flex-col md:gap-4 md:border-text md:p-7"
            >
              <span
                aria-hidden="true"
                className="flex-none bg-yellow p-2 font-pixel text-[9px] text-bg md:hidden"
              >
                {phase.n}
              </span>
              <span className="hidden font-pixel text-[11px] text-yellow md:block">
                FASE {Number(phase.n)}
              </span>
              <div className="flex flex-col gap-1.5 md:gap-4">
                <h3 className="font-pixel text-[10px] leading-normal md:text-sm md:leading-relaxed">
                  {phase.title}
                </h3>
                <p className="text-[13px] leading-normal text-text-muted md:text-[15px] md:leading-relaxed">
                  {phase.text}
                  {phase.desktopNote ? (
                    <span className="hidden md:inline"> {phase.desktopNote}</span>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="hidden flex-wrap gap-4 md:flex">
          <ContactButton kind="encomendar" size="lg" />
          <Button variant="secondary" size="lg" href="/encomendas">
            SAIBA MAIS
          </Button>
        </div>
      </Container>
    </ParallaxRoot>
  );
}
