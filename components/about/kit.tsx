"use client";

/**
 * The About page's own primitives.
 *
 * Values are inherited from the site system (the three colours, the three
 * typefaces and what each is for, one ease, hairline-not-card grouping, gold
 * as a state rather than a surface). The compositions are this page's own:
 * `lessons.md` §1, inherit the system and design the component.
 *
 * THE TYPE SYSTEM
 *
 * Six ranks, and nothing on the page is set outside them. The point of the
 * system is that the reading voice is editorial rather than clerical: a
 * page about photographs of people should not read in the same voice as a
 * settings screen.
 *
 *   Statement   display serif at viewport scale. Four on the page, and
 *               each one is a chapter's whole argument.
 *   Deck        display serif at 1.7 to 2.1rem, the voice that carries a
 *               real idea under or beside a statement. This is the rank
 *               that replaced the grey 14px paragraph, and it is where
 *               most of the reading happens.
 *   Note        display serif at 1.05 to 1.2rem, for the lines attached to
 *               a photograph. A whisper, in the same voice as the shout.
 *   Text        Inter 400 at 16px, tracked in slightly, leading 1.66. Used
 *               only where there is genuinely a column to read: the
 *               colophon. Never light weight, never at 13px, never at 60%.
 *   Label       mono, 10.5px, tracked 0.16em, caps. Only ever a label on
 *               something real: a group name, a role, the bill's header.
 *   Name        display serif at 2.8rem with the family in gold italic.
 *               The Collective's, preserved.
 *
 * The ink ramp is deliberate and short. On either field: 1.0 for a
 * statement, 0.88 for a deck, 0.74 for a note, 0.86 for text, 0.56 for a
 * label. Nothing sits between those values.
 *
 * Old-style figures are on in the serif ranks, so "2025" and "14" sit on
 * the baseline the way they do in print rather than standing up like
 * table data. Mono keeps lining figures, because a label on real data is
 * exactly where figures should line up.
 */

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { Fragment } from "./content";
import { ARRIVE_DURATION, ARRIVE_RISE, ARRIVE_STAGGER, EASE as ARRIVAL_EASE } from "./motion";

export const INK = "#050505";
export const CREAM = "#FAF7F2";
export const GOLD = "#C9A55A";
/** Gold that still measures 4.5:1 on cream. Never `GOLD` on paper. */
export const GOLD_DARK = "#A8894E";

/** The ink ramp, one entry per rank. Light type on a dark ground blooms,
    so the two fields do not share alpha values (`lessons.md` §46.7). */
export const ON_INK = {
  statement: "#FAF7F2",
  deck: "rgba(250, 247, 242, 0.88)",
  note: "rgba(250, 247, 242, 0.74)",
  text: "rgba(250, 247, 242, 0.86)",
  label: "rgba(250, 247, 242, 0.56)",
} as const;

export const ON_CREAM = {
  statement: "#0F172A",
  deck: "rgba(15, 23, 42, 0.9)",
  note: "rgba(15, 23, 42, 0.76)",
  text: "rgba(15, 23, 42, 0.86)",
  label: "rgba(15, 23, 42, 0.54)",
} as const;

/** Old-style figures, on every serif rank. */
export const OLDSTYLE = { fontFeatureSettings: '"onum" 1, "kern" 1' } as const;

export const EASE = ARRIVAL_EASE;

/** The page's measure. Same shell as the footer, so the two agree on an edge. */
export const SHELL = "mx-auto w-full max-w-[1440px] px-6 md:px-14";

/* ══════════════════════════════════════════════════════════════════════
   HYDRATION AND STAGE

   `useReducedMotion()` is false on the server and on the first client
   render, so a component that returns a different tree for it hydrates
   against markup that no longer exists: React discards the tree,
   framer-motion loses its scroll target, and the chapter renders empty
   (`lessons.md` §31.7). The still composition is what the server sends;
   the scrubbed one mounts only once the client is running.
   ══════════════════════════════════════════════════════════════════════ */

const subscribeToNothing = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/** True while the page must render the still composition. */
export function useStillComposition() {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  return !hydrated || reduce === true;
}

/** The narrow stage. 1023 is where the gutter beside a figure disappears
    (`08-narrow-stage.md` §2). False on the server, so the wide composition
    hydrates and the narrow one takes over after. */
export function useCompactStage() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const read = () => setCompact(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);
  return compact;
}

/* ══════════════════════════════════════════════════════════════════════
   ARRIVAL

   Reduced motion starts at the finished composition and never hides
   anything, not even for a frame. Content gated behind an animation that
   cannot fire is the one motion rule this repo will not bend.
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
          transition: reduce ? { duration: 0 } : { duration: ARRIVE_DURATION, ease: EASE },
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

/* ── THE SIX RANKS ─────────────────────────────────────────────────── */

