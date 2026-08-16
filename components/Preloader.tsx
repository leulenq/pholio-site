"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const timeout = setTimeout(
      () => {
        setVisible(false);
        /* Fire at 400ms (not 700ms end) to overlap with content fade-in */
        setTimeout(onComplete, 400);
      },
      prefersReduced ? 100 : 1800
    );

    return () => clearTimeout(timeout);
  }, [onComplete]);

  /*
   * onComplete fires at 400ms into the exit animation (not 700ms end).
   * This overlaps the preloader fade-out with the content fade-in so
   * there is no dead zone of pure black between the two.
   */

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
