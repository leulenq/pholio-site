"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

import { useMediaQuery } from "@/components/hero/useMediaQuery";

import {
  CREAM,
  DESTINATIONS,
  DISCLOSURE,
  FRAMES,
  GEOMETRY,
  GOLD_ON_PAPER,
  INK,
  INK_QUIET,
  INK_SOFT,
  ROLES,
  STAGE_VH,
  TIMELINE_SPRING,
  beatAt,
  fileName,
  placements,
  printProgress,
  wordsOffset,
  type Destination,
  type Placement,
  type Role,
  type StageKind,
} from "./motion";

/**
 * The application beat: one set of digitals, prepared for three agencies that
 * take applications somewhere other than Pholio. The idea, the data and the
 * geometry are in `./motion.ts`; this file draws them.
 *
 * Its own section, below the home stage, on the paper the stage ends on.
 * The server renders the still composition (three
 * destinations in a column); the scrubbed stage mounts after hydration for
 * anyone who has not asked for reduced motion (`lessons.md` §31.7).
 */

const noSubscribe = () => () => {};

/** The frame, in px. A safe guess until mounted. */
function useFrame() {
  const [frame, setFrame] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const read = () => setFrame({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return frame;
}

export default function PreparedFor() {
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stage: StageKind = useMediaQuery("(max-width: 767px)") ? "compact" : "wide";
  const still = !hydrated || reduced;

  return (
    <section
      aria-labelledby="prepared-for-line"
      className="relative w-full"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* The header stands down from here to the foot of the page. On the
          scrubbed page the Studio+ beat's marker already carries that; this
          one serves the still page, where that beat has no marker. */}
      <div
        aria-hidden
        data-footer-trigger
        className="pointer-events-none absolute left-0 top-0 h-px w-px"
      />

      <Headline stage={stage} />

      {still ? <StillBeats stage={stage} /> : <Stage stage={stage} />}

      <Disclosure stage={stage} />
    </section>
  );
}

/** The section's one line of prose, read before the scene runs. */
function Headline({ stage }: { stage: StageKind }) {
  const compact = stage === "compact";
  return (
    <div
      style={{
        paddingLeft: `${GEOMETRY[stage].margin * 100}vw`,
        paddingRight: `${GEOMETRY[stage].margin * 100}vw`,
        paddingTop: compact ? "16vh" : "18vh",
        paddingBottom: compact ? "10vh" : "12vh",
      }}
    >
      <h2
        id="prepared-for-line"
        className="m-0 font-editorial"
        style={{
          fontSize: compact ? "8.2vw" : "3.6vw",
          lineHeight: 1.08,
          letterSpacing: "-0.015em",
          color: INK,
          maxWidth: compact ? "100%" : "80vw",
        }}
      >
        Prepared the way each agency asks for it.
        <br />
        On Pholio or{" "}
        <span className="font-editorial-italic" style={{ color: GOLD_ON_PAPER }}>
          not
        </span>
        .
      </h2>
    </div>
  );
}

// ── The scrubbed stage ────────────────────────────────────────────────────

function Stage({ stage }: { stage: StageKind }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const { w, h } = useFrame();
  const g = GEOMETRY[stage];

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, TIMELINE_SPRING);

  const layouts = useMemo(
    () => DESTINATIONS.map((destination) => placements(destination, stage, w, h)),
    [stage, w, h],
  );

  // The address leaves through the top and the next arrives from it; the
  // words under the row leave through the bottom and arrive from it.
  const addressTravel = (g.address.top + 0.36) * h;
  const footTravel = h - (g.row.top * h + g.row.height * h) + 0.06 * h;

  return (
    <div ref={pinRef} className="relative" style={{ height: `${STAGE_VH[stage]}vh` }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {DESTINATIONS.map((destination, index) => (
          <Words
            key={destination.id}
            destination={destination}
            index={index}
            stage={stage}
            w={w}
            h={h}
            layout={layouts[index]}
            smooth={smooth}
            addressTravel={addressTravel}
            footTravel={footTravel}
          />
        ))}

        {ROLES.map((role) => (
          <Print key={role} role={role} layouts={layouts} smooth={smooth} />
        ))}

      </div>
    </div>
  );
}

/** One print, persistent across the three destinations. */
function Print({
  role,
  layouts,
  smooth,
}: {
  role: Role;
  layouts: Record<Role, Placement>[];
  smooth: MotionValue<number>;
}) {
  const frame = FRAMES[role];
  const first = layouts[0][role];

  const transform = useTransform(smooth, (p) => {
    const { index, move, t } = beatAt(p);
    const a = layouts[index][role];
    if (move === null) return `translate3d(${a.x}px, ${a.y}px, 0) scale(${a.scale})`;
    const b = layouts[index + 1][role];
    const from = DESTINATIONS[index];
    const to = DESTINATIONS[index + 1];
    const orderTo = to.asks.findIndex((ask) => ask.role === role);
    const orderFrom = from.asks.findIndex((ask) => ask.role === role);
    const order = orderTo >= 0 ? orderTo : orderFrom >= 0 ? orderFrom : 0;
    const count = Math.max(from.asks.length, to.asks.length);
    const k = printProgress(t, order, count);
    const x = a.x + (b.x - a.x) * k;
    const y = a.y + (b.y - a.y) * k;
    const s = a.scale + (b.scale - a.scale) * k;
    return `translate3d(${x}px, ${y}px, 0) scale(${s})`;
  });

  // A print on the move passes over the ones at rest.
  const zIndex = useTransform(smooth, (p) => {
    const { index, move } = beatAt(p);
    const a = layouts[index][role];
    if (move === null) return a.z;
    const b = layouts[index + 1][role];
    return a.x !== b.x || a.y !== b.y ? 20 : a.z;
  });

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        width: first.width,
        height: first.height,
        transform,
        zIndex,
        transformOrigin: "0 0",
        willChange: "transform",
      }}
    >
      <PrintFace role={role} sizes="(max-width: 767px) 30vw, 22vw" />
      <span className="sr-only">{frame.alt}</span>
    </motion.div>
  );
}

