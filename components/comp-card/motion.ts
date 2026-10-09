import {
  CARD_VH,
  FIGURE_DRIFT,
  FIGURE_RISE,
  FIGURE_SCALE,
  FRAME_HEIGHT,
  FRAME_WIDTH,
} from "@/components/hero/motion";

/**
 * The comp-card chapter on the home stage: six of her cards, as one camera.
 *
 *   prologue   the intelligence's last frame: the camera on her, and the
 *              push in until the black of her top is the whole frame
 *   the edge   out of that black, a card, edge-on: a hairline of light
 *              coming out of the dark, until it turns and is the whole frame
 *   the planes the cover taken apart in depth: photograph, masthead, the
 *              figure cut from the same frame
 *   macro      the camera down on the masthead's hairlines, then her eyes
 *   the turn   lifted and turned over in the hand; the back, read
 *   directions the camera travels through the dark past five more cards,
 *              each facing you as you come, turning as you pass
 *   the hand   they come back past you into a hand, and the hand is squared
 *   handed on  the other five leave under it and the cover is set down at
 *              its rest, where the application beat picks it up
 *
 * Everything is a function of one position `v`: the chapter's scroll in
 * viewport heights × 100, so one `v` is one vh of scroll. The engine is in
 * `./engine.ts`; this file holds what the rest of the stage reads.
 */

export type StageKind = "wide" | "compact";
type Stage<Type> = Record<StageKind, Type>;

/** The chapter's length in `v`, and so in vh of scroll. */
export const V_TOTAL = CARD_VH;

/** The stage's shared yield on the page's weight (`lessons.md` §45.3). */
export const TIMELINE_SPRING = {
  stiffness: 320,
  damping: 42,
  mass: 1,
  restDelta: 0.0002,
  restSpeed: 0.002,
} as const;

/** The intelligence's last line leaves first, up and out, ahead of the camera. */
export const COPY_LEAVES: readonly [number, number] = [30 / V_TOTAL, 95 / V_TOTAL];

/** The push into her black: [start, end] in `v`, then the black goes to velvet. */
export const PUSH: readonly [number, number] = [55, 175];
export const PUSH_FADE: readonly [number, number] = [150, 178];
/** Past this she is the frame's black and nothing else: she is released. */
export const FIGURE_RELEASED = 180;

// ── The card ──────────────────────────────────────────────────────────────

/** A 5.5 x 8.5 in comp card, width over height. */
export const CARD_ASPECT = 5.5 / 8.5;

/** The card's rest: beside the next chapter's opening line, or above it. */
const READY_X: Stage<number> = { wide: 0.12, compact: 0 };
const READY_Y: Stage<number> = { wide: -2, compact: -44 };
const READY_SCALE: Stage<number> = { wide: 1.12, compact: 1.04 };

/**
 * Where the card lies at the end of the chapter, in stage px. The
 * application beat picks it up from exactly here (`components/prepared-for`).
 */
export function cardRest(stage: StageKind, w: number, h: number) {
  const base = w < 640 ? 256 : w < 768 ? 284 : w < 1024 ? 320 : 364;
  const width = base * READY_SCALE[stage];
  const height = width / CARD_ASPECT;
  const cx = w / 2 + READY_X[stage] * w;
  const cy = h / 2 + READY_Y[stage];
  return { cx, cy, width, height };
}

// ── The prologue camera ───────────────────────────────────────────────────

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoother = (t: number) => t * t * t * (t * (6 * t - 15) + 10);

/**
 * The camera on her figure through the prologue, as a transform for a
 * wrapper around the hero's figure layer (origin 0 0, stage px).
 *
 * The figure is where the hero left her: its last drift, rise and scale,
 * about the layer's centre, with the plate contained and bottom-aligned in
 * the frame. The camera pushes into the black of her top, at a third of the
 * plate's height, and brings it to the centre of the frame.
 */
export function prologueCamera(v: number, w: number, h: number, isMobile: boolean) {
  const drift = isMobile ? FIGURE_DRIFT.mobile : FIGURE_DRIFT.desktop;
  const rise = isMobile ? FIGURE_RISE.mobile : FIGURE_RISE.desktop;
  const scales = isMobile ? FIGURE_SCALE.mobile : FIGURE_SCALE.desktop;
  const x = (parseFloat(drift[drift.length - 1]) / 100) * w;
  const y = (rise[rise.length - 1] / 100) * h;
  const s = scales[scales.length - 1];

  const aspect = FRAME_WIDTH / FRAME_HEIGHT;
  const iw = w / h > aspect ? h * aspect : w;
  const ih = iw / aspect;
  const ix = (w - iw) / 2;
  const iy = h - ih;

  const chest = {
    x: w / 2 + x + s * (ix + 0.5 * iw - w / 2),
    y: h / 2 + y + s * (iy + 0.36 * ih - h / 2),
  };
  const k = smoother(clamp01((v - PUSH[0]) / (PUSH[1] - PUSH[0])));
  const zoom = lerp(1, 9, Math.pow(k, 1.4));
  const cx = lerp(chest.x, w / 2, k);
  const cy = lerp(chest.y, h / 2, k);
  return {
    transform: `translate(${cx}px, ${cy}px) scale(${zoom}) translate(${-chest.x}px, ${-chest.y}px)`,
    opacity: 1 - clamp01((v - PUSH_FADE[0]) / (PUSH_FADE[1] - PUSH_FADE[0])),
  };
}
