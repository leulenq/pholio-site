"use client";

import { useEffect, useRef, type CSSProperties } from "react";
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
  CLOSE,
  DRIVE_STOPS,
  GOLD_ON_PAPER,
  INK,
  LINES,
  PAPER,
  SITE,
  SITE_PAPER,
  T,
  TAKEOVER,
  TIMELINE_SPRING,
  WORD,
  arrive,
  driveTargets,
  glide,
  type StageKind,
} from "./motion";
import { useSiteFrame } from "./useSiteFrame";

/** Her site's address, and the framed copy of it. */
export const SITE_URL = "/zofia";
const SITE_EMBED_URL = "/zofia/index.html?embed";
const SITE_TITLE = "Zofia Nowicka, fashion model, Warsaw. A Studio+ site.";

function useStageKind(): StageKind {
  return useMediaQuery("(max-width: 767px)") ? "compact" : "wide";
}

// ── The word ──────────────────────────────────────────────────────────────

/** "Studio" in ink, the plus in the gold that holds on paper. */
function Word({ stage }: { stage: StageKind }) {
  return (
    <div
      className="flex items-baseline justify-center whitespace-nowrap font-editorial leading-none tracking-[-0.03em]"
      style={{ fontSize: WORD.size[stage], color: INK }}
    >
      <span>{WORD.text}</span>
      <span style={{ color: GOLD_ON_PAPER, marginLeft: "0.02em" }}>{WORD.mark}</span>
    </div>
  );
}

// ── The lines ─────────────────────────────────────────────────────────────

function Lines({ stage }: { stage: StageKind }) {
  const compact = stage === "compact";
  return (
    <div
      className={`mx-auto text-center font-editorial ${
        compact ? "max-w-[22rem] text-[clamp(1.3rem,5vw,1.7rem)]" : "max-w-[66rem] text-[clamp(1.9rem,3vw,2.6rem)]"
      }`}
      style={{ color: INK, lineHeight: 1.18, textWrap: "balance" }}
    >
      <p>{LINES.first}</p>
      <p>
        {LINES.second[0]}
        <span className="font-editorial-italic" style={{ color: GOLD_ON_PAPER }}>
          {LINES.second[1]}
        </span>
        {LINES.second[2]}
      </p>
    </div>
  );
}

// ── The close ─────────────────────────────────────────────────────────────

function Close({ stage, className, style }: { stage: StageKind; className?: string; style?: CSSProperties }) {
  const compact = stage === "compact";
  return (
    <div className={className} style={{ color: INK, ...style }}>
      <h2
        className={`font-editorial ${
          compact ? "text-[clamp(2rem,8.6vw,2.6rem)]" : "text-[clamp(2.4rem,4.6vw,4rem)]"
        }`}
      >
        {CLOSE.head[0]}
        <span className="font-editorial-italic" style={{ color: GOLD_ON_PAPER }}>
          {CLOSE.head[1]}
        </span>
        {CLOSE.head[2]}
      </h2>
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener"
        className={`${compact ? "mt-5 text-[0.92rem]" : "mt-8 text-[1rem]"} inline-block border-b pb-[3px] font-sans transition-colors duration-300`}
        style={{ borderColor: GOLD_ON_PAPER }}
      >
        {CLOSE.open}
      </a>
    </div>
  );
}

// ── The scene ─────────────────────────────────────────────────────────────

/**
 * The Studio+ beat's layers, with no section and no sticky of its own.
 *
 * Renders inside the home stage's single pinned container, above the card
 * beat, so the word rises over the card's close and the light covers it
 * with no unpin between them (`lessons.md` §20). The keyframes and the copy
 * are in `./motion.ts`; every layer reads one spring-smoothed copy of the
 * timeline.
 */
