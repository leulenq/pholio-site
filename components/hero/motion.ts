/**
 * Tunable keyframes for the home scroll sequence.
 *
 * Every visual beat below is authored in *frame numbers*, not scroll
 * fractions, because the extracted footage is the source of truth for the
 * model's movement. `progressAtFrame` converts a frame to the scroll position
 * that displays it, so retiming the copy against her motion is a one-number
 * edit rather than a guess.
 */

// ── Frame boundaries, measured against the extracted sequence ──────────────
//
// These were verified, not assumed. Across frames 1-12 the silhouette's
// bounding box does not move at all (top edge drift 0px, IoU against frame 1
// stays >= 0.972) -- the only change is breathing-scale micro-motion. The
// first structural movement is frame 13, and inter-frame motion peaks at
// frame 19. Ending the hero before 12 would start the wordmark travelling
// while she is still holding the pose.
export const HERO_LAST_FRAME = 12;

// She rises out of the lean and arrives standing by 60, which begins one of
// the sequence's quiet stretches (60-71) and so makes a natural handover.
export const TRANSITION_LAST_FRAME = 60;

export const FINAL_FRAME = 193;

/** The intelligence beat samples every other frame to halve its payload. */
export const INTELLIGENCE_STEP = 2;

function buildFrames(): number[] {
  const frames: number[] = [];
  for (let n = 1; n <= TRANSITION_LAST_FRAME; n += 1) frames.push(n);
  for (let n = TRANSITION_LAST_FRAME + 1; n <= FINAL_FRAME; n += INTELLIGENCE_STEP) {
    frames.push(n);
  }
  return frames;
}

/** Every frame the page actually loads, in order. */
export const FRAMES = buildFrames();

export const frameSrc = (frame: number) =>
  `/hero/seq/seq-${String(frame).padStart(3, "0")}.webp`;

export const FRAME_WIDTH = 970;
export const FRAME_HEIGHT = 1640;

// ── Scroll allocation ─────────────────────────────────────────────────────
//
// Deliberately uneven. The hero holds longer per frame than anything else so
// the opening reads as a held composition rather than a slideshow, and the
// intelligence beat is the longest because it carries the most frames and the
// most reading.
export const BEAT_VH = {
  hero: 100,
  transition: 150,
  intelligence: 400,
} as const;

const SCRUB_VH = BEAT_VH.hero + BEAT_VH.transition + BEAT_VH.intelligence;

/** Total height of the hero's own scrub, including the viewport it sticks in. */
export const STAGE_VH = SCRUB_VH + 100;

/**
 * The comp-card beat's scroll, appended to the same stage.
 *
 * The two scenes share one pinned container and one scroll container, split
 * into two timelines below. That is the whole reason the comp card reads as
 * the next beat rather than a separate feature: there is no unpin between
 * them, so the figure can travel out while the plates travel in
 * (`lessons.md` §20).
 */
export const CARD_VH = 380;

export const HOME_STAGE_VH = STAGE_VH + CARD_VH;

/**
 * Where the hero's timeline ends inside the shared stage. The hero keeps
 * exactly the scroll distance it had, so every frame cue above is unchanged.
 */
export const HERO_FRACTION = SCRUB_VH / (HOME_STAGE_VH - 100);

const HERO_END_P = BEAT_VH.hero / SCRUB_VH;
const TRANSITION_END_P = (BEAT_VH.hero + BEAT_VH.transition) / SCRUB_VH;

const HERO_END_INDEX = FRAMES.indexOf(HERO_LAST_FRAME);
const TRANSITION_END_INDEX = FRAMES.indexOf(TRANSITION_LAST_FRAME);
const LAST_INDEX = FRAMES.length - 1;

type Beat = { fromIndex: number; toIndex: number; fromP: number; toP: number };

/** Beats share their boundary frame, so the scrub never jumps at a handover. */
const BEATS: Beat[] = [
  { fromIndex: 0, toIndex: HERO_END_INDEX, fromP: 0, toP: HERO_END_P },
  {
    fromIndex: HERO_END_INDEX,
    toIndex: TRANSITION_END_INDEX,
    fromP: HERO_END_P,
    toP: TRANSITION_END_P,
  },
  {
    fromIndex: TRANSITION_END_INDEX,
    toIndex: LAST_INDEX,
    fromP: TRANSITION_END_P,
    toP: 1,
  },
];

/** Scroll progress (0-1) to a position in `FRAMES`. */
export function frameIndexAtProgress(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1);
  for (const beat of BEATS) {
    if (p <= beat.toP) {
      const span = beat.toP - beat.fromP;
      const t = span <= 0 ? 0 : (p - beat.fromP) / span;
      return beat.fromIndex + t * (beat.toIndex - beat.fromIndex);
    }
  }
  return LAST_INDEX;
}

function nearestIndex(frame: number): number {
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < FRAMES.length; i += 1) {
    const distance = Math.abs(FRAMES[i] - frame);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best;
}

/** The scroll position at which a given frame is on screen. */
export function progressAtFrame(frame: number): number {
  const index = nearestIndex(frame);
  for (const beat of BEATS) {
    if (index <= beat.toIndex) {
      const span = beat.toIndex - beat.fromIndex;
      const t = span <= 0 ? 0 : (index - beat.fromIndex) / span;
      return beat.fromP + t * (beat.toP - beat.fromP);
    }
  }
  return 1;
}

