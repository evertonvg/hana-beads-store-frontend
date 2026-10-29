"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { validateCouponAction } from "@/app/(loja)/carrinho/actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { TextInput } from "@/components/ui/TextInput";
import type { CartLine } from "@/lib/cart/types";
import type { CheckoutDraft } from "@/lib/cart/draft";
import { couponSchema, type CouponInput } from "@/lib/validation/coupon";

const REASON_MESSAGE = {
  invalido: "Código secreto inválido.",
  expirado: "Esse código expirou.",
} as const;

type Props = {
  lines: CartLine[];
  coupon: CheckoutDraft["coupon"];
  onChange: (coupon: CheckoutDraft["coupon"]) => void;
};

/** "Código secreto (cupom)": validated on the server; once applied the field gives way to a remove button. */
export function CouponForm({ lines, coupon, onChange }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "" },
  });
  const validate = useMutation({ mutationFn: validateCouponAction });

  const onSubmit = ({ code }: CouponInput) => {
    validate.mutate(
      { code, lines },
      {
        onSuccess: (result) => {
          if (result.ok) {
            onChange({
              code: result.code,
              label: result.label,
              discountCents: result.discountCents,
            });
            reset();
          } else {
            setError("code", { message: REASON_MESSAGE[result.reason] });
          }
        },
        onError: () => setError("code", { message: "Não foi possível agora. Tente de novo." }),
      },
    );
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>Código secreto aplicado.</span>
        <Button
          variant="ghost"
          aria-label="REMOVER CUPOM"
          onClick={() => onChange(null)}
          className="px-0 text-[9px]"
        >
          REMOVER
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <Field label="Código secreto (cupom)" error={errors.code?.message}>
        <div className="flex gap-2">
          <TextInput
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="↑↑↓↓←→←→BA"
            className="min-h-12 flex-1 md:min-h-11"
            {...register("code")}
          />
          <Button
            type="submit"
            variant="secondary"
            aria-busy={validate.isPending}
            disabled={validate.isPending}
            className="min-h-12 px-3 text-[9px] md:min-h-11"
          >
            APLICAR
          </Button>
        </div>
      </Field>
    </form>
  );
}
