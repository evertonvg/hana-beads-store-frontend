import { z } from "zod";
import { isValidCep } from "@/lib/format";

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

const required = (message: string, max = 120) =>
  z.string().trim().min(1, { error: message }).max(max);

/** Street address fields shared by the checkout and the address book. */
export const addressFields = {
  cep: z.string().refine((v) => isValidCep(v), { error: "Informe um CEP válido (8 números)." }),
  street: required("Informe a rua."),
  number: required("Informe o número.", 20),
  complement: z.string().trim().max(80).optional(),
  district: required("Informe o bairro."),
  city: required("Informe a cidade."),
  state: z.enum(UFS, { error: "Informe a UF." }),
};

/** An address of the address book (nickname and "main address" on top of the street data). */
export const addressSchema = z.object({
  id: z.string().max(80).optional(),
  label: z.string().trim().max(30, { error: "Apelido muito longo." }).optional(),
  ...addressFields,
  isDefault: z.boolean(),
});

export type AddressFormInput = z.input<typeof addressSchema>;
export type AddressFormOutput = z.output<typeof addressSchema>;
