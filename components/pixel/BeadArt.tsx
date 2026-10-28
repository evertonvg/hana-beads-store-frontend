import { PixelGrid, type PixelGridProps } from "./PixelGrid";

/** Bead pattern for products without a photo: a PixelGrid with round, ringed cells. */
export function BeadArt(props: Omit<PixelGridProps, "shape" | "bevel">) {
  return <PixelGrid {...props} shape="bead" />;
}
