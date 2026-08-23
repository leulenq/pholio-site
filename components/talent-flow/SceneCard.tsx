"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 2 — The card (cream). The scene the page is remembered by.
   GESTURE: material wipes → recede.
   The scene is ONE card and nothing else. An earlier pass flew three
   loose source frames in from off-stage to "gather" into the card;
   they read as scattered photographs rather than as raw material and
   were removed. The card presents itself by turning, and the art
   directions do NOT crossfade — each new edition is WIPED over the
   last from a different edge, so the card reads as printed matter
   being re-laid rather than layers dissolving. The exit tips the card
   back into depth instead of sliding it away.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  Stage,
  Caption,
  Mono,
  V,
  usePrm,
  RENDERS,
  GOLD,
  ON_CREAM_FAINT,
  ON_CREAM_SOFT,
  HAIR_CREAM,
} from "./kit";
import { useMass, useScrub, useWipe } from "./motion";

const CARD_AR = "1056 / 1632";

/** An art direction wiped over the one beneath it. */
function EditionLayer({
  src,
  alt,
  range,
  direction,
  progress,
  prm,
  visibleWhenPrm,
}: {
  src: string;
  alt: string;
  range: [number, number];
  direction: "left" | "right" | "up" | "down";
  progress: MotionValue<number>;
  prm: boolean;
  visibleWhenPrm: boolean;
}) {
  const clipPath = useWipe(progress, range, direction);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        clipPath: prm ? (visibleWhenPrm ? "inset(0%)" : "inset(0% 100% 0% 0%)") : clipPath,
        willChange: "clip-path",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </motion.div>
  );
}

export default function SceneCard() {
  const prm = usePrm();
  return (
    <Stage id="card" hvh={330} z={7} overlap={106}>
      {(progress) => <SceneCardStage progress={progress} prm={prm} />}
    </Stage>
  );
}

