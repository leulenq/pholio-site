"use client";

/* ═══════════════════════════════════════════════════════════════════
   01 — The Room. Manifesto.

   The industry's real barrier is not talent, it is the door. Four words
   at poster scale carry the whole frame; the portrait is bled off the
   right edge under a heavy ink scrim so it reads as atmosphere rather
   than as a subject competing with the type.
   ═══════════════════════════════════════════════════════════════════ */

import {
  Line,
  Rise,
  Sentence,
  Verdict,
  HeroAction,
  Portrait,
  SHOT,
  useHeroExit,
  motion,
  type HeroVariantProps,
} from "./kit";

export const ROOM_FIELD = "#050505";

export default function VariantRoom({ progress, prm }: HeroVariantProps) {
  const exit = useHeroExit(progress);

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: ROOM_FIELD, opacity: prm ? 1 : exit.cover }}
      />

      {/* The portrait as a field, not a picture.
          Desktop: a right-hand column, scrimmed left to right so the ink
          is solid where the type sits and clears toward the corner.
          Mobile: full bleed under everything, scrimmed bottom to top.
          Dropping the image below md left the type on an empty black
          field with the upper half of the frame dead. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[46%]"
        style={{ opacity: prm ? 1 : exit.cover }}
      >
        <Portrait
          src={SHOT.profile}
          alt=""
          position="46% 22%"
          style={{ height: "100%", width: "100%" }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.88) 42%, rgba(5,5,5,0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `linear-gradient(to right, ${ROOM_FIELD} 0%, rgba(5,5,5,0.80) 34%, rgba(5,5,5,0.34) 100%)`,
          }}
        />
      </motion.div>

      <motion.div
        className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 lg:px-10"
        style={{
          zIndex: 2,
          paddingTop: 88,
          paddingBottom: 56,
          y: prm ? 0 : exit.y,
          scale: prm ? 1 : exit.scale,
          opacity: prm ? 1 : exit.opacity,
          transformOrigin: "left center",
          willChange: "transform, opacity",
        }}
      >
        <h1
          className="font-editorial"
          style={{
            fontSize: "clamp(3.4rem, 10.4vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
            color: "rgba(245,240,232,0.95)",
            margin: 0,
            maxWidth: "13ch",
          }}
        >
          <Line delay={0.2} prm={prm}>
            Get in
          </Line>
          <Line delay={0.32} prm={prm}>
            the <Verdict>room.</Verdict>
          </Line>
        </h1>

        <Rise delay={0.7} prm={prm} style={{ marginTop: "clamp(1.8rem, 4vh, 2.6rem)" }}>
          <Sentence tone="onInk">
            Pholio puts your work in front of vetted agencies. Free to apply.
          </Sentence>
        </Rise>

        <Rise delay={0.88} prm={prm} style={{ marginTop: "clamp(2.2rem, 5vh, 3.2rem)" }}>
          <HeroAction tone="onInk" />
        </Rise>
      </motion.div>
    </div>
  );
}
