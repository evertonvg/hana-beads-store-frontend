"use client";

import { Input } from "@headlessui/react";
import type { ComponentPropsWithRef, Ref } from "react";
import { IMaskInput } from "react-imask";
import { useFieldInvalid } from "./Field";
import { controlClass } from "./field-styles";

const MASKS = {
  cep: "00000-000",
  cpf: "000.000.000-00",
  phone: "(00) 00000-0000",
  card: "0000 0000 0000 0000",
  cardExpiry: "00/00",
} as const;

export type MaskKind = keyof typeof MASKS;

type Props = Omit<ComponentPropsWithRef<"input">, "value" | "defaultValue" | "onChange"> & {
  mask: MaskKind;
  value?: string;
  /** Called with the masked text (e.g. `12345-678`). Wire it to RHF `field.onChange`. */
  onAccept?: (value: string) => void;
  invalid?: boolean;
};

/** Adapts IMaskInput so a plain `ref` reaches the DOM input (it exposes `inputRef` instead). */
function MaskedHtmlInput({
  ref,
  mask,
  value,
  onAccept,
  ...rest
}: {
  ref?: Ref<HTMLInputElement>;
  mask: string;
  value?: string;
  onAccept?: (value: string) => void;
} & Omit<ComponentPropsWithRef<"input">, "ref" | "value" | "onChange">) {
  return (
    <IMaskInput
      {...rest}
      mask={mask}
      inputRef={ref}
      value={value}
      onAccept={(v: string) => onAccept?.(v)}
    />
  );
}

/** Input with a BR mask (CEP, CPF, phone, card, card expiry) for use inside `Field`. */
export function MaskedInput({ mask, invalid, className, inputMode = "numeric", ...rest }: Props) {
  const fieldInvalid = useFieldInvalid();
  return (
    <Input
      as={MaskedHtmlInput}
      {...rest}
      mask={MASKS[mask]}
      inputMode={inputMode}
      invalid={invalid ?? fieldInvalid}
      className={controlClass(className)}
    />
  );
}
