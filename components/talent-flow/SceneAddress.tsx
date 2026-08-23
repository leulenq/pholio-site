"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 6 — Address (cream).
   GESTURE: architectural corner-draw → fold-away.
   Studio+: the one-page portfolio site at your own address. Opens on
   the rising rule Signal's baseline handed off — it draws outward
   from centre, then the frame's edges extend to build a box around
   the page, and only then does the box's own chrome become visible.
   At exit the whole frame turns edge-on and hands the stage to the
   object the next scene (Wallet) opens on.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  Stage,
  Caption,
  Frame,
  Mono,
  V,
  usePrm,
  FACES,
  ON_CREAM,
  ON_CREAM_SOFT,
  ON_CREAM_FAINT,
  HAIR_CREAM,
  SERIF,
  SANS,
} from "./kit";
import { useScrub, useWipe, useDraw, useFoldAway } from "./motion";

const PORTRAITS = [
  { pos: "50% 12%", zoom: 1.15, alt: "Portfolio portrait" },
  { pos: "50% 4%", zoom: 1.75, alt: "Portfolio portrait, close crop" },
  { pos: "48% 28%", zoom: 1.45, alt: "Portfolio portrait, mid crop" },
] as const;

export default function SceneAddress() {
  const prm = usePrm();

  return (
    <Stage id="address" hvh={235} z={3} overlap={110}>
      {(progress) => (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-10 px-6 pb-14 pt-24 md:gap-12 md:px-16">
          <BrowserFrame progress={progress} prm={prm} />
          <div className="w-full max-w-[760px]">
            <AddressCaption progress={progress} prm={prm} />
          </div>
        </div>
      )}
    </Stage>
  );
}

function BrowserFrame({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  /* exit: the frame hinges edge-on and hands the stage to Wallet */
  const fold = useFoldAway(progress, [0.78, 0.97]);

  /* construction sequence — the frame builds rather than fades in */
  const ruleScaleX = useDraw(progress, [0.04, 0.16], "wipe"); // top rule, centre outward
  const edgeScaleY = useScrub(progress, [0.12, 0.26], [0, 1], "wipe"); // left/right, extend down
  const bottomScaleX = useDraw(progress, [0.22, 0.34], "wipe"); // bottom, centre outward

  /* only then does the frame's own chrome (bg/border) become visible */
  const chromeBg = useTransform(
    progress,
    [0.3, 0.4],
    ["rgba(26,26,26,0)", "rgba(26,26,26,0.015)"],
  );
  const chromeBorder = useTransform(
    progress,
    [0.3, 0.4],
    ["rgba(26,26,26,0)", "rgba(26,26,26,0.12)"],
  );

  const chromeBarClip = useWipe(progress, [0.32, 0.42], "left");

  return (
    <motion.div
      className="w-full max-w-[760px]"
      style={{
        rotateY: prm ? 0 : fold.rotateY,
        scale: prm ? 1 : fold.scale,
        x: prm ? "0%" : fold.x,
        opacity: prm ? 1 : fold.opacity,
        transformPerspective: 1400,
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
      }}
    >
      {/* the rule Signal's baseline rose into — draws from centre */}
      <motion.div
        aria-hidden="true"
        style={{
          height: 1,
          background: HAIR_CREAM,
          transformOrigin: "center",
          scaleX: prm ? 1 : ruleScaleX,
        }}
      />
      <div
        style={{
          position: "relative",
          marginTop: -1,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* the frame's own background + border, revealed only once its
            edges have been drawn */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid",
            borderColor: prm ? HAIR_CREAM : chromeBorder,
            borderRadius: "8px",
            background: prm ? "rgba(26,26,26,0.015)" : chromeBg,
            pointerEvents: "none",
          }}
        />
        {/* left edge — extends downward */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 1,
            background: HAIR_CREAM,
            transformOrigin: "top",
            scaleY: prm ? 1 : edgeScaleY,
          }}
        />
        {/* right edge — extends downward */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 1,
            background: HAIR_CREAM,
            transformOrigin: "top",
            scaleY: prm ? 1 : edgeScaleY,
          }}
        />
        {/* bottom edge — draws from centre outward */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            background: HAIR_CREAM,
            transformOrigin: "center",
            scaleX: prm ? 1 : bottomScaleX,
          }}
        />

        {/* browser chrome */}
        <motion.div
          className="relative flex items-center gap-1.5 px-4 py-2.5"
          style={{
            borderBottom: `1px solid ${HAIR_CREAM}`,
            clipPath: prm ? undefined : chromeBarClip,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: ON_CREAM_FAINT,
                display: "inline-block",
              }}
            />
          ))}
          <div
            className="pointer-events-none absolute inset-x-0 flex justify-center"
            aria-hidden="true"
          >
            <Mono color={ON_CREAM_SOFT} size={10}>
              pholio.studio/you
            </Mono>
          </div>
        </motion.div>

        {/* the one-page site */}
        <div className="relative px-6 py-10 md:px-12 md:py-14">
          <PageName progress={progress} prm={prm} />
          <PagePortraits progress={progress} prm={prm} />
          <PageStats progress={progress} prm={prm} />
          <PageLine progress={progress} prm={prm} />
        </div>
      </div>
    </motion.div>
  );
}

