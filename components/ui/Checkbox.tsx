"use client";

import { Checkbox as HeadlessCheckbox, Field, Label } from "@headlessui/react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Icon } from "./Icon";

type Props = Omit<ComponentPropsWithRef<typeof HeadlessCheckbox>, "children" | "className"> & {
  label: ReactNode;
};

/**
 * Pixel checkbox with a clickable label. Controlled via `checked` / `onChange(checked)`
 * (use RHF `Controller`); `name` also renders a hidden input for native form posts.
 */
export function Checkbox({ label, ...rest }: Props) {
  return (
    <Field className="flex min-h-11 items-center gap-3">
      <HeadlessCheckbox
        {...rest}
        className="group flex size-6 flex-none cursor-pointer items-center justify-center border-[3px] border-text bg-bg text-bg outline-offset-4 outline-cyan focus-visible:outline-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-accent data-[invalid]:border-danger"
      >
        <span className="hidden group-data-[checked]:block">
          <Icon name="check" size={16} />
        </span>
      </HeadlessCheckbox>
      <Label className="cursor-pointer text-sm text-text">{label}</Label>
    </Field>
  );
}
