"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

import {
  CREAM,
  CREAM_QUIET,
  CREAM_SOFT,
  DESTINATIONS,
  DISCLOSURE,
  FRAMES,
  GEOMETRY,
  GOLD,
  LINES,
  LINES_T,
  PHOLIO,
  PIECES,
  ROLES,
  VELVET,
  WORDS_IN,
  WORDS_OUT,
  away,
  cardRest,
  lineOffset,
  pieceProgress,
  placements,
  poseAt,
  wordsOffset,
  type Destination,
  type Piece,
  type Placement,
  type Pose,
  type Role,
  type StageKind,
} from "./motion";

/**
 * The application beat's layers, mounted in the home stage's own z-stack
 * (`components/hero/index.tsx`) and driven by its timeline. The idea, the
 * data and the geometry are in `./motion.ts`; this file draws them.
 *
 * Two layers: the words, behind the card; the prints, in front of it. The
 * card itself is the comp-card beat's, moved as a whole layer by the pose
 * this file computes (`useCardPose`), never redrawn.
 */

/** The frame, in px. A safe guess until mounted. */
export function useFrame() {
  const [frame, setFrame] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const read = () => setFrame({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return frame;
}

const POSES: readonly Pose[] = ["rest", "spread", "elite", "one", "muse", "pholio", "sent"];

type Layouts = Record<Pose, Record<Piece, Placement>>;

function useLayouts(stage: StageKind, w: number, h: number): Layouts {
  return useMemo(() => {
    const out = {} as Layouts;
    POSES.forEach((pose) => {
      out[pose] = placements(pose, stage, w, h);
    });
    return out;
  }, [stage, w, h]);
}

/** A piece's order within a move, for the stagger: its place in the row it is going to, else the one it is leaving. */
function orderOf(piece: Piece, from: Pose, to: Pose): { order: number; count: number } {
  const rowOf = (pose: Pose): readonly Piece[] => {
    const d = DESTINATIONS.find((x) => x.id === pose);
    return d ? d.asks.map((a) => a.role) : PIECES;
  };
  const target = rowOf(to);
  const source = rowOf(from);
  const i = target.indexOf(piece);
  const j = source.indexOf(piece);
  return { order: i >= 0 ? i : j >= 0 ? j : 0, count: Math.max(target.length, source.length) };
}

function interpolate(p: number, piece: Piece, layouts: Layouts) {
  const { from, to, t } = poseAt(p);
  const a = layouts[from][piece];
  if (from === to) return { x: a.x, y: a.y, scale: a.scale, moving: false, z: a.z };
  const b = layouts[to][piece];
  const { order, count } = orderOf(piece, from, to);
  const k = pieceProgress(t, order, count, to === "sent" ? away : undefined);
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    scale: a.scale + (b.scale - a.scale) * k,
    moving: a.x !== b.x || a.y !== b.y || a.scale !== b.scale,
    z: a.z,
  };
}

/**
 * The card's pose through the beat, as a transform of the whole card layer
 * about the card's rest centre: identity at the beat's ends, so the chapter
 * before and the light after find it exactly where they expect it.
 */
export function useCardPose(progress: MotionValue<number>, stage: StageKind, w: number, h: number) {
  const layouts = useLayouts(stage, w, h);
  const rest = cardRest(stage, w, h);
  const x = useTransform(progress, (p) => {
    const v = interpolate(p, "card", layouts);
    return v.x + (rest.width * v.scale) / 2 - rest.cx;
  });
  const y = useTransform(progress, (p) => {
    const v = interpolate(p, "card", layouts);
    return v.y + (rest.height * v.scale) / 2 - rest.cy;
  });
  const scale = useTransform(progress, (p) => interpolate(p, "card", layouts).scale);
  return { x, y, scale, origin: `${rest.cx}px ${rest.cy}px` };
}

// ── The layers ────────────────────────────────────────────────────────────

export function ApplicationWords({
  progress,
  stage,
  w,
  h,
}: {
  progress: MotionValue<number>;
  stage: StageKind;
  w: number;
  h: number;
}) {
  const layouts = useLayouts(stage, w, h);
  const g = GEOMETRY[stage];
  const lineTravel = (g.lines.top + 0.4) * h;
  const addressTravel = (g.address.top + 0.4) * h;
  const footTravel = h - (g.row.top * h + g.row.height * h) + 0.06 * h;

  return (
    <div className="pointer-events-none absolute inset-0">
      <OpeningLines progress={progress} stage={stage} travel={lineTravel} />
      {DESTINATIONS.map((destination, index) => (
        <DestinationWords
          key={destination.id}
          destination={destination}
          index={index}
          stage={stage}
          layout={layouts[destination.id]}
          progress={progress}
          addressTravel={addressTravel}
          footTravel={footTravel}
        />
      ))}
      <PholioWords progress={progress} stage={stage} addressTravel={addressTravel} />
    </div>
  );
}

export function ApplicationPrints({
  progress,
  stage,
  w,
  h,
  armed,
}: {
  progress: MotionValue<number>;
  stage: StageKind;
  w: number;
  h: number;
  /** The frames are fetched once the hero's own opening is in hand. */
  armed: boolean;
}) {
  const layouts = useLayouts(stage, w, h);
  return (
    <div className="pointer-events-none absolute inset-0">
      {ROLES.map((role) => (
        <Print key={role} role={role} layouts={layouts} progress={progress} armed={armed} />
      ))}
    </div>
  );
}

/** One print, persistent through every pose. */
function Print({
  role,
  layouts,
  progress,
  armed,
}: {
  role: Role;
  layouts: Layouts;
  progress: MotionValue<number>;
  armed: boolean;
}) {
  const base = layouts.elite[role];
  const transform = useTransform(progress, (p) => {
    const v = interpolate(p, role, layouts);
    return `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.scale})`;
  });
  // A print on the move passes over the ones at rest.
  const zIndex = useTransform(progress, (p) => {
    const v = interpolate(p, role, layouts);
    return v.moving ? 20 : v.z;
  });

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        width: base.width,
        height: base.height,
        transform,
        zIndex,
        transformOrigin: "0 0",
        willChange: "transform",
      }}
    >
      <PrintFace role={role} armed={armed} sizes="(max-width: 767px) 30vw, 22vw" />
    </motion.div>
  );
}

