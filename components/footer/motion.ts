/**
 * The signing.
 *
 * One sentence (lessons.md §36.1): **the page's last words settle, the stroke
 * is drawn across, and the name is set down on it.** Then nothing moves again.
 *
 * Two mechanisms, and each is named because a surface is allowed one and every
 * extra has to be argued out loud (lessons.md §17.1):
 *
 *  1. **Travel.** Everything that is not the stroke arrives by moving a short
 *     distance and settling. Nothing fades, nothing scales, nothing is ever at
 *     partial opacity (lessons.md §26.1), and every element is on the stage
 *     from the first frame, so there is no frame in which a piece of the
 *     composition is missing.
 *  2. **The stroke.** The sweep is drawn, left to right. This is the one
 *     gesture the footer owns, and it is the reason the mark can sign at 64px
 *     instead of 300: the line is what is being signed, so the signature does
 *     not have to be large to be the subject.
 *
 * ── On repeating the gold sweep ────────────────────────────────────────────
 *
 * `lessons.md` §2 rules that the sweep is the header's and must not be pasted
 * onto a second surface. **Overruled by the owner on 2026-09-25**, who asked
 * for the sweep specifically and as the footer's central motion gesture. The
 * ruling's actual requirement, that a shared accent be reinterpreted at lower
 * volume rather than repeated literally, is met by `STROKE`: the header's is a
 * symmetric gradient because it is an edge; the footer's is directional
 * because it is a gesture, full where the pen is set down and lifting to
 * nothing as it leaves. The two are the same asset doing two different jobs,
 * which is what kept them from competing.
 */

import { cubicBezier } from "framer-motion";

/* ══════════════════════════════════════════════════════════════════════
   THE BEATS

   A timeline in seconds, played once when the footer comes into view, and
   **not** tied to scroll position.

   Scroll-tying was tried first and is wrong for this surface, for a reason
   worth recording: the footer is about 550px tall and sits at the end of the
   document, so by the time its signature row is on screen there are only about
   160px of scroll left before the page stops. A gesture authored against that
   range either plays out below the fold or has to be crammed into the last
   flick of the wheel. `04-scroll-craft.md` §1 puts it as a question: does the
   scroll reveal something, or just move it? Here it would only move it.

   So the trigger is the footer entering the frame, and the choreography is in
   time. This is also what `lessons.md` §8 already blessed for this surface, and
   what the industry sample's one departure was granted for: a closing gesture
   has to be arrived at.

   The beats overlap on purpose. Three that start and stop cleanly would be
   three states, and a visitor would see the states rather than the change
   (lessons.md §36). The name begins to settle while the contents still are, and
   the stroke starts before the name has landed, so the whole thing is one
   gesture over about 1.7 seconds. Then nothing on this surface ever moves again.

   **The stroke is last, and that is the point.** It was second in the first
   build, which made the name land on a line already drawn and read as a
   wordmark acquiring an underline. Signing and then closing is the true order
   of the gesture: the name is put down, and the line is drawn under the whole
   frame to finish it.
   ══════════════════════════════════════════════════════════════════════ */

export const BEAT = {
  /** The page's last words come to rest. */
  contents: { delay: 0, duration: 0.92 },
  /** The name is set down. */
  name: { delay: 0.3, duration: 0.78 },
  /** The pen crosses the measure, and the frame is closed. */
  stroke: { delay: 0.58, duration: 1.15 },
} as const;

/**
 * How much of the footer has to be in the frame before the signing starts.
 *
 * Low enough that the gesture begins as the surface arrives rather than after
 * it has sat there, high enough that it is not triggered by the first pixel of
 * a footer still a screen away.
 */
export const TRIGGER_AMOUNT = 0.3;

/**
 * In fast, settling long. The house arrival curve: a thing coming to rest with
 * no overshoot anywhere, because the page's own physics cannot overshoot either
 * (lessons.md §45.2).
 */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);

/**
 * The stroke's own curve, and the one place this surface does not use `arrive`.
 * A pen is at rest before it moves: it accelerates off the left margin, runs,
 * and lifts. `arrive` starts at full speed, which is right for something the
 * scroll threw and wrong for something a hand began.
 */
