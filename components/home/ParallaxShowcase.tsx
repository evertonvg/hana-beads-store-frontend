import { PixelBlock } from "@/components/pixel/PixelBlock";

/** Column stacks of pixel blocks behind the showcase grid; columns drift at different speeds. */
const COLUMNS = [
  {
    speed: 0.6,
    offset: "",
    colors: ["var(--color-accent)", "var(--color-cyan)", "var(--color-yellow)"],
  },
  {
    speed: -0.6,
    offset: "-mt-10",
    colors: ["var(--color-green)", "var(--color-purple)", "var(--color-accent)"],
  },
  {
    speed: 0.9,
    offset: "mt-10",
    colors: ["var(--color-yellow)", "var(--color-bead-orange)", "var(--color-cyan)"],
  },
] as const;

export function ParallaxShowcase() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mx-auto hidden w-full max-w-[1200px] grid-cols-3 gap-7 px-6 md:grid"
    >
      {COLUMNS.map((col, c) => (
        <div
          key={c}
          data-layer={`coluna-${c + 1}`}
          data-speed={col.speed}
          className={`flex items-start justify-center gap-[70px] will-change-transform ${col.offset}`}
        >
          {col.colors.map((color) => (
            <PixelBlock key={color} color={color} size={40} />
          ))}
        </div>
      ))}
    </div>
  );
}
