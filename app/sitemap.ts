/**
 * sitemap.ts — auto-generated XML sitemap at /sitemap.xml.
 *
 * Includes:
 *  - Root (/) — primary entry, highest priority
 *  - /blog (newsletter index)
 *  - Every individual /blog/<slug> reader page (48 of them)
 *
 * Google + Bing pick this up automatically. Reference it from robots.txt
 * for an extra signal.
 */

import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const now = new Date();

  const posts = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts,
  ];
}
