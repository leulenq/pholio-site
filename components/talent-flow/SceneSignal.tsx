"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 5 — Signal (ink).
   GESTURE: instrument wipe-reveal → collapse-to-line.
   Honest attention analytics: a seismograph of qualified visits and
   card pulls, ranked into a descending-emphasis column the way the
   industry actually reads attention. The instrument powers up via a
   left→right wipe rather than a fade; its needle-and-trace internals
   carry a light spring so they stay tight to the wheel (contrast
   against Arrival's heavy trailing). On exit the trace folds down
   onto its own baseline — the same gold tick the Arrival field
   collapsed into — which then rises again to hand off to the browser
   frame's top rule in Address.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  Stage,
  Caption,
  Mono,
  V,
  usePrm,
  ON_INK,
  ON_INK_SOFT,
  ON_INK_FAINT,
  HAIR_INK,
  GOLD,
  SERIF,
  SANS,
} from "./kit";
import { useMass, useScrub, useWipe, useCollapseToLine } from "./motion";

/* Hand-authored seismograph — quiet stretches, five sharp spikes. `x` is
   a 0–1 fraction of chart width; height is px above the baseline. */
const TRACE: [number, number][] = [
  [0, 4], [0.05, 5], [0.1, 6], [0.15, 5], [0.19, 32], [0.23, 7],
  [0.28, 5], [0.33, 6], [0.38, 8], [0.42, 55], [0.46, 9], [0.5, 6],
  [0.55, 5], [0.59, 7], [0.63, 42], [0.67, 10], [0.71, 6], [0.75, 5],
  [0.79, 82], [0.83, 12], [0.88, 24], [0.93, 6], [1, 4],
];
const SPIKE_X = [0.19, 0.42, 0.63, 0.79, 0.88] as const;
const SPIKE_TICK_H = [10, 16, 13, 20, 8] as const; // 8–20px
const TALLEST_X = 0.79;
const TALLEST_H = 82;

const CHART_W = 640;
const CHART_H = 200;
const BASELINE_Y = 168;
const BASELINE_FROM_BOTTOM_PCT = ((CHART_H - BASELINE_Y) / CHART_H) * 100;

function tracePath(close: boolean) {
  const pts = TRACE.map(([x, h]) => `${x * CHART_W},${BASELINE_Y - h}`);
  if (!close) return `M ${pts.join(" L ")}`;
  return `M 0,${BASELINE_Y} L ${pts.join(" L ")} L ${CHART_W},${BASELINE_Y} Z`;
}
const LINE_D = tracePath(false);
const AREA_D = tracePath(true);

type Row = {
  text: string;
  size: number;
  color: string;
  family?: string;
  mono?: boolean;
};

const ROWS: Row[] = [
  { text: "An agency reviewed your materials", size: 19, color: ON_INK, family: SERIF },
  { text: "A submission advanced", size: 17, color: "rgba(245,240,232,0.8)", family: SERIF },
  { text: "Your card was pulled · your link was opened", size: 14, color: ON_INK_SOFT, family: SANS },
  { text: "A qualified visit", size: 13, color: "rgba(245,240,232,0.55)", family: SANS },
  { text: "Raw reach", size: 10, color: ON_INK_FAINT, mono: true },
];
const ROW_THRESHOLDS = [0.4, 0.46, 0.52, 0.58, 0.64];
const ROW_GAPS = [0, 20, 18, 16, 14];

export default function SceneSignal() {
  const prm = usePrm();

  return (
    <Stage id="signal" hvh={255} z={4} overlap={100}>
      {(progress) => (
        <div className="relative flex h-full w-full flex-col justify-center gap-10 px-6 py-24 md:block md:px-16 md:py-0">
          <SignalCaption progress={progress} prm={prm} />
          <SignalChart progress={progress} prm={prm} />
          <SignalColumn progress={progress} prm={prm} />
        </div>
      )}
    </Stage>
  );
}

