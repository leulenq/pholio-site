import type { MetadataRoute } from "next";
import { INDEXING_ENABLED, absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // The wildcard includes Googlebot, Bingbot, OAI-SearchBot and PerplexityBot.
    // Do not create bot-specific groups that accidentally drop the API restriction.
    rules: { userAgent: "*", allow: INDEXING_ENABLED ? "/" : undefined, disallow: INDEXING_ENABLED ? ["/api/", "/api$"] : "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
