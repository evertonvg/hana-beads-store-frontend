import { z } from "zod";

/** Version of the Terms/Privacy text accepted at signup; bump when the texts change. */
export const AUTH_CONSENT_VERSION = "2026-10-28";

export type PasswordRule = {
  id: "len" | "upper" | "digit" | "symbol";
  label: string;
  test(password: string): boolean;
};

export const passwordRules: readonly PasswordRule[] = [
  { id: "len", label: "8+ caracteres", test: (p) => p.length >= 8 },
  { id: "upper", label: "1 maiúscula", test: (p) => /\p{Lu}/u.test(p) },
  { id: "digit", label: "1 número", test: (p) => /\d/.test(p) },
  { id: "symbol", label: "1 símbolo", test: (p) => /[^\p{L}\p{N}\s]/u.test(p) },
];

export const emailField = z
  .string()
  .trim()
  .max(254, { error: "Informe um e-mail válido." })
  .pipe(z.email({ error: "Informe um e-mail válido." }));

export const phoneField = z
  .string()
  .trim()
  .refine((v) => [10, 11].includes(v.replace(/\D/g, "").length), {
    error: "Informe o celular com DDD.",
  });

/** The rules above as one check, for forms that ask for a password only sometimes. */
export const passwordField = z
  .string()
  .max(200)
  .refine((p) => passwordRules.every((r) => r.test(p)), {
    error: "A senha precisa cumprir todas as regras.",
  });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { error: "Informe a senha." }).max(200),
  remember: z.boolean(),
});

export const recoverSchema = z.object({ email: emailField });

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Informe seu nome completo." })
      .max(100, { error: "Nome muito longo." }),
    email: emailField,
    phone: phoneField,
    password: passwordField,
    confirmPassword: z.string().max(200),
    acceptTerms: z
      .boolean({ error: "Aceite os Termos e a Política para continuar." })
      .refine((v): v is true => v, { error: "Aceite os Termos e a Política para continuar." }),
    marketingEmail: z.boolean(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    error: "As senhas não conferem.",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RecoverInput = z.infer<typeof recoverSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
