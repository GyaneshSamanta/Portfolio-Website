#!/usr/bin/env node
/**
 * import-blog.mjs
 * One-time importer for LinkedIn newsletter HTML exports.
 *
 *  - Source: ../LinkedIn Data/Complete_LinkedInDataExport_05-11-2026.zip/Articles/Articles/*.html
 *  - Output:
 *      data/blog.json                 — list manifest (slug, title, date, excerpt, cover, tags)
 *      content/blog/<slug>.html       — sanitized body HTML, one per article
 *
 * Re-runnable: the script overwrites both outputs. Safe to call repeatedly.
 *
 * Caveats:
 *  - LinkedIn image URLs are signed and expire. We keep them as-is; mirror to
 *    /public/images/blog/<slug>/ later if you want stable images.
 *  - We strip <script>, <iframe>, <style>, <link>, <meta>, and on* attributes.
 *  - Reading time is heuristic (avg 230 words/min).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// The LinkedIn export was unpacked as a folder named like the zip (Windows
// behavior on the user's machine).
const SOURCE_DIR = path.resolve(
  REPO_ROOT,
  "..",
  "..",
  "..",
  "LinkedIn Data",
  "Complete_LinkedInDataExport_05-11-2026.zip",
  "Articles",
  "Articles"
);

const OUT_MANIFEST = path.join(REPO_ROOT, "data", "blog.json");
const OUT_CONTENT = path.join(REPO_ROOT, "content", "blog");

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function decodeEntities(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function slugFromFilename(filename) {
  // Two patterns:
  //   1) "2026-03-06 12_43_25.0-The cognitive economy in an age of abundance.html"
  //   2) "validation-gap-why-teams-build-features-nobody-can-use-samanta-kz3lf.html"
  const base = filename.replace(/\.html$/i, "");
  const dateMatch = base.match(/^(\d{4})-(\d{2})-(\d{2}) \d{2}_\d{2}_\d{2}\.0-(.+)$/);
  if (dateMatch) {
    return slugify(dateMatch[4]);
  }
  return base;
}

function slugify(s) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Sanitize a chunk of LinkedIn-export HTML.
 *  - drop <script>, <style>, <iframe>, <link>, <meta>, <head>, <title>
 *  - strip on* event handlers
 *  - strip class/style/data-* attrs to leave clean semantic HTML
 *  - normalize empty <pre></pre> blocks (LinkedIn uses these as section dividers)
 */
