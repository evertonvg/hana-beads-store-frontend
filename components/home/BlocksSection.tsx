import { PixelGrid } from "@/components/pixel/PixelGrid";

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

/** Decorative falling and spinning pieces behind the "Como funciona" board. */
export function BlocksSection() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {PIECES.map((p, i) => (
        <div
          key={i}
          data-layer={`peca-${i + 1}`}
          data-speed={p.speed}
          data-range="140"
          data-rot={p.rot}
          data-spin={p.spin}
          className="absolute will-change-transform"
          style={{ left: p.x, top: p.y }}
        >
          <PixelGrid rows={[...FORMS[p.form]]} palette={{ "#": p.color }} cell={p.cell} bevel />
        </div>
      ))}
    </div>
  );
}
