"use client";

/* ═══════════════════════════════════════════════════════════════════
   04 — Title Card. Cinematic.

   The moment before recognition. Full-bleed face, type set low in the
   frame the way a film title is, which is the register this audience
   already aspires to. The image is the whole composition; the scrim
   exists only to make the type legible, not to decorate.

   A slow scroll-tied push on the image gives the frame life without a
   loop, a shimmer or a parallax gimmick.
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
import { useScrub } from "@/components/talent-flow/motion";

export const TITLECARD_FIELD = "#050505";

export default function VariantTitleCard({ progress, prm }: HeroVariantProps) {
  const exit = useHeroExit(progress);
  /* a slow push in. Motivated: it keeps the frame alive while the type
     lands, and it is scroll-tied so it never loops. */
  const push = useScrub(progress, [0, 1], [1.04, 1.14], "drive");

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: TITLECARD_FIELD, opacity: prm ? 1 : exit.cover }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity: prm ? 1 : exit.cover }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale: prm ? 1 : push, willChange: "transform" }}
        >
          <Portrait
            src={SHOT.redHero}
            alt=""
            position="50% 24%"
            style={{ height: "100%", width: "100%" }}
          />
        </motion.div>
        {/* scrim: ink at the type, clearing across the upper frame */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.74) 32%, rgba(5,5,5,0.28) 64%, rgba(5,5,5,0.42) 100%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-6 lg:px-10"
        style={{
          zIndex: 2,
          paddingTop: 96,
          paddingBottom: "clamp(5rem, 14vh, 9rem)",
          y: prm ? 0 : exit.y,
          scale: prm ? 1 : exit.scale,
          opacity: prm ? 1 : exit.opacity,
          transformOrigin: "left bottom",
          willChange: "transform, opacity",
        }}
      >
        <h1
          className="font-editorial"
          style={{
            fontSize: "clamp(2.9rem, 7.6vw, 7.2rem)",
            lineHeight: 0.94,
            letterSpacing: "-0.04em",
            color: "rgba(245,240,232,0.96)",
            margin: 0,
            maxWidth: "14ch",
          }}
        >
          <Line delay={0.24} prm={prm}>
            They&rsquo;re already
          </Line>
          <Line delay={0.36} prm={prm}>
            <Verdict>looking.</Verdict>
          </Line>
        </h1>

        <Rise delay={0.74} prm={prm} style={{ marginTop: "clamp(1.5rem, 3.4vh, 2.2rem)" }}>
          <Sentence tone="onInk">
            Pholio is where vetted agencies find their next face. Free to apply.
          </Sentence>
        </Rise>

        <Rise delay={0.92} prm={prm} style={{ marginTop: "clamp(1.9rem, 4.2vh, 2.8rem)" }}>
          <HeroAction tone="onInk" />
        </Rise>
      </motion.div>
    </div>
  );
}
