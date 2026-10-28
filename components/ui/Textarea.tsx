"use client";

import { Textarea as HeadlessTextarea } from "@headlessui/react";
import type { ComponentPropsWithRef } from "react";
import { useFieldInvalid } from "./Field";
import { controlClass } from "./field-styles";

type Props = ComponentPropsWithRef<"textarea"> & { invalid?: boolean };

/** Multi-line input for use inside `Field`. Accepts `ref` (React Hook Form `register`). */
export function Textarea({ invalid, className, ...rest }: Props) {
  const fieldInvalid = useFieldInvalid();
  return (
    <HeadlessTextarea
      {...rest}
      invalid={invalid ?? fieldInvalid}
      className={controlClass(["min-h-28 resize-y", className])}
    />
  );
}
