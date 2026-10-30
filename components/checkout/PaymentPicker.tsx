"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Field } from "@/components/ui/Field";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { PillRadioGroup } from "@/components/ui/PillRadioGroup";
import { TextInput } from "@/components/ui/TextInput";
import type { PaymentMethod } from "@/lib/data/types";
import type { CheckoutFormInput, CheckoutInput } from "@/lib/validation/checkout";
import { checkoutInput } from "./styles";

type Props = {
  control: Control<CheckoutFormInput, unknown, CheckoutInput>;
  errors: FieldErrors<CheckoutFormInput>;
  register: UseFormRegister<CheckoutFormInput>;
};

/** `[parcelas]` is a placeholder: the installment plan is not defined yet. */
const OPTIONS: { value: PaymentMethod; label: string; note: string }[] = [
  { value: "pix", label: "PIX", note: "aprovação na hora" },
  { value: "cartao", label: "CARTÃO", note: "[parcelas]" },
  { value: "boleto", label: "BOLETO", note: "até 3 dias" },
];

/** Payment method choice; the card fields only appear for "CARTÃO" (mock, see `cardSchema`). */
export function PaymentPicker({ control, errors, register }: Props) {
  return (
    <Controller
      control={control}
      name="payment"
      render={({ field }) => (
        <>
          <div data-field="payment">
            <PillRadioGroup
              label="Forma de pagamento"
              value={field.value}
              onChange={field.onChange}
              options={OPTIONS}
              className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-3"
              optionClassName="min-h-[60px] flex-row items-center justify-between md:min-h-16 md:flex-col md:justify-center md:text-center"
            />
          </div>
          {field.value === "cartao" ? (
            <div className="grid gap-3.5 sm:grid-cols-2 md:gap-4">
              <div className="sm:col-span-2">
                <Field label="Número do cartão" plainLabel error={errors.card?.number?.message}>
                  <Controller
                    control={control}
                    name="card.number"
                    render={({ field: f }) => (
                      <MaskedInput
                        mask="card"
                        autoComplete="cc-number"
                        placeholder="0000 0000 0000 0000"
                        className={checkoutInput}
                        name={f.name}
                        ref={f.ref}
                        value={f.value ?? ""}
                        onAccept={f.onChange}
                        onBlur={f.onBlur}
                      />
                    )}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Nome impresso no cartão"
                  plainLabel
                  error={errors.card?.holder?.message}
                >
                  <TextInput
                    autoComplete="cc-name"
                    className={checkoutInput}
                    {...register("card.holder")}
                  />
                </Field>
              </div>
              <Field label="Validade" plainLabel error={errors.card?.expiry?.message}>
                <Controller
                  control={control}
                  name="card.expiry"
                  render={({ field: f }) => (
                    <MaskedInput
                      mask="cardExpiry"
                      autoComplete="cc-exp"
                      placeholder="MM/AA"
                      className={checkoutInput}
                      name={f.name}
                      ref={f.ref}
                      value={f.value ?? ""}
                      onAccept={f.onChange}
                      onBlur={f.onBlur}
                    />
                  )}
                />
              </Field>
              <Field label="CVV" plainLabel error={errors.card?.cvv?.message}>
                <TextInput
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  className={checkoutInput}
                  {...register("card.cvv")}
                />
              </Field>
            </div>
          ) : null}
        </>
      )}
    />
  );
}
