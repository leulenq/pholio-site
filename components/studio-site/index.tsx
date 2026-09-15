"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { APPLY_FRACTION } from "@/components/hero/motion";
import { useMediaQuery } from "@/components/hero/useMediaQuery";

import {
  CREAM,
  DRIVE_STOPS,
  CLOSE,
  FACE,
  GOLD_ON_PAPER,
  INK,
  OPENING,
  PLUS,
  SITE_PAPER,
  T,
  TAKEOVER,
  TIMELINE_SPRING,
  WORDS,
  arrive,
  clamp01,
  closeLayout,
  exposureAt,
  inTheRoom,
  driveTargets,
  glide,
  open,
  plusPoints,
  polygon,
  type CloseLayout,
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
function useMarkWidth(stage: StageKind, w: number, size: string = WORDS.size[stage]) {
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
  }, [stage, w, size]);

  const measurer = (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap font-editorial"
      style={{ fontSize: size, lineHeight: 1, letterSpacing: WORDS.tracking }}
    >
      {WORDS.name}
    </span>
  );

  return { width, measurer };
}

// ── The close ─────────────────────────────────────────────────────────────

/** The set line's width in em, read off the face once it is in hand. */
function useTitleEm() {
  const ref = useRef<HTMLSpanElement>(null);
  const [em, setEm] = useState(8.1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const measure = () => {
      if (!cancelled) setEm(el.getBoundingClientRect().width / 100);
    };
    if (document.fonts?.ready) document.fonts.ready.then(measure, measure);
    else measure();
    return () => {
      cancelled = true;
    };
  }, []);
  const measurer = (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
    >
      <TitleText size={100} />
    </span>
  );
  return { em, measurer };
}

function TitleText({ size }: { size: number }) {
  return (
    <span className="font-editorial whitespace-nowrap" style={{ fontSize: size, lineHeight: 1, letterSpacing: "0" }}>
      {CLOSE.before}
      <span className="font-editorial-italic" style={{ color: GOLD_ON_PAPER, letterSpacing: "0" }}>
        {CLOSE.verdict}
      </span>
      {CLOSE.after}
    </span>
  );
}

/** The masthead: the line, standing on her site's top edge. */
function CloseTitle({ layout }: { layout: CloseLayout }) {
  const { title } = layout;
  return (
    <h2
      className="absolute m-0 whitespace-nowrap"
      style={{ left: title.x, top: title.baseline - FACE.baseline * title.size, color: INK, lineHeight: 1 }}
    >
      <TitleText size={title.size} />
    </h2>
  );
}

/**
 * The action, pinned to her site. The Studio+ cross is centred on the site's
 * bottom-right corner — the cross that opened onto her page, now the thing
 * that opens it. The text CTA is removed to avoid marketing clutter.
 * On hover the cross turns a quarter, the way it turned as it opened.
 */
