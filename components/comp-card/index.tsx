"use client";

import type { MotionValue } from "framer-motion";

import { useMediaQuery } from "@/components/hero/useMediaQuery";
import {
  cubicBezier,
  motion,
  useTransform,
} from "framer-motion";
import CompCardBack from "./CompCardBack";
import CompCardFront from "./CompCardFront";
import { CARD_SHADOW, CardImage, DoubleSidedCard } from "./GeneratedCard";
import {
  CARD_VARIANTS,
  SOURCE_FRAMES,
  type CardVariant,
  type SourceFrame,
} from "./data";

const glide = cubicBezier(0.65, 0, 0.35, 1);

const LEAD_SOURCE_ALIGNMENT = {
  scale: 1.01,
  x: 0.5,
  y: 0.8,
  objectOpacity: 0.56,
};

const BEATS = [
  {
    key: "selection",
    head: ["The frame that ", "leads", "."],
    position: "bottom" as const,
    range: [0, 0.03, 0.18, 0.225] as const,
  },
  {
    key: "output",
    head: ["A real front. A real ", "back", "."],
    position: "bottom" as const,
    range: [0.235, 0.3, 0.47, 0.515] as const,
  },
  {
    // Editions, not markets. A card varies by art direction; a city is an
    // intel concept and never touches composition. Nine is the shipped
    // catalog count, not a claim (`data.ts` EDITION_COUNT).
    key: "editions",
    head: ["One book. Nine ", "directions", "."],
    position: "top" as const,
    range: [0.53, 0.6, 0.77, 0.815] as const,
  },
  {
    key: "ready",
    head: ["Ready for the ", "room", "."],
    position: "left" as const,
    range: [0.83, 0.9, 1, 1] as const,
  },
] as const;

type Beat = (typeof BEATS)[number];

function captionClass(position: Beat["position"]) {
  const base = "pointer-events-none absolute z-40 flex flex-col px-6";

  if (position === "top") {
    return `${base} left-1/2 top-[7.5vh] w-full max-w-[44rem] -translate-x-1/2 items-center text-center`;
  }

  if (position === "left") {
    return `${base} bottom-[8vh] left-1/2 w-full max-w-[34rem] -translate-x-1/2 items-center text-center md:bottom-auto md:left-[8%] md:top-1/2 md:w-auto md:max-w-[23rem] md:translate-x-0 md:-translate-y-1/2 md:items-start md:text-left`;
  }

  return `${base} bottom-[8vh] left-1/2 w-full max-w-[42rem] -translate-x-1/2 items-center text-center`;
}

