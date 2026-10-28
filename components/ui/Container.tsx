import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

/** Page width limit: max 1200px, gutter 16px on mobile and 24px from `md`. */
export function Container({ className, ...rest }: ComponentPropsWithRef<"div">) {
  return <div {...rest} className={cn("mx-auto w-full max-w-[1200px] px-4 md:px-6", className)} />;
}
