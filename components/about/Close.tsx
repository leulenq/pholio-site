"use client";

/**
 * THE CLOSE
 *
 * The one sentence the language system allows a brand surface, set as three
 * lines at display scale, and then the two doors: one for talent, one for
 * everyone else who reads this page.
 *
 * The lines arrive on a stagger and rise slowly against the scroll, so the
 * page ends on something still moving rather than something parked. The
 * closing panel takes the screen from here.
 */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { SIGNUP_HREF } from "@/components/header/kit";

import { CLOSE } from "./content";
import {
  Arrive,
  ArriveGroup,
  GOLD,
  HAIR_INK,
  INK,
  ON_INK,
  ON_INK_SOFT,
  RuleLink,
  SHELL,
  Verdict,
} from "./kit";

export default function Close() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      aria-labelledby="about-close-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: INK, color: ON_INK }}
    >
      <div className={`${SHELL} pb-24 pt-28 md:pb-36 md:pt-48`}>
        <motion.div style={reduce ? undefined : { y }}>
          <ArriveGroup>
            {CLOSE.lines.map((line, i) => (
              <Arrive key={line.plain}>
                <p
                  id={i === 0 ? "about-close-title" : undefined}
                  className="font-editorial"
                  style={{
                    fontSize: "clamp(2.1rem, 5.4vw, 5.6rem)",
                    lineHeight: 1.02,
                    maxWidth: "17ch",
                    marginLeft: i === 1 ? "8%" : i === 2 ? "16%" : undefined,
                  }}
                >
                  {line.plain}
                  {"verdict" in line && line.verdict ? (
                    <>
                      {" "}
                      <Verdict color={GOLD}>{line.verdict}</Verdict>
                    </>
                  ) : null}
                </p>
              </Arrive>
            ))}
          </ArriveGroup>
        </motion.div>

        <ArriveGroup className="mt-24 md:mt-36" amount={0.3}>
          {CLOSE.doors.map((door) => (
            <Arrive
              key={door.term}
              className="grid grid-cols-1 gap-y-2 py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-16 md:py-7"
              style={{ borderTop: `1px solid ${HAIR_INK}` }}
            >
              <p className="font-sans text-[14px]" style={{ color: ON_INK_SOFT }}>
                {door.term}
              </p>
              <div>
                <RuleLink
                  href={door.kind === "mail" ? `mailto:${door.label}` : SIGNUP_HREF}
                  color={GOLD}
                  className="font-editorial text-[1.4rem] md:text-[1.7rem]"
                >
                  {door.label}
                </RuleLink>
              </div>
            </Arrive>
          ))}
        </ArriveGroup>
      </div>
    </section>
  );
}
