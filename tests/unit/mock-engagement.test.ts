import { beforeEach, describe, expect, it } from "vitest";
import { createMockEngagement } from "@/lib/data/mock/engagement";
import { getMockStore } from "@/lib/data/mock/store";

const alert = {
  userId: null,
  email: "Ana@Teste.dev",
  productId: "planeta",
  consentedAt: "2026-10-28T12:00:00.000Z",
} as const;

describe("mock engagement", () => {
  beforeEach(() => getMockStore().reset());

  it("toggles a favorite on and off and returns the new state", async () => {
    const port = createMockEngagement();
    expect(await port.toggleFavorite("u1", "garota")).toBe(true);
    expect(await port.favorites("u1")).toEqual(["garota"]);
    expect(await port.toggleFavorite("u1", "garota")).toBe(false);
    expect(await port.favorites("u1")).toEqual([]);
  });

  it("keeps favorites per user", async () => {
    const port = createMockEngagement();
    await port.toggleFavorite("u1", "garota");
    expect(await port.favorites("u2")).toEqual([]);
  });

  it("records a stock alert with a normalized e-mail and the consent time", async () => {
    await createMockEngagement().requestStockAlert(alert);
    expect(getMockStore().stockAlerts).toEqual([{ ...alert, email: "ana@teste.dev" }]);
  });

  it("does not duplicate the same e-mail and product", async () => {
    const port = createMockEngagement();
    await port.requestStockAlert(alert);
    await port.requestStockAlert({ ...alert, email: "ana@teste.dev" });
    expect(getMockStore().stockAlerts).toHaveLength(1);
  });

  it("is cleared by reset", async () => {
    const port = createMockEngagement();
    await port.toggleFavorite("u1", "garota");
    await port.requestStockAlert(alert);
    getMockStore().reset();
    expect(await port.favorites("u1")).toEqual([]);
    expect(getMockStore().stockAlerts).toEqual([]);
  });
});
