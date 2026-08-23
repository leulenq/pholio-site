"use client";

/* ═══════════════════════════════════════════════════════════════════
   /talent — the motion vocabulary.

   The page's problem was one gesture ("fade up, staggered") repeated
   eight times. This module gives each scene its OWN gesture, drawn from
   a shared physical language so the variety reads as direction rather
   than noise.

   Three ideas carry it:

   1. EASED SCRUB. Scroll-linked values run through real easing curves,
      not linear interpolation. A move can now start fast and settle, or
      creep then snap, which is where "expensive" lives.
   2. MASS. Selected elements track a lightly sprung copy of scroll, so
      heavy objects trail and settle while light ones stay locked to the
      wheel. Different mass per scene = different feel per scene.
   3. NAMED GESTURES. Dolly, deal, plane-tilt, wipe, launch, fold,
      collapse, bloom. Each scene is assigned a gesture and does not
      borrow its neighbour's.
   ═══════════════════════════════════════════════════════════════════ */

import {
  cubicBezier,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/* ── Curves ────────────────────────────────────────────────────────
   One family, four velocity profiles. The house ease stays the
   default; the others exist so gestures can differ in character
   without introducing a foreign easing personality. */
export const CURVE = {
  /** house arrival — decisive out, long settle */
  arrival: cubicBezier(0.22, 1, 0.36, 1),
  /** slow to leave, then away quickly — good for exits/dollies */
  depart: cubicBezier(0.7, 0, 0.84, 0),
  /** symmetric, mechanical — good for grids and instruments */
  drive: cubicBezier(0.65, 0, 0.35, 1),
  /** immediate, near-linear settle — good for wipes and draws */
  wipe: cubicBezier(0.4, 0, 0.2, 1),
} as const;

export type CurveName = keyof typeof CURVE;

/* ── Mass ──────────────────────────────────────────────────────────
   A sprung copy of a progress value. Heavier = more trail. Used to
   give a scene physical character; never applied to text a reader is
   trying to follow. */
const MASS = {
  light: { stiffness: 260, damping: 42, restDelta: 0.0005 },
  medium: { stiffness: 150, damping: 38, restDelta: 0.0005 },
  heavy: { stiffness: 82, damping: 32, restDelta: 0.0005 },
} as const;

export type MassName = keyof typeof MASS;

export function useMass(progress: MotionValue<number>, mass: MassName = "medium") {
  return useSpring(progress, MASS[mass]);
}

/* ── Scrub helper ──────────────────────────────────────────────────
   useTransform with a curve applied across the whole range. Overloaded
   so numeric outputs widen to `number` rather than inferring a literal
   union (which makes the result unusable in further useTransform calls). */
export function useScrub(
  progress: MotionValue<number>,
  input: number[],
  output: number[],
  curve?: CurveName,
): MotionValue<number>;
export function useScrub(
  progress: MotionValue<number>,
  input: number[],
  output: string[],
  curve?: CurveName,
): MotionValue<string>;
export function useScrub(
  progress: MotionValue<number>,
  input: number[],
  output: number[] | string[],
  curve: CurveName = "arrival",
): MotionValue<number> & MotionValue<string> {
  return useTransform(progress, input, output as number[], {
    ease: CURVE[curve],
  }) as MotionValue<number> & MotionValue<string>;
}

/* ═══════════════════════════════════════════════════════════════════
   NAMED GESTURES
   Each returns plain MotionValues; scenes compose them into style.
   ═══════════════════════════════════════════════════════════════════ */

/** DOLLY-THROUGH — the camera accelerates into and past the subject.
    Objects grow and slip off-frame instead of politely fading.
    (Arrival's exit: we pass through the wall of portraits.) */
export function useDollyThrough(
  progress: MotionValue<number>,
  range: [number, number],
  depth = 1,
) {
  const [a, b] = range;
  const scale = useScrub(progress, [a, b], [1, 1 + 0.95 * depth], "depart");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.55, b], [1, 0.85, 0]);
  return { scale, opacity };
}

/** DEAL-IN — frames flip in on their vertical axis like cards dealt
    onto a table, along a wave. (Book's entrance.) */
export function useDealIn(
  progress: MotionValue<number>,
  range: [number, number],
  wave: number, // 0..1 position along the wave
  spread = 0.22,
) {
  const start = range[0] + (range[1] - range[0] - spread) * wave;
  const end = start + spread;
  const rotateY = useScrub(progress, [start, end], [-72, 0], "arrival");
  const x = useScrub(progress, [start, end], [46, 0], "arrival");
  const opacity = useTransform(progress, [start, start + spread * 0.35], [0, 1]);
  const originZ = useScrub(progress, [start, end], [-160, 0], "arrival");
  return { rotateY, x, opacity, z: originZ };
}

/** PLANE-TILT — a whole composition treated as one sheet, hinging away
    from the viewer on its top edge. (Book's exit.) */
export function usePlaneTilt(
  progress: MotionValue<number>,
  range: [number, number],
  degrees = 34,
) {
  const [a, b] = range;
  const rotateX = useScrub(progress, [a, b], [0, -degrees], "depart");
  const y = useScrub(progress, [a, b], [0, 130], "depart");
  const scale = useScrub(progress, [a, b], [1, 0.86], "depart");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.6, b], [1, 0.7, 0]);
  return { rotateX, y, scale, opacity };
}

