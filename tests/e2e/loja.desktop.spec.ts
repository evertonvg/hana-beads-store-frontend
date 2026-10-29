import { expect, test } from "./support/fixtures";
import { expectTouchTargets } from "./support/touch-targets";
import type { Page } from "@playwright/test";

const cards = (page: Page) => page.getByRole("main").getByRole("article");

test("cores Rosa e Roxo gravam cor=rosa,roxo", async ({ page }) => {
  await page.goto("/loja");
  const filtros = page.getByRole("complementary", { name: "Filtros" });
  await filtros.getByRole("button", { name: "Rosa" }).click();
  await filtros.getByRole("button", { name: "Roxo" }).click();
  await expect(page).toHaveURL(/cor=rosa(,|%2C)roxo/);
  await expect(filtros.getByRole("button", { name: "Rosa" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  // rosa: garota, estrela inicial, sorvete, coracao; roxo: planeta
  await expect(cards(page)).toHaveCount(5);
});

test("Só disponíveis remove o item esgotado", async ({ page }) => {
  await page.goto("/loja");
  await expect(cards(page).filter({ hasText: "PLANETA PIXEL" })).toHaveCount(1);
  await page.getByRole("switch", { name: "Só disponíveis" }).click();
  await expect(page).toHaveURL(/disponivel=true/);
  await expect(cards(page)).toHaveCount(8);
  await expect(cards(page).filter({ hasText: "PLANETA PIXEL" })).toHaveCount(0);
});

test("ordenar por novidades poe os novos primeiro", async ({ page }) => {
  await page.goto("/loja");
  await page.getByLabel("Ordenar", { exact: true }).selectOption("novo");
  await expect(page).toHaveURL(/ordem=novo/);
  await expect(cards(page).first()).toContainText("SORVETE PIXEL");
});

test("alvos de toque da loja tem pelo menos 44px", async ({ page }) => {
  await page.goto("/loja");
  await expect(cards(page)).toHaveCount(9);
  await expectTouchTargets(page.getByRole("navigation", { name: "Você está em" }));
  await expectTouchTargets(page.getByRole("group", { name: "Categorias" }));
  await expectTouchTargets(page.getByRole("region", { name: "Itens" }));
  await expectTouchTargets(page.getByRole("complementary", { name: "Filtros" }));
});
