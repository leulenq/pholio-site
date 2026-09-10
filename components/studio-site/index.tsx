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
  BAND_OPEN,
  CARD_ASPECT,
  CARD_BAND,
  CARD_BASE_W,
  CARD_FALLBACK,
  CARD_RADIUS_PX,
  CREAM,
  DRIVE_STOPS,
  END,
  GOLD_ON_PAPER,
  INK,
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
  push,
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

// ── Reading the card ──────────────────────────────────────────────────────

type CardRect = { cx: number; cy: number; w: number; h: number };

/**
 * The lead card's rest position: read off `[data-lead-card]` while the card
 * is at rest at the start of this beat, keyed to the frame it was read in;
 * the authored rest otherwise.
 */
function useCardRect(stage: StageKind, w: number, h: number) {
  const key = `${stage}:${w}x${h}`;
  const [measured, setMeasured] = useState<{ key: string; rect: CardRect } | null>(null);
  const fallback = CARD_FALLBACK[stage];
  const rect: CardRect =
    measured && measured.key === key
      ? measured.rect
      : { cx: fallback.cx * w, cy: h / 2 + fallback.dy, w: fallback.w, h: fallback.w / CARD_ASPECT };
  return { rect, key, setMeasured };
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
  const { rect: card, key: cardKey, setMeasured: setCard } = useCardRect(stage, w, h);

  // ── 1: the push, into the card ──
  //
  // The card's paper is a rounded rectangle in frame coordinates that grows
  // about the card's own centre. Expressed as a clip on a full-bleed sheet
  // of cream rather than as a scaled element, so nothing in the DOM is ever
  // at sixty times its size and the corners stay exact.
  const radius = CARD_RADIUS_PX * (card.w / CARD_BASE_W[stage]);
  const reach =
    Math.max(
      Math.max(card.cx, w - card.cx) / (card.w / 2),
      Math.max(card.cy, h - card.cy) / (card.h / 2),
    ) * 1.08;
  const bandH = card.h * CARD_BAND;
  const bandCy = card.cy - card.h / 2 + bandH / 2;
  const pushK = useTransform(smooth, [T.push[0], T.push[1]], [0, 1], { ease: push });
  const paperClip = useTransform(() => {
    const k = pushK.get();
    // The band opens down the card's face, then the whole card comes
    // toward us. One travel, two shapes, and the second begins exactly
    // where the first ends.
    let cy: number;
    let hw: number;
    let hh: number;
    let r: number;
    if (k < BAND_OPEN) {
      const u = k / BAND_OPEN;
      cy = lerp(bandCy, card.cy, u);
      hw = card.w / 2;
      hh = lerp(bandH, card.h, u) / 2;
      r = radius;
    } else {
      const s = lerp(1, reach, (k - BAND_OPEN) / (1 - BAND_OPEN));
      cy = card.cy;
      hw = (card.w / 2) * s;
      hh = (card.h / 2) * s;
      r = radius * s;
    }
    const top = cy - hh;
    const left = card.cx - hw;
    const right = w - (card.cx + hw);
    const bottom = h - (cy + hh);
    // Once every corner is off the frame there is no shape left to cut.
    if (top <= -r && left <= -r && right <= -r && bottom <= -r) return "none";
    return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${r.toFixed(1)}px)`;
  });

  // The mark, printed on the card, coming toward us with the paper and
  // settling into its place a little after the paper lands.
  const em = vwPx(WORDS.size[stage], w);
  const markWidth = markW ?? em * 4.6;
  const markLeft = (WORDS.right[stage] / 100) * w - markWidth;
  const markTop = (WORDS.axis[stage] / 100) * h - WORDS.capMid * em;
  const markScale0 = (card.w * WORDS.onCard) / markWidth;
  const markDx0 = card.cx - (markLeft + markWidth / 2);
  const markDy0 = bandCy - (markTop + em / 2);
  const markK = useTransform(smooth, [T.mark[0], T.mark[1]], [0, 1], { ease: push });
  const markTransform = useTransform(() => {
    const k = markK.get();
    const s = lerp(markScale0, 1, k);
    const dx = markDx0 * (1 - k);
    const dy = markDy0 * (1 - k);
    return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
  });

  // ── 2, 3: the plus, arriving along the axis, then opening ──
  const g = {
    cx: (WORDS.right[stage] / 100) * w + PLUS.after * em,
    cy: (WORDS.axis[stage] / 100) * h,
    l0: PLUS.halfLen * em,
    t0: PLUS.halfThick * em,
    reach: PLUS.reach * Math.hypot(w, h) + Math.max(w, h),
  };
  const plusIn = useTransform(smooth, [T.plusIn[0], T.plusIn[1]], [1, 0], { ease: arrive });
  const u = useTransform(smooth, [T.grow[0], T.grow[1]], [0, 1]);
  const halfLen = useTransform(u, [0, OPENING.armsEnd], [g.l0, g.reach], { ease: open });
  const halfThick = useTransform(u, [OPENING.widenStart, 1], [g.t0, g.reach], { ease: open });
  const rim = useTransform(u, [0, OPENING.hollowEnd], [g.t0, PLUS.rim], { ease: glide });
  const turn = useTransform(u, [OPENING.turn[0], OPENING.turn[1]], [0, OPENING.turnDegrees], { ease: glide });
  const plusCx = useTransform(() => g.cx + plusIn.get() * (w - g.cx + g.l0 * 2));
  const goldClip = useTransform(() => polygon(plusPoints(plusCx.get(), g.cy, halfLen.get(), halfThick.get(), turn.get())));
  const siteClip = useTransform(() => {
    if (u.get() >= 1) return "none";
    const r = rim.get();
    const l = halfLen.get() - r;
    const t = halfThick.get() - r;
    if (t <= 0) return "polygon(0px 0px, 0px 0px, 0px 0px)";
    return polygon(plusPoints(plusCx.get(), g.cy, l, t, turn.get()));
  });
  // Once the rim has left the frame the mark and the gold have no place left
  // to be; they are released while fully covered.
  const covered = useTransform(u, (v) => (v >= 1 ? "hidden" : "visible"));

  // ── Her masthead composes inside the opening ──
  const composeP = useTransform(smooth, [T.compose[0], T.compose[1]], [0, 1], { ease: glide });
  useMotionValueEvent(composeP, "change", (p) => intro(p));

  // ── 4: her page's scroll, from this page's scroll ──
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

  // ── 5: the step back, and the end ──
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

  // The header's stand-down marker, and the reading of the card. Both from
  // the scroll event itself, not from a motion value: the header measures
  // the marker in its own scroll handler, and the card is read from the
  // stage's own geometry rather than from the spring's opinion of it.
  const markerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const marker = markerRef.current;
    const section = marker?.closest("section");
    if (!marker || !section) return;
    // The card beat is spring smoothed, so the first frames after a jump
    // still show where the card was. A reading is accepted only after six
    // frames in a row agree, and only if it is near the authored rest: a
    // settled reading of the dealt row is not the card at rest.
    let readCard = false;
    let watching = 0;
    let last: DOMRect | null = null;
    let agreed = 0;
    let frames = 0;
    const near = (r: DOMRect) => {
      const fb = CARD_FALLBACK[stage];
      const cx = r.left + r.width / 2;
      return Math.abs(cx - fb.cx * w) < w * 0.2 && Math.abs(r.width - fb.w) < fb.w * 0.35;
    };
    const watch = () => {
      watching = 0;
      const el = document.querySelector<HTMLElement>("[data-lead-card]");
      const r = el?.getBoundingClientRect();
      if (!r || r.width < 40 || readCard || frames++ > 240) return;
      const still =
        !!last && Math.abs(last.top - r.top) < 0.5 && Math.abs(last.left - r.left) < 0.5 && Math.abs(last.width - r.width) < 0.5;
      agreed = still ? agreed + 1 : 0;
      if (agreed >= 6 && near(r)) {
        readCard = true;
        setCard({ key: cardKey, rect: { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height } });
        return;
      }
      last = r;
      watching = requestAnimationFrame(watch);
    };
    const place = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const stageP = travel > 0 ? -rect.top / travel : 0;
      const p = (stageP - CARD_FRACTION) / (1 - CARD_FRACTION);
      marker.style.top = p > TAKEOVER.start && p < TAKEOVER.end ? "0px" : "100vh";
      if (!readCard && !watching && p >= 0 && p < T.push[0] + 0.005) {
        last = null;
        agreed = 0;
        frames = 0;
        watching = requestAnimationFrame(watch);
      }
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(watching);
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [cardKey, setCard, stage, w]);

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

      {/* The card's paper, coming toward us until it is the frame, with the
          mark printed on it. One sheet, clipped to the card's own rounded
          rectangle; the clip is what travels. */}
      <motion.div
        className="absolute inset-0 z-[40]"
        style={{ clipPath: paperClip, backgroundColor: CREAM, willChange: "clip-path" }}
      >
        <h2 className="sr-only">{WORDS.label}</h2>
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
          }}
        >
          <Mark width={markWidth} size={em} />
        </motion.div>
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

      {/* The plus. Solid gold at rest, the serif's own cross; it arrives along
          the axis, and opens by hollowing to a rim that widens past the frame. */}
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
