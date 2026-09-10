# The narrow stage

How this site composes on a phone, and why that is a second art direction
rather than a set of breakpoints.

Read this before changing anything on the home stage, the hero, the
intelligence sequence, the comp-card beat or the closing panel.

---

## 1. The premise

A wide stage is a landscape frame. It is about 1.6 : 1, the figure occupies the
middle third of it, and there is a gutter on either side of her. Almost every
compositional idea on this site is built out of that gutter: copy stands beside
her, a sentence brackets her left and right, the wordmark is set wider than the
frame and the outer few percent bleed past the edges as scale.

A phone is a portrait frame at roughly 2.2 : 1, and the figure fills most of
it. None of those ideas survive being narrowed. They do not get worse
gracefully; they invert:

- Type placed beside her lands **on** her, and the layer it lives in sits
  behind her, so it disappears.
- A mark set wider than the frame loses a sixth of a six letter word rather
  than a few percent of a long one, and the crop stops reading as scale.
- A fragment sized as a fraction of the viewport's **width** shrinks against
  the frame's **height**, so the same number that reads as a display line at
  1440 reads as a caption adrift in a mostly empty frame at 390.

So the rule is not "make it fit". It is:

> **Every scene is authored twice.** The narrow values are a composition of
> their own, and the pair is never one composition at two sizes. Where the two
> disagree, the phone wins on the phone.

The comp-card beat has always worked this way and is the reference: see
`components/comp-card/motion.ts`, where `Stage<T>` gives every position, every
scale and every caption placement a `wide` and a `compact` value.

## 2. Where the boundary is

Two, and they mean different things. Do not collapse them.

| Query | Name in code | What it selects |
|---|---|---|
| `max-width: 1023px` | `isMobile` | No gutter beside the figure. Drives the camera: `FIGURE_DRIFT`, `FIGURE_SCALE`, `FIGURE_RISE`, `FIGURE_HANDOVER`, and the intelligence sequence's `compact` index. |
| `max-width: 767px` | `narrow` / `compact` | A phone. Drives the hero's chrome and wordmark, the comp-card stage, and the frame stride. |

The 768 to 1023 band (portrait tablets) currently takes the wide hero
composition, including the wordmark's bleed. That is **not** resolved: at 768
the mark loses about 17% of the word off each end. It is called out in §6.

## 3. The home stage on a phone

### 3.1 The shell

The wide hero carries its own rail: three routes left, the account cluster
right, held apart by a viewport of gutter. There is no gutter at 390. Laid out
there, the rail ran 15px past the right edge, `STUDIO+` and `LOG IN` touched,
and `Apply free` was cut in half.

The narrow stage does not take the rail. It takes the site's own navigation
pattern: **one `INDEX` mark in the top-right corner, opening the full index
panel.** Smaller, not squeezed, and it carries more than the rail did.

The wordmark is deliberately not set beside it. The opening frame's subject is
PHOLIO at display scale; setting the name again at 24px in the corner of that
frame is `lessons.md` §14.1.

### 3.2 The hand-over, and `data-hero-opening`

The home stage is one 1400vh `<section>` holding three scenes. `homeHeroActive`
measured that section, so the sitewide index marks were suppressed for its whole
length, and the hero's own chrome leaves two viewports in. On a phone that was
eleven viewports with no navigation, no wordmark and no way out of the page.

The narrow stage marks its opening with `data-hero-opening`, sized to
`HERO_OPENING_VH`, and the marks take over from there. Nothing marks the opening
on a wide stage, so `homeHeroActive` falls back to the section edge and the wide
behaviour is unchanged.

`condensed` is a separate question and follows `homeStageActive`, the section
edge, on both stages. Paper is what a header takes when it is over running body
copy; the home stage is one pinned cinematic frame the whole way down and has
none, and the band's gold sweep across it would be the rule `lessons.md` §11.3
rules out. So the bar keeps its scrim treatment for the length of the stage.

### 3.3 The mark

`WORDMARK` in `components/hero/motion.ts`. Wide keeps `28vw` and its bleed.
Narrow is `23.5vw`, measured: the painted glyphs of PHOLIO in Noto Serif Display
run about 4.2x the font size, so this sets the mark to the frame, complete, as a
lintel over her. It hangs at 9vh rather than 15vh, because at 15 the baseline
lands in her hair on a 390 frame.

