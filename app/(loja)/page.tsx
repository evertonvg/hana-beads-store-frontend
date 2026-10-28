import { Suspense } from "react";
import { FinalCta } from "@/components/home/FinalCta";
import { Featured } from "@/components/home/Featured";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { Ticker } from "@/components/home/Ticker";
import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Suspense fallback={<div aria-hidden="true" className="h-[520px]" />}>
        <Featured />
      </Suspense>
      <FinalCta />
      <HowItWorks />
      <section id="sobre" aria-labelledby="sobre-title" data-parallax="about">
        <Container className="flex flex-col gap-4 py-12 md:py-20">
          <h2 id="sobre-title" className="font-pixel text-sm md:text-2xl">
            SOBRE
          </h2>
          <p className="text-[15px] leading-relaxed text-text-muted">[texto &quot;Sobre&quot;]</p>
        </Container>
      </section>
      <section
        aria-labelledby="newsletter-title"
        data-parallax="newsletter"
        className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3.5 px-4 py-8 text-center md:gap-7 md:px-6 md:pt-24 md:pb-14"
      >
        <h2 id="newsletter-title" className="font-pixel text-base md:text-[28px] md:leading-normal">
          CONTINUE? <span className="text-accent">9</span>
        </h2>
        <p className="max-w-[520px] text-sm text-text-muted md:text-base md:leading-relaxed">
          Receba os novos personagens antes de todo mundo.
        </p>
        <NewsletterForm />
      </section>
    </>
  );
}
