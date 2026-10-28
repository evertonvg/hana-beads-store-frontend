import type { ReactNode } from "react";

type Props = { as?: "h1" | "h2" | "h3"; children: ReactNode };

/** Pixel-font section heading. */
export function SectionTitle({ as: Tag = "h2", children }: Props) {
  return <Tag className="font-pixel text-[10px] text-yellow md:text-xs">{children}</Tag>;
}
