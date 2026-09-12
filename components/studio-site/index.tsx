"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { CARD_FRACTION } from "@/components/hero/motion";
import { useMediaQuery } from "@/components/hero/useMediaQuery";

import {
  CREAM,
  DRIVE_STOPS,
  END,
  GOLD_ON_PAPER,
  INK,
  LOCK,
  OPENING,
  PLUS,
  SITE_PAPER,
  T,
  TAKEOVER,
  TIMELINE_SPRING,
  WINDOW,
  WORDS,
  arrive,
  clamp01,
  driveTargets,
  glide,
  lerp,
  open,
  plusPoints,
  polygon,
  type StageKind,
} from "./motion";
import { useSiteFrame } from "./useSiteFrame";

/** Her site's address, and the framed copy of it. */
export const SITE_URL = "/zofia";
const SITE_EMBED_URL = "/zofia/index.html?embed";
const SITE_TITLE = "Zofia Nowicka, fashion model, Warsaw. A Studio+ site.";
const SERIF = "var(--font-serif)";

function useStageKind(): StageKind {
  return useMediaQuery("(max-width: 767px)") ? "compact" : "wide";
}

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

const vh = (v: number) => `${v}vh`;
const vwPx = (s: string, w: number) => (parseFloat(s) / 100) * w;

// ── Measuring the mark ────────────────────────────────────────────────────

/**
 * The mark's set width, off a hidden copy once the face is in hand. Set as
 * one word rather than as letters: nothing in this beat moves a letter on
 * its own any more, so the mark is one object.
 */
function useMarkWidth(stage: StageKind, w: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const measure = () => {
      if (!cancelled) setWidth(el.getBoundingClientRect().width);
    };
    if (document.fonts?.ready) document.fonts.ready.then(measure, measure);
    else measure();
    return () => {
      cancelled = true;
    };
  }, [stage, w]);

  const measurer = (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap font-editorial"
      style={{ fontSize: WORDS.size[stage], lineHeight: 1, letterSpacing: WORDS.tracking }}
    >
      {WORDS.name}
    </span>
  );

  return { width, measurer };
}

// ── The end ───────────────────────────────────────────────────────────────

function End({ stage, className, style }: { stage: StageKind; className?: string; style?: CSSProperties }) {
  const compact = stage === "compact";
  return (
    <div className={className} style={{ color: INK, ...style }}>
      <h2
        className={`font-editorial ${
          compact ? "text-[clamp(2rem,8.6vw,2.6rem)]" : "text-[clamp(2.4rem,4.6vw,4rem)]"
        }`}
      >
        {END.head[0]}
        <span className="font-editorial-italic" style={{ color: GOLD_ON_PAPER }}>
          {END.head[1]}
        </span>
        {END.head[2]}
      </h2>
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener"
        className={`${compact ? "mt-5 text-[0.92rem]" : "mt-8 text-[1rem]"} inline-block border-b pb-[3px] font-sans transition-colors duration-300`}
        style={{ borderColor: GOLD_ON_PAPER }}
      >
        {END.open}
      </a>
    </div>
  );
}

// ── The mark ──────────────────────────────────────────────────────────────

/**
 * STUDIO, cut from the fabric. SVG text with a pattern fill rather than a
 * clipped background: the pattern travels with the glyphs under any
 * transform in every engine, where a clipped background does not — Firefox
 * drops the fill on the letters that move furthest.
 */
function Mark({ width, size }: { width: number; size: number }) {
  const id = useId();
  return (
    <svg width={width} height={size} viewBox={`0 0 ${width} ${size}`} overflow="visible" className="block">
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" x={0} y={0} width={width} height={size}>
          <rect width={width} height={size} fill={WORDS.fillUnder} />
          <image href={WORDS.fill} x={0} y={0} width={width} height={size} preserveAspectRatio="xMidYMid slice" />
        </pattern>
      </defs>
      <text
        x={width}
        y={WORDS.baseline * size}
        textAnchor="end"
        fontSize={size}
        fontFamily={SERIF}
        letterSpacing={WORDS.tracking}
        fill={`url(#${id})`}
      >
        {WORDS.name}
      </text>
    </svg>
  );
}