function SignalCaption({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  /* entrance: the caption is revealed by the same wipe-open language as
     the instrument. exit: this is the one element in the scene allowed
     to fade — it hands nothing forward, unlike the chart or the column. */
  const clip = useWipe(progress, [0.08, 0.18], "left");
  const exitOpacity = useTransform(progress, [0.9, 1], [1, 0]);

  return (
    <motion.div
      className="md:absolute md:left-16 md:top-[14%] md:max-w-[420px]"
      style={{
        clipPath: prm ? undefined : clip,
        opacity: prm ? 1 : exitOpacity,
        willChange: "clip-path, opacity",
      }}
    >
      <Caption dark headline={<>Know who leaned <V>in.</V></>}>
        Attention, ranked the way the industry ranks it. Under twenty views,
        it tells you the truth: too early to read.
      </Caption>
    </motion.div>
  );
}

function SignalChart({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  /* the instrument's internals — locked tight to the wheel, in contrast
     to Arrival's heavy trailing portraits */
  const light = useMass(progress, "light");

  /* the whole plotted trace: wipes open left→right on entrance, folds
     down onto its own baseline on exit */
  const wipeClip = useWipe(progress, [0.1, 0.34], "left");
  const collapse = useCollapseToLine(progress, [0.84, 0.98]);

  /* baseline draw — retimed to precede the wipe */
  const baselineScaleX = useScrub(light, [0.06, 0.16], [0, 1], "wipe");
  /* the baseline survives the collapse and keeps rising to hand off */
  const baselineY = useScrub(light, [0.86, 1], ["0vh", "-38vh"], "arrival");
  const baselineColor = useTransform(
    light,
    [0.86, 0.94],
    [HAIR_INK, "rgba(245,240,232,0.35)"],
  );
  const baselineOpacity = useTransform(light, [0.985, 1], [1, 0.4]);

  const strikeY = useScrub(light, [0.12, 0.16], [-18, 0], "wipe");
  const strikeOpacity = useTransform(light, [0.12, 0.16], [0, 1]);

  const drawOffset = useScrub(light, [0.16, 0.46], [1, 0], "drive");
  const areaClipWidth = useScrub(light, [0.16, 0.46], [0, CHART_W], "drive");

  const diamondBottomPct = BASELINE_FROM_BOTTOM_PCT + ((TALLEST_H + 16) / CHART_H) * 100;
  const diamondOpacity = useTransform(light, [0.42, 0.5], [0, 1]);
  const diamondScale = useScrub(light, [0.42, 0.5], [0.6, 1], "arrival");

  return (
    <div className="w-full md:absolute md:bottom-[10%] md:left-16 md:w-[62%]">
      <div className="relative w-full" style={{ aspectRatio: `${CHART_W} / ${CHART_H}` }}>
        {/* the plotted trace — wipes open, collapses onto the baseline on exit */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: prm ? undefined : wipeClip,
            scaleY: prm ? 1 : collapse.scaleY,
            opacity: prm ? 1 : collapse.opacity,
            transformOrigin: "bottom",
            willChange: "clip-path, transform, opacity",
          }}
        >
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <clipPath id="signal-area-clip">
              <motion.rect
                x={0}
                y={0}
                height={CHART_H}
                width={prm ? CHART_W : areaClipWidth}
              />
            </clipPath>
            <path d={AREA_D} fill="rgba(245,240,232,0.05)" clipPath="url(#signal-area-clip)" />
            <motion.path
              d={LINE_D}
              fill="none"
              stroke="rgba(245,240,232,0.55)"
              strokeWidth={1.25}
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: prm ? 0 : drawOffset }}
            />
          </svg>

          {SPIKE_X.map((x, i) => (
            <SpikeTick
              key={x}
              x={x}
              h={SPIKE_TICK_H[i]}
              index={i}
              progress={light}
              prm={prm}
            />
          ))}

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${TALLEST_X * 100}%`,
              bottom: `${diamondBottomPct}%`,
              transform: "translateX(-50%)",
            }}
          >
            <motion.div
              style={{
                width: 8,
                height: 8,
                background: GOLD,
                rotate: 45,
                scale: prm ? 1 : diamondScale,
                opacity: prm ? 1 : diamondOpacity,
                willChange: "transform, opacity",
              }}
            />
          </div>
        </motion.div>

        {/* baseline hairline — survives the trace's collapse, travels up
            to hand off to the next scene */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `${BASELINE_FROM_BOTTOM_PCT}%`,
            height: 1,
            transformOrigin: "left",
            scaleX: prm ? 1 : baselineScaleX,
            y: prm ? 0 : baselineY,
            backgroundColor: prm ? HAIR_INK : baselineColor,
            opacity: prm ? 1 : baselineOpacity,
            willChange: "transform, opacity, background-color",
          }}
        />

        {/* the echoed gold strike from Arrival */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            bottom: `${BASELINE_FROM_BOTTOM_PCT}%`,
            width: 2,
            height: 10,
            background: GOLD,
            y: prm ? 0 : strikeY,
            opacity: prm ? 1 : strikeOpacity,
            willChange: "transform, opacity",
          }}
        />
      </div>
      <span className="sr-only">
        Attention over time: qualified visits as a soft field, card pulls as
        gold strikes, an agency review marked above them.
      </span>
    </div>
  );
}

function SpikeTick({
  x,
  h,
  index,
  progress,
  prm,
}: {
  x: number;
  h: number;
  index: number;
  progress: MotionValue<number>;
  prm: boolean;
}) {
  /* shortened to a 0.04 window each — discrete strikes, not a swell */
  const start = 0.3 + index * 0.0375;
  const end = start + 0.04;
  const scaleY = useScrub(progress, [start, end], [0, 1], "drive");
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        bottom: `${BASELINE_FROM_BOTTOM_PCT}%`,
        width: 1.5,
        height: h,
        background: GOLD,
        transformOrigin: "bottom",
        scaleY: prm ? 1 : scaleY,
        opacity: prm ? 1 : opacity,
        willChange: "transform, opacity",
      }}
    />
  );
}

function SignalColumn({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  /* the whole hierarchy column wipes out downward as one unit at exit */
  const exitClip = useScrub(
    progress,
    [0.86, 0.98],
    ["inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"],
    "wipe",
  );

  return (
    <motion.div
      className="w-full max-w-xs md:absolute md:right-16 md:top-[14%] md:w-[300px]"
      style={{ clipPath: prm ? undefined : exitClip, willChange: "clip-path" }}
    >
      {ROWS.map((row, i) => (
        <SignalRow
          key={row.text}
          row={row}
          threshold={ROW_THRESHOLDS[i]}
          gap={ROW_GAPS[i]}
          hairlineBefore={i > 0}
          progress={progress}
          prm={prm}
        />
      ))}
      <SignalBodyLine progress={progress} prm={prm} />
    </motion.div>
  );
}

function SignalRow({
  row,
  threshold,
  gap,
  hairlineBefore,
  progress,
  prm,
}: {
  row: Row;
  threshold: number;
  gap: number;
  hairlineBefore: boolean;
  progress: MotionValue<number>;
  prm: boolean;
}) {
  const end = threshold + 0.06;
  const clip = useWipe(progress, [threshold, end], "left");
  const x = useScrub(progress, [threshold, end], [-14, 0], "arrival");

  return (
    <motion.div
      style={{
        clipPath: prm ? undefined : clip,
        x: prm ? 0 : x,
        marginTop: gap,
        paddingTop: hairlineBefore ? 14 : 0,
        borderTop: hairlineBefore ? `1px solid ${HAIR_INK}` : undefined,
        willChange: "clip-path, transform",
      }}
    >
      {row.mono ? (
        <Mono color={row.color} size={row.size}>
          {row.text}
        </Mono>
      ) : (
        <p
          style={{
            margin: 0,
            fontFamily: row.family,
            fontSize: row.size,
            lineHeight: 1.3,
            color: row.color,
          }}
        >
          {row.text}
        </p>
      )}
    </motion.div>
  );
}

function SignalBodyLine({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  const clip = useWipe(progress, [0.66, 0.78], "left");
  const x = useScrub(progress, [0.66, 0.78], [-14, 0], "arrival");

  return (
    <motion.p
      style={{
        marginTop: 24,
        marginBottom: 0,
        fontFamily: SANS,
        fontSize: 14,
        lineHeight: 1.7,
        color: ON_INK_SOFT,
        clipPath: prm ? undefined : clip,
        x: prm ? 0 : x,
        willChange: "clip-path, transform",
      }}
    >
      A private link for every send. A re-open days later is filing behavior
      — it&rsquo;s marked.
    </motion.p>
  );
}
