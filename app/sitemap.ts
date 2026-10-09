import type { MetadataRoute } from "next";
import { fetchAgencyRegister } from "@/lib/agency-registry";
import { INDEXING_ENABLED, absoluteUrl, indexableStaticPaths } from "@/lib/seo";

export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!INDEXING_ENABLED) return [];
  const agencies = await fetchAgencyRegister();
  // An outage must not cache a successful sitemap which silently delists the register.
  // ISR retains the previous successful version; a cold request can be retried.
  if (agencies === null) throw new Error("Agency registry unavailable while generating sitemap");
  return [
    ...indexableStaticPaths().map((path) => ({ url: absoluteUrl(path) })),
    ...agencies.map((agency) => ({ url: absoluteUrl(`/agencies/${encodeURIComponent(agency.seriesId)}`) })),
  ];
  // No fabricated lastmod/build timestamp, changefreq or priority hints.
}
