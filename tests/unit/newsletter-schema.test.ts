import { describe, expect, it } from "vitest";
import { newsletterSchema } from "@/lib/validation/newsletter";

describe("newsletterSchema", () => {
  it("accepts a valid e-mail with consent", () => {
    const parsed = newsletterSchema.safeParse({ email: "ana@teste.dev", consent: true });
    expect(parsed.success).toBe(true);
  });

  it("rejects a missing consent", () => {
    const parsed = newsletterSchema.safeParse({ email: "ana@teste.dev" });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.map((i) => i.path[0])).toContain("consent");
  });

  it("rejects consent = false", () => {
    expect(newsletterSchema.safeParse({ email: "ana@teste.dev", consent: false }).success).toBe(
      false,
    );
  });

  it("rejects an invalid e-mail", () => {
    const parsed = newsletterSchema.safeParse({ email: "isso-nao-e-email", consent: true });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.map((i) => i.path[0])).toContain("email");
  });

  it("rejects an e-mail longer than 254 characters", () => {
    const email = `${"a".repeat(250)}@b.co`;
    expect(newsletterSchema.safeParse({ email, consent: true }).success).toBe(false);
  });

  it("trims the e-mail", () => {
    const parsed = newsletterSchema.parse({ email: "  ana@teste.dev ", consent: true });
    expect(parsed.email).toBe("ana@teste.dev");
  });
});
