"use client";

import { Input } from "@headlessui/react";
import type { ComponentPropsWithRef } from "react";
import { useFieldInvalid } from "./Field";
import { controlClass } from "./field-styles";

type Props = ComponentPropsWithRef<"input"> & { invalid?: boolean };

/** Text input for use inside `Field`. Accepts `ref` (React Hook Form `register`). */
export function TextInput({ invalid, className, ...rest }: Props) {
  const fieldInvalid = useFieldInvalid();
  return <Input {...rest} invalid={invalid ?? fieldInvalid} className={controlClass(className)} />;
}
