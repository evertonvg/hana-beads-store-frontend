import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/validation/checkout";

const valid = {
  name: "Ana Souza",
  email: "ana@teste.dev",
  phone: "(11) 91234-5678",
  cpf: "529.982.247-25",
  cep: "01001-000",
  street: "Praça da Sé",
  number: "100",
  complement: "",
  district: "Sé",
  city: "São Paulo",
  state: "SP",
  shippingId: "pac",
  couponCode: "",
  payment: "pix",
  checkoutToken: "3f6c1b1e-6d3b-4c6e-9d27-6f1b7a2d9c11",
  saveAccount: false,
  password: "",
};

const errorsOf = (over: object) => {
  const r = checkoutSchema.safeParse({ ...valid, ...over });
  return r.success
    ? {}
    : Object.fromEntries(r.error.issues.map((i) => [i.path.join("."), i.message]));
};

describe("checkoutSchema", () => {
  it("accepts a complete Pix order", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid CPF", () => {
    expect(errorsOf({ cpf: "111.111.111-11" }).cpf).toBe("Informe um CPF válido.");
  });

  it("rejects a CEP with 7 digits", () => {
    expect(errorsOf({ cep: "0100100" }).cep).toBe("Informe um CEP válido (8 números).");
  });

  it("rejects an invalid e-mail", () => {
    expect(errorsOf({ email: "ana@" }).email).toBe("Informe um e-mail válido.");
  });

  it("requires a shipping option and a known UF", () => {
    expect(errorsOf({ shippingId: "" }).shippingId).toBe("Escolha uma opção de frete.");
    expect(errorsOf({ state: "XX" }).state).toBeDefined();
  });

  it("requires the card fields only for card payments", () => {
    expect(errorsOf({ payment: "boleto" })).toEqual({});
    // The form always carries the (empty) card inputs, even when paying with Pix.
    const empty = { number: "", holder: "", expiry: "", cvv: "" };
    expect(errorsOf({ payment: "pix", card: empty })).toEqual({});
    expect(errorsOf({ payment: "cartao" })["card.number"]).toBeDefined();
    const card = {
      number: "4111 1111 1111 1111",
      holder: "ANA SOUZA",
      expiry: "12/30",
      cvv: "123",
    };
    expect(errorsOf({ payment: "cartao", card })).toEqual({});
    expect(
      errorsOf({ payment: "cartao", card: { ...card, expiry: "13/30" } })["card.expiry"],
    ).toBeDefined();
    expect(errorsOf({ payment: "cartao", card: { ...card, cvv: "1" } })["card.cvv"]).toBeDefined();
  });

  it("requires a password that meets the rules only when saving the account", () => {
    expect(errorsOf({ saveAccount: true, password: "" }).password).toBeDefined();
    expect(errorsOf({ saveAccount: true, password: "fraca" }).password).toBeDefined();
    expect(errorsOf({ saveAccount: true, password: "Senha@123" })).toEqual({});
  });
});
