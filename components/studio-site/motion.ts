import { cubicBezier } from "framer-motion";

/**
 * Tunable keyframes for the Studio+ beat: we push into the card, and the
 * plus is the door into Zofia's site.
 *
 * Everything before this on the stage was Pholio doing things with the book:
 * seeing the frame, composing the card, sending it out. This beat changes
 * worlds. The subject becomes Zofia, because what is shown from here is no
 * longer the book on Pholio but a site of one's own, and the site itself is
 * the demonstration.
 *
 * The sequence, in order:
 *
 *   1. The push. The card is held out to us at the close of its own beat.
 *      It begins at the one part of the card that is already blank stock:
 *      the masthead band its name is printed in. The band opens down the
 *      card's face, taking the photograph, and then the whole card comes
 *      toward the viewer, its rounded corners sweeping outward, until the
 *      card's own stock is the whole frame and we are inside it. There is
 *      no wipe and no boundary, and nothing is swapped for anything: the
 *      material never changes, only the distance. The card is paper, and
 *      the page it becomes is the same paper. The mark takes the place of
 *      the name in the band and comes with it, settling into its own size
 *      as the paper lands: STUDIO in caps cut from the navy of her
 *      taffeta.
 *   2. The plus. Gold, the serif's own cross, in along the axis. Punctuation.
 *   3. The plus opens. Its arms extend until the cross divides the frame.
 *      As they extend the solid gold hollows to a hairline rim, and what is
 *      inside the rim is the first blank page of her site. The rim widens
 *      and turns as it widens, taking the letters from the centre outward,
 *      and inside it her masthead composes. When the rim has left the frame
 *      there is no word and no plus. The visitor is on her page and never
 *      saw it arrive.
 *   4. The walk. This page's scroll drives her page's scroll: masthead,
 *      statement, and along the book.
 *   5. The step back. The site recedes into a window on the stage's own
 *      paper, and one line stands beside it with one link.
 *
 * One mechanism carries the whole entrance: a camera travelling forward.
 * Nothing fades, nothing wipes, nothing slides in from an edge.
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
 * The push. A camera does not travel linearly toward a thing: it eases off
 * the mark, accelerates as the subject fills more of the frame, and settles
 * long. This is the shape of that, and it is why the move reads as distance
 * rather than as a shape growing.
 */
export const push = cubicBezier(0.62, 0, 0.28, 1);

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
  /** Into the card: its paper grows until it is the frame. */
  push: [0.03, 0.26],
  /** The mark comes with it, and settles a little after the paper lands. */
  mark: [0.03, 0.3],
  /** The plus arrives along the axis. Then the mark is read. */
  plusIn: [0.33, 0.42],
  /** The plus opens: arms, then the rim widens, turning as it goes. */
  grow: [0.5, 0.72],
  /** Her masthead composes inside the opening. */
  compose: [0.57, 0.76],
  /** Her page scrolls under this page's scroll. */
  walk: [0.79, 0.89],
  /** The step back, into the window. */
  stepBack: [0.89, 0.94],
  /** The line and the link arrive beside it. */
  end: [0.92, 0.98],
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
 * The header stands down from the moment the card's paper has taken the
 * frame until the stage unpins into the closing panel, which stands it down
 * itself. Measured against the same 40% line the closing panel uses, via
 * the same hook (`components/header/kit.tsx`, `useFooterTakeover`): a
 * `data-footer-trigger` marker at the top of the stage during the takeover
 * and at its foot otherwise, where it coincides with the closing panel's
 * own trigger once the stage unpins.
 */
export const TAKEOVER = {
  start: T.push[1] - 0.04,
  end: 1.01,
} as const;

// ── Fields ────────────────────────────────────────────────────────────────

export const CREAM = "#FAF7F2";
export const INK = "#0f172a";
export const GOLD_ON_PAPER = "#A8894E";
/** Her paper, warmer than the stage's, so the window reads as another sheet. */
export const SITE_PAPER = "#F2EFE9";

// ── The card ──────────────────────────────────────────────────────────────
//
// The push starts from the lead card's rest position, read off
// `[data-lead-card]` once the card beat has settled. If the visitor arrives
// too fast for a reading, this is the card's authored rest, from
// `components/comp-card/motion.ts` (READY_X, READY_Y, READY_SCALE) and the
// card's width classes.

export const CARD_FALLBACK: Stage<{ cx: number; dy: number; w: number }> = {
  /** cx as a fraction of the width; dy in px off the frame's centre line. */
  wide: { cx: 0.62, dy: -2, w: 22.75 * 16 * 1.12 },
  compact: { cx: 0.5, dy: -44, w: 16 * 16 * 1.04 },
};
export const CARD_ASPECT = 5.5 / 8.5;

/**
 * The card's own corner radius, and the width its stock is set at, both from
 * `components/comp-card` (`rounded-[0.55rem]`, and the `CARD_WIDTH` classes).
 * The radius is a fixed rem on a card that is scaled, so it is recovered as
 * a ratio of the width actually measured. The corners are the whole tell of
 * the push: they are what says this is the card coming toward us and not a
 * rectangle being drawn.
 */
export const CARD_RADIUS_PX = 0.55 * 16;
export const CARD_BASE_W: Stage<number> = { wide: 22.75 * 16, compact: 16 * 16 };

/**
 * Where the lead edition's masthead band ends, as a fraction of the card's
 * height: the strip of blank stock its name is printed in, measured off
 * `ola-editorial-masthead-front.png` and shared with
 * `components/comp-card/motion.ts` (MASTHEAD_BAND). The push starts here
 * because it is the only part of the card that is already this paper.
 */
export const CARD_BAND = 220 / 1632;

/** How much of the push opens the band down the card's face. */
export const BAND_OPEN = 0.2;

// ── The mark ──────────────────────────────────────────────────────────────
//
// STUDIO in tracked caps of the display serif, filled with a navy duotone
// cut from the taffeta of the dress she stands in when her site composes.
// Then the plus, gold, the serif's own cross, drawn geometrically from the
// glyph's measurements so that it can open.

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
  /**
   * How much of the card's width the mark spans when it is still printed on
   * the card at the start of the push. Small: it is a line on a comp card.
   */
  onCard: 0.62,
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
