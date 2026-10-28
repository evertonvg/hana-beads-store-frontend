import { expect, expectA11y, test } from "./support/fixtures";

test.describe("shell celular", () => {
  test("botao Abrir menu abre o dialog e Escape fecha", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Abrir menu" });
    await open.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeAttached();
    await expect(dialog.getByRole("heading", { name: "Menu" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: /^LOJA/ })).toHaveAttribute("href", "/loja");
    await expectA11y(page);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(open).toBeFocused();
  });

  test("tab bar tem 4 links e marca Inicio na home", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("navigation", { name: "Atalhos" });
    await expect(tabs.getByRole("link")).toHaveCount(4);
    await expect(tabs.getByRole("link", { name: "INÍCIO" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(tabs.getByRole("link", { name: "LOJA" })).not.toHaveAttribute("aria-current");
  });

  test("sem overflow horizontal", async ({ page }) => {
    await page.goto("/");
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(390);
  });

  test("a11y da home com o shell", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
    await expectA11y(page);
  });
});