/** The photograph as a print: a hair of white stock around it. */
function PrintFace({ role, sizes }: { role: Role; sizes: string }) {
  const frame = FRAMES[role];
  return (
    <div
      className="relative h-full w-full"
      style={{ backgroundColor: "#ffffff", padding: 3, boxSizing: "border-box" }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={frame.src}
          alt=""
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/** A destination's words: the address at the top, the captions and the line beneath the row. */
function Words({
  destination,
  index,
  stage,
  w,
  h,
  layout,
  smooth,
  addressTravel,
  footTravel,
}: {
  destination: Destination;
  index: number;
  stage: StageKind;
  w: number;
  h: number;
  layout: Record<Role, Placement>;
  smooth: MotionValue<number>;
  addressTravel: number;
  footTravel: number;
}) {
  const g = GEOMETRY[stage];
  const compact = stage === "compact";

  const addressY = useTransform(smooth, (p) => -Math.abs(wordsOffset(p, index)) * addressTravel);
  const footY = useTransform(smooth, (p) => Math.abs(wordsOffset(p, index)) * footTravel);

  // The draft and the line sit where the geometry puts them, unless the row
  // and its captions run lower than that on a short frame; then they follow.
  const captionBand = g.caption.gap + g.caption.size * g.caption.lead * (compact ? 2 : 3) + 6;
  const rowBottom =
    Math.max(...destination.asks.map((ask) => layout[ask.role].y + layout[ask.role].height)) +
    captionBand;
  const draftLines = destination.draft?.length ?? 0;
  const draftHeight = draftLines * g.draft.size * 1.6;
  const draftTop = Math.max(g.draft.top * h, rowBottom + 0.035 * h);
  const footTop = destination.draft
    ? draftTop + draftHeight + (compact ? 0.035 : 0.045) * h
    : Math.max(g.foot.top * h, rowBottom + 0.045 * h);

  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 25 }}>
      <motion.div
        className="absolute"
        style={{
          left: `${g.margin * 100}vw`,
          top: `${g.address.top * 100}vh`,
          y: addressY,
          maxWidth: `${g.address.max * 100}vw`,
        }}
      >
        <p
          className="m-0 font-editorial"
          style={{
            fontSize: g.address.size,
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            color: INK,
            paddingBottom: "0.08em",
          }}
        >
          For {destination.name}.
        </p>
        <p
          className="m-0 font-mono uppercase"
          style={{
            marginTop: compact ? 8 : 12,
            fontSize: compact ? 10 : 11,
            letterSpacing: "0.14em",
            color: INK_QUIET,
          }}
        >
          Checked {destination.checked}
        </p>
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: footY }}>
        {destination.asks.map((ask) => {
          const place = layout[ask.role];
          return (
            <div
              key={ask.slot}
              className="absolute"
              style={{
                left: place.x,
                top: place.y + place.height + g.caption.gap,
                width: place.width + g.row.gap - 6,
              }}
            >
              <p
                className="m-0 font-sans"
                style={{
                  fontSize: g.caption.size,
                  lineHeight: g.caption.lead,
                  color: INK_SOFT,
                }}
              >
                {ask.label}
              </p>
              {!compact && (
                <p
                  className="m-0 font-mono"
                  style={{
                    marginTop: 2,
                    fontSize: g.caption.size - 2,
                    lineHeight: g.caption.lead,
                    color: INK_QUIET,
                    overflowWrap: "anywhere",
                  }}
                >
                  {fileName(destination, ask)}
                </p>
              )}
            </div>
          );
        })}

        {destination.draft && (
          <div
            className="absolute"
            style={{
              left: `${g.margin * 100}vw`,
              top: draftTop,
              maxWidth: compact ? `${(1 - g.margin * 2) * 100}vw` : "44vw",
            }}
          >
            {destination.draft.map((line) => (
              <p
                key={line}
                className="m-0 font-sans"
                style={{ fontSize: g.draft.size, lineHeight: 1.6, color: INK_SOFT }}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        <p
          className="absolute m-0 font-sans"
          style={{
            left: `${g.margin * 100}vw`,
            top: footTop,
            fontSize: g.foot.size,
            lineHeight: 1.45,
            color: INK,
            maxWidth: `${g.foot.max * 100}vw`,
          }}
        >
          {destination.foot}
        </p>
      </motion.div>
    </div>
  );
}

// ── The still composition ─────────────────────────────────────────────────

/** Three destinations in a column, each complete: what the scrubbed stage shows, laid out to be read. */
function StillBeats({ stage }: { stage: StageKind }) {
  const g = GEOMETRY[stage];
  const compact = stage === "compact";
  const printHeight = compact ? "22vh" : "30vh";

  return (
    <div
      style={{
        paddingLeft: `${g.margin * 100}vw`,
        paddingRight: `${g.margin * 100}vw`,
        paddingBottom: 0,
      }}
    >
      {DESTINATIONS.map((destination) => (
        <article key={destination.id} style={{ paddingBottom: compact ? "12vh" : "14vh" }}>
          <p
            className="m-0 font-editorial"
            style={{
              fontSize: g.address.size,
              lineHeight: 1.02,
              letterSpacing: "-0.015em",
              color: INK,
              maxWidth: `${g.address.max * 100}vw`,
            }}
          >
            For {destination.name}.
          </p>
          <p
            className="m-0 font-mono uppercase"
            style={{
              marginTop: compact ? 8 : 12,
              fontSize: compact ? 10 : 11,
              letterSpacing: "0.14em",
              color: INK_QUIET,
            }}
          >
            Checked {destination.checked}
          </p>

          <ul
            className="m-0 flex list-none flex-wrap p-0"
            style={{ marginTop: compact ? "5vh" : "7vh", gap: `${g.row.gap + 8}px ${g.row.gap}px` }}
          >
            {destination.asks.map((ask) => {
              const frame = FRAMES[ask.role];
              return (
                <li key={ask.slot} style={{ width: `calc(${printHeight} * ${frame.w / frame.h})` }}>
                  <div style={{ height: printHeight }}>
                    <PrintFace role={ask.role} sizes="(max-width: 767px) 30vw, 22vw" />
                  </div>
                  <p
                    className="m-0 font-sans"
                    style={{
                      marginTop: g.caption.gap,
                      fontSize: g.caption.size,
                      lineHeight: g.caption.lead,
                      color: INK_SOFT,
                    }}
                  >
                    {ask.label}
                  </p>
                  {!compact && (
                    <p
                      className="m-0 font-mono"
                      style={{
                        marginTop: 2,
                        fontSize: g.caption.size - 2,
                        lineHeight: g.caption.lead,
                        color: INK_QUIET,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {fileName(destination, ask)}
                    </p>
                  )}
                  <span className="sr-only">{frame.alt}</span>
                </li>
              );
            })}
          </ul>

          {destination.draft && (
            <div style={{ marginTop: compact ? "5vh" : "6vh", maxWidth: compact ? "100%" : "44vw" }}>
              {destination.draft.map((line) => (
                <p
                  key={line}
                  className="m-0 font-sans"
                  style={{ fontSize: g.draft.size, lineHeight: 1.6, color: INK_SOFT }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          <p
            className="m-0 font-sans"
            style={{
              marginTop: compact ? "4vh" : "5vh",
              fontSize: g.foot.size,
              lineHeight: 1.45,
              color: INK,
              maxWidth: `${g.foot.max * 100}vw`,
            }}
          >
            {destination.foot}
          </p>
        </article>
      ))}
    </div>
  );
}

/** Where the words came from, and what Pholio is not: small print under the scene, in flow. */
function Disclosure({ stage }: { stage: StageKind }) {
  const g = GEOMETRY[stage];
  return (
    <p
      className="m-0 font-sans"
      style={{
        paddingLeft: `${g.margin * 100}vw`,
        paddingRight: `${g.margin * 100}vw`,
        paddingTop: stage === "compact" ? "4vh" : "5vh",
        paddingBottom: stage === "compact" ? "9vh" : "10vh",
        fontSize: g.disclosure.size,
        lineHeight: 1.45,
        color: INK_QUIET,
        maxWidth: stage === "compact" ? "100%" : "64vw",
      }}
    >
      {DISCLOSURE}
    </p>
  );
}