function ScrollCaption({ beat, progress }: { beat: Beat; progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [beat.range[0], beat.range[1], beat.range[2], beat.range[3]],
    beat.key === "ready" ? [0, 1, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [beat.range[0], beat.range[1], beat.range[2], beat.range[3]],
    beat.key === "ready" ? [10, 0, 0, 0] : [10, 0, 0, -8],
    { ease: glide },
  );

  return (
    <motion.h2
      style={{ opacity, y }}
      className={`${captionClass(beat.position)} font-editorial text-[clamp(2.15rem,4.4vw,3.65rem)] leading-[1.01] tracking-[-0.03em] text-[#FAF7F2]`}
    >
      <span>
        {beat.head[0]}
        <span className="font-editorial-italic text-[#C9A55A]">{beat.head[1]}</span>
        {beat.head[2]}
      </span>
    </motion.h2>
  );
}

function StaticHeading({ beat }: { beat: Beat }) {
  return (
    <h2 className="text-center font-editorial text-[clamp(2.15rem,7vw,3.65rem)] leading-[1.01] tracking-[-0.03em] text-[#FAF7F2]">
      {beat.head[0]}
      <span className="font-editorial-italic text-[#C9A55A]">{beat.head[1]}</span>
      {beat.head[2]}
    </h2>
  );
}

function SourceFrame({
  frame,
  index,
  progress,
}: {
  frame: SourceFrame;
  index: number;
  progress: MotionValue<number>;
}) {
  const startLefts = ["18%", "50%", "82%"];
  const startLeft = startLefts[index] || "50%";
  const isLead = index === 0;
  const left = useTransform(progress, [0, 0.065, 0.21], [startLeft, startLeft, "50%"], {
    ease: glide,
  });
  const opacity = useTransform(
    progress,
    isLead ? [0, 0.045, 0.16, 0.26, 0.33] : [0, 0.02 + index * 0.01, 0.11, 0.185],
    isLead
      ? [0, 0.94, 0.94, LEAD_SOURCE_ALIGNMENT.objectOpacity, 0]
      : [0, index === 1 ? 1 : 0.5, index === 1 ? 0.88 : 0.34, 0],
  );
  const y = useTransform(
    progress,
    isLead ? [0, 0.08, 0.22] : [0, 0.08, 0.21],
    isLead ? [72, 26, 26] : [index === 1 ? 24 : 36, index === 1 ? -8 : index === 0 ? 8 : 2, -8],
    { ease: glide },
  );
  const rotateZ = useTransform(
    progress,
    isLead ? [0, 0.08, 0.22] : [0, 0.08, 0.21],
    isLead ? [0, 0, 0] : [index === 0 ? -6 : index === 2 ? 6 : 0, index === 0 ? -4 : index === 2 ? 4 : 0, 0],
    { ease: glide },
  );
  const scale = useTransform(
    progress,
    isLead ? [0, 0.08, 0.22] : [0, 0.08, 0.21],
    isLead ? [1.04, 1.02, 1.02] : [index === 0 ? 0.96 : 0.94, index === 1 ? 1 : 0.9, index === 1 ? 1.035 : 0.82],
    { ease: glide },
  );
  const leadImageScale = useTransform(
    progress,
    [0, 0.08, 0.22],
    [LEAD_SOURCE_ALIGNMENT.scale, LEAD_SOURCE_ALIGNMENT.scale, LEAD_SOURCE_ALIGNMENT.scale],
    { ease: glide },
  );
  const leadImageY = useTransform(
    progress,
    [0, 0.08, 0.22],
    [LEAD_SOURCE_ALIGNMENT.y, LEAD_SOURCE_ALIGNMENT.y, LEAD_SOURCE_ALIGNMENT.y],
    { ease: glide },
  );
  const leadImageX = useTransform(
    progress,
    [0, 0.08, 0.22],
    [LEAD_SOURCE_ALIGNMENT.x, LEAD_SOURCE_ALIGNMENT.x, LEAD_SOURCE_ALIGNMENT.x],
    { ease: glide },
  );
  const sizeClass =
    index === 0
      ? "w-[16rem] sm:w-[17.75rem] md:w-[20rem] lg:w-[22.75rem]"
      : index === 1
        ? "w-[10.5rem] sm:w-[12.25rem] md:w-[14rem] lg:w-[15.75rem]"
        : "w-[10.25rem] sm:w-[11.5rem] md:w-[13rem] lg:w-[14.5rem]";
  const zClass = index === 0 ? "z-20" : "z-10";

  return (
    <motion.figure
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 ${sizeClass} ${zClass}`}
      style={{ left, opacity, y, rotateZ, scale }}
    >
      <div
        className="overflow-hidden rounded-[0.35rem]"
        style={{ aspectRatio: "5.5 / 8.5", boxShadow: CARD_SHADOW }}
      >
        {isLead ? (
          <motion.img
            src={frame.src}
            alt=""
            draggable={false}
            className="h-full w-full object-cover"
            style={{
              objectPosition: frame.objectPosition,
              filter: frame.filter,
              scale: leadImageScale,
              y: leadImageY,
              x: leadImageX,
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frame.src}
            alt=""
            draggable={false}
            className="h-full w-full object-cover"
            style={{ objectPosition: frame.objectPosition, filter: frame.filter }}
          />
        )}
      </div>
    </motion.figure>
  );
}

function EditionVariant({
  variant,
  index,
  progress,
}: {
  variant: CardVariant;
  index: number;
  progress: MotionValue<number>;
}) {
  const compact = useMediaQuery("(max-width: 767px)");
  const targetLeft = compact
    ? index === 1
      ? "72%"
      : index === 2
        ? "28%"
        : "72%"
    : index === 1
      ? "39%"
      : index === 2
        ? "61%"
        : "81%";
  // Rows on a narrow stage; a single line of four on a wide one.
  const settledY = compact ? (index >= 2 ? 152 : -122) : index % 2 === 0 ? -4 : 4;
  const settledScale = compact ? 0.46 : 0.62;
  const delay = (index - 1) * 0.012;
  const left = useTransform(
    progress,
    [0.545 + delay, 0.685 + delay, 0.815, 0.93],
    ["50%", targetLeft, targetLeft, "62%"],
    { ease: glide },
  );
  const opacity = useTransform(
    progress,
    [0.55 + delay, 0.655 + delay, 0.825, 0.925],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    progress,
    [0.545 + delay, 0.685 + delay, 0.815, 0.93],
    [0.78, settledScale, settledScale, 0.98],
    { ease: glide },
  );
  const y = useTransform(
    progress,
    [0.545 + delay, 0.685 + delay, 0.815, 0.93],
    [18, settledY, settledY, 0],
    { ease: glide },
  );
  const labelOpacity = useTransform(progress, [0.63 + delay, 0.7 + delay, 0.8, 0.86], [0, 1, 1, 0]);

  const captionScale = useTransform(scale, (v: number) => 1 / v);

  return (
    <motion.figure
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 m-0 w-[15.5rem] -translate-x-1/2 -translate-y-1/2 sm:w-[17rem] md:w-[19.5rem] lg:w-[21.5rem]"
      style={{ left, opacity, y, scale }}
    >
      <div
        className="relative overflow-hidden rounded-[0.55rem]"
        style={{ aspectRatio: "5.5 / 8.5", boxShadow: CARD_SHADOW }}
      >
        <CardImage src={variant.src} />
      </div>
      <motion.figcaption
        className="absolute inset-x-0 top-[calc(100%+0.9rem)] origin-top text-center font-mono text-[0.52rem] tracking-[0.2em] text-white/44"
        style={{ opacity: labelOpacity, scale: captionScale }}
      >
        {variant.edition}
      </motion.figcaption>
    </motion.figure>
  );
}

function ContinuousCard({ progress }: { progress: MotionValue<number> }) {
  // The lead card joins the same grid as the other three: one row of four on a
  // wide stage, the first cell of a two-by-two on a narrow one.
  const compact = useMediaQuery("(max-width: 767px)");
  const gridLeft = compact ? "28%" : "19%";
  const gridY = compact ? -122 : -4;
  const gridScale = compact ? 0.46 : 0.62;
  const left = useTransform(
    progress,
    [0, 0.545, 0.685, 0.815, 0.93, 1],
    ["50%", "50%", gridLeft, gridLeft, "62%", "62%"],
    { ease: glide },
  );
  const opacity = useTransform(progress, [0.18, 0.26, 1], [0, 1, 1]);
  const rotateY = useTransform(
    progress,
    [0, 0.24, 0.31, 0.48, 0.57, 0.69, 1],
    [0, 0, -18, -180, -180, -360, -360],
    { ease: glide },
  );
  const scale = useTransform(
    progress,
    [0.105, 0.22, 0.31, 0.48, 0.57, 0.69, 0.815, 0.93, 1],
    [1.04, 1.02, 0.98, 0.98, 0.96, gridScale, gridScale, 1.04, 1.06],
    { ease: glide },
  );
  // The two bottom captions (beats 1-2) sit at bottom-[8vh]; the card is tall,
  // so its default centred position overlapped that text. Raise the card through
  // those beats and ease back to the original resting spots by the markets grid
  // (0.69+ keyframes unchanged) so the flip/grid/ready choreography is untouched.
  const y = useTransform(
    progress,
    [0.105, 0.22, 0.35, 0.46, 0.6, 0.69, 0.815, 0.93, 1],
    [40, -30, -60, -60, -18, gridY, gridY, -2, -2],
    { ease: glide },
  );
  const labelOpacity = useTransform(progress, [0.63, 0.7, 0.8, 0.86], [0, 1, 1, 0]);

  // Scale lives on the wrapper so the label scales with the card and stays
  // beside it; the text is counter-scaled back to its own size.
  const captionScale = useTransform(scale, (v: number) => 1 / v);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
      // `y` rides the wrapper with `scale`, not the inner card: applied inside
      // a 0.46-scaled element it was landing at 46% of its value, which is why
      // the lead card sat lower than the other three in the narrow grid.
      style={{ left, scale, y }}
    >
      <DoubleSidedCard
        rotateY={rotateY}
        scale={1}
        y={0}
        opacity={opacity}
        className="!w-[16rem] sm:!w-[17.75rem] md:!w-[20rem] lg:!w-[22.75rem]"
      />
      <motion.span
        className="absolute inset-x-0 top-[calc(100%+0.9rem)] origin-top text-center font-mono text-[0.52rem] tracking-[0.2em] text-white/44"
        style={{ opacity: labelOpacity, scale: captionScale }}
      >
        {CARD_VARIANTS[0].edition}
      </motion.span>
    </motion.div>
  );
}

function ReducedMotionSection() {
  return (
    <section className="relative overflow-hidden bg-[#080808] text-[#FAF7F2]">
      <div className="mx-auto flex max-w-[76rem] flex-col gap-32 px-5 py-28 sm:px-8">
        <article className="space-y-12">
          <StaticHeading beat={BEATS[0]} />
          <div className="grid grid-cols-3 items-center gap-3 sm:gap-6">
            {SOURCE_FRAMES.map((frame, index) => (
              <div
                key={`${frame.src}-static-${index}`}
                className="overflow-hidden rounded-[0.25rem]"
                style={{ aspectRatio: "5.5 / 8.5" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: frame.objectPosition, filter: frame.filter }}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-12">
          <StaticHeading beat={BEATS[1]} />
          <div className="mx-auto grid w-full max-w-[40rem] grid-cols-2 gap-4 sm:gap-8">
            <div className="overflow-hidden rounded-[0.35rem]"><CompCardFront /></div>
            <div className="overflow-hidden rounded-[0.35rem]"><CompCardBack /></div>
          </div>
        </article>

        <article className="space-y-12">
          <StaticHeading beat={BEATS[2]} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
            {CARD_VARIANTS.map((variant) => (
              <figure key={`${variant.edition}-static`} className="m-0">
                <div className="overflow-hidden rounded-[0.25rem]">
                  <CardImage src={variant.src} />
                </div>
                <figcaption className="mt-3 text-center font-mono text-[0.5rem] tracking-[0.2em] text-white/42">
                  {variant.edition}
                </figcaption>
              </figure>
            ))}
          </div>
        </article>

        <article className="space-y-12">
          <StaticHeading beat={BEATS[3]} />
          <div className="mx-auto w-[min(21rem,78vw)] overflow-hidden rounded-[0.45rem]">
            <CompCardFront />
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

/**
 * The comp-card beat's layers, with no section and no sticky of its own.
 *
 * It renders inside the home stage's single pinned container so there is no
 * unpin between the intelligence sequence and this one: the figure travels
 * out as the plates travel in, on one continuous scroll (`lessons.md` §20).
 */
export function CompCardLayers({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      {SOURCE_FRAMES.map((frame, index) => (
        <SourceFrame
          key={`${frame.src}-${index}`}
          frame={frame}
          index={index}
          progress={progress}
        />
      ))}

      {CARD_VARIANTS.slice(1).map((variant, index) => (
        <EditionVariant
          key={variant.edition}
          variant={variant}
          index={index + 1}
          progress={progress}
        />
      ))}

      <ContinuousCard progress={progress} />

      {BEATS.map((beat) => (
        <ScrollCaption key={beat.key} beat={beat} progress={progress} />
      ))}
    </>
  );
}
