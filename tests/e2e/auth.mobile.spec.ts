import type { Page } from "@playwright/test";
import { expect, expectA11y, snap, test } from "./support/fixtures";
import { gotoHydrated } from "./support/hydration";

const tab = (page: Page, name: string) => page.getByRole("tab", { name, exact: true });

test("as abas ENTRAR e CRIAR CONTA alternam os formulários com aria-selected", async ({ page }) => {
  await gotoHydrated(page, "/entrar");
  await expect(tab(page, "ENTRAR")).toHaveAttribute("aria-selected", "true");
  await expect(tab(page, "CRIAR CONTA")).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("heading", { name: "PLAYER LOGIN" })).toBeVisible();

  await tab(page, "CRIAR CONTA").click();
  await expect(tab(page, "CRIAR CONTA")).toHaveAttribute("aria-selected", "true");
  await expect(tab(page, "ENTRAR")).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("heading", { name: "NEW PLAYER" })).toBeVisible();
  await expect(page.getByLabel("Nome completo")).toBeVisible();

  await tab(page, "ENTRAR").click();
  await expect(page.getByRole("heading", { name: "PLAYER LOGIN" })).toBeVisible();
  await expect(page.getByLabel("Nome completo")).toHaveCount(0);
});

test("as abas se movem com as setas do teclado", async ({ page }) => {
  await gotoHydrated(page, "/entrar");
  await tab(page, "ENTRAR").focus();
  await page.keyboard.press("ArrowRight");
  await expect(tab(page, "CRIAR CONTA")).toHaveAttribute("aria-selected", "true");
});

test("/entrar?aba=criar abre na aba criar conta", async ({ page }) => {
  await gotoHydrated(page, "/entrar?aba=criar");
  await expect(tab(page, "CRIAR CONTA")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Nome completo")).toBeVisible();
});

test("/cadastro no celular mostra as abas com criar conta selecionada", async ({ page }) => {
  await gotoHydrated(page, "/cadastro");
  await expect(tab(page, "CRIAR CONTA")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "NEW PLAYER" })).toBeVisible();
  await tab(page, "ENTRAR").click();
  await expect(page.getByRole("heading", { name: "PLAYER LOGIN" })).toBeVisible();
});

test("campos de texto têm pelo menos 16px (sem zoom do iOS)", async ({ page }) => {
  await gotoHydrated(page, "/entrar?aba=criar");
  const sizes = await page
    .locator("main input:not([type=hidden])")
    .evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).fontSize)));
  expect(sizes.length).toBeGreaterThan(3);
  for (const size of sizes) expect(size).toBeGreaterThanOrEqual(16);
});

test("abas: acessibilidade e visual de cada aba", async ({ page }) => {
  await gotoHydrated(page, "/entrar");
  await expectA11y(page);
  await tab(page, "CRIAR CONTA").click();
  await expect(page.getByLabel("Nome completo")).toBeVisible();
  await expectA11y(page);
  await snap(page, "cadastro-aba");
});
