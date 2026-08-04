# Integration with pholio-app

This site is not a standalone brochure. It shares a session cookie, a consent
cookie, a legal-version constant, and an API proxy with `pholio-app`. Those
contracts are the reason a handful of non-design files were carried through the
reset unchanged.

**Nothing in this document is a design decision. Do not change any of it as part
of a visual change.**

Repos:
- App: `/Users/lenquanhone/Projects/pholio-app` → `https://app.pholio.studio`
- This site → `https://www.pholio.studio`
- Shared cookie scope: `.pholio.studio`
- Media CDN: `https://media.pholio.studio`

Local ports: Express `:3000`, app SPA `:5173`, this site `:3001`.

---

## 1. Routes pholio-app hard-links to

The app links to these paths from emails, acceptance gates, and redirects. A
404 on any of them is a broken product, not a missing marketing page.

| Route | Status | Linked from |
|---|---|---|
| `/terms` | ✅ live | transactional emails, `LegalAcceptanceGate.jsx`, `ApplyExperience.jsx`, agency legal-acceptance service |
| `/privacy` | ✅ live | same set |
| `/ai-notice` | ✅ live | every transactional email footer, `LegalAcceptanceGate.jsx` |
| `/cookies` and `/cookies#preferences` | ✅ live | the app's own cookie banner "Manage" control |
| `/` | ✅ placeholder | `POST /api/logout` redirect target; email footers |
| **`/agency/request-access`** | ❌ **MISSING** | `GET /partners` 302s here; `POST /partners` returns 410 with this URL |

### The one live breakage

`/agency/request-access` was a page on the old site and is not on this one. Both
of pholio-app's `/partners` handlers currently hand off to a 404.

The API contract for it is preserved in `lib/agency-access-request.ts` — the
eleven required fields, the length limits, the option vocabularies, and the
201/202/400 handling — so rebuilding the page is a UI job, not a
reverse-engineering job. **It is the highest-priority page in the rebuild.**

### Broken anchors (pre-existing, inherited)

The app deep-links three anchors that have never existed on the marketing side.
Agency users clicking them in the acceptance gate land at the top of the page.

- `/terms#agency-workspace-use`
- `/terms#agency-fair-decision-making`
- `/privacy#agency-data-processing`

`LegalSection` in `components/legal/LegalDocumentLayout.tsx` now accepts an
optional `id`, so the fix is to set it on the three matching sections. Which
sections those are is a legal-content question and was not guessed at here.

---

## 2. Auth

**Mechanism:** Firebase ID token → Express session cookie on the shared parent
domain. This site participates in none of it.

- All sign-in UI lives on `app.pholio.studio`. **This site has no auth UI and no
  Firebase client, deliberately.** Firebase Web SDK persistence is per-origin,
  so a client here could never read or clear the app's Firebase state. If you
  find yourself reaching for `NEXT_PUBLIC_FIREBASE_*`, something is being solved
  on the wrong side of the boundary.
- Session cookie `connect.sid`: httpOnly, `sameSite: lax`, secure in prod,
  7-day max age, `domain: .pholio.studio`. Because of that scope, `www` sees it.

### How this site reads session state

It does **not** call the app cross-origin. `next.config.ts` rewrites
`/api/:path*` to the app backend server-side and forwards the `Cookie` header,
so client code calls same-origin `/api/public/session` and no CORS is involved.

`GET /api/public/session` returns `Cache-Control: private, no-store` and
`Vary: Cookie` — both essential, since the response crosses a CDN and a proxy.
Consume it with `credentials: "include"` and `cache: "no-store"`.

The server-returned `dashboardPath` **wins**. `dashboardPathForRole()` in
`lib/pholio-auth/constants.ts` is only a fallback and mirrors the app's copy.

### Mutations need a header

Every mutation sent to the app must carry:

```
X-Pholio-Request: same-origin
```

This mirrors `src/shared/middleware/same-origin-mutation.js`. Applies to
`/api/logout`, `/api/login`, `/api/auth/password-reset`.

