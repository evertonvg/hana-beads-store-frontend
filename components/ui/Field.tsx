"use client";

import { Description, Field as HeadlessField, Label } from "@headlessui/react";
import { createContext, use, type ReactNode } from "react";

const InvalidContext = createContext(false);

/** True when the surrounding `Field` has an error (drives `aria-invalid` on controls). */
export function useFieldInvalid(): boolean {
  return use(InvalidContext);
}

type Props = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

/**
 * Label + control + hint/error. Headless UI wires `id`, `for` and `aria-describedby`
 * between the label, the description(s) and the control placed in `children`.
 */
export function Field({ label, error, hint, children }: Props) {
  return (
    <HeadlessField className="flex flex-col gap-2">
      <Label className="font-pixel text-[10px] text-text-muted">{label}</Label>
      <InvalidContext value={Boolean(error)}>{children}</InvalidContext>
      {hint ? <Description className="text-xs text-text-subtle">{hint}</Description> : null}
      {error ? (
        <Description role="alert" className="text-xs text-danger-text">
          {error}
        </Description>
      ) : null}
    </HeadlessField>
  );
}