function SceneCardStage({
  progress,
  prm,
}: {
  progress: MotionValue<number>;
  prm: boolean;
}) {
  /* the card has weight — it trails the wheel slightly and settles */
  const weighted = useMass(progress, "medium");

  /* set, hold, then tip back into depth */
  const cardScale = useScrub(
    weighted,
    [0.06, 0.27, 0.33, 0.84, 1],
    [0.88, 1.03, 1, 1, 0.72],
    "arrival",
  );
  const cardRotX = useScrub(weighted, [0.84, 1], [0, 26], "depart");
  const cardRotZ = useScrub(weighted, [0.84, 1], [0, -5], "depart");
  const cardY = useScrub(weighted, [0.84, 1], ["0%", "26%"], "depart");
  const cardOpacity = useTransform(progress, [0.06, 0.14, 0.9, 1], [0, 1, 1, 0]);

  /* a slow presentation turn while the editions change — the card is
     being shown, not spun */
  const cardRotY = useScrub(
    weighted,
    [0.36, 0.46, 0.56, 0.66, 0.78],
    [0, -9, 0, 9, 0],
    "arrival",
  );

  const shadow = useTransform(
    progress,
    [0.1, 0.3],
    ["0 12px 30px rgba(26,26,26,0.08)", "0 34px 90px rgba(26,26,26,0.2)"],
  );

  /* the stats line rides up as the card sets */
  const statsY = useScrub(progress, [0.06, 0.26], [180, 0], "arrival");
  const statsOpacity = useTransform(progress, [0.06, 0.12, 0.26, 0.32], [0, 1, 1, 0]);

  /* NFC beat, after the editions have settled */
  const nfcOpacity = useTransform(progress, [0.78, 0.83, 0.88, 0.93], [0, 1, 1, 0]);
  const nfcScale = useScrub(progress, [0.78, 0.86], [0.9, 1], "arrival");

  /* caption enters on a left wipe, leaves by sliding — not a fade */
  const capClip = useWipe(progress, [0.1, 0.26], "left");
  const capX = useScrub(progress, [0.86, 1], [0, -46], "depart");
  const capOpacity = useTransform(progress, [0.88, 0.99], [1, 0]);

  const ruleScaleX = useScrub(progress, [0.3, 0.44], [0, 1], "wipe");
  const ruleOpacity = useTransform(progress, [0.3, 0.36, 0.86, 0.94], [0, 1, 1, 0]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div
        className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-10 px-6 md:flex-row md:justify-between md:gap-16 lg:px-10"
        style={{ paddingTop: 64, paddingBottom: 40 }}
      >
        <motion.div
          style={{
            clipPath: prm ? "inset(0%)" : capClip,
            x: prm ? 0 : capX,
            opacity: prm ? 1 : capOpacity,
            flexShrink: 0,
            willChange: "clip-path, transform, opacity",
          }}
          className="order-1 md:order-none md:max-w-[400px]"
        >
          <Caption
            dark={false}
            headline={
              <>
                A card that composes <V>itself.</V>
              </>
            }
          >
            Generated from your book and your stats — current whenever they
            are. No two cards alike.
          </Caption>
        </motion.div>

        <div
          className="order-2 w-[min(62vw,240px)] md:w-[min(30vw,340px)]"
          style={{ perspective: 1500, position: "relative" }}
        >
          <motion.div
            style={{
              position: "relative",
              aspectRatio: CARD_AR,
              scale: prm ? 1 : cardScale,
              rotateX: prm ? 0 : cardRotX,
              rotateY: prm ? 0 : cardRotY,
              rotateZ: prm ? 0 : cardRotZ,
              y: prm ? "0%" : cardY,
              opacity: prm ? 1 : cardOpacity,
              boxShadow: prm ? "0 34px 90px rgba(26,26,26,0.2)" : shadow,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 85%",
              willChange: "transform, opacity",
              background: "#fff",
            }}
          >
            {/* base edition, then two wiped over it from different edges */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RENDERS.front}
              alt="Comp card, composed front"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
            <EditionLayer
              src={RENDERS.galleryMat}
              alt="The same comp card in a second art direction"
              range={[0.44, 0.56]}
              direction="left"
              progress={progress}
              prm={prm}
              visibleWhenPrm={false}
            />
            <EditionLayer
              src={RENDERS.splitField}
              alt="The same comp card in a third art direction"
              range={[0.62, 0.74]}
              direction="up"
              progress={progress}
              prm={prm}
              visibleWhenPrm={false}
            />

            <motion.svg
              aria-hidden="true"
              viewBox="0 0 48 96"
              style={{
                position: "absolute",
                right: -58,
                top: "50%",
                width: 44,
                height: 88,
                marginTop: -44,
                opacity: prm ? 0 : nfcOpacity,
                scale: prm ? 1 : nfcScale,
              }}
            >
              {[14, 26, 38].map((r, i) => (
                <path
                  key={r}
                  d={`M 4 ${48 - r} A ${r} ${r} 0 0 1 4 ${48 + r}`}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={1.25}
                  opacity={0.9 - i * 0.28}
                />
              ))}
            </motion.svg>
          </motion.div>

          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              bottom: -34,
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              y: prm ? 0 : statsY,
              opacity: prm ? 0 : statsOpacity,
            }}
          >
            <Mono color={ON_CREAM_FAINT} size={9}>
              180 CM · 5′11″ — 81 · 64 · 89
            </Mono>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -38,
              textAlign: "center",
              opacity: prm ? 1 : nfcOpacity,
            }}
          >
            <Mono color={ON_CREAM_FAINT} size={9}>
              NFC — in design ·{" "}
              <span style={{ color: ON_CREAM_SOFT }}>hold near reader</span>
            </Mono>
          </motion.div>

          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -14,
              height: 1,
              background: HAIR_CREAM,
              transformOrigin: "left",
              scaleX: prm ? 1 : ruleScaleX,
              opacity: prm ? 1 : ruleOpacity,
            }}
          />
        </div>
      </div>
    </div>
  );
}
