/**
 * The About page's tunable numbers, in one place.
 *
 * The page is a sequence of scenes, not a stack of sections. Three of them are
 * scroll-driven and two are still, and the contrast between those two states
 * is the pacing. Every number that decides how a scene feels is here.
 */

/** The site's single ease, as a mutable tuple framer-motion accepts. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── HERO ────────────────────────────────────────────────────────────
   The photograph is a camera: it pushes in while the composition rises
   off the top of the frame. Nothing parks; the hero is still moving as
   the next scene takes the screen. */
export const HERO_IMAGE_SCALE = [1.06, 1.24] as const;
export const HERO_IMAGE_Y = ["0%", "14%"] as const;
export const HERO_TEXT_Y = [0, -150] as const;
export const HERO_CUE_FADE = [0, 0.32] as const;

/* ── ORIGIN ──────────────────────────────────────────────────────────
   Three beats travel up through a stage the photograph crosses behind
   them. The plate moves slower than the type, which is what makes the
   type read as being in front of a room rather than on top of a picture. */
export const ORIGIN_PLATE_Y = ["-6%", "10%"] as const;
export const ORIGIN_PLATE_SCALE = [1.12, 1] as const;
export const ORIGIN_BEAT_TRAVEL = 120;

/* ── THE LINE ────────────────────────────────────────────────────────
   A pinned stage, three statements, one gold line.

   Each statement travels the whole height of the stage and is never at
   partial opacity: it enters from below the frame and leaves above it,
   clipped by the stage itself. It moves fast at the edges and slowly
   through the middle, so it holds without ever stopping. The gold line
   draws across the stage as the scene runs, and the statements cross it. */
export const LINE_STAGE_VH = 340;
/** The slice of the scene the three statements share, and the slice the
    closing fact resolves into. Nothing is left holding an empty stage. */
export const LINE_STATEMENTS_SPAN = [0.02, 0.84] as const;
export const LINE_CLOSE_SPAN = [0.84, 0.95] as const;
export const LINE_STATEMENT_ENTER = "78vh";
export const LINE_STATEMENT_HOLD = ["5vh", "-5vh"] as const;
export const LINE_STATEMENT_EXIT = "-78vh";
/** Fraction of the scene each statement owns, and how far its neighbours overlap. */
export const LINE_SLICE_OVERLAP = 0.05;
/** Where the plate handed over from the previous scene finishes leaving. */
export const LINE_PLATE_EXIT = 0.2;

/** The once-only arrival used by the still scenes. */
export const ARRIVE_DURATION = 0.9;
export const ARRIVE_STAGGER = 0.1;
export const ARRIVE_RISE = 26;
