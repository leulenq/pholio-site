"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import {
  AccountCluster,
  IndexPanel,
  IndexTrigger,
  NavLink,
  TOKENS,
} from "@/components/header/kit";
import { PRIMARY_NAV } from "@/lib/marketing-nav-links";
import { useMediaQuery } from "./useMediaQuery";
import { WORDMARK_EXIT } from "./motion";

interface HeroChromeProps {
  /** The Hero's one scroll source. Omit it for the reduced-motion still. */
  progress?: MotionValue<number>;
  staticMode?: boolean;
}

/**
 * The hero-only navigation is part of the Hero composition, not a second
 * sitewide header. Its initial geometry intentionally matches the original
 * hero treatment: the same top/bottom inset, max width, and left/right rails.
 *
 * It leaves on the same motion as the large wordmark. The header therefore
 * cannot remain behind as an unrelated fixed layer while the wordmark exits.
 *
 * ── The narrow stage ──────────────────────────────────────────────────────
 *
 * The wide composition is five items on one rail: three routes left, the
 * account cluster right, held apart by a viewport's worth of gutter. There is
 * no gutter on a phone. Laid out at 390 the row runs 15px past the right edge,
 * `STUDIO+` and `LOG IN` touch, and `Apply free` is cut in half — a designed
 * rail turned into a clipped list.
 *
 * So the narrow stage does not take the rail at all. It takes the site's own
 * navigation pattern: one `INDEX` mark in the top-right corner, opening the
 * full index panel. That is a smaller composition, not a squeezed one, and it
 * carries more than the rail did (every route, plus account) in less space.
 *
 * The wordmark is deliberately not repeated beside it. The opening frame's
 * whole subject is PHOLIO at display scale; setting the name again at 24px in
 * the corner of that frame is the mistake `lessons.md` §14.1 names.
 */
export default function HeroChrome({
  progress,
  staticMode = false,
}: HeroChromeProps) {
  const narrow = useMediaQuery("(max-width: 767px)");
  const reduceMotion = !!useReducedMotion();
  const pathname = usePathname() ?? "/";
  const [indexOpen, setIndexOpen] = useState(false);

  const staticProgress = useMotionValue(0);
  const timeline = progress ?? staticProgress;
  const moving = Boolean(progress) && !staticMode;

  const y = useTransform(
    timeline,
    [WORDMARK_EXIT.start, WORDMARK_EXIT.peak, WORDMARK_EXIT.end],
    [0, -190, -280],
  );
  const opacity = useTransform(
    timeline,
    [WORDMARK_EXIT.start, WORDMARK_EXIT.peak, WORDMARK_EXIT.end],
    [1, 0.32, 0],
  );
  const visibility = useTransform(
    timeline,
    [WORDMARK_EXIT.start, WORDMARK_EXIT.end, WORDMARK_EXIT.end + 0.001],
    ["visible", "visible", "hidden"],
  );

  return (
    <>
      <motion.div
        data-hero-header
        className="pointer-events-none absolute inset-x-0 top-0 z-[103]"
        style={
          moving
            ? { y, opacity, visibility, willChange: "transform, opacity" }
            : { opacity: 1 }
        }
      >
        <div
          className={`relative mx-auto flex w-full max-w-[1440px] items-center px-6 md:px-12 ${
            narrow ? "justify-end" : "justify-between"
          }`}
          style={{ paddingTop: 30, paddingBottom: 26 }}
        >
          {narrow ? (
            <div className="pointer-events-auto">
              <IndexTrigger
                open={indexOpen}
                onToggle={() => setIndexOpen((v) => !v)}
                label="Index"
                tokens={indexOpen ? { ...TOKENS.ink, text: "#FAF7F2" } : TOKENS.ink}
              />
            </div>
          ) : (
            <>
              <nav className="pointer-events-auto flex items-center gap-6 md:gap-8">
                {PRIMARY_NAV.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={false}
                    size={11}
                    tracking={0.16}
                  />
                ))}
              </nav>

              <div className="pointer-events-auto">
                <AccountCluster
                  closeSignal={moving ? timeline : undefined}
                  closeAt={WORDMARK_EXIT.start}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Outside the animated wrapper on purpose: a transformed ancestor would
          make the panel's `fixed` positioning relative to a layer that is
          itself travelling out of the frame. */}
      {narrow ? (
        <IndexPanel
          open={indexOpen}
          onClose={() => setIndexOpen(false)}
          pathname={pathname}
          reduceMotion={reduceMotion}
          full
          top={0}
        />
      ) : null}
    </>
  );
}
