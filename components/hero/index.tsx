"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";

import Intelligence from "@/components/intelligence";
import SceneCompCard, { CompCardLayers } from "@/components/comp-card";
import { leave } from "@/components/intelligence/ease";
import Ribbon from "@/components/intelligence/Ribbon";
import HeroChrome from "./HeroChrome";
import { useFrameSequence } from "./useFrameSequence";
import { useMediaQuery } from "./useMediaQuery";
import {
  FRAMES,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  FIGURE_DRIFT,
  FIGURE_RISE,
  FIGURE_SCALE,
  FIGURE_STOPS,
  FIGURE_HANDOVER,
  HERO_FRACTION,
  HOME_STAGE_VH,
  STATIC_FIGURE_SCALE,
  WHEEL_EXIT,
  WORDMARK_EXIT,
  frameIndexAtProgress,
  frameSrc,
} from "./motion";

/**
 * Home hero, adapted from the pholio-landing archive hero.
 *
 * Core narrative preserved: a full-bleed editorial portrait with "PHOLIO" set
 * large behind it; as the visitor scrolls, the figure drifts right and clears
 * the centre. The word wheel from the archive sits in the right margin in the
 * opening frame and fades with the wordmark.
 *
 * Removed for the reset: embedded navigation chrome (the sitewide Index header
 * now owns navigation and is marked via data-hero-chrome), the scroll cue, the
 * cursor spotlight, and the ambient radial glow.
 *
 * The portrait is the extracted frame sequence rather than a single still, so
 * her movement is real footage and the copy's exit is timed against it. All of
 * that timing lives in `motion.ts`, authored in frame numbers.
 */

const HERO_WORDS = ["Digitals", "Portfolio", "Comp Card", "Applications", "Tracker"];
const WORD_INTERVAL = 2400;
const N = HERO_WORDS.length;
const ROW_H = 46; // px

/** A frame from the settled standing stretch, for the reduced-motion still. */
const STILL_FRAME = 97;

