"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

import {
  AccountCluster,
  NavLink,
  Wordmark,
} from "@/components/header/kit";
import { PRIMARY_NAV } from "@/lib/marketing-nav-links";
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
 */
export default function HeroChrome({
  progress,
  staticMode = false,
}: HeroChromeProps) {
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
    <motion.div
      data-hero-header
      className="pointer-events-none absolute inset-x-0 top-0 z-[103]"
      style={
        moving
          ? { y, opacity, visibility, willChange: "transform, opacity" }
          : { opacity: 1 }
      }
    >
      <div className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 md:px-12" style={{ paddingTop: 30, paddingBottom: 26 }}>
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
          <AccountCluster />
        </div>
      </div>
    </motion.div>
  );
}
