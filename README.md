# Pholio — public site

The public site for [Pholio](https://www.pholio.studio): marketing surfaces and
the legal corpus. Next.js 16 (App Router), TypeScript, Tailwind v4, Framer
Motion.

The product itself — API, dashboards, database — lives in the separate
`pholio-app` repository.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3001
```

Port 3001 is deliberate: `pholio-app`'s Express backend owns 3000, and this
site proxies `/api/*` to it.

```bash
npm run typecheck
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` if you need to point at a local app backend.
Nothing is required for the site to run standalone.

## What is here

Eight legal documents, the header, and a placeholder home page. The rest of the
marketing site is being rebuilt from a clean slate.

```
app/            routes only — (legal)/ route group, / placeholder
components/     header/ and legal/ are preserved surfaces; new sections go here
lib/            cross-repo contracts, nav model, config
docs/           design language and integration contracts
```

## Documentation

- **[AGENTS.md](AGENTS.md)** — start here. Boundaries, structure, conventions.
- **[docs/design-language/](docs/design-language/)** — foundations, preserved
  surfaces, banned patterns, scroll craft.
- **[docs/app-integration.md](docs/app-integration.md)** — the cross-repo
  contracts: auth, cookies, legal versioning, the one write path.

## Deployment

Netlify, `@netlify/plugin-nextjs`, Node 20. `NEXT_PUBLIC_APP_URL` is set at
build time in `netlify.toml` and must also be set in the Netlify UI.

## Known outstanding

`/agency/request-access` does not exist yet and `pholio-app` redirects to it
from `/partners`. Its API contract is preserved in
`lib/agency-access-request.ts`. See
[docs/app-integration.md](docs/app-integration.md) §1.
