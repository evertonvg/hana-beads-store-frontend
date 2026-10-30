import { z } from "zod";
import { isValidCep, isValidCpf, onlyDigits } from "@/lib/format";
import { emailField, passwordField, phoneField } from "./auth";

export const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

export const PAYMENT_METHODS = ["pix", "cartao", "boleto"] as const;

/** Version of the Terms/Privacy notice shown by the checkout when it also creates an account. */
export const CHECKOUT_CONSENT_VERSION = "2026-10-28";

const required = (message: string, max = 120) =>
  z.string().trim().min(1, { error: message }).max(max);

/**
 * Card fields are validated in the browser only. The server never receives the number, holder,
 * expiry or CVV: the browser swaps them for a gateway token (here a mock stand-in; the real
 * integration tokenizes with Mercado Pago in the browser) and sends just the token.
 */
export const cardSchema = z.object({
  number: z.string().refine((v) => /^\d{13,19}$/.test(onlyDigits(v)), {
    error: "Informe o número do cartão.",
  }),
  holder: z.string().trim().min(2, { error: "Informe o nome impresso no cartão." }).max(60),
  expiry: z.string().refine((v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v), {
    error: "Informe a validade (MM/AA).",
  }),
  cvv: z.string().refine((v) => /^\d{3,4}$/.test(v), { error: "Informe o CVV." }),
});

/**
 * Stand-in token of the mock gateway. The test card 4000 0000 0000 0002 gets a token starting
 * with `mock_tok_declined_`, which the mock gateway declines.
 */
export const CARD_TOKEN = /^mock_tok_[A-Za-z0-9_-]{8,64}$/;

const checkoutBase = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Informe seu nome completo." })
    .max(100, { error: "Nome muito longo." }),
  email: emailField,
  phone: phoneField,
  cpf: z.string().refine((v) => isValidCpf(v), { error: "Informe um CPF válido." }),
  cep: z.string().refine((v) => isValidCep(v), { error: "Informe um CEP válido (8 números)." }),
  street: required("Informe a rua."),
  number: required("Informe o número.", 20),
  complement: z.string().trim().max(80).optional(),
  district: required("Informe o bairro."),
  city: required("Informe a cidade."),
  state: z.enum(UFS, { error: "Informe a UF." }),
  shippingId: z.string().min(1, { error: "Escolha uma opção de frete." }).max(40),
  couponCode: z.string().trim().max(40).optional(),
  payment: z.enum(PAYMENT_METHODS, { error: "Escolha a forma de pagamento." }),
  /** Gateway token and last 4 digits (display only), set by the browser for card payments. */
  cardToken: z.string().optional(),
  cardLast4: z
    .string()
    .regex(/^\d{4}$/, { error: "Dados do cartão inválidos." })
    .optional(),
  checkoutToken: z.uuid(),
  saveAccount: z.boolean(),
  password: z.string().max(200).optional(),
});

type Base = z.output<typeof checkoutBase>;

function checkPassword(v: Base, ctx: z.RefinementCtx) {
  if (v.saveAccount && !passwordField.safeParse(v.password ?? "").success) {
    ctx.addIssue({
      code: "custom",
      path: ["password"],
      message: "A senha precisa cumprir todas as regras.",
    });
  }
}

/** Server schema. Raw card fields are not part of it: unknown keys are dropped when parsing. */
export const checkoutSchema = checkoutBase.superRefine((v, ctx) => {
  if (v.payment === "cartao" && !CARD_TOKEN.test(v.cardToken ?? "")) {
    ctx.addIssue({
      code: "custom",
      path: ["cardToken"],
      message: "Não foi possível validar o cartão. Confira os dados.",
    });
  }
  checkPassword(v, ctx);
});

/** Browser form schema: the card inputs are enforced here (and only here) for card payments. */
export const checkoutFormSchema = checkoutBase
  .extend({
    // Loose on purpose: `cardSchema` is only enforced for card payments (superRefine below).
    card: z
      .object({ number: z.string(), holder: z.string(), expiry: z.string(), cvv: z.string() })
      .partial()
      .optional(),
  })
  .superRefine((v, ctx) => {
    if (v.payment === "cartao") {
      const parsed = cardSchema.safeParse(v.card ?? {});
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          ctx.addIssue({ code: "custom", path: ["card", ...issue.path], message: issue.message });
        }
      }
    }
    checkPassword(v, ctx);
  });

export type CheckoutInput = z.output<typeof checkoutSchema>;
export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
export type CheckoutFormOutput = z.output<typeof checkoutFormSchema>;
