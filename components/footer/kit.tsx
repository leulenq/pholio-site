"use client";

/**
 * Footer machinery.
 *
 * ── What this deliberately does NOT reuse ──────────────────────────────────
 *
 * Nothing of the header's composition. Not `Kicker`, not `NavLink`, not
 * `ActionLink`, not `GoldSweep`, not its container geometry, not its type
 * scale. An earlier pass built the footer out of those and produced a mirrored
 * header rather than a footer; see lessons.md §1.
 *
 * Two things are imported, and both are *values* rather than compositions:
 * `TOKENS` for the colour ladder, so the two surfaces cannot drift to different
 * creams, and `Wordmark`, which is a fixed brand asset that must be identical
 * wherever it appears.
 *
 * ── What the footer does differently, on purpose ───────────────────────────
 *
 * No monospace. The header labels in tracked mono caps; a copyright line set
 * that way reads as a developer tool, and this site sells into modelling and
 * casting (lessons.md §3). The footer runs on two voices only: the display
 * serif for the product destinations and the signature, Inter for the group
 * labels and the clerical lists.
 *
 * No gold sweep. It is the header's edge and repeating it makes the original
 * weaker (lessons.md §2). The panel needs no drawn boundary at its top edge in
 * any case: it takes the whole viewport, so arriving in it *is* the transition.
 * Its rules are two horizontal hairlines with real material either side, and
 * three that stand vertically between the groups.
 *
 * One entrance, on one observer, once. The industry sample animates no footer
 * on entry (`05-industry-reference.md` §5.3) and that finding stands for a
 * footer. This is a closing panel that takes the screen and puts the header to
 * sleep, and a takeover that simply appears reads as a jump cut. The motion is
 * what makes it deliberate.
 */

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { TOKENS, Wordmark, type Field } from "@/components/header/kit";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { Instagram, Linkedin } from "lucide-react";

import { COOKIE_LABEL, SOCIAL, copyright } from "./content";

export interface FooterVariantProps {
  className?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   THE FOOTER'S OWN VALUES

