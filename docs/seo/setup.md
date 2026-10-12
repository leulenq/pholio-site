# Search setup and release checks

## Public site

The live marketing sitemap contains 19 public URLs. Titles, descriptions,
canonicals, Open Graph/Twitter previews, structured data, crawlable HTML,
permanent apex redirects and genuine noindex 404s have been checked.
Previews remain noindex. Draft legal notices remain excluded from the sitemap.

The SEO audit now supports HTTPS, accepts the live edge's permanent 301 as well
as Next's 308, and follows same-origin static-directory redirects before
checking demo indexing controls. Netlify edge noindex headers are configured
for `/zofia` and `/talent-experience` because static files bypass Next's headers.
These new hosting rules need deployment before their live checks can pass.

## App

The React SPA shell is noindex/nofollow. Exact Netlify rules protect its route
families and direct `/dashboard-app` access. Express sets matching headers
before sessions, routes and errors. Public `/portfolio/:slug` and `/p/:slug`
remain outside these blanket app-utility restrictions. Indexing eligibility is
separate from permission to expose a portfolio and never bypasses those checks.

No app robot-wide Disallow rule was added: crawlers need to retrieve a page to
see its noindex instruction. Noindex is not authorization or a privacy boundary;
existing server authentication and publication gates remain responsible for access.

## Search Console

A domain property `pholio.studio` is being verified in the owner's Google account.
This covers both `www` and `app`. DNS is managed in Cloudflare.

Ownership verification requires one root TXT record (not an A/CNAME or routing
change). After verification, submit `https://www.pholio.studio/sitemap.xml` and
confirm its success/read status in Search Console. Verification and sitemap
submission alone do not establish that Google has indexed every page.

## Deployment

The app’s source, middleware and Netlify headers need an app deployment; the
site’s Netlify demo header rules need a site deployment. Analytics enable flags
remain off while the separate disclosure review is pending.

After publishing, run the site SEO audit against `https://www.pholio.studio`,
then verify noindex on app login/recovery/onboarding/dashboard responses and
confirm public portfolio publication rules are unchanged.

## Status on October 11, 2026

- Domain property `pholio.studio` ownership verified in Search Console.
- Root Google verification TXT record saved in Cloudflare and confirmed publicly.
  Keep this record; removing it can remove verified ownership.
- Marketing sitemap submitted. Google accepted the submission but its report
  initially returned `Couldn't fetch`; a direct request returns HTTP 200,
  `application/xml`, and 19 URLs. Google's live URL test is being checked;
  submission alone is not recorded as a successful sitemap read.
- Site production build and all seven environment/indexing configuration checks
  passed. Full local SEO audit passed: 31 pages, 8 social images, 41 internal
  destinations, zero broken links, robots, bot HTML, demos and genuine 404s.
- App production build and 45 focused search-indexing tests passed.
- Site and app publishing was deferred on October 11 pending Netlify sign-in.
  The owner restored access on October 12; the prepared release is being
  published and must be verified live before reporting deployment complete.
- The live demo header checks remain pending the site deployment. App noindex
  protections likewise remain local until the app deployment.

Google's live URL inspection completed successfully for the exact sitemap URL:
`Crawl allowed: Yes`, `Page fetch: Successful`, `Indexing allowed: Yes`. The
sitemap was resubmitted once after that test. The Sitemaps report still needs
to confirm successful parsing/discovery; do not confuse a successful live fetch
with a successful processed sitemap or indexed pages.

Domain ownership and successful Google live fetch were verified in the browser;
proof screenshots are retained locally outside the source release.

Google's documented diagnostic procedure:
https://support.google.com/webmasters/answer/7451001

## Brand disambiguation

The owner supplied a Google result for `pholio studio` whose organic result is
Pholio's own site but whose AI Overview describes the unrelated Pholio Co
interior-design business. This demonstrates homepage indexing, not correct
recognition of Pholio's identity in that AI response.

The live homepage title already identifies model portfolios, comp cards and
applications; the screenshot uses an older title. The prepared organization and
website schema now reuse the approved model-platform description. Organization
`sameAs` links use the owner's confirmed official profiles:
- https://www.instagram.com/pholio.studio/
- https://www.linkedin.com/company/pholio-studio

These additions still need publication and Google recrawling. They strengthen
identity signals; they do not directly edit or guarantee an AI Overview.
No company legal name, address, affiliation, or competitor relationship was
invented. Search Console's Search generative AI control is verified Include.

[Google organization disambiguation guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).
