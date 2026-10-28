import { expect, expectA11y, test } from "./support/fixtures";

const LAYER = '[data-layer="montanha-frente"]';

test("rolar muda o transform das camadas (movimento permitido)", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const layer = page.locator(LAYER);
  await expect(layer).toHaveCount(1);
  const before = await layer.evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect.poll(() => layer.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
  expect(errors).toEqual([]);
});

test("com movimento reduzido as camadas ficam sem transform", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const layers = page.locator("[data-layer]");
  expect(await layers.count()).toBeGreaterThan(10);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.scrollTo(0, 600);
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  const transforms = await layers.evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).transform),
  );
  expect(new Set(transforms)).toEqual(new Set(["none"]));
});

test("camadas são decorativas e o hero continua acessível", async ({ page }) => {
  await page.goto("/");
  // Every layer is aria-hidden, except the hero text block ("titulo"), which carries real content.
  const exposed = await page
    .locator("[data-layer]")
    .evaluateAll((els) =>
      els
        .filter((el) => !el.closest('[aria-hidden="true"]'))
        .map((el) => el.getAttribute("data-layer")),
    );
  expect(exposed).toEqual(["titulo"]);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("1 PLAYER · FEITO À MÃO")).toBeVisible();
  await expectA11y(page);
});
