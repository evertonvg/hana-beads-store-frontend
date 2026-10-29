import type { Page } from "@playwright/test";

/**
 * Opens a statically prerendered page and waits until React has attached to its buttons, so a
 * click is never swallowed by the not-yet-hydrated HTML.
 */
export async function gotoHydrated(page: Page, url: string) {
  await page.goto(url);
  await page.waitForFunction(() => {
    const button = document.querySelector("main button");
    return button !== null && Object.keys(button).some((k) => k.startsWith("__reactProps"));
  });
}
