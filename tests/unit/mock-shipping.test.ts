import { describe, expect, it } from "vitest";
import { createMockCoupons } from "@/lib/data/mock/coupons";
import { createMockShipping } from "@/lib/data/mock/shipping";

const items = [{ productId: "garota", qty: 1 }];

describe("mock shipping", () => {
  it("quotes PAC and SEDEX with placeholder price and deadline for any 8-digit CEP", async () => {
    const result = await createMockShipping().quote({ cep: "01001000", items });
    expect(result).toEqual([
      { id: "pac", service: "PAC", carrier: "Correios", priceCents: null, days: "[X] dias" },
      { id: "sedex", service: "SEDEX", carrier: "Correios", priceCents: null, days: "[X] dias" },
    ]);
  });

  it("accepts a masked CEP", async () => {
    const result = await createMockShipping().quote({ cep: "01001-000", items });
    expect(Array.isArray(result)).toBe(true);
  });

  it("does not serve 00000000", async () => {
    expect(await createMockShipping().quote({ cep: "00000-000", items })).toEqual({
      error: "cep_nao_atendido",
    });
  });

  it.each(["", "0100100", "010010000", "abcdefgh"])("rejects %j as invalid", async (cep) => {
    expect(await createMockShipping().quote({ cep, items })).toEqual({ error: "cep_invalido" });
  });
});

describe("mock coupons", () => {
  it("accepts TESTE10 with a placeholder discount, ignoring case and spaces", async () => {
    expect(await createMockCoupons().validate(" teste10 ", null)).toEqual({
      ok: true,
      code: "TESTE10",
      discountCents: null,
      label: "[desconto]",
    });
  });

  it("reports EXPIRADO as expired", async () => {
    expect(await createMockCoupons().validate("EXPIRADO", 1000)).toEqual({
      ok: false,
      reason: "expirado",
    });
  });

  it("reports anything else as invalid", async () => {
    expect(await createMockCoupons().validate("QUALQUER", 1000)).toEqual({
      ok: false,
      reason: "invalido",
    });
  });
});
