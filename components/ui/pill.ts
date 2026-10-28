import { cn } from "@/lib/cn";

/** Shared look of pills (toggle, tab, radio). State comes from the Headless UI primitive. */
export function pillClass(selected: boolean, className?: string): string {
  return cn(
    "inline-flex min-h-11 cursor-pointer items-center gap-2 border-[3px] px-3.5 py-3 font-pixel text-[9px]",
    "outline-offset-4 outline-cyan focus-visible:outline-[3px]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    selected ? "border-text bg-text text-bg" : "border-border bg-transparent text-text",
    className,
  );
}
