"use client";

import type { MotionValue } from "framer-motion";
import { motion, useTransform } from "framer-motion";

import { FIGURE_STOPS, PARALLAX_SCALE } from "@/components/hero/motion";
import { RIBBON } from "./motion";

/**
 * The background ribbon: depth, not a headline.
 *
 * Three things keep it from reading as an afterthought (`lessons.md` §14.7).
 * It rides the camera, scaling with the push in at roughly a third of her rate,
 * so it sits in the same space rather than on a plane of its own. It
 * decelerates instead of sliding at one speed. And it carries a real optical
 * blur, so it reads as out of focus behind her rather than merely faint, which
 * is the difference between depth and a washed out layer (§14.6).
 *
 * The blur is a static value. Nothing animates a filter per frame.
 */
export default function Ribbon({
  progress,
  compact,
}: {
  progress: MotionValue<number>;
  compact: boolean;
}) {
  const index = compact ? 0 : 1;
  const [from, to] = RIBBON.travel;

  const opacity = useTransform(
    progress,
    [RIBBON.fade.in, RIBBON.fade.settled, RIBBON.fade.start, RIBBON.fade.out],
    [0, RIBBON.peak, RIBBON.peak, 0],
  );
  const x = useTransform(
    progress,
    RIBBON.drift.at.map((t) => from + (to - from) * t),
    [...RIBBON.drift.x],
  );
  const scale = useTransform(
    progress,
    [...FIGURE_STOPS],
    compact ? [...PARALLAX_SCALE.mobile] : [...PARALLAX_SCALE.desktop],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-x-0 -translate-y-1/2"
        style={{ top: `${RIBBON.top[index]}%` }}
      >
        <motion.div
          className="flex justify-center"
          style={{
            opacity,
            x,
            scale,
            filter: `blur(${RIBBON.blur[index]}px)`,
            willChange: "transform, opacity",
          }}
        >
          <span
            className="flex whitespace-nowrap font-editorial leading-none tracking-[-0.04em] text-[#FAF7F2]"
            style={{
              fontSize: `${RIBBON.size[index]}vw`,
              gap: `${RIBBON.size[index] * 0.6}vw`,
            }}
          >
            {RIBBON.words.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
