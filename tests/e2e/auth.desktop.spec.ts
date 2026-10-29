import { expect, test } from "./support/fixtures";
import { gotoHydrated } from "./support/hydration";

test("ENTRAR do cabeçalho tira a tela do modo recuperar sem recarregar", async ({ page }) => {
  await gotoHydrated(page, "/entrar?modo=recuperar");
  await expect(page.getByRole("heading", { name: "ESQUECEU A SENHA?" })).toBeVisible();
  await page.getByRole("banner").getByRole("link", { name: "ENTRAR", exact: true }).click();
  await expect(page).toHaveURL(/\/entrar$/);
  await expect(page.getByRole("heading", { name: "PLAYER LOGIN" })).toBeVisible();
});
