"use client";

import { useMemo } from "react";
import type { MotionValue } from "framer-motion";
import { motion, useMotionValue, useTransform } from "framer-motion";

import { leave, settle } from "@/components/intelligence/ease";
import { Wordmark } from "@/components/header/kit";
import { useFrame } from "@/components/prepared-for";
import { useMediaQuery } from "@/components/hero/useMediaQuery";
import { CompCardAssetsProvider, useDeferredCardAsset } from "./assets";
import { CardFace, DESIGNS, type DesignId } from "./designs";
import { CARD_FONTS } from "./fonts";
import {
  BACK,
  HERO_FIGURE,
  T,
  TERMS,
  arrive,
  glide,
  buildScene,
  cropAt,
  foldTransform,
  librarySrc,
  mix,
  panAt,
  phase,
  poseTransform,
  printPose,
  restTransform,
  termWindow,
  type PrintPlan,
  type Scene,
  type StageKind,
} from "./motion";

/**
 * The comp-card chapter. Her library, understood, made into her card.
 * The story and every number it moves on are in `./motion.ts`.
 *
 * Every element of the scene is a flat sibling on one stage-sized layer,
 * with its whole transform authored in stage pixels from the top left:
 * the hand-forward, then (for the back) the fold, then its own pose. That
 * is what lets a photograph lie at its true depth in the nest of sixty and
 * still turn with the back it was kept for, as one object (`lessons.md`
 * §26.2), with no element ever swapped for a copy of itself.
 */

/** A print's shadow: paper on velvet, close to the table. */
const PRINT_SHADOW = "0 18px 40px -14px rgba(0,0,0,0.8), 0 4px 12px -6px rgba(0,0,0,0.55)";
const CARD_SHADOW = "drop-shadow(0 40px 60px rgba(0,0,0,0.6)) drop-shadow(0 10px 18px rgba(0,0,0,0.45))";

const PAPER = "#F5F0E8";
const INK = "#15120E";

const insetCss = ([a, b, c, d]: number[]) =>
  `inset(${a * 100}% ${b * 100}% ${c * 100}% ${d * 100}%)`;

