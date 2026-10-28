import type { Page } from "@playwright/test";
import { expect, test } from "./support/fixtures";

test.use({ consent: "unset" });

const banner = (page: Page) => page.getByRole("dialog", { name: "SAVE DATA? (COOKIES)" });

test.describe("cookie consent on mobile", () => {
  test("the banner does not cover the TabBar and the page still scrolls", async ({ page }) => {
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    const tabBar = page.getByRole("navigation", { name: "Atalhos" });
    await expect(tabBar).toBeVisible();
    // The banner slides in, so poll until it settles above the TabBar.
    await expect
      .poll(async () => {
        const [b, t] = await Promise.all([banner(page).boundingBox(), tabBar.boundingBox()]);
        return b !== null && t !== null && b.y + b.height <= t.y;
      })
      .toBe(true);
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });
});
