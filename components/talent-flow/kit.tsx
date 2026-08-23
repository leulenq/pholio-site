"use client";

/* ═══════════════════════════════════════════════════════════════════
   /talent — "one continuous take" scene kit
   The page is a single unbroken camera move: seven scenes, each
   showcasing one instrument, connected by engineered handoffs. The
   background is ONE continuously interpolated color field (ink↔cream,
   ending true black for the Wallet scene) owned by TalentFlowPage —
   scenes are transparent and fade their own content near boundaries.
   Motion budget: one hero move per scene, transform/opacity only,
   sticky stages, no springs fighting scroll-scrub, one ease.
   ═══════════════════════════════════════════════════════════════════ */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { PHOLIO_APP_ORIGIN } from "@/lib/pholio-app-origin";

export const APP_URL = PHOLIO_APP_ORIGIN;

export const EASE = [0.22, 1, 0.36, 1] as const;

export const INK = "#050505";
export const CREAM = "#FAF7F2";
export const CREAM_WARM = "#F5F0E8";
export const BLACK = "#000000";
/* The product-shot cyclorama. Not a fourth brand colour — it is the lit
   white sweep a device is photographed against, used by the Wallet
   scene only (and by /for-talent's wallet section before it). It reads
   as a *lift* off the page's cream paper, and the stage warms its own
   edges back toward CREAM_WARM so it never goes clinical-cold. */
export const STUDIO_WHITE = "#FFFFFF";
export const GOLD = "#C9A55A";
export const GOLD_LIGHT = "#D4BC8A";

/* text tiers on the ink field (warm white, never pure white) */
export const ON_INK = "rgba(245, 240, 232, 0.92)";
export const ON_INK_SOFT = "rgba(245, 240, 232, 0.68)";
export const ON_INK_FAINT = "rgba(245, 240, 232, 0.44)";

/* text tiers on cream */
export const ON_CREAM = "#1A1A1A";
export const ON_CREAM_SOFT = "rgba(26, 26, 26, 0.72)";
export const ON_CREAM_FAINT = "rgba(26, 26, 26, 0.46)";

/* hairlines */
export const HAIR_INK = "rgba(255, 255, 255, 0.1)";
export const HAIR_CREAM = "rgba(26, 26, 26, 0.12)";

export const MONO = "var(--font-jbmono), 'JetBrains Mono', monospace";
export const SERIF = "var(--font-serif), Georgia, serif";
export const SANS = "var(--font-sans), Inter, sans-serif";

/* ── Scene score. Heights in vh; bg is the field color at the scene's
      centre; overlap is how far the stage is pulled up over its
      predecessor so the two share frames at the seam. `hold` shapes the
      colour field: a tight hold means the field commits late and turns
      fast (a cut), a loose one means it bleeds early (a dissolve) —
      boundaries should not all behave alike.
      TalentFlowPage reads all of this to build one continuous field. ── */
/* A sticky stage is pinned for exactly (h − 100vh) of scroll, then
   unpins and scrolls away over one viewport. So `overlap` must be ~100
   for a scene to take the frame at the precise moment its predecessor
   releases it — anything less leaves a dead window with nothing staged
   in it. Above 100 the two are pinned together for a beat and the
   outgoing gesture plays over the incoming scene, which is where the
   real cross-fades live. Below 100 buys a deliberate breath.
   Earlier scenes sit on higher z, so an exit clears the frame to
   reveal the next scene already standing behind it. */
