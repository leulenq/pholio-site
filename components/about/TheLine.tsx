"use client";

/**
 * THE LINE
 *
 * The page's defining scene, and the one the hero's invitation points at.
 *
 * The idea the owner kept, rebuilt: a scene at viewport scale, on cream,
 * where three statements arrive one at a time at display size, cross a gold
 * rule, and leave. It is not a headline that happens to be large. The
 * statement, the rule, the field change and the scroll are one gesture:
 *
 *  - The stage is pinned, so the scene owns the screen while it plays.
 *  - The photograph from the previous scene arrives with the reader and
 *    recedes into the cream in the first fifth of the scene. Human context
 *    resolving into the statement, which is the transition `lessons.md` §21
 *    established for this handover.
 *  - The gold rule draws across the stage as the scene runs. It is the mark
 *    the section is named for, and each statement crosses it: the plain half
 *    above it, the gold verdict landing on it.
 *  - Every statement travels the full height of the stage, fast at the edges
 *    and slowly through the middle, so it holds without ever stopping and is
 *    never at partial opacity. The stage clips it; nothing fades.
 *
 * Reduced motion gets a real composition instead: the three statements set as
 * a stack at display scale, on the same field, with the rule drawn.
 */

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { HERO, LINE } from "./content";
import {
  Arrive,
  ArriveGroup,
  CREAM,
  DrawnRule,
  GOLD_DARK,
  ON_CREAM,
  ON_CREAM_SOFT,
  SHELL,
} from "./kit";
import {
  LINE_CLOSE_SPAN,
  LINE_PLATE_EXIT,
  LINE_SLICE_OVERLAP,
  LINE_STAGE_VH,
  LINE_STATEMENTS_SPAN,
  LINE_STATEMENT_ENTER,
  LINE_STATEMENT_EXIT,
  LINE_STATEMENT_HOLD,
} from "./motion";

/**
 * `useReducedMotion()` is false on the server and on the first client render,
 * so a component that returns a different tree for it hydrates against markup
 * that no longer exists. That is not a cosmetic mismatch here: React discards
 * the tree, framer-motion loses its scroll target, and the page renders empty.
 *
 * So the still composition is what the server sends and what hydrates, and the
 * scroll-driven scene mounts only once the client is running and the
 * preference is known. No state is set in an effect to do it.
 */
const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export default function TheLine() {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();

  if (!hydrated || reduce) return <StillLine />;
  return <ScrolledLine />;
}

