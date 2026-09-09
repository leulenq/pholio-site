"use client";

/**
 * WHAT PHOLIO MAKES
 *
 * The artifact argues. The two plates are the product's own output for a
 * real model: the engine's Masthead front, and the back composed from the
 * same record and photographs. They sit on the ink stage as the home page
 * shows them, in full colour because the imagery is product output, not site
 * art (lessons.md, "Grayscale stops at the product"). Under them, two rows
 * for the things a plate cannot show at this size: the register and the
 * tracker, each named in the product's own vocabulary.
 */

import Image from "next/image";

import { WORK } from "./content";
import {
  Arrive,
  ArriveGroup,
  GOLD,
  HAIR_INK,
  INK,
  ON_INK,
  ON_INK_FAINT,
  ON_INK_SOFT,
  RuleLink,
  SHELL,
} from "./kit";

export default function Work() {
  return (
    <section
      aria-labelledby="about-work-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: INK, color: ON_INK }}
    >
      <div className={`${SHELL} pb-28 pt-24 md:pb-40 md:pt-36`}>
        <ArriveGroup className="max-w-[62ch]">
          <Arrive>
            <h2
              id="about-work-title"
              className="font-editorial"
              style={{ fontSize: "clamp(2.2rem, 4.4vw, 4.4rem)", lineHeight: 1.04 }}
            >
              {WORK.heading}
            </h2>
          </Arrive>
          <Arrive>
            <p
              className="mt-6 max-w-[46ch] font-sans text-[15px] font-light leading-relaxed md:text-[17px]"
              style={{ color: ON_INK_SOFT }}
            >
              {WORK.lede}
            </p>
          </Arrive>
        </ArriveGroup>

        {/* The plates: an editorial run at one height, the back set a step
            lower than the front so the pair reads as two sides of one object
            rather than two tiles. */}
        <ArriveGroup
          className="mt-16 grid grid-cols-2 items-start gap-x-5 md:mt-24 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)] md:gap-x-10"
          amount={0.12}
        >
          <Arrive>
            <Plate {...WORK.front} priority />
          </Arrive>
          <Arrive className="md:pt-16">
            <Plate {...WORK.back} />
          </Arrive>
          <Arrive className="col-span-2 mt-10 md:col-span-1 md:mt-0 md:self-end">
            <p
              className="max-w-[30ch] font-sans text-[15px] font-light leading-[1.65] md:text-[16px]"
              style={{ color: ON_INK_SOFT }}
            >
              {WORK.editions}
            </p>
          </Arrive>
        </ArriveGroup>

        <ArriveGroup className="mt-20 md:mt-28" amount={0.2}>
          {WORK.rows.map((row) => (
            <Arrive
              key={row.term}
              className="grid grid-cols-1 gap-y-3 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-16 md:py-8"
              style={{ borderTop: `1px solid ${HAIR_INK}` }}
            >
              <h3
                className="font-editorial"
                style={{ fontSize: "clamp(1.45rem, 2.1vw, 2.05rem)", lineHeight: 1.12 }}
              >
                {row.term}
              </h3>
              <div>
                <p
                  className="max-w-[52ch] font-sans text-[15px] font-light leading-[1.65] md:pt-1 md:text-[16px]"
                  style={{ color: ON_INK_SOFT }}
                >
                  {row.description}
                </p>
                {"link" in row && row.link && (
                  <div className="mt-4">
                    <RuleLink href={row.link.href} internal color={GOLD} className="text-[13px] md:text-[14px]">
                      {row.link.label}
                    </RuleLink>
                  </div>
                )}
              </div>
            </Arrive>
          ))}
        </ArriveGroup>
      </div>
    </section>
  );
}

function Plate({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className="m-0">
      <div className="relative w-full" style={{ aspectRatio: "1056 / 1632" }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 46vw, 30vw"
          className="object-contain"
        />
      </div>
      <figcaption
        className="mt-4 max-w-[34ch] font-sans text-[12.5px] font-light leading-[1.6] md:text-[13.5px]"
        style={{ color: ON_INK_FAINT }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