### 3.4 The intelligence sequence

`components/intelligence/motion.ts`. The wide beats compose against horizontal
distance. The narrow beats cannot: the type layer is behind her, and on a phone
the only reliably readable region is the band above her head. Scattering the
wide placements into it put the closing verdict `date.` behind her hair for
most of its hold, which is exactly what `lessons.md` §13.3 forbids.

The narrow stage keeps the band and varies the **lockup inside it**, which is
where §13.2's three distinct compositions come from:

1. `sees the frame` — one line set to the full measure, left, one weight.
2. `Every agency, its own` / `set.` — split across the measure on one optical
   line, the quiet half left and the verdict right at four times its size. One
   sentence with a size jump, not two fragments at opposite corners
   (`lessons.md` §14.2).
3. `The wait` / `has a date.` — a hanging indent, the small half tucked
   under the large one at its baseline.

The band starts below the index marks. A line resting at 6% of a phone viewport
sits under the corner wordmark.

The camera closes harder here than on a wide stage, not less: a plate that fits
a 2.2 : 1 frame by width is only 0.78 of it tall at rest, so the narrow close
runs to 1.46 where the wide one runs to 1.72 of a larger base. `FIGURE_HANDOVER`
is measured against that and moves with it.

The background ribbon sets at 9vw, not 15. At 15 a single word was 580px across
a 390 frame and only two or three letterforms were ever on stage; a fragment of
a word at low opacity reads as a rendering artifact, not as depth.

### 3.5 The closing panel

Stacked one group per row, the four groups run about 2.2 viewports at 390. A
panel that takes three screens to read is a list of links again. The narrow
stage pairs them, Product / Company then Legal / Contact, and the apparatus
fits under the mark inside one viewport.

The three standing rules are wide-stage furniture. They are `hidden md:block`
and must stay that way: stacked, each one had a column on its left and nothing
at all on its right.

## 4. Performance, measured

Numbers from the home stage at 390x844 under a 4x CPU throttle, with the whole
sequence already downloaded so nothing waits on the network.

**Before.** Scrubbing the hero and intelligence beats held a *median* frame
time of 130ms, against 17ms across the comp-card beat immediately after it,
which scrubs no footage. 84 long tasks in one pass, the longest 168ms. A CPU
profile put 78% of samples in native work rather than in any script.

The cause is decode, not `drawImage`. 127 frames at 970x1640 is roughly 800MB
of decoded bitmap if a browser held them all, so it holds almost none, and every
scroll step decodes its frame again on the main thread.

**After.** `FRAME_STRIDE.narrow = 2` loads every second frame. Median frame time
17ms, long tasks 84 to 60, page weight 18.8MB to 13.9MB, requests 161 to 101.

Two things to know before touching this:

- It is **not** a timing change. Every cue in `motion.ts` is authored against
  the full `FRAMES` array and stays where it is; `draw` already snaps to the
  nearest frame it has, which is the same path that carries a slow network.
- Strides above 2 keep cutting long tasks (60 / 43 / 33 at strides 2 / 3 / 4)
  but the returns on frame time flatten, and the scrub visibly coarsens: at
  stride 4 the intelligence beat advances one frame per 200px of scroll.

## 5. Checks, for a narrow stage specifically

Run these in addition to `03-banned-ui.md` §12.

- [ ] At 360, 390 and 430: **nothing is clipped by a viewport edge.** Measure
      it, do not eyeball it; the failures were 15px overhangs inside an
      `overflow: hidden` parent, so `scrollWidth` stayed clean.
- [ ] **Every gold verdict word is fully legible at the position where its beat
      rests.** She occludes travelling type by design; she never occludes the
      word the beat turns on.
- [ ] **Copy clears the corner marks.** They occupy the top ~90px once the hero
      opening has left.
- [ ] **No frame is more than about a third empty field.** Emptiness on a phone
      is a composition that was authored for a wider one.
- [ ] The index opens, and is reachable, **at every scroll position**.
- [ ] Frame time under a 4x throttle: median at or under ~17ms across the
      scrubbed beats.
- [ ] The wide stage is unchanged. Screenshot 1440 before and after.
