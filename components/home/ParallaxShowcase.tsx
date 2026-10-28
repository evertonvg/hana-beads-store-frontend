import Image from "next/image";
import { ParallaxRoot } from "./ParallaxRoot";

type Tile =
  { kind: "photo"; src: string; ratio: string; border: string } | { kind: "slot"; ratio: string };

const GAROTA = "/img/produtos/garota-pixel.webp";
const NUMERO = "/img/produtos/estrela-numero-13.webp";
const INICIAL = "/img/produtos/estrela-inicial-r.webp";

/** Three staggered columns from Parallax.dc.html (speeds 0.6 / -0.6 / 0.9). */
const COLUMNS: readonly { speed: number; offset: string; tiles: readonly Tile[] }[] = [
  {
    speed: 0.6,
    offset: "",
    tiles: [
      { kind: "photo", src: GAROTA, ratio: "aspect-[3/4]", border: "border-text" },
      { kind: "slot", ratio: "aspect-square" },
      { kind: "photo", src: NUMERO, ratio: "aspect-square", border: "border-text" },
      { kind: "photo", src: INICIAL, ratio: "aspect-[3/4]", border: "border-accent" },
    ],
  },
  {
    speed: -0.6,
    offset: "-mt-40",
    tiles: [
      { kind: "photo", src: INICIAL, ratio: "aspect-[3/4]", border: "border-accent" },
      { kind: "photo", src: GAROTA, ratio: "aspect-square", border: "border-text" },
      { kind: "slot", ratio: "aspect-[3/4]" },
      { kind: "photo", src: NUMERO, ratio: "aspect-square", border: "border-text" },
      { kind: "photo", src: GAROTA, ratio: "aspect-[3/4]", border: "border-text" },
    ],
  },
  {
    speed: 0.9,
    offset: "mt-[60px]",
    tiles: [
      { kind: "slot", ratio: "aspect-square" },
      { kind: "photo", src: NUMERO, ratio: "aspect-[3/4]", border: "border-yellow" },
      { kind: "photo", src: INICIAL, ratio: "aspect-square", border: "border-text" },
      { kind: "photo", src: GAROTA, ratio: "aspect-[3/4]", border: "border-text" },
    ],
  },
];

/** Decorative desktop band: product photos drifting in three columns. */
export function ParallaxShowcase() {
  return (
    <ParallaxRoot
      aria-hidden="true"
      data-parallax="showcase"
      className="pointer-events-none relative hidden h-[620px] overflow-hidden border-y-4 border-border-soft bg-surface md:block"
    >
      <div className="mx-auto grid h-full max-w-[760px] grid-cols-3 gap-[18px] px-6">
        {COLUMNS.map((col, c) => (
          <div
            key={c}
            data-layer={`coluna-${c + 1}`}
            data-speed={col.speed}
            className={`flex flex-col gap-[18px] will-change-transform ${col.offset}`}
          >
            {col.tiles.map((tile, t) =>
              tile.kind === "photo" ? (
                <Image
                  key={t}
                  src={tile.src}
                  alt=""
                  width={240}
                  height={240}
                  sizes="240px"
                  className={`w-full border-4 object-cover ${tile.ratio} ${tile.border}`}
                />
              ) : (
                <div
                  key={t}
                  className={`flex items-center justify-center border-4 border-dashed border-border font-pixel text-[8px] text-text-subtle ${tile.ratio}`}
                >
                  [NOVA PEÇA]
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </ParallaxRoot>
  );
}
