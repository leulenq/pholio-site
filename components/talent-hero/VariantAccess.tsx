"use client";

/* ═══════════════════════════════════════════════════════════════════
   02 — Access. Asymmetric split.

   Names the thing talent already believes about their own career and
   takes their side: the work was never the problem, the door was. The
   composition is the agency-website archetype (a type bay against a
   full-height figure) at 54/46, which is the register this audience
   already reads as industry rather than as software.

   Mobile collapses to a portrait band above a full-width type bay.
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

export const ACCESS_FIELD = "#FAF7F2";

export default function VariantAccess({ progress, prm }: HeroVariantProps) {
  const exit = useHeroExit(progress);

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: ACCESS_FIELD, opacity: prm ? 1 : exit.cover }}
      />

      {/* the figure: full height on desktop, a band on mobile */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[38%] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[46%]"
        style={{ opacity: prm ? 1 : exit.cover }}
      >
        <Portrait
          src={SHOT.crossedArm}
          alt=""
          position="50% 22%"
          style={{ height: "100%", width: "100%" }}
        />
        {/* a short cream feather on the seam so the split is a join,
            not a cut line drawn down the middle of the page */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${ACCESS_FIELD} 0%, rgba(250,247,242,0) 26%)`,
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `linear-gradient(to right, ${ACCESS_FIELD} 0%, rgba(250,247,242,0) 22%)`,
          }}
        />
      </motion.div>

      <motion.div
        className="relative flex h-full w-full flex-col justify-center px-6 pt-[34%] md:w-[58%] md:pt-0 md:pl-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] md:pr-10"
        style={{
          zIndex: 2,
          paddingTop: undefined,
          paddingBottom: 48,
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
            fontSize: "clamp(2.6rem, 5.2vw, 4.8rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.038em",
            color: "#141414",
            margin: 0,
          }}
        >
          {/* Three short stacked lines rather than two long ones. The
              type bay is only ~610px wide at desktop, so a two-line set
              forced the scale down until it stopped commanding the
              frame. Breaking it this way buys back the scale and puts
              the gold verdict alone on the last line. */}
          <Line delay={0.2} prm={prm}>
            Talent isn&rsquo;t
          </Line>
          <Line delay={0.3} prm={prm}>
            the hard part.
          </Line>
          <Line delay={0.44} prm={prm}>
            <Verdict>Access</Verdict> is.
          </Line>
        </h1>

        <Rise delay={0.72} prm={prm} style={{ marginTop: "clamp(1.6rem, 3.6vh, 2.4rem)" }}>
          <Sentence tone="onCream">
            Vetted agencies. Real submissions. Free to apply, always.
          </Sentence>
        </Rise>

        <Rise delay={0.9} prm={prm} style={{ marginTop: "clamp(2rem, 4.6vh, 3rem)" }}>
          <HeroAction tone="onCream" />
        </Rise>
      </motion.div>
    </div>
  );
}