// ── Copy exit, staged against her movement ────────────────────────────────
//
// Nothing leaves while she is still. The wordmark starts travelling on the
// exact frame her silhouette first moves, and does most of its travel across
// 13-34, which is the burst that contains the motion peak at 19. The word
// wheel clears earlier than the wordmark so the two do not leave as one block.
export const WORDMARK_EXIT = {
  start: progressAtFrame(HERO_LAST_FRAME),
  peak: progressAtFrame(34),
  end: progressAtFrame(48),
} as const;

export const WHEEL_EXIT = {
  start: progressAtFrame(HERO_LAST_FRAME),
  end: progressAtFrame(28),
} as const;

export const INTELLIGENCE_ENTER = {
  start: progressAtFrame(64),
  settled: progressAtFrame(84),
} as const;

// The intelligence sequence owns its own keyframes, in
// `components/intelligence/motion.ts`, and authors them against these same
// frame numbers through `progressAtFrame`. The footage is the timeline; the
// section is the choreography.

// ── The camera ───────────────────────────────────────────────────────────
//
// The intelligence sequence is one continuous camera move, and it is the
// section's spine: everything else is timed against it (`lessons.md` §12.4,
// §12.5, §13). Three moves, all slow:
//
//   wide    she holds the right of the stage, small, while the first line reads
//   centre  the camera pans onto her and begins to close, and the second line
//           brackets her: "Then it sees" left, "you." right, her in between
//   close   she takes the right of the frame again, chest up, for the last line
//
// Panning back toward the middle at the exact moment the copy says the system
// sees *her* is the point of the move, not a compositional convenience.
//
// Scaling happens about the plate's centre, so the rise below is what keeps her
// head in frame as the scale climbs. These three arrays share FIGURE_STOPS and
// are tuned together; changing one alone will reframe her.

/** Horizontal position of the plate. */
export const FIGURE_DRIFT = {
  desktop: ["0vw", "0vw", "4vw", "13vw", "1vw", "6vw", "17vw"],
  mobile: ["0vw", "0vw", "1vw", "3vw", "0vw", "2vw", "4vw"],
} as const;

// A wide stage separates her from the copy horizontally. Below 1024 there is
// no gutter to do that with - at 768 portrait she is more than half the stage
// wide - so the narrow treatment separates vertically instead: she sits low and
// the copy takes the clear band above her head, and the push in stays gentler
// because there is less room to move into. Both are identical at scroll zero.
/** Opening scale used as the calibration baseline for the full sequence. */
export const STATIC_FIGURE_SCALE = {
  desktop: 1.13,
  mobile: 1,
} as const;

export const FIGURE_SCALE = {
  // The opening scale is a camera calibration, not a one-frame override. The
  // original relative curve is preserved across every stop so the model does
  // not jump back when the frame sequence starts moving.
  desktop: [
    STATIC_FIGURE_SCALE.desktop,
    STATIC_FIGURE_SCALE.desktop,
    0.97 * STATIC_FIGURE_SCALE.desktop,
    0.9 * STATIC_FIGURE_SCALE.desktop,
    1.05 * STATIC_FIGURE_SCALE.desktop,
    1.3 * STATIC_FIGURE_SCALE.desktop,
    1.72 * STATIC_FIGURE_SCALE.desktop,
  ] as const,
  mobile: [1, 1, 0.94, 0.76, 0.86, 1.0, 1.24],
} as const;

/**
 * Vertical travel, in vh. Holds her head in frame while the scale climbs.
 * Numbers rather than strings so the comp-card beat's exit can be added on
 * top without string arithmetic.
 */
export const FIGURE_RISE: { desktop: number[]; mobile: number[] } = {
  desktop: [0, 0, 0, 0, 4, 22, 46],
  mobile: [0, 0, 0, 0, 4, 14, 28],
};

/**
 * How far she keeps travelling, in vh, as the comp-card plates arrive.
 *
 * Measured against her size at the end of the push in, not guessed: at scale
 * 1.72 the plate is about 1.7 viewports tall, so anything less than this left
 * her boots hanging in the top of the comp-card beat.
 */
export const FIGURE_HANDOVER = { desktop: -245, mobile: -200 } as const;

/**
 * Stops for all three: hold, her first move, arrival, the wide frame, the pan
 * onto her, the close beginning, and the final portrait.
 */
export const FIGURE_STOPS = [
  0,
  progressAtFrame(HERO_LAST_FRAME),
  progressAtFrame(TRANSITION_LAST_FRAME),
  progressAtFrame(112),
  progressAtFrame(136),
  progressAtFrame(166),
  1,
] as const;

/**
 * The same move, damped, for anything living behind her. A background plane
 * that travels on its own timeline reads as pasted on (`lessons.md` §13.5).
 */
export const PARALLAX_SCALE = {
  desktop: [1, 1, 1, 1.02, 1.09, 1.2, 1.36],
  mobile: [1, 1, 1, 1.02, 1.06, 1.12, 1.2],
} as const;
