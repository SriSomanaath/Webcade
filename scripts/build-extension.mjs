#!/usr/bin/env node
// Copies the latest bookmarklet IIFE + icons into extension/ so the unpacked
// extension always ships with whatever was last built.

import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

await mkdir(join(root, "extension/icons"), { recursive: true });

await copyFile(
  join(root, "public/bookmarklet.js"),
  join(root, "extension/bookmarklet.js")
);

await copyFile(
  join(root, "public/favicon-32x32.png"),
  join(root, "extension/icons/icon-32.png")
);
await copyFile(
  join(root, "public/android-chrome-192x192.png"),
  join(root, "extension/icons/icon-192.png")
);

console.log("[build-extension] copied bookmarklet.js + icons → extension/");
