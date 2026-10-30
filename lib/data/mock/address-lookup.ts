import type { AddressLookupPort } from "@/lib/data/ports";

/** Only the Praça da Sé CEP is known; any other valid CEP is typed by hand. */
export function createMockAddressLookup(): AddressLookupPort {
  return {
    byCep(cep) {
      if (cep.replace(/\D/g, "") !== "01001000") return Promise.resolve(null);
      return Promise.resolve({
        cep: "01001-000",
        street: "Praça da Sé",
        district: "Sé",
        city: "São Paulo",
        state: "SP",
      });
    },
  };
}
