import type { ShippingPort } from "@/lib/data/ports";

const CEP_FORMAT = /^\d{5}-?\d{3}$/;

/** Any well-formed CEP is served (except 00000-000); price and deadline stay placeholders. */
export function createMockShipping(): ShippingPort {
  return {
    quote({ cep }) {
      const value = cep.trim();
      if (!CEP_FORMAT.test(value)) return Promise.resolve({ error: "cep_invalido" });
      if (value.replace("-", "") === "00000000") {
        return Promise.resolve({ error: "cep_nao_atendido" });
      }
      return Promise.resolve([
        { id: "pac", service: "PAC", carrier: "Correios", priceCents: null, days: "[X] dias" },
        { id: "sedex", service: "SEDEX", carrier: "Correios", priceCents: null, days: "[X] dias" },
      ]);
    },
  };
}
