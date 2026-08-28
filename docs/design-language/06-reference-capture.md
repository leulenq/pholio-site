# Reference capture

How to study a live site well enough to learn from it, using the tooling
installed on this machine. This is the procedure behind
[`05-industry-reference.md`](05-industry-reference.md) and
[`07-reference-flowty.md`](07-reference-flowty.md), written down so the next
study is measured the same way.

The rule those documents run on: **every number is read off the live rendered
page in a real browser, from computed styles.** Not from press about the site,
not from the HTML source, not from memory. Where a value cannot be read, the
study says so rather than guessing.

---

## 1. What this is not

It is not cloning. A reference study never produces markup. It produces
measurements and, from them, principles — the level of thinking that made the
reference work, stated so it can be applied to a Pholio surface that looks
nothing like it.

The tooling installed here was built for cloning. Only its capture half is
used. If a study ever ends with generated components, it has gone wrong.

---

## 2. Tooling

| Tool | Role |
|---|---|
| `agent-browser` (CLI) | the driver. Screenshots, computed styles, video, reduced-motion emulation, vitals, a11y, HAR |
| `ui-clone-skills` (plugin `ui-clone-skills@voidmatcha`) | capture procedures — `ui-capture` and its `detection.md` trigger taxonomy |
| `playwright@claude-plugins-official` | fallback driver, and the only way to read a site in WebKit |
| `ffmpeg` | filmstrips out of the scroll video |

Preflight:

```bash
agent-browser --version && ffmpeg -version | head -1
```

Use `--session <name>` on every `agent-browser` call, and absolute paths for
every output — the shell's working directory resets between calls.

---

## 3. The pass

Work in a scratch directory, not in the repo. Only the finished study is
committed.

### 3.1 Open and settle

```bash
agent-browser --session <s> open <url>
agent-browser --session <s> set viewport 1440 900
agent-browser --session <s> wait 5000
```

Viewport must be set *after* `open` — set before, it is silently dropped.

The wait is not a formality. Most sites in this space run a timed intro, and a
screenshot taken during it records a state that never appears again. Confirm
the page has settled before believing any measurement: if
`document.documentElement.scrollHeight` equals the viewport height on a site
that obviously scrolls, the intro is still running.

### 3.2 Find the scroller

Smooth-scroll libraries move the scroll out of the document. Detect it before
anything else, because every later scroll operation targets it:

```js
document.querySelector('[data-lenis],.lenis,[data-scroll-container],.locomotive-scroll')
```

If one is found, the page's real height is that element's `scrollHeight` and
`document.body.scrollHeight` will read `0`. Record which it was — the presence
of a smooth-scroll layer is itself a finding, and it is a main-thread cost.

### 3.3 Measure the document

Full document height at 1440px, then at 768 and 390. This is the first number
in the 05 table and the most mechanical way to place a site.

### 3.4 Read the tokens

One `eval` over every rendered element, tallying computed values by frequency
and keeping the top of each: `fontFamily`, `fontSize`, `fontWeight`, `color`,
`borderRadius`, `transitionDuration`, `transitionTimingFunction`.

Frequency is the point. A palette listed in a style guide says what is
available; a frequency tally says what is *used*, and the gap between the two
is usually where the discipline lives.

Pipe the output to a file and read the file. Large `eval` output printed to
stdout is wasted context.

### 3.5 Capture the motion

Recording must start with the URL, in one command. Starting a recording on an
already-open page produces a black video:

```bash
agent-browser --session <s> record start <abs-path>.webm <url>
# set viewport, wait, then drive the scroller in steps
agent-browser --session <s> record stop
```

Then a filmstrip, which is what actually gets read:

```bash
ffmpeg -i <video> -vf "fps=1,scale=440:-1,tile=4x4" -frames:v 1 <abs-path>.png
```

The filmstrip is the tool for the test in
[`04-scroll-craft.md`](04-scroll-craft.md) §6 — freeze the scene at any scroll
position and ask whether that frame is a designed composition. A grid of
mid-transition frames answers it directly, and it answers the harder question
too: whether the motion reveals something or only moves something.

For per-region trigger classification (`css-hover`, `intersection`,
`scroll-driven`, `mousemove`, `auto-timer`, `click-toggle`), use the taxonomy
and detection eval in the installed `ui-capture` skill's `detection.md`. Do not
re-derive it.

### 3.6 Capture the second design

```bash
agent-browser --session <s> set media reduced-motion
```

Then re-open and re-capture. Under §4 of the scroll doc, reduced motion is a
second design, not a switch — so a study that only captured the default state
has only read half the site.

