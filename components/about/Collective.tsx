"use client";

/**
 * THE COLLECTIVE
 *
 * The composition as it shipped before the About rebuilds: a centered
 * header, three 4:5 plates on cream, grayscale returning to colour with a
 * slow push, a gold wash lifting off the plate, the role as a gold micro-
 * label above the name, and the family name in gold italic. Recovered from
 * `AboutContent.tsx` (a06016d) rather than reinterpreted.
 *
 * Copy is the researched copy, not the retired "Engineered by Visionaries"
 * register. Biographies stay in the markup and open on hover / focus, as
 * they did; on a narrow stage they are already open, because a phone has
 * no hover.
 */

import Image from "next/image";

import { COLLECTIVE } from "./content";
import { Arrive, ArriveGroup, CREAM, GOLD, Verdict } from "./kit";

export default function Collective() {
  return (
    <section
      aria-labelledby="about-collective-title"
      className="texture-grain relative overflow-hidden pb-40 pt-40 text-[#050505] md:pb-64 md:pt-64"
      style={{ background: CREAM }}
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-6">
        <ArriveGroup className="mb-24 text-center">
          <Arrive>
            <span className="text-label mb-8 block" style={{ color: GOLD }}>
              {COLLECTIVE.label}
            </span>
          </Arrive>
          <Arrive>
            <h2
              id="about-collective-title"
              className="font-editorial mb-8 text-5xl leading-[0.95] tracking-tight md:text-7xl"
            >
              {COLLECTIVE.headlineBefore}{" "}
              <br className="hidden md:block" />
              <Verdict color={GOLD}>{COLLECTIVE.headlineVerdict}</Verdict>
              {COLLECTIVE.headlineAfter}
            </h2>
          </Arrive>
          <Arrive>
            <p className="mx-auto max-w-2xl font-sans text-lg font-light leading-relaxed text-black/60">
              {COLLECTIVE.support}
            </p>
          </Arrive>
        </ArriveGroup>

        <ArriveGroup
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12"
          amount={0.1}
        >
          {COLLECTIVE.people.map((person) => (
            <Arrive key={person.family} className="group cursor-pointer">
              <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-[2px] bg-white shadow-xl">
                <Image
                  src={person.src}
                  alt={person.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 31vw"
                  className="object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-focus-within:grayscale-0 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
                  style={{ objectPosition: person.focus }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-transparent group-focus-within:bg-transparent"
                />
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p
                  className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  {person.role}
                </p>
                <h3 className="font-editorial text-4xl lg:text-5xl">
                  {person.given}{" "}
                  <em
                    className="font-editorial-italic italic"
                    style={{ color: GOLD }}
                  >
                    {person.family}
                  </em>
                </h3>
                <div className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 ease-in-out md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100 md:group-focus-within:grid-rows-[1fr] md:group-focus-within:opacity-100">
                  <div className="overflow-hidden">
                    <p className="max-w-sm pt-4 font-sans text-base font-light leading-relaxed text-black/60">
                      {person.bio}
                    </p>
                  </div>
                </div>
              </div>
            </Arrive>
          ))}
        </ArriveGroup>
      </div>
    </section>
  );
}
