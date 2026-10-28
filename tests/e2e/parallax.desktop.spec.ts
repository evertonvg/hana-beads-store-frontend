import { expect, expectA11y, test } from "./support/fixtures";
import { parallaxOffset } from "../../lib/motion";

const triggerCount = () => window.__ppScrollTriggers?.() ?? -1;

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
  // Every layer is aria-hidden, except the hero text ("titulo") and the closing CTAs ("cta"), which carry real content.
  const exposed = await page
    .locator("[data-layer]")
    .evaluateAll((els) =>
      els
        .filter((el) => !el.closest('[aria-hidden="true"]'))
        .map((el) => el.getAttribute("data-layer")),
    );
  expect(exposed).toEqual(["titulo", "cta", "cta"]);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("1 PLAYER · FEITO À MÃO")).toBeVisible();
  await expectA11y(page);
});

test("movimento reduzido nunca cria ScrollTrigger", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect.poll(() => page.evaluate(triggerCount)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForFunction(() => window.scrollY > 1000);
  expect(await page.evaluate(triggerCount)).toBe(0);
});

test("com movimento permitido há triggers só para camadas visíveis", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect.poll(() => page.evaluate(triggerCount)).toBeGreaterThan(20);
  // FinalCta is mobile-only: its layers (cta + city) must not have triggers on desktop.
  const visible = await page
    .locator("[data-layer]")
    .evaluateAll((els) => els.filter((el) => el.getClientRects().length > 0).length);
  expect(await page.evaluate(triggerCount)).toBe(visible);
});

test("o deslocamento segue parallaxOffset com intensidade 1", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const layer = page.locator(LAYER);
  await expect.poll(() => page.evaluate(triggerCount)).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForFunction(() => window.scrollY === 300);
  const { ty, progress } = await layer.evaluate((el) => {
    const hero = el.closest("section")!.getBoundingClientRect();
    const vh = window.innerHeight;
    return {
      ty: new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      progress: (hero.top + hero.height / 2 - vh / 2) / vh,
    };
  });
  // Allow a few px: scrub smoothing and sub-pixel layout.
  await expect
    .poll(async () => {
      const now = await layer.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      );
      return Math.abs(now - parallaxOffset(progress, 0.7, 1));
    })
    .toBeLessThan(4);
  expect(Math.abs(ty)).toBeGreaterThan(0);
});
