import { expect, expectA11y, snap, test } from "./support/fixtures";

test.describe("404", () => {
  test("rota inexistente responde 404 com a tela FASE NAO ENCONTRADA", async ({ page }) => {
    const response = await page.goto("/rota-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("FASE NÃO ENCONTRADA");
    await expectA11y(page);
    await snap(page, "404");
  });

  test("SIM leva a home e NAO a loja", async ({ page }) => {
    await page.goto("/rota-que-nao-existe");
    await expect(page.getByRole("link", { name: /^▶?\s*SIM/ })).toHaveAttribute("href", "/");
    await expect(page.getByRole("link", { name: /^NÃO/ })).toHaveAttribute("href", "/loja");
    await page.getByRole("link", { name: /SIM/ }).click();
    await expect(page).toHaveURL("/");
  });

  test("busca leva a /loja?q=", async ({ page }) => {
    await page.goto("/rota-que-nao-existe");
    await page.getByRole("searchbox", { name: /procure o que você queria/i }).fill("estrela");
    await page.getByRole("button", { name: "BUSCAR" }).click();
    await expect(page).toHaveURL("/loja?q=estrela");
  });
});
