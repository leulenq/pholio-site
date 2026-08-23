"use client";

/* ═══════════════════════════════════════════════════════════════════
   Shared parts for the four /talent hero directions.

   Everything here exists so the variants differ in composition and
   message only. Motion vocabulary, action treatment, image treatment
   and exit behaviour are identical across all four, which is what
   makes the comparison honest.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, useTransform, type MotionValue } from "framer-motion";
import { EASE, GOLD, APP_URL } from "@/components/talent-flow/kit";
import { useScrub } from "@/components/talent-flow/motion";

export type HeroVariantProps = {
  progress: MotionValue<number>;
  prm: boolean;
};

/* Real photography already in the repo, brand-treated on the way in.
   No generated placeholders and no decorative vector stand-ins. */
export const SHOT = {
  profile: "/generated/comp-card/source/mara-voss-profile.jpg",
  crossedArm: "/generated/comp-card/source/mara-voss-crossed-arm.jpg",
  redHero: "/generated/comp-card/source/mara-voss-red-hero.jpg",
} as const;

export const CARD_FRONT = "/generated/comp-card/elara-keats-front.png";

/** The single CTA label for the whole page. The header already uses it,
    so the hero must not invent a second label for the same intent.
    Was "Get scouted" — retired 2026-08-15, see lessons.md §23. */
export const CTA_LABEL = "Apply free";
export const CTA_HREF = `${APP_URL}/onboarding`;

/** The one italic-gold word in a headline. Never two.
    `leading` and the reserve below keep descenders off the mask edge. */
export function Verdict({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-editorial-italic" style={{ color: GOLD }}>
      {children}
    </span>
  );
}

/** A display line that rises from behind its own baseline. The mask is a
    plain overflow clip; the padding/negative-margin pair reserves room
    for descenders (g, y, p) so italic words are never shaved. */
export function Line({
  children,
  delay,
  prm,
}: {
  children: React.ReactNode;
  delay: number;
  prm: boolean;
}) {
  return (
    <span
      style={{
        display: "block",
        overflow: "hidden",
        paddingBottom: "0.18em",
        marginBottom: "-0.18em",
      }}
    >
      <motion.span
        style={{ display: "block" }}
        initial={prm ? false : { y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.15, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Fade and rise, for everything that is not a headline line. */
export function Rise({
  children,
  delay,
  prm,
  className,
  style,
}: {
  children: React.ReactNode;
  delay: number;
  prm: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      initial={prm ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** One sentence. Max 20 words, max four lines, never a second paragraph. */
export function Sentence({
  children,
  tone,
  style,
}: {
  children: React.ReactNode;
  tone: "onInk" | "onCream";
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 15.5,
        lineHeight: 1.75,
        color:
          tone === "onInk" ? "rgba(245,240,232,0.74)" : "rgba(26,26,26,0.7)",
        maxWidth: "40ch",
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** The action. Square, never a pill; solid so it clears WCAG AA against
    either field. Hover shifts colour, it does not scale. */
export function HeroAction({ tone }: { tone: "onInk" | "onCream" }) {
  const onInk = tone === "onInk";
  const bg = onInk ? "#FAF7F2" : "#141414";
  const fg = onInk ? "#0A0A0A" : "#FAF7F2";
  const hover = onInk ? "#FFFFFF" : "#000000";
  return (
    <a
      href={CTA_HREF}
      style={{
        display: "inline-block",
        backgroundColor: bg,
        color: fg,
        fontFamily: "var(--font-sans)",
        fontSize: "0.8125rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "16px 40px",
        whiteSpace: "nowrap",
        transition: "background-color 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bg;
      }}
    >
      {CTA_LABEL}
    </a>
  );
}

/** House portrait treatment: grayscale, slight contrast lift, warm grain.
    Frame the image, never crop the subject out of it. */
export function Portrait({
  src,
  alt,
  position = "50% 30%",
  className,
  style,
}: {
  src: string;
  alt: string;
  position?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`texture-grain ${className ?? ""}`}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          filter: "grayscale(1) contrast(1.06)",
        }}
      />
    </div>
  );
}

/** The shared exit. Every direction recedes the same way so the flow's
    handoff into Scene 2 reads identically whichever one ships. */
export function useHeroExit(progress: MotionValue<number>) {
  const y = useScrub(progress, [0.26, 0.72], [0, -82], "depart");
  const scale = useScrub(progress, [0.26, 0.72], [1, 0.955], "depart");
  const opacity = useTransform(progress, [0.28, 0.6], [1, 0]);
  /* The hero occludes: Scene 2 is already staged 59vh down the flow and
     would otherwise show through the hero's air at rest. The cover
     clears after the type so the two still share frames at the seam. */
  const cover = useTransform(progress, [0.46, 0.8], [1, 0]);
  return { y, scale, opacity, cover };
}

export { motion, useTransform };
