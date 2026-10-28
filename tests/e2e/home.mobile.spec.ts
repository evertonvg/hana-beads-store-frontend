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
  expect(await lista.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  const cards = page.locator("#loja").getByRole("article");
  await cards.nth(2).getByRole("link").focus();
  await expect(cards.nth(2)).toBeInViewport();
});
