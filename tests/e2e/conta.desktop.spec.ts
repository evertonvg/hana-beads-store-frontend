import { expect, login, test } from "./support/fixtures";
import { gotoHydrated } from "./support/hydration";

test("as abas aparecem no computador com aria-current na atual", async ({ page }) => {
  await login(page, "ana");
  await expect(page).toHaveURL(/\/conta$/);
  await gotoHydrated(page, "/conta?aba=dados");
  const nav = page.getByRole("navigation", { name: "Minha conta" });
  await expect(nav.getByRole("link", { name: "MEUS DADOS" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "ENDEREÇOS" }).click();
  await expect(page).toHaveURL(/\/conta\?aba=enderecos$/);
  await expect(nav.getByRole("link", { name: "ENDEREÇOS" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(nav.getByRole("link", { name: "MEUS DADOS" })).not.toHaveAttribute(
    "aria-current",
    "page",
  );
});
