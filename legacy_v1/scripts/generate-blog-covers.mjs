#!/usr/bin/env node
/**
 * generate-blog-covers.mjs
 *
 * LinkedIn's CDN refuses to serve images without a logged-in session, so we
 * can't mirror the original article covers. Instead: generate a branded SVG
 * cover for each of the 48 posts. Each cover features:
 *  - Brand magenta→violet gradient wash
 *  - Article title in Instrument Serif italic
 *  - "Gyanesh on Product · <slug-suffix>" mono label
 *  - Subtle starfield grain
 *
 * Output: public/images/blog/<slug>/cover.svg
 * Updates: data/blog.json `.cover` paths in-place
 *
 * Re-runnable. Will overwrite existing generated covers.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(REPO_ROOT, "data", "blog.json");
const PUBLIC_DIR = path.join(REPO_ROOT, "public", "images", "blog");

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Wrap a title into lines at most `maxChars` long.
 * Returns an array of lines.
 */
function wrap(title, maxChars) {
  const words = title.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? cur + " " + w : w;
    if (trial.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = trial;
    }
  }
  if (cur) lines.push(cur);
  // Cap at 4 lines.
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].replace(/.{0,3}$/, "…");
  }
  return lines;
}

/**
 * Pick a brand color hue based on a hash of the slug, so each post has a
 * slightly different gradient direction / accent.
 */
function hueOffsetForSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h) % 60; // 0-60 degree shift
}

function svgFor(post, idx) {
  const W = 1200;
  const H = 630;
  const lines = wrap(post.title, 32);
  const lineHeight = 78;
  const fontSize = 64;
  const startY = H / 2 - ((lines.length - 1) * lineHeight) / 2 + fontSize / 3;
  const hue = hueOffsetForSlug(post.slug);
  const editionLabel = `Gyanesh on Product · #${String(idx + 1).padStart(2, "0")}`;
  const date = post.dateDisplay || "";

  // Starfield: deterministic positions from a tiny PRNG seeded by slug.
  let seed = 0;
  for (let i = 0; i < post.slug.length; i++) seed = (seed * 9301 + post.slug.charCodeAt(i) + 49297) | 0;
  const rand = () => {
    seed = (seed * 9301 + 49297) & 0x7fffffff;
    return (seed % 10000) / 10000;
  };
  const stars = Array.from({ length: 60 }, () => ({
    cx: Math.floor(rand() * W),
    cy: Math.floor(rand() * H),
    r: 0.4 + rand() * 1.2,
    o: 0.2 + rand() * 0.6,
  }));

  const lineEls = lines
    .map((line, i) =>
      `<text x="60" y="${startY + i * lineHeight}" font-family="'Instrument Serif', 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif" font-style="italic" font-weight="400" font-size="${fontSize}" fill="#F5EFEF">${escapeXml(line)}</text>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${hue})">
      <stop offset="0%" stop-color="#0A0820"/>
      <stop offset="55%" stop-color="#1A1A3A"/>
      <stop offset="100%" stop-color="#11103A"/>
    </linearGradient>
    <radialGradient id="glowA" cx="20%" cy="0%" r="60%">
      <stop offset="0%" stop-color="#ED2EBA" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ED2EBA" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="100%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#8E3DEF" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#8E3DEF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glowA)"/>
  <rect width="100%" height="100%" fill="url(#glowB)"/>

  <!-- Stars -->
  <g fill="#F5EFEF">
    ${stars.map((s) => `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r.toFixed(2)}" opacity="${s.o.toFixed(2)}"/>`).join("")}
  </g>

  <!-- Edition label -->
  <text x="60" y="80" font-family="'Geist Mono', ui-monospace, monospace" font-size="20" letter-spacing="4" fill="#C9BCC4" text-transform="uppercase">${escapeXml(editionLabel.toUpperCase())}</text>

  <!-- Title block -->
  ${lineEls}

  <!-- Date footer -->
  <text x="60" y="${H - 60}" font-family="'Geist Mono', ui-monospace, monospace" font-size="20" letter-spacing="4" fill="#828397">${escapeXml((date || "").toUpperCase())}</text>

  <!-- Brand mark -->
  <text x="${W - 60}" y="${H - 60}" text-anchor="end" font-family="'Geist Mono', ui-monospace, monospace" font-size="20" letter-spacing="4" fill="#828397">GYANESH.S</text>

  <!-- Bottom-right brand line -->
  <line x1="${W - 200}" y1="${H - 40}" x2="${W - 60}" y2="${H - 40}" stroke="#ED2EBA" stroke-width="2"/>
</svg>`;
}

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error("[covers] data/blog.json not found");
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

  let generated = 0;
  for (let i = 0; i < manifest.length; i++) {
    const post = manifest[i];
    const dir = path.join(PUBLIC_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    const svgPath = path.join(dir, "cover.svg");
    fs.writeFileSync(svgPath, svgFor(post, i), "utf8");
    manifest[i].cover = `/images/blog/${post.slug}/cover.svg`;
    generated++;
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`[covers] Generated ${generated} branded SVG covers`);
}

main();