function PageName({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  const clip = useWipe(progress, [0.12, 0.2], "left");

  return (
    <motion.h3
      className="font-editorial"
      style={{
        margin: 0,
        fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
        color: ON_CREAM,
        clipPath: prm ? undefined : clip,
        willChange: "clip-path",
      }}
    >
      Amara Okafor
    </motion.h3>
  );
}

function PagePortraits({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  const clip = useWipe(progress, [0.2, 0.3], "left");
  const scale = useScrub(progress, [0.2, 0.3], [1.06, 1], "arrival");

  return (
    <motion.div
      className="mt-6 grid grid-cols-3 gap-2 md:mt-8 md:gap-3"
      style={{ clipPath: prm ? undefined : clip, willChange: "clip-path" }}
    >
      {PORTRAITS.map((p) => (
        <motion.div
          key={p.pos}
          style={{ scale: prm ? 1 : scale, willChange: "transform" }}
        >
          <Frame
            src={FACES.site}
            alt={p.alt}
            style={{ aspectRatio: "3 / 4" }}
            imgStyle={{
              objectPosition: p.pos,
              transform: `scale(${p.zoom})`,
              transformOrigin: p.pos,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function PageStats({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  const clip = useWipe(progress, [0.3, 0.38], "left");

  return (
    <motion.div
      className="mt-6 md:mt-8"
      style={{ clipPath: prm ? undefined : clip, willChange: "clip-path" }}
    >
      <Mono color={ON_CREAM_FAINT} size={10}>
        {"178 CM · 5′10″ — NEW YORK"}
      </Mono>
    </motion.div>
  );
}

function PageLine({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  const clip = useWipe(progress, [0.38, 0.46], "left");

  return (
    <motion.div
      className="mt-6 md:mt-8"
      style={{ clipPath: prm ? undefined : clip, willChange: "clip-path" }}
    >
      <div style={{ height: 1, background: HAIR_CREAM }} />
      <p
        style={{
          marginTop: 16,
          marginBottom: 0,
          fontFamily: SANS,
          fontSize: 13,
          color: ON_CREAM_SOFT,
        }}
      >
        Selected work, digitals on request.
      </p>
    </motion.div>
  );
}

function AddressCaption({ progress, prm }: { progress: MotionValue<number>; prm: boolean }) {
  /* entrance: same wipe-open language as the frame it stands beside */
  const clip = useWipe(progress, [0.48, 0.6], "left");
  /* exit: slides right and fades — opposite direction to the frame's
     fold, so the two elements visibly separate */
  const exitX = useScrub(progress, [0.8, 0.94], [0, 56], "depart");
  const exitOpacity = useScrub(progress, [0.8, 0.94], [1, 0], "depart");

  return (
    <motion.div
      style={{
        clipPath: prm ? undefined : clip,
        x: prm ? 0 : exitX,
        opacity: prm ? 1 : exitOpacity,
        willChange: "clip-path, transform, opacity",
      }}
    >
      <Caption dark={false} headline={<>One page, at your own <V>address.</V></>}>
        Built from your profile — current whenever it is. Part of Studio+.
      </Caption>
    </motion.div>
  );
}
