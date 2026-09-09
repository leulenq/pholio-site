"use client";

/**
 * THE INVITATION — the sitewide page cue.
 *
 * A small line naming what is below, over the pulsing gold divider. This is
 * the treatment the owner asked to keep and to standardise: every page on the
 * site (the landing page excepted, which owns its own chrome) carries one,
 * with the label written for that page.
 *
 * It deliberately overrules `docs/design-language/03-banned-ui.md` §2.3, which
 * bans scroll cues, and §8.2, which bans looping animation. Both are generic
 * anti-slop rules; this is a named brand asset with a written label, and the
 * owner's correction outranks the doc (`lessons.md` §31).
 *
 * The label is a real anchor. The click adds smooth travel; without it the
 * link still lands.
 */

import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EditorialVerticalDivider } from "@/components/EditorialVerticalDivider";

export function ScrollInvitation({
  label,
  targetId,
  color = "#C9A55A",
  align = "center",
  delay = 1.2,
  muted = true,
}: {
  label: string;
  targetId: string;
  color?: string;
  align?: "center" | "left";
  delay?: number;
  /** Ink fields carry the label at 60%; cream needs the full dark gold. */
  muted?: boolean;
}) {
  const reduce = useReducedMotion();

  const travel = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={travel}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduce ? 0 : delay, duration: 1 }}
      className={`group flex w-fit flex-col gap-4 no-underline ${
        align === "center" ? "items-center" : "items-start"
      }`}
    >
      <span
        className="font-sans text-[10px] uppercase tracking-[0.3em] whitespace-nowrap transition-colors duration-300"
        style={{ color: `${color}${muted ? "99" : ""}` }}
      >
        {label}
      </span>
      <EditorialVerticalDivider
        animation={reduce ? "none" : "travel"}
        color={color}
      />
      <style jsx>{`
        .group:hover span {
          color: ${color};
        }
      `}</style>
    </motion.a>
  );
}
