"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 3 — Book (cream).
   GESTURE: deal-in wave → plane-tilt.
   The grid deals in like cards dealt onto a table, along a diagonal
   wave from the top-left corner (each frame flips in on its Y axis).
   At the hold, three frames recede in depth rather than merely
   dimming, while the five kept frames tighten toward the grid's
   centre. Exit is not a per-frame convergence: the WHOLE grid is
   treated as one sheet that hinges away from the viewer on its top
   edge — the shape Send opens on.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  Stage,
  Frame,
  Caption,
  Mono,
  V,
  usePrm,
  FACES,
  ON_CREAM_FAINT,
} from "./kit";
import { useDealIn, usePlaneTilt, useScrub, useWipe } from "./motion";

type FrameSpec = {
  src: string;
  alt: string;
  heldBack: boolean;
  label?: string;
  scatter: { x: number; y: number; rot: number };
  pos: string;
  zoom?: number;
};

/* 8 frames, 4×2 grid order (row-major). One identity — a book belongs to
   one person — built from a single full-length editorial frame at eight
   croppings, the way a contact sheet re-frames one sitting. Indices 6–7
   hide on mobile, leaving a clean 3×2 of the first six. */
const FRAMES: FrameSpec[] = [
  { src: FACES.book, alt: "Book frame, full length", heldBack: false, label: "FULL LENGTH — BOOK", scatter: { x: -28, y: 18, rot: -2 }, pos: "50% 12%" },
  { src: FACES.book, alt: "Book frame, close crop", heldBack: true, label: "HELD BACK", scatter: { x: 22, y: -24, rot: 2 }, pos: "50% 6%", zoom: 2 },
  { src: FACES.book, alt: "Book frame, three-quarter crop", heldBack: false, label: "¾ — BOOK", scatter: { x: -18, y: -30, rot: 1 }, pos: "50% 16%", zoom: 1.35 },
  { src: FACES.book, alt: "Book frame, torso crop", heldBack: false, scatter: { x: 30, y: 14, rot: -1 }, pos: "50% 30%", zoom: 1.6 },
  { src: FACES.book, alt: "Book frame, tight crop", heldBack: true, label: "HELD BACK", scatter: { x: -24, y: 26, rot: 2 }, pos: "45% 10%", zoom: 2.3 },
  { src: FACES.book, alt: "Book frame, headshot crop", heldBack: false, label: "HEADSHOT — BOOK", scatter: { x: 16, y: -20, rot: -2 }, pos: "52% 5%", zoom: 2.6 },
  { src: FACES.book, alt: "Book frame, movement crop", heldBack: true, label: "HELD BACK", scatter: { x: -30, y: 12, rot: 1 }, pos: "50% 70%", zoom: 1.7 },
  { src: FACES.book, alt: "Book frame, mid crop", heldBack: false, scatter: { x: 20, y: 22, rot: -1 }, pos: "50% 45%", zoom: 1.4 },
];

