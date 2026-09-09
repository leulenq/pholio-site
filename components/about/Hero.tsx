"use client";

/**
 * THE HERO
 *
 * One statement, held over a photograph, with the invitation beneath it.
 *
 * The photograph is a camera rather than a backdrop: it pushes in for the
 * whole life of the scene while the composition rises off the top of the
 * frame, so the hero is still moving when the next scene takes the screen.
 * The invitation is the owner's kept asset, the label over the pulsing gold
 * divider, and it names the scene it travels to.
 *
 * Freeze the page at scroll zero and this frame stands on its own.
 */

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { ScrollInvitation } from "@/components/ScrollInvitation";

import { HERO, LINE_ID } from "./content";
import { GOLD, INK, ON_INK, ON_INK_SOFT, SHELL, Verdict } from "./kit";
import {
  EASE,
  HERO_CUE_FADE,
  HERO_IMAGE_SCALE,
  HERO_IMAGE_Y,
  HERO_TEXT_Y,
} from "./motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [...HERO_IMAGE_SCALE]);
  const imageY = useTransform(scrollYProgress, [0, 1], [...HERO_IMAGE_Y]);
  const textY = useTransform(scrollYProgress, [0, 1], [...HERO_TEXT_Y]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [...HERO_CUE_FADE], [1, 0]);

  return (
    <section
      ref={ref}
      aria-labelledby="about-hero-title"
      className="texture-grain relative flex min-h-mobile-screen w-full items-center justify-center overflow-hidden"
      style={{ background: INK, color: ON_INK }}
    >
      {/* The photograph, and the two washes that let type sit on it: a
          vertical gradient into the ink at both edges, and a centre veil that
          holds the headline's contrast wherever her highlights fall. */}
      <motion.div
        aria-hidden={false}
        className="absolute inset-0 z-0"
        style={reduce ? undefined : { scale: imageScale, y: imageY }}
      >
        <Image
          src="/about/hero.jpg"
          alt={HERO.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_18%] md:object-[78%_34%]"
          style={{ filter: "grayscale(1) contrast(1.06)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.42) 34%, rgba(5,5,5,0.56) 66%, #050505 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(112% 72% at 40% 46%, rgba(5,5,5,0.80) 0%, rgba(5,5,5,0.34) 50%, transparent 76%)",
          }}
        />
      </motion.div>

      <motion.div
        className={`${SHELL} relative z-10 text-center`}
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.h1
          id="about-hero-title"
          initial={reduce ? false : { opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="font-editorial mx-auto"
          style={{
            fontSize: "clamp(2.9rem, 8.6vw, 9.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            maxWidth: "15ch",
          }}
        >
          {HERO.headlineBefore}{" "}
          <Verdict color={GOLD}>{HERO.verdict}</Verdict>
          {HERO.headlineAfter}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: reduce ? 0 : 0.6, ease: EASE }}
          className="mx-auto mt-9 max-w-xl font-sans text-[14px] font-light leading-[1.8] tracking-wide md:mt-12 md:text-[16px]"
          style={{ color: ON_INK_SOFT }}
        >
          {HERO.support[0]}
          <br className="hidden sm:block" />{" "}
          {HERO.support[1]}
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2"
        style={reduce ? undefined : { opacity: cueOpacity }}
      >
        <ScrollInvitation label={HERO.invitation} targetId={LINE_ID} color={GOLD} />
      </motion.div>
    </section>
  );
}
