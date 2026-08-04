# Foundations

The design language of the Pholio public site, derived from the four surfaces
that survived the reset. Nothing here is aspirational — every rule below is a
description of something already implemented in `components/header/`,
`components/legal/`, or `components/Preloader.tsx`. Read
[`02-preserved-surfaces.md`](02-preserved-surfaces.md) for the surfaces
themselves.

If you are about to write a new section and it contradicts something here, the
rule wins, or you change the rule in this file first and say why.

---

## 0. The one-sentence version

**An editorial publication that behaves like a physical object: continuous
paper, hairline furniture, two type registers, one accent that is a state and
never a surface, and motion that only ever means arrival.**

---

## 1. Palette — three colours

| Token | Hex | What it is |
|---|---|---|
| `--color-velvet` | `#050505` | The ink field. The document canvas. |
| `--color-ink` | `#0F172A` | Type set on cream. |
| `--color-cream` | `#FAF7F2` | The paper field. |
| `--color-cream-warm` | `#F5F0E8` | A second paper, for insets on cream. |
| `--color-gold` | `#C9A55A` | The state colour, on ink. |
| `--color-gold-dark` | `#A8894E` | The same state colour on cream. |
| `--color-gold-light` | `#D4BC8A` | Hover lift on ink only. |

Three colours means three. A fourth accent is a brand decision made by a human,
not a styling decision made mid-section. There are no semantic colours — no
success green, no error red. State is carried by words and position.

**Gold on cream must be `#A8894E`.** `#C9A55A` manages roughly 2:1 against
`#FAF7F2` and disappears. This is the single most common palette mistake on this
site; `Wordmark` and `NavLink` already switch automatically via the field
tokens, so use those rather than hardcoding.

> **Known ambiguity.** pholio-app disagrees with itself on the wordmark's rest
> colour: `.tl-logo-word` resolves to `#C8A96E`, `.apply-workspace-logo span` to
> `#C9A55A` (going to `#C8A96E` only on hover). This site uses **`#C9A55A`**
> everywhere. Do not "fix" one to match the other without a decision.

### Contrast floor

Every resting value clears **4.5:1** against its own field. Not the value it
animates to — the value it sits at. The old site's legal pages ran body copy at
65% and a copyright line at 30% opacity on cream, roughly 2:1. Muted is a
relationship between two live values, not a low number.

Practical floors used by the shipped code: on ink, body ≥ `rgba(250,247,242,0.75)`
and labels ≥ `0.55`; on cream, body ≥ `rgba(5,5,5,0.75)` and labels ≥ `0.55`.

---

## 2. Type — three voices, two registers

| Voice | Face | Job |
|---|---|---|
| Display | Noto Serif Display 400 | Headlines, the wordmark, the verdict italic |
| Clerical | Inter | Body copy, navigation, labels |
| Data | JetBrains Mono | Numbers, timestamps, section labels, measurements |

### The two registers

Look at what the header actually does. It contains type at **9–11px** (mono and
sans caps, tracked 0.18–0.28em) and type at **clamp(2.4rem, 5.4vw, 4.4rem)**
(serif, tracked −0.025em). There is nothing in between. That is not an accident
and it is the site's strongest typographic signature:

- **Clerical register (9–13px).** Labels, nav, metadata, captions. Uppercase,
  wide tracking, mono or sans. This register carries information.
- **Display register (2rem+).** Headlines and the index. Serif, tight tracking,
  leading collapsed to ~1.05. This register carries conviction.

**The 16–20px "supporting paragraph" is the enemy.** A headline followed by two
lines of mid-grey 18px body is the single most template-looking thing a page can
do, and it is what most sections default to. If a section needs a sentence, give
it one sentence and set it at display scale or clerical scale — pick a side.

The long-form legal documents are the deliberate exception: they are a reading
surface, so they run a real body size (16px) at a real measure (max-width 3xl).
That exception does not extend to marketing sections.

### The verdict

**One italic-gold word per headline. Never two.**

```tsx
<h2 className="font-editorial">
  Built for talent.{" "}
  <span className="font-editorial-italic" style={{ color: "#C9A55A" }}>
    Trusted
  </span>{" "}
  by agencies.
</h2>
```

The italic is the verdict — the word the sentence turns on. If two words are
both the verdict, neither is. The italic never also means "hovered", "active",
or "emphasised"; it has exactly one job.

---

## 3. Field, not theme

**The site is one continuous run of paper, not a stack of themed pages.**

The header proves it: `useFieldPolarity` samples the actual background colour
under the bar on every scroll frame and flips the header's ink/cream polarity to
match. The route's declared theme is only the starting value, used to avoid one
frame of the wrong polarity before the first sample lands.

Consequences for anything you build:

- A section owns its paper. Sections may alternate ink and cream freely down a
  page; the chrome adapts.
- Never build "the dark page" and "the light page" as separate design systems.
  There is one system with two polarities, expressed as `TOKENS.ink` and
  `TOKENS.cream` in `components/header/kit.tsx`.
- If the header goes the wrong colour over your section, your section's
  background is not opaque or is mid-fade. The sampler needs an effective alpha
  ≥ 0.85 to read it. That is a bug in the section, not in the header.

