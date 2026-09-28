"use client";

/**
 * CHAPTERS 0 - V, on one pinned frame.
 *
 *   0    THE DOOR       The page opens on the company, not on a picture:
 *                       one statement at viewport scale, the deck that
 *                       says what Pholio is, and a hand's width of
 *                       photograph standing at the right edge like a door
 *                       ajar. Scrolling opens it across the frame.
 *
 *   I    THE NUMBERS    The door has opened onto a casting tag. The camera
 *                       pulls back, and the tag turns out to be on a
 *                       person, and the person turns out to be in a queue.
 *
 *   II   THE SITTING    Her own set of digitals, framed, pulling back
 *                       until paper closes around it and it is an object.
 *                       It stops at the centre of the frame and stays.
 *
 *   III  THE STACK      Six slips of paper land on her photograph, one at
 *                       a time, each a little lower than the last, until
 *                       she is under all of it with only her top edge
 *                       showing. Then the paper leaves in one movement,
 *                       she is still there, and the only gold line in the
 *                       chapter lands underneath her.
 *
 *   IV   THE CORRIDOR   Everyone has gone. The photograph of people
 *                       waiting holds the whole frame at a third of its
 *                       strength, under the longest hold on the page.
 *
 *   V    THE TURN       The field changes, once, as an event. A seam
 *                       crosses the frame and the statement inverts as it
 *                       passes: cream type on velvet to the right of the
 *                       seam, ink type on paper to the left. It is the
 *                       door from chapter 0 run again, and closing.
 *
 * They share one frame and one set of objects on purpose. Nothing resets
 * between them: each chapter inherits what the last one left on the stage,
 * which is what stops six chapters reading as six rectangles.
 */

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { ScrollInvitation } from "@/components/ScrollInvitation";

import { STAGE } from "./content";
import {
  CREAM,
  Deck,
  Display,
  GOLD,
  GOLD_DARK,
  INK,
  Label,
  Note,
  OLDSTYLE,
  ON_CREAM,
  ON_INK,
  SHELL,
  Statement,
  useCompactStage,
  useStillComposition,
} from "./kit";
import {
  CORRIDOR,
  DOOR,
  LINEUP,
  LINEUP_AR,
  LINEUP_COMPACT,
  LINEUP_EXIT,
  SITTING,
  SITTING_AR,
  SITTING_COMPACT,
  SITTING_ENTER_VH,
  SITTING_EXIT,
  SITTING_REST,
  SLIP,
  SLIP_TILT,
  type SlipGeometry,
  STAGE_VH,
  TRAVEL,
  WHEN,
  type Shot,
} from "./motion";

/** A shot becomes a scale and a translation, both in screen space. */
function camera(shots: Shot[], ar: number, rest: readonly [number, number]) {
  const base = shots[shots.length - 1].h;
  return shots.map((s, i) => {
    const last = i === shots.length - 1;
    return {
      at: s.at,
      scale: s.h / base,
      x: (0.5 - s.fx) * s.h * ar + (last ? rest[0] : 0),
      y: (0.5 - s.fy) * s.h + (last ? rest[1] : 0),
    };
  });
}

export default function Stage() {
  const still = useStillComposition();
  if (still) return <StillStage />;
  return <ScrolledStage />;
}

