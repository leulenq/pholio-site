"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { useMediaQuery } from "@/components/hero/useMediaQuery";
import { GOLD_ON_PAPER, INK, CREAM, TIMELINE_SPRING, arrive, clamp01 } from "@/components/studio-site/motion";

import {
  ANNUAL_SAVING,
  HEADING,
  INTERVAL_LABELS,
  PLANS,
  STUDIO_PRICES,
  type Interval,
} from "./content";

/**
 * PRICING
 *
 * The familiar architecture, kept on purpose (lessons §43): plan name,
 * audience, price, billing, one action, then the differences.
 *
 * Identity: Free and Agencies are open type on the page's cream. Studio+ is
 * the one solid field, Pholio navy with the gold cross (§43.4). Agencies is
 * not a tier above Studio+; it is the other side of the platform, so it
 * stands a little apart from the two talent plans.
 *
 * **Motion: the row is set by the scroll.** Like everything on the stage
 * above, nothing here fades in on a timer; the page's own scroll moves the
 * pieces into place and a frozen frame is the same row, still settling.
 *
 *   - The headline arrives a word at a time, each word travelling up
 *     behind the one before.
 *   - The three columns travel up at their own rates. The Studio+ field
 *     moves fastest and furthest, so it overtakes the row and comes to rest
 *     standing proud of it, and its paper opens down from its top edge as
 *     it rises: the lift is made by the motion, not drawn.
 *   - Inside every plan the pieces follow each other up, a line of type
 *     behind its column: name, price, action, then the list, one item at a
 *     time, its rule drawing as the item lands. Inside the field they lag
 *     the field itself, so the field arrives first and its contents after.
 *   - Its cross turns a quarter as the field arrives, the turn the cross
 *     made when it opened on the stage.
 *   - Past rest, as the page carries on to the closing panel, the field keeps
 *     drifting ahead of the paper plans, so the row never locks flat.
 *
 * The billing period is chosen in the band at the top of the field: two
 * words, a gold rule under the chosen one that travels between them, the
 * saving part of the yearly label. The price and billing line roll.
 *
 * Every action has one hover and focus behaviour: a fill rises from the
 * bottom edge like a light coming up, and the label rolls to its inverse.
 */

const SERIF = "var(--font-serif)";
const SANS = "var(--font-sans)";
const INK_SOFT = "rgba(15, 23, 42, 0.68)";
const CREAM_SOFT = "rgba(250, 247, 242, 0.62)";
const GOLD_ON_CLOTH = "#C9A55A";
const ROLL = "cubic-bezier(0.22,1,0.36,1)";

type Tone = "paper" | "cloth";

/** Scroll windows, as progress of the section through the viewport. */
const T = {
  heading: [0.02, 0.32],
  free: [0.36, 0.72],
  studio: [0.3, 0.72],
  agencies: [0.42, 0.78],
  open: [0.3, 0.62],
  turn: [0.5, 0.8],
} as const;

/** Where each column starts, below its rest, in vh. */
const TRAVEL = { heading: 12, word: 9, free: 16, studio: 36, agencies: 22, piece: 7, drift: 7 } as const;

/** How far behind its column each piece inside a plan starts and ends. */
const LAG = { step: 0.032, span: 0.24 } as const;

const phase = (p: number, w: readonly [number, number]) => arrive(clamp01((p - w[0]) / (w[1] - w[0])));

function useTravel(progress: MotionValue<number>, w: readonly [number, number], vh: number) {
  return useTransform(progress, (p) => `${(1 - phase(p, w)) * vh}vh`);
}

// ── Type ──────────────────────────────────────────────────────────────────

function PlanName({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <h3
      className="m-0 uppercase"
      style={{
        fontFamily: SERIF,
        fontSize: "clamp(1.375rem, 1.9vw, 1.75rem)",
        letterSpacing: "0.08em",
        lineHeight: 1,
        color: tone === "paper" ? INK : CREAM,
      }}
    >
      {children}
    </h3>
  );
}