   Two type voices, two text strengths, one rule, one ease. Colours come from
   the shared ink ladder; everything about how they are *set* is local.
   ══════════════════════════════════════════════════════════════════════ */

/* The page's own paper. The footer is one component under every route, so it
   does not own a colour: it prints on whatever the page above it ended on, ink
   under the home stage and cream under the legal corpus. An attempt at giving
   it a lifted paper of its own was reverted, because a near-match reads as a
   grey panel sitting on the page rather than as the same sheet. The footer's
   personality comes from the mark and the standing rules instead.

   Every colour below is a custom property set on the surface from the field's
   token ladder (see `FooterSurface`), so nothing in here names a polarity. */
export const PAPER = "var(--footer-paper)";
export const INK = "var(--footer-ink)";
export const MUTED = "var(--footer-muted)";
export const LABEL_MUTED = "var(--footer-label)";
export const HAIRLINE = "var(--footer-rule)";
export const GOLD = "var(--footer-gold)";

/** The group label's strength on each field. Fainter than `textFaint`: the
    label is the least important text in its own column. */
const LABEL_ALPHA: Record<Field, string> = {
  ink: "rgba(250,247,242,0.3)",
  cream: "rgba(15,23,42,0.36)",
};

function fieldVars(field: Field, paper: string | null): CSSProperties {
  const t = TOKENS[field];
  return {
    "--footer-paper": paper ?? t.surface,
    "--footer-ink": t.text,
    "--footer-muted": t.textMuted,
    "--footer-label": LABEL_ALPHA[field],
    "--footer-rule": t.rule,
    "--footer-gold": t.gold,
  } as CSSProperties;
}

const SKIP_BG = new Set(["rgba(0, 0, 0, 0)", "transparent"]);

/**
 * The paper the page ends on.
 *
 * Walks down from `<main>` along whichever in-flow child reaches its parent's
 * bottom edge, keeping the deepest opaque background found on the way. That is
 * the surface a visitor was reading immediately before the footer arrives,
 * which is the one the footer has to continue. Geometry rather than DOM order,
 * because routes end in fixed banners and null-rendering helpers as often as in
 * their last section.
 *
 * Returns the exact colour as well as the polarity, for the same reason the
 * header does: `/agency` is #08080c, not #050505, and the difference is a seam.
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

/** Re-reads the page end on navigation and whenever the page changes height,
    since most routes finish laying out after the footer has mounted.
    Overridden to dark theme ("ink") on the landing page ("/") only. */
function usePageEndField(): { field: Field; paper: string | null } {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [state, setState] = useState<{ field: Field; paper: string | null }>({
    field: "ink",
    paper: null,
  });

  useEffect(() => {
    if (isLandingPage) {
      setState({ field: "ink", paper: null });
      return;
    }

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
  }, [pathname, isLandingPage]);

  if (isLandingPage) {
    return { field: "ink", paper: null };
  }

  return state;
}

const SERIF = "var(--font-serif)";
const SANS = "var(--font-sans)";
const MONO = "var(--font-mono)";
const EASE = "cubic-bezier(0.22,1,0.36,1)";
/** The same curve as a tuple, for framer. */
const EASE_TUPLE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** The site's outer measure. Wider gutters than the header: the header is a
    band that has to clear a hero, the footer is a page that has to breathe. */
export const SHELL = "mx-auto w-full max-w-[1440px] px-6 md:px-14";

export function FooterSurface({
  field: forcedField,
  children,
  className = "",
}: {
  field?: Field;
  children: ReactNode;
  className?: string;
}) {
  const detected = usePageEndField();
  const field = forcedField ?? detected.field;
  const paper = forcedField ? null : detected.paper;
  return (
    <footer
      data-site-footer
      data-footer-trigger
      data-field={field}
      className={`relative z-20 flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden texture-grain ${className}`}
      style={{
        ...fieldVars(field, paper),
        background: PAPER,
        color: INK,
      }}
    >
      {children}
    </footer>
  );
}

/**
 * The mark, at the top of the panel, spanning the measure.
 *
 * This is the footer's subject and the reason it reads as a closing chapter
 * rather than a strip of links. It is the real `Wordmark` component, so the
 * letterforms, tracking and gold are the header's exactly; only the scale is
 * this surface's.
 *
 * On the size, which is the whole craft of this component.
 *
 * It is a container query unit, not a viewport unit. The mark has to fill the
 * *measure*, and the measure is not a fixed fraction of the viewport: the
 * gutters step from 24px to 56px at the `md` breakpoint and the container stops
 * growing at 1440px. Any single `vw` coefficient is therefore correct at one
 * width and wrong everywhere else, and the wrong direction clips the O. `cqi`
 * is 1% of the container's own inline size, so one number holds at every width
 * with no breakpoints and no cap.
 *
 * The coefficient is tuned against the *painted glyphs*, not the element box.
 * Letter-spacing and the font's right side bearing leave roughly 200px of empty
 * trailing space inside the box at this scale, so sizing the box to the measure
 * stops the visible mark about 15% short, and it reads as a mark that failed to
 * reach the edge rather than one set to it. The box is allowed to run past the
 * container; the surface clips, and what runs past is air.
 *
 * 23.4 lands the glyphs at 99% of the measure. Verified at 390, 768, 1024,
 * 1440, 1920 and 2560.
 *
 * It is deliberately not a link. The header's wordmark is the way home; a
 * viewport-wide click target at the bottom of the page is a trap, not a
 * navigation aid.
 */
export function FooterMark() {
  return (
    <div
      aria-hidden
      style={{ containerType: "inline-size", lineHeight: 0.86 }}
    >
      <Wordmark
        size="23.4cqi"
        tracking={0.06}
        color={GOLD}
        style={{ display: "block", whiteSpace: "nowrap", transition: "none" }}
      />
    </div>
  );
}

/**
 * Arrival.
 *
 * One observer for the whole panel, with the stagger coming from variants
 * rather than a delay on each part. The per-part version does not survive a
 * phone: the panel is a full viewport tall, so a visitor who lands at the
 * bottom of the document has its upper half above the viewport where it never
 * intersects and never fires, and they get blank paper above the columns.
 * Observing the surface means that if any of it is on screen, all of it
 * arrives.
 *
 * Reduced motion starts at the finished composition and never hides anything,
 * not even for a frame. The obvious-looking `initial={false}` version leaves
 * content stuck invisible forever, because `useReducedMotion()` is false during
 * SSR and the first render, so the hidden state is applied and there is no
 * target left to move it to once the preference resolves. Content gated behind
 * an animation that cannot fire is the one motion rule this repo will not bend.
 */
export function ArriveGroup({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** One beat of the arrival. Inherits its state from the enclosing
    `ArriveGroup`, so it carries no observer and no delay of its own. */
export function Arrive({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        shown: {
          opacity: 1,
          y: 0,
          transition: reduce
            ? { duration: 0 }
            : { duration: 0.85, ease: EASE_TUPLE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** The footer's single horizontal hairline. It sits above the signature line and has real
    material on both sides of it, which is the only condition under which this
    site draws one. */
export function Hairline({ style }: { style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{ display: "block", height: 1, background: HAIRLINE, ...style }}
    />
  );
}

/**
 * The divider, and it runs the other way.
 *
 * The header closes itself with a full-bleed horizontal gradient. Drawing
 * anything horizontal across the top of the footer competes with it, which is
 * the ruling in lessons.md §2. So the footer's structural mark is vertical: a
 * hairline standing between two real groups, the way a printed index or a
 * newspaper column is divided. Content on both sides, which is the only
 * condition under which this site draws a line at all, and no other surface
 * here uses one.
 *
 * It sits inside the row rather than reaching the gutters, and it stops where
 * the tallest column stops.
 */
/**
 * A standing rule between two groups.
 *
 * `display` is a class rather than an inline style on purpose. Inline it beat
 * the `hidden md:block` its caller passes, so all three rules rendered on a
 * phone as well, where the groups are stacked and each rule therefore had a
 * column on its left and nothing at all on its right. That is a hairline drawn
 * because the composition felt empty, which `03-banned-ui.md` §3.9 rules out.
 */
export function ColumnRule({ className = "block" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ width: 1, alignSelf: "stretch", background: HAIRLINE }}
    />
  );
}

/**
 * A group label.
 *
 * Smaller than the items it heads, which is the opposite of what this file did
 * a revision ago and the opposite of what looks intuitively right. Every site in
 * the industry sample sets it this way: Art + Commerce runs a 10px uppercase
 * label over 16px names, and the label is never the largest thing in its own
 * column. A label that outweighs its list is scaffolding pretending to be
 * content.
 *
 * Uppercase and tracked, but tracked at 0.09em. The header's mono `Kicker` sits
 * at 0.26em, which is more than double the widest tracking measured anywhere in
 * the space (0.03em to 0.12em), and that width is half the reason the mono read
 * as an instrument panel rather than a masthead. Sans here, not serif and not
 * mono: the display serif is spent on the destinations and the
 * signature, and a fourth job would dilute it.
 */
export function GroupLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h2
      style={{
        fontFamily: MONO,
        fontWeight: 400,
        fontSize: 9,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        lineHeight: 1,
        color: LABEL_MUTED,
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

type LinkTone = "product" | "clerical" | "signature";

/**
 * Three voices, and the sizes come from measurement rather than taste. See
 * `docs/design-language/05-industry-reference.md` §2.4 and §3.9.
 */
const TONE: Record<LinkTone, CSSProperties> = {
  /* Match the header's NavLink / ActionLink voice: sans, 11px, tracked
     uppercase caps. The footer used to speak in its own larger, mixed-voice
     register; it now shares the header's clerical treatment. */
  product: {
    fontFamily: SANS,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    lineHeight: 1,
    color: MUTED,
  },
  clerical: {
    fontFamily: SANS,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    lineHeight: 1,
    color: MUTED,
  },
  signature: {
    fontFamily: SERIF,
    fontSize: 13,
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "0.02em",
    textTransform: "none",
    lineHeight: 1,
    color: MUTED,
  },
};

/** Non-interactive text in one of the three voices. */
export function FooterText({
  tone = "clerical",
  children,
  style,
}: {
  tone?: LinkTone;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <span style={{ ...TONE[tone], ...style }}>{children}</span>;
}

/**
 * Every interactive thing in the footer. Hover is a colour shift and a 1px
 * rule, drawn with `scaleX` so it never touches layout.
 */
export function FooterLink({
  href,
  label,
  tone = "clerical",
  external = false,
  strong = false,
  onClick,
}: {
  href: string;
  label: string;
  tone?: LinkTone;
  external?: boolean;
  /** Full-strength ink. Prominence on this site is colour, never scale. */
  strong?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const props = {
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    className: "focus:outline-none focus-visible:underline",
    style: { textDecoration: "none", display: "inline-block" } as CSSProperties,
  };
  const body = <Mark label={label} tone={tone} hover={hover} strong={strong} />;

  return external ? (
    <a href={href} {...props}>
      {body}
    </a>
  ) : (
    <Link href={href} {...props}>
      {body}
    </Link>
  );
}

/** The withdrawal control, wearing the footer's own type rather than a button's. */
export function CookieControl({ tone = "signature" }: { tone?: LinkTone }) {
  const [hover, setHover] = useState(false);
  return (
    <CookiePreferencesButton
      label={COOKIE_LABEL}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="focus:outline-none focus-visible:underline"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Mark label={COOKIE_LABEL} tone={tone} hover={hover} />
    </CookiePreferencesButton>
  );
}

function Mark({
  label,
  tone,
  hover,
  strong = false,
}: {
  label: string;
  tone: LinkTone;
  hover: boolean;
  strong?: boolean;
}) {
  const base = TONE[tone];
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          ...base,
          fontWeight: strong ? 500 : base.fontWeight,
          color: hover ? GOLD : strong ? INK : base.color,
          transition: `color 0.3s ${EASE}`,
        }}
      >
        {label}
      </span>
    </span>
  );
}

/**
 * The imprint line: who owns this, and the withdrawal control.
 *
 * The wordmark used to sit here at scale beside the copyright. It came out for
 * two reasons: a 37px gold mark next to a 14px serif notice is an awkward pair
 * at any spacing, and the header already prints the mark at the top of the same
 * screen. The mark is in the paper now (`Watermark`), which is the one place it
 * can be large without being a repeat.
 */
export function Signature({ trailing }: { trailing?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-baseline sm:justify-between">
      <FooterText tone="signature">{copyright()}</FooterText>
      <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
        {trailing}
        <CookieControl />
      </div>
    </div>
  );
}

/**
 * The social channels.
 *
 * Marks, not buttons: no circle, no border, no fill, no pill. Hover is the same
 * colour shift every other link in here uses, and nothing scales.
 *
 * An entry with no `href` renders as an inert mark with its name still exposed
 * to assistive technology. Pholio has no accounts yet, and a link that goes
 * nowhere is worse than a mark that waits (see content.ts). Filling in a URL
 * turns it into a link with no other change.
 */
export function SocialRow() {
  return (
    <div className="flex items-center gap-6">
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
        transition: `color 0.3s ${EASE}`,
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

/**
 * The address at display scale, in gold.
 *
 * Not invented for this surface: every legal document in the repo already
 * closes on its contact address set in the display serif in gold, and this is
 * that move promoted from the corpus to the site.
 */
export function AddressLink({
  email,
  size = "clamp(0.9rem, 2vw, 1.1rem)",
}: {
  email: string;
  size?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={`mailto:${email}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="focus:outline-none focus-visible:underline"
      style={{
        fontFamily: SERIF,
        fontSize: size,
        letterSpacing: "-0.015em",
        lineHeight: 1.1,
        color: GOLD,
        textDecoration: hover ? "underline" : "none",
        textUnderlineOffset: "0.3em",
        textDecorationThickness: 1,
        transition: `color 0.3s ${EASE}`,
      }}
    >
      {email}
    </a>
  );
}
