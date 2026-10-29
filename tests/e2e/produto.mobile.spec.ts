import { expect, expectA11y, test } from "./support/fixtures";
import { expectTouchTargets } from "./support/touch-targets";

const PRODUCT = "/produto/garota-pixel";

test("barra de compra fixa fica visível no fim da rolagem sem cobrir o conteúdo", async ({
  page,
}) => {
  await page.goto(PRODUCT);
  const bar = page.getByRole("group", { name: "Compra rápida" });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("button", { name: "+ PEGAR ITEM" })).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(bar).toBeInViewport({ ratio: 1 });
  const barBox = await bar.boundingBox();
  const lastCard = page
    .getByRole("main")
    .getByRole("link", { name: /ENCOMENDAR/ })
    .last();
  const lastBox = await lastCard.boundingBox();
  expect(barBox).not.toBeNull();
  expect(lastBox).not.toBeNull();
  expect(lastBox!.y + lastBox!.height).toBeLessThanOrEqual(barBox!.y + 1);
});

test("a folha ITEM COLETADO! sobe do rodapé", async ({ page }) => {
  await page.goto(PRODUCT);
  await page.getByRole("button", { name: "+ PEGAR ITEM" }).click();
  const sheet = page.getByRole("dialog", { name: "ITEM COLETADO!" });
  await expect(sheet).toBeAttached();
  await expect(sheet.getByRole("heading", { name: "ITEM COLETADO!" })).toBeVisible();
  const box = await sheet.boundingBox();
  expect(box!.y + box!.height).toBeGreaterThanOrEqual(843);
  await expect(sheet.getByRole("button", { name: /CONTINUAR JOGANDO/ })).toBeVisible();
  await expectTouchTargets(sheet);
  await expectA11y(page);
});

test("alvos de toque e sem overflow horizontal", async ({ page }) => {
  await page.goto(PRODUCT);
  await expectTouchTargets(page.getByRole("main"));
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});
