# Preserved surfaces

Four surfaces were carried across from the previous marketing site. Everything
else was left behind. These four are the entire inherited design vocabulary, so
the values in this file are load-bearing: [`01-foundations.md`](01-foundations.md)
is derived *from* them, not the other way round.

Two of them are not marketing-site inventions at all — the wordmark and the gold
sweep are copied from pholio-app's talent dashboard. Read the exact values here
rather than re-deriving them from general brand notes. Re-derivation has
produced plausible but wrong numbers more than once (weight 600 instead of 400,
0.3em tracking instead of 0.2em, a feathered gradient instead of a solid one).

---

## 1. The header — "The Index"

`components/header/VariantIndex.tsx` · machinery in `components/header/kit.tsx`

### What it is

At rest there is no header. Two marks sit in the page's top margin: the wordmark
at left, an `INDEX` trigger at right. Opened, it is not a menu but an index
page — a full-height ink field with serif entries and a clerical column.

The thesis: on a site whose main surfaces are scroll-driven scenes, any
persistent bar is a rectangle sitting on someone's photograph. So the header
gets out of the way, and spends all its brand weight in one place that has room
to be good.

### Rules it keeps, that any change must respect

**No glass.** No `backdrop-filter`, no translucency. When the header needs a
backing it takes the page's own paper colour, opaque — the *sampled* colour, not
the polarity token, because `/agency` was `#08080c` rather than `#050505` and the
difference read as a seam. Blur only ever existed to rescue a boxed header
floating over imagery. Don't reintroduce the box.

**Gold is a state.** Live route, action, sweep, hover. No filled gold shape
larger than a word, no conic borders, no shimmer.

**Prominence is colour, never scale.** `ActionLink` ("Get scouted") is the same
10px as its muted siblings. See foundations §5.

**Nav is not flat.** `TALENT` and `AGENCIES` are audience *doors*; `STUDIO+` is
a *tier*. `NavEntry.kind` in `lib/marketing-nav-links.ts` carries that
distinction and the header expresses it.

**The band's geometry never changes on scroll.** Only the paper under it fades
in. Nothing shifts as you scroll.

**It samples the paper under the bar** and flips polarity mid-scroll. Route
theme is only the starting value. See foundations §3.

**The mobile hamburger → full-screen serif index is the pattern that worked.**
It was promoted to the whole system, so there is one navigation pattern rather
than a desktop bar plus a phone sheet.

### The reveal gate — read this before reporting a missing header

`homeHeaderRevealed()` in `kit.tsx` hides the header on `/` until the hero has
largely left the viewport. It measures the `<section>` containing an element
marked `[data-hero-chrome]`, and **falls back to one full viewport of scroll if
that marker is absent.**

So: a home page with no hero and no scroll never reveals the header at all. That
is true of the current placeholder `/` and it is correct there. It is also the
easiest way to accidentally ship a page with no visible navigation. If the
header is missing, check for the marker first.

### The wordmark

Ported from pholio-app. `.tl-logo-word` in
`client/src/shared/layouts/TalentLayout/TalentLayout.css` and
`.apply-workspace-logo span` in
`client/src/domains/talent/pages/ApplyPage/ApplyExperience.css`.

| Property | Value |
|---|---|
| Family | Noto Serif Display |
| Weight | **400** (not 600) |
| Size | **24px** in the header |
| Letter-spacing | **0.2em** |
| Case | uppercase |
| Colour | gold — `#C9A55A` on ink, `#A8894E` on cream |
| line-height | 1 |

Implemented as `Wordmark` in `kit.tsx`. It carries a negative right margin of
`-{tracking}em` to cancel the trailing gap that letter-spacing adds after the
final O, so the mark optically aligns with whatever sits to its right. Keep
that.

`Wordmark`'s prop default is `size = 15`; call sites pass an explicit size. The
header passes 24 to match the app.

### The gold sweep

Ported from `.apply-workspace-top::after` in `ApplyExperience.css`, which closes
the app's `/apply` workspace topbar this exact way.

```css
height: 1px;
background: linear-gradient(to right, transparent, #C9A55A, transparent);
pointer-events: none;
```

Solid gold at the centre, transparent at both edges. **No alpha-stepped stops,
no feathering, no narrow clamp band.** Implemented as `GoldSweep` in `kit.tsx`,
defaulting to the fixed brand gold rather than a paper-tracking token so the
match holds on cream pages too.

It is a band closer. Use it where a publication band begins or ends. Do not use
it as a decorative divider between paragraphs.

---

## 2. The header index panel

`IndexTrigger` + `IndexPanel` in `kit.tsx`

The opened state. A solid `#050505` field with grain at 0.05, serif entries at
`clamp(2.4rem, 5.4vw, 4.4rem)` separated by hairlines, and a clerical column
(`More` / `Account`) beside them on desktop, below them as a two-up grid on
mobile.

