import { expect, test } from "./support/fixtures";
import { placeOrder } from "./support/order";
import { expectTouchTargets } from "./support/touch-targets";

test.describe("celular", () => {
  test("Pix: botão grande de copiar, QR code numa gaveta e alvos de toque grandes", async ({
    page,
  }) => {
    await placeOrder(page, "pix");
    await expect(page.getByRole("heading", { level: 1, name: /PAGUE COM PIX/ })).toBeVisible();
    const copy = page.getByRole("button", { name: "COPIAR CÓDIGO PIX" });
    await expect(copy).toBeVisible();
    expect((await copy.boundingBox())?.height).toBeGreaterThanOrEqual(60);
    await page.getByText("PAGAR EM OUTRO APARELHO? VER QR CODE").click();
    await expect(page.getByRole("img", { name: "QR code do Pix" })).toBeVisible();
    await expectTouchTargets(page.getByRole("main"));
    const sizes = await page
      .locator("main input:not([type=hidden])")
      .evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).fontSize)));
    for (const size of sizes) expect(size).toBeGreaterThanOrEqual(16);
  });

  test("Boleto tem alvos de toque grandes", async ({ page }) => {
    await placeOrder(page, "boleto");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("PAUSADO");
    await expectTouchTargets(page.getByRole("main"));
  });

  test("Recusado tem alvos de toque grandes", async ({ page }) => {
    await placeOrder(page, "cartao", "4000 0000 0000 0002");
    await expect(page.getByRole("heading", { level: 1, name: "CONTINUE?" })).toBeVisible();
    await expectTouchTargets(page.getByRole("main"));
  });

  test("Confirmação tem alvos de toque grandes", async ({ page }) => {
    await placeOrder(page, "cartao");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("CLEAR!");
    await expectTouchTargets(page.getByRole("main"));
  });
});