type Field = "ink" | "cream";
const ramp = (field: Field) => (field === "ink" ? ON_INK : ON_CREAM);

/** Rank 1. A chapter's whole argument, at viewport scale. */
export function Statement({
  field = "ink",
  size = "clamp(2.15rem, 5.5vw, 5.5rem)",
  className = "",
  style,
  as: Tag = "p",
  id,
  children,
}: {
  field?: Field;
  size?: string;
  className?: string;
  style?: CSSProperties;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={`font-editorial ${className}`}
      style={{
        ...OLDSTYLE,
        color: ramp(field).statement,
        fontSize: size,
        lineHeight: 0.98,
        letterSpacing: "-0.032em",
        textWrap: "balance",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** Rank 2. The reading voice. Serif, generous, at full presence: this is
    the rank that carries an idea, and it is never a grey paragraph. */
export function Deck({
  field = "ink",
  size = "clamp(1.25rem, 1.85vw, 1.9rem)",
  className = "",
  style,
  children,
}: {
  field?: Field;
  size?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <p
      className={`font-editorial ${className}`}
      style={{
        ...OLDSTYLE,
        color: ramp(field).deck,
        fontSize: size,
        lineHeight: 1.34,
        letterSpacing: "-0.014em",
        fontWeight: 400,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Rank 3. The line attached to a photograph. Same voice as the shout,
    two thirds of a whisper. */
export function Note({
  field = "ink",
  size = "clamp(1rem, 1.18vw, 1.18rem)",
  className = "",
  style,
  children,
}: {
  field?: Field;
  size?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <p
      className={`font-editorial ${className}`}
      style={{
        ...OLDSTYLE,
        color: ramp(field).note,
        fontSize: size,
        lineHeight: 1.44,
        letterSpacing: "-0.008em",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Rank 4. A real column to read. Inter, at a size and a weight that do
    not apologise for being there. */
export function Text({
  field = "ink",
  className = "",
  style,
  children,
}: {
  field?: Field;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <p
      className={`font-sans ${className}`}
      style={{
        color: ramp(field).text,
        fontSize: "clamp(0.95rem, 1.05vw, 1.0rem)",
        lineHeight: 1.66,
        letterSpacing: "-0.005em",
        fontWeight: 400,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** Rank 5. Mono, and only ever a label on something real. */
export function Label({
  field = "ink",
  gold = false,
  className = "",
  style,
  as: Tag = "p",
  children,
}: {
  field?: Field;
  gold?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: "p" | "h3" | "span";
  children: ReactNode;
}) {
  return (
    <Tag
      className={`font-mono ${className}`}
      style={{
        color: gold ? (field === "ink" ? GOLD : GOLD_DARK) : ramp(field).label,
        fontSize: "10.5px",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontWeight: 400,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/** The one gold italic word a headline is allowed. Never two. */
export function Verdict({ children, color }: { children: ReactNode; color: string }) {
  return (
    <em className="font-editorial-italic" style={{ color, fontStyle: "italic" }}>
      {children}
    </em>
  );
}

/**
 * A display lockup written as fragments, so the copy audit reads the words
 * and the line breaks together. At most one gold verdict inside it.
 */
export function Display({
  parts,
  gold,
  className,
  style,
  id,
  as: Tag = "p",
}: {
  parts: readonly Fragment[];
  gold: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  return (
    <Tag id={id} className={`font-editorial ${className ?? ""}`} style={style}>
      {parts.map((part, i) => (
        <span key={i}>
          {part.break ? <br /> : null}
          {part.text}
          {part.verdict ? <Verdict color={gold}>{part.verdict}</Verdict> : null}
        </span>
      ))}
    </Tag>
  );
}

/**
 * A text link whose feedback is a colour and a 1px rule, never a shape.
 *
 * `rule` exists because gold on cream measures 3.1:1: enough for a 1px edge
 * and for display sizes, not for a link at reading size. On paper the label
 * takes the ink and the gold takes the rule, which is the answer the
 * pricing controls already arrived at (`lessons.md` §46.2).
 */
export function RuleLink({
  href,
  children,
  color,
  rule: ruleColor,
  internal = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  color: string;
  rule?: string;
  internal?: boolean;
  className?: string;
}) {
  const classes = `group relative inline-block pb-[3px] no-underline focus-visible:outline-1 focus-visible:outline-offset-[6px] ${className}`;
  const rule = (
    <span
      aria-hidden
      className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.28] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      style={{ background: ruleColor ?? color }}
    />
  );
  if (internal) {
    return (
      <Link href={href} className={classes} style={{ color, outlineColor: color }}>
        {children}
        {rule}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} style={{ color, outlineColor: color }}>
      {children}
      {rule}
    </a>
  );
}
