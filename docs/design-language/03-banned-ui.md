# Banned UI patterns

**This is the only document carried across from the previous site's writing.**
Everything else in `docs/` was written from scratch. This list survived because
it encodes decisions that were made once, argued about, and should not be
re-litigated by whoever touches the codebase next.

Source of record: `pholio-app/DESIGN.md` ("Global banned AI-generated UI
patterns", 14 items) and the matching list in `pholio-app/CLAUDE.md` /
`pholio-app/AGENTS.md` (16 items). The two overlap heavily; they are merged
below and adapted where a public marketing site legitimately differs from a
product dashboard. Where this file and pholio-app disagree, §B says so
explicitly rather than quietly diverging.

**Violating any of these requires explicit human approval and a design
discussion first.** "The brief seemed to call for it" is not approval.

---

## A. The list

### Labels and badges

1. **No eyebrow or kicker text above a headline.** Any small uppercase or
   letter-spaced label sitting above a heading — `*-eyebrow`, `*-kicker`, a
   `kicker=` prop. Use the heading alone.
2. **No pill-chip version of the eyebrow.** Same pattern rendered as a rounded
   pill above a title.
3. **No hero eyebrow in any form.** A tiny label above an oversized hero
   headline is the most recognisable AI-landing-page tell in existence.
4. **No New / Beta / Live / AI-powered badges.** No floating chip declaring a
   feature's tier or freshness.
5. **No status badge pills** in green / yellow / red, and no coloured dot that
   encodes availability state. Show status as plain text.
6. **No accent dot paired with a badge.** Dot-plus-pill combinations as
   decorative metadata.
7. **No tiny metadata chips in card or image corners.** Render a score, type, or
   tag as plain text inline.
8. **No count bubbles** attached to nav items, tabs, or cards.
9. **No decorative pulsing or animated status dots.** A coloured dot next to
   "Live" or "Strong profile" is ornament, not information.

### Surfaces and colour

10. **No glassmorphism.** No `backdrop-filter` on cards, panels, buttons,
    toolbars, or inputs. It is permitted only on a full-screen functional scrim
    (`position: fixed; inset: 0`) where it is a dimmer, not a style.
11. **No gradient text.** No `background-clip: text`, no rainbow fill. Use
    typography, spacing, and one solid accent.
12. **No coloured side-stripe borders wider than 1px** on cards, rows,
    callouts, or alerts.
13. **No over-rounded generic surfaces.** No 24px+ rounded cards, sections, or
    inputs unless a scoped design file explicitly calls for that shape.
14. **No SaaS gradients** as section backgrounds, and no accent colour outside
    the three-colour palette. Terracotta, purple, electric blue — all off-brand.
    See [`01-foundations.md`](01-foundations.md) §1.

### Layout

15. **No generic identical card grids** — icon + heading + paragraph repeated
    three or four across as filler. Every panel earns its structure from real
    content. This is the default shape of a generated "features" section and it
    is banned outright.
16. **No decorative AI-dashboard ornament**: blobs, orbiting particles,
    diagonal stripe backgrounds, floating gradient orbs.
17. **No div-based fake product screenshots.** A "product preview" built from
    rectangles, fake task lists, and fake dashboards is a tell. Show the real
    product or show nothing.

### Behaviour

18. **No draggable or resizable textareas.** Always `resize: none`.
19. **No static, lifeless talent-facing surfaces.** Motion must be purposeful
    and must have a reduced-motion fallback.
20. **No over-choreographed page-load sequences** on utility or conversion
    surfaces. Motion supports state; it is not spectacle.

### Content and voice

21. **No emoji.** In code, markup, copy, or alt text. Use a drawn glyph or
    nothing.
22. **No em-dashes in published page copy.** The strongest tell of
    machine-written text. Use a period or a comma. (Engineering docs like this
    one are exempt.)
23. **No scroll cues.** "Scroll", "↓ scroll", "Scroll to explore", animated
    mouse-wheel icons. If someone has not scrolled yet, they are looking at the
    hero. They know what scroll is.
24. **No section-number eyebrows.** `00 / INDEX`, `001 · Capabilities`,
    `06 · How it works`. Name the topic in plain language or say nothing.
    (A mono ordinal *inside* a heading, as the legal documents use, is fine —
    it numbers a real list. The ban is on decorative enumeration.)
25. **No version labels or build strings** on marketing pages. `v1.4.2`,
    `BETA`, `EARLY ACCESS`, `last sync 4s ago`.
26. **No atmospheric locale / time / weather strips.** "Lisbon 14:23 · 18°C" in
    the nav, "ESTD. 2018" in the footer. A real contact address is fine; a
    decorative one is a portfolio-site cliché.
27. **No generic placeholder names.** No "Jane Doe", no "Sarah Chan". Talent on
    this site are real people or clearly-labelled demo identities.
28. **No urgency or scam-adjacent modelling-site tropes.** "Limited spots",
    "Apply now before…", vague trust adjectives ("secure", "trusted"), or any
    implication that payment buys visibility. A large share of this site's
    audience has been burned by exactly those sites. Say the falsifiable thing
    instead.

---

## B. Where this site differs from pholio-app, and why

Two items in pholio-app's list are scoped to product surfaces and are
deliberately *not* applied wholesale here. Both differences are intentional.
Do not "fix" them; do not widen them either.

**Grain.** pholio-app bans "fake grain" as dashboard ornament. This site uses
grain as print texture — it is part of the paper metaphor, it appears on the
legal documents and the index panel, and it is ported from the app's own
`TalentLayout.css`, which runs it at 0.028. **Capped at 0.03 opacity here.**
Above that it stops reading as stock and starts reading as an effect, at which
point the app's ban applies with full force.

**Pill-shaped controls.** pholio-app's talent dashboard explicitly uses
pill-shaped controls. This site does not: no pill buttons, no pill chips, no
`rounded-full` on anything but an avatar. Prominence here comes from colour, not
shape (foundations §5), so there is no CTA that needs a pill to be found.

---

## C. Why lists like this exist

A ban list is not a style preference. Each item is a pattern that a language
model will reach for by default because it is over-represented in training data,
and each one makes the page look like every other page in its category. The
brand's whole proposition is that Pholio does not look like a template. The list
is the cheapest way to hold that line.

If you find yourself wanting an exception, the useful question is not "is this
one okay?" but "what is the specific thing this page is trying to say, and is
there a way to say it that is not the default shape?" There almost always is,
and it is almost always better.
