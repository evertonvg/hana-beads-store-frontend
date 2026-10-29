import { z } from "zod";

export const CHECKOUT_DRAFT_KEY = "pp_checkout_draft";

const draftSchema = z.object({
  cep: z.string(),
  quotes: z.array(
    z.object({
      id: z.string(),
      service: z.string(),
      carrier: z.string(),
      priceCents: z.number().nullable(),
      days: z.string(),
    }),
  ),
  shippingId: z.string().nullable(),
  coupon: z
    .object({
      code: z.string(),
      label: z.string(),
      discountCents: z.number().nullable(),
    })
    .nullable(),
});

/** What the cart hands to the checkout: the CEP, its shipping options, the chosen one and the coupon. */
export type CheckoutDraft = z.infer<typeof draftSchema>;

export const EMPTY_DRAFT: CheckoutDraft = { cep: "", quotes: [], shippingId: null, coupon: null };

/** Reads the draft from sessionStorage; missing, blocked or corrupted storage gives an empty draft. */
export function readDraft(): CheckoutDraft {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (raw === null) return EMPTY_DRAFT;
    const parsed = draftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

export function writeDraft(draft: CheckoutDraft): void {
  try {
    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage blocked or full: the checkout will ask again.
  }
}
