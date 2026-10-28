const SKYLINE =
  "M0 220V140H60V100H140V160H200V60H280V120H340V80H420V140H480V40H560V110H620V150H700V70H780V130H840V90H920V150H980V50H1060V120H1120V160H1180V80H1260V130H1320V100H1440V220Z";
const WINDOWS =
  "M220 80H232V92H220ZM252 100H264V112H252ZM500 60H512V72H500ZM532 90H544V102H532ZM720 90H732V102H720ZM1000 70H1012V82H1000ZM1032 100H1044V112H1032ZM1200 100H1212V112H1200Z";

/** `nuvensDef` from Parallax.dc.html: [x, y, w1, w2, h, speed, opacity]. */
const CLOUDS = [
  { x: "8%", y: 10, w1: 160, w2: 100, h: 24, speed: 0.3, o: 0.9 },
  { x: "62%", y: 4, w1: 220, w2: 140, h: 28, speed: 0.6, o: 0.7 },
  { x: "36%", y: 40, w1: 120, w2: 70, h: 18, speed: 1, o: 0.5 },
  { x: "80%", y: 56, w1: 140, w2: 90, h: 20, speed: 1.3, o: 0.6 },
  { x: "18%", y: 64, w1: 100, w2: 60, h: 16, speed: 1.6, o: 0.4 },
] as const;

/** Decorative sky and skyline for the closing call to action. Fills its (relative) parent. */
export function ParallaxCity({ cityClassName }: { readonly cityClassName?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-24 md:h-28">
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            data-layer={`nuvem-${i + 1}`}
            data-speed={c.speed}
            className="absolute will-change-transform max-md:hidden"
            style={{ left: c.x, top: c.y }}
          >
            <div className="flex flex-col items-center" style={{ opacity: c.o }}>
              <div className="bg-text" style={{ width: c.w2, height: c.h }} />
              <div className="bg-text" style={{ width: c.w1, height: c.h }} />
            </div>
          </div>
        ))}
      </div>
      <div
        data-layer="cidade"
        data-speed="0.25"
        className={`absolute inset-x-0 -bottom-4 will-change-transform ${cityClassName ?? "h-24"}`}
      >
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          shapeRendering="crispEdges"
        >
          <path fill="var(--color-deep-2)" d={SKYLINE} />
          <path fill="var(--color-yellow)" d={WINDOWS} />
        </svg>
      </div>
    </div>
  );
}
