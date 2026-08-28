# Reference study: flowty.co

Captured 2026-08-27 with the procedure in
[`06-reference-capture.md`](06-reference-capture.md). Viewports 390, 768 and
1440. Chromium, real browser, computed styles.

Flowty is a focus-break timer app. It is not in Pholio's industry and nothing
here is a template. It is studied because its motion and its restraint are both
unusually disciplined, and the discipline is the transferable part.

**What could not be read:** the large numeric counter visible in the corner
during scroll (reading 36 → 49 → 58 → 73 across a single pass) is not present in
the static DOM at any scroll position probed. It renders only in motion. Its
mechanism is unconfirmed and is not relied on below.

---

## 1. The numbers

**Stack.** Nuxt/Vue, code-split. Lenis smooth scroll on `div.page-wrapper.lenis`
— the document does not scroll, that element does, and `document.body.scrollHeight`
reads `0`. Full implementation in §3.

**Document height.**

| Viewport | Full height | Ratio to viewport |
|---|---|---|
| 390 × 844 | 10,693px | 12.7 screens |
| 768 × 844 | 12,612px | 14.9 screens |
| 1440 × 900 | 14,770px | 16.4 screens |

For placement against 05's table: this is a long page. Longer than Contra,
around Backstage. Length is a genuine collision and is dealt with in §7.

**Typography.** One family, Outfit, on all 822 rendered elements. No pairing, no
display/body split. Three weights: 400 (108 uses), 500 (67), 300 (31).

Size tally at 1440, by frequency:

| Size | Uses | Role |
|---|---|---|
| 12.75px | 72 | captions, labels |
| 21px | 67 | body |
| 16.5px | 28 | secondary body |
| 127.5px | 10 | section headlines |
| 36px | 8 | subheads |
| 28.5px | 7 | — |
| 72px | 6 | — |
| 187.5px | 4 | hero |

The fractional values are the tell: every size is a fluid expression, not a step
on a fixed scale. The headline measures 47.6px at 390, 90px at 768, 127.5px at
1440 — roughly viewport-proportional with a taper at the top end, so the
headline holds the same share of the screen on a phone as on a laptop.

Two body sizes and two display sizes carry the whole page. Eight values total,
one of which appears four times.

**Palette.** Background `rgb(10,10,11)`. Text `rgb(206,206,215)` (117 uses),
`rgb(103,106,121)` (30), `rgb(69,72,80)` (10). Pure white appears exactly once
in the whole document.

Three greys on near-black, and the brightest one is not white. All the colour on
the page is in the imagery and the gradient fields behind it, none of it in the
type.

**Motion tokens.** One easing curve, `cubic-bezier(0.625, 0.05, 0, 1)`, on 86 of
the 87 transitions that have one. The exception is a single stray
`cubic-bezier(0.4, 0, 0.2, 1)` — the Material default, almost certainly
unintentional.

Durations: 0.6s (58 uses), 0.7s (15), 0.3s (14).

That covers the CSS layer only. The GSAP layer uses a second, named easing set —
see §3.4.

**Radii.** 16.5px (36), 9999px (31), 45px (13), 30px (12). Fluid again, and the
pill is used as much as the rounded rectangle.

---

## 2. The motion

Trigger types present, by the `ui-capture` taxonomy: `intersection` (section
entrances), `scroll-driven` (headline scale, the corner counter), `css-hover`
(controls), `mousemove` (the custom cursor and the shader fields). Mechanism for
each is in §3.

Read off the filmstrip, one frame per second across a full-page pass:

**Sections overlap rather than follow.** Consecutive sections share the viewport
during transition — the outgoing headline is still legible while the incoming
one has begun. The page reads as one continuous surface, not a stack of slides.

**Headlines arrive by scale, not by translation.** "Flowty ⌚ On Your Wrist"
grows into place across roughly a viewport of scroll. The frames caught
mid-transition are legible and composed at every step.

**One idea per screen, and the screen holds.** Every frame in the strip has a
single subject: one headline, or one device, or one grid. Nothing competes.
Sections run 900–1,850px, so the long ones hold for two screens — the pacing is
deliberately uneven.