function sanitizeBody(html) {
  let body = html;

  // Remove dangerous / structural tags entirely.
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
  body = body.replace(/<style[\s\S]*?<\/style>/gi, "");
  body = body.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  body = body.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  body = body.replace(/<svg[\s\S]*?<\/svg>/gi, "");
  body = body.replace(/<link\b[^>]*\/?>/gi, "");
  body = body.replace(/<meta\b[^>]*\/?>/gi, "");

  // Strip on* event handler attributes.
  body = body.replace(/\s+on[a-z]+="[^"]*"/gi, "");
  body = body.replace(/\s+on[a-z]+='[^']*'/gi, "");

  // Strip class / style / data-* attributes (we want our CSS to control look).
  body = body.replace(/\s+(class|style|data-[a-z0-9-]+|target|rel|title)="[^"]*"/gi, "");

  // Force external links to open in new tab + rel=noopener (we'll re-add target).
  body = body.replace(/<a\s+href=/gi, '<a target="_blank" rel="noopener noreferrer" href=');

  // Drop empty <pre></pre> separators.
  body = body.replace(/<pre>\s*<\/pre>/gi, "");

  // Drop empty <p></p>.
  body = body.replace(/<p>\s*<\/p>/gi, "");

  // Drop </br> typo (LinkedIn export uses </br> instead of <br>).
  body = body.replace(/<\/br>/gi, "<br />");

  return body.trim();
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/* -------------------------------------------------------------------------- */
/* Parser                                                                      */
/* -------------------------------------------------------------------------- */

function parseArticle(filename, html) {
  // Title from <title>
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).trim() : filename;

  // Canonical LinkedIn URL (the <h1><a href="…"> for pulse posts).
  const linkMatch = html.match(/<h1>\s*<a\s+href="([^"]+)"/i);
  const linkedinUrl = linkMatch ? linkMatch[1] : "";

  // Created / Published timestamps.
  const createdMatch = html.match(/<p class="created">Created on ([0-9 :\-]+)<\/p>/i);
  const publishedMatch = html.match(/<p class="published">Published on ([0-9 :\-]+)<\/p>/i);
  const created = createdMatch ? createdMatch[1].trim() : "";
  const published = publishedMatch ? publishedMatch[1].trim() : "";

  // Body: everything inside the first top-level <div>…</div> after the h1.
  // LinkedIn wraps the article body in a single <div>.
  const bodyMatch = html.match(/<h1>[\s\S]*?<\/h1>\s*([\s\S]*?)<\/body>/i);
  let bodyHtml = bodyMatch ? bodyMatch[1] : "";

  // Trim the wrapping <p class="created"> / <p class="published"> + outer <div>.
  bodyHtml = bodyHtml
    .replace(/<p class="created">[\s\S]*?<\/p>/i, "")
    .replace(/<p class="published">[\s\S]*?<\/p>/i, "")
    .replace(/^\s*<div>([\s\S]*)<\/div>\s*$/i, "$1");

  // Hero image: first <img src=…> in the body (LinkedIn places it before h1).
  const firstImg = html.match(/<img\s+src="(https:\/\/media\.licdn\.com[^"]+)"/i);
  const hero = firstImg ? firstImg[1] : "";

  const sanitized = sanitizeBody(bodyHtml);
  const plain = stripTags(sanitized);
  const wordCount = countWords(plain);
  const readMinutes = Math.max(1, Math.round(wordCount / 230));

  // Excerpt: first 240 chars of plain text from the article (not the intro pill).
  const excerpt =
    plain.length > 240 ? plain.slice(0, 237).replace(/\s+\S*$/, "") + "…" : plain;

  // Slug
  const slug = slugFromFilename(filename);

  // Date: prefer published, fallback created. Parse "YYYY-MM-DD HH:MM" format.
  const dateString = published || created;
  const isoDate = dateString
    ? new Date(dateString.replace(" ", "T") + ":00Z").toISOString()
    : "";

  return {
    slug,
    title,
    linkedinUrl,
    date: isoDate,
    dateDisplay: formatDate(isoDate),
    excerpt,
    cover: hero,
    readTime: `${readMinutes} min read`,
    wordCount,
    bodyHtml: sanitized,
  };
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/* -------------------------------------------------------------------------- */
/* Run                                                                         */
/* -------------------------------------------------------------------------- */

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`[blog] Source not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_CONTENT, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.toLowerCase().endsWith(".html"))
    .sort();

  console.log(`[blog] Importing ${files.length} articles…`);

  const manifest = [];
  // Track slugs so we don't collide.
  const seenSlugs = new Map();

  for (const file of files) {
    const full = path.join(SOURCE_DIR, file);
    const html = fs.readFileSync(full, "utf8");
    const article = parseArticle(file, html);

    if (!article.title) {
      console.warn(`[blog] Skipping (no title): ${file}`);
      continue;
    }

    // Disambiguate collisions.
    let slug = article.slug;
    if (seenSlugs.has(slug)) {
      const n = seenSlugs.get(slug) + 1;
      seenSlugs.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      seenSlugs.set(slug, 1);
    }
    article.slug = slug;

    // Write body file.
    fs.writeFileSync(path.join(OUT_CONTENT, `${slug}.html`), article.bodyHtml, "utf8");

    // Strip the body from manifest to keep blog.json small.
    const { bodyHtml, ...rest } = article;
    manifest.push(rest);
  }

  // Sort newest-first by date.
  manifest.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(`[blog] Wrote ${manifest.length} entries to data/blog.json`);
  console.log(`[blog] Wrote ${manifest.length} HTML bodies to content/blog/`);
}

main();
