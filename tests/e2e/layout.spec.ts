import { expect, test } from "./support/fixtures";
import { expectTouchTargets } from "./support/touch-targets";

test("alvos de toque do shell tem pelo menos 44px", async ({ page }) => {
  await page.goto("/");
  await expectTouchTargets(page.locator("header, footer, nav[aria-label]"));
});

test("alvos de toque do shell na 404", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await expectTouchTargets(page.locator("header, footer, nav[aria-label], main"));
});

test("rodape aparece em todas as telas", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("contentinfo")).toBeVisible();
});
