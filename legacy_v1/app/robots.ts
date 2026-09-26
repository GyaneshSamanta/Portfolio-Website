/**
 * robots.ts — auto-generated robots.txt at /robots.txt.
 *
 * Allows everything. References sitemap.xml so crawlers find it on the first
 * visit. (Replaces any old static public/robots.txt — Next will prefer this
 * route over the static file.)
 */

import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