// ── The scene ─────────────────────────────────────────────────────────────

/**
 * The Studio+ beat's layers, with no section and no sticky of its own.
 *
 * Renders inside the home stage's single pinned container, above the card
 * beat, so the push can begin from the card itself with no unpin between
 * them (`lessons.md` §20). The keyframes and the copy are in `./motion.ts`;
 * every layer reads one spring-smoothed copy of the timeline.
 */
export function StudioSiteLayers({
  progress,
  armed = true,
}: {
  progress: MotionValue<number>;
  /** Mount the frame early, while the card beat still has the stage, so her
      page is loaded before the plus opens on it. Set with the card assets. */
  armed?: boolean;
}) {
  const stage = useStageKind();
  const { w, h } = useFrame();
  const smooth = useSpring(progress, TIMELINE_SPRING);
  const { ref, marks, marksRef, scrollTo, intro, requestMarks } = useSiteFrame();
  const { width: markW, measurer } = useMarkWidth(stage, w);

  // ── The mark, as one object ──
  //
  // Where the word sits, where the plus sits, and the centre of the two
  // together. Everything in the arrival is expressed about that centre, so
  // the plus cannot drift off the word on the way in: one scale, one
  // translation, one object.
  const em = vwPx(WORDS.size[stage], w);
  const markWidth = markW ?? em * 4.6;
  const markLeft = (WORDS.right[stage] / 100) * w - markWidth;
  const markTop = (WORDS.axis[stage] / 100) * h - WORDS.capMid * em;
  const axis = (WORDS.axis[stage] / 100) * h;
  const plusCxRest = (WORDS.right[stage] / 100) * w + PLUS.after * em;
  const g = {
    l0: PLUS.halfLen * em,
    t0: PLUS.halfThick * em,
    reach: PLUS.reach * Math.hypot(w, h) + Math.max(w, h),
  };
  /** The lockup's own centre: the word's left edge to the plus's right. */
  const lockCx = (markLeft + plusCxRest + g.l0) / 2;

  // ── 1: the arrival ──
  //
  // Thrown up into the frame by the same scroll that is sending the card out
  // above it, and further away than the card is, so it travels a third as
  // far and changes size a tenth as much (`lessons.md` §27.2, and LOCK).
  const lock = LOCK[stage];
  const lockK = useTransform(smooth, [T.lock[0], T.lock[1]], [0, 1], { ease: arrive });
  const lockScale = useTransform(lockK, (k) => lerp(lock.scale, 1, k));
  const lockDy = useTransform(lockK, (k) => (1 - k) * (lock.rise / 100) * h);

  // The word's own box scales about its own centre, so its translation
  // carries the difference between that centre and the lockup's.
  const markTransform = useTransform(() => {
    const s = lockScale.get();
    const dx = (lockCx - (markLeft + markWidth / 2)) * (1 - s);
    const dy = lockDy.get();
    return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
  });

  // ── 2: the plus, opening ──
  //
  // The same affine map as the word, applied to the plus's geometry rather
  // than to a box: its centre and its half-lengths are read through the
  // arrival, which is the identity by the time the opening starts.
  const u = useTransform(smooth, [T.grow[0], T.grow[1]], [0, 1]);
  const halfLen = useTransform(u, [0, OPENING.armsEnd], [g.l0, g.reach], { ease: open });
  const halfThick = useTransform(u, [OPENING.widenStart, 1], [g.t0, g.reach], { ease: open });
  const rim = useTransform(u, [0, OPENING.hollowEnd], [g.t0, PLUS.rim], { ease: glide });
  const turn = useTransform(u, [OPENING.turn[0], OPENING.turn[1]], [0, OPENING.turnDegrees], { ease: glide });
  const plusCx = useTransform(() => lockCx + (plusCxRest - lockCx) * lockScale.get());
  const plusCy = useTransform(() => axis + lockDy.get());
  const goldClip = useTransform(() => {
    const s = lockScale.get();
    return polygon(plusPoints(plusCx.get(), plusCy.get(), halfLen.get() * s, halfThick.get() * s, turn.get()));
  });
  const siteClip = useTransform(() => {
    if (u.get() >= 1) return "none";
    const s = lockScale.get();
    const r = rim.get();
    const l = halfLen.get() * s - r;
    const t = halfThick.get() * s - r;
    if (t <= 0) return "polygon(0px 0px, 0px 0px, 0px 0px)";
    return polygon(plusPoints(plusCx.get(), plusCy.get(), l, t, turn.get()));
  });
  // Once the rim has left the frame the mark and the gold have no place left
  // to be; they are released while fully covered.
  const covered = useTransform(u, (v) => (v >= 1 ? "hidden" : "visible"));

  // ── Her masthead composes inside the opening ──
  const composeP = useTransform(smooth, [T.compose[0], T.compose[1]], [0, 1], { ease: glide });
  useMotionValueEvent(composeP, "change", (p) => intro(p));

  // ── 3: her page's scroll, from this page's scroll ──
  const siteY = useTransform(smooth, (p) => {
    const m = marksRef.current;
    if (!m) return 0;
    const k = clamp01((p - T.walk[0]) / (T.walk[1] - T.walk[0]));
    const targets = driveTargets(m);
    for (let i = 1; i < DRIVE_STOPS.length; i += 1) {
      if (k <= DRIVE_STOPS[i]) {
        const from = DRIVE_STOPS[i - 1];
        const q = (k - from) / (DRIVE_STOPS[i] - from);
        return targets[i - 1] + (targets[i] - targets[i - 1]) * q;
      }
    }
    return targets[targets.length - 1];
  });
  useMotionValueEvent(siteY, "change", (v) => scrollTo(v));
  useEffect(() => {
    if (marks) {
      scrollTo(siteY.get());
      intro(composeP.get());
    }
  }, [marks, scrollTo, intro, siteY, composeP]);

  // ── 4: the step back, and the end ──
  const win = WINDOW[stage];
  const siteScale = useTransform(smooth, [T.stepBack[0], T.stepBack[1]], [1, win.scale], { ease: glide });
  const siteX = useTransform(smooth, [T.stepBack[0], T.stepBack[1]], [0, win.x], { ease: glide });
  const backVh = useTransform(smooth, [T.stepBack[0], T.stepBack[1]], [0, win.y], { ease: glide });
  const siteXs = useTransform(siteX, (v) => `${v}vw`);
  const siteYs = useTransform(backVh, vh);
  const endTravel = useTransform(smooth, [T.end[0], T.end[1]], [100, 0], { ease: arrive });
  const endY = useTransform(endTravel, vh);

  // The visitor's pointer reaches her page only in the window, where it is
  // hers to scroll; while the page is composed and walked, the stage owns it.
  const pointer = useTransform(smooth, (p) => (p >= T.stepBack[1] ? "auto" : "none"));

  // The header's stand-down marker, from the scroll event itself rather than
  // from a motion value: the header measures the marker in its own scroll
  // handler, so the marker is placed from the stage's own geometry.
  const markerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const marker = markerRef.current;
    const section = marker?.closest("section");
    if (!marker || !section) return;
    const place = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const stageP = travel > 0 ? -rect.top / travel : 0;
      const p = (stageP - CARD_FRACTION) / (1 - CARD_FRACTION);
      marker.style.top = p > TAKEOVER.start && p < TAKEOVER.end ? "0px" : "100vh";
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <>
      <div
        ref={markerRef}
        aria-hidden
        data-footer-trigger
        className="pointer-events-none absolute left-0 h-px w-px"
        style={{ top: "100vh" }}
      />

      {measurer}
      <h2 className="sr-only">{WORDS.label}</h2>

      {/* The word. Travelling in from under the frame with the plus, on one
          transform about the lockup's centre. */}
      <motion.div
        aria-hidden
        className="absolute origin-center"
        style={{
          left: markLeft,
          top: markTop,
          width: markWidth,
          height: em,
          transform: markTransform,
          visibility: covered,
          willChange: "transform",
          zIndex: 41,
        }}
      >
        <Mark width={markWidth} size={em} />
      </motion.div>

      {/* The end, on the paper beside the window. */}
      <motion.div
        className={
          stage === "compact"
            ? "absolute inset-x-0 top-[60vh] z-[41] px-6"
            : "absolute left-[7%] top-1/2 z-[41] w-[min(34vw,32rem)] -translate-y-1/2"
        }
        style={{ y: endY, willChange: "transform" }}
      >
        <div className="pointer-events-auto">
          <End stage={stage} />
        </div>
      </motion.div>

      {/* The plus. The word's own cross, arriving with it and never before
          it; it opens by hollowing to a rim that widens past the frame. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[42] h-[100dvh] w-[100vw]"
        style={{ clipPath: goldClip, visibility: covered, backgroundColor: GOLD_ON_PAPER, willChange: "clip-path" }}
      />

      {/* Her site, inside the plus. A full viewport of her paper, clipped
          to the opening; the document inside it is the real /zofia, and its
          own intro is scrubbed by this scroll as the plus opens. */}
      <motion.div
        className="absolute left-0 top-0 z-[43] h-[100dvh] w-[100vw] origin-top-left"
        style={{
          x: siteXs,
          y: siteYs,
          scale: siteScale,
          clipPath: siteClip,
          pointerEvents: pointer,
          backgroundColor: SITE_PAPER,
          willChange: "transform, clip-path",
        }}
      >
        {armed ? (
          <iframe
            ref={ref}
            src={SITE_EMBED_URL}
            title={SITE_TITLE}
            onLoad={requestMarks}
            className="block h-full w-full border-0"
            style={{ backgroundColor: SITE_PAPER }}
          />
        ) : null}
      </motion.div>
    </>
  );
}

