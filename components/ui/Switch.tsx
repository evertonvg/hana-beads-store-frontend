"use client";

import { Description, Field, Label, Switch as HeadlessSwitch } from "@headlessui/react";

type Props = {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

/** On/off setting: 64x36 pixel switch with label and optional description. */
export function Switch({ checked, onCheckedChange, label, description, disabled }: Props) {
  return (
    <Field disabled={disabled} className="flex items-center justify-between gap-4 py-3.5">
      <span className="flex flex-col gap-1">
        <Label className="cursor-pointer text-[15px] text-text">{label}</Label>
        {description ? (
          <Description className="text-xs text-text-subtle">{description}</Description>
        ) : null}
      </span>
      <HeadlessSwitch
        checked={checked}
        onChange={onCheckedChange}
        className="group flex h-9 w-16 flex-none cursor-pointer justify-start border-[3px] border-text bg-bg p-[3px] outline-offset-4 outline-cyan focus-visible:outline-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:justify-end data-[checked]:bg-accent"
      >
        <span aria-hidden className="block size-6 bg-text" />
      </HeadlessSwitch>
    </Field>
  );
}
