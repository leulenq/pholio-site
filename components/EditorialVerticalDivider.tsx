"use client";

import { motion } from "framer-motion";

type EditorialVerticalDividerProps = {
  className?: string;
  height?: number;
  animation?: "travel" | "reveal" | "none";
  revealed?: boolean;
};

/**
 * Canonical vertical editorial divider, matching the homepage hero scroll cue.
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
        background:
          "linear-gradient(to bottom, transparent, #C9A55A, transparent)",
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
