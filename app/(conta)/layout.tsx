import { SiteShell } from "@/components/layout/SiteShell";

export default function ContaLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
