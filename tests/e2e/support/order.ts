import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { gotoHydrated } from "./hydration";

export const CART_KEY = "pp_cart_v1";

/** Puts one item in the persisted cart on the first page load of the tab only. */
export async function seedCart(page: Page) {
  await page.addInitScript(
    ([key, value]) => {
      // A later navigation must keep whatever the app stored (e.g. the cart emptied on confirm).
      if (sessionStorage.getItem("pp_e2e_seeded") === null) {
        localStorage.setItem(key, value);
        sessionStorage.setItem("pp_e2e_seeded", "1");
      }
    },
    [
      CART_KEY,
      JSON.stringify({
        state: { lines: [{ productId: "garota", ring: "mosquetao", qty: 1 }] },
        version: 1,
      }),
    ] as [string, string],
  );
}

const field = (page: Page, label: string) => page.getByLabel(label, { exact: true });

export type Method = "pix" | "boleto" | "cartao";

/** Runs the whole checkout as a guest and stops on the page the app sends the buyer to. */
export async function placeOrder(page: Page, method: Method, card = "4111 1111 1111 1111") {
  await seedCart(page);
  await gotoHydrated(page, "/checkout");
  await expect(page.getByRole("heading", { level: 1, name: "SAVE GAME" })).toBeVisible();
  await field(page, "Nome completo").fill("Nova Pessoa");
  await field(page, "E-mail").fill("nova@teste.dev");
  await field(page, "Celular").fill("11912345678");
  await field(page, "CPF").fill("52998224725");
  await field(page, "CEP").fill("01001000");
  await expect(field(page, "Rua")).toHaveValue("Praça da Sé");
  await field(page, "Número").fill("100");
  await page.getByRole("radio", { name: /PAC/ }).click();
  if (method === "boleto") await page.getByRole("radio", { name: /BOLETO/ }).click();
  if (method === "cartao") {
    await page.getByRole("radio", { name: /CARTÃO/ }).click();
    await field(page, "Número do cartão").fill(card);
    await field(page, "Nome impresso no cartão").fill("NOVA PESSOA");
    await field(page, "Validade").fill("1230");
    await field(page, "CVV").fill("737");
  }
  await page.getByRole("button", { name: "SAVE GAME" }).click();
}

/** Id of the order in `/pedido/<id>/...`. */
export function orderIdOf(page: Page): string {
  const match = /\/pedido\/([^/]+)\//.exec(new URL(page.url()).pathname);
  if (!match?.[1]) throw new Error(`no order id in ${page.url()}`);
  return match[1];
}

/** Test-only: moves the mock order to another status. */
export async function setOrderStatus(page: Page, id: string, status: string) {
  const res = await page.request.post(`/api/__mock__/pedidos/${id}`, { data: { status } });
  expect(res.status()).toBe(204);
}

/** Number of cart lines currently stored by the app. */
export async function storedLines(page: Page): Promise<number> {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { state: { lines: unknown[] } }).state.lines.length : 0;
  }, CART_KEY);
}