/** The photograph as a print: a hair of white stock around it. */
function PrintFace({ role, sizes, armed = true }: { role: Role; sizes: string; armed?: boolean }) {
  const frame = FRAMES[role];
  return (
    <div
      className="relative h-full w-full"
      style={{ backgroundColor: "#ffffff", padding: 3, boxSizing: "border-box" }}
    >
      <div className="relative h-full w-full overflow-hidden">
        {armed && (
          <Image
            src={frame.src}
            alt={frame.alt}
            fill
            sizes={sizes}
            loading="eager"
            style={{ objectFit: "cover" }}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}

/** The opening: one line beside the resting card, one where the card was. */
function OpeningLines({
  progress,
  stage,
  travel,
}: {
  progress: MotionValue<number>;
  stage: StageKind;
  travel: number;
}) {
  const g = GEOMETRY[stage];
  const t = LINES_T[stage];
  const compact = stage === "compact";
  const aY = useTransform(progress, (p) => -Math.abs(lineOffset(p, t.aIn, t.aOut)) * travel);
  const bY = useTransform(progress, (p) => -Math.abs(lineOffset(p, t.bIn, t.bOut)) * travel);
  const lineStyle = {
    fontSize: g.lines.size,
    lineHeight: 1.02,
    letterSpacing: "-0.015em",
    color: CREAM,
    whiteSpace: "pre-line" as const,
  };
  return (
    <>
      <motion.p
        className="absolute m-0 font-editorial"
        style={{
          left: `${g.margin * 100}vw`,
          top: `${g.lines.top * 100}vh`,
          maxWidth: `${g.lines.max * 100}vw`,
          y: aY,
          ...lineStyle,
        }}
      >
        {LINES.a.before}
      </motion.p>
      <motion.p
        className="absolute m-0 font-editorial"
        style={{
          ...(compact
            ? { left: `${g.margin * 100}vw`, textAlign: "left" as const }
            : { right: `${g.margin * 100}vw`, textAlign: "right" as const }),
          top: `${g.lines.top * 100}vh`,
          maxWidth: `${g.lines.max * 100}vw`,
          y: bY,
          ...lineStyle,
        }}
      >
        {LINES.b.before}
        <span className="font-editorial-italic" style={{ color: GOLD }}>
          {LINES.b.verdict}
        </span>
        {LINES.b.after}
      </motion.p>
    </>
  );
}

/**
 * One agency's words. The address at the top: the name, and beneath it, at
 * a third of its size, where the application continues. Under the row, the
 * agency's own shot names. At the foot, the small print.
 */
function DestinationWords({
  destination,
  index,
  stage,
  layout,
  progress,
  addressTravel,
  footTravel,
}: {
  destination: Destination;
  index: number;
  stage: StageKind;
  layout: Record<Piece, Placement>;
  progress: MotionValue<number>;
  addressTravel: number;
  footTravel: number;
}) {
  const g = GEOMETRY[stage];
  const compact = stage === "compact";
  const inRange = WORDS_IN[index];
  const outRange = WORDS_OUT[index];
  const addressY = useTransform(progress, (p) => -Math.abs(wordsOffset(p, inRange, outRange)) * addressTravel);
  const footY = useTransform(progress, (p) => Math.abs(wordsOffset(p, inRange, outRange)) * footTravel);

  return (
    <>
      <motion.div
        className="absolute"
        style={{
          left: `${g.margin * 100}vw`,
          top: `${g.address.top * 100}vh`,
          y: addressY,
          maxWidth: `${g.address.max * 100}vw`,
        }}
      >
        <Address stage={stage} channel={destination.channel}>
          For {destination.name}.
        </Address>
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: footY }}>
        {destination.asks.map((ask) => {
          const place = layout[ask.role];
          return (
            <p
              key={ask.slot}
              className="absolute m-0 font-sans"
              style={{
                left: place.x,
                top: place.y + place.height + g.caption.gap,
                width: place.width + g.row.gap - 6,
                fontSize: g.caption.size,
                lineHeight: g.caption.lead,
                color: CREAM_SOFT,
              }}
            >
              {ask.label}
            </p>
          );
        })}

        {/* The small print: at the foot, on the side the address is not. */}
        <p
          className="absolute m-0 font-sans"
          style={{
            ...(compact
              ? { left: `${g.margin * 100}vw`, textAlign: "left" as const }
              : { right: `${g.margin * 100}vw`, textAlign: "right" as const }),
            bottom: `${g.disclosure.bottom * 100}vh`,
            fontSize: g.disclosure.size,
            lineHeight: 1.45,
            color: CREAM_QUIET,
            maxWidth: `${g.disclosure.max * 100}vw`,
          }}
        >
          {DISCLOSURE}
        </p>
      </motion.div>
    </>
  );
}

/** The last destination: the mark. The packet and its send say the rest. */
function PholioWords({
  progress,
  stage,
  addressTravel,
}: {
  progress: MotionValue<number>;
  stage: StageKind;
  addressTravel: number;
}) {
  const g = GEOMETRY[stage];
  const inRange = WORDS_IN[3];
  const outRange = WORDS_OUT[3];
  const addressY = useTransform(progress, (p) => -Math.abs(wordsOffset(p, inRange, outRange)) * addressTravel);
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${g.margin * 100}vw`,
        top: `${g.address.top * 100}vh`,
        y: addressY,
        maxWidth: `${g.address.max * 100}vw`,
      }}
    >
      <Address stage={stage}>
        {PHOLIO.before}
        <Mark />
      </Address>
    </motion.div>
  );
}

/** The address: the name at display scale, and beneath it, smaller, where the application continues. */
function Address({
  stage,
  channel,
  children,
}: {
  stage: StageKind;
  channel?: string;
  children: React.ReactNode;
}) {
  const g = GEOMETRY[stage];
  return (
    <div style={{ fontSize: g.address.size }}>
      <p
        className="m-0 font-editorial"
        style={{
          fontSize: "1em",
          lineHeight: 1.02,
          letterSpacing: "-0.015em",
          color: CREAM,
          paddingBottom: "0.06em",
        }}
      >
        {children}
      </p>
      {channel && (
        <p
          className="m-0 font-editorial"
          style={{
            fontSize: `${g.address.channel}em`,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: CREAM_SOFT,
            marginTop: "0.12em",
          }}
        >
          {channel}
        </p>
      )}
    </div>
  );
}

/** The wordmark as a typographic asset: the recorded face, weight, tracking and gold (`lessons.md` §24.3). */
function Mark() {
  return (
    <span
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: "0.86em",
        letterSpacing: "0.2em",
        marginRight: "-0.2em",
        color: GOLD,
        whiteSpace: "nowrap",
      }}
    >
      {PHOLIO.mark}
    </span>
  );
}

// ── The still composition ─────────────────────────────────────────────────

/** For a reader who has asked for no motion: the opening, then every destination complete, in a column on the velvet. */
export function StillApplication({ stage }: { stage: StageKind }) {
  const g = GEOMETRY[stage];
  const compact = stage === "compact";
  const printHeight = compact ? "22vh" : "30vh";
  const pad = `${g.margin * 100}vw`;

  const row = (items: readonly { role: Role; label?: string }[]) => (
    <ul
      className="m-0 flex list-none flex-wrap p-0"
      style={{ marginTop: compact ? "5vh" : "7vh", gap: `${g.row.gap + 8}px ${g.row.gap}px` }}
    >
      {items.map((item) => {
        const frame = FRAMES[item.role];
        return (
          <li key={item.role} style={{ width: `calc(${printHeight} * ${frame.w / frame.h})` }}>
            <div style={{ height: printHeight }}>
              <PrintFace role={item.role} sizes="(max-width: 767px) 30vw, 22vw" />
            </div>
            {item.label && (
              <p
                className="m-0 font-sans"
                style={{ marginTop: g.caption.gap, fontSize: g.caption.size, lineHeight: g.caption.lead, color: CREAM_SOFT }}
              >
                {item.label}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      style={{
        backgroundColor: VELVET,
        color: CREAM,
        paddingLeft: pad,
        paddingRight: pad,
        paddingTop: compact ? "14vh" : "16vh",
        paddingBottom: compact ? "10vh" : "12vh",
      }}
    >
      <h2
        className="m-0 font-editorial"
        style={{
          fontSize: g.lines.size,
          lineHeight: 1.04,
          letterSpacing: "-0.015em",
          color: CREAM,
          whiteSpace: "pre-line",
          maxWidth: compact ? "100%" : "60vw",
        }}
      >
        {LINES.a.before}
        {"\n"}
        {LINES.b.before}
        <span className="font-editorial-italic" style={{ color: GOLD }}>
          {LINES.b.verdict}
        </span>
        {LINES.b.after}
      </h2>

      {DESTINATIONS.map((destination) => (
        <article key={destination.id} style={{ paddingTop: compact ? "12vh" : "14vh" }}>
          <Address stage={stage} channel={destination.channel}>
            For {destination.name}.
          </Address>
          {row(destination.asks.map((ask) => ({ role: ask.role, label: ask.label })))}
        </article>
      ))}

      <article style={{ paddingTop: compact ? "12vh" : "14vh" }}>
        <Address stage={stage}>
          {PHOLIO.before}
          <Mark />
        </Address>
        {row(ROLES.map((role) => ({ role })))}
      </article>

      <p
        className="m-0 font-sans"
        style={{
          marginTop: compact ? "8vh" : "10vh",
          fontSize: g.disclosure.size,
          lineHeight: 1.45,
          color: CREAM_QUIET,
          maxWidth: compact ? "100%" : "52vw",
        }}
      >
        {DISCLOSURE}
      </p>
    </div>
  );
}
