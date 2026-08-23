"use client";

import type { MotionValue } from "framer-motion";
import { motion, useTransform } from "framer-motion";

import StaticIntelligence from "./StaticIntelligence";
import { leave, settle } from "./ease";
import { BEATS, lockupTiming, type Beat, type Lockup } from "./motion";

/**
 * The intelligence sequence's copy.
 *
 * Every line does the same thing: it travels up into the frame from below the
 * stage, comes to rest, holds, and travels out past the top. There are no
 * masks, no clips and no reveals anywhere in this file. The only clipping edge
 * is the stage, which is a frame rather than a card (`lessons.md` §18).
 *
 * The whole layer sits **behind her**, so the type crosses space she occupies
 * and she occludes it. That is what gives the travel depth, and it makes the
 * rule that nothing ever covers her a property of the stacking order rather
 * than of careful positioning (§18.1).
 *
 * Two curves do the work: a long deceleration on the way in so a line settles
 * rather than slides, and a shorter acceleration on the way out so it goes
 * without lingering.
 */

/** Clearance for ascenders, the italic descender, and the italic overhang. */
const CLEARANCE = "pb-[0.3em] pr-[0.1em] pt-[0.2em]";

function LockupBlock({
  lockup,
  beat,
  progress,
  compact,
}: {
  lockup: Lockup;
  beat: Beat;
  progress: MotionValue<number>;
  compact: boolean;
}) {
  const index = compact ? 0 : 1;
  const timing = lockupTiming(beat.frames, lockup.delay);

  // Two travels on one axis. The first clamps at zero once it has arrived and
  // the second is zero until it leaves, so summing them is the whole path.
  const arriving = useTransform(progress, timing.enter, [lockup.enter[index], 0], {
    ease: settle,
  });
  const leaving = useTransform(
    progress,
    timing.exit ?? timing.enter,
    timing.exit && lockup.exit ? [0, -lockup.exit[index]] : [0, 0],
    { ease: leave },
  );
  const y = useTransform(
    [arriving, leaving],
    ([a, b]: number[]) => `${a + b}vh`,
  );

  const align = lockup.pos[index].includes("text-right")
    ? "text-right"
    : "text-left";

  return (
    <motion.div
      className={`absolute ${lockup.pos[index]}`}
      style={{ y, willChange: "transform" }}
    >
      {lockup.pieces.map((piece, pieceIndex) => (
        <span
          key={pieceIndex}
          className={`block whitespace-pre leading-[0.92] tracking-[-0.035em] ${CLEARANCE} ${align} ${piece.type[index]}`}
        >
          {piece.words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={
                word.verdict
                  ? "font-editorial-italic text-[#C9A55A]"
                  : "font-editorial text-[#FAF7F2]"
              }
            >
              {word.t}
            </span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}

interface IntelligenceProps {
  progress?: MotionValue<number>;
  isMobile?: boolean;
}

export default function Intelligence({ progress, isMobile }: IntelligenceProps) {
  // The hero owns the reduced-motion decision and withholds `progress` there.
  // Asking framer's `useReducedMotion()` here as well hydrated as a mismatch.
  if (!progress) {
    return <StaticIntelligence />;
  }

  return (
    <div className="relative mx-auto h-full w-full max-w-[1600px]">
      {BEATS.map((beat) =>
        beat.lockups.map((lockup) => (
          <LockupBlock
            key={lockup.id}
            lockup={lockup}
            beat={beat}
            progress={progress}
            compact={Boolean(isMobile)}
          />
        )),
      )}
    </div>
  );
}