Count `animationName !== 'none'` and `transitionDuration !== '0s'` in both
states. A site whose counts are unchanged is not honouring the preference,
whatever its transitions look like. Say so.

### 3.7 Cost

```bash
agent-browser --session <s> vitals <url>
```

LCP, CLS, TTFB. A reference that looks extraordinary and costs four seconds to
first paint has made a trade, and the study should name the trade rather than
admire the result in isolation.

---

## 4. Motion implementation forensics

Sections 3.1–3.7 record what the reference *does*. This section records how it
is *built* — which libraries and browser technologies drive the motion, and how
they are configured.

The purpose is not to copy the stack. It is to know what class of machinery a
given quality of motion actually took, so the Pholio version can be built with
the reference's approach where it is right and a better one where it is not.
Under [`04-scroll-craft.md`](04-scroll-craft.md) §2 the tool is chosen by what
the job needs; that choice is only informed if the reference's own choice is
known rather than assumed.

### 4.1 Three tiers, never collapsed

Every claim in this section carries its tier. They are not interchangeable and
a claim never moves up a tier because it feels obvious.

| Tier | Means | Example |
|---|---|---|
| **Observed** | Read directly off the live runtime or the rendered page | `document.getAnimations()` returned 0. Four `<canvas>` elements return a `webgl2` context. Median frame 16.7ms. |
| **Strong evidence** | Indirect but near-certain — instrumented interception, or a distinctive string in a shipped bundle | The main bundle contains `version:"3.14.2"` next to 46 `_gsap` references, so GSAP 3.14.2 is bundled. |
| **Inference** | Reasoning from behaviour or from absence | The one pinned trigger is probably the wrist section. |

Write the tier into the study. "GSAP 3.14.2 is bundled (strong evidence: version
string plus `registerPlugin` calls)" is usable; "it uses GSAP" is not, because
the next reader cannot tell whether anyone checked.

**Inference is never promoted by repetition.** If a mechanism matters to a
decision and only inference supports it, either find a probe that settles it or
write the decision so it does not depend on the answer.

### 4.2 The trap: absent globals prove nothing

The single most misleading probe is `window.gsap`. Every modern bundler produces
ESM in which GSAP, Lenis, Three and OGL are module-scoped and expose **no
global at all**. A site can ship all four and answer `false` to every
`window.*` check.

Absence of a global is **not evidence of absence of a library**. It is evidence
of a bundler. Treat a global check as useful only when it returns `true`.

The same applies to `<canvas>`: check for the elements and call `getContext`,
rather than checking for `window.THREE`.

### 4.3 Instrumented load

The reliable probe is to wrap the browser APIs before any page script runs.
[`scripts/reference-capture/motion-forensics.js`](../../scripts/reference-capture/motion-forensics.js)
does this — it records every scroll/wheel/pointer/resize listener, every
`requestAnimationFrame` caller, every `IntersectionObserver` construction and
every `Element.animate` call, each with the call site that registered it.

```bash
agent-browser --session fx open --init-script "$PWD/scripts/reference-capture/motion-forensics.js" <url>
# set viewport, wait, drive the scroller through the page
agent-browser --session fx eval "JSON.stringify(window.__forensics)" > <abs-path>/forensics.json
```

It must be `open --init-script`. Injecting after load misses every registration
the page already made, which is all of them.

Read from it:

- **Listener passivity.** A non-passive `wheel` or `touchmove` listener is a
  scroll hijack — the page is preventing default to drive its own scroll.
  Passive `scroll` listeners in bulk are a subscription pattern, not
  necessarily a cost.
- **How many rAF loops, and whose.** The call sites cluster. Two dominant
  stacks with similar counts means two independent tickers on the main thread.
- **IntersectionObserver options.** `rootMargin: '400px 0px'` with no threshold
  is a prefetch/lazy-hydration boundary. `threshold: 0` with no margin is an
  in-view reveal. They read identically from the outside and mean different
  things.
- **`Element.animate` count.** Zero means no Web Animations API, which
  combined with 4.4's CSS audit tells you the motion is JS writing inline
  styles against CSS transitions.

### 4.4 Runtime and CSS audit

One `eval`, after the page has settled:

- `document.getAnimations()` — every running animation, with
  `a.timeline.constructor.name`. `ScrollTimeline` or `ViewTimeline` there is
  **observed** proof of CSS scroll-driven animation. `DocumentTimeline` is a
  normal CSS animation. An empty array means neither is in use.
- Walk `document.styleSheets` and count rules matching
  `animation-timeline|view-timeline|scroll-timeline`, `@keyframes`, and
  `prefers-reduced-motion`. Record how many sheets were unreadable — cross-origin
  sheets throw, and an unread sheet is not an empty one.
