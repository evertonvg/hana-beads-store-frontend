import Link from "next/link";
import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  [
    "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 text-center font-pixel",
    "transition-transform duration-75 motion-reduce:transition-none",
    "active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
    "outline-offset-4 outline-cyan focus-visible:outline-[3px]",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-bg shadow-hard",
        secondary: "border-[3px] border-text bg-transparent text-text",
        yellow: "bg-yellow text-bg shadow-hard-sm",
        danger: "border-[3px] border-danger bg-transparent text-danger-text",
        ghost: "bg-transparent text-link underline underline-offset-4",
      },
      size: {
        sm: "px-3.5 py-3 text-[9px]",
        md: "px-[22px] py-[18px] text-[11px] md:text-xs",
        lg: "min-h-14 px-7 py-5 text-xs md:text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

type Shared = {
  variant: NonNullable<Variants["variant"]>;
  size?: Variants["size"];
  /** Not supported: use `href` to render a link. */
  asChild?: never;
};

export type ButtonProps =
  | (Shared & ComponentPropsWithRef<"button"> & { href?: undefined })
  | (Shared & Omit<ComponentPropsWithRef<typeof Link>, "href"> & { href: string });

export function Button({ variant, size, className, ...rest }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (rest.href !== undefined) return <Link {...rest} className={classes} />;
  const { type = "button", ...buttonProps } = rest;
  return <button type={type} {...buttonProps} className={classes} />;
}