function CloseAction({ layout }: { layout: CloseLayout }) {
  const { size, corner } = layout.action;
  const arm = size * 1.5;
  const bar = Math.max(1.5, size * 0.085);
  const hit = Math.max(44, arm * 1.5);
  return (
    <a
      href={SITE_URL}
      target="_blank"
      rel="noopener"
      aria-label={CLOSE.open}
      className="group pointer-events-auto absolute flex items-center justify-center outline-none"
      style={{
        left: corner.x - hit / 2,
        top: corner.y - hit / 2,
        width: hit,
        height: hit,
      }}
    >
      <span
        aria-hidden
        className="relative block transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-90 group-focus-visible:rotate-90"
        style={{ width: arm, height: arm }}
      >
        <span className="absolute left-0 top-1/2 w-full -translate-y-1/2" style={{ height: bar, backgroundColor: GOLD_ON_PAPER }} />
        <span className="absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ width: bar, backgroundColor: GOLD_ON_PAPER }} />
      </span>
    </a>
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

  // ── The mark, in the room ──
  //
  // It does not move. It stands on the paper for the whole
  // beat, lit by the same light as the paper, so in the dark room it is black
  // on black and the room's light is what shows it (`lessons.md` §36). It is
  // off the stage entirely until the light begins, so it paints nothing over
  // the beats above this one (§34).
  const em = vwPx(WORDS.size[stage], w);
  const markWidth = markW ?? em * 4.6;
  const markLeft = (WORDS.right[stage] / 100) * w - markWidth;
  const markTop = (WORDS.axis[stage] / 100) * h - WORDS.capMid * em;
  const plusCx = (WORDS.right[stage] / 100) * w + PLUS.after * em;
  const plusCy = (WORDS.axis[stage] / 100) * h;
  const g = {
    l0: PLUS.halfLen * em,
    t0: PLUS.halfThick * em,
    reach: PLUS.reach * Math.hypot(w, h) + Math.max(w, h),
  };
  const lit = useTransform(smooth, (p) => `brightness(${exposureAt(p).toFixed(4)})`);

  // ── The plus, opening ──
  const u = useTransform(smooth, [T.grow[0], T.grow[1]], [0, 1]);
  const halfLen = useTransform(u, [0, OPENING.armsEnd], [g.l0, g.reach], { ease: open });
  const halfThick = useTransform(u, [OPENING.widenStart, 1], [g.t0, g.reach], { ease: open });
  const rim = useTransform(u, [0, OPENING.hollowEnd], [g.t0, PLUS.rim], { ease: glide });
  const turn = useTransform(u, [OPENING.turn[0], OPENING.turn[1]], [0, OPENING.turnDegrees], { ease: glide });
  const goldClip = useTransform(() =>
    polygon(plusPoints(plusCx, plusCy, halfLen.get(), halfThick.get(), turn.get())),
  );
  const siteClip = useTransform(() => {
    if (u.get() >= 1) return "none";
    const r = rim.get();
    const l = halfLen.get() - r;
    const t = halfThick.get() - r;
    if (t <= 0) return "polygon(0px 0px, 0px 0px, 0px 0px)";
    return polygon(plusPoints(plusCx, plusCy, l, t, turn.get()));
  });
  // Once the rim has left the frame the mark and the gold have no place left
  // to be; they are released while fully covered.
  const shown = useTransform(smooth, (p) =>
    inTheRoom(p) && p < T.grow[1] ? "visible" : "hidden",
  );

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
  const { em: titleEm, measurer: titleMeasurer } = useTitleEm();
  const layout = closeLayout(stage, w, h, titleEm);
  const win = layout.window;
  const siteScale = useTransform(smooth, [T.stepBack[0], T.stepBack[1]], [1, win.scale], { ease: glide });
  const siteXs = useTransform(smooth, [T.stepBack[0], T.stepBack[1]], [0, win.x], { ease: glide });
  const siteYs = useTransform(smooth, [T.stepBack[0], T.stepBack[1]], [0, win.y], { ease: glide });
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
      const p = (stageP - APPLY_FRACTION) / (1 - APPLY_FRACTION);
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

      {/* The word, on the paper, lit with the room. */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          left: markLeft,
          top: markTop,
          width: markWidth,
          height: em,
          filter: lit,
          visibility: shown,
          zIndex: 41,
        }}
      >
        <Mark width={markWidth} size={em} />
      </motion.div>

      {titleMeasurer}
      {/* The masthead, standing on her site's top edge. It travels in from
          below the frame as her site steps back into place. */}
      <motion.div
        className="absolute inset-0 z-[41]"
        style={{ y: endY, willChange: "transform" }}
      >
        <CloseTitle layout={layout} />
      </motion.div>

      {/* The plus. The word's own cross, lit with it; it opens by hollowing
          to a rim that widens past the frame. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[42] h-[100dvh] w-[100vw]"
        style={{
          clipPath: goldClip,
          filter: lit,
          visibility: shown,
          backgroundColor: GOLD_ON_PAPER,
          willChange: "clip-path",
        }}
      />

      {/* The action, over her site's corner, with the masthead's travel. */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[44]"
        style={{ y: endY, willChange: "transform" }}
      >
        <CloseAction layout={layout} />
      </motion.div>

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
 * For when the stage is not scrubbing: the mark at rest on paper, then the
 * closing composition with her page live in its window.
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
  const { em: titleEm, measurer: titleMeasurer } = useTitleEm();
  const close = closeLayout(stage, w, h, titleEm);
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
      <div className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
        <div
          className="absolute left-0 top-0 h-[100vh] w-[100vw] origin-top-left overflow-hidden"
          style={{
            transform: `translate(${close.window.x}px, ${close.window.y}px) scale(${close.window.scale})`,
            backgroundColor: SITE_PAPER,
            zIndex: 2,
          }}
        >
          <iframe
            src={SITE_EMBED_URL}
            title={SITE_TITLE}
            className="block h-full w-full border-0"
            style={{ backgroundColor: SITE_PAPER }}
            loading="lazy"
          />
        </div>
        {titleMeasurer}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <CloseTitle layout={close} />
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 3 }}>
          <CloseAction layout={close} />
        </div>
      </div>
    </section>
  );
}
