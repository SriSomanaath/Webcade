#!/usr/bin/env node
// Reads public/bookmarklet.js (the minified IIFE) and produces
// public/bookmarklet-href.json — a per-slug map of inlined `javascript:` bookmark URLs.
// Inlining the IIFE bypasses page CSP `script-src` restrictions that would block
// the previous `<script src="/bookmarklet.js">` loader.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SLUGS = [
  "brickout",
  "snake",
  "whack-the-page",
  "page-raiders",
  "page-taxi",
];

// Firefox stores bookmarks in a SQLite Places DB with a 65,536-char cap on URL.
// Leave headroom for trailing browser/profile artifacts and future runtime growth.
const MAX_URL_LEN = 60000;

const bundle = (
  await readFile(join(root, "public/bookmarklet.js"), "utf8")
).trim();

const result = {};
const stats = {};
for (const slug of SLUGS) {
  const slugLiteral = JSON.stringify(slug);
  const source = `window.__webcade_game=${slugLiteral};${bundle};void 0`;
  const href = "javascript:" + encodeURIComponent(source);
  if (href.length > MAX_URL_LEN) {
    throw new Error(
      `bookmarklet href for "${slug}" exceeds ${MAX_URL_LEN} chars: ${href.length}. ` +
        `Consider per-game bundle splits.`
    );
  }
  result[slug] = href;
  stats[slug] = `${href.length} chars`;
}

await writeFile(
  join(root, "public/bookmarklet-href.json"),
  JSON.stringify(result),
  "utf8"
);

console.log("[build-bookmarklet-href] wrote public/bookmarklet-href.json");
for (const [slug, size] of Object.entries(stats)) {
  console.log(`  ${slug.padEnd(20)} ${size}`);
}
