# Scroll craft

How to build the scroll-driven sections this site is made of, without producing
the thing that merely looks like them.

The distinction that matters: award-winning scroll sites are not sites with more
animation. Awwwards scores on Design, Usability, Creativity and Content, and the
consistent finding across 2025–26 winners is that **motion is choreography with
meaning** — transitions that carry an idea, sequences that pace a story — and
that sites holding 60fps with a functional fallback outscore sites that look
spectacular on a desktop and stutter on a mid-range Android. Decoration loses to
direction.

---

## 1. Before any code: the one-idea test

A scroll section earns its complexity by having exactly one thing to say. Write
it as a sentence first. If the sentence needs an "and", it is two sections.

Then: **does the scroll reveal something, or does it just move something?**

- *Reveals*: a comp card turning to show its back. A portfolio filling as you
  scroll. A measurement resolving. The scroll is doing the explaining.
- *Just moves*: elements sliding in from the left because they were off-screen.
  Parallax on a background. A counter ticking up.

The second category is the entire failure mode. If the scroll can be replaced
by a static image with no loss of meaning, ship the static image.

---

## 2. Pick the lightest tool that does the job

Three tools, in order of preference. Reach for the heaviest one only when the
lighter ones genuinely cannot do it.

### CSS scroll-driven animations — the default for reveals

`animation-timeline: view()` and `scroll()`. Roughly 84% global support as of
mid-2026 (Chrome/Edge 115+, Safari 18+, Firefox 132+), and — the reason it
matters — **animations of `transform` and `opacity` run on the compositor
thread**, off the main thread entirely. No scroll listener, no layout work, no
INP cost.

Use it for: entrance reveals, staggered arrivals, progress rules, anything that
maps "how far through the viewport is this element" to opacity or transform.

Degradation is free: browsers without support simply show the element in its
final state, which is exactly the correct fallback.

### Framer Motion `useScroll` / `useTransform` — for bound values

Already a dependency and already used by the preserved surfaces. Use it when a
scroll position needs to drive several related values at once, or when the value
has to feed React state.

### GSAP ScrollTrigger — only for pinning and complex scrubbed timelines

About 25KB gzipped, and it runs on the main thread. **CSS scroll-driven
animation deliberately cannot pin an element** — pinning is not in the spec — so
a section that holds an element in place while the page scrolls past it needs
GSAP, and that is the main legitimate reason to load it.

Use it for: pinned sections, scrubbed multi-beat timelines, sequences where beat
three depends on beat one's end state.

### Banned outright

**`window.addEventListener("scroll", …)` for animation.** It fires on every
scroll frame on the main thread with no batching, and it is the single most
common source of jank. Every case it covers is covered better by one of the
three tools above or by `IntersectionObserver`.

The one sanctioned exception already in the codebase is the header's field
sampler, which listens passively and immediately defers to
`requestAnimationFrame`, cancelling any pending frame. If you need to read the
DOM on scroll, copy that shape.

---

## 3. Non-negotiable performance rules

**Animate `transform` and `opacity`. Nothing else.** Animating `width`,
`height`, `top`, `left`, `margin`, or `padding` triggers layout on every frame.
This is also the design rule from foundations §6 — nothing reflows on scroll —
which is convenient: the thing that looks right is the thing that runs fast.

**Budget your compositor layers.** `will-change` and `transform: translateZ(0)`
promote an element to its own layer. A handful is an optimisation; twenty is a
memory problem that will crash Safari on an older iPhone. Promote the element
that actually animates, not its container.

**Test on a throttled mid-range device, not on this laptop.** A scroll scene
that is smooth in dev and stutters on a three-year-old Android has failed, and
the audience for this site is largely arriving from Instagram and TikTok on
phones.

**Images: `next/image`, explicit dimensions, and a real `sizes`.** Layout shift
during a scroll sequence is far more visible than layout shift on a static page.

---

## 4. Reduced motion is a second design, not a switch

`useReducedMotion()` in every animated component. This is stated in foundations
§6 and repeated here because scroll sections are where it is most often faked.

**A 0.01s version of a scrub is not a fallback.** If the scroll drives a
four-beat sequence, the reduced-motion version is a static composition that
shows all four beats, or the final state with the information intact. The
content must survive the animation never running.

Practically: branch early, return a different composition, don't sprinkle
conditional durations through one shared tree.

---

## 5. Section anatomy

Conventions for anything new under `components/`:

```
components/<section-name>/
  index.tsx        the section, mounted by a page
  <Beat>.tsx       one file per beat when a sequence has distinct scenes
  motion.ts        the tunable keyframes for this section, exported and named
```

**Put the tunable numbers at the top, named and exported.** Rotation, scale, and
translate keyframes buried inline three levels into JSX cannot be art-directed.
The person tuning the feel of a scene should be able to find every number in one
place.

**Mark the hero.** Any section acting as the home hero needs `data-hero-chrome`
on an element inside its `<section>`, or the header will never reveal. See
[`02-preserved-surfaces.md`](02-preserved-surfaces.md) §1.

**Give the section an opaque background.** The header's polarity sampler needs
an effective alpha ≥ 0.85 to read the paper under the bar. A section that fades
its own background in will make the header hold the wrong polarity for a full
viewport of scroll.

---

## 6. What actually separates the good ones

Distilled from the 2026 award-winner analyses, and worth re-reading before
starting a section:

**Art direction over decoration.** Every type choice, colour, and grid decision
serves one idea. The test: **freeze the scene at any scroll position and screenshot
it. Is that frame a designed composition?** If a scene only works in motion, the
motion is carrying a page that has nothing underneath it.

**Pacing is content.** A sequence has beats with different lengths. Even
distribution across scroll distance reads as mechanical. Let a moment hold.

**Reward attention, don't demand it.** Micro-interactions that pay off on hover
or on arrival are what raise dwell time. Sequences that block reading until an
animation completes are what raise bounce.

**Restraint scores.** The header's thesis — that the most premium thing a piece
of chrome can do is get out of the way — generalises. The sections that land are
the ones confident enough to hold still.
