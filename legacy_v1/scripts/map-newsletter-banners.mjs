#!/usr/bin/env node
/**
 * map-newsletter-banners.mjs
 *
 * Copies the user-provided Canva banners from
 *   ../../../Newsletter Banners/Newsletter Banners/
 * into
 *   public/images/blog/<slug>/cover.png
 *
 * Then updates data/blog.json `.cover` paths in place.
 *
 * Mapping logic:
 *  - Numbered banners (15.png through 32.png) → most-recent 18 posts in
 *    reverse-chronological order, since edition #32 is the latest.
 *  - Named banners → matched by title / topic keyword to specific older posts.
 *  - Posts without a banner keep their auto-generated SVG cover.
 *
 * Re-runnable.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(
  REPO_ROOT,
  "..",
  "..",
  "..",
  "Newsletter Banners",
  "Newsletter Banners"
);
const MANIFEST = path.join(REPO_ROOT, "data", "blog.json");
const PUBLIC_DIR = path.join(REPO_ROOT, "public", "images", "blog");

if (!fs.existsSync(SRC_DIR)) {
  console.error(`[banners] source not found: ${SRC_DIR}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const bySlug = Object.fromEntries(manifest.map((p, i) => [p.slug, i]));

// ---- 1. Named-banner → slug map ------------------------------------------
const NAMED = [
  { file: "Product Management next 5 years.png", slug: "elevated-professional-navigating-next-era-product-gyanesh-samanta-qlmsc" },
  { file: "Practice vs Theory.png", slug: "product-managers-tightrope-balancing-idealistic-workable-samanta-objvc" },
  { file: "Chat AI.png", slug: "why-companies-should-focus-chatgpt-perplexity-over-seo-samanta-jcmyc" },
  { file: "Airbnb Youtube Case.png", slug: "personalisation-scale-product-led-growth-hyper-targeted-samanta-ghazc" },
  { file: "Digital Marketing.png", slug: "digital-marketing-bids-strategising-campaigns-gyanesh-samanta-wo7yc" },
  { file: "PMF.png", slug: "how-achieving-product-market-fit-case-studies-gyanesh-samanta-avujc" },
  { file: "KPI Tree.png", slug: "how-building-kpi-trees-data-story-telling-gyanesh-samanta-twqmc" },
  { file: "3b Framework.png", slug: "behavioural-science-101-3b-framework-gyanesh-samanta-qjj0c" },
  { file: "ETHIndia.png", slug: "how-we-won-ethindia23-gyanesh-samanta-mplcc" },
  { file: "Data Wilderness.png", slug: "navigating-data-wilderness-from-aws-redshift-mongodb-gyanesh-samanta-4oksf" },
  { file: "NYSee the shootings.png", slug: "nysee-shootings-gyanesh-samanta" },
  { file: "Ethereum.png", slug: "navigating-future-decentralized-intelligence-through-data-samanta" },
  { file: "Data Story telling.png", slug: "data-story-telling-what-why-how-gyanesh-samanta" },
  { file: "IBM.png", slug: "my-steps-from-b2c-b2b-product-management-gyanesh-samanta-tmtec" },
];

// ---- 2. Numbered banners (15-32) → 18 most recent posts ------------------
const NUMBERED_BANNERS = [];
for (let n = 32; n >= 15; n--) {
  const file = `${n}.png`;
  if (!fs.existsSync(path.join(SRC_DIR, file))) {
    console.warn(`[banners] missing numbered file ${file}`);
    continue;
  }
  NUMBERED_BANNERS.push(file);
}

// manifest is sorted newest-first (date desc) by import-blog.mjs.
// Map #32 → manifest[0], #31 → manifest[1], …
const numberedAssignments = NUMBERED_BANNERS.map((file, idx) => ({
  file,
  slug: manifest[idx]?.slug,
})).filter((x) => x.slug);

// ---- 3. Copy + manifest rewrite ------------------------------------------

function copyBanner(srcFile, slug) {
  const srcAbs = path.join(SRC_DIR, srcFile);
  if (!fs.existsSync(srcAbs)) return null;

  const destDir = path.join(PUBLIC_DIR, slug);
  fs.mkdirSync(destDir, { recursive: true });

  // Remove the auto-generated SVG cover if present (so .png becomes canonical).
  const svg = path.join(destDir, "cover.svg");
  if (fs.existsSync(svg)) fs.unlinkSync(svg);

  const destFile = path.join(destDir, "cover.png");
  fs.copyFileSync(srcAbs, destFile);
  return `/images/blog/${slug}/cover.png`;
}

let mapped = 0;
const unmapped = [];

// Apply named first (they're explicit overrides).
for (const { file, slug } of NAMED) {
  if (bySlug[slug] === undefined) {
    console.warn(`[banners] named banner references unknown slug: ${slug}`);
    continue;
  }
  const rel = copyBanner(file, slug);
  if (rel) {
    manifest[bySlug[slug]].cover = rel;
    mapped++;
  } else {
    unmapped.push(file);
  }
}

// Then apply numbered.
for (const { file, slug } of numberedAssignments) {
  if (bySlug[slug] === undefined) continue;
  // Don't overwrite a named mapping that already landed.
  const existingCover = manifest[bySlug[slug]].cover || "";
  if (existingCover.endsWith("cover.png") && existingCover.includes(`/${slug}/`)) {
    continue;
  }
  const rel = copyBanner(file, slug);
  if (rel) {
    manifest[bySlug[slug]].cover = rel;
    mapped++;
  } else {
    unmapped.push(file);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`[banners] Mapped ${mapped} banners`);
console.log(`[banners] Posts without banners (keeping auto-SVG):`);
const withBanner = new Set(
  manifest.filter((p) => p.cover && p.cover.endsWith(".png")).map((p) => p.slug)
);
for (const p of manifest) {
  if (!withBanner.has(p.slug)) console.log(`  - ${p.slug} (${p.dateDisplay} — ${p.title})`);
}
if (unmapped.length) console.warn(`[banners] Unmapped src files: ${unmapped.join(", ")}`);
