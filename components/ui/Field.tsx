"use client";

import { Description, Field as HeadlessField, Label } from "@headlessui/react";
import { createContext, use, type ReactNode } from "react";

// null = not inside a kit Field
const FieldStateContext = createContext<{ invalid: boolean } | null>(null);

/** True when the surrounding `Field` has an error (drives `aria-invalid` on controls). */
export function useFieldInvalid(): boolean {
  return use(FieldStateContext)?.invalid ?? false;
}

/** True when rendered inside a kit `Field` (which already provides the Headless Field context). */
export function useInKitField(): boolean {
  return use(FieldStateContext) !== null;
}

type Props = {
  label: string;
  error?: string;
  hint?: string;
  /** Keeps the label for assistive tech but hides it visually. */
  hideLabel?: boolean;
  /** Body-text label (14px mono) instead of the small pixel-font one. */
  plainLabel?: boolean;
  children: ReactNode;
};

/**
 * Label + control + hint/error. Headless UI wires `id`, `for` and `aria-describedby`
 * between the label, the description(s) and the control placed in `children`.
 */
export function Field({ label, error, hint, hideLabel, plainLabel, children }: Props) {
  return (
    <HeadlessField className="flex flex-col gap-2">
      <Label
        className={
          hideLabel
            ? "sr-only"
            : plainLabel
              ? "text-sm text-text"
              : "font-pixel text-[10px] text-text-muted"
        }
      >
        {label}
      </Label>
      <FieldStateContext value={{ invalid: Boolean(error) }}>{children}</FieldStateContext>
      {hint ? <Description className="text-xs text-text-subtle">{hint}</Description> : null}
      {error ? (
        <Description role="alert" className="text-xs text-danger-text">
          {error}
        </Description>
      ) : null}
    </HeadlessField>
  );
}
