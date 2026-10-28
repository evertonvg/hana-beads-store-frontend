import type { Page } from "@playwright/test";
import { expect, expectA11y, test } from "./support/fixtures";

test.use({ consent: "unset" });

/**
 * Waits until the library has run: the footer button only opens the preferences after that, so
 * retry the click until it does. The library activates (or skips) scripts synchronously in run().
 */
async function consentReady(page: Page) {
  const prefs = page.getByRole("dialog", { name: "PREFERÊNCIAS DE COOKIES" });
  await expect(async () => {
    await page.getByRole("button", { name: "Cookies", exact: true }).click();
    await expect(prefs).toBeVisible({ timeout: 500 });
  }).toPass();
}

const banner = (page: Page) => page.getByRole("dialog", { name: "SAVE DATA? (COOKIES)" });

async function storedCategories(page: Page): Promise<string[]> {
  const cookies = await page.context().cookies();
  const raw = cookies.find((c) => c.name === "pp_consent")?.value;
  if (!raw) return [];
  return (JSON.parse(decodeURIComponent(raw)) as { categories: string[] }).categories;
}

test.describe("cookie consent", () => {
  test("shows the banner on the first visit", async ({ page }) => {
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
  });

  test("gives accept and reject the same size, color and font", async ({ page }) => {
    await page.goto("/");
    const accept = page.getByRole("button", { name: "ACEITAR TODOS" });
    const reject = page.getByRole("button", { name: "REJEITAR OPCIONAIS" });
    await expect(accept).toBeVisible();
    const [a, r] = await Promise.all([accept.boundingBox(), reject.boundingBox()]);
    expect(a?.height).toBe(r?.height);
    const style = (l: typeof accept) =>
      l.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, size: cs.fontSize };
      });
    expect(await style(accept)).toEqual(await style(reject));
  });

  test("rejecting keeps only necessary cookies and hides the banner after reload", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "REJEITAR OPCIONAIS" }).click();
    await expect(banner(page)).toBeHidden();
    expect(await storedCategories(page)).toEqual(["necessary"]);
    await page.reload();
    await consentReady(page);
    await expect(banner(page)).toBeHidden();
  });

  test("the footer Cookies button reopens the preferences with the saved state", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "ACEITAR TODOS" }).click();
    await page.getByRole("button", { name: "Cookies", exact: true }).click();
    const prefs = page.getByRole("dialog", { name: "PREFERÊNCIAS DE COOKIES" });
    await expect(prefs).toBeVisible();
    await expect(prefs.getByRole("checkbox", { name: "Desempenho" })).toBeChecked();
    await expect(prefs.getByRole("checkbox", { name: "Marketing" })).toBeChecked();
  });

  test("loads no analytics request before consent and one after accepting", async ({ page }) => {
    const analytics: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/__analytics-test.js")) analytics.push(req.url());
    });
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    expect(analytics).toHaveLength(0);
    await page.getByRole("button", { name: "ACEITAR TODOS" }).click();
    await expect.poll(() => analytics.length).toBe(1);
  });

  test("does not load analytics after rejecting", async ({ page }) => {
    const analytics: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/__analytics-test.js")) analytics.push(req.url());
    });
    await page.goto("/");
    await page.getByRole("button", { name: "REJEITAR OPCIONAIS" }).click();
    await page.reload();
    await consentReady(page);
    expect(analytics).toHaveLength(0);
  });

  test("has no accessibility violations with the banner open", async ({ page }) => {
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    await expectA11y(page);
  });

  test("has no accessibility violations with the preferences open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "PERSONALIZAR" }).click();
    await expect(page.getByRole("dialog", { name: "PREFERÊNCIAS DE COOKIES" })).toBeVisible();
    await expectA11y(page);
  });
});
