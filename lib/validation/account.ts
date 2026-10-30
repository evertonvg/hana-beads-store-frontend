import { z } from "zod";
import { isValidCpf } from "@/lib/format";
import { passwordField, phoneField } from "./auth";

/** "Meus dados". The CPF is optional: an empty text means none. */
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Informe seu nome completo." })
    .max(100, { error: "Nome muito longo." }),
  phone: phoneField,
  cpf: z
    .string()
    .trim()
    .refine((v) => v === "" || isValidCpf(v), { error: "Informe um CPF válido." }),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, { error: "Informe a senha atual." }).max(200),
    next: passwordField,
    confirm: z.string().max(200),
  })
  .refine((v) => v.next === v.confirm, {
    path: ["confirm"],
    error: "As senhas não conferem.",
  })
  .refine((v) => v.next !== v.current, {
    path: ["next"],
    error: "A nova senha precisa ser diferente da atual.",
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, { error: "Informe a senha." }).max(200),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