function BookFrame({
  f,
  i,
  keptIndex,
  progress,
  prm,
}: {
  f: FrameSpec;
  i: number;
  keptIndex: number;
  progress: MotionValue<number>;
  prm: boolean;
}) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const wave = (col + row) / 5;

  /* entrance: dealt in on a diagonal wave, like cards dealt onto a table */
  const deal = useDealIn(progress, [0.04, 0.4], wave);

  /* hold: held-back frames recede in depth; kept frames tighten toward centre */
  const toward = { x: (1.5 - col) * 4, y: (0.5 - row) * 10 };
  const heldZ = useScrub(progress, [0.42, 0.62], [0, -220], "drive");
  const heldScale = useScrub(progress, [0.42, 0.62], [1, 0.9], "drive");
  const heldOpacity = useScrub(progress, [0.42, 0.62], [1, 0.18], "drive");
  const keptX = useScrub(progress, [0.42, 0.62], [0, toward.x], "arrival");
  const keptY = useScrub(progress, [0.42, 0.62], [0, toward.y], "arrival");

  const keptTotalX = useTransform([deal.x, keptX], ([dx, kx]) => (dx as number) + (kx as number));
  const heldTotalZ = useTransform([deal.z, heldZ], ([dz, hz]) => (dz as number) + (hz as number));
  const heldTotalOpacity = useTransform(
    [deal.opacity, heldOpacity],
    ([a, b]) => (a as number) * (b as number),
  );

  /* labels: wipe reveal (not a fade), then retire together near the exit */
  const labelStart = f.heldBack ? 0.42 : 0.6;
  const labelClip = useWipe(progress, [labelStart, labelStart + 0.06], "left");
  const labelRetire = useScrub(progress, [0.8, 0.86], [1, 0], "depart");

  const hideOnMobile = i >= 6;

  const finalX = f.heldBack ? 0 : toward.x;
  const finalY = f.heldBack ? 0 : toward.y;
  const finalZ = f.heldBack ? -220 : 0;
  const finalScale = f.heldBack ? 0.9 : 1;
  const finalOpacity = f.heldBack ? 0.18 : 1;

  return (
    <div className={hideOnMobile ? "hidden md:block" : undefined} style={{ position: "relative" }}>
      <motion.div
        style={{
          x: prm ? finalX : f.heldBack ? deal.x : keptTotalX,
          y: prm ? finalY : f.heldBack ? 0 : keptY,
          z: prm ? finalZ : f.heldBack ? heldTotalZ : deal.z,
          rotateY: prm ? 0 : deal.rotateY,
          scale: prm ? finalScale : f.heldBack ? heldScale : 1,
          opacity: prm ? finalOpacity : f.heldBack ? heldTotalOpacity : deal.opacity,
          transformPerspective: 900,
          zIndex: f.heldBack ? 1 : 10 + keptIndex,
          willChange: "transform, opacity",
        }}
      >
        <Frame
          src={f.src}
          alt={f.alt}
          style={{
            aspectRatio: "3 / 4",
            boxShadow: f.heldBack ? "none" : "0 18px 40px rgba(26,26,26,0.16)",
          }}
          imgStyle={{
            objectPosition: f.pos,
            transform: f.zoom ? `scale(${f.zoom})` : undefined,
            transformOrigin: f.pos,
          }}
        />
      </motion.div>
      {f.label ? (
        <motion.div
          aria-hidden="true"
          style={{
            opacity: prm ? 1 : labelRetire,
            clipPath: prm ? "inset(0% 0% 0% 0%)" : labelClip,
            marginTop: 6,
            textAlign: "center",
          }}
        >
          <Mono color={ON_CREAM_FAINT} size={9}>
            {f.label}
          </Mono>
        </motion.div>
      ) : null}
    </div>
  );
}

function BookCaption({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  const enter = useScrub(progress, [0.1, 0.2], [0, 1], "arrival");
  const exit = useScrub(progress, [0.78, 0.9], [1, 0], "depart");
  const opacity = useTransform([enter, exit], ([a, b]) => (a as number) * (b as number));
  const y = useScrub(progress, [0.1, 0.2], [20, 0], "arrival");
  /* the caption leaves the frame before the sheet tilts — it slides left,
     it does not fade in place */
  const x = useScrub(progress, [0.78, 0.9], [0, -40], "depart");

  return (
    <motion.div
      style={{
        opacity: prm ? 1 : opacity,
        y: prm ? 0 : y,
        x: prm ? 0 : x,
        willChange: "transform, opacity",
      }}
    >
      <Caption
        dark={false}
        headline={
          <>
            The booker sees what you <V>choose.</V>
          </>
        }
      >
        Hold back any frame — from everyone, from agencies, or from a single send. Your book,
        exactly as you decided it.
      </Caption>
    </motion.div>
  );
}

function BookStage({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  /* exit: the grid stops being eight frames and becomes one sheet,
     hinging away from the viewer on its top edge */
  const sheet = usePlaneTilt(progress, [0.82, 1], 34);
  let keptCounter = 0;

  return (
    <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 md:flex-row md:items-center md:gap-10 md:px-12">
        <div className="w-full md:w-[38%]">
          <BookCaption progress={progress} prm={prm} />
        </div>
        <div className="w-full md:w-[55%]">
          <motion.div
            style={{
              rotateX: prm ? 0 : sheet.rotateX,
              y: prm ? 0 : sheet.y,
              scale: prm ? 1 : sheet.scale,
              opacity: prm ? 1 : sheet.opacity,
              transformOrigin: "50% 0%",
              transformPerspective: 1200,
              willChange: "transform, opacity",
            }}
          >
            <div
              className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4"
              style={{ perspective: 1400, transformStyle: "preserve-3d" }}
            >
              {FRAMES.map((f, i) => {
                const keptIndex = f.heldBack ? -1 : keptCounter++;
                return (
                  <BookFrame
                    key={i}
                    f={f}
                    i={i}
                    keptIndex={keptIndex}
                    progress={progress}
                    prm={prm}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SceneBook() {
  const prm = usePrm();

  return (
    <Stage id="book" hvh={250} z={6} overlap={100}>
      {(progress) => <BookStage progress={progress} prm={prm} />}
    </Stage>
  );
}