export const stroke = cubicBezier(0.65, 0, 0.3, 1);

/* ══════════════════════════════════════════════════════════════════════
   THE TRAVEL

   Short distances. Everything here is already in the frame and settling into
   place; nothing is making an entrance from off stage, because a footer that
   performs an entrance on every page of the site is a footer that performs.
   ══════════════════════════════════════════════════════════════════════ */

/** How far the contents rise into place, in px. */
export const CONTENTS_RISE = 40;

/**
 * How far the name is set down, in px, and it comes from above.
 *
 * A signature is put down onto the paper, not lifted onto it. Descending and
 * decelerating reads as weight; rising reads as a reveal, which is the move
 * `lessons.md` §18 retired.
 */
export const NAME_FALL = 18;

/* ══════════════════════════════════════════════════════════════════════
   THE STROKE
   ══════════════════════════════════════════════════════════════════════ */

/**
 * The sweep, re-aimed for this surface.
 *
 * The header's is `transparent → gold → transparent`, symmetric, because it is
 * the bottom edge of a band and an edge has no direction. A stroke does: it is
 * full where the nib is set down, carries at full pressure through the
 * signature and most of the measure, and lifts off over the last third. The
 * short transparent lead-in keeps it from butting hard against the left margin,
 * which would read as a border rather than as a mark made.
 *
 * The lift starts at 68%, not at the midpoint. At the midpoint the stroke has
 * faded to nothing by about two thirds of the measure and reads as a stub that
 * ran out rather than as a line that was lifted, and the signature ends up
 * sitting on the only solid part of it.
 *
 * `--footer-gold` tracks the paper, so the stroke is #C9A55A on the velvet and
 * the dark gold on cream, where #C9A55A manages about 2:1 and disappears.
 */
export const STROKE_GRADIENT =
  "linear-gradient(to right, transparent 0%, var(--footer-gold) 1.5%, var(--footer-gold) 68%, transparent 100%)";

/**
 * The drawing edge, as a clip.
 *
 * The stroke is revealed left to right by an inset that retreats to zero, so
 * the gradient itself never moves or distorts: what travels is the nib. Scaling
 * the element instead would squeeze the whole gradient into the drawn part, and
 * a complete miniature sweep growing to full width is a line being stretched,
 * not a line being drawn.
 */
export const STROKE_CLIP = {
  undrawn: "inset(0 100% 0 0)",
  drawn: "inset(0 0% 0 0)",
} as const;

/* ══════════════════════════════════════════════════════════════════════
   THE FRAME
   ══════════════════════════════════════════════════════════════════════ */

/**
 * With `line-height: 1` the baseline sits this far above the line box's foot in
 * Noto Serif Display, so the mark is pushed down by it to put its baseline
 * exactly on the 1px stroke. The O's overshoot then dips a hair below the line,
 * which is how a round letter is drawn against a rule and what stops the
 * signature from looking aligned rather than written.
 */
export const BASELINE_DROP_EM = 0.112;

/* ══════════════════════════════════════════════════════════════════════
   THE SEPARATION

   How far the stroke sits from the name, measured from the name's baseline
   rather than from its box, and how far the utilities sit below the stroke.

   The first build put the baseline **on** the stroke. It was the literal
   reading of "signed on a line" and it was wrong: at 64px against a 1px rule
   the eye does not see a signature resting on a line, it sees a wordmark with
   an underline, and the sweep stops being a gesture and becomes part of the
   logotype.

   `SIGN_GAP` is about one cap height of the mark at every width, which is the
   distance at which the two stop being read as one object. `RULE_GAP` is a
   little less, so the stroke is not equidistant between the name and the small
   print: it hangs slightly nearer the print it closes off, and belongs to the
   frame rather than to either group.
   ══════════════════════════════════════════════════════════════════════ */

export const SIGN_GAP = "clamp(30px, 3.3vw, 48px)";
export const RULE_GAP = "clamp(22px, 2.3vw, 34px)";
