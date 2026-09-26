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

   Positions in the footer's own arrival, 0 when its top edge reaches the
   bottom of the viewport and 1 at the document's maximum scroll.

   They overlap on purpose. Three beats that start and stop cleanly would be
   three states, and a visitor would see the states rather than the change
   (lessons.md §36). The stroke begins while the contents are still settling
   and the name lands as the stroke lifts, so the whole thing is one continuous
   gesture with a beginning, a middle and an end.

   Everything is finished by 0.96, so the last of the scroll is spent on a
   frame that is already completely still.
   ══════════════════════════════════════════════════════════════════════ */

export const BEAT = {
  /** The page's last words come to rest. */
  contents: [0.0, 0.46],
  /** The pen crosses the measure. */
  stroke: [0.3, 0.9],
  /** The name is set down on the line. */
  name: [0.42, 0.96],
} as const;

/**
 * In fast, settling long. The house arrival curve: a thing thrown up by the
 * scroll and coming to rest, with no overshoot anywhere, because the page's
 * physics cannot overshoot either (lessons.md §45.2).
 */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);

/**
 * The stroke's own curve, and the one place this surface does not use
 * `arrive`. A pen is at rest before it moves: it accelerates off the left
 * margin, runs, and lifts. `arrive` starts at full speed, which is right for
 * something the scroll threw and wrong for something a hand began.
 */
export const stroke = cubicBezier(0.65, 0, 0.3, 1);

export function at(
  p: number,
  [from, to]: readonly [number, number],
  ease: (t: number) => number,
): number {
  if (p <= from) return 0;
  if (p >= to) return 1;
  return ease((p - from) / (to - from));
}

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
 * full where the nib is set down, carries through the signature, and lifts off
 * to nothing. The short transparent lead-in keeps it from butting hard against
 * the left margin, which would read as a border rather than as a mark made.
 *
 * `--footer-gold` tracks the paper, so the stroke is #C9A55A on the velvet and
 * the dark gold on cream, where #C9A55A manages about 2:1 and disappears.
 */
export const STROKE_GRADIENT =
  "linear-gradient(to right, transparent 0%, var(--footer-gold) 2.5%, var(--footer-gold) 42%, transparent 100%)";

/**
 * The drawing edge, as a clip.
 *
 * The stroke is revealed left to right by an inset that retreats to zero, so
 * the gradient itself never moves or distorts: what travels is the nib. Scaling
 * the element instead would squeeze the whole gradient into the drawn part, and
 * a complete miniature sweep growing to full width is a line being stretched,
 * not a line being drawn.
 */
export const strokeClip = (p: number) =>
  `inset(0 ${((1 - p) * 100).toFixed(3)}% 0 0)`;

/* ══════════════════════════════════════════════════════════════════════
   THE FRAME
   ══════════════════════════════════════════════════════════════════════ */

/** The mark's size. Restrained on purpose: the line is the subject, and the
    signature's authority comes from sitting on it. */
export const MARK = { wide: 64, narrow: 42 } as const;

/**
 * With `line-height: 1` the baseline sits this far above the line box's foot in
 * Noto Serif Display, so the mark is pushed down by it to put its baseline
 * exactly on the 1px stroke. The O's overshoot then dips a hair below the line,
 * which is how a round letter is drawn against a rule and what stops the
 * signature from looking aligned rather than written.
 */
export const BASELINE_DROP_EM = 0.112;
