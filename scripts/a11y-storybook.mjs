// Runs axe (wcag2a, wcag2aa, wcag21aa) over every story of the built Storybook at 1280 and 390.
// Usage: npm run test:a11y-stories   (builds storybook-static first). Exits 1 on any violation.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const ROOT = resolve("storybook-static");
const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 390, height: 844 },
];
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  const file = join(ROOT, path === sep || path === "/" ? "index.html" : path);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  readFile(file)
    .then((body) => {
      res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    })
    .catch(() => res.writeHead(404).end());
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(await readFile(join(ROOT, "index.json"), "utf8"));
const ids = Object.values(index.entries)
  .filter((e) => e.type === "story")
  .map((e) => e.id);

const browser = await chromium.launch();
let failed = 0;
for (const viewport of VIEWPORTS) {
  const page = await (await browser.newContext({ viewport })).newPage();
  for (const id of ids) {
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
    await page.locator("#storybook-root > *").first().waitFor({ state: "attached" });
    await page.waitForTimeout(500);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .include("body")
      .analyze();
    const status = violations.length ? "FAIL" : "ok";
    console.log(`${status.padEnd(4)} ${String(viewport.width).padStart(4)} ${id}`);
    for (const v of violations) {
      failed++;
      console.log(`       ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
    }
  }
}
await browser.close();
server.close();
console.log(`\n${ids.length} stories x ${VIEWPORTS.length} viewports, ${failed} violation(s)`);
process.exit(failed ? 1 : 0);
