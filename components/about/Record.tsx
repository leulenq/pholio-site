"use client";

/**
 * THE RECORD
 *
 * The quiet after the loud. THE LINE says three things at the size of the
 * screen; this scene proves each of them at the size of a document, on the
 * ink field, in the register of the legal pages. The contrast between the two
 * is the point: the claim is a scene, the proof is small print that does not
 * need to perform.
 *
 * The rows are a numbered register, not a card grid: a mono ordinal on real
 * data, the term, and the mechanism. One hairline per row, with material on
 * both sides of it.
 */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { RECORD } from "./content";
import {
  Arrive,
  ArriveGroup,
  GOLD,
  HAIR_INK,
  INK,
  ON_INK,
  ON_INK_FAINT,
  ON_INK_SOFT,
  SHELL,
} from "./kit";

export default function Record() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <section
      ref={ref}
      aria-labelledby="about-record-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: INK, color: ON_INK }}
    >
      <div className={`${SHELL} grid gap-y-14 pb-28 pt-24 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-x-20 md:pb-40 md:pt-36`}>
        <motion.div
          className="md:sticky md:top-32 md:h-fit"
          style={reduce ? undefined : { y: headingY }}
        >
          <ArriveGroup>
            <Arrive>
              <h2
                id="about-record-title"
                className="font-editorial"
                style={{
                  fontSize: "clamp(1.9rem, 3.2vw, 3.2rem)",
                  lineHeight: 1.06,
                  maxWidth: "15ch",
                }}
              >
                {RECORD.heading}
              </h2>
            </Arrive>
            <Arrive>
              <p
                className="mt-5 max-w-[34ch] font-sans text-[14px] font-light leading-[1.7]"
                style={{ color: ON_INK_SOFT }}
              >
                {RECORD.lede}
              </p>
            </Arrive>
          </ArriveGroup>
        </motion.div>

        <ArriveGroup amount={0.05}>
          {RECORD.rows.map((row, i) => (
            <Arrive
              key={row.term}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 py-6 md:gap-x-8 md:py-7"
              style={{ borderTop: `1px solid ${HAIR_INK}` }}
            >
              <span
                className="font-mono text-[11px] leading-[1.9] tracking-[0.14em]"
                style={{ color: GOLD }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans text-[15px] font-medium leading-[1.5] md:text-[16px]">
                  {row.term}
                </h3>
                <p
                  className="mt-2 max-w-[62ch] font-sans text-[14px] font-light leading-[1.7] md:text-[15px]"
                  style={{ color: ON_INK_FAINT }}
                >
                  {row.body}
                </p>
              </div>
            </Arrive>
          ))}
        </ArriveGroup>
      </div>
    </section>
  );
}
