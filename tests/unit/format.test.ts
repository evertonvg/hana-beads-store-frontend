import { describe, expect, it } from "vitest";
import {
  formatCep,
  formatCpf,
  formatDate,
  formatOrderNumber,
  formatPhone,
  formatPrice,
  formatTotal,
  isValidCep,
  isValidCpf,
  isValidPhone,
  onlyDigits,
} from "@/lib/format";

describe("formatPrice", () => {
  it("formats cents as BRL with a normal space", () => {
    expect(formatPrice(1990)).toBe("R$ 19,90");
    expect(formatPrice(1990)).not.toContain(" ");
  });

  it("uses the placeholder when there is no price", () => {
    expect(formatPrice(null)).toBe("[PREÇO]");
  });
});

describe("formatTotal", () => {
  it("formats cents as BRL", () => {
    expect(formatTotal(1990)).toBe("R$ 19,90");
  });

  it("uses the value placeholder when there is no total", () => {
    expect(formatTotal(null)).toBe("[VALOR]");
  });
});

describe("cpf, cep and phone", () => {
  it("formats CEP", () => {
    expect(formatCep("01001000")).toBe("01001-000");
  });

  it("formats CPF", () => {
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
  });

  it("formats phone", () => {
    expect(formatPhone("11987654321")).toBe("(11) 98765-4321");
  });

  it("validates CPF", () => {
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });

  it("validates CEP", () => {
    expect(isValidCep("01001-000")).toBe(true);
    expect(isValidCep("1234")).toBe(false);
  });

  it("validates phone", () => {
    expect(isValidPhone("(11) 98765-4321")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
  });

  it("keeps only digits", () => {
    expect(onlyDigits("(11) 98765-4321")).toBe("11987654321");
    expect(onlyDigits("01001-000")).toBe("01001000");
  });
});

describe("formatDate", () => {
  it("formats ISO dates as dd/MM/yyyy by default", () => {
    expect(formatDate("2026-10-28T12:00:00Z")).toBe("28/10/2026");
  });

  it("accepts a custom pattern in pt-BR", () => {
    expect(formatDate("2026-10-28T12:00:00Z", "d 'de' MMMM")).toBe("28 de outubro");
  });

  it("uses the date placeholder when there is no date", () => {
    expect(formatDate(null)).toBe("[00/00/0000]");
  });
});

describe("formatOrderNumber", () => {
  it("prefixes the order number with #", () => {
    expect(formatOrderNumber("0005")).toBe("#0005");
  });
});