- `CSS.supports('animation-timeline: view()')` — separates "the browser could
  not" from "the site chose not to".
- Count `position: sticky` elements. Sticky is pinning without a library; its
  absence on a site that appears to pin means something else is doing it.
- Count elements with `will-change` other than `auto`. §3 of the scroll doc caps
  the layer budget; a reference in the dozens is over it and should be reported
  as a cost, not a technique.
- Enumerate `<canvas>` and call `getContext('webgl2'|'webgl'|'2d')` on each.

### 4.5 Bundle identification

Fetch the scripts the page actually loaded — the call sites in §4.3 name the
files — and grep them. This is strong evidence, not observation: a minified
bundle can contain a library it never calls.

Worth grepping for: `gsap`, `ScrollTrigger`, `version:"3.` (GSAP ships its
version as a literal), `registerPlugin`, `lenis`, `lerp`, `WebGLRenderer` and
`THREE` (Three.js), `Program`/`varying`/`gl_FragColor`/`precision mediump`
(raw GLSL, so OGL or hand-rolled rather than Three), `locomotive`, `SplitType`.

Then grep for **configuration**, which is the part that transfers:

```
scrub:[^,}]{0,14}   pin:[^,}]{0,10}   anticipatePin
start:"[^"]{0,24}"  end:"[^"]{0,24}"  toggleActions:"[^"]{0,30}"
"(power[1-4]|expo|circ|sine|quart|back|elastic)\.(in|out|inOut)"
```

A count of `toggleActions` against a count of `scrub` is the whole answer to
"is this site scrubbed or is it entrance reveals?" — and those are different
designs with different costs, indistinguishable on video.

Minified option names defeat this for some libraries. Where the values are
mangled, say they were unread. Do not infer a duration from how it feels.

### 4.6 Frame cost

Measure, on the machine, during a scroll:

```js
// rAF sampler: record deltas while stepping the scroller, then report
// median / p90 / p99 / worst and the count of frames over 50ms
```

Median near 16.7ms is a locked 60fps. The number that matters more is p99 and
the count of long frames — a site can hold 60 and still drop three frames at
the one moment a shader compiles or a pin engages, and that is where the
reference's technique is actually costing something.

State the machine. An unthrottled laptop measurement is not the test in §3 of
the scroll doc, and should never be reported as if it were.

### 4.7 What to conclude

The output is not a stack list. It is a sentence per mechanism, of the form:
*this effect is produced by this machinery, configured this way, at this cost.*

Then the judgement, which is the point: for each mechanism, is it the lightest
tool that does that job? A reference that reaches for a 25KB main-thread
library to produce entrance reveals has told you something useful — that its
motion quality did **not** come from the library, and the same result is
available from `animation-timeline: view()` on the compositor. A reference that
uses a pin, or a scrubbed multi-beat timeline, has told you the opposite.

---

## 5. What a study contains

Same shape as 05, in this order:

1. **What was measured** — URL, date, viewports, and anything that could not be read.
2. **The numbers** — document heights, type scale, palette by frequency, easing, durations, radii.
3. **The motion** — trigger types, what each sequence reveals, and the filmstrip verdict.
4. **The implementation** — §4. Libraries and browser technologies, how they are
   configured, and the frame cost. Every claim tiered.
5. **The second design** — reduced-motion behaviour, stated plainly.
6. **The cost** — vitals.
7. **What transfers** — the principles, written so they survive being applied to a page that shares no visual DNA with the reference.
8. **Collisions** — every point where the reference contradicts
   [`03-banned-ui.md`](03-banned-ui.md) or a preserved surface, named in place,
   with the winner stated. The winner is this repo. A reference is evidence,
   never authority.

Section 7 is the deliverable. Sections 2–6 exist to keep it honest.

---

## 6. The failure mode

A study that reads as a list of things to copy has failed. The reference is
being read for *why* its choices cohere — one typeface used at eight sizes, one
easing curve used everywhere, one idea per screen — not for the typeface, the
curve, or the screen.

If a finding cannot be stated without naming the reference's own colours,
fonts, or section shapes, it is not a principle yet. Keep reducing.

§4 has its own version of this failure: a study that concludes "so we should use
GSAP" has skipped the reasoning. Knowing what the reference used is the input to
the tool choice in [`04-scroll-craft.md`](04-scroll-craft.md) §2, never a
substitute for it. The ordered escalation there still decides, and it decides
against the reference whenever the reference reached higher than its own design
required.
