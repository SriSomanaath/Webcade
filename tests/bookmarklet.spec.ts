import { test, expect, Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const repoRoot = process.cwd();

let bundleSrc: string;
let hrefMap: Record<string, string>;

test.beforeAll(async () => {
  bundleSrc = await readFile(join(repoRoot, "public/bookmarklet.js"), "utf8");
  const json = await readFile(
    join(repoRoot, "public/bookmarklet-href.json"),
    "utf8"
  );
  hrefMap = JSON.parse(json);
});

function fixturePath(name: string, qs = "") {
  return `file://${join(repoRoot, "tests/fixtures", name)}${qs}`;
}

async function startBookmarklet(page: Page, slug = "brickout") {
  await page.evaluate((s) => {
    (window as unknown as { __webcade_game?: string }).__webcade_game = s;
  }, slug);
  await page.addScriptTag({ content: bundleSrc });
}

test("smoke: bookmarklet starts and Esc cleans up", async ({ page }) => {
  await page.goto(fixturePath("normal.html"));
  await startBookmarklet(page);
  const host = page.locator("#__webcade_host__");
  await expect(host).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(host).toHaveCount(0);
});

test("trusted types: bundle does not use innerHTML, document.write, or insertAdjacentHTML", () => {
  expect(bundleSrc.includes(".innerHTML")).toBe(false);
  expect(bundleSrc.includes("insertAdjacentHTML")).toBe(false);
  expect(bundleSrc.includes("document.write")).toBe(false);
});

test("inlined bookmarklet href: format and length", () => {
  const slugs = Object.keys(hrefMap);
  expect(slugs.length).toBeGreaterThanOrEqual(5);
  for (const slug of slugs) {
    const href = hrefMap[slug];
    expect(href.startsWith("javascript:")).toBe(true);
    // Firefox bookmarks cap at 65,536 chars; build script asserts < 60,000.
    expect(href.length).toBeLessThan(60000);
    const decoded = decodeURIComponent(href.slice("javascript:".length));
    expect(decoded.includes(`window.__webcade_game=${JSON.stringify(slug)}`)).toBe(
      true
    );
  }
});

test("mutation observer: rect count drops after content removal", async ({
  page,
}) => {
  await page.goto(fixturePath("virtualized.html", "?debug=1"));
  await startBookmarklet(page);
  await page.waitForFunction(
    () => {
      const dbg = (window as unknown as { __webcade_debug?: { rectCount: number } })
        .__webcade_debug;
      return Boolean(dbg && dbg.rectCount > 20);
    },
    null,
    { timeout: 4000 }
  );
  const initialCount = await page.evaluate(() => {
    const dbg = (window as unknown as { __webcade_debug: { rectCount: number } })
      .__webcade_debug;
    return dbg.rectCount;
  });
  expect(initialCount).toBeGreaterThan(20);

  // Remove most paragraphs to trigger MutationObserver-driven rebuild.
  await page.evaluate(() => {
    const paras = Array.from(document.querySelectorAll("p"));
    paras.forEach((p, i) => {
      if (i > 4) p.remove();
    });
  });

  // MO coalescing: density-based, fires ~1500ms after threshold crossed.
  await page.waitForFunction(
    (initial) => {
      const dbg = (window as unknown as {
        __webcade_debug?: { rectCount: number; rebuildCount: number };
      }).__webcade_debug;
      return Boolean(
        dbg && dbg.rebuildCount > 0 && dbg.rectCount < initial
      );
    },
    initialCount,
    { timeout: 6000 }
  );
});

test("synthetic: arcade mode triggers on empty page", async ({ page }) => {
  await page.goto(fixturePath("empty.html", "?debug=1"));
  await startBookmarklet(page);
  await page.waitForFunction(
    () => {
      const dbg = (window as unknown as {
        __webcade_debug?: { synthetic: boolean; rectCount: number };
      }).__webcade_debug;
      return Boolean(dbg && dbg.synthetic && dbg.rectCount > 0);
    },
    null,
    { timeout: 3000 }
  );
});