**The filmstrip test.** Every frame is a designed composition. Several of the
mid-transition frames — the headline at partial scale over the gradient field —
are better compositions than the settled states either side of them. This is the
strongest single thing about the site and it is what §6 takes from it.

---

## 3. The implementation

Per [`06-reference-capture.md`](06-reference-capture.md) §4. Tier on every claim.

### 3.1 What the globals said, and why it was wrong

`window.gsap`, `window.ScrollTrigger`, `window.Lenis`, `window.THREE`,
`window.MouseFollower` all return `false` **(observed)**. Every one of those
libraries is nevertheless present. The site is an ESM Nuxt build; nothing is
attached to `window`.

Recorded here because this is the failure the procedure's §4.2 exists to
prevent, and it is a cheap mistake to make twice.

### 3.2 Libraries

| Library | Evidence | Tier |
|---|---|---|
| **GSAP 3.14.2** | `version:"3.14.2"` literal in `Cj4SiSOY.js`, alongside 46 `_gsap` references and 23 `registerPlugin` calls | strong evidence |
| **ScrollTrigger** | 42 `scrollTrigger` references across five chunks, plus `ScrollTrigger` cased occurrences in the main bundle | strong evidence |
| **Lenis** | `BsFv0UKQ.js`, 38 `lenis` references; the container carries class `lenis`; the constructor attaches `wheel`, `touchmove`, `scroll` and `scrollend` to `div.page-wrapper` | observed + strong evidence |
| **Mouse Follower** | `mf-cursor` in the main bundle; `div.mf-cursor` in the DOM | observed |
| **Raw WebGL2, not Three.js** | four `<canvas>` elements return a `webgl2` context; `DnsOTcru.js` contains 21 `precision mediump`, 17 `gl_FragColor`, 116 `Program`, `varying`/`uniform` declarations, and **no** `WebGLRenderer` or `THREE.` | observed + strong evidence |

The WebGL layer is shader-only — full-screen quads running fragment shaders,
with `mousemove` and `touchmove` bound directly to the canvases. This is the
gradient field behind the type. It is OGL-class or hand-rolled, not a scene
graph. **(inference: which of the two, unresolved.)**

### 3.3 How ScrollTrigger is actually configured

The configuration is the transferable part, and it is the opposite of what the
page's polish suggests. Grepped from the shipped chunks **(strong evidence)**:

| Config | Count |
|---|---|
| `toggleActions:"play none none reset"` | 6 |
| `start:"top bottom"` | 6 |
| `end:"bottom top"` | 3 |
| `start:"20% bottom"` | 3 |
| `scrub:.5` | 2 |
| `scrub:true` | 2 |
| `scrub:.3` | 1 |
| `pin:true` | 1 |
| `anticipatePin` | 3 |
| `end:"+=150%"` | 1 |

So: **roughly a dozen entrance reveals, five scrubbed timelines, and exactly one
pin.** The overwhelming majority of the site's ScrollTrigger usage is
`toggleActions` firing a tween when an element crosses the viewport — which is
`IntersectionObserver` behaviour, bought with a 25KB main-thread library.

The scrubs carry 0.3–0.5s of smoothing, which is why the scrubbed moments feel
weighted rather than mechanically pinned to the wheel.

Seven `IntersectionObserver`s exist independently **(observed, instrumented)**:
five with `rootMargin: '400px 0px'` and no threshold — Nuxt lazy-hydration
boundaries, not motion — and two with `threshold: 0`, which are reveals.

### 3.4 Two easing vocabularies, one character

CSS transitions run `cubic-bezier(0.625, 0.05, 0, 1)` — 86 of 87 **(observed)**,
and the literal appears six times in the bundle **(strong evidence)**.

GSAP tweens use a different, named set **(strong evidence)**: `expo.out` ×7,
`power2.out` ×7, `power3.out` ×5, `sine.inOut` ×1, `power1.inOut` ×1.

These are two systems, not one. What makes them read as one is that both are
heavily weighted `out` curves with a long settle — the CSS curve is an in-out
with a hard finish, `expo.out` is its JS analogue. §1's "one easing curve"
holds as a description of the CSS layer; the accurate statement is that the site
has one *easing character* expressed twice.

