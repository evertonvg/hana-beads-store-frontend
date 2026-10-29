import { sealData } from "iron-session";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SECRET = "unit-secret-unit-secret-unit-secret-00";
const DAY = 24 * 60 * 60;

const { jar, setOptions, userById } = vi.hoisted(() => ({
  jar: new Map<string, string>(),
  setOptions: [] as Record<string, unknown>[],
  userById: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) as string } : undefined),
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      set: (name: string, value: string, options: Record<string, unknown>) => {
        setOptions.push(options);
        if (value === "" || options.maxAge === 0) jar.delete(name);
        else jar.set(name, value);
      },
    }),
}));
vi.mock("next/server", () => ({ connection: () => Promise.resolve() }));
vi.mock("@/lib/data", () => ({ getData: () => ({ auth: { userById } }) }));

import { createSession, destroySession, getSession } from "@/lib/session";

const ana = { id: "ana", name: "Ana", email: "ana@teste.dev" };
const seal = (data: object) => sealData(data, { password: SECRET });
const inOneHour = () => Date.now() + 60 * 60 * 1000;

beforeEach(() => {
  jar.clear();
  setOptions.length = 0;
  userById.mockReset();
  userById.mockImplementation((id: string) => Promise.resolve(id === "ana" ? ana : null));
});

afterEach(() => vi.unstubAllEnvs());

describe("getSession", () => {
  it("is null without a cookie", async () => {
    expect(await getSession()).toBeNull();
  });

  it("opens a valid seal and returns the user", async () => {
    jar.set("pp_session", await seal({ userId: "ana", expiresAt: inOneHour() }));
    expect(await getSession()).toEqual(ana);
  });

  it("is null when one character of the seal changed", async () => {
    const value = await seal({ userId: "ana", expiresAt: inOneHour() });
    const i = Math.floor(value.indexOf("~") / 2);
    const tampered = `${value.slice(0, i)}${value[i] === "A" ? "B" : "A"}${value.slice(i + 1)}`;
    jar.set("pp_session", tampered);
    expect(await getSession()).toBeNull();
    expect(userById).not.toHaveBeenCalled();
  });

  it("is null when the seal was made with another secret", async () => {
    const other = await sealData(
      { userId: "ana", expiresAt: inOneHour() },
      { password: "another-secret-another-secret-00000" },
    );
    jar.set("pp_session", other);
    expect(await getSession()).toBeNull();
  });

  it("is null when expiresAt is in the past", async () => {
    jar.set("pp_session", await seal({ userId: "ana", expiresAt: Date.now() - 1000 }));
    expect(await getSession()).toBeNull();
  });

  it("is null when expiresAt is missing or the user no longer exists", async () => {
    jar.set("pp_session", await seal({ userId: "ana" }));
    expect(await getSession()).toBeNull();
    jar.set("pp_session", await seal({ userId: "ghost", expiresAt: inOneHour() }));
    expect(await getSession()).toBeNull();
  });
});

describe("createSession / destroySession", () => {
  it("writes a cookie that getSession reads back, then destroy clears it", async () => {
    await createSession("ana", false);
    expect(await getSession()).toEqual(ana);
    await destroySession();
    expect(await getSession()).toBeNull();
  });

  it("without remember: session cookie (no max-age), httpOnly, lax", async () => {
    await createSession("ana", false);
    const options = setOptions[0];
    expect(options).toMatchObject({ httpOnly: true, sameSite: "lax", secure: false, path: "/" });
    expect(options.maxAge).toBeUndefined();
  });

  it("with remember: lasts about 30 days", async () => {
    await createSession("ana", true);
    const maxAge = setOptions[0].maxAge as number;
    expect(maxAge).toBeGreaterThan(29 * DAY);
    expect(maxAge).toBeLessThanOrEqual(30 * DAY);
  });

  it("is secure in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await createSession("ana", false);
    expect(setOptions[0]).toMatchObject({ secure: true });
  });
});
