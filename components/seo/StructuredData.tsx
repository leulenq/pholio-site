import { absoluteUrl, SEO_PAGES, type SeoPage } from "@/lib/seo";
import { STUDIO_PLUS_PRICE_MONTHLY, STUDIO_PLUS_PRICE_ANNUAL } from "@/lib/marketing-pricing";
import type { AgencyDetail, AgencySummary } from "@/lib/agency-registry";

const organization = absoluteUrl("/#organization");
const website = absoluteUrl("/#website");
const application = absoluteUrl("/#application");

/** Registry text is external data. Escaping '<' prevents closing this script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function SiteStructuredData() {
  return <JsonLd data={{
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": organization, name: "Pholio", url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/press/kit/wordmark/pholio-wordmark-velvet.png"), width: 2400, height: 373 } },
      { "@type": "WebSite", "@id": website, name: "Pholio", url: absoluteUrl("/"), inLanguage: "en", publisher: { "@id": organization } },
    ],
  }} />;
}

export function PageStructuredData({ path, page = SEO_PAGES[path], parent }: { path: string; page?: SeoPage; parent?: { path: string; name: string } }) {
  const url = absoluteUrl(path);
  const graph: Record<string, unknown>[] = [{
    "@type": page.type ?? "WebPage", "@id": `${url}#webpage`, url,
    name: page.title, description: page.description, inLanguage: "en",
    isPartOf: { "@id": website }, publisher: { "@id": organization },
    ...(path === "/" ? { mainEntity: { "@id": application } } : {}),
  }];
  if (path !== "/") {
    const trail = [{ path: "/", name: "Pholio" }, ...(parent ? [parent] : []), { path, name: page.title }];
    graph[0].breadcrumb = { "@id": `${url}#breadcrumb` };
    graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: trail.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) });
  }
  if (path === "/") graph.push({
    "@type": "WebApplication", "@id": application, name: "Pholio", url,
    description: page.description, applicationCategory: "MultimediaApplication",
    operatingSystem: "Web browser", provider: { "@id": organization },
    featureList: ["Model portfolios", "Digitals", "Comp cards", "Agency application records"],
    offers: { "@type": "Offer", name: "Free", price: 0, priceCurrency: "USD", url: absoluteUrl("/#pricing") },
  });
  if (path === "/studio-plus") graph.push({
    "@type": "Service", "@id": `${url}#studio-plus`, name: "Pholio Studio+", url,
    description: page.description, provider: { "@id": organization },
    offers: [
      { "@type": "Offer", name: "Studio+ monthly", url, priceSpecification: { "@type": "UnitPriceSpecification", price: STUDIO_PLUS_PRICE_MONTHLY, priceCurrency: "USD", billingDuration: "P1M" } },
      { "@type": "Offer", name: "Studio+ annual", url, priceSpecification: { "@type": "UnitPriceSpecification", price: STUDIO_PLUS_PRICE_ANNUAL, priceCurrency: "USD", billingDuration: "P1Y" } },
    ],
  });
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

export function AgencyRegisterStructuredData({ agencies }: { agencies: AgencySummary[] }) {
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Modeling agency application requirements", itemListElement: agencies.map((agency, i) => ({ "@type": "ListItem", position: i + 1, name: agency.organization.name, url: absoluteUrl(`/agencies/${encodeURIComponent(agency.seriesId)}`) })) }} />;
}

export function AgencySourcesStructuredData({ agency }: { agency: AgencyDetail }) {
  return <JsonLd data={{
    "@context": "https://schema.org", "@type": "WebPage",
    "@id": `${absoluteUrl(`/agencies/${encodeURIComponent(agency.seriesId)}`)}#webpage`,
    // A requirements page is research about an agency, never Pholio's own agency.
    about: { "@type": "Organization", name: agency.organization.name },
    ...(agency.checked.reviewedOn ? { lastReviewed: agency.checked.reviewedOn } : {}),
    citation: agency.sources.filter((source) => source.url).map((source) => ({ "@type": "CreativeWork", name: source.title, url: source.url })),
  }} />;
}