function Cross({ size, color, bar = 1.5 }: { size: number; color: string; bar?: number }) {
  return (
    <span aria-hidden className="relative block" style={{ width: size, height: size }}>
      <span className="absolute left-0 top-1/2 w-full -translate-y-1/2" style={{ height: bar, backgroundColor: color }} />
      <span className="absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ width: bar, backgroundColor: color }} />
    </span>
  );
}

function Audience({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <p className="m-0 mt-3" style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.4, color: tone === "paper" ? INK_SOFT : CREAM_SOFT }}>
      {children}
    </p>
  );
}

const priceStyle = (tone: Tone) =>
  ({
    fontFamily: SERIF,
    fontSize: "clamp(3.25rem, 5vw, 4.75rem)",
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
    color: tone === "paper" ? INK : CREAM,
  }) as const;

/**
 * A line that rolls when its text changes: the old text travels up out of
 * the line and the new one comes up from under it, inside the line's own
 * height. `initial={false}` so nothing rolls on first paint.
 */
function Roll({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className ?? ""}`} style={style}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={text}
          className="col-start-1 row-start-1 block whitespace-nowrap"
          initial={reduce ? false : { y: "105%" }}
          animate={{ y: "0%" }}
          exit={reduce ? { opacity: 0 } : { y: "-105%" }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Billing({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <p className="m-0 mt-2.5" style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.5, color: tone === "paper" ? INK_SOFT : CREAM_SOFT, minHeight: "1.5em" }}>
      {children}
    </p>
  );
}

// ── Actions ───────────────────────────────────────────────────────────────

type ActionVariant = "ink" | "outline" | "cream";

/**
 * One behaviour for every action. At rest: a solid or ruled rectangle. On
 * hover and on keyboard focus: a fill rises from the bottom edge (a light
 * coming up, not a colour swap) and the label rolls up to its inverse, the
 * rolled-in copy hidden from assistive tech. Pressed, it gives a little.
 */
function Action({ href, label, variant }: { href: string; label: string; variant: ActionVariant }) {
  const v = {
    ink: { bg: INK, border: INK, text: CREAM, fill: GOLD_ON_CLOTH, textOn: INK, ring: GOLD_ON_PAPER },
    outline: { bg: "transparent", border: INK, text: INK, fill: INK, textOn: CREAM, ring: GOLD_ON_PAPER },
    cream: { bg: CREAM, border: CREAM, text: INK, fill: GOLD_ON_CLOTH, textOn: INK, ring: GOLD_ON_CLOTH },
  }[variant];
  return (
    <a
      href={href}
      className="group relative flex w-full items-center justify-center overflow-hidden outline-none transition-transform duration-200 active:scale-[0.985] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
      style={{
        backgroundColor: v.bg,
        boxShadow: `inset 0 0 0 1px ${v.border}`,
        outlineColor: v.ring,
        padding: "1rem 1.25rem",
        fontFamily: SANS,
        fontSize: 12.5,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[560ms] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
        style={{ backgroundColor: v.fill, transitionTimingFunction: ROLL }}
      />
      <span className="relative flex items-center">
        <span className="relative block overflow-hidden" style={{ height: "1.25em", lineHeight: "1.25em" }}>
          <span
            className="block transition-transform duration-[560ms] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2 motion-reduce:transition-none"
            style={{ transitionTimingFunction: ROLL }}
          >
            <span className="block whitespace-nowrap" style={{ color: v.text }}>
              {label}
            </span>
            <span aria-hidden className="block whitespace-nowrap" style={{ color: v.textOn }}>
              {label}
            </span>
          </span>
        </span>
        {/* The cross arrives at the label's end and turns as it does. */}
        <span
          aria-hidden
          className="ml-0 block w-0 -rotate-90 overflow-hidden opacity-0 transition-all duration-[560ms] group-hover:ml-3 group-focus-visible:ml-3 group-hover:w-[10px] group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:w-[10px] group-focus-visible:rotate-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
          style={{ transitionTimingFunction: ROLL }}
        >
          <Cross size={10} color={v.textOn} />
        </span>
      </span>
    </a>
  );
}

// ── The billing period ────────────────────────────────────────────────────

/**
 * At the top of the Studio+ field, in the band it stands above the row, so
 * the choice is made before the price it changes is read and the three
 * prices stay on one line. Two words; the chosen one is in cream with a gold
 * rule under it that travels to the other when it changes. The saving is
 * part of the yearly option's own label, so it is never read apart from it.
 * A radio group underneath: arrows move, Tab leaves.
 */
function PeriodSelector({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const reduce = useReducedMotion();
  const refs = useRef<Record<Interval, HTMLButtonElement | null>>({ monthly: null, annual: null });
  const keys = Object.keys(INTERVAL_LABELS) as Interval[];
  return (
    <div role="radiogroup" aria-label="Billing period" className="flex items-baseline gap-6">
      {keys.map((k) => {
        const on = value === k;
        return (
          <button
            key={k}
            ref={(el) => {
              refs.current[k] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(k)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                const next = keys[(keys.indexOf(value) + 1) % keys.length];
                onChange(next);
                refs.current[next]?.focus();
              }
            }}
            className="group relative cursor-pointer border-0 bg-transparent p-0 pb-2 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
            style={{ outlineColor: GOLD_ON_CLOTH }}
          >
            <span
              className="whitespace-nowrap transition-colors duration-300 group-hover:text-[#FAF7F2]"
              style={{ fontFamily: SANS, fontSize: 14, fontWeight: on ? 600 : 400, color: on ? CREAM : CREAM_SOFT }}
            >
              {INTERVAL_LABELS[k]}
              {k === "annual" ? (
                <span style={{ color: GOLD_ON_CLOTH, fontWeight: 500 }}>{`, ${ANNUAL_SAVING}`}</span>
              ) : null}
            </span>
            {on ? (
              <motion.span
                layoutId="pricing-period-rule"
                aria-hidden
                className="absolute bottom-0 left-0 block h-px w-full"
                style={{ backgroundColor: GOLD_ON_CLOTH }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 38 }}
              />
            ) : (
              <span
                aria-hidden
                className="absolute bottom-0 left-0 block h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ backgroundColor: "rgba(250, 247, 242, 0.3)", transitionTimingFunction: ROLL }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Cascade ───────────────────────────────────────────────────────────────

/**
 * A piece of a plan that follows its column up. `order` is its place in the
 * plan's reading order; each step starts a little later and travels a
 * little further, so the plan assembles top to bottom rather than as a slab.
 */
function Piece({
  progress,
  window: w,
  order,
  children,
  className,
  as = "div",
}: {
  progress: MotionValue<number>;
  window: readonly [number, number];
  order: number;
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const start = w[0] + order * LAG.step;
  const y = useTransform(progress, (p) => `${(1 - phase(p, [start, start + LAG.span])) * (TRAVEL.piece + order * 0.6)}vh`);
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag className={className} style={{ y }}>
      {children}
    </Tag>
  );
}

// ── Lists ─────────────────────────────────────────────────────────────────

function Features({
  lead,
  items,
  tone,
  progress,
  window: w,
  from,
}: {
  lead: string | null;
  items: readonly string[];
  tone: Tone;
  progress: MotionValue<number>;
  window: readonly [number, number];
  /** The order the list starts at, after the pieces above it. */
  from: number;
}) {
  const text = tone === "paper" ? INK : CREAM;
  const mark = tone === "paper" ? "rgba(15, 23, 42, 0.4)" : GOLD_ON_CLOTH;
  const offset = lead ? 1 : 0;
  return (
    <div className="mt-9">
      {lead ? (
        <Piece progress={progress} window={w} order={from}>
          <p className="m-0 mb-4" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: text }}>
            {lead}
          </p>
        </Piece>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {items.map((item, i) => {
          const order = from + offset + i;
          const start = w[0] + order * LAG.step;
          return (
            <Piece
              key={item}
              as="li"
              progress={progress}
              window={w}
              order={order}
              className="flex gap-3"
            >
              <Rule progress={progress} at={[start + LAG.span * 0.55, start + LAG.span * 1.05]} color={mark} />
              <span style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.5, color: text }}>{item}</span>
            </Piece>
          );
        })}
      </ul>
    </div>
  );
}

function Rule({ progress, at, color }: { progress: MotionValue<number>; at: readonly [number, number]; color: string }) {
  const scaleX = useTransform(progress, (p) => phase(p, at));
  return (
    <motion.span
      aria-hidden
      className="mt-[0.72em] block h-px w-3 shrink-0 origin-left"
      style={{ backgroundColor: color, scaleX }}
    />
  );
}

// ── Plans ─────────────────────────────────────────────────────────────────

function Header({ name, audience, tone }: { name: ReactNode; audience: string; tone: Tone }) {
  return (
    <div style={{ minHeight: 58 }}>
      {name}
      <Audience tone={tone}>{audience}</Audience>
    </div>
  );
}

function PaperPlan({
  plan,
  variant,
  progress,
  window: w,
}: {
  plan: typeof PLANS.free | typeof PLANS.agencies;
  variant: ActionVariant;
  progress: MotionValue<number>;
  window: readonly [number, number];
}) {
  return (
    <div className="flex h-full flex-col px-2 py-10 md:px-9 md:py-12">
      <Piece progress={progress} window={w} order={0}>
        <Header name={<PlanName tone="paper">{plan.name}</PlanName>} audience={plan.audience} tone="paper" />
      </Piece>
      <Piece progress={progress} window={w} order={1} className="mt-8 md:mt-10">
        <p className="m-0" style={priceStyle("paper")}>
          {plan.price}
        </p>
        <Billing tone="paper">{plan.billing}</Billing>
      </Piece>
      <Piece progress={progress} window={w} order={2} className="mt-7">
        <Action href={plan.cta.href} label={plan.cta.label} variant={variant} />
      </Piece>
      <Features lead={plan.lead} items={plan.features} tone="paper" progress={progress} window={w} from={3} />
    </div>
  );
}

function StudioPlan({ progress }: { progress: MotionValue<number> }) {
  const [interval, setInterval] = useState<Interval>("monthly");
  const plan = PLANS.studio;
  const p = STUDIO_PRICES[interval];
  const turn = useTransform(progress, (v) => (1 - phase(v, T.turn)) * -90);
  // The field opens down from its top edge as it rises.
  const clipPath = useTransform(progress, (v) => `inset(${((1 - phase(v, T.open)) * 22).toFixed(2)}% 0% 0% 0% round 1.5rem)`);
  // Its contents lag the field: the field arrives, then what is on it.
  const inner: readonly [number, number] = [T.studio[0] + 0.05, T.studio[1] + 0.05];
  return (
    <motion.div
      className="relative flex h-full flex-col rounded-[1.5rem] px-6 py-10 md:px-10 md:pb-[5.5rem] md:pt-[7.5rem]"
      style={{ backgroundColor: INK, color: CREAM, clipPath }}
    >
      <Piece progress={progress} window={inner} order={0} className="mb-8 md:absolute md:left-10 md:top-9 md:mb-0">
        <PeriodSelector value={interval} onChange={setInterval} />
      </Piece>
      <Piece progress={progress} window={inner} order={0}>
        <Header
          tone="cloth"
          audience={plan.audience}
          name={
            <div className="flex items-center gap-1.5">
              <PlanName tone="cloth">STUDIO</PlanName>
              <motion.span style={{ rotate: turn }}>
                <Cross size={17} color={GOLD_ON_CLOTH} />
              </motion.span>
              <span className="sr-only">Studio+</span>
            </div>
          }
        />
      </Piece>
      <Piece progress={progress} window={inner} order={1} className="mt-8 md:mt-10">
        <div aria-live="polite">
          <p className="m-0 flex items-baseline gap-2.5">
            <Roll text={p.price} style={priceStyle("cloth")} />
            <span style={{ fontFamily: SANS, fontSize: 14, color: CREAM_SOFT }}>{p.unit}</span>
          </p>
          <Billing tone="cloth">
            <Roll text={p.billing} />
          </Billing>
        </div>
      </Piece>
      <Piece progress={progress} window={inner} order={2} className="mt-7">
        <Action href={plan.cta.href} label={plan.cta.label} variant="cream" />
      </Piece>
      <Features lead={plan.lead} items={plan.features} tone="cloth" progress={progress} window={inner} from={3} />
      <Piece progress={progress} window={inner} order={8} className="mt-auto pt-9">
        <p className="m-0" style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.5, color: CREAM_SOFT }}>
          {plan.note}
        </p>
      </Piece>
    </motion.div>
  );
}

// ── The headline ──────────────────────────────────────────────────────────

function Word({ progress, index, children }: { progress: MotionValue<number>; index: number; children: ReactNode }) {
  const start = T.heading[0] + index * 0.022;
  const y = useTransform(progress, (p) => `${(1 - phase(p, [start, start + 0.26])) * (TRAVEL.word + index * 0.5)}vh`);
  return (
    <motion.span className="inline-block" style={{ y }}>
      {children}
    </motion.span>
  );
}

function Headline({ progress, id }: { progress: MotionValue<number>; id: string }) {
  const before = HEADING.before.trim().split(" ");
  const after = HEADING.after.replace(/^\./, "").trim().split(" ");
  let i = 0;
  const words: ReactNode[] = [];
  const push = (node: ReactNode, key: string) => {
    words.push(
      <Word key={key} progress={progress} index={i++}>
        {node}
      </Word>,
      " ",
    );
  };
  before.forEach((w, k) => push(w, `b${k}`));
  push(
    <>
      <em className="font-editorial-italic" style={{ color: GOLD_ON_PAPER }}>
        {HEADING.verdict}
      </em>
      .
    </>,
    "verdict",
  );
  after.forEach((w, k) => push(w, `a${k}`));
  return (
    <h2
      id={id}
      className="m-0 max-w-[18ch] px-2 md:px-0"
      style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 5.4vw, 5rem)", lineHeight: 1.02, letterSpacing: "-0.02em" }}
    >
      {words}
    </h2>
  );
}

// ── The section ───────────────────────────────────────────────────────────

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  // Through the store hook, so hydration uses the server's answer (§31.7).
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const titleId = useId();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end end"] });
  const smooth = useSpring(scrollYProgress, TIMELINE_SPRING);
  const settled = useTransform(smooth, () => 1);
  const progress = reduce ? settled : smooth;

  // Past rest: from the section's foot reaching the frame's foot until it
  // leaves the top, the field keeps moving a little ahead of the paper.
  const { scrollYProgress: leaving } = useScroll({ target: sectionRef, offset: ["end end", "end start"] });
  const leavingSmooth = useSpring(leaving, TIMELINE_SPRING);
  const drift = useTransform(leavingSmooth, (v) => (reduce ? "0vh" : `${-v * TRAVEL.drift}vh`));

  const headingY = useTravel(progress, T.heading, TRAVEL.heading);
  const freeY = useTravel(progress, T.free, TRAVEL.free);
  const studioY = useTravel(progress, T.studio, TRAVEL.studio);
  const agenciesY = useTravel(progress, T.agencies, TRAVEL.agencies);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={titleId}
      className="relative z-10 w-full overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 md:px-10" style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}>
        <motion.div style={{ y: headingY }}>
          <Headline progress={progress} id={titleId} />
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-[1fr_1.12fr_1fr] md:items-stretch">
          <motion.div style={{ y: freeY }}>
            <PaperPlan plan={PLANS.free} variant="ink" progress={progress} window={T.free} />
          </motion.div>
          <motion.div style={{ y: studioY }} className="relative z-[1] md:-mb-10 md:-mt-[4.5rem]">
            <motion.div className="h-full" style={{ y: drift }}>
              <StudioPlan progress={progress} />
            </motion.div>
          </motion.div>
          {/* The other side of the platform, not a third tier: set apart. */}
          <motion.div style={{ y: agenciesY }} className="md:pl-10">
            <PaperPlan plan={PLANS.agencies} variant="outline" progress={progress} window={T.agencies} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
