import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { INDEXABLE } from "@/lib/seo";

/**
 * `/robots.txt`. On the real site: everything may be crawled (styles and
 * scripts included — search engines render pages with them) and the sitemap
 * is announced. On a local or staging copy (`INDEXABLE` false): nothing, so a
 * test deployment never ends up in search results next to the real one.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
