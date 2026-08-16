# Banned UI — the anti-slop list

**Scope: the public site.** Marketing pages, the home page, audience pages,
legal documents. This is not the dashboard list — `pholio-app` keeps its own,
tuned for dense product surfaces, and only a handful of its rules are repeated
here because they happen to also be brand rules.

## Why this document exists

Language models converge. Trained on the whole web, they reach for whatever is
most over-represented in it, and the result is what the industry now calls
distributional convergence: the same Inter headline, the same blue-to-violet
hero gradient, the same three feature cards with a glowing middle tier, the same
`rounded-2xl` on everything. Recognisably generated pages measurably
underperform, and the audience has developed a sixth sense for them.

Pholio's entire proposition is that it is not another SaaS portfolio host. A
large share of its talent audience arrives having been burned by scam-adjacent
modelling sites and is actively assessing whether this one is real. **A page
that looks generated is a page that looks untrustworthy**, which on this site is
a conversion problem before it is a taste problem.

**Violating anything below requires human approval and a design conversation
first.** "The brief seemed to call for it" is not approval. If you want an
exception, say which rule, why this case is different, and what you are doing
instead.

---

## 0. The two questions

Most of this list collapses into two checks. Run them before consulting
anything else.

**1. Could this element be lifted onto any other company's site unchanged?**
If yes, it is decoration, not design. A gold hairline that organises real
document sections is specific. A gold hairline drawn across a hero because the
page "needed something" is not.

**2. Does this element carry information, or does it signal that design
happened?** The second category is the whole failure mode. Eyebrows, section
numbers, status dots, locale strips, version stamps, scroll cues, decorative
captions — none of them tell anyone anything. They exist to make a page feel
art-directed, which is exactly why they read as generated.

---

## 1. Page architecture

**1.1 No default page skeleton.** The shape `hero → three feature cards → logo
strip → stats band → pricing → FAQ → CTA → footer` is the single most
recognisable generated-page structure in existence. It is what gets produced
when nobody decided what the page should say. Decide what the page argues, then
give it the sections that argument needs, in the order the argument needs them.

**1.2 No layout-family repetition.** Once a section uses a layout family
(split image+text, full-width quote, card grid, pinned sequence), that family
appears **at most once more** on the page. Eight sections need at least four
distinct families.

**1.3 Zigzag cap: two.** Alternating left-image/right-text then
right-image/left-text is the laziest way to fill a page. Two consecutive is the
maximum; a third is a failure. Break it with a full-bleed section, a vertical
stack, or a pinned scroll sequence.

**1.4 No FAQ accordion as filler.** An FAQ whose questions paraphrase the
headline is padding. If there are real recurring questions, answer them; if
not, cut the section.

**1.5 No stats band.** The horizontal strip of three or four big numbers with
tiny labels under them ("10,000+ Talent · 98% Satisfaction · 24/7 Support") is
generated-page furniture, and on this site it is worse than that: Pholio has a
documented rule against inventing a number. See §9.4.

---

## 2. The hero

**2.1 No badge or pill above the headline.** `NEW`, `BETA`, `EARLY ACCESS`,
`AI-POWERED`, `INVITE ONLY`, `v2.0`, or a small rounded chip of any kind sitting
above an oversized H1. This is the number-one tell, and it is banned in every
form: pill, plain label, bracketed text, or eyebrow.

**2.2 No `Brand · No. 01` sub-eyebrow.** Micro-meta lines under or above the
brand mark.

**2.3 No scroll cue.** `Scroll`, `↓ Scroll to explore`, an animated mouse-wheel
glyph, a bouncing chevron. Someone who has not scrolled yet is looking at the
hero. They know what scrolling is.

**2.4 No decoration text strip at the hero's bottom edge.**
`EDITORIAL. CINEMATIC. EXACTING.` or `TALENT / AGENCIES / STUDIO+` set as small
mono caps across the base of the hero is an agency-portfolio cliché. Allowed
only if the strip carries real navigable links.

