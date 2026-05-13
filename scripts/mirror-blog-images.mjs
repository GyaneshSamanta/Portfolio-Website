#!/usr/bin/env node
/**
 * mirror-blog-images.mjs
 * One-shot migration: downloads every LinkedIn-signed image URL referenced by
 * blog content (covers + inline figures) and rewrites the references to local
 * /images/blog/<slug>/ paths.
 *
 * Why: LinkedIn CDN URLs include `?e=<unix-epoch>` signatures that expire
 * around mid-2027. Mirroring locally guarantees stable assets long-term.
 *
 * Re-runnable. Skips already-mirrored files (idempotent).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(REPO_ROOT, "data", "blog.json");
const CONTENT_DIR = path.join(REPO_ROOT, "content", "blog");
const PUBLIC_DIR = path.join(REPO_ROOT, "public", "images", "blog");

const CONCURRENCY = 6; // simultaneous downloads
const RETRY = 2;
const TIMEOUT_MS = 30000;

function log(msg) {
  console.log(`[mirror] ${msg}`);
}

async function fetchBytes(url, attempt = 1) {
  const ctrl = new AbortController();
  const tm = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // LinkedIn CDN 404s on default Node fetch UA; mimic a real browser.
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.linkedin.com/",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) throw new Error(`tiny response (${buf.length}b)`);
    return buf;
  } catch (err) {
    if (attempt <= RETRY) {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      return fetchBytes(url, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(tm);
  }
}

function fileExtFromUrl(url) {
  try {
    const u = new URL(url);
    const ext = path.extname(u.pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) return ext;
  } catch {}
  return ".jpg";
}

async function downloadIfNeeded(url, destAbs) {
  if (fs.existsSync(destAbs)) {
    return { skipped: true };
  }
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  const buf = await fetchBytes(url);
  fs.writeFileSync(destAbs, buf);
  return { skipped: false, bytes: buf.length };
}

async function processInBatches(items, fn, size = CONCURRENCY) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const settled = await Promise.allSettled(batch.map(fn));
    results.push(...settled);
  }
  return results;
}

function isLicdnUrl(s) {
  return typeof s === "string" && /^https:\/\/media\.licdn\.com\//.test(s);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

  let coversMirrored = 0;
  let coversSkipped = 0;
  let inlineMirrored = 0;
  let inlineSkipped = 0;
  let failures = [];

  // --- Pass 1: covers ---
  log(`Processing ${manifest.length} cover images…`);
  const coverWork = manifest
    .map((post, idx) => ({ post, idx }))
    .filter(({ post }) => isLicdnUrl(post.cover));

  const coverResults = await processInBatches(coverWork, async ({ post, idx }) => {
    const ext = fileExtFromUrl(post.cover);
    const rel = `/images/blog/${post.slug}/cover${ext}`;
    const abs = path.join(REPO_ROOT, "public", rel);
    try {
      const r = await downloadIfNeeded(post.cover, abs);
      manifest[idx].cover = rel;
      if (r.skipped) coversSkipped++;
      else coversMirrored++;
    } catch (err) {
      failures.push({ kind: "cover", slug: post.slug, err: err.message });
    }
  });

  // --- Pass 2: inline images inside content/blog/<slug>.html ---
  log(`Scanning HTML bodies for inline images…`);
  for (const post of manifest) {
    const file = path.join(CONTENT_DIR, `${post.slug}.html`);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, "utf8");
    const matches = Array.from(
      html.matchAll(/<img\b[^>]*\bsrc="(https:\/\/media\.licdn\.com\/[^"]+)"/g)
    );
    if (matches.length === 0) continue;

    // Deduplicate URLs.
    const urls = Array.from(new Set(matches.map((m) => m[1])));
    let n = 0;
    const mapping = new Map();
    for (const url of urls) {
      const ext = fileExtFromUrl(url);
      const rel = `/images/blog/${post.slug}/img-${n++}${ext}`;
      const abs = path.join(REPO_ROOT, "public", rel);
      try {
        const r = await downloadIfNeeded(url, abs);
        mapping.set(url, rel);
        if (r.skipped) inlineSkipped++;
        else inlineMirrored++;
      } catch (err) {
        failures.push({ kind: "inline", slug: post.slug, url, err: err.message });
      }
    }

    // Rewrite each occurrence with the local path.
    for (const [from, to] of mapping) {
      html = html.split(from).join(to);
    }
    fs.writeFileSync(file, html, "utf8");
  }

  // --- Persist manifest changes ---
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  // --- Summary ---
  log("------");
  log(`Covers:  ${coversMirrored} mirrored, ${coversSkipped} already cached`);
  log(`Inline:  ${inlineMirrored} mirrored, ${inlineSkipped} already cached`);
  if (failures.length > 0) {
    log(`Failures: ${failures.length}`);
    for (const f of failures.slice(0, 10)) {
      console.warn(`  ${f.kind} ${f.slug}: ${f.err}`);
    }
  } else {
    log("No failures.");
  }
}

main().catch((e) => {
  console.error("[mirror] fatal:", e);
  process.exit(1);
});
