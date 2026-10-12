import assert from "node:assert/strict";
import sharp from "sharp";
import http from "node:http";
import https from "node:https";


const base = process.env.SEO_AUDIT_ORIGIN || "http://localhost:3001";
const canonicalOrigin = "https://www.pholio.studio";
const preview = process.env.SEO_AUDIT_PREVIEW === "true";
const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
const metas = (html) => [...html.matchAll(/<meta\s[^>]*>/g)].map((m) => attrs(m[0]));
const get = async (path, userAgent = "Pholio SEO audit") => {
  const response = await fetch(new URL(path, base), { headers: { "user-agent": userAgent }, signal: AbortSignal.timeout(30000), redirect: "manual" });
  return { response, html: await response.text() };
};
const { response: sitemapResponse, html: xml } = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200, "Sitemap must be available");
assert.match(sitemapResponse.headers.get("content-type"), /xml/);
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1]));
assert.equal(urls.length, new Set(urls).size, "Sitemap URLs must be unique");
assert.ok(!xml.includes("<lastmod>"), "No build timestamps masquerading as content updates");
if (preview) assert.equal(urls.length, 0, "Preview sitemap must be empty");
else {
  assert.ok(urls.length >= 18, "Sitemap must contain the public site");
  assert.ok(urls.some((url) => url.includes("/agencies/")), "Live registry must be included");
  for (const url of urls) {
    assert.equal(new URL(url).origin, canonicalOrigin, "Only canonical public URLs in sitemap");
    assert.ok(!/zofia|talent-experience|\/api\//.test(url), "No prototypes or API endpoints in sitemap");
  }
}
const titles = new Set();
const descriptions = new Set();
const images = new Set();
const internalLinks = new Set();
const draftLegalPaths = ["/terms", "/privacy", "/cookies", "/dmca", "/ai-notice", "/community-guidelines", "/legal/submission-program", "/take-it-down", "/legal/subscriptions", "/legal/agency-terms", "/legal/verification", "/legal/guardians"];
for (const path of draftLegalPaths) assert.ok(!urls.includes(`${canonicalOrigin}${path}`), `${path}: draft absent from sitemap`);
const paths = preview ? ["/", "/talent", "/privacy"] : [...urls.map((url) => new URL(url).pathname), ...draftLegalPaths];
for (const path of paths) {
  const { response, html } = await get(path);
  assert.equal(response.status, 200, `${path}: HTTP 200`);
  const head = html.split("</head>")[0];
  const meta = metas(head);
  const value = (name) => meta.find((m) => m.name === name || m.property === name)?.content;
  const canonical = [...head.matchAll(/<link\s[^>]*>/g)].map((m) => attrs(m[0])).filter((a) => a.rel === "canonical");
  assert.equal(canonical.length, 1, `${path}: exactly one canonical`);
  assert.equal(new URL(canonical[0].href).href, new URL(path, canonicalOrigin).href, `${path}: self canonical`);
  assert.equal(new URL(value("og:url")).href, new URL(canonical[0].href).href, `${path}: consistent OG URL`);
  const title = decode(head.match(/<title>(.*?)<\/title>/s)?.[1] ?? "");
  assert.ok(title && !titles.has(title), `${path}: unique title`);
  titles.add(title);
  assert.equal(value("og:title"), title, `${path}: social title matches`);
  assert.equal(value("twitter:title"), title, `${path}: Twitter title matches`);
  const description = value("description");
  assert.ok(description && !descriptions.has(description), `${path}: unique description`);
  descriptions.add(description);
  assert.equal(value("og:description"), description, `${path}: OG description`);
  assert.equal(value("twitter:description"), description, `${path}: Twitter description`);
  assert.equal(value("twitter:card"), "summary_large_image", `${path}: large share card`);
  assert.equal(value("og:image:width"), "1200");
  assert.equal(value("og:image:height"), "630");
  assert.ok(value("og:image:alt") && value("twitter:image:alt"));
  assert.equal(value("twitter:image"), value("og:image"));
  images.add(value("og:image"));
  const noindex = preview || draftLegalPaths.includes(path);
  assert.match(value("robots"), noindex ? /noindex/ : /index, follow/);
  assert.ok(noindex || !value("robots").includes("noindex"));
  if (draftLegalPaths.includes(path)) {
    assert.match(response.headers.get("x-robots-tag"), /noindex/);
    assert.ok(!/<section[^>]*style="[^"]*opacity:0/.test(html), "Legal text must remain visible without JavaScript");
  }
  assert.ok(html.includes('<html lang="en"'), `${path}: declared language`);
  assert.ok(html.includes("<h1"), `${path}: primary heading in initial HTML`);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  assert.ok(scripts.length >= 2, `${path}: valid entity and page structured data`);
  const graph = scripts.flatMap((s) => s["@graph"] ?? [s]);
  assert.ok(graph.some((s) => s["@type"] === "Organization" && s.name === "Pholio"));
  assert.ok(graph.some((s) => s["@id"] === `${new URL(canonical[0].href).href}#webpage`));
  if (path !== "/") assert.ok(graph.some((s) => s["@type"] === "BreadcrumbList"));
  if (path.startsWith("/agencies/")) {
    const page = graph.find((s) => s.lastReviewed);
    assert.ok(page?.citation.length, `${path}: source citations and real review date`);
  }
  if (path === "/studio-plus") {
    const content = html.split('<script type="application/ld+json">').join("");
    assert.ok(!/<img[^>]*data-src=/.test(content), "Studio+ image URLs must exist without JS");
    assert.match(content, /<img[^>]*src="https:\/\/images.unsplash.com/);
  }
  if (path === "/") {
    assert.ok(html.includes("Pholio is a platform for models and the agencies they apply to."));
    assert.match(html, /<noscript>.*home-preloader.*Your book\. Your applications\./s);
  }
  for (const tag of html.matchAll(/<a\s[^>]*>/g)) {
    const href = attrs(tag[0]).href;
    if (href?.startsWith("/") && !href.startsWith("//")) internalLinks.add(new URL(href, base).pathname);
  }
  console.log(`PASS ${path}`);
}
for (const url of images) {
  assert.equal(new URL(url).origin, canonicalOrigin);
  const response = await fetch(new URL(new URL(url).pathname, base));
  assert.equal(response.status, 200, `${url}: share image available`);
  assert.match(response.headers.get("content-type"), /image\/png/);
  const buffer = Buffer.from(await response.arrayBuffer());
  const image = await sharp(buffer).metadata();
  assert.equal(image.width, 1200); assert.equal(image.height, 630);
  assert.ok(buffer.length < 5_000_000, "Share images below platform size limits");
}
const brokenLinks = [];
for (const path of internalLinks) {
  const response = await fetch(new URL(path, base), { method: "HEAD", signal: AbortSignal.timeout(30000) });
  if (response.status !== 200) brokenLinks.push({ path, status: response.status });
}
// Live Netlify edge uses 301; Next's local host rule uses 308. Both are permanent.
// Connect to the real apex over TLS on live audits; Host-header spoofing breaks SNI.
const auditOrigin = new URL(base);
const apexUrl = new URL("/talent?utm_source=seo-audit", base);
const live = auditOrigin.hostname === "www.pholio.studio";
if (live) apexUrl.hostname = "pholio.studio";
const redirect = live
  ? await fetch(apexUrl, { redirect: "manual", signal: AbortSignal.timeout(30000) })
      .then((response) => ({ status: response.status, location: response.headers.get("location") }))
  : await new Promise((resolve, reject) => {
      // Node fetch can normalize Host; use a raw request for the local host-rule test.
      const transport = apexUrl.protocol === "https:" ? https : http;
      const request = transport.get(apexUrl, { headers: { host: "pholio.studio" }, timeout: 30000 }, (response) => {
        resolve({ status: response.statusCode, location: response.headers.location });
        response.resume();
      });
      request.on("timeout", () => request.destroy(new Error("Apex redirect check timed out")));
      request.on("error", reject);
    });
assert.ok([301, 308].includes(redirect.status), "Apex host permanently redirects");
assert.equal(redirect.location, `${canonicalOrigin}/talent?utm_source=seo-audit`, "Host redirect preserves path and query");
const { html: robots } = await get("/robots.txt");
assert.match(robots, /User-Agent: \*/i);
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
if (preview) assert.match(robots, /Disallow: \/\n/);
else {
  assert.match(robots, /Allow: \/\n/); assert.match(robots, /Disallow: \/api\//);
  for (const ua of ["Googlebot", "bingbot", "OAI-SearchBot", "PerplexityBot", "facebookexternalhit/1.1", "Twitterbot/1.0", "LinkedInBot/1.0"]) {
    const { response, html } = await get("/talent", ua);
    assert.equal(response.status, 200, `${ua}: accessible`);
    assert.ok(html.split("</head>")[0].includes('property="og:image"'), `${ua}: metadata in head`);
  }
}
for (const path of ["/zofia", "/zofia/index.html", "/talent-experience", "/talent-experience/index.html"]) {
  // Netlify's static directory normalization legitimately redirects /demo to /demo/.
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  const html = await response.text();
  assert.equal(new URL(response.url).origin, new URL(base).origin, `${path}: same-origin demo`);
  assert.equal(response.status, 200, `${path}: final demo available`);
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/, `${path}: static demo must have edge noindex header`);
  assert.match(html, /name="robots" content="noindex, follow"/);
}
for (const path of ["/this-page-does-not-exist", "/agencies/not-a-real-agency"]) {
  const { response, html } = await get(path);
  assert.equal(response.status, 404, `${path}: genuine 404`);
  assert.ok(metas(html).some((m) => m.name === "robots" && m.content?.includes("noindex")), `${path}: not indexable`);
}
const { html: queryHtml } = await get("/talent?utm_source=seo-audit");
assert.ok(queryHtml.includes(`rel="canonical" href="${canonicalOrigin}/talent"`), "Tracking parameters canonicalize to clean URL");
if (brokenLinks.length) {
  console.error("Broken internal destinations:", JSON.stringify(brokenLinks));
  process.exitCode = 1;
}
console.log(`Verified ${paths.length} pages, ${images.size} share images, ${internalLinks.size} internal destinations (${brokenLinks.length} broken), sitemap, robots, bot HTML, prototypes and 404s (${preview ? "preview" : "production"}).`);
