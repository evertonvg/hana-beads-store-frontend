import { expect, snap, test } from "./support/fixtures";

// Press Start 2P draws accented capitals badly; Silkscreen covers just those code points
// (app/fonts.ts). This sheet makes any regression visible in the visual diff.
test("fonte pixel mostra todas as letras acentuadas do português", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  await page.evaluate(() => {
    const sheet = document.createElement("div");
    sheet.id = "folha-acentos";
    sheet.className = "font-pixel min-h-screen bg-bg p-4 text-white";
    sheet.innerHTML = [10, 16, 24]
      .map(
        (px) =>
          `<p style="font-size:${px}px;line-height:1.8;margin:0 0 16px">` +
          "ÁÀÂÃÉÊÍÓÔÕÚÜÇ<br>áàâãéêíóôõúüç<br>INVENTÁRIO MINI ÍCONES<br>INICIAIS E NÚMEROS ÉPICO</p>",
      )
      .join("");
    document.body.replaceChildren(sheet);
  });
  const family = await page
    .locator("#folha-acentos")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  // The accents face (next/font/local, named after its export) comes first, then Press Start 2P.
  const [first, second] = family.split(",").map((name) => name.trim());
  expect(first).toContain("pixelAccents");
  expect(second).toMatch(/Press Start 2P/);
  await snap(page, "fonte-acentos");
});
