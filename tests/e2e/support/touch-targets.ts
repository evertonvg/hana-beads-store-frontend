import { expect, type Locator } from "@playwright/test";

const MIN = 44;

/**
 * Asserts every visible link/button under `scope` (a `role=switch` is measured by its row) is at least 44px tall, and 44px wide when it is
 * icon-only (no text of its own). The skip-link is excluded: it is only shown on focus.
 */
export async function expectTouchTargets(scope: Locator) {
  const targets = scope.locator('a:not([href="#conteudo"]), button');
  const total = await targets.count();
  let checked = 0;
  for (let i = 0; i < total; i++) {
    const el = targets.nth(i);
    if (!(await el.isVisible())) continue;
    // The 64x36 Switch is a design-spec size: its hit area is the whole Field row (label included).
    const isSwitch = (await el.getAttribute("role")) === "switch";
    const box = await (isSwitch ? el.locator("xpath=..") : el).boundingBox();
    const label = (await el.getAttribute("aria-label")) ?? (await el.innerText());
    const iconOnly = (await el.innerText()).trim() === "";
    expect(box?.height, `altura de "${label}"`).toBeGreaterThanOrEqual(MIN);
    if (iconOnly) expect(box?.width, `largura de "${label}"`).toBeGreaterThanOrEqual(MIN);
    checked++;
  }
  expect(checked).toBeGreaterThan(0);
}
