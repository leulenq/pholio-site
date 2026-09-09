"use client";

/**
 * The About page's own primitives. Values are inherited from the site system
 * (palette, three typefaces, one ease, hairline grouping); the compositions
 * are this page's. See lessons.md §1.
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";

import { ARRIVE_DURATION, ARRIVE_RISE, ARRIVE_STAGGER, EASE as ARRIVAL_EASE } from "./motion";

export const INK = "#050505";
export const CREAM = "#FAF7F2";
export const GOLD = "#C9A55A";
export const GOLD_DARK = "#A8894E";

export const ON_INK = "#FAF7F2";
export const ON_INK_SOFT = "rgba(250, 247, 242, 0.62)";
export const ON_INK_FAINT = "rgba(250, 247, 242, 0.56)";
export const HAIR_INK = "rgba(250, 247, 242, 0.12)";

export const ON_CREAM = "#0F172A";
export const ON_CREAM_SOFT = "rgba(15, 23, 42, 0.66)";
export const ON_CREAM_FAINT = "rgba(15, 23, 42, 0.62)";
export const HAIR_CREAM = "rgba(15, 23, 42, 0.12)";

export const EASE = ARRIVAL_EASE;

/** The page's measure. Same shell as the footer so the two agree on an edge. */
export const SHELL = "mx-auto w-full max-w-[1440px] px-6 md:px-14";

/* ══════════════════════════════════════════════════════════════════════
   ARRIVAL
   Reduced motion starts at the finished composition and never hides
   anything, not even for a frame. `initial` is derived from the preference
   at render time rather than through `initial={false}`, which would leave
   content stuck invisible when the preference resolves after the first
   render. Content gated behind an animation that cannot fire is the one
   motion rule this repo will not bend.
   ══════════════════════════════════════════════════════════════════════ */

export function ArriveGroup({
  children,
  className,
  style,
  amount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: reduce ? 0 : ARRIVE_STAGGER } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Arrive({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: ARRIVE_RISE },
        shown: {
          opacity: 1,
          y: 0,
          transition: reduce
            ? { duration: 0 }
            : { duration: ARRIVE_DURATION, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TEXT
   ══════════════════════════════════════════════════════════════════════ */

/** The one gold italic word a headline is allowed. */
export function Verdict({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <em className="font-editorial-italic" style={{ color, fontStyle: "italic" }}>
      {children}
    </em>
  );
}

/** A text link whose feedback is a colour and a 1px rule, never a shape.
    `internal` routes through next/link; everything else is a plain anchor. */
export function RuleLink({
  href,
  children,
  color,
  internal = false,
  onClick,
  className = "",
}: {
  href: string;
  children: ReactNode;
  color: string;
  internal?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  const classes = `group relative inline-block pb-[3px] font-sans no-underline outline-none ${className}`;
  const rule = (
    <span
      aria-hidden
      className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.28] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      style={{ background: color }}
    />
  );
  if (internal) {
    return (
      <Link href={href} className={classes} style={{ color }}>
        {children}
        {rule}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} className={classes} style={{ color }}>
      {children}
      {rule}
    </a>
  );
}

/** The gold rule that gives THE LINE its name: a hairline that draws across
    the stage as the scene runs. Transform only, so it costs nothing. */
export function DrawnRule({
  progress,
  color = GOLD_DARK,
}: {
  progress: MotionValue<number>;
  color?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="absolute left-0 h-px w-full origin-left"
      style={{
        background: `linear-gradient(to right, transparent, ${color}, ${color}, transparent)`,
        scaleX: reduce ? 1 : progress,
      }}
    />
  );
}
