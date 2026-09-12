import { cubicBezier } from "framer-motion";

/**
 * Tunable keyframes for the Studio+ beat: the camera leaves the card behind,
 * and the room it was lit in comes up until we are standing on her page.
 *
 * Everything before this on the stage was Pholio doing things with the book:
 * seeing the frame, composing the card, sending it out. This beat changes
 * worlds. The subject becomes Zofia, because what is shown from here is no
 * longer the book on Pholio but a site of one's own, and the site itself is
 * the demonstration.
 *
 * **The card is finished when this beat starts, and it stays finished.**
 * Nothing is printed on it, nothing opens out of it, and no part of this
 * chapter's identity is set on its stock. It is a completed artifact from
 * the chapter before. The way out of that chapter is to travel past it and
 * let the room change, which is why every move here is a camera, a light, or
 * a thing travelling — never a graphic applied to the card.
 *
 * The sequence, in order:
 *
 *   1. The light. The card is held out to us at the close of its own beat,
 *      finished, and it holds there while the room comes up around it:
 *      velvet to paper, on the curve a dimmer actually has — almost nothing
 *      for the first third, then quick, then settling into the cream. The
 *      film grain the dark carried goes with it. There is no edge anywhere
 *      in this. The field the last chapter stood on is the field this one
 *      stands on, at a different exposure, and for a moment the card is a
 *      printed sheet lying on a lit one: the same artifact, a new room.
 *   2. The lift. Then the camera travels forward and the card goes with the
 *      move: it grows as it passes the lens, drifts off axis as near things
 *      do, and leaves through the top of the frame, the way the figure left
 *      the hero. It is the same object it was, at a different distance.
 *   3. The mark. STUDIO+ is one thing — the word and its cross, never
 *      introduced apart — thrown up into the frame by the same scroll that
 *      sent the card out, crossing its exit: in fast, settling slow. It
 *      travels less far and changes size less than the card does, because
 *      it is the far thing in the frame and the card was the near one. That
 *      difference is the only depth cue the beat needs.
 *   4. The plus opens. Its arms extend until the cross divides the frame.
 *      As they extend the solid gold hollows to a hairline rim, and what is
 *      inside the rim is the first blank page of her site. The rim widens
 *      and turns as it widens, taking the letters from the centre outward,
 *      and inside it her masthead composes. When the rim has left the frame
 *      there is no word and no plus. The visitor is on her page and never
 *      saw it arrive.
 *   5. The walk. This page's scroll drives her page's scroll: masthead,
 *      statement, and along the book.
 *   6. The step back. The site recedes into a window on the stage's own
 *      paper, and one line stands beside it with one link.
 *
 * Every value is in timeline units, `t` in 0..1 across `SITE_VH` of scroll
 * (`components/hero/motion.ts`), and every stage value is authored twice,
 * wide and compact (`docs/design-language/08-narrow-stage.md`).
 */

/** In fast, settling slow. Things thrown up by the scroll. */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);
/** One ease for a move with two authored ends. */
export const glide = cubicBezier(0.65, 0, 0.35, 1);
/** Opening: gathers, then commits. */
export const open = cubicBezier(0.7, 0, 0.3, 1);
/**
 * Away. Eases off the mark and keeps accelerating, with no settle at the
 * end: a thing passing the lens is not arriving anywhere, and easing it out
 * both ends makes it park in the corner of the frame instead of leaving.
 */
export const away = cubicBezier(0.5, 0, 0.88, 0.42);