### Logout is server-authoritative

`POST /api/logout` destroys the Express session **and revokes the account's
Firebase refresh tokens**, then returns this origin as its redirect. Do not
attempt a client-side sign-out here; see the Firebase note above.

### Endpoints this site must never call

`/api/talent`, `/api/agency`, `/api/internal`, `/api/reply` (all origin-guarded
and app-only), `/stripe/*`, `/api/migrate*`.

### Possibly vestigial

`lib/pholio-auth/broadcast.ts` listens on a `BroadcastChannel("pholio-auth")`.
No publisher was found anywhere in pholio-app, so the channel may be dead. What
actually keeps session state fresh is the provider's 60-second poll plus refresh
on focus and visibility change. Verify before relying on the channel; delete it
if it is confirmed dead.

---

## 3. CTA destinations

Built from `PHOLIO_APP_ORIGIN` (`lib/pholio-app-origin.ts`).

| Purpose | Path |
|---|---|
| Sign in | `/login` (supports `?next=<path>` and `?force=1`) |
| Get scouted / sign up | `/onboarding` |
| Studio+ signup | `/signup?plan=studio` → redirects to `/onboarding?plan=studio` |
| Talent dashboard | `/dashboard/talent` |
| Agency dashboard | `/dashboard/agency` |
| Public portfolio | `/portfolio/:slug` |

**`${APP}/agency/register` does not exist and never has.** The old site's
`/agency` page linked to it and shipped a 404 for months. Do not recreate it —
agencies go through `/agency/request-access` on *this* site.

---

## 4. Versioned contracts

Three constants must be changed in both repos or not at all.

### Legal version — the dangerous one

`CURRENT_LEGAL_VERSION` in `lib/legal-constants.ts` (currently `2026-07-18`)
mirrors `pholio-app/src/shared/lib/legal-versions.js`. The app gates every
user's acceptance on its copy and re-prompts everyone when it changes.

Revising Terms, Privacy, or any incorporated document requires **all three**:

1. bump `CURRENT_LEGAL_VERSION` here,
2. bump the app's copy to match,
3. add a plain-language `TERMS_CHANGELOG` entry in the app.

Skipping 2 and 3 is exactly how the 2026-07-18 revision shipped while the app
kept recording acceptance against 2026-06-25: nobody was re-prompted, and the
acceptance audit trail pointed at a version that was no longer served. Editing
document *content* without bumping the version has the same effect.

A test in the app (`tests/shared/legal-versions.test.js`) fails without the
changelog entry.

### Cookie consent

`lib/cookie-consent.ts` must stay byte-compatible with four implementations
across the two repos:

```
name:     pholio_consent
version:  1
payload:  { v: 1, necessary: true, analytics: boolean, updatedAt: ISO8601 }
attrs:    path=/  max-age=31536000  samesite=lax  [domain=.pholio.studio]  [secure]
legacy:   pholio_cookie_consent_v1  (localStorage, read-once migration)
```

The domain is derived from `window.location.hostname` so preview deploys stay
host-only. The app reads this cookie server-side to gate portfolio analytics.

Consent must be as easy to withdraw as to give — hence a real control on
`/cookies#preferences`, not a link to a policy page.

### Studio+ pricing

`lib/marketing-pricing.ts` mirrors `pholio-app/src/shared/lib/billing-plan.js`:
**$9.99/month, $95.88/year ($7.99/month equivalent), 14-day trial.**

The app carries a separate `billingDisclosureVersion` (`2026-06-25`) that this
site does not mirror. On the wire the tier is `subscription.isPro`; there is no
`STUDIO+` role. **Roles are exactly `TALENT` and `AGENCY`.**

---

## 5. The one write path

`POST /api/public/agency-access-requests` — see `lib/agency-access-request.ts`.

Rate-limited server-side (60s window, 15/min serverless, keyed by session user
or client IP). Stores agency and requester metadata only: no roster files, no
talent data, no contracts, no billing data, no minor-specific records.

