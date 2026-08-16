"use client";

import { motion } from "framer-motion";

const GOLD = "#C9A55A";

export type EditorialDividerAnimation = "travel" | "reveal" | "none";

interface EditorialVerticalDividerProps {
  className?: string;
  height?: number;
  animation?: EditorialDividerAnimation;
  revealed?: boolean;
}

/**
 * Canonical vertical editorial divider.
 *
 * - travel: the continuous travelling dot used for scroll cues.
 * - reveal: scales in once when a section arrives.
 * - none: static gold line.
 */
export function EditorialVerticalDivider({
  className = "",
  height = 48,
  animation = "travel",
  revealed = true,
}: EditorialVerticalDividerProps) {
  const isReveal = animation === "reveal";
  const isStatic = animation === "none";

  return (
    <motion.div
      aria-hidden="true"
      className={`w-px ${className}`.trim()}
      style={{
        height,
        background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
        transformOrigin: "top",
      }}
      initial={isReveal ? { scaleY: 0 } : undefined}
      animate={
        isStatic
          ? undefined
          : isReveal
            ? revealed
              ? { scaleY: 1 }
              : {}
            : {
                scaleY: [0, 1, 0],
                y: [0, 20, 40],
                opacity: [0, 1, 0],
              }
      }
      transition={
        isStatic
          ? undefined
          : isReveal
            ? { delay: 0.6, duration: 0.8, ease: "easeOut" }
            : {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
      }
    />
  );
}
