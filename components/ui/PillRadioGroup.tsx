"use client";

import { Radio, RadioGroup } from "@headlessui/react";
import { pillClass } from "./pill";

type Props<T extends string> = {
  label: string;
  options: { value: T; label: string; note?: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Pill-styled single choice on Headless UI RadioGroup (`role="radio"`, arrow keys). */
export function PillRadioGroup<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      {options.map((o) => (
        <Radio
          key={o.value}
          value={o.value}
          className={({ checked }) => pillClass(checked, "flex-col items-start gap-1")}
        >
          <span>{o.label}</span>
          {o.note ? <span className="font-mono text-xs opacity-80">{o.note}</span> : null}
        </Radio>
      ))}
    </RadioGroup>
  );
}
