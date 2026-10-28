import AxeBuilder from "@axe-core/playwright";
import { expect, test as base, type Page } from "@playwright/test";

type FixtureUser = "ana" | "bruno";

/** Signs in through the /entrar form with a fixture user. */
async function login(page: Page, user: FixtureUser = "ana") {
  await page.goto("/entrar");
  await page.getByLabel("E-mail").fill(`${user}@teste.dev`);
  await page.getByLabel("Senha").fill("Senha@123");
  await page.getByRole("button", { name: "ENTRAR" }).click();
}

/** Fails the test on any WCAG 2.0/2.1 A/AA violation. */
async function expectA11y(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(violations).toEqual([]);
}

/** Visual snapshot. Only compares inside the Docker container (VISUAL=1); no-op elsewhere. */
async function snap(page: Page, name: string) {
  if (process.env.VISUAL !== "1") return;
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => document.fonts.ready);
  const reject = page.getByRole("button", { name: "REJEITAR OPCIONAIS" });
  if (await reject.isVisible()) await reject.click();
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.01,
  });
}

export const test = base.extend<{ resetMock: void }>({
  resetMock: [
    async ({ page, request }, use) => {
      await request.post("/api/__mock__/reset");
      await page.context().clearCookies();
      await page.addInitScript(() => {
        try {
          window.localStorage.clear();
        } catch {
          /* storage unavailable */
        }
      });
      await use();
    },
    { auto: true },
  ],
});

export { expect, expectA11y, login, snap };
