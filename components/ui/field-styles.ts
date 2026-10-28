import type { ClassValue } from "clsx";
import { cn } from "@/lib/cn";

/** Shared look of text-like controls. 16px on mobile so iOS does not zoom on focus. */
export function controlClass(className?: ClassValue): string {
  return cn(
    "block min-h-11 w-full border-[3px] border-border bg-deep-2 px-3 py-2.5 font-mono text-base text-text md:text-sm",
    "placeholder:text-text-subtle",
    "outline-offset-2 outline-cyan focus-visible:outline-[3px]",
    "disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-danger",
    className,
  );
}
