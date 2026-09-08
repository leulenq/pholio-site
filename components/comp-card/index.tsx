"use client";

import type { MotionValue } from "framer-motion";

import { useMediaQuery } from "@/components/hero/useMediaQuery";
import { motion, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import CompCardBack from "./CompCardBack";
import CompCardFront from "./CompCardFront";
import { CARD_SHADOW, CardImage, DoubleSidedCard } from "./GeneratedCard";
import { CompCardAssetsProvider, useDeferredCardAsset } from "./assets";
import {
  CARD_VARIANTS,
  SOURCE_FRAMES,
  type CardVariant,
  type SourceFrame,
} from "./data";
import {
  ARRIVAL_FROM_VH,
  ARRIVAL_ROTATE,
  ARRIVAL_X,
  CAPTION_TRAVEL_FULL_VW,
  CAPTION_TRAVEL_VH,
  CAPTION_TRAVEL_VW,
  CAPTIONS,
  CARD_ASPECT,
  DEAL_STAGGER,
  FLIP_APEX_Y,
  FLIP_SCALE,
  FLIP_TILT,
  FLIP_Y,
  LABEL_RANGE,
  READY_SCALE,
  READY_TILT,
  READY_X,
  READY_Y,
  ROW_SCALE,
  ROW_X,
  ROW_Y,
  T,
  TIMELINE_SPRING,
  TURN_BACK_LIFT,
  TURN_BACK_TILT,
  arrive,
  glide,
  type Caption,
  type CaptionPlace,
  type StageKind,
} from "./motion";

/** Below 768 the row of four becomes two rows and the arrival is a fan. */
function useStageKind(): StageKind {
  return useMediaQuery("(max-width: 767px)") ? "compact" : "wide";
}

/**
 * Whether there is room for a line to stand beside the card. Between 768
 * and 1023 the stage is wide enough for the row but not for a column of
 * type next to a lifted card, so every side-standing line sits below it
 * instead, as on the narrow stage.
 */
function useRoomBeside(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

const CARD_WIDTH = "w-[16rem] sm:w-[17.75rem] md:w-[20rem] lg:w-[22.75rem]";
const EDITION_WIDTH = "w-[15.5rem] sm:w-[17rem] md:w-[19.5rem] lg:w-[21.5rem]";

/** The cards' label, counter-scaled so it keeps its own size beside them. */
const LABEL_CLASS =
  "absolute inset-x-0 top-[calc(100%+0.9rem)] origin-top text-center font-mono text-[0.52rem] tracking-[0.2em] text-white/44";

// ── Captions ──────────────────────────────────────────────────────────────

function placeClass(place: CaptionPlace) {
  const base = "pointer-events-none absolute z-40 flex flex-col px-6";
  switch (place) {
    case "top":
      return `${base} left-1/2 top-[7.5vh] w-full max-w-[44rem] -translate-x-1/2 items-center text-center`;
    case "bottom":
      return `${base} bottom-[8vh] left-1/2 w-full max-w-[42rem] -translate-x-1/2 items-center text-center`;
    case "left":
      return `${base} left-[7%] top-1/2 w-auto max-w-[30rem] -translate-y-1/2 items-start text-left`;
    case "right":
      return `${base} right-[7%] top-1/2 w-auto max-w-[30rem] -translate-y-1/2 items-end text-right`;
    // Against the card's edge: the card is centred, at most 12rem to a side
    // through the turn, and the line stands 1.5rem off it.
    // Against the card's edge, and never past the stage's own margin.
    case "beside-left":
      return `${base} right-[calc(50%+13.5rem)] top-1/2 w-auto max-w-[calc(45vw-13.5rem)] -translate-y-1/2 items-end text-right`;
    case "beside-right":
      return `${base} left-[calc(50%+13.5rem)] top-1/2 w-auto max-w-[calc(45vw-13.5rem)] -translate-y-1/2 items-start text-left`;
  }
}

const isBeside = (place: CaptionPlace) => place !== "top" && place !== "bottom";
const isRightHand = (place: CaptionPlace) => place === "right" || place === "beside-right";

/** Beside the card the line sets a size down; above and below it, full. */
function headClass(place: CaptionPlace) {
  return `font-editorial leading-[1.06] tracking-[-0.03em] text-[#FAF7F2] ${
    isBeside(place) ? "text-[clamp(1.8rem,2.8vw,2.5rem)]" : "text-[clamp(2.15rem,4.4vw,3.65rem)]"
  }`;
}

/** Renders an authored "\n" in a head part as a line break. */
function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 ? <br /> : null}
          {part}
        </span>
      ))}
    </>
  );
}

