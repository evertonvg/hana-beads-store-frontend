import { describe, expect, it } from "vitest";
import { consentConfig } from "@/lib/consent";

describe("consentConfig", () => {
  it("keeps optional categories off by default", () => {
    expect(consentConfig.categories?.performance?.enabled).not.toBe(true);
    expect(consentConfig.categories?.marketing?.enabled).not.toBe(true);
  });

  it("makes necessary cookies always on and read only", () => {
    expect(consentConfig.categories?.necessary).toMatchObject({ enabled: true, readOnly: true });
  });

  it("gives accept and reject equal visual weight", () => {
    expect(consentConfig.guiOptions?.consentModal?.equalWeightButtons).toBe(true);
    expect(consentConfig.guiOptions?.preferencesModal?.equalWeightButtons).toBe(true);
  });

  it("configures the consent cookie and revision", () => {
    expect(consentConfig.cookie).toMatchObject({
      name: "pp_consent",
      expiresAfterDays: 180,
      sameSite: "Lax",
    });
    expect(consentConfig.revision).toBe(1);
  });

  it("uses the design button copy", () => {
    const t = consentConfig.language?.translations as Record<
      string,
      { consentModal?: Record<string, unknown>; preferencesModal?: Record<string, unknown> }
    >;
    const modal = t["pt-BR"]?.consentModal;
    expect(modal?.title).toBe("SAVE DATA? (COOKIES)");
    expect(modal?.acceptAllBtn).toBe("ACEITAR TODOS");
    expect(modal?.acceptNecessaryBtn).toBe("REJEITAR OPCIONAIS");
    expect(modal?.showPreferencesBtn).toBe("PERSONALIZAR");
    expect(t["pt-BR"]?.preferencesModal?.savePreferencesBtn).toBe("SALVAR ESCOLHAS");
  });
});