export const SCENES = [
  { id: "arrival", h: 165, bg: INK, overlap: 0, hold: 0.12 },
  { id: "card", h: 330, bg: CREAM, overlap: 106, hold: 0.16 },
  { id: "book", h: 250, bg: CREAM, overlap: 100, hold: 0.22 },
  { id: "send", h: 285, bg: INK, overlap: 116, hold: 0.06 },
  { id: "signal", h: 255, bg: INK, overlap: 100, hold: 0.2 },
  { id: "address", h: 235, bg: CREAM, overlap: 110, hold: 0.12 },
  /* The wallet beat is the page's one product shot, so it takes the
     white sweep rather than the darkroom it used to sit in — and both
     it and `close` hold almost to their edges, which is the tightest
     pairing on the page. That is deliberate: white → ink is the only
     morph here that passes through mid-grey, and mid-grey is the one
     value that reads as an unstyled section rather than a colour. A
     loose hold dissolves through it and dwells there forms of scroll;
     a tight one cuts, so the studio stays white for its whole scene
     and the field snaps to ink over the empty frame behind it. */
  { id: "wallet", h: 280, bg: STUDIO_WHITE, overlap: 100, hold: 0.03 },
  { id: "close", h: 150, bg: INK, overlap: 92, hold: 0.03 },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

/* ── Imagery ──────────────────────────────────────────────────────────
   Real engine renders (one identity, used ONLY in the card scene) and a
   breadth of faces for the arrival field and the book grid. All Unsplash
   IDs verified in-repo. Portraits render grayscale with warm grain. */
export const RENDERS = {
  front: "/generated/comp-card/elara-keats-front.png",
  back: "/generated/comp-card/elara-keats-back.png",
  galleryMat: "/generated/comp-card/elara-keats-gallery-mat.png",
  splitField: "/generated/comp-card/elara-keats-split-field.png",
  statement: "/generated/comp-card/elara-keats-statement.png",
} as const;

/* Unsplash portraits — every ID verified in use across indexed sites.
   Rendered grayscale with warm grain (the house treatment), so the
   originals' color grading never reaches the page. */
const UN = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&w=900&q=80`;

export const FACES = {
  /* the arrival constellation — five different faces, five divisions */
  a: UN("1509631179647-0177331693ae"),
  b: UN("1517841905240-472988babdf9"),
  c: UN("1544005313-94ddf0286df2"),
  d: UN("1539571696357-5a69c17a67c6"),
  e: UN("1488161628813-04466f872be2"),
  /* one identity for the book scene — a full-length editorial frame
     that survives eight different croppings */
  book: UN("1515886657613-9f3515b0c78f"),
  /* one identity shared by the Studio+ site and the Wallet pass */
  site: UN("1508214751196-bcfd4ca60f91"),
} as const;

export const SOURCE_FRAMES = {
  crossedArm: "/generated/comp-card/source/mara-voss-crossed-arm.jpg",
  profile: "/generated/comp-card/source/mara-voss-profile.jpg",
  redHero: "/generated/comp-card/source/mara-voss-red-hero.jpg",
} as const;

/* ── Primitives ─────────────────────────────────────────────────────── */

/** The one italic-gold verdict word of a headline. Never two. */
export function V({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-editorial-italic" style={{ color: GOLD }}>
      {children}
    </span>
  );
}

/** Clerical mono micro-label — the ledger voice. */
export function Mono({
  children,
  color,
  size = 10,
  tracking = "0.2em",
  style,
}: {
  children: React.ReactNode;
  color: string;
  size?: number;
  tracking?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: size,
        letterSpacing: tracking,
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Scene caption: serif headline + at most one supporting sentence. */
export function Caption({
  dark,
  headline,
  children,
  maxWidth = 470,
  as: Tag = "h2",
  align = "left",
}: {
  dark: boolean;
  headline: React.ReactNode;
  children?: React.ReactNode;
  maxWidth?: number;
  as?: "h1" | "h2";
  align?: "left" | "center";
}) {
  return (
    <div style={{ maxWidth, textAlign: align }}>
      <Tag
        className="font-editorial"
        style={{
          fontSize: "clamp(2.2rem, 4.4vw, 3.7rem)",
          lineHeight: 1.07,
          letterSpacing: "-0.02em",
          color: dark ? ON_INK : ON_CREAM,
          textWrap: "balance",
          margin: 0,
        }}
      >
        {headline}
      </Tag>
      {children ? (
        <p
          style={{
            marginTop: "1.35rem",
            fontFamily: SANS,
            fontSize: 15,
            lineHeight: 1.75,
            color: dark ? ON_INK_SOFT : ON_CREAM_SOFT,
            maxWidth: "56ch",
            marginLeft: align === "center" ? "auto" : undefined,
            marginRight: align === "center" ? "auto" : undefined,
          }}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

/** Gold hairline sweep. */
export function Sweep({
  width = 64,
  centered = false,
}: {
  width?: number;
  centered?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width,
        height: 1,
        margin: centered ? "0 auto" : undefined,
        background: centered
          ? `linear-gradient(to right, transparent, ${GOLD}, transparent)`
          : `linear-gradient(to right, ${GOLD}, transparent)`,
      }}
    />
  );
}

/**
 * Stage — the house sticky-scene pattern. A tall section whose sticky,
 * viewport-height stage receives the scene's scroll progress (0→1 over
 * the section). All scroll-scrubbed motion derives from this value.
 *
 * `overlap` pulls the stage up over its predecessor (in vh), so the
 * outgoing and incoming scenes share frames at the seam instead of
 * meeting edge to edge — the difference between a cut and a dissolve.
 * `z` orders who is on top through that shared window.
 * `clip` can be disabled where a gesture is meant to leave the frame
 * (a dolly-through, a launch) rather than be cropped by it.
 */
export function Stage({
  id,
  hvh,
  children,
  z = 1,
  overlap = 0,
  clip = true,
}: {
  id: SceneId;
  hvh: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
  z?: number;
  overlap?: number;
  clip?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return (
    <section
      id={id}
      ref={ref}
      style={{
        height: `${hvh}vh`,
        position: "relative",
        zIndex: z,
        marginTop: overlap ? `-${overlap}vh` : undefined,
      }}
    >
      <div
        className="h-mobile-screen"
        style={{
          position: "sticky",
          top: 0,
          overflow: clip ? "hidden" : "visible",
        }}
      >
        {children(scrollYProgress)}
      </div>
    </section>
  );
}

/** Grayscale portrait frame with warm grain — the house treatment. */
export function Frame({
  src,
  alt,
  style,
  imgStyle,
  grain = true,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  grain?: boolean;
}) {
  return (
    <div
      className={grain ? "texture-grain" : undefined}
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
          filter: "grayscale(1) contrast(1.04)",
          ...imgStyle,
        }}
      />
    </div>
  );
}

/** Primary CTA — solid white (talent-flow scenes sit on dark fields). */
export function GoldCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn-solid-white">
      <span>{children}</span>
    </a>
  );
}

/** Quiet secondary entrance — gold-underlined serif link. */
export function QuietLink({
  href,
  children,
  dark = true,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-baseline gap-2.5"
      style={{
        fontFamily: SERIF,
        fontSize: "1.05rem",
        color: GOLD,
        textDecoration: "none",
        borderBottom: `1px solid ${dark ? "rgba(201,165,90,0.35)" : "rgba(201,165,90,0.5)"}`,
        paddingBottom: 5,
        transition:
          "border-color 0.45s cubic-bezier(0.22,1,0.36,1), color 0.45s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottomColor = GOLD;
        e.currentTarget.style.color = GOLD_LIGHT;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottomColor = dark
          ? "rgba(201,165,90,0.35)"
          : "rgba(201,165,90,0.5)";
        e.currentTarget.style.color = GOLD;
      }}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
        style={{ fontFamily: SANS, fontSize: "0.8em" }}
      >
        →
      </span>
    </a>
  );
}

/** Reduced-motion hook, re-exported so scenes share one import path. */
export function usePrm() {
  return useReducedMotion() ?? false;
}

/** Shorthand: fade a scene's content in after its entry boundary and out
    before its exit boundary, so field morphs happen over quiet frames. */
export const CONTENT_WINDOW: [number[], number[]] = [
  [0, 0.08, 0.92, 1],
  [0, 1, 1, 0],
];

export { motion, type MotionValue };
