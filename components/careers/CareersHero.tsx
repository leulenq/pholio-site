"use client";

/**
 * CAREERS HERO — ported from the previous site.
 *
 * This is `pholio-landing/components/CareersHero.tsx`, recovered and brought
 * across on the owner's instruction (2026-09-27: "Go inspect pholio-landing,
 * find and study its Careers page, then replicate that Careers page into this
 * repo"). It is a replication, not a reinterpretation: the composition, the
 * copy, the scale, the glow and the entrance are the previous page's
 * (`lessons.md` §32, recover means the previous markup).
 *
 * Three rules it deliberately does not follow, recorded here so nobody
 * "corrects" the page back into compliance by citing a document:
 *
 *   CLAUDE.md      says stop before copying a pattern from pholio-landing,
 *                  because that repo is the archive. Overruled for this page,
 *                  by the owner, for this page only.
 *   03-banned-ui   §2.1 bans the eyebrow above an H1, §2.3 bans the scroll
 *                  cue, §2.6 bans a gold glow behind a hero.
 *   lessons.md     §31.5 already overruled the scroll-cue ban for the site's
 *                  standing invitation, so the cue here is the smallest of
 *                  the three divergences.
 *
 * What changed in the port, and nothing else did: the page's footer comes
 * from the root layout here, so the archive's `MarketingFooter` import is
 * gone, and the archive's `<main>` wrapper would have nested inside this
 * site's own `<main>`, so the route mounts a `<div>`.
 */

import { motion, useReducedMotion } from "framer-motion";

import { EditorialVerticalDivider } from "@/components/EditorialVerticalDivider";

export function CareersHero() {
  /* See the note in CareersContent: the preference only removes the travel,
     never the composition. */
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-[#050505] px-6">
      <img
        src="https://images.unsplash.com/photo-1575354196644-9de51010f481?auto=format&fit=max&w=2400&q=80"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: "center 35%",
          filter: "grayscale(1) contrast(1.05)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,5,0.78) 0%, rgba(5,5,5,0.45) 72%)",
        }}
      />
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 165, 90, 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-8 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A55A]">
            Careers
          </span>
          <h1 className="font-editorial text-[10vw] leading-[1.0] text-white sm:text-[9vw] md:text-[8vw] lg:text-[7vw]">
            Build what
            <br />
            <span className="font-editorial-italic italic text-[#C9A55A]">
              modeling
            </span>
            <br />
            still lacks.
          </h1>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1, duration: reduce ? 0 : 1 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">
            Open roles
          </span>
          <EditorialVerticalDivider />
        </motion.div>
      </div>
    </section>
  );
}
