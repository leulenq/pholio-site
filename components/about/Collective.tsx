"use client";

/**
 * THE COLLECTIVE
 *
 * The concept the owner kept: three portraits in a row on cream, the names
 * in the display serif with the family name in the dark gold italic. What
 * changed: no label above the heading, no hover-gated biographies, no scale
 * or shadow on hover, and every sentence in a biography is verifiable from a
 * public source. Hover is the one micro-interaction, and it is a colour
 * shift: the portrait returns to colour under the pointer.
 *
 * The section ends the page. Its last block is the two doors, so the reader
 * who arrived to check whether this company is real leaves with a way in
 * and a person to write to, and the closing panel takes over from there.
 */

import Image from "next/image";

import { SIGNUP_HREF } from "@/components/header/kit";

import { COLLECTIVE } from "./content";
import {
  Arrive,
  ArriveGroup,
  CREAM,
  GOLD_DARK,
  HAIR_CREAM,
  ON_CREAM,
  ON_CREAM_FAINT,
  ON_CREAM_SOFT,
  RuleLink,
  SHELL,
} from "./kit";

export default function Collective() {
  return (
    <section
      aria-labelledby="about-collective-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: CREAM, color: ON_CREAM }}
    >
      <div className={`${SHELL} pb-28 pt-24 md:pb-40 md:pt-36`}>
        <ArriveGroup className="max-w-[62ch]">
          <Arrive>
            <h2
              id="about-collective-title"
              className="font-editorial"
              style={{ fontSize: "clamp(2.2rem, 4.4vw, 4.4rem)", lineHeight: 1.04 }}
            >
              {COLLECTIVE.heading}
            </h2>
          </Arrive>
          <Arrive>
            <p
              className="mt-6 max-w-[46ch] font-sans text-[15px] font-light leading-relaxed md:text-[17px]"
              style={{ color: ON_CREAM_SOFT }}
            >
              {COLLECTIVE.support}
            </p>
          </Arrive>
        </ArriveGroup>

        <ArriveGroup
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-3 md:mt-24 md:gap-x-12"
          amount={0.1}
        >
          {COLLECTIVE.people.map((person) => (
            <Arrive key={person.family} className="group">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: "#EAE4DA" }}>
                <Image
                  src={person.src}
                  alt={person.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 30vw"
                  className="object-cover transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[filter:grayscale(0)]"
                  style={{ objectPosition: person.focus, filter: "grayscale(1)" }}
                />
              </div>
              <h3
                className="font-editorial mt-6"
                style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.15rem)", lineHeight: 1.1 }}
              >
                {person.given}{" "}
                <em className="font-editorial-italic" style={{ color: GOLD_DARK, fontStyle: "italic" }}>
                  {person.family}
                </em>
              </h3>
              <p className="mt-2 font-sans text-[13px]" style={{ color: ON_CREAM_FAINT }}>
                {person.role}
              </p>
              <p
                className="mt-4 max-w-[38ch] font-sans text-[14.5px] font-light leading-[1.65]"
                style={{ color: ON_CREAM_SOFT }}
              >
                {person.bio}
              </p>
            </Arrive>
          ))}
        </ArriveGroup>

        {/* The doors. */}
        <ArriveGroup className="mt-28 md:mt-40" amount={0.3}>
          {COLLECTIVE.doors.map((door) => (
            <Arrive
              key={door.term}
              className="grid grid-cols-1 gap-y-2 py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-16 md:py-7"
              style={{ borderTop: `1px solid ${HAIR_CREAM}` }}
            >
              <p className="font-sans text-[14px]" style={{ color: ON_CREAM_SOFT }}>
                {door.term}
              </p>
              <div>
                <RuleLink
                  href={door.kind === "mail" ? `mailto:${door.label}` : SIGNUP_HREF}
                  color={GOLD_DARK}
                  className="font-editorial text-[1.35rem] md:text-[1.6rem]"
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