export default function Hero({ ready = true }: { ready?: boolean }) {
  const containerRef = useRef<HTMLElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  // Below 1024 the figure has no gutter to stand in beside the intelligence
  // copy, so it takes the narrow treatment. See `motion.ts` FIGURE_SCALE.
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const { canvasRef, draw, posterReady } = useFrameSequence(FRAMES, frameSrc);

  useEffect(() => {
    if (prefersReducedMotion || !ready) return;
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % N);
    }, WORD_INTERVAL);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, ready]);

  // One scroll container for the whole home stage, split into two timelines.
  // The hero keeps exactly the scroll distance it always had, so none of its
  // frame cues move; the comp-card beat runs on the remainder. Because both
  // live in the same sticky container there is no unpin between them, which
  // is what stops the second scene reading as a separate feature block.
  const { scrollYProgress: stageProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const scrollYProgress = useTransform(
    stageProgress,
    [0, HERO_FRACTION],
    [0, 1],
    { clamp: true },
  );
  const cardProgress = useTransform(
    stageProgress,
    [HERO_FRACTION, 1],
    [0, 1],
    { clamp: true },
  );

  // The comp-card timeline starts a little into its own scroll, so the stage
  // is clear of her before the first plate is readable. The overlap that
  // remains is deliberate: one scene leaving as the next arrives.
  const cardTimeline = useTransform(cardProgress, [0.1, 1], [0, 1], {
    clamp: true,
  });

  // The handover: she keeps travelling up out of frame while the first plates
  // travel in. Same direction, same curve as everything else on the stage.
  //
  // Kept as a number so the figure can add it to its own rise, with a vh
  // string derived for anything that consumes it alone: framer reads a bare
  // number as pixels, which silently made this a 150px nudge instead of a
  // 150vh exit.
  const handoverY = useTransform(
    cardProgress,
    [0, 0.13],
    [0, isMobile ? FIGURE_HANDOVER.mobile : FIGURE_HANDOVER.desktop],
    { ease: leave },
  );

  // The copy goes first, and faster. Type dying on top of an arriving
  // photograph is the one thing that made the seam read as collage rather
  // than as a hand over.
  const copyHandover = useTransform(cardProgress, [0, 0.06], [0, -130], {
    ease: leave,
  });

  // Frames and overlays read the same raw progress. Smoothing one and not the
  // other is what makes a figure look detached from her own footage.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    draw(frameIndexAtProgress(p));
  });

  useEffect(() => {
    if (posterReady) draw(frameIndexAtProgress(scrollYProgress.get()));
  }, [posterReady, draw, scrollYProgress]);

  // ── Wordmark: holds while she holds, then rises as she does ──────────────
  const wordmarkY = useTransform(
    scrollYProgress,
    [WORDMARK_EXIT.start, WORDMARK_EXIT.peak, WORDMARK_EXIT.end],
    [0, -190, -280],
  );
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [WORDMARK_EXIT.start, WORDMARK_EXIT.peak, WORDMARK_EXIT.end],
    [0.85, 0.32, 0],
  );

  // Clears earlier than the wordmark so the opening does not leave as a block.
  const wheelOpacity = useTransform(
    scrollYProgress,
    [WHEEL_EXIT.start, WHEEL_EXIT.end],
    [1, 0],
  );

  const figureX = useTransform(
    scrollYProgress,
    [...FIGURE_STOPS],
    isMobile ? [...FIGURE_DRIFT.mobile] : [...FIGURE_DRIFT.desktop],
  );
  const figureScale = useTransform(
    scrollYProgress,
    [...FIGURE_STOPS],
    isMobile ? [...FIGURE_SCALE.mobile] : [...FIGURE_SCALE.desktop],
  );
  // The plate scales about its own centre, so this is what keeps her head in
  // frame as the intelligence beat pushes in. See motion.ts, the camera block.
  const copyHandoverVh = useTransform(copyHandover, (v: number) => `${v}vh`);

  const figureRise = useTransform(
    scrollYProgress,
    [...FIGURE_STOPS],
    isMobile ? [...FIGURE_RISE.mobile] : [...FIGURE_RISE.desktop],
  );
  const figureY = useTransform(
    () => `${figureRise.get() + handoverY.get()}vh`,
  );

  const bgColor = useTransform(
    scrollYProgress,
    [0, FIGURE_STOPS[1], FIGURE_STOPS[2], 1],
    ["#050505", "#050505", "#050505", "#050505"]
  );

  // The gold radial gradient fades out as soon as she starts to move (FIGURE_STOPS[1]),
  // leaving the solid black base.
  const sceneryOpacity = useTransform(
    scrollYProgress, 
    [0, FIGURE_STOPS[1], FIGURE_STOPS[2]], 
    [1, 1, 0]
  );
  const ambientScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.025, 1.08]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const grain = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundSize: "150px 150px",
      }}
    />
  );

  const wordmark = (
    <h1
      data-hero-wordmark
      className="whitespace-nowrap text-center font-editorial leading-none"
      style={{
        fontSize: "clamp(5rem, 28vw, 28rem)",
        color: "#FAF7F2",
        WebkitTextStroke: "1px rgba(201, 165, 90, 0.5)",
      }}
    >
      PHOLIO
    </h1>
  );

  // ── Reduced motion: a second composition, not a shorter scrub ────────────
  // Both beats are shown as finished stills, in flow, with nothing withheld.
  if (prefersReducedMotion) {
    return (
      <section ref={containerRef} data-hero-chrome className="relative z-10">
        <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 z-0 bg-[#050505]" />
          
          <div
            className="absolute inset-0 z-[14] pointer-events-none opacity-100"
          >
            <div
              className="absolute inset-0 opacity-[0.1]"
              style={{
                background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201, 165, 90, 0.4) 0%, transparent 70%)",
                scale: 1,
              }}
            />
          </div>

          {grain}
          <HeroChrome staticMode />
          <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center px-6 pt-[17vh] opacity-85 md:pt-[15vh]">
            {wordmark}
          </div>
          <div className="absolute inset-0 z-20 flex items-end justify-center">
            <Image
              src={frameSrc(1)}
              alt="Editorial portrait, seated pose"
              width={FRAME_WIDTH}
              height={FRAME_HEIGHT}
              priority
              className="h-full w-full object-contain object-bottom"
              style={{ scale: isMobile ? STATIC_FIGURE_SCALE.mobile : STATIC_FIGURE_SCALE.desktop }}
              sizes="(max-width: 767px) 100vw, 60dvh"
            />
          </div>
        </div>

        {/* The intelligence sequence, still. She stays the anchor: the frame
            holds beside the reading rather than scrolling away from it. */}
        <div className="relative w-full bg-[#050505]">
          {grain}
          <div className="relative z-20 flex">
            <div className="min-w-0 flex-1">
              <Intelligence isMobile={isMobile} />
            </div>
            <div className="sticky top-0 hidden h-[100dvh] w-[34%] shrink-0 items-end justify-center md:flex">
              <Image
                src={frameSrc(STILL_FRAME)}
                alt="Editorial portrait, standing"
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                className="h-full w-full object-contain object-bottom"
                sizes="34vw"
              />
            </div>
          </div>
        </div>

        <SceneCompCard />
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      data-hero-chrome
      className="relative z-10"
      style={{ height: `${HOME_STAGE_VH}vh` }}
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        <HeroChrome progress={scrollYProgress} />
        {/* Velvet field. Opaque, so the header's polarity sampler can read it. */}
        <motion.div className="absolute inset-0 z-0" style={{ backgroundColor: bgColor }} />

        {/* ── Ambient Base (mobile + always-on) ── */}
        <motion.div
          className="absolute inset-0 z-[14] pointer-events-none"
          style={{ opacity: sceneryOpacity }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.07, 0.13, 0.07] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201, 165, 90, 0.4) 0%, transparent 70%)",
              scale: ambientScale,
            }}
          />
        </motion.div>

        {grain}

        {/* ── Under the figure: the intelligence section's whole type layer,
              mounted in the hero's own z-stack so she occludes it and so the
              first line can begin before the hero is over. Nothing here edits
              the hero. See components/intelligence. ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[15]"
          style={{ y: copyHandoverVh, willChange: "transform" }}
        >
          <Ribbon progress={scrollYProgress} compact={isMobile} />
          <Intelligence progress={scrollYProgress} isMobile={isMobile} />
        </motion.div>

        {/* ── The comp-card beat. Same pinned stage, second timeline. ── */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <CompCardLayers progress={cardTimeline} />
        </div>

        {/* ── BEAT 1 — the wordmark, set behind her ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center px-6 pt-[17vh] md:pt-[15vh]"
          style={{
            opacity: wordmarkOpacity,
            y: wordmarkY,
            willChange: "transform, opacity",
          }}
        >
          {wordmark}
        </motion.div>

        {/* ── BEAT 2 — the figure, scrubbed from the extracted frames ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
          style={{
            x: figureX,
            y: figureY,
            scale: figureScale,
            willChange: "transform",
          }}
        >
          {/* Poster: a real image for LCP, and cover while the sequence streams. */}
          <Image
            src={frameSrc(1)}
            alt="Editorial portrait, seated pose"
            width={FRAME_WIDTH}
            height={FRAME_HEIGHT}
            priority
            className="absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-300"
            style={{ opacity: posterReady ? 0 : 1 }}
            sizes="(max-width: 767px) 100vw, 60dvh"
          />
          <canvas
            ref={canvasRef}
            width={FRAME_WIDTH}
            height={FRAME_HEIGHT}
            aria-hidden
            className="h-full w-full"
            style={{ objectFit: "contain", objectPosition: "bottom center" }}
          />
        </motion.div>

        {/* ── BEAT 1 — word wheel, clears before the wordmark ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          style={{ opacity: wheelOpacity, willChange: "opacity" }}
        >
          <div className="relative mx-auto h-full w-full max-w-[1440px] px-6 md:px-12">
            <div
              data-hero-word-wheel
              className="absolute bottom-10 right-6 hidden md:bottom-14 md:right-12 md:block"
              style={{
                height: ROW_H * 3,
                width: 260,
                overflow: "hidden",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
              }}
            >
              {HERO_WORDS.map((word, i) => {
                let dist = (((i - wordIndex) % N) + N) % N;
                if (dist > Math.floor(N / 2)) dist -= N;

                const absD = Math.abs(dist);
                const isActive = dist === 0;
                const yPos = ROW_H + dist * ROW_H;

                return (
                  <motion.div
                    key={word}
                    initial={false}
                    animate={{
                      y: yPos,
                      opacity: isActive ? 1 : absD === 1 ? 0.22 : 0,
                      x: isActive ? -12 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 55,
                      damping: 16,
                      mass: 1.2,
                    }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: ROW_H,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "14px",
                    }}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        color: isActive ? "#C9A55A" : "rgba(250,247,242,0.55)",
                        fontSize: isActive ? "1.5rem" : "1.25rem",
                        scale: isActive ? 1 : 0.92,
                      }}
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontWeight: 300,
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                        lineHeight: 1,
                      }}
                    >
                      {word}
                    </motion.span>
                    {isActive && (
                      <motion.div
                        layoutId="active-rule"
                        className="h-[1px] w-6"
                        style={{ backgroundColor: "#C9A55A" }}
                        initial={false}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 pointer-events-none"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <motion.div
            className="w-[1px] h-12"
            style={{
              background: "linear-gradient(to bottom, transparent, #C9A55A, transparent)",
              transformOrigin: "top",
            }}
            animate={{ scaleY: [0, 1, 0], y: [0, 20, 40], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

      </div>
    </section>
  );
}
