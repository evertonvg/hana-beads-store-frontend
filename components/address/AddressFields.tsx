"use client";

import { useEffect } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { useCepLookup } from "@/components/checkout/use-checkout-lookups";
import { Field } from "@/components/ui/Field";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { UFS } from "@/lib/validation/address";

/** The street data a form must hold to use `AddressFields`. */
export type AddressKey = "cep" | "street" | "number" | "complement" | "district" | "city" | "state";

type Props<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: Partial<Record<AddressKey, string | undefined>>;
  /** Classes of every text input (height and background differ between forms). */
  inputClassName?: string;
};

/**
 * CEP, street, number, complement, district, city and UF. A known CEP fills the street, district,
 * city and UF (the user can still change them); an unknown one leaves them to be typed.
 * Used by the checkout and by the address book, so both validate and fill the same way.
 */
export function AddressFields<T extends FieldValues>({
  control,
  register,
  setValue,
  errors,
  inputClassName,
}: Props<T>) {
  // The form is typed by the caller: the keys below are guaranteed by `AddressKey`.
  const name = (key: AddressKey) => key as Path<T>;
  const cep = (useWatch({ control, name: name("cep") }) as string | undefined) ?? "";

  const lookup = useCepLookup(cep);
  useEffect(() => {
    const found = lookup.data;
    if (!found) return;
    const opts = { shouldValidate: true, shouldDirty: true } as const;
    const fill = (key: AddressKey, value: string) =>
      setValue(name(key), value as PathValue<T, Path<T>>, opts);
    fill("street", found.street);
    fill("district", found.district);
    fill("city", found.city);
    fill("state", found.state);
    // `name` only casts; the lookup result is the one input that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookup.data, setValue]);

  return (
    <div className="grid gap-3.5 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:gap-4">
      <Field label="CEP" plainLabel error={errors.cep}>
        <Controller
          control={control}
          name={name("cep")}
          render={({ field }) => (
            <MaskedInput
              mask="cep"
              autoComplete="postal-code"
              placeholder="00000-000"
              className={inputClassName}
              name={field.name}
              ref={field.ref}
              value={field.value}
              onAccept={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>
      <Field label="Rua" plainLabel error={errors.street}>
        <TextInput
          autoComplete="address-line1"
          className={inputClassName}
          {...register(name("street"))}
        />
      </Field>
      <div className="grid grid-cols-[1fr_1.6fr] gap-2.5 md:contents">
        <Field label="Número" plainLabel error={errors.number}>
          <TextInput inputMode="numeric" className={inputClassName} {...register(name("number"))} />
        </Field>
        <Field label="Complemento" plainLabel error={errors.complement}>
          <TextInput
            autoComplete="address-line2"
            className={inputClassName}
            {...register(name("complement"))}
          />
        </Field>
      </div>
      <Field label="Bairro" plainLabel error={errors.district}>
        <TextInput className={inputClassName} {...register(name("district"))} />
      </Field>
      <div className="grid grid-cols-[1.6fr_1fr] gap-2.5 md:contents">
        <Field label="Cidade" plainLabel error={errors.city}>
          <TextInput
            autoComplete="address-level2"
            className={inputClassName}
            {...register(name("city"))}
          />
        </Field>
        <Field label="UF" plainLabel error={errors.state}>
          <Select
            autoComplete="address-level1"
            className={inputClassName}
            {...register(name("state"))}
          >
            <option value="">UF</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </div>
  );
}
