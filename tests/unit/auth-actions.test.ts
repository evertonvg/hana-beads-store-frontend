import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSession, getSession } = vi.hoisted(() => ({
  createSession: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/session", () => ({ createSession, getSession, destroySession: vi.fn() }));

import {
  loginAction,
  recoverAction,
  signupAction,
  socialAction,
  syncCartAction,
} from "@/app/(conta)/actions";
import { getMockStore } from "@/lib/data/mock/store";

const ana = { id: "ana", name: "Ana Souza", email: "ana@teste.dev" };
const login = (over: object = {}) => ({
  email: "ana@teste.dev",
  password: "Senha@123",
  remember: false,
  ...over,
});
const signup = (over: object = {}) => ({
  name: "Nova Pessoa",
  email: "nova@teste.dev",
  phone: "(11) 91234-5678",
  password: "Senha@123",
  acceptTerms: true,
  marketingEmail: false,
  ...over,
});

beforeEach(() => {
  getMockStore().reset();
  createSession.mockReset();
  getSession.mockReset();
  getSession.mockResolvedValue(null);
});

describe("loginAction", () => {
  it("creates the session and returns the safe redirect", async () => {
    const r = await loginAction(login({ remember: true, next: "/loja?x=1" }));
    expect(r).toEqual({ status: "ok", redirectTo: "/loja?x=1" });
    expect(createSession).toHaveBeenCalledWith("ana", true);
  });

  it.each(["//evil.com", "/\\evil.com", "https://evil.com", undefined])(
    "ignores the unsafe next %j and goes to /conta",
    async (next) => {
      expect(await loginAction(login({ next }))).toEqual({ status: "ok", redirectTo: "/conta" });
    },
  );

  it("gives the same generic error for a wrong password, unknown e-mail and invalid input", async () => {
    const wrong = await loginAction(login({ password: "errada" }));
    const unknown = await loginAction(login({ email: "ninguem@teste.dev" }));
    const invalid = await loginAction({ email: "x", password: "" });
    expect(wrong).toEqual({ status: "error", message: "E-mail ou senha incorretos." });
    expect(unknown).toEqual(wrong);
    expect(invalid).toEqual(wrong);
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("signupAction", () => {
  it("creates the account, the session and the consents", async () => {
    const r = await signupAction(signup({ marketingEmail: true }));
    expect(r).toEqual({ status: "ok", redirectTo: "/conta" });
    expect(createSession).toHaveBeenCalledWith(expect.any(String), false);
    expect(getMockStore().consents.map((c) => [c.type, c.version])).toEqual([
      ["terms", "2026-10-28"],
      ["privacy", "2026-10-28"],
      ["email_marketing", "2026-10-28"],
    ]);
  });

  it("reports an e-mail already in use on the email field", async () => {
    const r = await signupAction(signup({ email: "ana@teste.dev" }));
    expect(r).toEqual({
      status: "error",
      message: "Confira os campos.",
      fieldErrors: { email: "E-mail já cadastrado." },
    });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("revalidates on the server: weak password and unaccepted terms", async () => {
    const weak = await signupAction(signup({ password: "abc" }));
    expect(weak.status).toBe("error");
    expect(weak.fieldErrors).toHaveProperty("password");
    const terms = await signupAction(signup({ acceptTerms: false }));
    expect(terms.fieldErrors).toHaveProperty("acceptTerms");
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("recoverAction", () => {
  it("answers identically for a known and an unknown e-mail", async () => {
    const known = await recoverAction({ email: "ana@teste.dev" });
    const unknown = await recoverAction({ email: "ninguem@teste.dev" });
    expect(known.status).toBe("ok");
    expect(unknown).toEqual(known);
  });

  it("rejects a malformed e-mail", async () => {
    expect((await recoverAction({ email: "x" })).status).toBe("error");
  });
});

describe("socialAction", () => {
  it("signs in as ana for a known provider", async () => {
    expect(await socialAction("google", "/loja")).toEqual({ status: "ok", redirectTo: "/loja" });
    expect(createSession).toHaveBeenCalledWith("ana", false);
  });

  it("refuses unknown providers and Apple while it is disabled", async () => {
    expect((await socialAction("github", undefined)).status).toBe("error");
    expect((await socialAction("apple", undefined)).status).toBe("error");
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("syncCartAction", () => {
  it("needs a session", async () => {
    expect(await syncCartAction([])).toBeNull();
  });

  it("merges the local cart with the saved one, drops unknown products and saves", async () => {
    getSession.mockResolvedValue(ana);
    const merged = await syncCartAction([
      { productId: "garota", ring: "mosquetao", qty: 1 },
      { productId: "e13", ring: "mosquetao", qty: 2 },
      { productId: "nao-existe", ring: "estrela", qty: 1 },
      { bad: true },
    ]);
    expect(merged).toEqual({
      lines: [
        { productId: "e13", ring: "mosquetao", qty: 3 },
        { productId: "garota", ring: "mosquetao", qty: 1 },
      ],
    });
    expect(getMockStore().savedCarts.ana).toEqual(merged);
  });
});
