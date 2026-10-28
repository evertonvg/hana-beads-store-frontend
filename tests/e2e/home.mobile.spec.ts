import { expect, test } from "./support/fixtures";

test("chamar pelo canal configurado (celular)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "CHAMAR NO DIRECT" })).toHaveAttribute(
    "href",
    "https://ig.me/m/pixelperfect.teste",
  );
});

test("carrossel rola na horizontal e todos os cards são alcançáveis pelo teclado", async ({
  page,
}) => {
  await page.goto("/");
  const lista = page.locator("#loja ul");
  await expect.poll(() => lista.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  const cards = page.locator("#loja").getByRole("article");
  await page.getByRole("link", { name: "VER TODOS ›" }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(cards.nth(2).getByRole("link")).toBeFocused();
  await expect(cards.nth(2)).toBeInViewport();
});