function ScrolledLine() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const plateY = useTransform(scrollYProgress, [0, LINE_PLATE_EXIT], ["0%", "-104%"]);
  const plateScale = useTransform(scrollYProgress, [0, LINE_PLATE_EXIT], [1, 1.14]);
  const ruleProgress = useTransform(scrollYProgress, [0.04, 0.9], [0, 1], {
    clamp: true,
  });
  const labelY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  /* Declared before the reduced-motion branch: hook order may not depend on
     the preference, which resolves after the first render. */
  /* The closing fact is the scene's resolution, not a footnote: it travels up
     into the frame as the last statement leaves and holds to the end, so the
     stage is never left empty. */
  const closeY = useTransform(
    scrollYProgress,
    [LINE_CLOSE_SPAN[0], LINE_CLOSE_SPAN[1]],
    ["46vh", "0vh"],
  );

  return (
    <section
      ref={ref}
      id={LINE.id}
      aria-labelledby="about-line-title"
      className="relative"
      style={{ height: `${LINE_STAGE_VH}vh`, background: CREAM }}
    >
      <div
        className="texture-grain sticky top-0 h-mobile-screen w-full overflow-hidden"
        style={{ background: CREAM, color: ON_CREAM }}
      >
        {/* The photograph, arriving with the reader and receding into the paper. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[46vh] overflow-hidden"
          style={{ y: plateY, scale: plateScale }}
        >
          <Image
            src="/about/hero.jpg"
            alt={HERO.imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-[62%_30%]"
            style={{
              filter: "grayscale(1)",
              maskImage: "linear-gradient(to bottom, #000 52%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent)",
            }}
          />
        </motion.div>

        {/* The gold rule the section is named for. */}
        <div className="absolute inset-x-0 top-1/2 z-10">
          <DrawnRule progress={ruleProgress} color={GOLD_DARK} />
        </div>

        {/* The statements. */}
        {LINE.statements.map((statement, i) => (
          <Statement
            key={statement.verdict}
            index={i}
            total={LINE.statements.length}
            progress={scrollYProgress}
            plain={statement.plain}
            verdict={statement.verdict}
          />
        ))}

        {/* The section's name, held at the top of the stage, and the closing
            fact, held at the foot. Both rise slowly against the statements so
            the stage never reads as frozen furniture. */}
        <motion.div
          className={`${SHELL} pointer-events-none absolute inset-x-0 top-0 z-20 pt-28 md:pt-32`}
          style={{ y: labelY }}
        >
          <h2
            id="about-line-title"
            className="font-sans text-[10px] uppercase tracking-[0.34em]"
            style={{ color: GOLD_DARK }}
          >
            {LINE.label}
          </h2>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center px-6"
          style={{ y: closeY }}
        >
          <p
            className="font-editorial text-center"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 3.1rem)",
              lineHeight: 1.14,
              maxWidth: "21ch",
              color: ON_CREAM_SOFT,
              marginTop: "24vh",
            }}
          >
            {LINE.close}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Statement({
  index,
  total,
  progress,
  plain,
  verdict,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  plain: string;
  verdict: string;
}) {
  /* Each statement owns a slice of the scene and overlaps its neighbours, so
     one is always arriving as the last one leaves. The scene's first and last
     eighths are the handover from the photograph and to the closing fact. */
  const [from, to] = LINE_STATEMENTS_SPAN;
  const span = (to - from) / total;
  const start = from + index * span - LINE_SLICE_OVERLAP;
  const end = from + (index + 1) * span + LINE_SLICE_OVERLAP;
  const holdIn = start + (end - start) * 0.3;
  const holdOut = end - (end - start) * 0.3;

  const y = useTransform(
    progress,
    [start, holdIn, holdOut, end],
    [LINE_STATEMENT_ENTER, LINE_STATEMENT_HOLD[0], LINE_STATEMENT_HOLD[1], LINE_STATEMENT_EXIT],
  );

  return (
    <motion.div
      className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-6"
      style={{ y }}
    >
      <p
        className="font-editorial text-center uppercase"
        style={{
          fontSize: "clamp(2.6rem, 10.5vw, 11rem)",
          lineHeight: 0.86,
          letterSpacing: "-0.04em",
          maxWidth: "14ch",
        }}
      >
        {plain}{" "}
        <em
          className="font-editorial-italic"
          style={{ color: GOLD_DARK, fontStyle: "italic" }}
        >
          {verdict}
        </em>
      </p>
    </motion.div>
  );
}

/** The reduced-motion composition: the same scene, at rest. */
function StillLine() {
  return (
    <section
      id={LINE.id}
      aria-labelledby="about-line-title-still"
      className="texture-grain relative overflow-hidden"
      style={{ background: CREAM, color: ON_CREAM }}
    >
      <div className={`${SHELL} py-28 md:py-40`}>
        <h2
          id="about-line-title-still"
          className="font-sans text-[10px] uppercase tracking-[0.34em]"
          style={{ color: GOLD_DARK }}
        >
          {LINE.label}
        </h2>
        <ArriveGroup className="mt-16 flex flex-col gap-10 md:mt-24 md:gap-14">
          {LINE.statements.map((statement) => (
            <Arrive key={statement.verdict}>
              <p
                className="font-editorial uppercase"
                style={{
                  fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                }}
              >
                {statement.plain}{" "}
                <em
                  className="font-editorial-italic"
                  style={{ color: GOLD_DARK, fontStyle: "italic" }}
                >
                  {statement.verdict}
                </em>
              </p>
            </Arrive>
          ))}
        </ArriveGroup>
        <p
          className="mt-16 max-w-[42ch] font-sans text-[14px] font-light leading-[1.6]"
          style={{ color: ON_CREAM_SOFT }}
        >
          {LINE.close}
        </p>
      </div>
    </section>
  );
}
