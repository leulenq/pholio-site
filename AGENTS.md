# AGENTS.md

Operating contract for anyone — human or agent — working in this repo.

This is the **Pholio public site**: `www.pholio.studio`. Marketing surfaces and
the legal corpus. Nothing else.

---

## Read this before your first edit

| If you are… | Read |
|---|---|
| Building anything visual, ever | [`lessons.md`](lessons.md), then [`docs/design-language/03-banned-ui.md`](docs/design-language/03-banned-ui.md) |
| Building a scroll-driven section | [`docs/design-language/04-scroll-craft.md`](docs/design-language/04-scroll-craft.md) |
| Touching auth, cookies, legal constants, `next.config.ts`, or any `/api` call | [`docs/app-integration.md`](docs/app-integration.md) |

`lessons.md` is corrections the site's owner has already made, in their own
words. It is short, it is not theory, and every entry exists because an agent
got that exact thing wrong. Read it first: the ban list tells you what not to
build, `lessons.md` tells you what has already been built wrong here.

Do not skim the ban list. It is the anti-slop list for a **public site** Most of the entries are the default output
for their category, which means they are what you will produce if you do not
check. Violating one requires human approval.

Its §12 is a mechanical pre-flight. Run it before calling a page done.

---

## Repo boundaries

- **This repo** (`pholio-site`): public site and legal pages
- **`pholio-app`** (`/Users/lenquanhone/Projects/pholio-app`): the product —
  Express API, React SPA, database, dashboards. Never put marketing or legal
  pages there; never put dashboard or API logic here.

This site has **no database, no email sender, no auth UI, and no server routes**
beyond Next's own. It has exactly one write path to the app
(`lib/agency-access-request.ts`). Keep it that way — if you are reaching for a
DB client or a Firebase SDK here, the work belongs in `pholio-app`.

---

## Structure

```
app/                      routes only — page.tsx, layout.tsx, metadata
  (legal)/                route group: shared cream shell, no URL segment
  page.tsx                placeholder home (scaffolding — delete when / is built)
components/
  header/                 preserved: the Index header, gold sweep, wordmark
  legal/                  preserved: document chrome and the eight documents
  <section-name>/         new work — one folder per section
lib/                      contracts, config, data. No JSX.
docs/                     design language and cross-repo contracts
public/                   static assets
```

Conventions:

- **`app/` holds routes and nothing else.** A page assembles sections; it does
  not implement them.
- **Colocate.** Everything a section needs lives in its folder.
- **Server Components by default.** `"use client"` only where there is state,
  an effect, or a browser API — and then at the leaf, not the page.
- **Route groups** (`(name)/`) for shared layout without a URL segment.
- **No barrel `index.ts` re-export files** except where a variant registry
  genuinely needs one (`components/header/index.tsx`).
- **`lib/` is JSX-free.** If it renders, it is a component.

---

## Adding a page

1. Build it under `components/<name>/`, mounted by `app/<route>/page.tsx`.
2. Export `metadata` from the page (title, description).
3. **Flip `built: true` in `lib/marketing-nav-links.ts` in the same commit.**
   That file is the single source for the header index; unbuilt routes do not
   render, which is why the index can never link to a 404.
4. If the page is the home hero, put `data-hero-chrome` on an element inside its
   `<section>` or the header will never reveal.
5. Give the section an opaque background so the header's polarity sampler can
   read it.

---

## Verification

```bash
tmux new-session -d -s dev "npm run dev"   # a hook blocks bare `npm run dev`
npm run typecheck                           # tsc --noEmit
npm run lint
npm run build
```

Dev server runs on **:3001** (the app's Express backend owns :3000).

Notes:

- Next dev HTML always contains the string `Error:` from overlay boilerplate.
  Grep for `failed to compile`, `module not found`, or `unhandled runtime`
  instead.
- `npm run lint` currently reports **6 warnings, 0 errors**. They are documented
  known debt in `eslint.config.mjs`. Do not add new ones and do not silence the
  rule further.
- ESLint is pinned to 9.x. `eslint-config-next`'s bundled `eslint-plugin-react`
  crashes on ESLint 10; the failure mode is a confusing stack trace, not a
  version error.
- **This is scroll-tied animation. Typecheck is not verification.** Confirm in a
  browser, at more than one viewport width, with reduced motion on and off.

---

## Working style

**Do not re-derive values that are written down.** The wordmark's weight and
tracking, the gold sweep's gradient, the legal version, the cookie payload — all
have exact recorded values with sources. Reconstructing them from general brand
notes produces plausible wrong numbers, and has.

**Distinguish content from chrome in the legal pages.** The words are versioned
and gate user acceptance across two repos. The layout is not. Changing a
sentence is a compliance event; changing a margin is not.

**When a rule blocks you, change the rule in the doc first, with a reason.**
Silently diverging from a written rule is how the previous site accumulated the
contradictions that made this reset necessary.

**Say what you did not do.** If part of a task is blocked, finish everything
else and state plainly what is outstanding.