/** The same shared inertia as the card beat, so the two read as one stage. */
export const TIMELINE_SPRING = {
  stiffness: 180,
  damping: 32,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

export type StageKind = "wide" | "compact";
export type Stage<T> = { readonly wide: T; readonly compact: T };

// ── Phases ────────────────────────────────────────────────────────────────
//
// Read top to bottom: this is the beat. Pairs are [start, end].

export const T = {
  /** The card leaves: past the lens and up out of the frame. */
  lift: [0.14, 0.38],
  /** STUDIO+ is thrown up into the frame, crossing the card's exit. */
  lock: [0.22, 0.5],
  /** The plus opens: arms, then the rim widens, turning as it goes. */
  grow: [0.56, 0.76],
  /** Her masthead composes inside the opening. */
  compose: [0.62, 0.8],
  /** Her page scrolls under this page's scroll. */
  walk: [0.82, 0.9],
  /** The step back, into the window. */
  stepBack: [0.9, 0.945],
  /** The line and the link arrive beside it. */
  end: [0.925, 0.98],
} as const;

/**
 * Inside the opening, as fractions of `T.grow`: where the arms finish
 * extending, where the solid has hollowed to its rim, where the rim starts
 * widening, and where the turn runs.
 */
export const OPENING = {
  armsEnd: 0.4,
  hollowEnd: 0.36,
  widenStart: 0.36,
  turn: [0.1, 0.96] as const,
  turnDegrees: 34,
} as const;

/**
 * The header stands down from early in the light, before the field is bright
 * enough for a bar sampled against velvet to be wrong, until the stage
 * unpins into the closing panel, which stands it down itself. Measured
 * against the same 40% line the closing panel uses, via the same hook
 * (`components/header/kit.tsx`, `useFooterTakeover`): a `data-footer-trigger`
 * marker at the top of the stage during the takeover and at its foot
 * otherwise, where it coincides with the closing panel's own trigger once
 * the stage unpins.
 */
export const TAKEOVER = {
  start: 0.05,
  end: 1.01,
} as const;

// ── Fields ────────────────────────────────────────────────────────────────

export const CREAM = "#FAF7F2";
export const INK = "#0f172a";
export const GOLD_ON_PAPER = "#A8894E";
/** Her paper, warmer than the stage's, so the window reads as another sheet. */
export const SITE_PAPER = "#F2EFE9";

// ── The light ─────────────────────────────────────────────────────────────

/**
 * The room coming up, authored as the stage's own field at a rising
 * exposure rather than as a mix toward white.
 *
 * Two reasons it is a curve with four stops and not two. A dimmer on a
 * paper surface holds near black for the first third of its travel and then
 * moves fast, so a linear ramp reads as a cross-fade between two colours
 * rather than as a light. And a straight interpolation from velvet to cream
 * passes through a blue neutral, which is not a colour this site has: these
 * stops are the cream itself, underexposed, so every frame of the travel is
 * warm.
 *
 * `at` is in this beat's timeline; the two are one table, read together.
 */
export const LIGHT = {
  at: [0.02, 0.06, 0.095, 0.12, 0.14] as const,
  field: ["#050505", "#140F0C", "#2E261F", "#6E6459", CREAM] as const,
} as const;

/** The dark room's film grain, gone by the time the paper is lit. */
export const GRAIN = { from: 0.02, to: 0.1 } as const;

// ── The card's exit ───────────────────────────────────────────────────────

/**
 * Applied to the whole card layer, so the book gathered behind the lead
 * leaves with it and the scene keeps one object where it had one object.
 *
 * The scale is the camera still travelling forward — the card passes the
 * lens, it does not shrink away — and the layer scales about the frame's
 * centre, so the card, which rests off centre, drifts outward as it grows
 * the way a near thing does under a dolly. The rise is measured against the
 * card's own height at that scale, so its bottom edge clears the top of the
 * frame rather than parking just past it (`lessons.md` §20.2).
 */
export const LIFT: Stage<{ rise: number; scale: number }> = {
  wide: { rise: -122, scale: 1.46 },
  compact: { rise: -108, scale: 1.34 },
};

// ── The mark ──────────────────────────────────────────────────────────────
//
// STUDIO+ in tracked caps of the display serif, the word filled with a navy
// duotone cut from the taffeta of the dress she stands in when her site
// composes, and the plus in gold, the serif's own cross, drawn geometrically
// from the glyph's measurements so that it can open.
//
// The word and the plus are one mark. They arrive together, on one
// transform, and nothing in this beat ever shows one without the other.

export const WORDS = {
  name: "STUDIO",
  /** For readers who do not see the mark move. */
  label: "Studio+",
  tracking: "0.05em",
  /**
   * The face's baseline and its cap midline, as fractions of the em from the
   * top of a line box set with line-height 1. Measured off the face.
   */
  baseline: 0.888,
  capMid: 0.538,
  /** The cap midline, in vh. Also the plus's centre line. */
  axis: { wide: 50, compact: 44 } as Stage<number>,
  size: { wide: "12.4vw", compact: "15.2vw" } as Stage<string>,
  /** The mark's right edge, in vw, before the plus. */
  right: { wide: 71.5, compact: 78 } as Stage<number>,
  fill: "/studio-plus/taffeta-navy.webp",
  fillUnder: "#101a33",
} as const;

export const PLUS = {
  /** Measured off the face at 200px: ink 85 wide, stroke 5, centre 0.36em above the baseline. */
  halfLen: 0.2125,
  halfThick: 0.0125,
  /** Its centre, in em of the mark, from the mark's right edge. */
  after: 0.34,
  rim: 1.5,
  reach: 0.62,
} as const;

/**
 * The mark's arrival, as one object: how far below its place it starts, in
 * vh, and the size it starts at. The rise clears the frame — the mark is
 * outside the composition before it is in it, never sitting low in it
 * waiting (`lessons.md` §18). Both are small next to `LIFT`, and that is
 * the point — the card is the near thing and the mark is the far one, so the
 * same camera moves it less. Scaling about the lockup's own centre, not the
 * word's, is what keeps the plus attached to the word through the travel.
 */
export const LOCK: Stage<{ rise: number; scale: number }> = {
  wide: { rise: 72, scale: 0.9 },
  compact: { rise: 70, scale: 0.9 },
};

// ── The site ──────────────────────────────────────────────────────────────

type Place = { scale: number; x: number; y: number };

export const WINDOW: Stage<Place> = {
  wide: { scale: 0.54, x: 41, y: 23 },
  compact: { scale: 0.44, x: 28, y: 8 },
};

// ── The walk ──────────────────────────────────────────────────────────────

export const DRIVE_STOPS = [0, 0.2, 0.32, 0.42, 1] as const;

export type SiteMarks = {
  hero: number;
  statement: number;
  book: number;
  bookRun: number;
  height: number;
  wide: boolean;
};

export function driveTargets(m: SiteMarks): number[] {
  const bookWalk = m.wide ? m.bookRun * 0.62 : m.hero * 2.4;
  return [0, m.hero * 0.98, m.statement + m.hero * 0.28, m.book, m.book + bookWalk];
}

// ── The end ───────────────────────────────────────────────────────────────

export const END = {
  head: ["Not a profile. A ", "site", "."] as const,
  open: "Open Zofia's site",
} as const;

// ── Geometry ──────────────────────────────────────────────────────────────

export function plusPoints(cx: number, cy: number, l: number, t: number, deg: number): [number, number][] {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const raw: [number, number][] = [
    [-l, -t], [-t, -t], [-t, -l], [t, -l], [t, -t], [l, -t],
    [l, t], [t, t], [t, l], [-t, l], [-t, t], [-l, t],
  ];
  return raw.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}

export function polygon(points: [number, number][]): string {
  return `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
}

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
