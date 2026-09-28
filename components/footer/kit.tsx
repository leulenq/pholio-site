"use client";

/**
 * Footer machinery.
 *
 * ── What this deliberately does NOT reuse ──────────────────────────────────
 *
 * Nothing of the header's composition. Not `Kicker`, not `NavLink`, not
 * `ActionLink`, not its container geometry, not its type scale. An earlier pass
 * built the footer out of those and produced a mirrored header (lessons.md §1).
 *
 * Three things are imported, and all three are *values* rather than
 * compositions: `TOKENS` for the colour ladder, so the two surfaces cannot
 * drift to different creams, `Wordmark`, which is a fixed brand asset that must
 * be identical wherever it appears, and the gold. `GoldSweep` itself is not:
 * the header's is symmetric because it is the bottom edge of a band, and this
 * one is directional because it is a gesture. See `motion.ts` on the override.
 *
 * ── The surface ────────────────────────────────────────────────────────────
 *
 * The footer prints on whatever paper the page above it ended on. There is no
 * boundary, no panel and no plate: the page runs out of content, leaves a lot
 * of air, and is signed at the foot. That is why nothing here names a colour of
 * its own and every value below comes from a field token.
 */

import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin } from "lucide-react";

import { TOKENS, Wordmark, type Field } from "@/components/header/kit";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

import { COOKIE_LABEL, SOCIAL } from "./content";
import {
  BASELINE_DROP_EM,
  BEAT,
  CONTENTS_RISE,
  NAME_FALL,
  STROKE_CLIP,
  STROKE_GRADIENT,
  TRIGGER_AMOUNT,
  arrive,
  stroke as strokeEase,
} from "./motion";

/* ══════════════════════════════════════════════════════════════════════
   FIELD
   ══════════════════════════════════════════════════════════════════════ */

export const PAPER = "var(--footer-paper)";
export const INK = "var(--footer-ink)";
export const MUTED = "var(--footer-muted)";
export const UTILITY = "var(--footer-utility)";
export const GOLD = "var(--footer-gold)";

/**
 * The company pages, one step back from the destinations. Prominence on this
 * site is colour, never scale (foundations §5), so the two ranks of navigation
 * are the same size and differ only here.
 *
 * The step used to be 0.66 / 0.62 and it was too wide: About, Careers, Contact
 * and Press are real destinations, not metadata about the site, and at that
 * strength they read as a caption under the ones that matter. The rank is still
 * legible at 0.84 — set the two lists side by side and the order is obvious —
 * but both now read as navigation.
 */
const SECOND_RANK: Record<Field, string> = {
  /* Not the same number on both fields. Light type on a dark ground blooms, so
     0.84 on the velvet reads as the same step that 0.78 gives on cream, and
     matching the figures would make the rank vanish on ink and stay obvious on
     cream. Measured by eye against both, which is the only way to set this. */
  ink: "rgba(250,247,242,0.8)",
  cream: "rgba(15,23,42,0.78)",
};

/** The utilities. Quiet, and still past 4.5:1 on either paper. */
const UTILITY_INK: Record<Field, string> = {
  ink: "rgba(250,247,242,0.56)",
  cream: "rgba(15,23,42,0.56)",
};

function fieldVars(field: Field, paper: string | null): CSSProperties {
  const t = TOKENS[field];
  return {
    "--footer-paper": paper ?? t.surface,
    "--footer-ink": t.text,
    "--footer-muted": SECOND_RANK[field],
    "--footer-utility": UTILITY_INK[field],
    "--footer-gold": t.gold,
  } as CSSProperties;
}

const SERIF = "var(--font-serif)";
const SANS = "var(--font-sans)";
const EASE = "cubic-bezier(0.22,1,0.36,1)";

/** The site's outer measure, and the length of the stroke. */
export const SHELL = "mx-auto w-full max-w-[1440px] px-6 md:px-14";

/* ══════════════════════════════════════════════════════════════════════
   THE PAPER THE PAGE ENDS ON
   ══════════════════════════════════════════════════════════════════════ */

const SKIP_BG = new Set(["rgba(0, 0, 0, 0)", "transparent"]);

