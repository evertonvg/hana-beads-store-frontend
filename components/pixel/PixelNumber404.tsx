import type { CSSProperties } from "react";

// "4" "0" "4" masks from the design. `#` solid, `o` the missing block, `.` empty.
const Q = ["#...#", "#...#", "#...#", "#####", "....#", "....#", "....#"];
const Z = [".###.", "#...#", "#...#", "o...#", "#...#", "#...#", ".###."];
const ROWS = Q.map((q, r) => `${q}.${Z[r]}.${q}`);
const COLUMNS = ROWS[0]?.length ?? 0;

/** Column color: accent, yellow, then cyan. */
function colorClass(column: number): string {
  if (column < 5) return "bg-accent";
  if (column < 12) return "bg-yellow";
  return "bg-cyan";
}

const BEVEL =
  "inset var(--bevel) var(--bevel) 0 rgba(255,255,255,0.4), inset calc(var(--bevel) * -1) calc(var(--bevel) * -1) 0 rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.3)";

/**
 * "404" drawn with bevelled blocks, with a dashed gap and a loose block falling toward it once.
 * Cell size follows `--cell` (18px on mobile, 26px from `md`).
 */
export function PixelNumber404() {
  const vars = { gridTemplateColumns: `repeat(${COLUMNS}, var(--cell))` } satisfies CSSProperties;

  return (
    <div
      role="img"
      aria-label="Número 404 feito de blocos, com um bloco faltando caindo no lugar"
      className="relative pt-[46px] [--bevel:3px] [--cell:18px] [--dash:2px] md:pt-[70px] md:[--bevel:4px] md:[--cell:26px] md:[--dash:3px]"
    >
      <div className="grid auto-rows-(--cell)" style={vars} aria-hidden>
        {ROWS.flatMap((row, y) =>
          Array.from(row, (ch, x) => {
            if (ch === "#") {
              return (
                <div key={`${y}-${x}`} className={colorClass(x)} style={{ boxShadow: BEVEL }} />
              );
            }
            if (ch === "o") {
              return (
                <div
                  key={`${y}-${x}`}
                  className="outline-border outline-dashed"
                  style={{
                    outlineWidth: "var(--dash)",
                    outlineOffset: "calc(var(--dash) * -1 - 1px)",
                  }}
                />
              );
            }
            return <div key={`${y}-${x}`} />;
          }),
        )}
      </div>
      <div
        aria-hidden
        className="absolute top-0 left-[calc(var(--cell)*6)] size-(--cell) animate-cai bg-yellow motion-reduce:animate-none"
        style={{ boxShadow: BEVEL }}
      />
    </div>
  );
}