function Head({ head }: { head: Caption["head"] }) {
  return (
    <span>
      <Lines text={head[0]} />
      {head[1] ? <span className="font-editorial-italic text-[#C9A55A]">{head[1]}</span> : null}
      <Lines text={head[2]} />
    </span>
  );
}

/**
 * A caption travels into the stage and travels out of it. No opacity on
 * display copy (`lessons.md` §14.3). Where it stands and which way it
 * travels are the caption's own (`motion.ts` CAPTIONS): the halves of the
 * front/back line ride the turn, the closing line comes in beside the card.
 */
function ScrollCaption({
  caption,
  progress,
  stage,
}: {
  caption: Caption;
  progress: MotionValue<number>;
  stage: StageKind;
}) {
  const { range } = caption;
  const roomBeside = useRoomBeside();
  const wanted = caption.place[stage];
  const place = stage === "wide" && !roomBeside && isBeside(wanted) ? "bottom" : wanted;
  const travel = caption.travel[stage];
  const holds = range[2] === range[3];

  // 1 is off the stage, 0 is in place.
  const off = useTransform(
    progress,
    holds ? [range[0], range[1]] : [...range],
    holds ? [1, 0] : [1, 0, 0, 1],
    { ease: glide },
  );
  // A line beside the card is narrow and clears the stage in 72vw; a
  // full-width line above or below it must cross the whole stage.
  const sideways = isBeside(place) ? CAPTION_TRAVEL_VW : CAPTION_TRAVEL_FULL_VW;
  const x = useTransform(off, (v) =>
    travel === "left"
      ? `${-v * sideways}vw`
      : travel === "right"
        ? `${v * sideways}vw`
        : "0vw",
  );
  const y = useTransform(off, (v) =>
    travel === "up"
      ? `${-v * CAPTION_TRAVEL_VH}vh`
      : travel === "down"
        ? `${v * CAPTION_TRAVEL_VH}vh`
        : "0vh",
  );

  return (
    <motion.div style={{ x, y, willChange: "transform" }} className={placeClass(place)}>
      <h2 className={headClass(place)}>
        <Head head={caption.head} />
      </h2>
    </motion.div>
  );
}

// ── The frames ────────────────────────────────────────────────────────────

/**
 * One of the two frames that is not chosen. It arrives beside the lead,
 * then tucks in behind it, smaller, and is covered. The lead is in front and
 * larger, so by the end of the selection it is simply not visible; it is
 * switched off only after that, while nothing of it can be seen.
 */
