import { PixelGrid } from "@/components/pixel/PixelGrid";
import { ParallaxRoot } from "./ParallaxRoot";

const STEPS = ["Desenho em pixel", "Montagem com pinça", "Ferro e acabamento"];

const FORMS = {
  I: ["####"],
  O: ["##", "##"],
  T: ["###", ".#."],
  L: ["#.", "#.", "##"],
  J: [".#", ".#", "##"],
  S: [".##", "##."],
  Z: ["##.", ".##"],
} as const;

type Piece = {
  form: keyof typeof FORMS;
  x: string;
  y: string;
  cell: number;
  color: string;
  speed: number;
  rot: number;
  spin: number;
};

/** `pecasDef` from Parallax.dc.html: [form, x, y, cell, color, speed, rotation, spin]. */
const PIECES: readonly Piece[] = [
  {
    form: "T",
    x: "5%",
    y: "8%",
    cell: 34,
    color: "var(--color-accent)",
    speed: 0.9,
    rot: -12,
    spin: 20,
  },
  {
    form: "I",
    x: "80%",
    y: "6%",
    cell: 28,
    color: "var(--color-yellow)",
    speed: 1.4,
    rot: 18,
    spin: -30,
  },
  {
    form: "L",
    x: "10%",
    y: "66%",
    cell: 30,
    color: "var(--color-cyan)",
    speed: 1.8,
    rot: 8,
    spin: 40,
  },
  {
    form: "O",
    x: "82%",
    y: "60%",
    cell: 40,
    color: "var(--color-bead-red)",
    speed: 0.6,
    rot: -6,
    spin: 15,
  },
  {
    form: "S",
    x: "46%",
    y: "2%",
    cell: 22,
    color: "var(--color-green)",
    speed: 2,
    rot: 0,
    spin: -45,
  },
  {
    form: "Z",
    x: "90%",
    y: "36%",
    cell: 24,
    color: "var(--color-purple)",
    speed: 1.2,
    rot: 24,
    spin: 30,
  },
  {
    form: "J",
    x: "1%",
    y: "38%",
    cell: 22,
    color: "var(--color-bead-orange)",
    speed: 2.2,
    rot: -20,
    spin: -25,
  },
  {
    form: "T",
    x: "62%",
    y: "84%",
    cell: 30,
    color: "var(--color-purple)",
    speed: 1,
    rot: 160,
    spin: 20,
  },
  {
    form: "I",
    x: "24%",
    y: "88%",
    cell: 22,
    color: "var(--color-accent)",
    speed: 1.6,
    rot: 90,
    spin: -35,
  },
  {
    form: "O",
    x: "36%",
    y: "-2%",
    cell: 18,
    color: "var(--color-cyan)",
    speed: 2.4,
    rot: 10,
    spin: 50,
  },
];

/** "Conta por conta": the product-making story, over ten decorative spinning pieces. */
export function BlocksSection() {
  return (
    <ParallaxRoot
      aria-labelledby="conta-title"
      data-parallax="blocks"
      className="relative overflow-hidden bg-bg px-4 py-12 md:px-6 md:py-[140px]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {PIECES.map((p, i) => (
          <div
            key={i}
            data-layer={`peca-${i + 1}`}
            data-speed={p.speed}
            data-rot={p.rot}
            data-spin={p.spin}
            className="absolute will-change-transform"
            style={{ left: p.x, top: p.y }}
          >
            <PixelGrid rows={[...FORMS[p.form]]} palette={{ "#": p.color }} cell={p.cell} bevel />
          </div>
        ))}
      </div>
      <div className="relative z-10 mx-auto flex max-w-[760px] flex-col gap-5 border-[3px] border-text bg-bg p-6 shadow-[8px_8px_0_var(--color-yellow)] md:gap-6 md:border-4 md:p-12 md:shadow-[12px_12px_0_var(--color-yellow)]">
        <p className="font-pixel text-[10px] text-yellow">COMO NASCE UM CHAVEIRO</p>
        <h2
          id="conta-title"
          className="font-pixel text-[20px] leading-normal md:text-[26px] md:leading-normal"
        >
          CONTA POR <span className="text-accent">CONTA</span>
        </h2>
        <p className="text-[15px] leading-[1.7] text-text-muted md:text-[17px]">
          Cada peça começa num desenho em pixel. Depois, as continhas são encaixadas uma a uma na
          base, passadas a ferro e finalizadas com a argola. Nenhuma sai igual à outra.
        </p>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3 p-0">
          {STEPS.map((step, i) => (
            <li key={step} className="flex flex-col gap-2 border-[3px] border-border p-4">
              <span className="font-pixel text-[9px] text-yellow">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </ParallaxRoot>
  );
}
