import { getContact } from "@/lib/contact";
import { ParallaxRoot } from "./ParallaxRoot";
import { ParallaxTicker } from "./ParallaxTicker";

/** Pink strip with the store's promises (static; optional motion comes later). */
export function Ticker() {
  const channel = getContact();
  return (
    <ParallaxRoot
      aria-label="Destaques"
      data-parallax="ticker"
      className="relative overflow-hidden bg-accent text-bg"
    >
      <ul className="m-0 flex list-none flex-nowrap justify-center gap-4 overflow-hidden px-4 py-3 font-pixel text-[9px] whitespace-nowrap md:flex-wrap md:gap-x-10 md:px-6 md:py-4 md:text-xs">
        <li>★ FEITO À MÃO</li>
        <li>★ PEÇAS ÚNICAS</li>
        <li className="hidden md:list-item">★ ENCOMENDAS PELO {channel.short}</li>
        <li>★ ENVIO P/ TODO BRASIL</li>
      </ul>
      <ParallaxTicker />
    </ParallaxRoot>
  );
}