function SupportFrame({
  frame,
  index,
  progress,
  stage,
}: {
  frame: SourceFrame;
  /** 1 or 2: the lead is index 0 and is the card itself. */
  index: 1 | 2;
  progress: MotionValue<number>;
  stage: StageKind;
}) {
  const arriveVh = useTransform(
    progress,
    [T.arriveStart, T.arriveEnd],
    [ARRIVAL_FROM_VH[index], 0],
    { ease: arrive },
  );
  const settlePx = useTransform(
    progress,
    [T.selectStart, T.selectEnd],
    [index === 1 ? 0 : 8, -6],
    { ease: glide },
  );
  const y = useMotionTemplate`calc(${arriveVh}vh + ${settlePx}px)`;
  const x = useTransform(
    progress,
    [T.selectStart, T.selectEnd],
    [ARRIVAL_X[stage][index], "0vw"],
    { ease: glide },
  );
  const rotateZ = useTransform(
    progress,
    [T.selectStart, T.selectEnd],
    [ARRIVAL_ROTATE[stage][index], 0],
    { ease: glide },
  );
  const scale = useTransform(
    progress,
    [T.selectStart, T.selectEnd],
    index === 1 ? [1, 0.75] : [0.94, 0.72],
    { ease: glide },
  );
  const opacity = useTransform(
    progress,
    [T.supportReleaseStart, T.supportReleaseEnd],
    [1, 0],
  );
  const sizeClass =
    index === 1
      ? "w-[10.5rem] sm:w-[12.25rem] md:w-[14rem] lg:w-[15.75rem]"
      : "w-[10.25rem] sm:w-[11.5rem] md:w-[13rem] lg:w-[14.5rem]";
  const deferredSrc = useDeferredCardAsset(frame.src);

  return (
    <motion.figure
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 z-10 m-0 -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
      style={{ x, y, rotateZ, scale, opacity, willChange: "transform" }}
    >
      <div
        className="overflow-hidden rounded-[0.35rem]"
        style={{ aspectRatio: CARD_ASPECT, boxShadow: CARD_SHADOW }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deferredSrc}
          alt=""
          draggable={false}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: frame.objectPosition, filter: frame.filter }}
        />
      </div>
    </motion.figure>
  );
}

/**
 * One of the three dealt directions. It exists only behind the lead: it is
 * switched on while the lead covers it, slides out from under it into the
 * row, slides back under it in the gather, and is switched off once covered
 * again. Its
 * transform matches the lead's exactly at both ends, and its base width is
 * a little under the lead's, so nothing of it can show past the lead's edge.
 */
