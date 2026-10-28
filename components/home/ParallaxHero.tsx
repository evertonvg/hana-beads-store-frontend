import Image from "next/image";
import { seededRandom } from "@/lib/motion";

/** 40 stars with the design's seed, computed once at module load (server). */
const STARS = (() => {
  const rnd = seededRandom(7);
  return Array.from({ length: 40 }, () => {
    const size = rnd() > 0.8 ? 6 : 4;
    return {
      x: `${(rnd() * 100).toFixed(1)}%`,
      y: `${(rnd() * 70).toFixed(1)}%`,
      size,
      color: rnd() > 0.85 ? "bg-accent" : rnd() > 0.7 ? "bg-yellow" : "bg-text",
    };
  });
})();

const PHOTOS = [
  {
    layer: "foto-1",
    src: "/img/produtos/garota-pixel.webp",
    speed: 1.2,
    rot: -6,
    pos: "left-[45%] top-[52%] w-[clamp(90px,10vw,140px)]",
    ratio: "aspect-[3/4]",
    shadow: "shadow-[8px_8px_0_var(--color-accent)]",
  },
  {
    layer: "foto-2",
    src: "/img/produtos/estrela-numero-13.webp",
    speed: 1.6,
    rot: 5,
    pos: "right-[1.5%] top-[4%] w-[clamp(80px,8vw,120px)]",
    ratio: "aspect-square",
    shadow: "shadow-[8px_8px_0_var(--color-yellow)]",
  },
  {
    layer: "foto-3",
    src: "/img/produtos/estrela-inicial-r.webp",
    speed: 2,
    rot: -3,
    pos: "right-[3%] bottom-[10%] w-[clamp(70px,7vw,100px)]",
    ratio: "aspect-square",
    shadow: "shadow-[8px_8px_0_var(--color-accent)]",
  },
] as const;

const MOUNTAIN_BACK =
  "M0 300V180H80V140H160V100H240V60H320V100H400V140H480V100H560V40H640V0H720V40H800V80H880V120H960V80H1040V40H1120V80H1200V120H1280V160H1360V120H1440V300Z";
const MOUNTAIN_FRONT =
  "M0 300V120H120V80H200V120H320V160H440V120H520V80H600V120H720V160H840V120H920V60H1000V100H1120V140H1240V100H1320V140H1440V300Z";
const MOUNTAIN_EDGE =
  "M0 120H120V128H0ZM120 80H200V88H120ZM200 120H320V128H200ZM440 120H520V128H440ZM520 80H600V88H520ZM840 120H920V128H840ZM920 60H1000V68H920ZM1240 100H1320V108H1240Z";

/** Decorative sky behind the hero: stars, moon, two mountain ranges and floating photos. */
export function ParallaxHero() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        data-layer="estrelas"
        data-speed="0.15"
        className="absolute inset-x-0 -top-40 -bottom-40 will-change-transform"
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            className={`absolute ${s.color}`}
            style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
          />
        ))}
      </div>
      <div
        data-layer="lua"
        data-speed="0.3"
        className="absolute top-14 left-[44%] will-change-transform md:top-24"
      >
        <div className="size-14 bg-yellow shadow-[0_0_0_6px_var(--color-bg),0_0_0_9px_var(--color-yellow)] md:size-[88px] md:shadow-[0_0_0_10px_var(--color-bg),0_0_0_14px_var(--color-yellow)]" />
      </div>
      <div
        data-layer="montanha-fundo"
        data-speed="0.45"
        className="absolute inset-x-0 -bottom-10 h-[260px] will-change-transform md:h-[340px]"
      >
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          shapeRendering="crispEdges"
        >
          <path fill="var(--color-surface-2)" d={MOUNTAIN_BACK} />
        </svg>
      </div>
      <div
        data-layer="montanha-frente"
        data-speed="0.7"
        className="absolute inset-x-0 -bottom-14 h-[170px] will-change-transform md:h-[230px]"
      >
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          shapeRendering="crispEdges"
        >
          <path fill="var(--color-surface)" d={MOUNTAIN_FRONT} />
          <path fill="var(--color-accent)" d={MOUNTAIN_EDGE} />
        </svg>
      </div>
      {PHOTOS.map((p) => (
        <div
          key={p.layer}
          data-layer={p.layer}
          data-speed={p.speed}
          data-rot={p.rot}
          className={`absolute hidden will-change-transform md:block ${p.pos}`}
        >
          <div className={`border-4 border-text bg-surface-2 p-2 ${p.shadow}`}>
            <Image
              src={p.src}
              alt=""
              width={160}
              height={160}
              className={`w-full object-cover ${p.ratio}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