**2.5 Nothing else stacked in the hero.** No trust micro-strip ("Used by
scouts at…"), no pricing teaser, no feature bullets, no avatar row, no tiny
tagline under the CTA. Those are sections, and they go below.

**2.6 No gradient orb, blob, or glow behind the hero.** Especially not a
purple or blue one. The field is velvet or cream; that is the background.

**2.7 The first frame must be a complete composition.** Pholio's heroes are
scroll sequences, so "the hero fits in the viewport" does not apply literally.
What does apply: **freeze the hero at scroll position zero and screenshot it.
That frame must stand on its own as a designed page.** A hero that only makes
sense once you start scrolling is a hero with nothing in it.

---

## 3. Section furniture

This section is where the most damage gets done, because every item in it feels
harmless.

**3.1 Eyebrows are rationed, hard.** An eyebrow is the small uppercase
wide-tracked label above a section headline — the CSS signature is
`text-[11px] uppercase tracking-[0.18em]` or `font-mono text-[10px] uppercase`.
Putting one above every section is what produces the templated rhythm that makes
a page read as generated.

> **Maximum one eyebrow per three sections.** A nine-section page gets at most
> three. If a section has one, the next two do not. This is mechanically
> checkable: count `uppercase tracking` micro-labels above headlines; the count
> must be ≤ `ceil(sections / 3)`.

The better move is almost always to delete it. A section's position on the page
already categorises it.

**Pholio's boundary:** the mono `Kicker` is real brand furniture, but only as a
**label on real data** — a date, a measurement, a document ordinal, a field
name. `Kicker` above a headline, naming the section, is banned like any other
eyebrow.

**3.2 No section-number eyebrows.** `00 / INDEX`, `001 · Capabilities`,
`03 — How it works`. Enumeration is not a label. (A mono ordinal *inside* a
heading, numbering a genuinely ordered list — as the legal documents do — is
fine. The ban is on decorative counting.)

**3.3 No `01 / 04` pagination stamps** on images, tiles, or slides. If someone
can count them, they do not need the number.

**3.4 No decorative status dots.** A coloured dot before a nav item, a list
row, a label, or "ONE SLOT OPEN". Permitted only for genuine live semantic
state, at most once per section. Default is zero.

**3.5 The middle dot `·` is rationed to one per line.** It is not a general
separator. `Talent · Agencies · Studio+ · Press · Contact` is a tell. Use line
breaks, columns, or hairlines.

**3.6 No floating top-right sub-paragraph** in a section header. Giant
left-aligned headline with a small explainer floating in the top-right corner,
aligned to nothing. Stack it under the headline instead.

**3.7 No split-header pattern by default.** Big headline in a 7-column left,
small body paragraph in a 5-column right. A section has one message. Stack
vertically at a readable measure, or give the right column something real (a
visual, a control) rather than filler text.

**3.8 No micro-meta sentences under headings.** "Each of these ships today, not
someday. The list stays short on purpose." Performative and instantly
recognisable.

**3.9 No hairlines or crosshairs as decoration.** This is Pholio's sharpest
edge case, because hairlines are the site's primary organising furniture
(foundations §4). The distinction is absolute:

- **Allowed:** a rule that separates two real groups, closes a band, or divides
  a list. It has content on both sides of it.
- **Banned:** grid lines, corner ticks, crosshairs, or a rule drawn across a
  section because the composition felt empty. Emptiness is fixed with spacing
  or with content, never with a line.

> **The home scroll sequence takes none of them.** `lessons.md` §11.3 overrules
> the "content on both sides" carve-out for the cinematic home surfaces: no
> hairlines, rules, ticks, bands or leader marks there, at any opacity, however
> real the data behind them. Structure comes from type scale, position,
> occlusion and timing. The legal documents and the footer keep the rule above.

**3.9b No vertical stack of short labels beside a subject.** `lessons.md` §11.2.
A column of classifier terms next to a photograph is a feature grid rotated
ninety degrees, and it reads as cheap however real the vocabulary is. Product
terms go at display scale, one at a time, as the composition itself.

**3.10 No `border-t` *and* `border-b` on every row of a list.** Pick one, use
it sparsely. A ten-row table with a hairline under each row is the laziest
possible layout — see §4.4.

---

## 4. Components

**4.1 No three equal feature cards.** Icon, heading, thirty words, repeated
three across. This is the default output for "features section" and it is
banned outright. Alternatives: a two-column zig-zag, an asymmetric grid, a
pinned scroll sequence, a horizontal scroll, or — usually best — one section
that makes one point properly.

**4.2 No bento grid by default.** The bento has become its own tell; it is
widely described in 2026 as the new hero slop. It is permitted only when the
content is genuinely a set of differently-weighted items, and then it needs
exactly as many cells as there are items (an empty tile means the grid was
planned wrong) and real visual variation across cells. A bento of six
text-on-cream boxes is a card grid wearing a hat.

**4.3 No card as a default container.** Pholio groups with hairlines and
negative space; there is no elevation model and no shadow scale. If you are
reaching for a bordered box to group three items, the spacing failed. See
foundations §4.

**4.4 No long spec tables with a rule under every row.** More than five items
needs a different component: grouped chunks with sparse dividers, a two-column
split, a card per item, or a "top five plus a link to the rest".

**4.5 No progress or score bars with filled background tracks.** A
`bg-zinc-200` track with a partial fill is dashboard clutter on a marketing
page. The one sanctioned exception already in the codebase is the account
panel's profile-strength rule, which is a 1px hairline with a gold fill and no
track.

**4.6 No fake product UI built from divs.** A "product preview" assembled from
styled rectangles, fake rows, fake toolbars, fake terminals is the single most
recognisable AI-design tell. Show the real product, a real screenshot, a
generated image, or nothing.

**4.7 No fake version chrome inside a preview.** `v0.6.2-rc.1`,
`last sync 4s ago · main`, a fake window titlebar with three coloured dots.

**4.8 No pills.** No pill buttons, no pill chips, no `rounded-full` on anything
but an avatar. Prominence on this site comes from colour, not shape
(foundations §5), so nothing needs a pill to be findable. This is a deliberate
divergence from `pholio-app`, whose talent dashboard does use pill controls.

**4.9 No labels or tags overlaid on images.** `PORTFOLIO · 02` in the corner of
a photograph. Either the image speaks alone, or a caption sits below it, outside
the frame.

**4.10 No decorative photo credits.** `Frame XII · 35mm`,
`Plate 03 · House archive`, `Field study no. 12`. A credit is allowed when there
is a real photographer being credited for a real photograph. Otherwise it is
costume.

**4.11 No custom mouse cursor.** Accessibility-hostile, performance-hostile,
and dated. The previous site had one; it was not carried over.

---

## 5. Colour, surface, shape

**5.1 No colour outside the three-colour palette.** Velvet, cream, gold. No
fourth accent, no semantic green/amber/red, no tinted category colours. See
foundations §1.

**5.2 No gradients as surfaces.** No blue-to-violet, no any-to-any. The single
gradient on this site is the gold sweep, which is a 1px hairline fading to
transparent at both ends, and it is furniture rather than a fill.

**5.3 No gradient text.** No `background-clip: text`, no rainbow fill, no
shimmering headline.

**5.4 No glassmorphism.** No `backdrop-filter` on cards, panels, buttons,
navigation, or toolbars. Permitted only on a full-screen functional scrim where
it is a dimmer, not a style. The header carries an explicit no-glass rule: a
header that needs a backing takes the page's own paper, opaque.

**5.5 No glows, neon, or coloured drop shadows.** No shadow scale at all,
in fact. Depth on this site comes from field changes and from real 3D transforms
in scroll scenes, not from elevation.

**5.6 No pure `#000000`.** The ink is `#050505`.

**5.7 No coloured side-stripe borders wider than 1px** on rows, callouts, or
blocks. A 2px gold left-border reads as an alert component.

**5.8 One corner-radius system, and here it is roughly zero.** No `rounded-2xl`
on everything. Square is the default; the avatar is the exception.

**5.9 No permanent dark mode as a style choice.** The site's ink field is a
brand decision, not a theme. Do not add a theme toggle, and do not build a
"dark version" of a section.

---

## 6. Typography

**6.1 No oversized H1 as the only hierarchy device.** Scale is not how this
system signals importance; colour and position are. A headline that is large
because it is a headline is fine. A CTA that is large because it is important
is banned (foundations §5).

**6.2 No `<br>`-broken italicised headline** as a stock design move. `for
thirty<br><em>years.</em>` Headlines should read naturally.

**6.3 No vertical rotated text.** `INDEX OF WORK, 2018-2026` turned 90°.
Portfolio cliché.

**6.4 No mid-grey supporting paragraph under every headline.** The 16-to-20px
explainer is the most template-looking thing a section can contain and it is
what most sections default to. See foundations §2 on the two registers.

**6.5 Italic means verdict, and nothing else.** One italic-gold word per
headline. Never two. It does not also mean emphasised, hovered, or quoted.

> **On Inter.** Generic anti-slop guidance bans Inter as an AI-default
> typeface, and that guidance is right about generic briefs. It does not apply
> here: Inter is Pholio's clerical voice, paired against a display serif and a
> mono, and the pairing is the opposite of the Inter-alone default it warns
> about. Do not swap it out on the strength of a skill file.

---

## 7. Imagery

**7.1 A text-only page is not minimalism, it is unfinished.** Even the most
restrained section needs real imagery. Pholio is a platform about photographs
of people; a marketing site for it that contains no photographs has failed at
the premise.

**7.2 No hand-rolled decorative SVG illustrations.** Abstract shapes, blobs,
line-art figures, isometric scenes. If a section needs a visual, it needs a
photograph.

**7.3 No generic stock-photo energy.** Smiling people in an office, handshakes,
laptops on desks. The imagery register is editorial fashion photography: warm
grain, framed rather than cropped.

> **On grayscale.** This rule used to read "grayscale, warm grain, framed rather
> than cropped", in a voice that implied the industry works that way. It does
> not. Every image measured across roughly thirty-five agency, fashion-house,
> publication and portfolio sites renders in full colour with no filter
> (`05-industry-reference.md` §6.1). Framing over cropping is an industry norm
> and stays stated as one. Grayscale is not.
>
> **Grayscale remains the register, as a brand decision made deliberately and
> not inherited from research.** Talent imagery arrives from
> `GET /api/public/home` in colour, so this is an applied treatment with a cost:
> it flattens skin tone, and skin tone is information on a site whose subject is
> people. Anyone proposing to drop it is arguing with a choice rather than
> correcting a mistake, and should say what changes.

**7.4 Talent imagery has a sanctioned source.** `GET /api/public/home` on
pholio-app, which gates every row through `isPubliclyExposable()` and therefore
excludes minors. Do not pull talent photographs from anywhere else, and do not
use a real person's image as a placeholder. See `../app-integration.md`.

**7.5 Frame imagery, do not crop it.** A portrait sits inside a frame with
margin. Full-bleed edge-to-edge cropping is not this site's register.

---

## 8. Motion

**8.1 No motion without a one-sentence justification.** If you cannot say what
an animation reveals, directs, or reinforces, delete it. Motion is arrival
(foundations §6).

**8.2 No looping animation.** Nothing shimmers, pulses, floats, breathes, or
orbits on a timer. No animated gradient. No particles.

**8.3 No scale or shadow on hover.** Hover is a colour shift and a 1px rule.

**8.4 No `window.addEventListener("scroll")` for animation.** Main-thread,
unbatched, the classic jank source. See `04-scroll-craft.md` §2.

**8.5 No animation that gates content.** If the reveal never fires, the words
are still there. No content behind a scroll trigger.

**8.6 No over-choreographed page-load sequence** on a utility page. A legal
document does not need a staged entrance.

**8.7 Reduced motion is a second composition, not a shorter duration.** A 0.01s
scrub is not a fallback.

---

## 9. Copy and voice

**9.1 No em-dashes in published page copy.** This is the most-violated tell and
the phrasing here is binary: zero. Not "used sparingly". Restructure into two
sentences, or use a comma, a colon, or parentheses. En-dashes used as separators
are banned too; ranges take a hyphen.

> Exceptions, both narrow: the legal documents, whose text is versioned and
> must not be edited for style, and engineering documentation like this file.
> Everything a visitor reads on a marketing page: zero.

**9.2 No rule-of-three cadence in every section.** `No agents. No fees. Just
your book.` Models reach for staggered triplets relentlessly, and one per page
is punchy while four is robotic. Vary sentence length deliberately — the
monotone rhythm is itself a tell.

**9.3 No "not just X, but Y" construction.** Along with "it's not a portfolio,
it's a career", "in today's landscape", "delve into", "navigate the
complexities of", "seamless", "elevate", "unleash", "revolutionise",
"next-generation", "empower". These are filler verbs pretending to be claims.

**9.4 No invented numbers.** No `10,000+ talent`, no `98% satisfaction`, no
`4.1×` anything. Fake-precise figures that imply data the brand does not have
are banned, and Pholio has a product-level commitment never to invent a number.
Real figures from the product are fine and should be labelled as what they are.

**9.5 No urgency or scarcity language.** "Limited spots", "Apply before it
closes", "Only 3 places left". Beyond being a generated-page cliché, it is the
exact register of the scam modelling sites this audience is trying to
distinguish Pholio from.

**9.6 No vague trust adjectives.** "Secure", "trusted", "world-class",
"industry-leading". Say the falsifiable thing instead: "Applying is free",
"Agencies are reviewed manually", "You can withdraw a submission".

**9.7 No performative-craftsman labels.** "From the field", "Field notes",
"Currently on the bench", "On our desks", "Loose plates". Use the plain
functional label, or no label.

**9.8 No mock-humble asides.** "We respect the French ones." "We are probably
too precious about this." Cute, and unmistakably machine-written.

**9.9 No "Quietly trusted by" / "Quietly in use at".** Say "Used by", or let
the logos speak.

**9.10 No generic step labels.** `Step 1 / Step 2 / Step 3`,
`Phase 01 / 02 / 03`. The step content is the label: "Upload", "Compose",
"Submit".

**9.11 No version or build strings** anywhere on a marketing page. `v1.4.2`,
`Build 0048`.

**9.12 No locale, time, or weather strips.** `London 14:23 · 11°C`,
`ESTD. 2024`. A real contact address in a footer is fine; atmospheric
place-dressing is not.

**9.13 Say "Recipients", not "agencies", where the contract does.** Since the
2026-07-18 terms revision, submissions may go to agencies, casting
organisations, event producers, brands, and other clients, collectively defined
as Recipients. Copy that says "agencies" understates who receives a submission,
which is a compliance issue rather than a style one.

**9.14 No emoji.** Anywhere. Code, markup, copy, alt text.

**9.15 Read every visible string before shipping.** Headlines, buttons,
captions, alt text, error messages, empty states. Flag anything grammatically
broken, anything with an unclear referent, anything that reads as an LLM trying
to sound thoughtful. Boring and correct beats clever and hollow every time.

---

## 10. Names, data, placeholders

**10.1 No placeholder names.** No "Jane Doe", "Sarah Chan", "John Smith".
Demo talent are either real people with permission, or clearly-labelled demo
identities. The app has one: `elara-k`.

**10.2 No invented agency names.** No "Acme Models", "Nexus Talent",
"Elite Management". If a logo wall is needed it uses real agencies with
permission, or it does not exist.

**10.3 No generic avatars.** No egg silhouette, no Lucide user glyph, no
initials-in-a-circle grid pretending to be social proof.

**10.4 No unlabelled mock data.** If a number, chart, or metric is
illustrative, it is marked as illustrative in the markup and, where a visitor
could mistake it for a claim, on the page.

---

## 11. Where this site deliberately diverges from generic guidance

Three widely-repeated anti-slop rules are wrong for Pholio. They are listed here
so nobody "fixes" the site into compliance with a skill file.

**Inter is not banned here.** See §6. It is the clerical voice in a
three-typeface system, not the lazy default the general rule targets.

**Sections do invert.** Generic guidance says lock a page to one theme and never
flip a section. Pholio's field system does exactly that on purpose: sections
alternate velvet and cream, and the header samples the paper beneath it and
flips polarity mid-scroll (foundations §3). This is one palette with two
polarities, not a light-mode section pasted into a dark-mode page. The rule the
generic guidance is really protecting — do not mix two unrelated colour systems
on one page — still holds absolutely.

**Grain and hairlines are brand furniture, not ornament.** `pholio-app` bans
decorative grain on product surfaces and generic guidance bans hairline grids.
Both are right about decoration. Here, grain is print texture capped at 0.03
opacity, and hairlines organise real content with material on both sides. The
moment either is being used to make an empty composition feel designed, the ban
applies at full strength.

---

## 12. Pre-flight, mechanically

Run before calling any page done. These are countable, so count them.

- [ ] **Zero em-dashes** in any visible string outside the legal documents.
- [ ] **Eyebrow count** ≤ `ceil(sections / 3)`. Count `uppercase tracking`
      labels above headlines.
- [ ] **No badge, pill, or version label** above or inside the hero.
- [ ] **No scroll cue** anywhere.
- [ ] **Hero at scroll zero screenshots as a finished composition.**
- [ ] **No three-equal-card row.** No bento without per-cell variation.
- [ ] **Layout families**: at least four distinct across eight sections; no
      family used more than twice; no three consecutive image+text splits.
- [ ] **Zero decorative dots.** Zero `rounded-full` outside avatars.
- [ ] **Zero `backdrop-filter`** outside a full-screen scrim.
- [ ] **Zero gradients** outside the gold sweep. Zero gradient text.
- [ ] **Every colour** resolves to velvet, cream, or gold.
- [ ] **Every hairline** has real content on both sides of it.
- [ ] **Real images present**, from a sanctioned source, framed not cropped.
      No div-built product previews. No decorative SVG illustrations.
- [ ] **Every number** is real and sourced, or marked illustrative.
- [ ] **Every animation** justifiable in one sentence. No loops. No hover
      scale. No scroll listeners.
- [ ] **Reduced motion** gives a real static composition.
- [ ] **Contrast**: every resting value ≥ 4.5:1 on its own field.
- [ ] **Copy self-audit**: every visible string read once, on its own, cold.

If one box cannot be honestly ticked, the page is not done.

---

## Sources

Compiled from the `design-taste-frontend` skill
(`.agents/skills/design-taste-frontend/SKILL.md`, sections 4.7 through 4.11 and
section 9), the `pholio-app` global ban list where it is also a brand rule, and:

- [AI Slop Web Design: Spotting and Fixing Generic Websites (2026)](https://www.925studios.co/blog/ai-slop-web-design-guide)
- [AI Slop in 2026: The State of the AI-Generated Web](https://www.sailop.com/blog/ai-slop-2026-state-of-the-ai-generated-web)
- [AI Design Slop: 16 Patterns That Out Your App as Vibe-Coded](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it)
- [AI Slop Design: Why AI-Generated UI Looks Generic](https://vibecodekit.dev/ai-slop-design)
- [Web Design Trends 2026: What Actually Held Up After Six Months](https://studiomeyer.io/en/blog/webdesign-trends-2026-reality-check)
- [How to Spot AI Writing Tells: 17 Examples + Blacklist 2026](https://www.oliviacal.com/post/ai-writing-tells)
- [The new rules of copywriting: writing well in the AI era](https://adma.com.au/resources/new-rules-copywriting-how-write-well-ai-era)
