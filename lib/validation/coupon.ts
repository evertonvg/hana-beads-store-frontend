import { z } from "zod";

/** "Código secreto (cupom)" field. */
export const couponSchema = z.object({
  code: z.string().trim().min(1, "Digite o código.").max(40, "Código muito longo."),
});

export type CouponInput = z.infer<typeof couponSchema>;
