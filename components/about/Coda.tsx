"use client";

/**
 * VIII. THE CODA
 *
 * One line and two doors, with a great deal of air around them.
 *
 * Small on purpose. The page has already made its large statement four
 * times, and repeating the volume at the end would spend the thing that
 * made those land. The line is the grammar rule stated as copy: Pholio is
 * never the subject of a transformation sentence. The agency's answer
 * belongs to the agency; what this company makes is everything before it.
 *
 * It is set as a deck rather than as body text, because it is the last
 * thing anybody reads on this page and it should be read in the page's
 * own voice.
 */

import { SIGNUP_HREF } from "@/components/header/kit";

import { CODA } from "./content";
import {
  Arrive,
  ArriveGroup,
  CREAM,
  Deck,
  GOLD_DARK,
  Label,
  ON_CREAM,
  RuleLink,
  SHELL,
} from "./kit";

export default function Coda() {
  return (
    <section
      aria-labelledby="about-coda-title"
      className="texture-grain relative overflow-hidden"
      style={{ background: CREAM, color: ON_CREAM.statement }}
    >
      <div className={`${SHELL} pb-32 pt-4 md:pb-56 md:pt-8`}>
        <ArriveGroup className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
          <Arrive className="md:col-span-6">
            <h2 id="about-coda-title">
              <Deck field="cream" className="max-w-[26ch]">
                {CODA.line}
              </Deck>
            </h2>
          </Arrive>

          {CODA.doors.map((door, i) => (
            <Arrive
              key={door.term}
              className={i === 0 ? "md:col-span-3 md:col-start-8" : "md:col-span-2 md:col-start-11"}
            >
              <Label field="cream">{door.term}</Label>
              <div className="mt-4">
                <RuleLink
                  href={door.kind === "mail" ? `mailto:${door.label}` : SIGNUP_HREF}
                  color={ON_CREAM.statement}
                  rule={GOLD_DARK}
                  className="font-editorial text-[1.2rem] md:text-[1.35rem]"
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
