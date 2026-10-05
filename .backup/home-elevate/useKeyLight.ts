"use client";

import { useEffect, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

import { HEADS } from "./heads";
import { FRAME_HEIGHT, FRAME_WIDTH, WORDMARK_EXIT, progressAtFrame } from "./motion";
import type { Light } from "./useFrameSequence";

/**
 * The key light.
 *
 * The page is a studio, and the opening is the moment the light finds her.
 * One warm source, and everything in the hero answers to it: her figure is
 * relit through it on the frame canvas (shadow on the far side, warmth on the
 * near), the wordmark behind her catches gold where it falls, and its spill
 * lands on the velvet behind her.
 *
 * Where it is:
 *
 *   arrival   when the veil lifts it sweeps in from the left of the frame and
 *             settles above her, to the side, the way a key is set
 *   hero      it follows the pointer, with weight, so the visitor holds the
 *             light (on touch it stays where it was set)
 *   scroll    as she rises the light hands over to her face, read off the
 *             footage (`heads.ts`), and from then on it is a portrait key
 *             that stays on her through the camera's push in
 *
 * One rAF loop, reading the hero's scroll value; it writes the canvas and
 * three CSS variables and nothing else. No scroll listener (banned-ui 8.4).
 */

/** Light offset from her face once it has handed over: above, to her right. */
const KEY_OFFSET = { x: -0.13, y: -0.07 };
/** How long the light takes to close on where it is going, in seconds. */
const FOLLOW = 0.32;
/** The arrival sweep. */
const SWEEP_MS = 2600;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Refs = {
  stage: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  mark: RefObject<HTMLElement | null>;
};

export function useKeyLight({
  refs,
  progress,
  relight,
  drawnIndex,
  ready,
  enabled,
}: {
  refs: Refs;
  /** The hero's own timeline, 0..1. */
  progress: MotionValue<number>;
  relight: (light: Light | null) => void;
  drawnIndex: () => number;
  /** The veil has lifted: the sweep starts now. */
  ready: boolean;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled || !ready) return;

    const handOver = [WORDMARK_EXIT.start, progressAtFrame(52)] as const;
    let pointer: { x: number; y: number } | null = null;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const start = performance.now();
    let cur: { x: number; y: number } | null = null;
    let last = start;
    let lastKey = "";
    let raf = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const stage = refs.stage.current;
      const canvas = refs.canvas.current;
      if (!stage || !canvas) return;

      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const p = progress.get();

      // Past the close portrait the light has nothing left to do.
      if (p >= 1 && lastKey === "off") return;

      // The frame as painted: the canvas box, object-fit contain, bottom.
      const box = canvas.getBoundingClientRect();
      const scale = Math.min(box.width / FRAME_WIDTH, box.height / FRAME_HEIGHT);
      const left = box.left + (box.width - FRAME_WIDTH * scale) / 2;
      const top = box.top + (box.height - FRAME_HEIGHT * scale);
      const contentH = FRAME_HEIGHT * scale;

      const idx = Math.max(0, drawnIndex());
      const head = HEADS[Math.min(idx, HEADS.length - 1)] ?? [0.45, 0.12];
      const face = {
        x: left + head[0] * FRAME_WIDTH * scale,
        y: top + head[1] * contentH,
      };

      // Where the light is set in the opening, before the hand holds it.
      const rest = { x: face.x - 0.16 * W, y: face.y - 0.04 * H };
      const sweep = easeOut(clamp01((now - start) / SWEEP_MS));
      const from = { x: -0.25 * W, y: rest.y - 0.1 * H };
      let held = {
        x: from.x + (rest.x - from.x) * sweep,
        y: from.y + (rest.y - from.y) * sweep,
      };
      if (pointer && sweep >= 1) held = pointer;

      const key = {
        x: face.x + KEY_OFFSET.x * contentH,
        y: face.y + KEY_OFFSET.y * contentH,
      };
      const f = smooth(handOver[0], handOver[1], p);
      const target = {
        x: held.x + (key.x - held.x) * f,
        y: held.y + (key.y - held.y) * f,
      };

      if (!cur) cur = { ...from };
      // During the sweep the light is placed, not followed.
      const k = sweep < 1 ? 1 : 1 - Math.exp(-dt / FOLLOW);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;

      // Full in the hero; a touch softer as a portrait key; gone as she
      // leaves the stage at the close.
      const strength = (0.95 - 0.2 * f) * (1 - smooth(0.985, 1, p)) * Math.min(1, sweep * 1.4);
      const radius = (0.34 + 0.12 * f) * contentH;

      const stamp = `${Math.round(cur.x)}:${Math.round(cur.y)}:${idx}:${strength.toFixed(3)}:${Math.round(radius)}`;
      if (stamp !== lastKey) {
        lastKey = strength <= 0.001 ? "off" : stamp;
        relight(
          strength <= 0.001
            ? null
            : {
                x: (cur.x - left) / scale,
                y: (cur.y - top) / scale,
                r: radius / scale,
                strength,
              },
        );

        // The mark catches it only while it is the hero; its own exit
        // carries it out of the frame after that.
        const mark = refs.mark.current;
        if (mark) {
          const m = mark.getBoundingClientRect();
          mark.style.setProperty("--lx", `${cur.x - m.left}px`);
          mark.style.setProperty("--ly", `${cur.y - m.top}px`);
          mark.style.setProperty("--la", `${(strength * (1 - f)).toFixed(3)}`);
        }
        stage.style.setProperty("--sx", `${((cur.x / W) * 100).toFixed(2)}%`);
        stage.style.setProperty("--sy", `${((cur.y / H) * 100).toFixed(2)}%`);
        stage.style.setProperty("--sa", `${(strength * (1 - 0.6 * f)).toFixed(3)}`);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [enabled, ready, refs, progress, relight, drawnIndex]);
}
