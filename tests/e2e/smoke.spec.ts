import { expect, test } from "./support/fixtures";

test("home responde e aplica tokens", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(20, 18, 31)");

  const h1Font = await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily);
  expect(h1Font).toContain("Press Start 2P");
});
