"use client";

import { Checkbox as HeadlessCheckbox, Description, Field, Label } from "@headlessui/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Icon } from "./Icon";
import { useFieldInvalid, useInKitField } from "./Field";

type Props = Omit<
  ComponentPropsWithRef<typeof HeadlessCheckbox>,
  "children" | "className" | "invalid"
> & {
  label: ReactNode;
  /** Standalone use only: error text, linked via `aria-describedby`. Inside `Field`, use its `error`. */
  error?: string;
  /** Standalone use only: hint text, linked via `aria-describedby`. */
  hint?: string;
};

/**
 * Pixel checkbox with a clickable label, built on the Headless UI checkbox (a button with
 * `role="checkbox"`, not a native input). It is controlled: `checked` / `onChange(checked)`.
 * With React Hook Form use `Controller`, NOT `register` (there is no native input to register).
 * `name` also renders a hidden input for native form posts.
 *
 * Error contract: standalone, pass `error`/`hint`; inside the kit `Field`, the Field's error
 * and hint are used (no second Headless Field is nested). Either way the box gets
 * `aria-invalid` and `data-invalid` styling.
 */
export function Checkbox({ label, error, hint, ...rest }: Props) {
  const inKitField = useInKitField();
  const fieldInvalid = useFieldInvalid();
  const invalid = fieldInvalid || Boolean(error);

  const control = (
    <>
      <HeadlessCheckbox
        {...rest}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? "" : undefined}
        className="group flex size-6 flex-none cursor-pointer items-center justify-center border-[3px] border-text bg-bg text-bg outline-offset-4 outline-cyan focus-visible:outline-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-accent data-[invalid]:border-danger"
      >
        <span className="hidden group-data-[checked]:block">
          <Icon name="check" size={16} />
        </span>
      </HeadlessCheckbox>
      <Label className="cursor-pointer text-sm text-text">{label}</Label>
    </>
  );

  if (inKitField) return <div className="flex min-h-11 items-center gap-3">{control}</div>;

  return (
    <Field className="flex flex-col gap-1">
      <div className="flex min-h-11 items-center gap-3">{control}</div>
      {hint ? <Description className="text-xs text-text-subtle">{hint}</Description> : null}
      {error ? (
        <Description role="alert" className="text-xs text-danger-text">
          {error}
        </Description>
      ) : null}
    </Field>
  );
}