---

## 4. Furniture

The site builds structure from four things and nothing else.

**Hairlines (1px).** `Rule` in the header kit is described in its own source as
"the header's only container." Hairlines organise *within* a group. They are
neutral (`rgba(…, 0.10–0.20)`), never coloured, never thicker than 1px.

**Negative space.** Space separates *between* groups. The discipline is:
hairlines inside, air outside. Reaching for a bordered box to group three items
means the spacing failed.

**The gold sweep.** A 1px hairline,
`linear-gradient(to right, transparent, gold, transparent)`. Solid gold at the
centre, transparent at both edges. No alpha-stepped stops, no feathering, no
narrow clamp band. It is a **band closer** — it marks the boundary of a
publication band. The header band ends on it; the preloader's wordmark sits on
it. Ported verbatim from `.apply-workspace-top::after` in pholio-app.

**Grain.** `fractalNoise` SVG at **≤0.03** opacity over a field. At that
strength it reads as paper stock. Above it, it reads as an effect, and
pholio-app bans decorative grain on product surfaces for exactly that reason.

There are no cards. There are no shadows. There is no elevation model.

---

## 5. Gold is a state, not a surface

Gold marks: the live route, the primary action, the sweep, and hover.

Gold is never: a filled shape larger than a word, a button background, a
gradient, a border on a container, a shimmer, or a permanent rule under a CTA.

### Prominence is colour, never scale

The header's primary action (`ActionLink`) is **the same 10px** as the muted
nav links beside it. It is prominent because it sits at full-strength text
colour and weight 600 while its siblings sit at 58% and weight 500. That is the
entire mechanism.

This bans the standard CTA button. If something needs to be the most important
element in a composition, it gets full-strength colour and the position that
earns it — not a larger font and not a filled rectangle.

---

## 6. Motion is arrival

**One ease: `cubic-bezier(0.22, 1, 0.36, 1)`**, exposed as `--ease-arrival` and
as `EASE` in the header kit. Things decelerate into place. They do not bounce,
overshoot decoratively, or ease in.

The one documented exception is the preloader's *exit*, which uses
`cubic-bezier(0.76, 0, 0.24, 1)` — a symmetric curve, because a curtain leaving
is not an arrival.

Rules:

- **Hover is a colour shift and a 1px rule. Never a scale, never a shadow.**
- **Nothing reflows on scroll.** The header's own comment: "The band's geometry
  never changes — only the paper under it fades in." Animate `opacity` and
  `transform` only. This is simultaneously the aesthetic rule and the
  performance rule.
- **No looping animation.** Nothing shimmers, pulses, floats, or breathes on a
  timer. Motion is triggered by arrival or by intent, then it rests.
- **`useReducedMotion()` is mandatory**, and the fallback must be a real static
  composition. A 0.01s version of a scrub is not a fallback. The preloader
  models this correctly: 1800ms becomes 100ms and the stagger is skipped.

Timing that the shipped surfaces use, as a reference: colour transitions
0.24–0.36s, rules drawing in 0.42s, panels 0.30–0.50s, staggers 0.055–0.08s per
item.

---

## 7. Composition

**Asymmetry is the default.** The header is a wordmark hard left and a trigger
hard right with nothing in the middle. The index panel is a `1.5fr / 1fr` grid.
Centred, evenly-divided layouts are what make a page look generated.

**Anchor to the page edges, not to a centred column.** The header uses
`max-w-[1440px]` with `px-6 md:px-12`. Long-form reading is the exception and
uses `max-w-3xl` centred, because a 90-character measure is unreadable.

**Every section needs one idea.** Not a headline plus an explainer paragraph
plus three feature bullets. One idea, one composition, one moment.

---

## 8. Copy

- **Withheld.** One headline and one sentence per beat. The imagery persuades.
- **Falsifiable over adjectival.** "Applying is free" beats "trusted and
  secure". Say the checkable thing.
- **Mono micro-labels carry the clerical layer** — but see the ban on eyebrows
  in [`03-banned-ui.md`](03-banned-ui.md): a mono label sitting above a headline
  as decoration is banned. A mono label naming a real data point is not.
- **No em-dashes in body copy.** They are the strongest tell of machine-written
  text. Use a period or a comma. (Em-dashes inside these engineering docs are
  fine; the ban is on published page copy.)
- **Never write "agencies" where the contract says "Recipients".** Since the
  2026-07-18 terms revision, submissions may go to agencies, casting
  organizations, event producers, brands, and other clients, and the legal
  documents call all of them Recipients. Marketing copy that says "agencies"
  understates who receives a submission.

---

## 9. Accessibility is not a pass at the end

- Contrast floor of 4.5:1 on resting values (§1).
- `prefers-reduced-motion` honoured in every animated component (§6).
- No content gated behind a scroll-triggered reveal. If the animation never
  fires, the words are still there.
- Semantic headings in order. The header index is a `<nav>`; documents are
  `<article>` with real `<section>` elements.
- Alt text on every image. Decorative furniture gets `aria-hidden`.
- Focus is always visible. The kit uses `focus-visible:underline` rather than a
  ring on type, and a real ring on controls.
