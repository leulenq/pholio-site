"use client";

/**
 * WHERE PHOLIO STANDS
 *
 * The cream section the hero's invitation points to. The thread arrives from
 * above, draws down the left edge, and dissolves just before the heading; the
 * heading hangs from it. Below: why the company exists, in three paragraphs
 * of checkable fact; the commitments, set as a register (statement on the
 * left, mechanism on the right, one hairline per row with material on both
 * sides); and the one-sentence philosophy the language system allows a brand
 * surface. Everything here arrives once and holds still.
 */

import { useRef } from "react";
import { useScroll } from "framer-motion";

import { POSITION } from "./content";
import {
  Arrive,
  ArriveGroup,
  CREAM,
  GOLD_DARK,
  HAIR_CREAM,
  ON_CREAM,
  ON_CREAM_SOFT,
  SHELL,
  Thread,
  Verdict,
} from "./kit";
import { POSITION_LEAD, POSITION_THREAD_OFFSET } from "./motion";

export default function Position() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...POSITION_THREAD_OFFSET],
  });

  return (
    <section
      ref={ref}
      id={POSITION.id}
      aria-labelledby="about-position-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: CREAM, color: ON_CREAM, scrollMarginTop: 0 }}
    >
      <div
        className={`${SHELL} relative pb-28 md:pb-40`}
        style={{ paddingTop: POSITION_LEAD }}
      >
        {/* The second half of the thread: from the section's top edge to the
            heading, at the same left edge the hero drew it on. */}
        <div
          className="absolute left-6 top-0 md:left-14"
          style={{ height: POSITION_LEAD, width: 1 }}
        >
          <Thread progress={scrollYProgress} color={GOLD_DARK} />
        </div>

        <ArriveGroup className="max-w-[62ch]">
          <Arrive>
            <h2
              id="about-position-title"
              className="font-editorial"
              style={{ fontSize: "clamp(2.2rem, 4.4vw, 4.4rem)", lineHeight: 1.04 }}
            >
              {POSITION.heading}
            </h2>
          </Arrive>
          {POSITION.why.map((paragraph, i) => (
            <Arrive key={i}>
              <p
                className={`${i === 0 ? "mt-10 md:mt-14" : "mt-6"} font-sans text-[16px] font-light leading-[1.7] md:text-[18px]`}
                style={{ color: i === POSITION.why.length - 1 ? ON_CREAM : ON_CREAM_SOFT }}
              >
                {paragraph}
              </p>
            </Arrive>
          ))}
        </ArriveGroup>

        <ArriveGroup className="mt-24 md:mt-32" amount={0.08}>
          {POSITION.commitments.map((item) => (
            <Arrive
              key={item.statement}
              className="grid grid-cols-1 gap-y-3 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-16 md:py-9"
              style={{ borderTop: `1px solid ${HAIR_CREAM}` }}
            >
              <h3
                className="font-editorial max-w-[18ch]"
                style={{ fontSize: "clamp(1.45rem, 2.1vw, 2.05rem)", lineHeight: 1.12 }}
              >
                {item.statement}
              </h3>
              <p
                className="max-w-[52ch] font-sans text-[15px] font-light leading-[1.65] md:pt-1 md:text-[16px]"
                style={{ color: ON_CREAM_SOFT }}
              >
                {item.mechanism}
              </p>
            </Arrive>
          ))}
        </ArriveGroup>

        <ArriveGroup className="mt-24 md:mt-36" amount={0.3}>
          <Arrive>
            <p
              className="font-editorial max-w-[22ch]"
              style={{ fontSize: "clamp(1.9rem, 3.6vw, 3.6rem)", lineHeight: 1.08 }}
            >
              {POSITION.closeBefore}{" "}
              <Verdict color={GOLD_DARK}>{POSITION.closeVerdict}</Verdict>
              {POSITION.closeAfter}
            </p>
          </Arrive>
        </ArriveGroup>
      </div>
    </section>
  );
}
