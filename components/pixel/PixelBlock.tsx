type Props = { color: string; size: number };

/** Solid square with the pixel bevel (decorative). */
export function PixelBlock({ color, size }: Props) {
  return (
    <div
      aria-hidden
      className="shadow-bevel"
      style={{ width: size, height: size, background: color }}
    />
  );
}
