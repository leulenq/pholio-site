"use client";

/**
 * THE SIGNATURE LINE
 *
 * The page ends. Pholio signs its name.
 *
 * The composition is one decision: **the line is the subject and the mark is
 * the signature on it.** That is what lets the wordmark be 64px here. A mark is
 * only obliged to be enormous when it is carrying the frame alone; give it
 * something to be signed on and it can be the size a signature actually is.
 *
 * Three registers, in the order a page ends:
 *
 *   above the line   the destinations, the company, and the address. The only
 *                    words a visitor came looking for, all at one size, ranked
 *                    by colour rather than by scale.
 *   the line         the stroke, drawn across the measure, with the mark set
 *                    down on it.
 *   below the line   the utilities. The smallest type on the site, in one
 *                    voice, because they are one class of thing.
 *
 * No group labels. Three columns of plain destinations need no headings, and a
 * heading over three links is scaffolding rather than content.
 *
 * No hairlines besides the stroke. The stroke has real material on both sides
 * of it, which is the only condition under which this site draws a line at all.
 *
 * The signing itself, and why the sweep is allowed here at all, is in
 * `motion.ts`.
 */

import {
  FOOTER_LEGAL_NAV,
  PRIMARY_NAV,
  SECONDARY_NAV,
} from "@/lib/marketing-nav-links";
import type { Field } from "@/components/header/kit";

import {
  AddressLink,
  Contents,
  CookieControl,
  FooterSurface,
  Imprint,
  NavLink,
  SHELL,
  Signature,
  SocialRow,
  Stroke,
  UtilityLink,
} from "./kit";
import { CONTACT_EMAIL, copyright, productLabel } from "./content";
import { RULE_GAP, SIGN_GAP } from "./motion";

export default function SiteFooter({ field }: { field?: Field } = {}) {
  return (
    <FooterSurface field={field}>
      {(scene) => (
        <div
          className={SHELL}
          style={{ paddingTop: "clamp(72px, 11vw, 132px)", paddingBottom: 48 }}
        >
          <Contents scene={scene}>
            {/* Above the line. Two ranks of navigation on the left, the address
                on the right: the frame's two ends are the two things anyone
                comes to a footer for, a way onward and a way to reach someone.
                The address is right-aligned so the block's outer edges are the
                stroke's, and the three groups sit on one top line. */}
            <nav
              aria-label="Footer"
              className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-12"
            >
              <div className="flex flex-col gap-10 sm:flex-row sm:gap-20 md:gap-24">
                <ul className="flex flex-col items-start">
                  {PRIMARY_NAV.map((entry) => (
                    <li key={entry.href}>
                      <NavLink
                        href={entry.href}
                        label={productLabel(entry.label)}
                        rank="destination"
                      />
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col items-start">
                  {SECONDARY_NAV.map((entry) => (
                    <li key={entry.href}>
                      <NavLink
                        href={entry.href}
                        label={entry.label}
                        rank="company"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <AddressLink email={CONTACT_EMAIL} />
                <SocialRow className="mt-4 md:mt-5" />
              </div>
            </nav>
          </Contents>

          {/* The signing. `Signature` ends on its baseline, so `SIGN_GAP` is the
              true distance from the name to the stroke. Short on purpose: the
              mark and the sweep are one gesture. See `motion.ts`. */}
          <div style={{ marginTop: "clamp(64px, 8.6vw, 112px)" }}>
            <Signature scene={scene} />
            <div style={{ paddingTop: SIGN_GAP }}>
              <Stroke scene={scene} />
            </div>
          </div>

          {/* Below the line. Deliberately the quietest thing in the frame: the
              four standing documents, the withdrawal control and the imprint,
              all in the utility voice. The other four legal documents are
              published and routed; they are reached from the context that
              raises them (lib/marketing-nav-links.ts). */}
          <Contents
            scene={scene}
            className="flex flex-col gap-x-10 gap-y-3 md:flex-row md:items-baseline md:justify-between"
            style={{ marginTop: RULE_GAP }}
          >
            <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-1">
              {FOOTER_LEGAL_NAV.map((entry) => (
                <li key={entry.href}>
                  <UtilityLink href={entry.href} label={entry.label} />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-baseline gap-x-7 gap-y-1">
              <CookieControl />
              <Imprint>{copyright()}</Imprint>
            </div>
          </Contents>
        </div>
      )}
    </FooterSurface>
  );
}
