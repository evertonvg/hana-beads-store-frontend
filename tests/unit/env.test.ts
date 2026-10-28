import { describe, expect, it } from "vitest";
import { publicEnvSchema, toPublicEnv } from "@/lib/env";

const parse = (raw: Record<string, string | undefined>) =>
  toPublicEnv(publicEnvSchema.parse(raw));

describe("publicEnv", () => {
  it("applies defaults when nothing is set", () => {
    const env = parse({});
    expect(env.contactChannel).toBe("instagram");
    expect(env.parallaxIntensity).toBe(1);
    expect(env.freeShippingCents).toBeNull();
    expect(env.authApple).toBe(false);
    expect(env.instagramUser).toBeNull();
    expect(env.whatsappNumber).toBeNull();
    expect(env.analyticsSrc).toBeNull();
  });

  it("clamps parallax intensity to 0-2", () => {
    expect(parse({ NEXT_PUBLIC_PARALLAX_INTENSITY: "9" }).parallaxIntensity).toBe(2);
    expect(parse({ NEXT_PUBLIC_PARALLAX_INTENSITY: "-3" }).parallaxIntensity).toBe(0);
  });

  it("falls back to instagram on an unknown contact channel", () => {
    expect(parse({ NEXT_PUBLIC_CONTACT_CHANNEL: "telegram" }).contactChannel).toBe(
      "instagram",
    );
  });

  it("reads optional values", () => {
    const env = parse({
      NEXT_PUBLIC_CONTACT_CHANNEL: "whatsapp",
      NEXT_PUBLIC_FREE_SHIPPING_CENTS: "20000",
      NEXT_PUBLIC_AUTH_APPLE: "true",
    });
    expect(env.contactChannel).toBe("whatsapp");
    expect(env.freeShippingCents).toBe(20000);
    expect(env.authApple).toBe(true);
  });
});
