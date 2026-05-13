#!/usr/bin/env node
/**
 * strip-broken-inline-images.mjs
 *
 * After we determined LinkedIn's signed image URLs can't be mirrored without
 * a logged-in session, the next-best fix is to remove every <figure> /
 * <img src="https://media.licdn.com/..."> from each article body so we don't
 * render broken-image icons in the reader.
 *
 * Safe to re-run.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(REPO_ROOT, "content", "blog");

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".html"));
let removed = 0;

for (const f of files) {
  const full = path.join(CONTENT_DIR, f);
  let html = fs.readFileSync(full, "utf8");
  const before = html.length;

  // Remove entire <figure>...</figure> blocks that wrap a licdn image.
  html = html.replace(
    /<figure\b[^>]*>(?:(?!<\/figure>)[\s\S])*?<img[^>]*src="https:\/\/media\.licdn\.com\/[^"]*"[\s\S]*?<\/figure>/g,
    ""
  );

  // Remove standalone <img src="https://media.licdn.com/..."> tags.
  html = html.replace(
    /<img\b[^>]*\bsrc="https:\/\/media\.licdn\.com\/[^"]*"[^>]*>/g,
    ""
  );

  if (html.length !== before) {
    fs.writeFileSync(full, html, "utf8");
    removed++;
  }
}

console.log(`[strip] Cleaned ${removed} files with broken LinkedIn images`);
