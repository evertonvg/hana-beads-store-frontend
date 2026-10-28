"use client";

import { Select as HeadlessSelect } from "@headlessui/react";
import type { ComponentPropsWithRef } from "react";
import { useFieldInvalid } from "./Field";
import { controlClass } from "./field-styles";

type Props = ComponentPropsWithRef<"select"> & { invalid?: boolean };

/** Native select for use inside `Field`. Accepts `ref` (React Hook Form `register`). */
export function Select({ invalid, className, ...rest }: Props) {
  const fieldInvalid = useFieldInvalid();
  return (
    <HeadlessSelect
      {...rest}
      invalid={invalid ?? fieldInvalid}
      className={controlClass(["scheme-dark", className])}
    />
  );
}