function EditionVariant({
  variant,
  index,
  progress,
  stage,
}: {
  variant: CardVariant;
  /** 1..3, in deal order: the top of the deck leaves first. */
  index: number;
  progress: MotionValue<number>;
  stage: StageKind;
}) {
  const delay = (index - 1) * DEAL_STAGGER;
  const keys = [T.dealStart + delay, T.dealEnd + delay, T.gatherStart, T.gatherEnd];
  const x = useTransform(
    progress,
    keys,
    ["0vw", ROW_X[stage][index], ROW_X[stage][index], READY_X[stage]],
    { ease: glide },
  );
  const y = useTransform(
    progress,
    keys,
    [ROW_Y[stage][0], ROW_Y[stage][index], ROW_Y[stage][index], READY_Y[stage]],
    { ease: glide },
  );
  const scale = useTransform(
    progress,
    [T.gatherStart, T.gatherEnd, T.end],
    [ROW_SCALE[stage], READY_SCALE[stage][0], READY_SCALE[stage][1]],
    { ease: glide },
  );
  // Only ever changes while the lead is flat on top of it.
  const opacity = useTransform(
    progress,
    [T.dealStart - 0.01, T.dealStart, T.gatherEnd + 0.005, T.gatherEnd + 0.02],
    [0, 1, 1, 0],
  );
  const labelOpacity = useTransform(
    progress,
    [LABEL_RANGE[0] + delay, LABEL_RANGE[1] + delay, LABEL_RANGE[2], LABEL_RANGE[3]],
    [0, 1, 1, 0],
  );
  const labelScale = useTransform(scale, (v: number) => 1 / v);

  return (
    <motion.figure
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 ${EDITION_WIDTH}`}
      style={{ x, y, scale, opacity, zIndex: 20 + (3 - index), willChange: "transform, opacity" }}
    >
      <div
        className="relative overflow-hidden rounded-[0.55rem]"
        style={{ aspectRatio: CARD_ASPECT, boxShadow: CARD_SHADOW }}
      >
        <CardImage src={variant.src} />
      </div>
      <motion.figcaption
        className={LABEL_CLASS}
        style={{ opacity: labelOpacity, scale: labelScale }}
      >
        {variant.edition}
      </motion.figcaption>
    </motion.figure>
  );
}

/**
 * The lead: the one object the whole beat is about.
 *
 * It arrives as a photograph (the card's own photo band, the front face
 * clipped to it), is chosen, lifts, and its card stock rises out from behind
 * the print carrying the name. It turns over to its back, turns back and is
 * set down in the row, the other directions are dealt from behind it and
 * gathered back, and it is picked up and handed forward.
 */
function LeadCard({ progress, stage }: { progress: MotionValue<number>; stage: StageKind }) {
  const arriveVh = useTransform(
    progress,
    [T.arriveStart, T.arriveEnd],
    [ARRIVAL_FROM_VH[0], 0],
    { ease: arrive },
  );
  // Lifted before the turn, up through the apex, set down through the turn
  // back, picked up again at the close.
  const settlePx = useTransform(
    progress,
    [
      T.liftStart,
      T.flipStart,
      T.flipApex,
      T.flipEnd,
      T.turnBackStart,
      T.turnBackApex,
      T.turnBackEnd,
      T.gatherStart,
      T.gatherEnd,
    ],
    [
      0,
      FLIP_Y,
      FLIP_APEX_Y,
      FLIP_Y,
      FLIP_Y,
      (FLIP_Y + ROW_Y[stage][0]) / 2 + TURN_BACK_LIFT,
      ROW_Y[stage][0],
      ROW_Y[stage][0],
      READY_Y[stage],
    ],
    { ease: glide },
  );
  const y = useMotionTemplate`calc(${arriveVh}vh + ${settlePx}px)`;
  const x = useTransform(
    progress,
    [T.selectStart, T.selectEnd, T.dealStart, T.dealEnd, T.gatherStart, T.gatherEnd],
    [ARRIVAL_X[stage][0], "0vw", "0vw", ROW_X[stage][0], ROW_X[stage][0], READY_X[stage]],
    { ease: glide },
  );
  const scale = useTransform(
    progress,
    [
      T.liftStart,
      T.flipStart,
      T.flipApex,
      T.flipEnd,
      T.turnBackStart,
      T.turnBackEnd,
      T.gatherStart,
      T.gatherEnd,
      T.end,
    ],
    [
      1,
      FLIP_SCALE[0],
      FLIP_SCALE[1],
      FLIP_SCALE[0],
      FLIP_SCALE[0],
      ROW_SCALE[stage],
      ROW_SCALE[stage],
      READY_SCALE[stage][0],
      READY_SCALE[stage][1],
    ],
    { ease: glide },
  );
  // Over to the back, back to the front, and at the close held a little
  // off square as it is handed forward.
  const rotateY = useTransform(
    progress,
    [T.flipStart, T.flipEnd, T.turnBackStart, T.turnBackEnd, T.gatherEnd, T.end],
    [0, -180, -180, -360, -360, -360 + READY_TILT.rotateY],
    { ease: glide },
  );
  // Tips back toward the apex of each turn and comes level again.
  const rotateX = useTransform(
    progress,
    [
      T.flipStart,
      T.flipApex,
      T.flipEnd,
      T.turnBackStart,
      T.turnBackApex,
      T.turnBackEnd,
      T.gatherEnd,
      T.end,
    ],
    [0, FLIP_TILT, 0, 0, TURN_BACK_TILT, 0, 0, READY_TILT.rotateX],
    { ease: glide },
  );
  const stockHidden = useTransform(
    progress,
    [T.stockStart, T.stockEnd],
    [1, 0],
    { ease: glide },
  );
  const labelOpacity = useTransform(progress, [...LABEL_RANGE], [0, 1, 1, 0]);
  const labelScale = useTransform(scale, (v: number) => 1 / v);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ x, y, scale, willChange: "transform" }}
    >
      <DoubleSidedCard
        rotateY={rotateY}
        rotateX={rotateX}
        stockHidden={stockHidden}
        className={CARD_WIDTH}
      />
      <motion.span className={LABEL_CLASS} style={{ opacity: labelOpacity, scale: labelScale }}>
        {CARD_VARIANTS[0].edition}
      </motion.span>
    </motion.div>
  );
}

// ── The still composition ─────────────────────────────────────────────────

function captionByKey(key: string): Caption {
  const found = CAPTIONS.find((c) => c.key === key);
  if (!found) throw new Error(`comp-card: no caption "${key}"`);
  return found;
}

function StaticHeading({ head }: { head: Caption["head"] }) {
  return (
    <h2 className="text-center font-editorial text-[clamp(2.15rem,7vw,3.65rem)] leading-[1.01] tracking-[-0.03em] text-[#FAF7F2]">
      <Head head={head} />
    </h2>
  );
}

function ReducedMotionSection() {
  const selection = captionByKey("selection");
  const direction = captionByKey("direction");
  const uses = captionByKey("uses");

  return (
    <section className="relative overflow-hidden bg-[#080808] text-[#FAF7F2]">
      <div className="mx-auto flex max-w-[76rem] flex-col gap-32 px-5 py-28 sm:px-8">
        <article className="space-y-12">
          <StaticHeading head={selection.head} />
          <div className="grid grid-cols-3 items-center gap-3 sm:gap-6">
            {SOURCE_FRAMES.map((frame, index) => (
              <div
                key={`${frame.src}-static-${index}`}
                className="overflow-hidden rounded-[0.25rem]"
                style={{ aspectRatio: CARD_ASPECT }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: frame.objectPosition, filter: frame.filter }}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-12">
          {/* The two halves of the line, as one line when nothing turns. */}
          <StaticHeading head={["A real front. A real ", "back", "."]} />
          <div className="mx-auto grid w-full max-w-[40rem] grid-cols-2 gap-4 sm:gap-8">
            <div className="overflow-hidden rounded-[0.35rem]"><CompCardFront loading="lazy" /></div>
            <div className="overflow-hidden rounded-[0.35rem]"><CompCardBack loading="lazy" /></div>
          </div>
        </article>

        <article className="space-y-12">
          <StaticHeading head={direction.head} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
            {CARD_VARIANTS.map((variant) => (
              <figure key={`${variant.edition}-static`} className="m-0">
                <div className="overflow-hidden rounded-[0.25rem]">
                  <CardImage src={variant.src} loading="lazy" />
                </div>
                <figcaption className="mt-3 text-center font-mono text-[0.5rem] tracking-[0.2em] text-white/42">
                  {variant.edition}
                </figcaption>
              </figure>
            ))}
          </div>
        </article>

        <article className="space-y-12">
          <StaticHeading head={uses.head} />
          <div className="mx-auto w-[min(21rem,78vw)] overflow-hidden rounded-[0.45rem]">
            <CompCardFront loading="lazy" />
          </div>
        </article>
      </div>
    </section>
  );
}

/** The still composition, for when the stage is not scrubbing. */
export default function SceneCompCard() {
  return <ReducedMotionSection />;
}

// ── The scene ─────────────────────────────────────────────────────────────

/**
 * The comp-card beat's layers, with no section and no sticky of its own.
 *
 * It renders inside the home stage's single pinned container so there is no
 * unpin between the intelligence sequence and this one: the figure travels
 * out as the plates travel in, on one continuous scroll (`lessons.md` §20).
 *
 * The keyframes and the copy are in `./motion.ts`. Every layer here reads
 * one spring-smoothed copy of the timeline, so the scene moves as one thing.
 */
export function CompCardLayers({
  progress,
  assetsArmed = true,
}: {
  progress: MotionValue<number>;
  /** Set once the hero's opening frames are in hand. See ./assets. */
  assetsArmed?: boolean;
}) {
  const stage = useStageKind();
  const smooth = useSpring(progress, TIMELINE_SPRING);

  return (
    <CompCardAssetsProvider value={assetsArmed}>
      {([1, 2] as const).map((index) => (
        <SupportFrame
          key={SOURCE_FRAMES[index].src}
          frame={SOURCE_FRAMES[index]}
          index={index}
          progress={smooth}
          stage={stage}
        />
      ))}

      {CARD_VARIANTS.slice(1).map((variant, index) => (
        <EditionVariant
          key={variant.edition}
          variant={variant}
          index={index + 1}
          progress={smooth}
          stage={stage}
        />
      ))}

      <LeadCard progress={smooth} stage={stage} />

      {CAPTIONS.map((caption) => (
        <ScrollCaption key={caption.key} caption={caption} progress={smooth} stage={stage} />
      ))}
    </CompCardAssetsProvider>
  );
}
