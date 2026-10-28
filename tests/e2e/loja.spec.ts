import { expect, expectA11y, snap, test } from "./support/fixtures";
import type { Page } from "@playwright/test";

const cards = (page: Page) => page.getByRole("main").getByRole("article");
const count = (page: Page) => page.getByRole("main").getByText(/^\d+ itens?/);

test("lista os 9 itens com contador e um unico h1", async ({ page }) => {
  await page.goto("/loja");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SELECIONE SEU ITEM");
  await expect(cards(page)).toHaveCount(9);
  await expect(count(page)).toContainText(/9 itens/i);
});

test("card mostra selos, preco placeholder e link para o produto", async ({ page }) => {
  await page.goto("/loja");
  const garota = cards(page).filter({ hasText: "GAROTA PIXEL" });
  await expect(garota.getByText("★★★ ÉPICO")).toBeVisible();
  await expect(garota.getByText("[PREÇO]")).toBeVisible();
  await expect(garota.locator('a[href="/produto/garota-pixel"]').first()).toBeVisible();
  await expect(
    cards(page).filter({ hasText: "ESTRELA INICIAL" }).getByText("★★ RARO"),
  ).toBeVisible();
  await expect(cards(page).filter({ hasText: "SORVETE PIXEL" }).getByText("NOVO")).toBeVisible();
  const planeta = cards(page).filter({ hasText: "PLANETA PIXEL" });
  await expect(planeta.getByText("ESGOTADO")).toBeVisible();
  await expect(planeta).toHaveClass(/opacity-75/);
  await expect(planeta.getByRole("link", { name: "VER ITEM" })).toHaveCount(0);
});

test("categoria vai para a URL, e recarregar mantem o filtro", async ({ page }) => {
  await page.goto("/loja");
  await page.getByRole("button", { name: "ESTRELAS", exact: true }).click();
  await expect(page).toHaveURL(/\/loja\?categoria=estrelas$/);
  await expect(cards(page)).toHaveCount(2);
  await page.reload();
  await expect(cards(page)).toHaveCount(2);
  await expect(page.getByRole("button", { name: "ESTRELAS", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("busca espera o debounce e grava ?q=", async ({ page }) => {
  await page.goto("/loja");
  await page.getByLabel("Buscar na loja").fill("gat");
  await expect(page).toHaveURL(/\/loja\?q=gat$/);
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("GATINHO PIXEL");
});

test("sem resultados mostra o estado vazio e LIMPAR FILTROS volta a 9", async ({ page }) => {
  await page.goto("/loja?categoria=bichinhos&cor=rosa");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByText("NENHUM ITEM ENCONTRADO")).toBeVisible();
  await expect(count(page)).toContainText(/0 itens/i);
  await expect(page.getByRole("link", { name: /^ENCOMENDAR PELO/ })).toBeVisible();
  await expectA11y(page);
  await snap(page, "loja-vazia");
  await page.getByRole("link", { name: "LIMPAR FILTROS" }).click();
  await expect(page).toHaveURL(/\/loja$/);
  await expect(cards(page)).toHaveCount(9);
});

test("parametros invalidos respondem 200 com o catalogo inteiro", async ({ page }) => {
  const response = await page.goto("/loja?pagina=-3&ordem=xpto&cor=azul");
  expect(response?.status()).toBe(200);
  await expect(cards(page)).toHaveCount(9);
});

test("favoritar deslogado leva ao login com next", async ({ page }) => {
  await page.goto("/loja");
  await page.getByRole("button", { name: "Favoritar GAROTA PIXEL" }).click();
  await expect(page).toHaveURL(/\/entrar\?next=%2Floja$/);
});

test("favoritar preserva a URL atual no next", async ({ page }) => {
  await page.goto("/loja?categoria=estrelas");
  await page.getByRole("button", { name: "Favoritar ESTRELA Nº" }).click();
  await expect(page).toHaveURL(/\/entrar\?next=%2Floja%3Fcategoria%3Destrelas$/);
});

test.describe("AVISE-ME deslogado", () => {
  const planeta = (page: Page) => cards(page).filter({ hasText: "PLANETA PIXEL" });

  test("exige consentimento desmarcado antes de enviar e confirma", async ({ page }) => {
    await page.goto("/loja");
    const card = planeta(page);
    await card.getByRole("button", { name: "AVISE-ME" }).click();
    await card.getByLabel("Seu e-mail").fill("aviso@teste.dev");
    const consent = card.getByRole("checkbox");
    await expect(consent).toHaveAttribute("aria-checked", "false");
    await card.getByRole("button", { name: "CONFIRMAR" }).click();
    await expect(card.getByText("Marque a caixa para continuar.")).toBeVisible();
    await consent.click();
    await card.getByRole("button", { name: "CONFIRMAR" }).click();
    await expect(card.getByRole("button", { name: "AVISAREMOS ✓" })).toBeVisible();
    await expect(card.getByText(/Vamos te avisar por e-mail/)).toBeVisible();
  });

  test("e-mail invalido mostra erro no campo", async ({ page }) => {
    await page.goto("/loja");
    const card = planeta(page);
    await card.getByRole("button", { name: "AVISE-ME" }).click();
    await card.getByLabel("Seu e-mail").fill("nao-e-email");
    await card.getByRole("checkbox").click();
    await card.getByRole("button", { name: "CONFIRMAR" }).click();
    await expect(card.getByLabel("Seu e-mail")).toHaveAttribute("aria-invalid", "true");
    await expect(card.getByText("Informe um e-mail válido.")).toBeVisible();
  });
});

test("loja passa na checagem de acessibilidade", async ({ page }) => {
  await page.goto("/loja");
  await expect(cards(page)).toHaveCount(9);
  await expectA11y(page);
  await snap(page, "loja");
});
