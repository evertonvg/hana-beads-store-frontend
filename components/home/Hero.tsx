import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getContact } from "@/lib/contact";

/** First screen: pitch, calls to action and the featured character photo. */
export function Hero() {
  const channel = getContact();
  return (
    <section aria-labelledby="hero-title" data-parallax="hero">
      <Container className="grid gap-5 py-7 md:grid-cols-2 md:gap-x-14 md:gap-y-7 md:py-20">
        <div className="flex min-w-0 flex-col gap-5 md:gap-7">
          <p className="font-pixel text-[9px] text-yellow md:text-[11px]">1 PLAYER · FEITO À MÃO</p>
          <h1
            id="hero-title"
            className="font-pixel text-[21px] leading-normal text-text md:text-[40px] md:leading-[1.35]"
          >
            PRESS <span className="text-accent">START</span> NO SEU NOVO CHAVEIRO
          </h1>
          <p className="max-w-[520px] text-[15px] leading-relaxed text-text-muted md:text-lg">
            <span className="md:hidden">
              Modelos prontos pra levar agora ou do seu jeito, sob encomenda pelo {channel.name}.
            </span>
            <span className="hidden md:inline">
              Chaveiros e mimos de pixel art montados conta por conta. Escolha um modelo pronto pra
              levar agora ou encomende o seu do jeitinho que imaginou, direto pelo {channel.name}.
            </span>
          </p>
        </div>

        <figure
          data-parallax="hero-card"
          className="m-0 flex min-w-0 justify-center md:col-start-2 md:row-span-2 md:row-start-1"
        >
          <div className="w-full max-w-[440px] border-[3px] border-text bg-surface-2 p-3 shadow-[8px_8px_0_var(--color-accent)] md:border-4 md:p-5 md:shadow-hard-lg">
            <div
              aria-hidden="true"
              className="flex justify-between pb-2 font-pixel text-[7px] text-yellow md:pb-3 md:text-[9px]"
            >
              <span>HI-SCORE 999</span>
              <span>LVL 01</span>
            </div>
            <div className="relative h-[300px] md:h-[400px]">
              <Image
                src="/img/produtos/garota-pixel.webp"
                alt="Chaveiro de pixel art de personagem com cabelo rosa e roupa preta, na palma da mão"
                fill
                priority
                sizes="(min-width: 768px) 400px, 360px"
                className="object-cover"
              />
            </div>
            <figcaption
              aria-hidden="true"
              className="mt-3 hidden text-center font-pixel text-[9px] text-text md:block"
            >
              ▶ PERSONAGEM DESBLOQUEADO
            </figcaption>
          </div>
        </figure>

        <div className="flex flex-col gap-3 pt-2 md:flex-row md:flex-wrap md:gap-4 md:pt-0">
          <Button variant="primary" size="lg" href="/loja" className="w-full md:w-auto">
            INSERT COIN ›
          </Button>
          <Button variant="secondary" size="lg" href="/encomendas" className="w-full md:w-auto">
            ENCOMENDAR
          </Button>
        </div>
      </Container>
    </section>
  );
}