### 3.5 What is not there

**(observed, all of it.)**

- `document.getAnimations()` returns `0` at every scroll position probed.
- Zero `@keyframes` rules across 803 rules read, zero sheets unreadable.
- Zero `animation-timeline` / `view-timeline` / `scroll-timeline` rules — while
  `CSS.supports('animation-timeline: view()')` returns `true` in the capture
  browser. The site could have; it did not.
- Zero `Element.animate` calls under instrumentation.
- Zero `prefers-reduced-motion` blocks in any stylesheet. This is the mechanism
  behind §4.
- Zero `position: sticky` elements. The section overlap in §2 is transforms and
  z-index, not sticky, and not the single pin.

All motion on this site is therefore JS writing inline styles against CSS
transitions, plus GSAP tweens, plus shaders. **None of it is on a scroll
timeline and none of it is off the main thread.**

### 3.6 Main-thread load

Instrumented across one full-page scroll pass **(observed)**:

- **1,393 `requestAnimationFrame` calls**, dominated by two independent tickers
  at 192 and 189 registrations from different call sites — Lenis's loop and
  GSAP's ticker, both running.
- **95 passive `scroll` listeners and 93 passive `resize` listeners** on
  `div.page-wrapper`, all from the main bundle — a per-component subscription
  pattern. Passive, so not a jank source in themselves, but 95 subscribers
  running on every scroll event is real work.
- Non-passive `wheel` and `touchmove` on `div.page-wrapper` from the Lenis
  constructor — the hijack.
- **88 elements carrying `will-change`.** §3 of the scroll doc calls a handful
  an optimisation and twenty a memory problem.

### 3.7 Frame cost

Measured with an rAF sampler while stepping the scroller through the full page,
on an unthrottled Apple-silicon laptop **(observed — and not the throttled
mid-range test §3 of the scroll doc actually requires)**:

| | |
|---|---|
| Median frame | 16.7ms (60fps) |
| p90 | 16.8ms |
| p99 | 116.8ms |
| Worst | 150.0ms |
| Frames over 50ms | 3 |

A locked 60 with three long-frame events per pass. The median is what the
libraries buy; the p99 is what they cost, and on a three-year-old Android the
p99 is the whole experience.

### 3.8 The judgement

Mechanism by mechanism, against the escalation in
[`04-scroll-craft.md`](04-scroll-craft.md) §2:

- **The dozen entrance reveals** are the lightest-tool question and Flowty
  answers it wrong. `animation-timeline: view()` does this on the compositor,
  degrades to the final state for free, and costs nothing. Flowty's reveals
  read well because of *what* they animate — scale and opacity on a composed
  layout — not because ScrollTrigger fired them.
- **The five scrubs** are legitimate GSAP territory, and the 0.3–0.5s smoothing
  is the detail worth taking.
- **The single pin** is the one thing on the page that genuinely requires GSAP,
  since pinning is not in the scroll-timeline spec. One pin does not justify the
  library for the other seventeen triggers; it justifies it for that one scene.
- **Lenis** buys nothing the design needs. Every effect above is reproducible
  without it, and it is the component most hostile to the reduced-motion reader.
- **The shader fields** are the honest answer to "how do you get that gradient
  without a 2MB image" — and at four canvases, they are also a plausible
  contributor to the p99.

---

## 4. The second design

Under `prefers-reduced-motion: reduce`:

| | Default | Reduced |
|---|---|---|
| Elements with CSS animation | 0 | 0 |
| Elements with transition | 135 | 135 |
| Lenis smooth scroll | active | active |

Flowty does not honour the preference. The transition count is unchanged and the
smooth-scroll layer still intercepts the scroll — which for a reader who set that
preference is the most disruptive part of the page, not the least.

By [`04-scroll-craft.md`](04-scroll-craft.md) §4 this is a failure. It is
recorded here so the study is not read as a blanket endorsement: the composition
is worth learning from, this is not.

---

## 5. The cost

| Metric | Value |
|---|---|
| TTFB | 587ms |
| FCP | 1,732ms |
| LCP | 3,384ms |
| CLS | 0 |

