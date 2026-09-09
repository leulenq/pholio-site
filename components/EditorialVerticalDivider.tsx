"use client";

import { motion } from "framer-motion";

export type EditorialDividerAnimation = "travel" | "reveal" | "none";

type EditorialVerticalDividerProps = {
  className?: string;
  height?: number;
  animation?: EditorialDividerAnimation;
  revealed?: boolean;
  /** #C9A55A on ink; pass the dark gold on cream, where it washes out. */
  color?: string;
};

/**
 * Canonical vertical editorial divider, matching the homepage hero scroll cue.
 */
export function EditorialVerticalDivider({
  className = "",
  height = 48,
  animation = "travel",
  revealed = true,
  color = "#C9A55A",
}: EditorialVerticalDividerProps) {
  const isReveal = animation === "reveal";
  const isStatic = animation === "none";

  return (
    <motion.div
      aria-hidden="true"
      className={`w-px ${className}`.trim()}
      style={{
        height,
        background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
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
