"use server";

import { safeNext } from "@/lib/auth/redirect";
import { sanitizeCart } from "@/lib/cart/merge";
import { planCartSync } from "@/lib/cart/sync";
import type { CartData } from "@/lib/cart/types";
import { getData } from "@/lib/data";
import type { AuthProvider } from "@/lib/data/ports";
import { publicEnv } from "@/lib/env";
import { createSession, destroySession, getSession } from "@/lib/session";
import {
  AUTH_CONSENT_VERSION,
  loginSchema,
  recoverSchema,
  signupSchema,
} from "@/lib/validation/auth";
import { fieldErrorsFrom, type FormState } from "@/lib/validation/form-state";

/** `redirectTo` is already sanitized: the client may navigate to it as is. */
export type AuthResult = FormState & { redirectTo?: string };

const GENERIC_ERROR = "Não foi possível agora. Tente de novo.";
const BAD_CREDENTIALS = "E-mail ou senha incorretos.";

/** Same text for existing and unknown e-mails: never reveal who has an account. */
const RECOVER_SENT = "Se o e-mail estiver cadastrado, você vai receber um link.";

/** `next` travels next to the form values but is not part of the validated schema. */
function nextOf(input: unknown): unknown {
  return typeof input === "object" && input !== null ? (input as { next?: unknown }).next : null;
}

/** Sign in with e-mail and password. Revalidates with the same schema as the client. */
export async function loginAction(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: BAD_CREDENTIALS };
  try {
    const user = await getData().auth.signIn(parsed.data.email, parsed.data.password);
    if (!user) return { status: "error", message: BAD_CREDENTIALS };
    await createSession(user.id, parsed.data.remember);
    return { status: "ok", redirectTo: safeNext(nextOf(input)) };
  } catch (error) {
    console.error("loginAction failed", error);
    return { status: "error", message: GENERIC_ERROR };
  }
}

/** Create an account (consents recorded with the version of the text shown) and sign in. */
export async function signupAction(input: unknown): Promise<AuthResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }
  try {
    const { name, email, phone, password, marketingEmail } = parsed.data;
    const result = await getData().auth.signUp({
      name,
      email,
      phone,
      password,
      marketingEmail,
      acceptTerms: true,
      termsVersion: AUTH_CONSENT_VERSION,
    });
    if ("error" in result) {
      return {
        status: "error",
        message: "Confira os campos.",
        fieldErrors: { email: "E-mail já cadastrado." },
      };
    }
    await createSession(result.id, false);
    return { status: "ok", redirectTo: safeNext(nextOf(input)) };
  } catch (error) {
    console.error("signupAction failed", error);
    return { status: "error", message: GENERIC_ERROR };
  }
}

const PROVIDERS: readonly AuthProvider[] = ["google", "facebook", "apple"];

/** Social sign-in. The mock logs every provider in as the "ana" fixture. */
export async function socialAction(provider: string, next: unknown): Promise<AuthResult> {
  const allowed = PROVIDERS.find((p) => p === provider);
  if (!allowed || (allowed === "apple" && !publicEnv.authApple)) {
    return { status: "error", message: GENERIC_ERROR };
  }
  try {
    const user = await getData().auth.signInWithProvider(allowed);
    await createSession(user.id, false);
    return { status: "ok", redirectTo: safeNext(next) };
  } catch (error) {
    console.error("socialAction failed", error);
    return { status: "error", message: GENERIC_ERROR };
  }
}

/** "Esqueci minha senha": the answer is the same for every well-formed e-mail. */
export async function recoverAction(input: unknown): Promise<FormState> {
  const parsed = recoverSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }
  try {
    await getData().auth.requestPasswordReset(parsed.data.email);
  } catch (error) {
    console.error("recoverAction failed", error);
  }
  return { status: "ok", message: RECOVER_SENT };
}

/**
 * Right after sign-in: reconciles the local cart with the one saved on the server (`planCartSync`:
 * summed for a guest cart or another user's, the saved one when `owner` is this same user), saves
 * the result and returns it, with the user id to mark as owner, so the client can replace its store. Null without a session.
 */
export async function syncCartAction(
  lines: unknown,
  owner: unknown,
): Promise<(CartData & { owner: string }) | null> {
  const session = await getSession();
  if (!session) return null;
  const { auth, catalog } = getData();
  const guest = sanitizeCart({ lines });
  const saved = (await auth.savedCart(session.id)) ?? { lines: [] };
  const merged = planCartSync(guest, typeof owner === "string" ? owner : null, session.id, saved);
  const ids = [...new Set(merged.lines.map((l) => l.productId))];
  const known = new Set((await catalog.byIds(ids)).map((p) => p.id));
  const result: CartData = { lines: merged.lines.filter((l) => known.has(l.productId)) };
  await auth.saveCart(session.id, result);
  return { ...result, owner: session.id };
}

/** Sign-out: ends the session. The client also releases its cart (`useCartStore.release`). */
export async function logoutAction(): Promise<void> {
  await destroySession();
}
