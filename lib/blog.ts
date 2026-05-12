/**
 * Blog data layer. Reads from data/blog.json (manifest) + content/blog/<slug>.html
 * (article bodies). All reads happen on the server.
 *
 * The HTML bodies were imported from LinkedIn newsletter exports by
 * scripts/import-blog.mjs and are pre-sanitized.
 */

import fs from "node:fs";
import path from "node:path";
import blogManifest from "@/data/blog.json";

export type BlogPostMeta = {
  slug: string;
  title: string;
  linkedinUrl: string;
  /** ISO 8601. May be empty for very old entries. */
  date: string;
  dateDisplay: string;
  excerpt: string;
  cover: string;
  readTime: string;
  wordCount: number;
};

export type BlogPost = BlogPostMeta & {
  bodyHtml: string;
};

const POSTS = blogManifest as BlogPostMeta[];
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPostMeta[] {
  return POSTS;
}

export function getPostMeta(slug: string): BlogPostMeta | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export function getPost(slug: string): BlogPost | null {
  const meta = getPostMeta(slug);
  if (!meta) return null;
  try {
    const bodyHtml = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.html`), "utf8");
    return { ...meta, bodyHtml };
  } catch {
    return null;
  }
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const idx = POSTS.findIndex((p) => p.slug === slug);
  if (idx === -1) return POSTS.slice(0, limit);
  // Take posts immediately before + after in the chronological list.
  const before = POSTS.slice(Math.max(0, idx - limit), idx);
  const after = POSTS.slice(idx + 1, idx + 1 + limit);
  const combined = [...after, ...before];
  return combined.slice(0, limit);
}
