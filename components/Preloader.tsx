"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  /** True once the hero's opening frames and the fonts are actually in hand. */
  ready: boolean;
  onComplete: () => void;
}

/*
 * The veil lifts on the later of two things: the brand beat having played, and
 * the stage behind it being ready. It is a floor, not a timer.
 *
 * It used to be a bare 1800ms setTimeout. Because that timer starts at
 * hydration, and hydration was starved by the comp-card plates in the SSR
 * markup, the measured reveal was 2.7s / 6.6s / 13.9s / 25.6s on
 * unthrottled / Fast 4G / Slow 4G / Fast 3G -- and on the slower three it
 * uncovered a hero holding 4, 0 and 0 of its 127 frames. A timer cannot know
 * that. See components/comp-card/assets.tsx for the full measurements.
 */
const FLOOR_MS = 1800;
const FLOOR_REDUCED_MS = 100;

/*
 * And a ceiling, because a visitor must never be trapped behind the veil by an
 * asset that never arrives. Past this the stage is shown regardless: a hero
 * mid-stream is a worse first impression than a black screen, but an endless
 * black screen is worse than both.
 */
const CEILING_MS = 5000;
const CEILING_REDUCED_MS = 600;

export default function Preloader({ ready, onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);
  const startRef = useRef(0);
  const reducedRef = useRef(false);

  /* onComplete fires at 400ms into the 700ms exit so the veil's fade-out
     overlaps the content's fade-in, leaving no dead zone of pure black. */
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setVisible(false);
    window.setTimeout(onComplete, 400);
  }, [onComplete]);

  useEffect(() => {
    startRef.current = performance.now();
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ceiling = window.setTimeout(
      finish,
      reducedRef.current ? CEILING_REDUCED_MS : CEILING_MS,
    );
    return () => window.clearTimeout(ceiling);
  }, [finish]);

  useEffect(() => {
    if (!ready) return;
    const floor = reducedRef.current ? FLOOR_REDUCED_MS : FLOOR_MS;
    const remaining = Math.max(0, floor - (performance.now() - startRef.current));
    const timeout = window.setTimeout(finish, remaining);
    return () => window.clearTimeout(timeout);
  }, [ready, finish]);

  /*
   * Nothing scrolls while the veil is up. The stage behind it is 1130vh and
   * only transparent, so without this a visitor who scrolls during the wait is
   * dropped into the middle of a scene when the veil lifts.
   */
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    /* Classic scrollbars would otherwise take 15px of width with them. */
    const gutter = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "#050505" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient gold glow */}
          <div
            className="absolute rounded-full opacity-[0.04]"
            style={{ width: 1000, height: 1000, background: "radial-gradient(circle, #C8A96E 0%, transparent 55%)" }}
          />

          <div className="relative flex flex-col items-center">
            {/* Wordmark */}
            <div className="flex items-center overflow-hidden">
              {"PHOLIO".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-4xl sm:text-5xl md:text-6xl"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    color: "#C8A96E",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Gold sweep underline */}
            <motion.div
              className="mt-4 h-[1px] rounded-full"
              style={{
                background:
                  "linear-gradient(to right, transparent, #C8A96E, transparent)",
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
