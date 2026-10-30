import { describe, expect, it } from "vitest";
import { pixRemaining } from "@/lib/pix-countdown";

const NOW = Date.parse("2026-10-29T12:00:00.000Z");
const at = (offsetSeconds: number) => new Date(NOW + offsetSeconds * 1000).toISOString();

describe("pixRemaining", () => {
  it("shows 30:00 with a full bar when the code was just created", () => {
    expect(pixRemaining(at(1800), NOW)).toEqual({
      seconds: 1800,
      label: "30:00",
      ratio: 1,
      low: false,
    });
  });

  it("turns low under 5 minutes", () => {
    const r = pixRemaining(at(299), NOW);
    expect(r.low).toBe(true);
    expect(r.label).toBe("04:59");
    expect(pixRemaining(at(300), NOW).low).toBe(false);
  });

  it("never goes below zero", () => {
    expect(pixRemaining(at(-5), NOW)).toEqual({ seconds: 0, label: "00:00", ratio: 0, low: true });
  });

  it("scales the bar with the time left", () => {
    expect(pixRemaining(at(900), NOW).ratio).toBe(0.5);
  });

  it("never shows more than the full 30 minutes (clock skew)", () => {
    expect(pixRemaining(at(1801), NOW)).toMatchObject({ seconds: 1800, label: "30:00", ratio: 1 });
  });
});
