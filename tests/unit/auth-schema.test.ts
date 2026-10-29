import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/auth/redirect";
import {
  AUTH_CONSENT_VERSION,
  loginSchema,
  passwordRules,
  recoverSchema,
  signupSchema,
} from "@/lib/validation/auth";

const failing = (password: string) =>
  passwordRules.filter((r) => !r.test(password)).map((r) => r.id);

const validSignup = {
  name: "Ana Souza",
  email: "nova@teste.dev",
  phone: "(11) 91234-5678",
  password: "Senha@123",
  acceptTerms: true,
  marketingEmail: false,
};

describe("passwordRules", () => {
  it("lists the four rules with their labels", () => {
    expect(passwordRules.map((r) => [r.id, r.label])).toEqual([
      ["len", "8+ caracteres"],
      ["upper", "1 maiúscula"],
      ["digit", "1 número"],
      ["symbol", "1 símbolo"],
    ]);
  });

  it("fails every rule for a short lowercase word", () => {
    expect(failing("abc")).toEqual(["len", "upper", "digit", "symbol"]);
  });

  it("fails three of four for a long lowercase word", () => {
    expect(failing("abcdefgh")).toEqual(["upper", "digit", "symbol"]);
  });

  it("passes a strong password", () => {
    expect(failing("Senha@123")).toEqual([]);
  });

  it("does not count a letter or a space as a symbol", () => {
    expect(failing("Abcdefg1")).toEqual(["symbol"]);
    expect(failing("Abcdef 1")).toEqual(["symbol"]);
  });
});

describe("signupSchema", () => {
  it("accepts a valid signup and trims text fields", () => {
    const out = signupSchema.parse({ ...validSignup, name: "  Ana Souza ", email: " a@b.co " });
    expect(out.name).toBe("Ana Souza");
    expect(out.email).toBe("a@b.co");
  });

  it("requires the terms to be accepted", () => {
    expect(signupSchema.safeParse({ ...validSignup, acceptTerms: false }).success).toBe(false);
  });

  it("rejects a weak password, a short phone, a bad e-mail and a one-letter name", () => {
    for (const patch of [
      { password: "abc" },
      { phone: "(11) 1234" },
      { email: "x" },
      { name: "A" },
    ]) {
      expect(signupSchema.safeParse({ ...validSignup, ...patch }).success).toBe(false);
    }
  });

  it("uses the consent version of the copy shown in the form", () => {
    expect(AUTH_CONSENT_VERSION).toBe("2026-10-28");
  });
});

describe("loginSchema / recoverSchema", () => {
  it("needs an e-mail and a password", () => {
    expect(loginSchema.safeParse({ email: "a@b.co", password: "x", remember: false }).success).toBe(
      true,
    );
    expect(loginSchema.safeParse({ email: "a@b.co", password: "", remember: false }).success).toBe(
      false,
    );
    expect(recoverSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("safeNext", () => {
  it.each(["/conta", "/conta/pedidos?x=1", "/loja#topo", "/"])("keeps %s", (value) => {
    expect(safeNext(value)).toBe(value);
  });

  it.each([
    "//evil.com",
    "/\\evil.com",
    "/\\/evil.com",
    "\\\\evil.com",
    "https://evil.com",
    "http://evil.com/conta",
    "javascript:alert(1)",
    "evil.com",
    "",
    "/%2F%2Fevil.com",
    "/%5Cevil.com",
    "/%252F%252Fevil.com",
    "/\t/evil.com",
    "/%09/evil.com",
    "/%0a/evil.com",
  ])("falls back to /conta for %j", (value) => {
    expect(safeNext(value)).toBe("/conta");
  });

  it("falls back for non-strings and uses a custom fallback", () => {
    expect(safeNext(undefined)).toBe("/conta");
    expect(safeNext(["/a", "/b"])).toBe("/conta");
    expect(safeNext("//x", "/")).toBe("/");
  });
});