function Print({ plan, scene, progress }: { plan: PrintPlan; scene: Scene; progress: MotionValue<number> }) {
  const { item, bw, bh, fate } = plan;
  const src = useDeferredCardAsset(librarySrc(item));
  const isHero = fate.kind === "hero";
  const cropped = fate.kind !== "flick";

  const transform = useTransform(progress, (t) =>
    `translateX(${-panAt(scene, t)}px) ${poseTransform(printPose(plan, t), bw, bh)}`,
  );
  // Off the stage before its throw and after it is taken off the pile, a
  // print paints nothing at all. Both states are outside the frame, so the
  // switch is never seen; it only spares the compositor sixty layers.
  const visibility = useTransform(progress, (t) => {
    if (t < plan.throwAt[0]) return "hidden";
    if (fate.kind === "flick" && t > fate.at[1]) return "hidden";
    return "visible";
  });
  // The front lies at the bottom of the nest, under everything.
  const zIndex = isHero ? 2 : 10 + plan.z;
  const clipPath = useTransform(progress, (t) => insetCss(cropAt(plan, t)));

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        width: bw,
        height: bh,
        transform,
        transformOrigin: "0 0",
        visibility,
        zIndex,
        filter: isHero ? CARD_SHADOW : undefined,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: cropped ? clipPath : undefined,
          boxShadow: cropped ? undefined : PRINT_SHADOW,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          decoding="async"
          draggable={false}
          className="block h-full w-full object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * The front's name and the figure that stands in front of it. Both ride the
 * front exactly: same box, same pose, same crop. The figure is a matte of
 * the same photograph, so it is invisible until something passes behind it.
 */
function FrontLayers({ plan, scene, progress, stage }: { plan: PrintPlan; scene: Scene; progress: MotionValue<number>; stage: StageKind }) {
  const { bw, bh } = plan;
  const fate = plan.fate as Extract<PrintPlan["fate"], { kind: "hero" }>;
  const figure = useDeferredCardAsset(HERO_FIGURE);
  const [, r, , l] = fate.crop;
  const cw = (1 - l - r) * bw;

  // The name travels in from beyond the left edge of the frame, behind her.
  const reach = (stage === "wide" ? 1.1 : 1.5) * (scene.front.x + bw);
  const nameTransform = useTransform(progress, (t) => {
    const pose = printPose(plan, t);
    const dx = mix(-reach, 0, phase(t, T.name, arrive));
    return `translateX(${-panAt(scene, t)}px) ${poseTransform({ ...pose, x: pose.x + dx }, bw, bh)}`;
  });
  const transform = useTransform(progress, (t) => `translateX(${-panAt(scene, t)}px) ${poseTransform(printPose(plan, t), bw, bh)}`);
  const clipPath = useTransform(progress, (t) => insetCss(cropAt(plan, t)));
  const visibility = useTransform(progress, (t) => (t < plan.throwAt[0] ? "hidden" : "visible"));
  const nameVisibility = useTransform(progress, (t) => (t < T.name[0] ? "hidden" : "visible"));
  const nameZ = 3;
  const figureZ = 4;

  // The name, set in the card's own measure: the surname across the
  // width behind her head, the given name small above it.
  const surname = cw * 0.178;
  const given = cw * 0.052;

  return (
    <>
      <motion.div
        aria-hidden
        className="absolute left-0 top-0"
        style={{ width: bw, height: bh, transform: nameTransform, transformOrigin: "0 0", zIndex: nameZ, visibility: nameVisibility, willChange: "transform" }}
      >
        <div
          className="absolute text-center font-editorial leading-none"
          style={{ left: l * bw, width: cw, top: bh * 0.072, color: "#F7F1E6" }}
        >
          <div style={{ fontSize: given, letterSpacing: "0.42em", marginRight: "-0.42em" }}>OLA</div>
          <div style={{ fontSize: surname, letterSpacing: "-0.01em", marginTop: surname * 0.12 }}>SZKOLDA</div>
        </div>
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute left-0 top-0"
        style={{ width: bw, height: bh, transform, transformOrigin: "0 0", zIndex: figureZ, visibility, clipPath, willChange: "transform" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={figure} alt="" decoding="async" draggable={false} className="block h-full w-full" />
      </motion.div>
    </>
  );
}

/** The back's paper: the stats and the mark are printed on it. It slides
    in under the four photographs already lying in their places. */
function BackPaper({ scene, progress }: { scene: Scene; progress: MotionValue<number> }) {
  const { w: cw, h: ch } = scene.card;
  const transform = useTransform(progress, (t) => {
    const dx = mix(cw * 1.6 + 400, 0, phase(t, T.paper, arrive));
    return `translateX(${-panAt(scene, t)}px) ${poseTransform({ x: scene.back.x + dx, y: scene.back.y, s: 1, r: 0 }, cw, ch)}`;
  });
  const visibility = useTransform(progress, (t) => (t < T.paper[0] ? "hidden" : "visible"));
  const m = BACK.margin * cw;
  const stat = cw * 0.0178;

  const stats: [string, string][] = [
    ["Height", "169"],
    ["Bust", "77"],
    ["Waist", "58"],
    ["Hips", "84"],
    ["Shoes", "38"],
    ["Hair", "Blonde"],
    ["Eyes", "Blue"],
  ];

  return (
    <motion.div
      className="absolute left-0 top-0 overflow-hidden rounded-[3px]"
      style={{
        width: cw,
        height: ch,
        transform,
        transformOrigin: "0 0",
        visibility,
        zIndex: 1,
        background: PAPER,
        boxShadow: "0 40px 90px -30px rgba(0,0,0,0.85), 0 14px 34px -16px rgba(0,0,0,0.6)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <div
        className="absolute uppercase"
        style={{ left: m, right: m, top: BACK.statsTop * cw, fontSize: stat, letterSpacing: "0.14em", lineHeight: 1.9, color: INK, fontFamily: "var(--font-sans)" }}
      >
        {stats.map(([k, v]) => (
          <span key={k} style={{ marginRight: "1.15em", whiteSpace: "nowrap" }}>
            <span style={{ color: "rgba(21,18,14,0.48)" }}>{k}</span> {v}
          </span>
        ))}
      </div>
      <div className="absolute flex items-baseline justify-between" style={{ left: m, right: m, top: BACK.markTop * cw }}>
        <Wordmark size={cw * 0.0246} color="#A8894E" />
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: cw * 0.017, letterSpacing: "0.06em", color: "rgba(21,18,14,0.62)" }}>
          pholio.studio/ola-szkolda
        </span>
      </div>
    </motion.div>
  );
}

/** A framing word: in from beyond the right edge, held, out past the left,
    behind every photograph. */
function Term({ i, progress, compact }: { i: number; progress: MotionValue<number>; compact: boolean }) {
  const term = TERMS[i];
  const [a, b, c, d] = termWindow(i);
  const transform = useTransform(progress, (t) => {
    let vw: number;
    let pct: number;
    if (t <= b) {
      const p = settle(Math.min(Math.max((t - a) / (b - a), 0), 1));
      vw = mix(60, 0, p);
      pct = mix(0, -50, p);
    } else if (t <= c) {
      vw = mix(0, -5, (t - b) / (c - b));
      pct = -50;
    } else {
      const p = leave(Math.min((t - c) / (d - c), 1));
      vw = mix(-5, -62, p);
      pct = mix(-50, -100, p);
    }
    return `translate(calc(${vw}vw + ${pct}%), -50%)`;
  });
  const visibility = useTransform(progress, (t) => (t < a || t > d ? "hidden" : "visible"));

  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 whitespace-nowrap font-editorial leading-none tracking-[-0.035em] text-[#FAF7F2]"
      style={{
        top: `${term.y * 100}%`,
        fontSize: compact ? "17vw" : "clamp(4rem, 10.5vw, 12rem)",
        paddingBottom: "0.12em",
        transform,
        visibility,
        zIndex: 0,
        willChange: "transform",
      }}
    >
      {term.label}
    </motion.div>
  );
}

const SPREAD_SHADOW = "0 40px 90px -30px rgba(0,0,0,0.85), 0 14px 34px -16px rgba(0,0,0,0.6)";

/**
 * One of the other five directions on the filmstrip: front and back side
 * by side, one sheet before it is cut. The last is folded shut and handed
 * forward to the card's rest, where the next chapter picks it up.
 */
function Spread({ k, id, scene, progress, w }: { k: number; id: DesignId; scene: Scene; progress: MotionValue<number>; w: number }) {
  const { w: cw, h: ch } = scene.card;
  const last = k === DESIGNS.length - 1;
  const at = (side: "front" | "back") => (t: number) => {
    const cx = (side === "front" ? scene.front.x : scene.back.x) + k * scene.pitch - panAt(scene, t);
    const prefix = last ? `${restTransform(scene, t)}${side === "back" ? foldTransform(scene, t) : ""}` : "";
    return `${prefix}translate(${cx - cw / 2}px, ${scene.front.y - ch / 2}px)`;
  };
  const front = useTransform(progress, at("front"));
  const back = useTransform(progress, at("back"));
  // Off the filmstrip's visible stretch it paints nothing.
  const visibility = useTransform(progress, (t) => {
    const cx = scene.front.x + k * scene.pitch - panAt(scene, t);
    return Math.abs(cx - w / 2) > w + cw * 2 ? "hidden" : "visible";
  });
  const face = (side: "front" | "back", transform: MotionValue<string>, z: number) => (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        width: cw,
        height: ch,
        transform,
        transformOrigin: "0 0",
        visibility,
        zIndex: z,
        boxShadow: SPREAD_SHADOW,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
      }}
    >
      <CardFace id={id} side={side} w={cw} />
    </motion.div>
  );
  return (
    <>
      {face("back", back, 300)}
      {face("front", front, 310)}
    </>
  );
}

/** A direction's name, under its spread, riding the filmstrip. */
function Caption({ k, name, scene, progress, h }: { k: number; name: string; scene: Scene; progress: MotionValue<number>; h: number }) {
  const last = k === DESIGNS.length - 1;
  const transform = useTransform(progress, (t) => {
    const x = scene.front.x + scene.card.w / 2 + k * scene.pitch - panAt(scene, t);
    let y = scene.front.y + scene.card.h / 2 + 26;
    if (k === 0) y += (1 - phase(t, T.caption, arrive)) * h;
    if (last) y += phase(t, T.fold, glide) * h;
    return `translate(${x}px, ${y}px) translateX(-50%)`;
  });
  const visibility = useTransform(progress, (t) => (t < T.caption[0] ? "hidden" : "visible"));
  return (
    <motion.div
      aria-hidden
      className="absolute left-0 top-0 whitespace-nowrap font-mono uppercase text-[#FAF7F2]/55"
      style={{ transform, visibility, fontSize: 10, letterSpacing: "0.32em", zIndex: 320, willChange: "transform" }}
    >
      {String(k + 1).padStart(2, "0")}&nbsp;&nbsp;&nbsp;{name}
    </motion.div>
  );
}

function Scene({ progress, stage, w, h }: { progress: MotionValue<number>; stage: StageKind; w: number; h: number }) {
  const scene = useMemo(() => buildScene(stage, w, h), [stage, w, h]);
  const hero = scene.prints.find((p) => p.fate.kind === "hero")!;

  return (
    <div className={`pointer-events-none absolute inset-0 ${CARD_FONTS}`}>
      {TERMS.map((_, i) => (
        <Term key={i} i={i} progress={progress} compact={stage === "compact"} />
      ))}
      <BackPaper scene={scene} progress={progress} />
      {scene.prints.map((plan) => (
        <Print key={plan.item.id} plan={plan} scene={scene} progress={progress} />
      ))}
      <FrontLayers plan={hero} scene={scene} progress={progress} stage={stage} />
      {DESIGNS.slice(1).map((d, i) => (
        <Spread key={d.id} k={i + 1} id={d.id as DesignId} scene={scene} progress={progress} w={w} />
      ))}
      {DESIGNS.map((d, i) => (
        <Caption key={d.id} k={i} name={d.name} scene={scene} progress={progress} h={h} />
      ))}
    </div>
  );
}

/** The chapter on the home stage. `progress` is the stage's own smoothed
    timeline for this chapter. */
export function CompCardLayers({
  progress,
  assetsArmed = true,
  w,
  h,
}: {
  progress: MotionValue<number>;
  assetsArmed?: boolean;
  w: number;
  h: number;
}) {
  const compact = useMediaQuery("(max-width: 767px)");
  return (
    <CompCardAssetsProvider value={assetsArmed}>
      <Scene progress={progress} stage={compact ? "compact" : "wide"} w={w} h={h} />
    </CompCardAssetsProvider>
  );
}

/** One frame of the chapter, held: for the reduced-motion composition. */
function Still({ t, stage, w, h, label }: { t: number; stage: StageKind; w: number; h: number; label: string }) {
  const progress = useMotionValue(t);
  return (
    <div role="img" aria-label={label} className="relative h-[100dvh] w-full overflow-hidden bg-[#050505]">
      <Scene progress={progress} stage={stage} w={w} h={h} />
    </div>
  );
}

/**
 * Reduced motion: a second composition, not a shorter scrub. The chapter's
 * two still points, finished: the library understood, and the card it
 * made, front and back.
 */
export default function SceneCompCard() {
  const compact = useMediaQuery("(max-width: 767px)");
  const frame = useFrame();
  const stage: StageKind = compact ? "compact" : "wide";
  return (
    <section className="relative w-full bg-[#050505]">
      <Still
        t={0.3}
        stage={stage}
        w={frame.w}
        h={frame.h}
        label="Sixty of Ola Szkolda's photographs, each placed where she is in it, nested from full length to headshot"
      />
      <Still
        t={0.555}
        stage={stage}
        w={frame.w}
        h={frame.h}
        label="Her comp card, composed from those photographs: the front, and the back with four frames and her measurements"
      />
      <div className={`flex flex-col items-center gap-24 py-24 ${CARD_FONTS}`}>
        {DESIGNS.slice(1).map((d, i) => {
          const cw = Math.min(364, (frame.w - 48) / 2);
          return (
            <figure key={d.id} className="flex flex-col items-center gap-6">
              <div className="flex" style={{ boxShadow: SPREAD_SHADOW }}>
                <CardFace id={d.id as DesignId} side="front" w={cw} />
                <CardFace id={d.id as DesignId} side="back" w={cw} />
              </div>
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#FAF7F2]/55">
                {String(i + 2).padStart(2, "0")}&nbsp;&nbsp;&nbsp;{d.name}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