Details worth preserving:

- **Entries are upright, never italic.** The italic is the headline's verdict
  move and does not also get to mean "hovered". Hover is a colour change to
  gold.
- **Entries stagger in at 0.055s intervals**, skipped under reduced motion.
- **The clerical pair follows the index at a fixed gap**, not `mt-auto`, so
  `More` and `Account` sit high on the sheet rather than pinned to the bottom.
- **Scroll is locked while open** (`useScrollLock`).
- The panel supplies its own field, so the header's sampled paper is suppressed
  while it is open.

### The nav is driven by a build flag

`lib/marketing-nav-links.ts` declares every route the site intends to have, with
`built: boolean`. Only `built: true` entries render. During the rebuild most are
false, so the index legitimately renders short or empty.

**Ship the page and flip the flag in the same commit.** That is the whole
protocol, and it is why the index can never link to a 404.

---

## 3. The legal documents

`app/(legal)/` · `components/legal/` · `lib/legal-constants.ts`

Eight documents: Terms, Privacy, Cookies, Copyright (DMCA), AI Notice, Community
Guidelines, Take It Down, and the Submission Programme Notice.

These are the site's only finished pages, and four of them are hard dependencies
of pholio-app. See [`../app-integration.md`](../app-integration.md) before
touching anything here.

### Content versus chrome

**The words are versioned. The layout is not.**

`CURRENT_LEGAL_VERSION` in `lib/legal-constants.ts` gates user acceptance in
pholio-app. Editing a sentence in a `*Content.tsx` file re-prompts every user
and requires a matching bump in `pholio-app/src/shared/lib/legal-versions.js`
plus a changelog entry. Editing `LegalDocumentLayout.tsx` does not.

Keep that line clean: change how a document reads, never what it says.

### The reading surface

This is the site's one long-form surface and therefore the one place the type
scale is a real scale rather than the header's two hard registers:

- Cream paper with grain, `max-w-3xl`, `pt-40` to clear the header band.
- H1 at `text-5xl md:text-7xl`, serif. **No eyebrow above it** — the document's
  title is its own label.
- Section headings at `text-2xl md:text-3xl` with a mono ordinal in gold.
- Body at 16px, `text-[#050505]/75`, real leading.
- Dates set in the clerical mono voice, because they are clerical data.
- Contents block bounded by 1px rules, not a card.
- Statutorily conspicuous text (the all-caps arbitration and warranty clauses)
  gets warm paper `#F5F0E8`, a hairline, and square corners.

### What was fixed during the reset

`LegalDocumentLayout.tsx` shipped with four violations of the ban list, and
`TermsContent.tsx` was a 250-line copy of the same chrome carrying the same
four. Both were corrected; the document text was not touched, and
`TermsContent` now renders through the shared layout.

| Was | Now | Why |
|---|---|---|
| `bg-white/40 backdrop-blur-sm` on the contents block | 1px rules, no fill | Glassmorphism is banned |
| `rounded-2xl` / `rounded-lg` | square | Over-rounded generic surfaces are banned |
| `border-l-2 border-[#C9A55A]/30` | 1px neutral rule | Coloured side-stripes wider than 1px are banned |
| `Legal & Compliance` eyebrow above the H1 | removed | Eyebrows above headings are banned |
| Body at `/65`, copyright at `/30` | `/75` and `/60` | ~2:1 contrast, below the 4.5:1 floor |

---

## 4. The preloader

`components/Preloader.tsx`

An ink curtain that plays once, then lifts. Currently mounted only on `/`.

| Beat | Timing |
|---|---|
| Letters rise and fade in | 0.15s delay, 0.08s stagger, 0.6s each |
| Gold sweep underline draws to 120px | 0.8s delay, 0.8s |
| Curtain holds | until 1800ms |
| Curtain fades out | 0.7s, `cubic-bezier(0.76, 0, 0.24, 1)` |
| `onComplete` fires | at 400ms into the exit, not at its end |

Two details that are easy to break:

**`onComplete` deliberately fires early**, 400ms into a 700ms exit, so the
curtain's fade-out overlaps the content's fade-in. Move it to the end and you
get a dead frame of pure black between the two.

**Reduced motion collapses the hold to 100ms**, not to zero, and the entrance
animations are skipped rather than sped up.

The composition itself: `#050505` field, a radial gold glow at 0.04 opacity, the
wordmark letter-by-letter in Noto Serif Display 400 at 0.2em tracking, and the
gold sweep beneath it. The exit curve is the site's one documented exception to
the single ease — a curtain leaving is not an arrival.

> The preloader's gold was `#C8A96E` and is now `#C9A55A`, matching the header.
> Two golds a page apart is exactly the drift the three-colour rule exists to
> prevent.