/**
 * Walks down from `<main>` along whichever in-flow child reaches its parent's
 * bottom edge, keeping the deepest opaque background found on the way. That is
 * the surface a visitor was reading immediately before the footer, and the one
 * it has to continue. Geometry rather than DOM order, because routes end in
 * fixed banners and null-rendering helpers as often as in their last section.
 *
 * The exact colour as well as the polarity, for the same reason the header
 * samples one: `/agency` ends on #08080c, not #050505, and the difference is a
 * seam.
 */
function readPageEnd(): { field: Field; paper: string } | null {
  let node: Element | null = document.querySelector("main");
  let found: { field: Field; paper: string } | null = null;

  while (node) {
    const bg = window.getComputedStyle(node).backgroundColor;
    const match = SKIP_BG.has(bg)
      ? null
      : bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (match && (match[4] === undefined || Number(match[4]) >= 0.85)) {
      const [r, g, b] = [match[1], match[2], match[3]].map(Number);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      found = {
        field: luminance > 0.55 ? "cream" : "ink",
        paper: `rgb(${r}, ${g}, ${b})`,
      };
    }

    const bottom = node.getBoundingClientRect().bottom;
    let next: Element | null = null;
    for (const child of Array.from(node.children).reverse()) {
      const rect = child.getBoundingClientRect();
      if (rect.height === 0) continue;
      const position = window.getComputedStyle(child).position;
      if (position === "fixed" || position === "absolute") continue;
      if (rect.bottom >= bottom - 2) next = child;
      break;
    }
    node = next;
  }

  return found;
}

/**
 * Re-reads the page end on navigation and whenever the page changes height,
 * since most routes finish laying out after the footer has mounted.
 *
 * There is no per-route override any more. An earlier version forced the ink
 * field on `/`, which put a black plate under a page that ends on cream, and a
 * rectangle attached to the bottom of the page is the one thing this surface
 * must not look like.
 */
function usePageEnd(): { field: Field; paper: string | null } {
  const pathname = usePathname();
  const [state, setState] = useState<{ field: Field; paper: string | null }>({
    field: "ink",
    paper: null,
  });

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const end = readPageEnd();
        setState((prev) =>
          end && (prev.field !== end.field || prev.paper !== end.paper)
            ? end
            : prev,
        );
      });
    };
    /* A ResizeObserver reports once on `observe`, which is the first read. */
    const observer = new ResizeObserver(update);
    observer.observe(main);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return state;
}

/* ══════════════════════════════════════════════════════════════════════
   THE SCENE
   ══════════════════════════════════════════════════════════════════════ */

export interface Scene {
  /** True once the footer has arrived and the signing has begun. Latches. */
  signed: boolean;
  reduce: boolean;
}

/** One transition for a beat, or no transition at all under reduced motion. */
export function beat(
  scene: Scene,
  { delay, duration }: { delay: number; duration: number },
  ease = arrive,
) {
  return scene.reduce ? { duration: 0 } : { delay, duration, ease };
}

