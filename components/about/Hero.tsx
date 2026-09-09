"use client";

/**
 * THE HERO
 *
 * One statement, one figure, one invitation, and the thread.
 *
 * The statement is the page's belief. The figure is the person the whole
 * platform is about, standing in the ink rather than framed by it: the
 * photograph's own black dissolves into the field through a soft mask, so
 * there is no plate edge to read as a crop. The invitation names the section
 * that backs the statement up, and the thread hangs from it: a gold sweep at
 * rest, a line that draws down the text column's left edge as the reader
 * scrolls, and keeps drawing across the field change into the next section
 * until it reaches that section's heading. The scroll reveals the link
 * between the claim and its backing; nothing else on the hero moves.
 *
 * The first frame stands on its own. Freeze it at scroll zero and it is a
 * complete composition: statement, figure, sweep.
 */

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

import { HERO, POSITION } from "./content";
import {
  Arrive,
  ArriveGroup,
  GOLD,
  INK,
  ON_INK,
  ON_INK_SOFT,
  RuleLink,
  SHELL,
  Thread,
  Verdict,
} from "./kit";
import { HERO_THREAD_OFFSET } from "./motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...HERO_THREAD_OFFSET],
  });

  /* The invitation is a real anchor. The handler only adds the smooth
     travel; without JavaScript, or with it, the link still lands. */
  const goToPosition = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(POSITION.id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${POSITION.id}`);
  };

  return (
    <section
      ref={ref}
      aria-labelledby="about-hero-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: INK, color: ON_INK }}
    >
      <div
        className={`${SHELL} relative grid min-h-mobile-screen grid-cols-[1px_minmax(0,1fr)] gap-x-6 md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] md:gap-x-10`}
        style={{
          gridTemplateRows: "auto minmax(0, 1fr)",
          paddingTop: "clamp(7.5rem, 20vh, 12rem)",
        }}
      >
        {/* The statement */}
        <ArriveGroup
          className="col-span-2 row-start-1 md:col-span-1 md:col-start-1"
          amount={0}
        >
          <Arrive>
            <h1
              id="about-hero-title"
              className="font-editorial"
              style={{
                fontSize: "clamp(2.7rem, 6.1vw, 6.5rem)",
                lineHeight: 1.02,
                maxWidth: "13.5ch",
              }}
            >
              {HERO.headlineBefore}{" "}
              <Verdict color={GOLD}>{HERO.verdict}</Verdict>
              {HERO.headlineAfter}
            </h1>
          </Arrive>
          <Arrive>
            <p
              className="mt-8 max-w-[40ch] font-sans text-[15px] font-light leading-relaxed md:mt-10 md:text-[17px]"
              style={{ color: ON_INK_SOFT }}
            >
              {HERO.support}
            </p>
          </Arrive>
          <Arrive className="mt-10 md:mt-12">
            <RuleLink
              href={`#${POSITION.id}`}
              onClick={goToPosition}
              color={GOLD}
              className="text-[13px] tracking-[0.02em] md:text-[14px]"
            >
              {HERO.invitation}
            </RuleLink>
          </Arrive>
        </ArriveGroup>

        {/* The thread. Its row runs from under the invitation to the section's
            bottom edge, so the line can hand over to the next section with no
            measured coordinate involved. */}
        <div
          className="relative col-start-1 row-start-2 mt-4 md:mt-5"
          style={{ minHeight: 140 }}
        >
          <Thread progress={scrollYProgress} color={GOLD} lead sweep />
        </div>

        {/* The figure. In the second column beside the thread on a phone; on a
            desktop it stands the full height of the section at the right,
            outside the grid, so its scale is set by the viewport and not by
            the text column. The mask fades its top and foot into the ink so
            there is no plate edge to read as a crop. */}
        <div
          className="relative col-start-2 row-start-2 mt-2 w-full md:absolute md:col-auto md:row-auto md:inset-y-0 md:right-0 md:mt-0 md:w-auto"
          style={{
            aspectRatio: "2 / 3",
            mask: "linear-gradient(to bottom, transparent, #000 10%, #000 84%, transparent) intersect, linear-gradient(to right, transparent, #000 26%, #000 92%, transparent)",
          }}
        >
          <Image
            src="/about/origin-dark.jpg"
            alt={HERO.figureAlt}
            fill
            priority
            sizes="(max-width: 768px) 70vw, 46vw"
            className="object-cover"
            style={{ filter: "grayscale(1)" }}
          />
        </div>
      </div>
    </section>
  );
}
