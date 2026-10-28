"use client";

import { useState } from "react";
import { Icon } from "./Icon";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  /** Accessible name of the number field. */
  label: string;
};

const stepButton =
  "flex size-11 cursor-pointer items-center justify-center border-[3px] border-text text-text outline-offset-2 outline-cyan focus-visible:outline-[3px] aria-disabled:cursor-not-allowed aria-disabled:opacity-40";

/** Quantity field with minus/plus buttons, clamped to [min, max]. */
export function QuantityStepper({ value, min = 1, max = 99, onChange, label }: Props) {
  // While typing, keep the raw text so the field can be emptied; clamp on blur / Enter.
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));

  function commit() {
    if (draft === null) return;
    const n = Number(draft);
    setDraft(null);
    onChange(draft === "" || Number.isNaN(n) ? value : clamp(n));
  }

  return (
    <div role="group" aria-label={label} className="inline-flex items-stretch">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        aria-disabled={value <= min || undefined}
        onClick={() => {
          if (value > min) onChange(clamp(value - 1));
        }}
        className={stepButton}
      >
        <Icon name="minus" size={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        min={min}
        max={max}
        value={draft ?? value}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // do not submit a surrounding form
            commit();
          }
        }}
        className="h-11 w-16 [appearance:textfield] border-y-[3px] border-text bg-deep-2 text-center font-mono text-base text-text outline-offset-2 outline-cyan focus-visible:outline-[3px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Aumentar quantidade"
        aria-disabled={value >= max || undefined}
        onClick={() => {
          if (value < max) onChange(clamp(value + 1));
        }}
        className={stepButton}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