function ScrolledStage() {
  const ref = useRef<HTMLElement>(null);
  const compact = useCompactStage();
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const lineupShots = compact ? LINEUP_COMPACT : LINEUP;
  const sittingShots = compact ? SITTING_COMPACT : SITTING;
  const lineup = camera(lineupShots, LINEUP_AR, [0, 0]);
  const sitting = camera(
    sittingShots,
    SITTING_AR,
    compact ? SITTING_REST.compact : SITTING_REST.wide,
  );

  /* The door. One clip on the photographic layer, so the type underneath
     is never masked and never travels with it. */
  const doorInset = useTransform(p, [...DOOR.at], [DOOR.from, DOOR.to]);
  const doorClip = useMotionTemplate`inset(0% 0% 0% ${doorInset}%)`;

  return (
    <section
      ref={ref}
      aria-labelledby="about-stage-title"
      className="relative"
      style={{ height: `${STAGE_VH}vh`, background: INK }}
    >
      <h2 id="about-stage-title" className="sr-only">
        Why Pholio exists
      </h2>
      <div
        id={STAGE.bill.id}
        aria-hidden
        className="absolute left-0 h-px w-px"
        style={{ top: `${WHEN.stackLabel[0] * (STAGE_VH - 100)}vh` }}
      />

      <div
        className="texture-grain sticky top-0 h-mobile-screen w-full overflow-hidden"
        style={{ background: INK, color: ON_INK.statement }}
      >
        <Opening progress={p} />
        <Corridor progress={p} />

        {/* The photographic layer, opened by the door. */}
        <motion.div className="absolute inset-0" style={{ zIndex: 10, clipPath: doorClip }}>
          <Plate
            progress={p}
            shots={lineup}
            ar={LINEUP_AR}
            baseH={lineupShots[lineupShots.length - 1].h}
            enter={null}
            exit={{ at: LINEUP_EXIT, to: -178 }}
            src="/about/lineup.webp"
            alt={STAGE.numbers.imageAlt}
            sizes="(max-width: 1023px) 300vw, 280vw"
            priority
          />
        </motion.div>

        <Plate
          progress={p}
          shots={sitting}
          ar={SITTING_AR}
          baseH={sittingShots[sittingShots.length - 1].h}
          enter={SITTING_ENTER_VH}
          exit={{ at: SITTING_EXIT, to: -160 }}
          src="/about/sitting.webp"
          alt={STAGE.sitting.imageAlt}
          sizes="(max-width: 1023px) 210vw, 118vw"
          mat={[0.392, 0.442]}
          z={11}
        />

        <Stack progress={p} compact={compact} />

        <Line progress={p} when={WHEN.whisper} place="bottom-[7vh] left-0 right-0">
          <Note className="max-w-[26ch]">{STAGE.numbers.whisper}</Note>
        </Line>

        <FootScrim progress={p} when={WHEN.statement} />
        <Line progress={p} when={WHEN.statement} place="bottom-[9vh] left-0 right-0">
          <Statement className="max-w-[17ch]" size="clamp(2.05rem, 5.2vw, 5.2rem)">
            {STAGE.numbers.statement}
          </Statement>
        </Line>

        <Line progress={p} when={WHEN.sittingNote} place="top-[15vh] left-0 right-0">
          <Note className="max-w-[24ch] md:ml-auto md:text-right">
            {STAGE.sitting.whisper}
          </Note>
        </Line>

        <Line progress={p} when={WHEN.corridorLine} place="top-[28vh] left-0 right-0">
          <Statement className="max-w-[13ch]" size="clamp(2.3rem, 6.2vw, 6.2rem)">
            {STAGE.corridor.statement}
          </Statement>
        </Line>

        <Line progress={p} when={WHEN.corridorNote} place="top-[61vh] left-0 right-0">
          <Note className="max-w-[34ch]" size="clamp(0.95rem, 1.02vw, 1.05rem)">
            {STAGE.corridor.note}
          </Note>
        </Line>

        <Turn progress={p} />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   0. THE OPENING

   The first frame is the company speaking, not a picture with words on
   it: a statement at viewport scale, the one sentence that says what
   Pholio is, and the page cue. The photograph is present as a hand's
   width at the right edge, which is the only thing in the frame that
   promises there is anything else.

   It leaves by travelling left, out of the frame, as the door opens over
   the space it held. Nothing fades.
   ══════════════════════════════════════════════════════════════════════ */

function Opening({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [...WHEN.opening], ["0vw", "0vw", "-18vw", "-112vw"]);
  const cueOpacity = useTransform(progress, [0.018, 0.05], [1, 0]);

  return (
    <motion.div className="absolute inset-0 flex items-center" style={{ zIndex: 5, x }}>
      {/* The copy stays clear of the door band, which is a tenth of the
          frame and therefore much closer to the measure on a phone. */}
      <div className={`${SHELL} pb-[5vh] pr-[17vw] lg:pr-14`}>
        <Statement
          as="h1"
          className="max-w-[15ch]"
          size="clamp(2.4rem, 6.4vw, 6.6rem)"
          style={{ lineHeight: 0.94 }}
        >
          {STAGE.opening.statement}
        </Statement>

        <Deck className="mt-10 max-w-[40ch] md:mt-14">{STAGE.opening.deck}</Deck>

        <motion.div className="mt-14 md:mt-20" style={{ opacity: cueOpacity }}>
          <ScrollInvitation
            label={STAGE.opening.invitation}
            targetId={STAGE.bill.id}
            align="left"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   A PLATE
   ══════════════════════════════════════════════════════════════════════ */

function Plate({
  progress,
  shots,
  ar,
  baseH,
  enter,
  exit,
  src,
  alt,
  sizes,
  mat,
  priority = false,
  z,
}: {
  progress: MotionValue<number>;
  shots: ReturnType<typeof camera>;
  ar: number;
  baseH: number;
  enter: number | null;
  exit: { at: readonly [number, number]; to: number };
  src: string;
  alt: string;
  sizes: string;
  mat?: readonly [number, number];
  priority?: boolean;
  z?: number;
}) {
  const stops = shots.map((s) => s.at);
  const first = shots[0];
  const last = shots[shots.length - 1];
  const inStops = enter === null ? stops : [first.at - 0.05, ...stops];

  const scale = useTransform(
    progress,
    [...inStops, exit.at[0], exit.at[1]],
    enter === null
      ? [...shots.map((s) => s.scale), last.scale, last.scale]
      : [first.scale, ...shots.map((s) => s.scale), last.scale, last.scale],
  );
  const x = useTransform(
    progress,
    [...inStops, exit.at[0], exit.at[1]],
    enter === null
      ? [...shots.map((s) => s.x), last.x, last.x]
      : [first.x, ...shots.map((s) => s.x), last.x, last.x],
  );
  const y = useTransform(
    progress,
    [...inStops, exit.at[0], exit.at[1]],
    enter === null
      ? [...shots.map((s) => s.y), last.y, exit.to]
      : [first.y + enter, ...shots.map((s) => s.y), last.y, exit.to],
  );

  const matOpacity = useTransform(progress, mat ? [...mat] : [0, 1], mat ? [0, 1] : [0, 0]);
  const xVh = useTransform(x, (v) => `${v}vh`);
  const yVh = useTransform(y, (v) => `${v}vh`);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        zIndex: z,
        height: `${baseH}vh`,
        width: `${baseH * ar}vh`,
        marginLeft: `${(-baseH * ar) / 2}vh`,
        marginTop: `${-baseH / 2}vh`,
        x: xVh,
        y: yVh,
        scale,
      }}
    >
      {mat ? (
        <motion.div
          aria-hidden
          className="absolute"
          style={{ inset: "-4.6%", background: CREAM, opacity: matOpacity }}
        />
      ) : null}
      <div className="absolute inset-0 overflow-hidden">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   III. THE STACK

   The chapter is the accumulation, so the motion is the argument rather
   than an entrance: each slip travels up from outside the frame and lands
   on the one before it, a little lower and a little further right, tilted
   half a degree because paper does not land square. The top band of every
   slip stays out from under the next one, so the list builds in place and
   stays readable while it buries her.

   The sweep is the opposite gesture: everything leaves at once, fast, in
   the order it arrived. She is still there underneath, and the total lands
   under her.
   ══════════════════════════════════════════════════════════════════════ */

function Stack({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  const g = compact ? SLIP.compact : SLIP.wide;
  const items = STAGE.bill.items;
  const [from, to] = WHEN.stackSlips;
  const span = (to - from) / items.length;

  const labelY = useTransform(progress, [...WHEN.stackLabel], [...TRAVEL]);

  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-0 right-0 top-[13vh]"
        style={{ zIndex: 14, y: labelY }}
      >
        <div className={SHELL}>
          <Label gold>{STAGE.bill.label}</Label>
        </div>
      </motion.div>

      {items.map((item, i) => (
        <Slip
          key={item}
          progress={progress}
          geometry={g}
          index={i}
          from={from + i * span}
          to={from + i * span + span * 0.82}
        >
          {item}
        </Slip>
      ))}

      {/* The total lands under her, in the space the paper has just left,
          because the point of the sequence is that she is still there. */}
      <Line progress={progress} when={WHEN.total} place="top-[63vh] left-0 right-0" z={16}>
        <p
          className="font-editorial max-w-[30ch] md:ml-[26%]"
          style={{
            ...OLDSTYLE,
            color: GOLD,
            fontSize: "clamp(1.15rem, 1.6vw, 1.65rem)",
            lineHeight: 1.36,
            letterSpacing: "-0.012em",
          }}
        >
          {STAGE.bill.total}
        </p>
      </Line>
    </>
  );
}

function Slip({
  progress,
  geometry,
  index,
  from,
  to,
  children,
}: {
  progress: MotionValue<number>;
  geometry: SlipGeometry;
  index: number;
  from: number;
  to: number;
  children: React.ReactNode;
}) {
  const rest = geometry.top + index * geometry.step;
  /* The sweep leaves in the order it arrived, inside a window short enough
     that the whole pile reads as one movement rather than six. */
  const sweepFrom =
    WHEN.stackSweep[0] + (index / 6) * (WHEN.stackSweep[1] - WHEN.stackSweep[0]) * 0.5;
  const sweepTo = sweepFrom + 0.05;

  const y = useTransform(
    progress,
    [from, to, sweepFrom, sweepTo],
    [`${rest + geometry.enter}vh`, `${rest}vh`, `${rest}vh`, `${rest - 104}vh`],
  );
  const tilt = useTransform(
    progress,
    [from, to],
    [SLIP_TILT[index % SLIP_TILT.length] * 3.4, SLIP_TILT[index % SLIP_TILT.length]],
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        zIndex: 12 + index,
        width: `${geometry.w}vh`,
        height: `${geometry.h}vh`,
        marginLeft: `${-geometry.w / 2 + geometry.x + index * geometry.drift}vh`,
        marginTop: `${-geometry.h / 2}vh`,
        background: CREAM,
        y,
        rotate: tilt,
      }}
    >
      <p
        className="font-editorial"
        style={{
          ...OLDSTYLE,
          color: ON_CREAM.statement,
          padding: "1.05vh 1.9vh 0",
          fontSize: "clamp(0.82rem, 1.12vw, 1.12rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.012em",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {children}
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   IV. THE CORRIDOR
   ══════════════════════════════════════════════════════════════════════ */

function Corridor({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [...CORRIDOR.rise], ["22vh", "0vh"]);
  const scale = useTransform(progress, [CORRIDOR.rise[0], 1], [...CORRIDOR.scale]);
  const opacity = useTransform(progress, [CORRIDOR.rise[0], CORRIDOR.rise[1]], [0, 0.38]);

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ zIndex: 1, opacity }}>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/about/waiting.webp"
          alt={STAGE.corridor.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-[52%_46%]"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 86% at 24% 42%, rgba(5,5,5,.9), rgba(5,5,5,.42) 62%, rgba(5,5,5,.2))",
        }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COPY PLACEMENT
   ══════════════════════════════════════════════════════════════════════ */

function Line({
  progress,
  when,
  place,
  z = 20,
  children,
}: {
  progress: MotionValue<number>;
  when: readonly [number, number, number, number];
  place: string;
  z?: number;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, [...when], [...TRAVEL]);
  return (
    <motion.div className={`pointer-events-none absolute ${place}`} style={{ zIndex: z, y }}>
      <div className={SHELL}>{children}</div>
    </motion.div>
  );
}

function FootScrim({
  progress,
  when,
}: {
  progress: MotionValue<number>;
  when: readonly [number, number, number, number];
}) {
  const opacity = useTransform(progress, [...when], [0, 1, 1, 0]);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
      style={{
        zIndex: 15,
        opacity,
        background:
          "linear-gradient(to top, rgba(5,5,5,.94) 18%, rgba(5,5,5,.72) 48%, rgba(5,5,5,0))",
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════
   V. THE TURN
   ══════════════════════════════════════════════════════════════════════ */

const TURN_SIZE = "clamp(2rem, 5.1vw, 5.2rem)";

function Turn({ progress }: { progress: MotionValue<number> }) {
  const panelX = useTransform(progress, [...WHEN.seam], ["-100%", "0%"]);
  const innerX = useTransform(progress, [...WHEN.seam], ["100%", "0%"]);
  const underY = useTransform(progress, [...WHEN.under], ["5vh", "0vh"]);
  const underOpacity = useTransform(progress, [...WHEN.under], [0, 1]);
  const beforeOpacity = useTransform(progress, [WHEN.seam[0] - 0.025, WHEN.seam[0]], [0, 1]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center"
        style={{ opacity: beforeOpacity, zIndex: 25 }}
      >
        <div className={SHELL}>
          <Display
            parts={STAGE.turn.line}
            gold={GOLD}
            className="max-w-[24ch]"
            style={{
              ...OLDSTYLE,
              fontSize: TURN_SIZE,
              lineHeight: 0.99,
              letterSpacing: "-0.034em",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 30, x: panelX, background: CREAM, color: ON_CREAM.statement }}
      >
        <motion.div className="absolute inset-0 flex items-center" style={{ x: innerX }}>
          <div className={SHELL}>
            {/* The sentence sits at the identical place in both layers, so
                the seam reads as one line inverting rather than as two
                lines meeting. The paragraph is out of flow for exactly
                that reason: in flow it re-centres the block. */}
            <div className="relative">
              <Display
                parts={STAGE.turn.line}
                gold={GOLD_DARK}
                className="max-w-[24ch]"
                style={{
                  ...OLDSTYLE,
                  fontSize: TURN_SIZE,
                  lineHeight: 0.99,
                  letterSpacing: "-0.034em",
                }}
              />
              <motion.div
                className="absolute left-0 top-full mt-10 md:mt-14"
                style={{ y: underY, opacity: underOpacity }}
              >
                <Deck field="cream" className="max-w-[38ch]">
                  {STAGE.turn.under}
                </Deck>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   THE STILL COMPOSITION

   Not a shorter scrub. The same six chapters, read down the page, with
   each photograph whole, the bill as a real stack of slips, and every
   line at the rank it holds on the stage.
   ══════════════════════════════════════════════════════════════════════ */

function StillStage() {
  return (
    <>
      <section
        aria-labelledby="about-stage-title-still"
        className="texture-grain relative overflow-hidden"
        style={{ background: INK, color: ON_INK.statement }}
      >
        <h2 id="about-stage-title-still" className="sr-only">
          Why Pholio exists
        </h2>

        <div className={`${SHELL} py-28 md:py-40`}>
          <Statement as="h1" className="max-w-[15ch]" size="clamp(2.3rem, 6.2vw, 6.2rem)">
            {STAGE.opening.statement}
          </Statement>
          <Deck className="mt-10 max-w-[40ch] md:mt-14">{STAGE.opening.deck}</Deck>

          <div className="relative mt-24 aspect-[3/2] w-full">
            <Image
              src="/about/lineup.webp"
              alt={STAGE.numbers.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <Note className="mt-7 max-w-[30ch]">{STAGE.numbers.whisper}</Note>
          <Statement className="mt-14 max-w-[17ch]" size="clamp(2rem, 5vw, 4.8rem)">
            {STAGE.numbers.statement}
          </Statement>

          <div className="mt-24 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
            <div className="relative aspect-[2/3] w-full bg-[#FAF7F2] p-[1.8%] md:col-span-5">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src="/about/sitting.webp"
                  alt={STAGE.sitting.imageAlt}
                  fill
                  sizes="(max-width: 767px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
            <Note className="max-w-[26ch] md:col-span-6 md:col-start-7">
              {STAGE.sitting.whisper}
            </Note>
          </div>

          <div id={STAGE.bill.id} className="mt-28">
            <Label gold>{STAGE.bill.label}</Label>
            <div className="mt-8 flex flex-col items-start">
              {STAGE.bill.items.map((item, i) => (
                <p
                  key={item}
                  className="font-editorial max-w-full"
                  style={{
                    ...OLDSTYLE,
                    background: CREAM,
                    color: ON_CREAM.statement,
                    padding: "0.85rem 1.4rem",
                    marginLeft: `${i * 0.75}rem`,
                    marginTop: i === 0 ? 0 : "0.35rem",
                    fontSize: "clamp(0.95rem, 1.26vw, 1.26rem)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {item}
                </p>
              ))}
            </div>
            <p
              className="font-editorial mt-10"
              style={{
                ...OLDSTYLE,
                color: GOLD,
                fontSize: "clamp(1.15rem, 1.6vw, 1.6rem)",
                lineHeight: 1.36,
                letterSpacing: "-0.012em",
              }}
            >
              {STAGE.bill.total}
            </p>
          </div>

          <div className="relative mt-28 aspect-[3/2] w-full">
            <Image
              src="/about/waiting.webp"
              alt={STAGE.corridor.imageAlt}
              fill
              sizes="100vw"
              className="object-cover object-[52%_46%]"
              style={{ opacity: 0.55 }}
            />
          </div>
          <Statement className="mt-14 max-w-[13ch]" size="clamp(2.1rem, 5.6vw, 5.2rem)">
            {STAGE.corridor.statement}
          </Statement>
          <Note className="mt-7 max-w-[36ch]">{STAGE.corridor.note}</Note>
        </div>
      </section>

      <section
        className="texture-grain relative overflow-hidden"
        style={{ background: CREAM, color: ON_CREAM.statement }}
      >
        <div className={`${SHELL} py-28 md:py-40`}>
          <Display
            parts={STAGE.turn.line}
            gold={GOLD_DARK}
            className="max-w-[24ch]"
            style={{
              ...OLDSTYLE,
              fontSize: "clamp(2rem, 5vw, 4.8rem)",
              lineHeight: 0.99,
              letterSpacing: "-0.034em",
            }}
          />
          <Deck field="cream" className="mt-12 max-w-[38ch]">
            {STAGE.turn.under}
          </Deck>
        </div>
      </section>
    </>
  );
}
