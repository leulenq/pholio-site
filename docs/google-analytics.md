# Google Analytics 4

## Property and stream

Verified in the owner's Firefox account on October 11, 2026:
- Existing Firebase-linked property: `pholio-bc5ab` (`513364065`).
- Existing Pholio web stream: `13002328781`, measurement ID `G-2BBQXGH7EP`.
- Stream URL corrected to `https://www.pholio.studio`.
- Enhanced measurement was already off; keep it off. Manual pageviews own routing.
- Disabled and saved Google tag automatic detection for browser history, scrolls,
  outbound clicks, forms, video engagement and downloads (these had been enabled).
- Disabled and saved user-provided data capabilities, which had included automatic
  inspection of names, emails and phone numbers. Verified the saved switch is off.
- Registered event-scoped custom dimension `Pholio surface` (`pholio_surface`).
- Registered `generate_lead` as a code-driven key event, counted once per session
  without a default monetary value.
- Google Signals verified off. Advertising personalization set, with owner
  approval, to United States only: all 50 states plus DC allowed (51 of 307
  regions), every other region disabled. Web tag advertising consent remains
  denied and personalization is disabled in code regardless of this exception.
- Granular location/device collection remains at its existing on setting;
  this property-wide setting was not changed.
- Existing retention verified: event data 2 months, user data 14 months, reset on
  new user activity on. These property-wide settings were left unchanged;
  decide whether to reduce user retention before activation.
- No connected site tags were present. Do not install an additional Firebase Analytics or GTM tag.

The site and app use the same web-stream ID and `.pholio.studio` GA cookies, so
consented visits can continue across the two subdomains. `pholio_surface` is
`site` or `app`; portfolios belong to the app surface. The existing iOS stream
is separate and unchanged.

## Deployment configuration

