import { SiteShell } from "@/components/layout/SiteShell";

export default function LojaLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
