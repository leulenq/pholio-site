"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 8 — Close (ink).
   GESTURE: bloom / resolution.
   The last frame of the take: the page coming to rest. Where every
   other scene travels (wipes, folds, dollies), this one only grows —
   an ambient field expands, the headline blooms into focus, hairlines
   draw into a three-column ledger. No exit. The camera comes to rest
   here.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, type MotionValue } from "framer-motion";
import {
  Stage,
  Sweep,
  V,
  GoldCta,
  Mono,
  usePrm,
  APP_URL,
  ON_INK,
  ON_INK_SOFT,
  ON_INK_FAINT,
  HAIR_INK,
  SERIF,
  SANS,
} from "./kit";
import { useScrub, useDraw, useWipe, useBloom } from "./motion";

const FACTS = [
  {
    lead: "Applying is free.",
    gloss: "No fee to submit. No paid visibility.",
  },
  {
    lead: "Agencies are vetted, and never charged.",
    gloss: "Every agency is verified before it can review talent. Pholio takes no commission.",
  },
  {
    lead: "Your work leaves with you.",
    gloss: "Export your book and your data at any time.",
  },
];
const FACT_THRESHOLDS = [0.28, 0.36, 0.44];

export default function SceneClose() {
  const prm = usePrm();

  return (
    <Stage id="close" hvh={150} z={1} overlap={92}>
      {(progress) => <CloseStage progress={progress} prm={prm} />}
    </Stage>
  );
}

function CloseStage({
  progress,
  prm,
}: {
  progress: MotionValue<number>;
  prm: boolean;
}) {
  /* the ambient field expands into place alongside its own opacity */
  const orbOpacity = useScrub(progress, [0.06, 0.5], [0, 0.5], "arrival");
  const orbScale = useScrub(progress, [0.06, 0.5], [0.6, 1], "arrival");

  /* the sweep draws from centre rather than fading */
  const sweepDraw = useDraw(progress, [0.04, 0.14], "wipe");

  /* the headline blooms — scale, opacity and a letter-spacing settle */
  const bloom = useBloom(progress, [0.1, 0.3]);

  /* the CTA grows into place — no travel */
  const ctaScale = useScrub(progress, [0.52, 0.64], [0.94, 1], "arrival");
  const ctaOpacity = useScrub(progress, [0.52, 0.64], [0, 1], "arrival");

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ambient gold field behind the finale */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-32%",
          width: 880,
          height: 880,
          marginLeft: -440,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,165,90,0.13) 0%, transparent 62%)",
          filter: "blur(70px)",
          opacity: prm ? 0.5 : orbOpacity,
          scale: prm ? 1 : orbScale,
          pointerEvents: "none",
        }}
      />

      <div className="mx-auto w-full max-w-4xl px-6 text-center md:px-10">
        <motion.div
          style={{
            scaleX: prm ? 1 : sweepDraw,
            transformOrigin: "center",
            willChange: "transform",
          }}
        >
          <Sweep centered width={72} />
        </motion.div>

        <motion.h2
          className="font-editorial mt-7"
          style={{
            fontSize: "clamp(2.6rem, 5.4vw, 4.4rem)",
            lineHeight: 1.05,
            letterSpacing: prm ? "-0.02em" : bloom.letterSpacing,
            color: ON_INK,
            textWrap: "balance",
            margin: "1.75rem 0 0",
            scale: prm ? 1 : bloom.scale,
            opacity: prm ? 1 : bloom.opacity,
            willChange: "transform, opacity, letter-spacing",
          }}
        >
          On your <V>terms.</V>
        </motion.h2>

        {/* the ledger — three facts under hairlines */}
        <div className="mt-14 grid grid-cols-1 gap-9 text-left md:mt-16 md:grid-cols-3 md:gap-10">
          {FACTS.map((fact, i) => (
            <Fact
              key={fact.lead}
              fact={fact}
              threshold={FACT_THRESHOLDS[i]}
              progress={progress}
              prm={prm}
            />
          ))}
        </div>

        <motion.div
          className="mt-14 flex flex-col items-center gap-6 md:mt-16"
          style={{
            scale: prm ? 1 : ctaScale,
            opacity: prm ? 1 : ctaOpacity,
            willChange: "transform, opacity",
          }}
        >
          <GoldCta href={`${APP_URL}/onboarding`}>Start your book</GoldCta>
          <Mono color={ON_INK_FAINT} size={9}>
            For models, actors, and creatives — with real agencies on the
            other side
          </Mono>
        </motion.div>
      </div>
    </div>
  );
}

function Fact({
  fact,
  threshold,
  progress,
  prm,
}: {
  fact: (typeof FACTS)[number];
  threshold: number;
  progress: MotionValue<number>;
  prm: boolean;
}) {
  /* the hairline draws left→right, then the text block wipes in — no y */
  const ruleDraw = useDraw(progress, [threshold, threshold + 0.05], "wipe");
  const textClip = useWipe(progress, [threshold + 0.05, threshold + 0.1], "left");

  return (
    <div>
      <motion.div
        aria-hidden="true"
        style={{
          height: 1,
          background: HAIR_INK,
          transformOrigin: "left",
          scaleX: prm ? 1 : ruleDraw,
        }}
      />
      <motion.div
        style={{ clipPath: prm ? undefined : textClip, willChange: "clip-path" }}
      >
        <p
          style={{
            margin: "1.1rem 0 0",
            fontFamily: SERIF,
            fontSize: 18,
            lineHeight: 1.35,
            color: ON_INK,
          }}
        >
          {fact.lead}
        </p>
        <p
          style={{
            margin: "0.55rem 0 0",
            fontFamily: SANS,
            fontSize: 13,
            lineHeight: 1.65,
            color: ON_INK_SOFT,
          }}
        >
          {fact.gloss}
        </p>
      </motion.div>
    </div>
  );
}
