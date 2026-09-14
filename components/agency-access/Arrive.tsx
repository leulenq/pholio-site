"use client";

/**
 * A tiny once-on-mount arrival: opacity 0 to 1, y 20 to 0.
 *
 * Reduced motion is a second, still composition, and it must still hydrate.
 * framer's `useReducedMotion()` is already true on the FIRST client render
 * when the preference is set, while the server rendered the moving version,
 * so branching on it directly produces a hydration mismatch (lessons.md
 * §31.7). The moving markup is therefore what the server sends and what
 * hydrates; the preference is only honoured after hydration, behind a
 * `useSyncExternalStore` gate, and it then remounts the wrapper at rest
 * (`initial={false}`) so nothing fades. Props change, the tree shape does not.
 */

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.8;
const RISE = 20;

const subscribeToNothing = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

export function Arrive({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const hydrated = useHydrated();
  const prefersReduced = useReducedMotion();
  const still = hydrated && prefersReduced === true;

  return (
    <motion.div
      key={still ? "still" : "moving"}
      className={className}
      style={style}
      initial={still ? false : { opacity: 0, y: RISE }}
      animate={{ opacity: 1, y: 0 }}
      transition={still ? { duration: 0 } : { duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
