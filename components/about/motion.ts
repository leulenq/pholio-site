/**
 * The About page's tunable numbers, in one place, so a chapter can be
 * art-directed without reading JSX (`04-scroll-craft.md` §5).
 *
 * The page is eight chapters. Chapter 0 through V share one pinned frame
 * and one set of objects, so they hand over to each other rather than
 * stacking; the last three are the page at rest on paper, after the turn.
 *
 * Every value here drives `transform` or `opacity` and nothing else.
 */

/** The site's single ease, as a mutable tuple framer-motion accepts. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const STAGE_VH = 1020;

/* ── THE CAMERA ───────────────────────────────────────────────────────
   A shot is a plate height as a percentage of the viewport, plus which
   point of the plate belongs at the centre of the frame. The renderer
   turns that into a scale and a translation and never touches layout.

   `fx` can never fall below the visible half-width of the plate at that
   height, or the field shows at the frame's edge. At h = 300 on a 3:2
   photograph that floor is 0.178.
*/
export type Shot = { at: number; h: number; fx: number; fy: number };

/**
 * 0 + I. THE DOOR, AND THE NUMBERS.
 *
 * The camera is parked on one casting tag for the whole of the opening,
 * because the opening is a door rather than a move: a hand's width of the
 * photograph stands at the right edge of the frame and then opens across
 * it. Only once the door is open does the camera pull back, and what it
 * finds is that the tag was on a person and the person was in a queue.
 */
export const LINEUP_AR = 3 / 2;
export const LINEUP: Shot[] = [
  { at: 0.0, h: 300, fx: 0.19, fy: 0.74 },
  { at: 0.115, h: 300, fx: 0.19, fy: 0.74 },
  { at: 0.195, h: 176, fx: 0.33, fy: 0.52 },
  { at: 0.275, h: 96, fx: 0.5, fy: 0.5 },
];
export const LINEUP_COMPACT: Shot[] = [
  { at: 0.0, h: 150, fx: 0.19, fy: 0.55 },
  { at: 0.115, h: 150, fx: 0.19, fy: 0.55 },
  { at: 0.195, h: 104, fx: 0.34, fy: 0.5 },
  { at: 0.275, h: 48, fx: 0.5, fy: 0.5 },
];
export const LINEUP_EXIT = [0.295, 0.355] as const;

/** The door itself: the clip that opens the photograph across the frame,
    as a percentage inset from the left. */
export const DOOR = { at: [0.006, 0.098] as const, from: 90, to: 0 };

/**
 * II. THE SITTING. One figure, framed, pulling back until paper closes
 * around it and it is an object. It lands at the centre and stays: the
 * bill is going to land on top of it.
 */
export const SITTING_AR = 2 / 3;
export const SITTING: Shot[] = [
  { at: 0.315, h: 152, fx: 0.5, fy: 0.42 },
  { at: 0.378, h: 98, fx: 0.5, fy: 0.5 },
  { at: 0.438, h: 34, fx: 0.5, fy: 0.5 },
];
export const SITTING_COMPACT: Shot[] = [
  { at: 0.315, h: 124, fx: 0.5, fy: 0.44 },
  { at: 0.378, h: 92, fx: 0.5, fy: 0.5 },
  { at: 0.438, h: 26, fx: 0.5, fy: 0.5 },
];
export const SITTING_ENTER_VH = 124;
/** Where she rests while the paper piles onto her, in vh from the centre. */
export const SITTING_REST = { wide: [-15, -8] as const, compact: [0, -20] as const };
export const SITTING_EXIT = [0.818, 0.868] as const;

/* ── III. THE STACK ───────────────────────────────────────────────────
   Six slips of paper, the size of receipts rather than of pictures. Each
   one arrives from below the frame and lands a little lower and a little
   further right than the last, so what accumulates is readable the whole
   way down: the top band of every slip stays out from under the next one.
   By the last slip her photograph is under all of it with only its top
   edge still showing, which is the argument.

   Then the paper leaves, fast and all at once, and she is still there.
*/
export type SlipGeometry = {
  /** slip width and height, in vh */
  w: number;
  h: number;
  /** the pile's own offset from the frame's centre, in vh. It sits to the
      right of the photograph so the paper leans onto her rather than
      hiding her: about half her width stays out from under it. */
  x: number;
  /** where the first slip rests, in vh from the frame's centre */
  top: number;
  /** how far each slip lands below and to the right of the last */
  step: number;
  drift: number;
  /** how far below the frame a slip waits */
  enter: number;
};

export const SLIP: Record<"wide" | "compact", SlipGeometry> = {
  wide: { w: 46, h: 9.4, x: 7, top: -6, step: 4.9, drift: 1.05, enter: 76 },
  compact: { w: 42, h: 12, x: 0, top: -10, step: 6.0, drift: 0.7, enter: 82 },
};
/** A degree either way, alternating. Paper does not land square. */
export const SLIP_TILT = [-0.65, 0.5, -0.4, 0.7, -0.55, 0.45] as const;

/* ── IV. THE CORRIDOR ─────────────────────────────────────────────────
   The waiting plate holds the whole frame and pushes in very slowly for
   the length of the chapter. It never leaves; the paper takes it.
*/
export const CORRIDOR = { rise: [0.845, 0.898] as const, scale: [1.15, 1.0] as const };

/* ── THE WINDOWS ──────────────────────────────────────────────────────
   Uneven on purpose. The stack is the longest sequence because
   accumulation takes time to be felt, and the corridor holds longest
   because the hold is the point (`04-scroll-craft.md` §6).
*/
export const WHEN = {
  /** 0 */
  opening: [0, 0.012, 0.055, 0.1] as const,
  /** I */
  whisper: [0.105, 0.132, 0.168, 0.2] as const,
  statement: [0.2, 0.236, 0.272, 0.302] as const,
  /** II */
  sittingNote: [0.398, 0.425, 0.462, 0.492] as const,
  /** III */
  stackLabel: [0.452, 0.482, 0.716, 0.746] as const,
  stackSlips: [0.47, 0.672] as const,
  stackHold: 0.706,
  stackSweep: [0.706, 0.752] as const,
  total: [0.752, 0.78, 0.812, 0.838] as const,
  /** IV */
  corridorLine: [0.858, 0.888, 0.918, 0.942] as const,
  corridorNote: [0.874, 0.902, 0.918, 0.938] as const,
  /** V */
  seam: [0.934, 0.988] as const,
  under: [0.978, 0.999] as const,
} as const;

/** How far small copy travels into and out of its hold. It arrives from
    outside the frame and leaves through it; the frame is the only clipping
    edge on the stage (`lessons.md` §18). */
export const TRAVEL = ["118vh", "0vh", "0vh", "-118vh"] as const;

/* ── THE PAPER CHAPTERS ───────────────────────────────────────────────
   Arrival once, then rest. A page that scrubs everything has no pacing.
*/
export const ARRIVE_DURATION = 0.95;
export const ARRIVE_STAGGER = 0.08;
export const ARRIVE_RISE = 28;

/** The colophon's plate travels against its column. One transform. */
export const PLATE_DRIFT = 96;
