import { expect, test } from "./support/fixtures";

test("encomendar pelo canal configurado (desktop)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "ENCOMENDAR PELO DIRECT" })).toHaveAttribute(
    "href",
    "https://ig.me/m/pixelperfect.teste",
  );
});

test("vitrine em grade de 3 colunas", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("#loja").getByRole("article");
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(3);
  const tops = await cards.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
  expect(new Set(tops).size).toBe(1);
});