CLS of zero across a 14,770px page with fluid type at every size is the
achievement here, and it is not an accident — fluid sizing that resolves before
paint does not shift. LCP at 3.4s is poor, and the trade is visible: the intro
holds content back until the gradient field is ready.

For this site's audience the trade may be defensible. For a site whose audience
arrives from Instagram on a phone, it is not.

---

## 6. What transfers

Stated so it survives being applied to a page that shares no visual DNA with
Flowty.

**Spend variety in one dimension only.** Flowty has one typeface, three weights,
three greys, one easing curve and effectively one duration. All of its variety is
in scale and in imagery. The page reads as expensive because nothing in it is
arbitrary — not because anything in it is elaborate. This is the same thesis as
the header's, generalised: the surfaces that land are the ones confident enough
to hold still.

**One easing curve, declared once, is a brand asset.** Eighty-six of eighty-seven
transitions on the same curve is why the site feels like one object rather than a
sequence of components. Under §5 of the scroll doc the tunable numbers already
belong at the top of a `motion.ts`; the curve belongs one level above that,
shared across sections. Divergence should be a decision, not a default — the one
stray Material curve on Flowty is what an undecided default looks like.

**Fluid, not stepped.** Sizing every value as a viewport expression is what buys
both the CLS of zero and the identical composition at 390 and 1440. It also
removes the breakpoint as a design event: there is no width at which the page
becomes a different design.

**Transitions are compositions, and should be art-directed as such.** The
mid-transition frames being the best frames is not luck; it follows from
animating scale and opacity on an already-composed layout rather than moving
elements into position from off-screen. §1 of the scroll doc already draws the
reveals/moves line — this is the mechanical reason the line holds.

**Let sections overlap.** Sharing the viewport during a transition is what makes
a long page read as one surface. Cheap: it needs only that the outgoing section
stay legible while the incoming one starts, which is a z-index and timing
decision, not a library.

**Restraint in the palette means the imagery carries the colour.** One near-white
in the entire document, and every colour in the photography. For a site whose
subject is people, this is directly applicable.

---

## 7. Collisions

Named in place. The winner is always this repo.

**Page length.** Flowty runs 16 viewports. 05 §1.1 records that seven of ten
agencies in Pholio's space serve one non-scrolling screen, and that the front
door is one to two screens. **This repo wins.** Flowty is a product site selling
a subscription; it earns its length by having sixteen screens of product to
show. Pholio's front door does not. Take the transition craft, not the runway.

**Smooth scroll.** Lenis is a main-thread scroll hijack. 04 §2 sets CSS
scroll-driven animation as the default and lists the ordered escalation; nothing
in that list is a smooth-scroll library, and 04 §3 requires 60fps on a throttled
mid-range device. **This repo wins.** The overlap and scale effects above are all
reproducible with `animation-timeline: view()` on the compositor. Flowty's
smooth scroll buys nothing the design needs.

**ScrollTrigger for entrance reveals.** Eighteen triggers, of which roughly a
dozen are `toggleActions` reveals that `animation-timeline: view()` does on the
compositor for free. 04 §2 sets the ordered escalation and puts GSAP last, for
pinning and scrubbed timelines only. **This repo wins**, and this is the most
useful collision in the study: the quality of Flowty's reveals comes from what
they animate, not from what fired them, so the quality is available at the
bottom of the escalation. **No collision** for the one pinned scene and the five
scrubs — those are exactly the cases 04 §2 already sanctions GSAP for.

**88 elements with `will-change`.** 04 §3 caps the layer budget at a handful and
calls twenty a memory problem. **This repo wins.** Promote the element that
animates, not its container — and note Flowty's own p99 of 116.8ms on an
unthrottled laptop.

**Custom cursor.** Mouse Follower is a mousemove listener driving a follower
element. Pointer-dependent, invisible on touch, and it is the treatment 05 was
written to rule out. **This repo wins.** Not applicable.

**Reduced motion.** Covered in §4. **This repo wins**, unambiguously.

**Dark ground.** Flowty is near-black. Pholio's preserved surfaces are cream and
the header samples the paper beneath it. **No collision** — nothing here depends
on the ground being dark. The principle is that one background and three text
values carry the page, and it holds at either polarity.
