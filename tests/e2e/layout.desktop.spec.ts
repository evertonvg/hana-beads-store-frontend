import { expect, expectA11y, test } from "./support/fixtures";

test.describe("shell desktop", () => {
  test("nav Principal tem os links do menu e o carrinho", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal" });
    await expect(nav.getByRole("link", { name: "LOJA" })).toHaveAttribute("href", "/loja");
    await expect(nav.getByRole("link", { name: "ENCOMENDAS" })).toHaveAttribute(
      "href",
      "/encomendas",
    );
    await expect(nav.getByRole("link", { name: "SOBRE" })).toHaveAttribute("href", "/#sobre");
    await expect(nav.getByRole("link", { name: "ENTRAR" })).toHaveAttribute("href", "/entrar");
    await expect(page.getByRole("link", { name: /^CARRINHO \[0\]/ })).toHaveAttribute(
      "href",
      "/carrinho",
    );
  });

  test("skip-link e o primeiro foco e leva ao conteudo", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#conteudo$/);
  });

  test("rodape tem links legais, canal de contato e botao Cookies", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Privacidade" })).toHaveAttribute(
      "href",
      "/privacidade",
    );
    await expect(footer.getByRole("link", { name: "Termos" })).toHaveAttribute("href", "/termos");
    await expect(footer.getByRole("link", { name: "Trocas e devoluções" })).toHaveAttribute(
      "href",
      "/trocas",
    );
    await expect(footer.getByRole("button", { name: "Cookies" })).toBeDisabled();
    await expect(footer.getByText("[razão social]", { exact: false })).toBeVisible();
  });

  test("tab bar e menu celular ficam escondidos", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Atalhos" })).toBeHidden();
  });

  test("a11y da home com o shell", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
    await expectA11y(page);
  });
});
