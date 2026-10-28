import { beforeEach, describe, expect, it } from "vitest";
import { createMockNewsletter, FAIL_EMAIL } from "@/lib/data/mock/newsletter";
import { getMockStore } from "@/lib/data/mock/store";

const input = { email: "Ana@Teste.dev", consent: true, consentVersion: "v1" } as const;

describe("mock newsletter", () => {
  beforeEach(() => getMockStore().reset());

  it("subscribes a new e-mail and records the consent version", async () => {
    const result = await createMockNewsletter().subscribe(input);
    expect(result).toEqual({ status: "ok" });
    expect(getMockStore().newsletter).toEqual([{ email: "ana@teste.dev", consentVersion: "v1" }]);
  });

  it("reports an already subscribed e-mail, ignoring case", async () => {
    const port = createMockNewsletter();
    await port.subscribe(input);
    const result = await port.subscribe({ ...input, email: "ana@teste.dev" });
    expect(result).toEqual({ status: "already" });
    expect(getMockStore().newsletter).toHaveLength(1);
  });

  it("rejects for the failure e-mail", async () => {
    await expect(
      createMockNewsletter().subscribe({ ...input, email: FAIL_EMAIL }),
    ).rejects.toThrow();
  });

  it("is cleared by reset", async () => {
    await createMockNewsletter().subscribe(input);
    getMockStore().reset();
    expect(getMockStore().newsletter).toEqual([]);
  });
});
