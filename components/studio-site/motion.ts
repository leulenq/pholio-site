import { cubicBezier } from "framer-motion";

/**
 * Tunable keyframes for the Studio+ beat: where the narrative changes worlds.
 *
 * Everything before this on the stage was Pholio doing things with the book:
 * seeing the frame, composing the card, sending it out. This beat is a break,
 * not a continuation. The stage goes from velvet to light, the pace opens
 * up, and the subject becomes a different talent, Zofia, because what is
 * being shown is no longer the book on Pholio but a site of one's own,
 * authored and published, and the site itself is the demonstration.
 *
 * The moves, in order:
 *
 *   1. The light. Cream rises from the foot of the stage, edge to edge,
 *      carrying "Studio+" at its head, ink on paper at viewport scale. As it
 *      rises it covers the card story; at every position the frame is a
 *      clean split, velvet and the card above the edge, paper and the word
 *      below it. When the light fills the frame the word holds at the
 *      centre and the header stands down. The world has changed in front
 *      of the visitor, not at a boundary.
 *   2. The lines. Two lines arrive beneath the word, with air around them.
 *   3. The site. Word and lines leave upward. Zofia's page arrives from
 *      below as a small live object on the paper, holds, then grows until it
 *      is the viewport. The visitor is on her site.
 *   4. The walk. This page's scroll drives her page's scroll: masthead,
 *      statement, and along the book.
 *   5. The step back. The site recedes into a window, still live, and one
 *      line stands beside it with one link. Nothing else: the site was the
 *      argument.
 *
 * Physical rules are the stage's (`lessons.md` §17, §18, §26): everything
 * arrives from below the frame or is covered by something opaque; nothing
 * fades.
 *
 * Every value is in timeline units, `t` in 0..1 across `SITE_VH` of scroll
 * (`components/hero/motion.ts`), and every stage value is authored twice,
 * wide and compact (`docs/design-language/08-narrow-stage.md`).
 */

/** In fast, settling slow. Things thrown up by the scroll. */
export const arrive = cubicBezier(0.22, 1, 0.36, 1);
/** One ease for a move with two authored ends. */
export const glide = cubicBezier(0.65, 0, 0.35, 1);

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
  /** The light rises, the word at its head, and fills the frame. */
  light: [0.05, 0.22],
  /** The two lines arrive beneath the word. */
  lines: [0.27, 0.35],
  /** Word and lines leave upward, and are gone... */
  introOut: [0.42, 0.5],
  /** ...before her page arrives from below, small, to the centre. */
  siteIn: [0.5, 0.58],
  /** Entered: it grows until it is the viewport. */
  approach: [0.62, 0.71],
  /** Her page scrolls under this page's scroll. */
  walk: [0.72, 0.9],
  /** The step back, into the window. */
  stepBack: [0.9, 0.96],
  /** The closing copy arrives beside it. */
  close: [0.93, 0.99],
} as const;

/**
 * The header stands down for the whole of the light world: from the moment
 * the light reaches the top of the frame until the stage unpins into the
 * closing panel, which stands it down itself. On the home stage the bar
 * keeps its velvet scrim for the length of the stage (`components/header/
 * kit.tsx`), which is right for the velvet beats and wrong over paper; and
 * arriving somewhere new is the point of this beat. Measured against the
 * same 40% line the closing panel uses, via the same hook
 * (`useFooterTakeover`): a `data-footer-trigger` marker that sits at the top
 * of the stage during the takeover and at its foot otherwise, where it
 * coincides with the closing panel's own trigger once the stage unpins.
 */
export const TAKEOVER = {
  start: T.light[1] - 0.03,
  end: 1.01,
} as const;

// ── Fields ────────────────────────────────────────────────────────────────

/** The stage's paper once the light has arrived. Pholio cream. */
export const PAPER = "#FAF7F2";
/** Ink on that paper. */
export const INK = "#0f172a";
/** The gold, and the gold that holds contrast on cream. */
export const GOLD = "#C9A55A";
export const GOLD_ON_PAPER = "#A8894E";

// ── The word ──────────────────────────────────────────────────────────────

export const WORD = {
  text: "Studio",
  mark: "+",
  /** Set to the frame: on a wide stage it is a little over four fifths of the width. */
  size: { wide: "clamp(6rem, 22vw, 26rem)", compact: "clamp(4.5rem, 24vw, 9rem)" } as Stage<string>,
  /**
   * Where its centre line sits while it holds, in vh from the top. The word
   * rides the light, so this is also how far below the light's edge it is
   * printed while the light rises.
   */
  top: { wide: 44, compact: 40 } as Stage<number>,
} as const;

// ── The lines ─────────────────────────────────────────────────────────────
//
// The break, said once. The first line is what the stage has been about;
// the second is what changes here. "Published" is the verb because it is
// the true one: a site is a publication, and the book is its edition.

export const LINES = {
  first: "Until now, your book has been kept.",
  second: ["From here, it is ", "published", ", under your name."] as const,
  /** Where the block sits, in vh from the top. */
  top: { wide: 66, compact: 60 } as Stage<number>,
} as const;

// ── The site ──────────────────────────────────────────────────────────────
//
// The sheet is always a full viewport; the small states are the sheet at a
// smaller scale, translated so the whole of it sits where it should.
// Transform origin is the top left, so x and y are its own top left, in
// vw and vh.

type Place = { scale: number; x: number; y: number };

export const SITE: {
  /** Arrived, small, centred on the paper. */
  arrived: Stage<Place>;
  /** Stepped back: beside the closing copy (below it, on a phone). */
  window: Stage<Place>;
} = {
  arrived: {
    wide: { scale: 0.5, x: 25, y: 25 },
    compact: { scale: 0.62, x: 19, y: 19 },
  },
  window: {
    wide: { scale: 0.54, x: 41, y: 23 },
    compact: { scale: 0.44, x: 28, y: 8 },
  },
};

/** Her paper, slightly warmer than this stage's, so the small site reads as an object on it. */
export const SITE_PAPER = "#F2EFE9";

// ── The walk ──────────────────────────────────────────────────────────────
//
// Where her page is, as a fraction of the walk, against the marks her page
// reports (`useSiteFrame.ts`). The masthead's cover is felt, the statement
// is read, and the book gets the long middle, because the book is what a
// site is for.

export const DRIVE_STOPS = [0, 0.2, 0.32, 0.42, 1] as const;

export type SiteMarks = {
  /** The masthead's own scroll, one viewport. */
  hero: number;
  /** Document offsets of the statement and the book. */
  statement: number;
  book: number;
  /** How far the book's track runs, in px of scroll. */
  bookRun: number;
  height: number;
  wide: boolean;
};

export function driveTargets(m: SiteMarks): number[] {
  // Wide, the book is a sideways track and reports its run. Narrow, the
  // book stacks and reports none, so the walk goes down it by viewports.
  const bookWalk = m.wide ? m.bookRun * 0.62 : m.hero * 2.4;
  return [0, m.hero * 0.98, m.statement + m.hero * 0.28, m.book, m.book + bookWalk];
}

// ── The close ─────────────────────────────────────────────────────────────
//
// The website is the argument, and it has just been made. One line, one
// gold word, one link to the real thing. No paragraph, no list, no price:
// the stage does not turn into a sales section after its most expressive
// moment. Selling Studio+ belongs to the labelled pricing surface.

export const CLOSE = {
  head: ["Not a profile. A ", "site", "."] as const,
  open: "Open Zofia's site",
} as const;
