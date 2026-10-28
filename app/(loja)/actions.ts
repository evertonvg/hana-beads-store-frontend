"use server";

import { getData } from "@/lib/data";
import { fieldErrorsFrom, type FormState } from "@/lib/validation/form-state";
import {
  NEWSLETTER_CONSENT_VERSION,
  newsletterSchema,
  type NewsletterInput,
} from "@/lib/validation/newsletter";

/** Newsletter signup. Revalidates with the same schema as the client: never trust the form. */
export async function subscribeNewsletter(input: NewsletterInput): Promise<FormState> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }
  const { status } = await getData().newsletter.subscribe({
    email: parsed.data.email,
    consent: true,
    consentVersion: NEWSLETTER_CONSENT_VERSION,
  });
  return {
    status: "ok",
    message:
      status === "already"
        ? "Esse e-mail já está na lista."
        : "YES! Você entrou na lista. Em breve chegam os novos personagens.",
  };
}
