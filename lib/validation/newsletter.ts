import { z } from "zod";

/** Version of the consent text shown next to the newsletter checkbox; bump when the text changes. */
export const NEWSLETTER_CONSENT_VERSION = "2026-10-28";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "Informe um e-mail válido." })),
  consent: z
    .boolean({ error: "Marque a caixa para continuar." })
    .refine((v): v is true => v, { error: "Marque a caixa para continuar." }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
