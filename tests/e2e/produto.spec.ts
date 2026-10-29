import type { Page } from "@playwright/test";
import { expect, expectA11y, snap, test } from "./support/fixtures";

const PRODUCT = "/produto/garota-pixel";

function cartLink(page: Page, isMobile: boolean, n: number) {
  const name = isMobile ? `Carrinho, ${n} ${n === 1 ? "item" : "itens"}` : `CARRINHO [${n}]`;
  return page.getByRole("link", { name });
}

const addButton = (page: Page) => page.getByRole("button", { name: "+ PEGAR ITEM" });

async function pickEstrelaTimes2(page: Page) {
  await page.getByRole("radio", { name: "ESTRELA" }).click();
  await page.getByRole("button", { name: "Aumentar quantidade" }).click();
  await expect(page.getByRole("spinbutton", { name: /quantidade/i })).toHaveValue("2");
}

test("mostra nome, raridade e preço placeholder", async ({ page }) => {
  await page.goto(PRODUCT);
  await expect(page.getByRole("heading", { level: 1, name: "GAROTA PIXEL" })).toBeVisible();
  await expect(page.getByText("★★★ ÉPICO").first()).toBeVisible();
  await expect(page.getByRole("main").getByText("[PREÇO]").first()).toBeVisible();
  await expect(page).toHaveTitle("GAROTA PIXEL — Pixel Perfect");
  await expect(page.getByRole("heading", { name: /VOCÊ TAMBÉM PODE/ })).toBeVisible();
  await expect(page.getByText("TAMANHO", { exact: true })).toBeVisible();
  await expect(page.getByText("[X] cm")).toBeVisible();
  await expect(page.getByText("[000]")).toBeVisible();
  await expect(page.getByText("MAX", { exact: true })).toBeVisible();
  await snap(page, "produto");
});

test("passa na acessibilidade", async ({ page }) => {
  await page.goto(PRODUCT);
  await expectA11y(page);
});

test("ESTRELA x2 abre ITEM COLETADO! com argola e quantidade, e atualiza o carrinho", async ({
  page,
  isMobile,
}) => {
  await page.goto(PRODUCT);
  await expect(cartLink(page, isMobile, 0)).toBeVisible();
  await pickEstrelaTimes2(page);
  await addButton(page).click();

  const dialog = page.getByRole("dialog", { name: "ITEM COLETADO!" });
  await expect(dialog).toBeAttached();
  await expect(dialog.getByRole("heading", { name: "ITEM COLETADO!" })).toBeVisible();
  await expect(dialog).toContainText("Argola: estrela");
  await expect(dialog).toContainText("×2");
  await expect(dialog.getByText("[Faltam R$ X para frete grátis]")).toBeVisible();
  await expect(dialog.getByRole("link", { name: /FINALIZAR COMPRA/ })).toHaveAttribute(
    "href",
    "/checkout",
  );
  await expectA11y(page);
  await snap(page, "produto-gaveta");

  await dialog.getByRole("button", { name: /CONTINUAR JOGANDO/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(cartLink(page, isMobile, 2)).toBeVisible();
});

test("duplo clique rápido adiciona a quantidade uma única vez", async ({ page, isMobile }) => {
  await page.goto(PRODUCT);
  await pickEstrelaTimes2(page);
  await addButton(page).dblclick();

  const dialog = page.getByRole("dialog", { name: "ITEM COLETADO!" });
  await expect(dialog).toBeAttached();
  await expect(dialog.getByRole("heading", { name: "ITEM COLETADO!" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(cartLink(page, isMobile, 2)).toBeVisible();
  await expect(cartLink(page, isMobile, 4)).toHaveCount(0);
});

test("Escape fecha a gaveta e devolve o foco ao botão", async ({ page }) => {
  await page.goto(PRODUCT);
  await addButton(page).click();
  const dialog = page.getByRole("dialog", { name: "ITEM COLETADO!" });
  await expect(dialog).toBeAttached();
  await expect(dialog.getByRole("heading", { name: "ITEM COLETADO!" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(addButton(page)).toBeFocused();
});

test("VER CARRINHO leva a /carrinho", async ({ page }) => {
  await page.goto(PRODUCT);
  await addButton(page).click();
  await page
    .getByRole("dialog", { name: "ITEM COLETADO!" })
    .getByRole("link", { name: "VER CARRINHO" })
    .click();
  await expect(page).toHaveURL(/\/carrinho$/);
});

test("slug inexistente mostra a página 404", async ({ page }) => {
  await page.goto("/produto/nao-existe");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("FASE NÃO ENCONTRADA");
});

test("produto esgotado mostra ESGOTADO e AVISE-ME no lugar de + PEGAR ITEM", async ({ page }) => {
  await page.goto("/produto/planeta-pixel");
  await expect(page.getByRole("heading", { level: 1, name: "PLANETA PIXEL" })).toBeVisible();
  await expect(page.getByText("ESGOTADO", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "AVISE-ME" })).toBeVisible();
  await expect(addButton(page)).toHaveCount(0);
  await expectA11y(page);
});

test("acordeão CUIDADOS alterna aria-expanded", async ({ page }) => {
  await page.goto(PRODUCT);
  const trigger = page.getByRole("button", { name: "CUIDADOS" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "ENVIO E TROCAS" }).click();
  await expect(page.getByRole("link", { name: "Ver política de trocas" })).toHaveAttribute(
    "href",
    "/trocas",
  );
});