export function FooterSurface({
  field: forcedField,
  children,
}: {
  field?: Field;
  children: (scene: Scene) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  /* `once` latches it: the signing happens the first time the footer is
     reached and never replays, however many times it is scrolled past. */
  const inView = useInView(ref, { once: true, amount: TRIGGER_AMOUNT });
  const scene: Scene = { signed: inView || reduce, reduce };
  const detected = usePageEnd();
  const field = forcedField ?? detected.field;
  const paper = forcedField ? null : detected.paper;

  return (
    <footer
      ref={ref}
      data-site-footer
      data-field={field}
      className="relative z-20 w-full overflow-hidden texture-grain"
      style={{
        ...fieldVars(field, paper),
        background: PAPER,
        color: INK,
      }}
    >
      {/* The header does NOT stand down for this footer, and this marker is
          where that decision lives. The takeover exists for a panel that owns
          the screen; this footer is about 600px, with the page's last section
          still in frame beside it, so hiding the bar would be hiding chrome
          over a page the visitor is still reading. Parked at the foot, where it
          can never cross the observer's line. */}
      <span
        aria-hidden
        data-footer-trigger
        className="pointer-events-none absolute bottom-0 left-0 h-px w-px"
      />
      {children(scene)}
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   THE THREE MOVES
   ══════════════════════════════════════════════════════════════════════ */

/**
 * The page's last words, coming to rest.
 *
 * One move for the whole block rather than a stagger per column. A staggered
 * footer is a footer performing, and this one appears under every page on the
 * site: by the ninetieth reading the choreography is the only thing left to
 * notice.
 */
export function Contents({
  scene,
  children,
  className,
  style,
}: {
  scene: Scene;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ y: CONTENTS_RISE }}
      animate={{ y: scene.signed ? 0 : CONTENTS_RISE }}
      transition={beat(scene, BEAT.contents)}
    >
      {children}
    </motion.div>
  );
}

/**
 * The stroke.
 *
 * A 1px gradient the length of the measure, drawn left to right by a retreating
 * clip. It is the footer's one gesture and the thing the name is signed on, and
 * it is why the mark can be 64px: the subject of the composition is the act of
 * signing, not the logotype.
 */
export function Stroke({ scene }: { scene: Scene }) {
  return (
    <motion.span
      aria-hidden
      initial={{ clipPath: STROKE_CLIP.undrawn }}
      animate={{
        clipPath: scene.signed ? STROKE_CLIP.drawn : STROKE_CLIP.undrawn,
      }}
      transition={beat(scene, BEAT.stroke, strokeEase)}
      style={{
        display: "block",
        height: 1,
        width: "100%",
        background: STROKE_GRADIENT,
      }}
    />
  );
}

/**
 * The name, set down on the line.
 *
 * The real `Wordmark`, so the letterforms, tracking and gold are the header's
 * exactly; only the scale and the placement belong to this surface. It sits
 * with its baseline on the stroke, which puts the O's overshoot a hair below
 * the rule, the way a round letter is drawn against a line and what keeps the
 * signature from looking aligned rather than written.
 *
 * It travels down and decelerates into place, and it is on the stage from the
 * first frame, so no frame of the arrival is missing its signature.
 *
 * Deliberately not a link: the header's wordmark is the way home, and a wide
 * click target at the foot of every page is a trap rather than a navigation
 * aid. Hidden from assistive technology, which has the site's name already.
 */
export function Signature({ scene }: { scene: Scene }) {
  return (
    <motion.span
      aria-hidden
      className="block text-[42px] md:text-[64px]"
      initial={{ y: -NAME_FALL }}
      animate={{ y: scene.signed ? 0 : -NAME_FALL }}
      transition={beat(scene, BEAT.name)}
      style={{ marginBottom: `-${BASELINE_DROP_EM}em` }}
    >
      <Wordmark
        size="1em"
        tracking={0.06}
        color={GOLD}
        style={{ display: "block", transition: "none" }}
      />
    </motion.span>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   TYPE
   ══════════════════════════════════════════════════════════════════════ */

type Rank = "destination" | "company";

const NAV: Record<Rank, string> = {
  destination: INK,
  company: MUTED,
};

/** A destination. Display serif, because these are the only words in the footer
    a visitor came looking for. */
export function NavLink({
  href,
  label,
  rank,
}: {
  href: string;
  label: string;
  rank: Rank;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-block text-[22px] leading-[1.45] focus:outline-none focus-visible:underline md:text-[24px]"
      style={{
        fontFamily: SERIF,
        textDecoration: "none",
        color: hover ? GOLD : NAV[rank],
        transition: `color 0.42s ${EASE}`,
      }}
    >
      {label}
    </Link>
  );
}

/**
 * The utility voice.
 *
 * The legal links, the cookie control and the copyright all speak in it, which
 * is the point: they are one class of thing, and giving the copyright a
 * treatment of its own is what made it read as inherited. Inter, the site's
 * clerical typeface, at 11.5px with a little tracking and tabular lining
 * figures, in sentence case.
 *
 * Not mono: `lessons.md` §3 rules that out for a copyright line, and this site
 * sells into casting and fashion rather than into engineering. Not the serif
 * italic it replaces: italic on this site means a verdict and nothing else
 * (`03-banned-ui.md` §6.5), and a copyright notice is not a verdict. Not
 * tracked caps: at this size that is the eyebrow signature the ban list
 * rations, and it would put the smallest thing in the frame in the loudest
 * costume.
 */
const UTILITY_TYPE: CSSProperties = {
  fontFamily: SANS,
  fontSize: 11.5,
  fontWeight: 450,
  letterSpacing: "0.045em",
  lineHeight: 1.7,
  fontVariantNumeric: "lining-nums tabular-nums",
  color: UTILITY,
};

export function UtilityLink({ href, label }: { href: string; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-block focus:outline-none focus-visible:underline"
      style={{
        ...UTILITY_TYPE,
        textDecoration: "none",
        color: hover ? GOLD : UTILITY,
        transition: `color 0.42s ${EASE}`,
      }}
    >
      {label}
    </Link>
  );
}

/** The withdrawal control, in the utility voice rather than a button's. */
export function CookieControl() {
  const [hover, setHover] = useState(false);
  return (
    <CookiePreferencesButton
      label={COOKIE_LABEL}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="focus:outline-none focus-visible:underline"
      style={{
        ...UTILITY_TYPE,
        color: hover ? GOLD : UTILITY,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        transition: `color 0.42s ${EASE}`,
      }}
    >
      {COOKIE_LABEL}
    </CookiePreferencesButton>
  );
}

/** The imprint. The one line in the footer that is not a destination, so it is
    the one line that does not answer a pointer. */
export function Imprint({ children }: { children: ReactNode }) {
  return <span style={UTILITY_TYPE}>{children}</span>;
}

/**
 * The address, and the invitation.
 *
 * Gold, at the navigation's size. Colour is how this site says "this one", and
 * spending it here is what lets the address be the primary invitation without
 * being set larger than the destinations beside it: it is the only gold above
 * the stroke, and the eye finds it before anything else in the upper frame.
 *
 * Not invented for this surface either. Every legal document in the repo
 * already closes on its contact address set in the display serif in gold, so
 * this is that move promoted from the corpus to the site.
 *
 * Because it rests gold, hover cannot be the usual shift to gold. It takes the
 * other half of the site's hover vocabulary instead, a 1px rule, which is the
 * same treatment the legal documents give their addresses.
 */
export function AddressLink({ email }: { email: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={`mailto:${email}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-block text-[22px] leading-[1.45] focus:outline-none focus-visible:underline md:text-[24px]"
      style={{
        fontFamily: SERIF,
        color: GOLD,
        textDecoration: hover ? "underline" : "none",
        textDecorationThickness: 1,
        textUnderlineOffset: "0.28em",
        transition: `text-decoration-color 0.42s ${EASE}`,
      }}
    >
      {email}
    </a>
  );
}

/**
 * The channels. Marks, not buttons: no circle, no border, no fill, no pill.
 *
 * An entry with no `href` renders as an inert mark with its name still exposed
 * to assistive technology. Pholio has no accounts yet, and a link that goes
 * nowhere is worse than a mark that waits (see content.ts).
 */
export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {SOCIAL.map((channel) => (
        <SocialMark key={channel.label} {...channel} />
      ))}
    </div>
  );
}

function SocialMark({ label, href }: { label: string; href: string | null }) {
  const [hover, setHover] = useState(false);
  const glyph = (
    <span
      style={{
        display: "block",
        color: hover ? GOLD : MUTED,
        transition: `color 0.42s ${EASE}`,
      }}
    >
      {label === "Instagram" ? (
        <Instagram size={18} strokeWidth={1.25} />
      ) : label === "LinkedIn" ? (
        <Linkedin size={18} strokeWidth={1.25} />
      ) : (
        <XMark />
      )}
    </span>
  );

  const hoverProps = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  return href ? (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="focus:outline-none focus-visible:underline"
      {...hoverProps}
    >
      {glyph}
    </a>
  ) : (
    <span role="img" aria-label={label} {...hoverProps}>
      {glyph}
    </span>
  );
}

/** Lucide's `Twitter` is still the bird, which is four years out of date, and
    its `X` is a close button. The current mark is one path. */
function XMark() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z" />
    </svg>
  );
}
