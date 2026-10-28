import { describe, expect, it } from "vitest";
import { parallaxOffset, seededRandom } from "@/lib/motion";

describe("parallaxOffset", () => {
  it("scales progress by speed, range and intensity (negated)", () => {
    expect(parallaxOffset(1, 0.7, 1)).toBe(-182);
  });
  it("clamps progress to +-1.5", () => {
    expect(parallaxOffset(5, 1, 1)).toBe(-390);
    expect(parallaxOffset(-5, 1, 1)).toBe(390);
  });
  it("is zero with intensity 0", () => {
    expect(parallaxOffset(1, 1, 0) + 0).toBe(0);
  });
  it("accepts a custom range", () => {
    expect(parallaxOffset(1, 1, 1, 400)).toBe(-400);
  });
});

describe("seededRandom", () => {
  it("follows the design LCG", () => {
    expect(seededRandom(7)()).toBeCloseTo(0.4904, 4);
  });
  it("is deterministic", () => {
    const a = seededRandom(7);
    const b = seededRandom(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