Set these in Netlify's **production** build environment, then rebuild the site:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2BBQXGH7EP
NEXT_PUBLIC_GA_ENABLED=true
NEXT_PUBLIC_GA_DEBUG=false
```

The app's Vite build needs `VITE_GA_MEASUREMENT_ID`, `VITE_GA_ENABLED`, and
`VITE_GA_DEBUG`; its Express portfolio renderer needs `GA_MEASUREMENT_ID` and
`GA_ENABLED`. Use the same ID. See the app's analytics setup document.

**Activation is pending disclosure/publication review.** The ignored local
site configuration has the real ID with `NEXT_PUBLIC_GA_ENABLED=false`.
Checked-in examples remain disabled. No deployment or live collection has
been performed by this change.

Only `www.pholio.studio`, `pholio.studio`, and `app.pholio.studio` can collect
production traffic. Other hosts, including previews, cannot. Local debugging
requires explicit enable/debug flags, a separate test property, and consent.
Debug mode only applies on localhost or 127.0.0.1. Never use the production ID
for automated tests.

## Consent and privacy

`public/scripts/google-analytics.mjs` is mirrored byte-for-byte in pholio-app.
It reads the existing affirmative analytics preference through each surface's
consent adapter. It never requests Google's SDK before consent. Ads consent
stays denied; Google Signals and advertising personalization are disabled in
the tag. This is basic consent mode, without pre-consent cookieless pings.

On withdrawal, the per-property disable flag is set before consent is denied,
future application events stop, and accessible `_ga`/`_ga_*` cookies are
removed at the shared domain and current host. Events already delivered are
not erased. Other open tabs/subdomains pick up withdrawal on focus, pageshow,
visibility change or a one-second cookie check; they also recheck consent
before every application event. Google's script, once executed, cannot be
unexecuted, so Enhanced Measurement must remain off.

Manual pageviews include a fixed Pholio title and an allowlisted route.
Portfolio slugs and supported agency IDs become route placeholders. Recovery,
magic-link, guardian, internal, development and unknown routes are excluded.
No document titles, account IDs, profile fields, form values, email addresses,
photos or measurements are sent. Queries and fragments are omitted, including
UTM parameters: campaign attribution from URL parameters is intentionally not
collected by this implementation. External referrers are reduced to their
origin; Pholio referrers use the same safe route rules. Raw paths are used only in browser memory to distinguish
navigation between different portfolios; they are never sent. Native GA automatic
engagement/session events use the overridden safe page context.

## Stable event model

| Event | Trigger | Parameters |
|---|---|---|
| `page_view` | Initial consented view, consent grant or pathname change | `page_path`, `page_location`, `page_referrer`, fixed `page_title`, `pholio_surface` |
| `generate_lead` | Agency request endpoint succeeds (including its indistinguishable idempotent success response) | `method=agency_access_request`, `pholio_surface=site` |
| `login` | App's backend session creation succeeds | bounded `method=email/google`, `pholio_surface=app` |

No click-text capture, form auto-tracking, inferred purchases or inferred new
accounts. Events before consent or SDK readiness are dropped, never replayed.
A lead event means a successful request interaction, not a unique agency.

## GA administration and release verification

- Keep Enhanced Measurement off, including history pageviews, site search,
  outbound clicks and form interactions. Automatic collection can expose raw
  links/form information and duplicate manual pageviews.
- Keep Google Signals and user-provided data collection off. Advertising
  personalization is US-only by owner choice; web ads consent remains denied.
  Recheck these settings before activation.
- `pholio_surface` is registered as the event-scoped `Pholio surface` dimension.
- `generate_lead` is configured as a code-driven key event, counted once per
  session, with no default monetary value. Avoid counting `login` as a conversion.
- Review the verified property retention settings recorded above before activation.
- Verify production envs and rebuild both browser bundles; public envs are
  compiled into JavaScript and cannot be changed only at runtime.
- In a separate test property, use DebugView to confirm one pageview per route,
  safe URLs/titles, login/lead success events, no SDK request before consent,
  and no subsequent event after withdrawal. Verify cross-subdomain continuity
  in Realtime after publishing and consent. A blocked tag/ad blocker must not
  prevent login or form submission.

## Disclosure review required before activation

The current site legal corpus is a **candidate draft**, version `2026-09-15`,
with publication pending. The app's accepted legal version is `2026-07-18`.
Do not silently align these versions as part of installing analytics: the
existing legal publication checklist governs that release.

The notices describe Pholio's own portfolio measurement and Google/Firebase
Auth, but not the new GA4 service. Proposed additions for the publication
review:

**Privacy notice (cookies/analytics and providers):**

> When you allow optional analytics, we use Google Analytics to understand use
> of our marketing website, application and public portfolios. Google receives
> cookie identifiers, browser/device and network information, normalized page
> information and selected usage events. We do not deliberately send account
> identifiers, profile information, application contents, names or email
> addresses in analytics events. Google processes this information under its
> applicable service terms and privacy information. You can withdraw analytics
> consent through Cookie preferences. Withdrawal stops future optional
> collection; it does not automatically erase records already collected.

**Cookie notice (optional analytics):**

> With your analytics permission, Google Analytics uses first-party `_ga` and
> `_ga_*` cookies shared across supported Pholio subdomains to recognize browser
> visits and sessions. We configure their expiry to one year; consented use can
> renew them. We load the Google Analytics tag only after analytics permission,
> keep advertising consent denied and disable Google Signals in the tag.
> Withdrawing permission stops future optional tracking and removes accessible
> Google Analytics cookies. Browser controls can also block or delete cookies.

Review the actual provider arrangements, international transfers, retention,
minor-user treatment and current publication status before adopting these
paragraphs. Then update the relevant documents, synchronize the release legal
version in both repos, and add the app's changelog entry as required by
`docs/app-integration.md`. No legal sentences or acceptance versions were
changed by this implementation.

## Sources

- [Manual pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [SPA measurement and DebugView verification](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)
- [Google consent mode implementation](https://developers.google.com/tag-platform/security/guides/consent)
- [Cross-domain measurement and shared tag ID](https://support.google.com/analytics/answer/10071811)

## Verification results

Both production builds passed; site TypeScript passed. Site lint reported zero
errors and 11 warnings in existing unrelated components; the new analytics
files passed focused lint. Eighteen analytics tests and seventeen existing
consent tests passed in the app. Shared runtime parity and diff checks passed.
Both EJS portfolio templates rendered with enabled/disabled configs in tests.

Local browser checks exercised site preference reset/accept/necessary-only and
the app consent banner. Disabled configurations loaded no Google SDK, even
after consent. Full live authenticated app navigation was not exercised without
starting the backend. The site has an existing viewport-canvas root hydration
warning; analytics renders no markup and that warning was not changed here.
Consent-enabled transmission to Google and production cross-subdomain continuity
remain release checks, not completed claims.
