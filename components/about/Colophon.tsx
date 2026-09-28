"use client";

/**
 * VI. THE COLOPHON
 *
 * The quiet chapter, and the one with real reading in it. It arrives
 * immediately after the loudest moment on the page on purpose: the claim
 * was a scene, the proof is small print that does not perform
 * (`lessons.md` §31.4). A company that has to shout its refusals is
 * advertising them.
 *
 * Set as a spread, and the typography is the hierarchy: the group's name
 * is a mono label in the margin, the thing being promised is a serif deck,
 * and the mechanism under it is the only Inter column on the page. Space
 * rather than rules between the entries, which is how this site groups
 * (`03-banned-ui.md` §3.10, §4.3). One plate holds the right page and
 * bleeds off the outer edge, travelling slower than the column beside it.
 */

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { COLOPHON } from "./content";
import {
  Arrive,
  ArriveGroup,
  CREAM,
  Deck,
  Label,
  ON_CREAM,
  SHELL,
  Text,
  useStillComposition,
} from "./kit";
import { PLATE_DRIFT } from "./motion";

export default function Colophon() {
  const ref = useRef<HTMLElement>(null);
  const still = useStillComposition();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], [PLATE_DRIFT, -PLATE_DRIFT]);

  const [money, refusals] = COLOPHON.groups;

  return (
    <section
      ref={ref}
      id={COLOPHON.id}
      aria-labelledby="about-colophon-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: CREAM, color: ON_CREAM.statement }}
    >
      <h2 id="about-colophon-title" className="sr-only">
        The shape of the company
      </h2>

      {/* The recto. It bleeds off the outer edge, the way a plate does on a
          printed spread. */}
      <motion.div
        className="pointer-events-none absolute right-0 top-[16vh] hidden w-[38vw] lg:block"
        style={{ aspectRatio: "3 / 2", y: still ? 0 : plateY }}
      >
        <Image
          src="/about/book.webp"
          alt={COLOPHON.imageAlt}
          fill
          sizes="38vw"
          className="object-cover object-[46%_50%]"
        />
      </motion.div>

      <div className={`${SHELL} relative z-10 py-28 md:py-44`}>
        <div className="lg:max-w-[56%]">
          <Group label={money.label} rows={money.rows} />

          <div className="relative mt-20 aspect-[3/2] w-full lg:hidden">
            <Image
              src="/about/book.webp"
              alt={COLOPHON.imageAlt}
              fill
              sizes="100vw"
              className="object-cover object-[46%_50%]"
            />
          </div>

          <div className="mt-28 md:mt-40">
            <Group label={refusals.label} rows={refusals.rows} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({
  label,
  rows,
}: {
  label: string;
  rows: readonly { readonly term: string; readonly body: string }[];
}) {
  return (
    <ArriveGroup className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:gap-y-16" amount={0.08}>
      <Arrive className="md:col-span-4">
        <Label field="cream" as="h3" className="whitespace-nowrap">
          {label}
        </Label>
      </Arrive>

      {rows.map((row) => (
        <Arrive key={row.term} className="md:col-span-7 md:col-start-6">
          <Deck field="cream" size="clamp(1.35rem, 1.9vw, 1.95rem)" className="max-w-[24ch]">
            {row.term}
          </Deck>
          <Text field="cream" className="mt-4 max-w-[50ch]">
            {row.body}
          </Text>
        </Arrive>
      ))}
    </ArriveGroup>
  );
}