export function StudioSiteLayers({
  progress,
  armed = true,
}: {
  progress: MotionValue<number>;
  /** Mount the frame early, while the card beat still has the stage, so her
      page is loaded before it is asked to appear. Set with the card assets. */
  armed?: boolean;
}) {
  const stage = useStageKind();
  const smooth = useSpring(progress, TIMELINE_SPRING);
  const { ref, marks, marksRef, scrollTo, requestMarks } = useSiteFrame();
  const vh = (v: number) => `${v}vh`;

  // ── 1: the light, with the word at its head ──
  // The word's travel is the light's travel, keyframe for keyframe, until
  // it leaves on its own: printed on the paper, never over the velvet.
  const lightTravel = useTransform(smooth, [T.light[0], T.light[1]], [100, 0], { ease: arrive });
  const lightY = useTransform(lightTravel, vh);
  const wordTravel = useTransform(
    smooth,
    [T.light[0], T.light[1], T.introOut[0], T.introOut[1]],
    [100, 0, 0, -120],
    { ease: [arrive, glide, glide] },
  );
  const wordY = useTransform(wordTravel, vh);

  // ── 2: the lines ──
  const linesTravel = useTransform(
    smooth,
    [T.lines[0], T.lines[1], T.introOut[0], T.introOut[1]],
    [100, 0, 0, -120],
    { ease: [arrive, glide, glide] },
  );
  const linesY = useTransform(linesTravel, vh);

  // ── 3, 5: the site, arriving small, entered, stepped back ──
  const a = SITE.arrived[stage];
  const w = SITE.window[stage];
  const siteStops = [T.siteIn[0], T.siteIn[1], T.approach[0], T.approach[1], T.stepBack[0], T.stepBack[1]];
  const siteScale = useTransform(smooth, siteStops, [a.scale, a.scale, a.scale, 1, 1, w.scale], {
    ease: [glide, glide, glide, glide, glide],
  });
  const siteX = useTransform(smooth, siteStops, [a.x, a.x, a.x, 0, 0, w.x], {
    ease: [glide, glide, glide, glide, glide],
  });
  // Arrives from below the frame: its own top starts a viewport down.
  const siteYv = useTransform(smooth, siteStops, [100 + a.y, a.y, a.y, 0, 0, w.y], {
    ease: [arrive, glide, glide, glide, glide],
  });
  const siteXs = useTransform(siteX, (v) => `${v}vw`);
  const siteYs = useTransform(siteYv, vh);

  // ── 4: her page's scroll, from this page's scroll ──
  const siteY = useTransform(smooth, (p) => {
    const m = marksRef.current;
    if (!m) return 0;
    const u = Math.min(1, Math.max(0, (p - T.walk[0]) / (T.walk[1] - T.walk[0])));
    const targets = driveTargets(m);
    for (let i = 1; i < DRIVE_STOPS.length; i += 1) {
      if (u <= DRIVE_STOPS[i]) {
        const from = DRIVE_STOPS[i - 1];
        const k = (u - from) / (DRIVE_STOPS[i] - from);
        return targets[i - 1] + (targets[i] - targets[i - 1]) * k;
      }
    }
    return targets[targets.length - 1];
  });
  useMotionValueEvent(siteY, "change", (v) => scrollTo(v));
  useEffect(() => {
    if (marks) scrollTo(siteY.get());
  }, [marks, scrollTo, siteY]);

  // The visitor's pointer reaches her page only in the window, where it is
  // hers to scroll; while the site is entered and walked, the stage owns it.
  const pointer = useTransform(smooth, (p) => (p >= T.stepBack[1] ? "auto" : "none"));

  // ── 5: the close ──
  const closeTravel = useTransform(smooth, [T.close[0], T.close[1]], [100, 0], { ease: arrive });
  const closeY = useTransform(closeTravel, vh);

  // The header's stand-down marker. See TAKEOVER in ./motion.ts.
  //
  // Placed from the scroll event itself, not from a motion value: the header
  // measures the marker in its own scroll handler, and a motion value lands
  // on the element a frame later, so the last event of a flick that crossed
  // the takeover line would find the marker still where it was. This is a
  // state flag read from the stage's own geometry, not an animation.
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

      {/* The light. Opaque paper, risen from below. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[40]"
        style={{ y: lightY, backgroundColor: PAPER, willChange: "transform" }}
      />

      {/* The word, riding the light. */}
      <motion.div
        className="absolute inset-x-0 z-[41] flex justify-center px-6"
        style={{ top: vh(WORD.top[stage]), y: wordY, translateY: "-50%", willChange: "transform" }}
      >
        <Word stage={stage} />
      </motion.div>

      {/* The lines. */}
      <motion.div
        className="absolute inset-x-0 z-[41] px-6"
        style={{ top: vh(LINES.top[stage]), y: linesY, willChange: "transform" }}
      >
        <Lines stage={stage} />
      </motion.div>

      {/* The closing copy, on the paper beside the window. */}
      <motion.div
        className={
          stage === "compact"
            ? "absolute inset-x-0 top-[60vh] z-[43] px-6"
            : "absolute left-[7%] top-1/2 z-[43] w-[min(34vw,32rem)] -translate-y-1/2"
        }
        style={{ y: closeY, willChange: "transform" }}
      >
        <div className="pointer-events-auto">
          <Close stage={stage} />
        </div>
      </motion.div>

      {/* Her site. A full viewport of her paper, moved and scaled as one
          object; the document inside it is the real /zofia. */}
      <motion.div
        className="absolute left-0 top-0 z-[44] h-[100dvh] w-[100vw] origin-top-left"
        style={{
          x: siteXs,
          y: siteYs,
          scale: siteScale,
          pointerEvents: pointer,
          backgroundColor: SITE_PAPER,
          willChange: "transform",
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
 * For when the stage is not scrubbing: the world change as a page, in flow.
 * The word, the lines, her page live in a window, and the closing copy, on
 * paper, in that order.
 */
export function StaticStudioSite() {
  const stage = useStageKind();
  const compact = stage === "compact";
  return (
    <section
      aria-label="Studio+"
      className="relative w-full px-6 py-[14vh] md:px-12"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[10vh]">
        <Word stage={stage} />
        <Lines stage={stage} />
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
        <Close stage={stage} className={compact ? "w-full" : "w-[min(34vw,32rem)] self-start"} />
      </div>
    </section>
  );
}
