import type { CouponPort } from "@/lib/data/ports";

/** `TESTE10` is valid (discount value is a placeholder), `EXPIRADO` is expired. */
export function createMockCoupons(): CouponPort {
  return {
    validate(code) {
      const normalized = code.trim().toUpperCase();
      if (normalized === "TESTE10") {
        return Promise.resolve({
          ok: true,
          code: normalized,
          discountCents: null,
          label: "[desconto]",
        });
      }
      if (normalized === "EXPIRADO") return Promise.resolve({ ok: false, reason: "expirado" });
      return Promise.resolve({ ok: false, reason: "invalido" });
    },
  };
}
