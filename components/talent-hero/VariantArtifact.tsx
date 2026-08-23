"use client";

/* ═══════════════════════════════════════════════════════════════════
   03 — The Artifact. Object hero.

   The only direction where the product is visible in the first frame.
   It leads with the thing an agency actually receives: the composed
   comp card, presented as a physical object with a real cast shadow
   rather than as a screenshot in a device.

   The card is the real render already in the repo, not a mock built
   out of divs.
   ═══════════════════════════════════════════════════════════════════ */

import {
  Line,
  Rise,
  Sentence,
  Verdict,
  HeroAction,
  CARD_FRONT,
  useHeroExit,
  motion,
  type HeroVariantProps,
} from "./kit";
import { useScrub } from "@/components/talent-flow/motion";

export const ARTIFACT_FIELD = "#F5F0E8";

export default function VariantArtifact({ progress, prm }: HeroVariantProps) {
  const exit = useHeroExit(progress);
  /* the object settles a little later than the type, which is what makes
     it read as a thing placed on the page rather than a layer of it */
  const cardY = useScrub(progress, [0, 0.5], [0, -34], "arrival");

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: ARTIFACT_FIELD, opacity: prm ? 1 : exit.cover }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity: prm ? 1 : exit.cover }}
      >
        <div
          style={{
            position: "absolute",
            top: "6%",
            right: "4%",
            width: "min(44vw, 620px)",
            height: "min(44vw, 620px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,165,90,0.15) 0%, transparent 66%)",
            filter: "blur(80px)",
          }}
        />
        <div className="texture-grain pointer-events-none absolute inset-0" />
      </motion.div>

      <motion.div
        className="relative mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_0.82fr] md:gap-16 lg:px-10"
        style={{
          zIndex: 2,
          paddingTop: 88,
          paddingBottom: 56,
          y: prm ? 0 : exit.y,
          scale: prm ? 1 : exit.scale,
          opacity: prm ? 1 : exit.opacity,
          willChange: "transform, opacity",
        }}
      >
        <div>
          <h1
            className="font-editorial"
            style={{
              fontSize: "clamp(2.6rem, 5.6vw, 5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              color: "#141414",
              margin: 0,
            }}
          >
            <Line delay={0.2} prm={prm}>
              This is what <Verdict>arrives</Verdict>
            </Line>
            <Line delay={0.32} prm={prm}>
              before you do.
            </Line>
          </h1>

          <Rise delay={0.72} prm={prm} style={{ marginTop: "clamp(1.6rem, 3.6vh, 2.4rem)" }}>
            <Sentence tone="onCream">
              Your comp card, composed by Pholio and sent to agencies that are
              actually looking.
            </Sentence>
          </Rise>

          <Rise delay={0.9} prm={prm} style={{ marginTop: "clamp(2rem, 4.6vh, 3rem)" }}>
            <HeroAction tone="onCream" />
          </Rise>
        </div>

        {/* the object */}
        <motion.div
          className="hidden md:block"
          initial={prm ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.44 }}
        >
          <motion.div style={{ y: prm ? 0 : cardY }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CARD_FRONT}
              alt="A Pholio comp card, composed and ready to send"
              draggable={false}
              /* Height-sized so the object always sits inside the frame,
                 and grayscaled: the render's own photograph is warm red,
                 which is off-palette. The house treatment for any
                 photograph is grayscale with a small contrast lift. */
              style={{
                display: "block",
                height: "min(62vh, 560px)",
                width: "auto",
                maxWidth: "100%",
                margin: "0 auto",
                filter: "grayscale(1) contrast(1.05)",
                transform: "rotate(-2.4deg)",
                boxShadow:
                  "0 40px 90px rgba(60,48,30,0.26), 0 6px 18px rgba(60,48,30,0.12)",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
