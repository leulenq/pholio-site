/**
 * The About page's tunable numbers, in one place.
 *
 * The page has one scroll-tied element: the thread. It hangs from the hero's
 * invitation, draws down the left edge of the text column as the reader
 * scrolls, crosses the field change from ink to cream, and stops at the
 * heading of the position it was pointing to. Everything else on the page
 * arrives once and holds still, in the register of the legal documents.
 */

/** Scroll offsets, in framer-motion's `useScroll` grammar. */
export const HERO_THREAD_OFFSET = ["start start", "end 0.6"] as const;
export const POSITION_THREAD_OFFSET = ["start 0.6", "start 0.3"] as const;

/** Height of the sweep at rest under the invitation: the gold line fading in
    and out that reads as "there is more below" before anything moves. */
export const SWEEP_LENGTH = 56;

/** Length of the soft tip that leads the drawn line. */
export const TIP_LENGTH = 40;

/** How far below the cream section's top edge the position's heading sits,
    which is also exactly how long the second half of the thread is. */
export const POSITION_LEAD = "clamp(9rem, 30vh, 20rem)";

/** The once-only arrival shared by every section: fade and rise, staggered. */
export const ARRIVE_DURATION = 0.85;
export const ARRIVE_STAGGER = 0.09;
export const ARRIVE_RISE = 22;