**201 and 202 are both success.** 202 means a request from that email is already
open. The server is deliberately idempotent and does not disclose the duplicate,
so present both identically — a "you already applied" state would leak which
addresses are in the pipeline.

Option vocabularies (agency types, boards, size ranges, use cases) are defined
client-side; the endpoint accepts free strings. Changing a label changes what
lands in the database and nothing will warn you.

There is **no waitlist, newsletter, contact-form, or scouting-submission
endpoint** anywhere in either repo. The old site's contact page was `mailto:`
links. Any of those features has to be built from scratch on one side or the
other.

Other public endpoints that exist and have no caller here:

- `GET /api/public/home` — the sanctioned source of real talent imagery. Every
  row is gated through `isPubliclyExposable()`, which excludes minors. If a
  section wants real talent photos, use this; do not query anything else.
- `GET /api/public/pro` — comp-card themes, free vs Studio+.
- `GET /api/public/languages`.

---

## 6. Environment

| Var | Set where | Meaning |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | here (`netlify.toml`) | app origin every CTA links to |
| `APP_BACKEND_URL` | here, optional | `/api/*` proxy target; defaults to `localhost:3000` in dev |
| `MARKETING_SITE_URL` | app | logout redirect, `/partners` handoff, origin allowlist |
| `COOKIE_DOMAIN` | app | `.pholio.studio` in prod |

**Never carry into this repo:** `NEXT_PUBLIC_FIREBASE_*`, any `DATABASE_URL`,
`STRIPE_*`, `GROQ_API_KEY`, `OPENAI_API_KEY`, `R2_*`, `SMTP_*`.

> The old repo's `.env.local` contained live Firebase credentials for project
> `pholio-bc5ab` that no code read. It was not copied here. Those credentials
> should be rotated and removed from the old repo.

---

## 7. Product and compliance facts that constrain copy

Load-bearing, all traceable to app code. Getting these wrong in marketing copy
is a legal problem, not a tone problem.

- **Pholio is not an agency and does not represent talent.**
- **Pholio does not charge agencies** and runs no commission workflow. Revenue
  is one talent subscription: Studio+.
- **A paid plan never buys review, selection, representation, or booking.**
- **"Recipients", not "agencies".** Since 2026-07-18 the Terms cover agencies,
  casting organizations, event producers, brands, and other clients
  collectively as Recipients. Copy that says "agencies" understates who
  receives a submission.
- **Minimum age 13; under 18 requires guardian authorization.** A self-reported
  date of birth is explicitly not verification. Minor profiles are never
  publicly exposable, sensitive measurements are suppressed, and submissions
  from minors are redacted to an age band with contact routed through Pholio.
- **AI is opt-in and separately disclosed.** Image analysis and profile
  embeddings are distinct activities, both off by default, both requiring an
  adult talent's separate opt-in in Settings. The Privacy Policy is explicitly
  not consent to them. `/ai-notice` is required and is linked from every
  transactional email.
- **Submission economics:** 5 discovery submissions per calendar month (UTC) on
  free accounts; open-call submissions do not count against that and are capped
  at 3/month; Studio+ removes the discovery limit; packages retained up to 24
  months; withdrawal revokes access and redacts the snapshot but cannot recall
  copies an agency already downloaded.
- **Named subprocessors** committed to in the Privacy Policy: Firebase/Google,
  Stripe, Groq, OpenAI, Cloudflare, Neon, Netlify, ipapi.co, plus the email
  provider. Adding a vendor is a privacy-policy change, which is a legal-version
  change.
- **`COMPANY_ADDRESS` is deliberately empty.** A postal address must not be
  fabricated in a public legal document. Leave it blank until counsel supplies
  the service address. Entity: Pholio Studio.

---

## 8. Do not read `.pholio-landing-ref/`

`pholio-app/.pholio-landing-ref/` is a full checkout of the *old* marketing
site, last touched in March. Nothing imports from it. It is stale by months and
is a reliable source of wrong answers.
