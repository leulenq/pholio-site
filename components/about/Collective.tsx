"use client";

/**
 * THE COLLECTIVE
 *
 * The composition the owner asked to keep, recovered and then improved rather
 * than replaced. What is carried over from the previous version, deliberately:
 *
 *  - the large portrait triptych on cream, at a scale where the portraits
 *    occupy the page rather than illustrate a row
 *  - the display-serif name with the family name in gold italic
 *  - the gold micro-label naming the role
 *  - grayscale at rest, full colour and a slow push on hover
 *
 * What is improved:
 *
 *  - the biographies are always on the page. They were behind a hover, which
 *    hid the only thing that establishes why these three are credible, and
 *    hid it entirely on a phone.
 *  - the three columns no longer sit on one baseline. Each carries its own
 *    parallax, so the triptych moves as three plates at different depths.
 *  - the names are set larger than the old version and hang off the portrait's
 *    left edge, so the row has a typographic rhythm of its own.
 *  - the copy is researched and verifiable rather than promotional.
 */

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { COLLECTIVE } from "./content";
import {
  Arrive,
  ArriveGroup,
  CREAM,
  GOLD_DARK,
  ON_CREAM,
  ON_CREAM_FAINT,
  ON_CREAM_SOFT,
  SHELL,
  Verdict,
} from "./kit";
import { COLLECTIVE_PARALLAX } from "./motion";

export default function Collective() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      aria-labelledby="about-collective-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: CREAM, color: ON_CREAM }}
    >
      <div className={`${SHELL} pb-28 pt-24 md:pb-44 md:pt-40`}>
        <ArriveGroup>
          <Arrive>
            <span
              className="block font-sans text-[10px] uppercase tracking-[0.34em]"
              style={{ color: GOLD_DARK }}
            >
              {COLLECTIVE.label}
            </span>
          </Arrive>
          <Arrive>
            <h2
              id="about-collective-title"
              className="font-editorial mt-8 md:mt-10"
              style={{
                fontSize: "clamp(2.3rem, 5.2vw, 5.4rem)",
                lineHeight: 0.98,
                maxWidth: "16ch",
              }}
            >
              {COLLECTIVE.headlineBefore}{" "}
              <Verdict color={GOLD_DARK}>{COLLECTIVE.headlineVerdict}</Verdict>
              {COLLECTIVE.headlineAfter}
            </h2>
          </Arrive>
        </ArriveGroup>

        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-24 sm:grid-cols-3 md:mt-28 md:gap-x-10">
          {COLLECTIVE.people.map((person, i) => (
            <Portrait
              key={person.family}
              person={person}
              offset={COLLECTIVE_PARALLAX[i] ?? 0}
              progress={scrollYProgress}
              reduce={!!reduce}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Portrait({
  person,
  offset,
  progress,
  reduce,
  priority,
}: {
  person: (typeof COLLECTIVE.people)[number];
  offset: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean;
  priority: boolean;
}) {
  const y = useTransform(progress, [0, 1], [-offset, offset]);

  return (
    <motion.div style={reduce ? undefined : { y }}>
      <ArriveGroup amount={0.15}>
        <Arrive>
          {/* The plate. Grayscale at rest, colour and a slow push on hover:
              the one micro-interaction on the page, and the one place the
              site's grayscale register gives way, because the person arriving
              is the subject rather than the art direction. */}
          <div
            className="group relative w-full overflow-hidden"
            style={{ aspectRatio: "3 / 4", background: "#E7E1D7" }}
          >
            <Image
              src={person.src}
              alt={person.alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, 31vw"
              className="object-cover transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04] group-hover:[filter:grayscale(0)]"
              style={{ objectPosition: person.focus, filter: "grayscale(1)" }}
            />
          </div>
        </Arrive>

        <Arrive>
          <h3
            className="font-editorial mt-7 leading-[0.98]"
            style={{ fontSize: "clamp(1.9rem, 3vw, 3rem)" }}
          >
            {person.given}
            <br />
            <em
              className="font-editorial-italic"
              style={{ color: GOLD_DARK, fontStyle: "italic" }}
            >
              {person.family}
            </em>
          </h3>
        </Arrive>

        <Arrive>
          <p
            className="mt-4 font-sans text-[10px] uppercase tracking-[0.22em]"
            style={{ color: ON_CREAM_FAINT }}
          >
            {person.role}
          </p>
        </Arrive>

        <Arrive>
          <p
            className="mt-5 max-w-[36ch] font-sans text-[14px] font-light leading-[1.7]"
            style={{ color: ON_CREAM_SOFT }}
          >
            {person.bio}
          </p>
        </Arrive>
      </ArriveGroup>
    </motion.div>
  );
}