/** CATCH-SHEET — the inverse of a plane-tilt: a sheet that arrives already
    hinged away from the viewer and swings upright as it slides in. Written
    to catch what Book's exit tips away, so the seam reads as one object
    changing hands rather than two scenes changing subject. (Send's
    entrance.) */
export function useCatchSheet(
  progress: MotionValue<number>,
  range: [number, number],
  degrees = 16,
) {
  const [a, b] = range;
  const x = useScrub(progress, [a, b], ["52%", "0%"], "arrival");
  const rotateX = useScrub(progress, [a, b], [-degrees, 0], "arrival");
  const scale = useScrub(progress, [a, b], [0.94, 1], "arrival");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.4], [0, 1]);
  return { x, rotateX, scale, opacity };
}

/** WIPE — a clip-path reveal. Direction-aware; the edge itself can be
    lit by pairing with <WipeEdge/>. (Send's rows, Signal's chart.) */
export function useWipe(
  progress: MotionValue<number>,
  range: [number, number],
  direction: "left" | "right" | "up" | "down" = "left",
) {
  const [a, b] = range;
  const t = useScrub(progress, [a, b], [100, 0], "wipe");
  return useTransform(t, (v) => {
    switch (direction) {
      case "left":
        return `inset(0% ${v}% 0% 0%)`;
      case "right":
        return `inset(0% 0% 0% ${v}%)`;
      case "up":
        return `inset(0% 0% ${v}% 0%)`;
      default:
        return `inset(${v}% 0% 0% 0%)`;
    }
  });
}

/** LAUNCH-FORWARD — the object leaves toward the viewer and blows past
    the lens. Reads as dispatch, not disappearance. (Send's exit.) */
export function useLaunchForward(
  progress: MotionValue<number>,
  range: [number, number],
) {
  const [a, b] = range;
  const scale = useScrub(progress, [a, b], [1, 2.6], "depart");
  const y = useScrub(progress, [a, b], [0, -90], "depart");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.45, b], [1, 0.6, 0]);
  return { scale, y, opacity };
}

/** COLLAPSE-TO-LINE — a composition folds down into a single rule,
    which then survives into the next scene. (Signal's exit.) */
export function useCollapseToLine(
  progress: MotionValue<number>,
  range: [number, number],
) {
  const [a, b] = range;
  const scaleY = useScrub(progress, [a, b], [1, 0.02], "drive");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.7, b], [1, 0.5, 0]);
  return { scaleY, opacity };
}

/** FOLD-AWAY — the object hinges on its vertical axis and turns edge-on,
    handing the stage to whatever is behind it. (Address's exit.) */
export function useFoldAway(
  progress: MotionValue<number>,
  range: [number, number],
) {
  const [a, b] = range;
  const rotateY = useScrub(progress, [a, b], [0, 68], "depart");
  const scale = useScrub(progress, [a, b], [1, 0.62], "depart");
  const x = useScrub(progress, [a, b], ["0%", "-14%"], "depart");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.65, b], [1, 0.75, 0]);
  return { rotateY, scale, x, opacity };
}

/** RISE-SETTLE — a heavy object lifts into frame and rocks back onto
    its base. The tilt is what makes it feel like an object rather than
    a layer. (Wallet's phone.) */
export function useRiseSettle(
  progress: MotionValue<number>,
  range: [number, number],
  from = 300,
) {
  const [a, b] = range;
  const mid = a + (b - a) * 0.72;
  const y = useScrub(progress, [a, mid, b], [from, -18, 0], "arrival");
  const rotateX = useScrub(progress, [a, mid, b], [16, -5, 0], "arrival");
  const scale = useScrub(progress, [a, mid, b], [0.9, 1.02, 1], "arrival");
  return { y, rotateX, scale };
}

/** BLOOM — expansion from a compressed state, used only where the page
    resolves. Restrained on purpose: scale, not motion. (Close.) */
export function useBloom(
  progress: MotionValue<number>,
  range: [number, number],
) {
  const [a, b] = range;
  const scale = useScrub(progress, [a, b], [0.93, 1], "arrival");
  const opacity = useTransform(progress, [a, a + (b - a) * 0.5], [0, 1]);
  const letterSpacing = useScrub(progress, [a, b], ["0.04em", "-0.02em"], "arrival");
  return { scale, opacity, letterSpacing };
}

/** DRAW — a rule extending from an origin. Used for hairlines, borders
    and instrument baselines. */
export function useDraw(
  progress: MotionValue<number>,
  range: [number, number],
  curve: CurveName = "wipe",
) {
  return useScrub(progress, range, [0, 1], curve);
}

/* ── Section-boundary reader ───────────────────────────────────────
   Progress across the seam between two stages: 0 while the outgoing
   scene still owns the frame, 1 once the incoming one does. Lets a
   boundary be authored as its own event rather than as two unrelated
   fades. */
export function useSeam(offsetStart = "start end", offsetEnd = "start start") {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [offsetStart, offsetEnd] as never,
  });
  return { ref, seam: scrollYProgress };
}