// ── The still composition ─────────────────────────────────────────────────

/**
 * For when the stage is not scrubbing: the mark at rest on paper, then her
 * page live in a window, and the end.
 */
export function StaticStudioSite() {
  const stage = useStageKind();
  const compact = stage === "compact";
  const { w, h } = useFrame();
  const { width: markW, measurer } = useMarkWidth(stage, w);
  const em = vwPx(WORDS.size[stage], w);
  const markWidth = markW ?? em * 4.6;
  const cx = (WORDS.right[stage] / 100) * w + PLUS.after * em;
  const cy = (WORDS.axis[stage] / 100) * h;
  const rest = polygon(plusPoints(cx, cy, PLUS.halfLen * em, PLUS.halfThick * em, 0));
  return (
    <section aria-label="Studio+" className="relative w-full" style={{ backgroundColor: CREAM, color: INK }}>
      {measurer}
      <div className="relative w-full overflow-hidden" style={{ height: compact ? "70vh" : "90vh" }}>
        <h2 className="sr-only">{WORDS.label}</h2>
        <div
          aria-hidden
          className="absolute"
          style={{ left: (WORDS.right[stage] / 100) * w - markWidth, top: cy - WORDS.capMid * em }}
        >
          <Mark width={markWidth} size={em} />
        </div>
        <div aria-hidden className="absolute left-0 top-0 h-[100vh] w-[100vw]" style={{ clipPath: rest, backgroundColor: GOLD_ON_PAPER }} />
      </div>
      <div className="px-6 pb-[12vh] pt-[4vh] md:px-12">
        <div className={`mx-auto flex max-w-[1440px] ${compact ? "flex-col gap-10" : "flex-row items-center gap-[6vw]"}`}>
          <End stage={stage} className={compact ? "" : "w-[34%] shrink-0"} />
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: compact ? "390 / 700" : "16 / 10", backgroundColor: SITE_PAPER }}
          >
            <iframe
              src={SITE_EMBED_URL}
              title={SITE_TITLE}
              className="absolute inset-0 block h-full w-full border-0"
              style={{ backgroundColor: SITE_PAPER }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
