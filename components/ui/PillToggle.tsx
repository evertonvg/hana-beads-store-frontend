import type { ComponentPropsWithRef, ReactNode } from "react";
import { pillClass } from "./pill";

type Props = Omit<ComponentPropsWithRef<"button">, "onClick" | "children"> & {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: ReactNode;
};

/** Multi-select filter pill (e.g. colors): a real button with `aria-pressed`. */
export function PillToggle({ pressed, onPressedChange, children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={pillClass(pressed, className)}
    >
      {children}
    </button>
  );
}
