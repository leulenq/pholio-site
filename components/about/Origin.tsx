"use client";

/**
 * THE ORIGIN
 *
 * Why the company exists, told as three beats travelling up a stage that a
 * photograph crosses behind them.
 *
 * The plate moves slower than the type and is never full width, so the type
 * reads as standing in a room rather than sitting on a picture. The three
 * beats do not share a composition: the first hangs at the left margin, the
 * second is indented into the field and set against the plate, the third
 * stands alone at display scale with its support beneath it. The scene closes
 * on the turn, which is the only line in it that carries gold.
 */

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { ORIGIN } from "./content";
import {
  Arrive,
  ArriveGroup,
  GOLD,
  HAIR_INK,
  INK,
  ON_INK,
  ON_INK_SOFT,
  SHELL,
  Verdict,
} from "./kit";
import { ORIGIN_BEAT_TRAVEL, ORIGIN_PLATE_SCALE, ORIGIN_PLATE_Y } from "./motion";

export default function Origin() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const plateY = useTransform(scrollYProgress, [0, 1], [...ORIGIN_PLATE_Y]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [...ORIGIN_PLATE_SCALE]);
  const beatOneY = useTransform(scrollYProgress, [0, 1], [ORIGIN_BEAT_TRAVEL, -ORIGIN_BEAT_TRAVEL]);
  const beatThreeY = useTransform(
    scrollYProgress,
    [0, 1],
    [ORIGIN_BEAT_TRAVEL * 0.55, -ORIGIN_BEAT_TRAVEL * 0.55],
  );

  const [first, second, third] = ORIGIN.beats;

  return (
    <section
      ref={ref}
      id={ORIGIN.id}
      aria-label="Why Pholio exists"
      className="texture-grain relative overflow-hidden"
      style={{ background: INK, color: ON_INK }}
    >
      <div className={`${SHELL} relative pb-32 pt-32 md:pb-56 md:pt-52`}>
        {/* BEAT ONE — the left margin, at the largest scale in the scene. */}
        <motion.div
          className="relative z-10"
          style={reduce ? undefined : { y: beatOneY }}
        >
          <ArriveGroup>
            <Arrive>
              <p
                className="font-editorial"
                style={{
                  fontSize: "clamp(2.6rem, 6.4vw, 6.4rem)",
                  lineHeight: 0.98,
                  maxWidth: "13ch",
                }}
              >
                {first.statement}
              </p>
            </Arrive>
            <Arrive>
              <p
                className="mt-8 max-w-[46ch] font-sans text-[15px] font-light leading-[1.7] md:text-[17px]"
                style={{ color: ON_INK_SOFT }}
              >
                {first.support}
              </p>
            </Arrive>
          </ArriveGroup>
        </motion.div>

        {/* BEAT TWO — indented into the field, against the plate. The plate is
            a column at the right on a desktop and a band behind the type on a
            phone, and it is the only photograph in the scene. */}
        <div className="relative mt-28 md:mt-48">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-0 top-[-14vh] z-0 h-[62vh] w-[62%] overflow-hidden opacity-70 md:h-[86vh] md:w-[38%] md:opacity-100"
            style={reduce ? undefined : { y: plateY, scale: plateScale }}
          >
            <Image
              src="/about/origin-dark.jpg"
              alt={ORIGIN.imageAlt}
              fill
              sizes="(max-width: 768px) 62vw, 38vw"
              className="object-cover object-center"
              style={{
                filter: "grayscale(1)",
                maskImage:
                  "linear-gradient(to bottom, transparent, #000 16%, #000 72%, transparent), linear-gradient(to right, transparent, #000 22%, #000 88%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent, #000 16%, #000 72%, transparent), linear-gradient(to right, transparent, #000 22%, #000 88%, transparent)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          </motion.div>

          <ArriveGroup className="relative z-10 md:ml-[14%] md:max-w-[46%]">
            <Arrive>
              <p
                className="font-editorial"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 4rem)",
                  lineHeight: 1.02,
                  maxWidth: "13ch",
                }}
              >
                {second.statement}
              </p>
            </Arrive>
            <Arrive>
              <p
                className="mt-6 max-w-[40ch] font-sans text-[15px] font-light leading-[1.7] md:text-[16px]"
                style={{ color: ON_INK_SOFT }}
              >
                {second.support}
              </p>
            </Arrive>
          </ArriveGroup>
        </div>

        {/* BEAT THREE — alone, and the largest thing on the page so far. */}
        <motion.div
          className="relative z-10 mt-36 md:mt-64"
          style={reduce ? undefined : { y: beatThreeY }}
        >
          <ArriveGroup>
            <Arrive>
              <p
                className="font-editorial"
                style={{
                  fontSize: "clamp(3rem, 8vw, 8.5rem)",
                  lineHeight: 0.94,
                  maxWidth: "11ch",
                }}
              >
                {third.statement}
              </p>
            </Arrive>
            <Arrive>
              <p
                className="mt-10 max-w-[52ch] font-sans text-[15px] font-light leading-[1.7] md:ml-[42%] md:mt-12 md:text-[17px]"
                style={{ color: ON_INK_SOFT }}
              >
                {third.support}
              </p>
            </Arrive>
          </ArriveGroup>
        </motion.div>

        {/* THE TURN — the one hairline in the scene, with material on both
            sides, and the one gold word. */}
        <ArriveGroup className="relative z-10 mt-32 md:mt-52">
          <Arrive style={{ borderTop: `1px solid ${HAIR_INK}` }}>
            <p
              className="font-editorial pt-12 md:pt-16"
              style={{
                fontSize: "clamp(1.8rem, 3.6vw, 3.8rem)",
                lineHeight: 1.06,
                maxWidth: "18ch",
              }}
            >
              {ORIGIN.turnBefore} {ORIGIN.turnYear} {ORIGIN.turnMiddle}{" "}
              <Verdict color={GOLD}>{ORIGIN.turnVerdict}</Verdict>
              {ORIGIN.turnAfter}
            </p>
          </Arrive>
        </ArriveGroup>
      </div>
    </section>
  );
}
