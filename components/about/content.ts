/**
 * Every string the About page puts on screen, in one file, so the copy audit
 * can be run by reading one short file cold.
 *
 * The story, in three moves, and nothing else:
 *
 *   1. This industry meets you as photographs before it meets you.
 *   2. Getting those photographs right is the one part a model controls, and
 *      the part everyone charges her for. None of that money reaches an
 *      agency, and most applications are never answered.
 *   3. Pholio makes that part and carries it, and charges nobody for it.
 *      Three people make it.
 *
 * This is a company page. Features belong to `/talent` and `/agencies`
 * (`lessons.md` §31.8), and nothing here describes a mechanic that payment
 * changes, because there is none.
 *
 * Constraints on every line: no outcome promise in any wording, no
 * implication that payment changes reach or review, "free" explained within
 * reach of every use, every fact traceable to shipped code or to the August
 * 2026 research passes, no invented numbers (the four on the page are read
 * off the casting tags in the opening photograph), zero em-dashes, no
 * staggered triplets, and no headline sitting on top of a paragraph.
 */

import { SUPPORT_EMAIL } from "@/lib/legal-constants";
import { STUDIO_PLUS_PRICE_ANNUAL, STUDIO_PLUS_PRICE_MONTHLY } from "@/lib/marketing-pricing";

export const CONTACT_EMAIL = SUPPORT_EMAIL;

/** Owner decision, 2026-09-08: the founding year may be stated. lessons.md §30.4. */
export const FOUNDED = "2025";

/** The anchor the page's invitation travels to: the bill. */
export const BILL_ID = "what-it-costs";

/* ══════════════════════════════════════════════════════════════════════
   THE STAGE — chapters I to V

   One pinned frame, one continuous set of objects, five chapters. The copy
   is thin here because the photographs are doing the arguing, and it is
   ranked hard: three statements own a viewport, everything else whispers.
   ══════════════════════════════════════════════════════════════════════ */

export const STAGE = {
  /** 0. THE OPENING. No photograph in the first frame except a hand's width
      of one at the right edge, like a door ajar. The statement names the
      thing this industry actually runs on, and the number in it is the
      number the door opens onto. */
  opening: {
    statement: "A career here begins with four photographs and a number.",
    deck: "Pholio makes those photographs right, carries them to the people who decide, and takes no money from either side.",
    invitation: "What it costs",
  },

  /** I. THE NUMBERS. The whisper is read off the casting tags in the
      photograph: they are the only numbers on the page, and they are in
      frame while the line is on screen. */
  numbers: {
    whisper: "Fourteen, ten, eight, twelve.",
    statement: "Hundreds of these reach the same desk every week.",
    imageAlt:
      "Four models standing against a plain wall, each wearing a numbered casting tag.",
  },

  /** II. THE SITTING. One set of digitals, and who pays for it. */
  sitting: {
    whisper: "Hers. A plain wall, one afternoon, paid for by her.",
    imageAlt:
      "A model photographed full length in a studio, standing in front of a softbox against a plain wall.",
  },

  /** III. THE STACK. Named practices, never firms: the statutes are the
      licensed villain-namer. Each line arrives as a slip of paper that
      lands on her photograph, until the photograph is under all of them
      and only its top edge is still showing. Then the paper goes. */
  bill: {
    id: BILL_ID,
    label: "Paid for before the looking",
    items: [
      "Digitals, and digitals again",
      "Prints",
      "A portfolio site",
      "Comp cards, ordered in fifties",
      "A paid review of her own pictures",
      "A profile that stays visible while she pays",
    ],
    total: "None of that money reaches an agency.",
  },

  /** IV. THE CORRIDOR. The longest hold on the page, and the only frame
      where absence is the subject. The photograph of everyone waiting
      stays in it, faint, so the emptiness has something to be empty of. */
  corridor: {
    statement: "Most of them are never answered.",
    note: "Several agencies publish, on their own sites, that they cannot answer everyone.",
    imageAlt: "Models sitting along a low wall between calls.",
  },

  /** V. THE TURN. The page's one gold verdict word, at the one moment the
      two fields become one. */
  turn: {
    line: [
      { text: "Everything between you" },
      { text: "and an agency should be ", verdict: "free.", break: true },
    ],
    under: `Pholio began in ${FOUNDED}. It prepares those materials, carries them, and takes no money from either side for doing it.`,
  },
} as const;

/* ══════════════════════════════════════════════════════════════════════
   VI. THE COLOPHON
   Where the money is, stated before anyone has to ask, and the refusals,
   which are the one thing on a page like this a fee funnel cannot copy.
   Set as a spread: the reading on the left page, one plate on the right.
   ══════════════════════════════════════════════════════════════════════ */

export const COLOPHON = {
  id: "the-company",
  groups: [
    {
      label: "Where the money is",
      rows: [
        {
          term: "Free",
          body: "Preparing, sending, tracking, and receiving. Free for the person applying, and free for the agency, event producer, or other recipient at the other end. Permanently.",
        },
        {
          term: "Studio+",
          body: `$${STUDIO_PLUS_PRICE_MONTHLY} a month, or $${STUDIO_PLUS_PRICE_ANNUAL} a year. Comp-card editions and longer analytics: craft and property, kept by whoever paid for it.`,
        },
        {
          term: "Unchanged",
          body: "Nothing an agency sees or receives is different because someone paid.",
        },
      ],
    },
    {
      label: "What Pholio will not do",
      rows: [
        {
          term: "Represent anyone",
          body: "Pholio is not an agency. It does not negotiate, take a commission, or promise work, auditions, meetings, or replies. Applying through Pholio does not make anyone a represented model.",
        },
        {
          term: "Charge the other side",
          body: "Not an agency, not an event producer, not any other recipient. Not now, and not once they depend on it.",
        },
        {
          term: "Sell attention",
          body: "No paid placement, no ranking by plan, and no queue position for sale at any price.",
        },
        {
          term: "Read faces",
          body: "Image analysis stays off until it is turned on. It classifies the shot, the use, and the style of a frame, never the person in it.",
        },
        {
          term: "Admit minors, yet",
          body: `Pholio is 18 and over today. Guardians with questions can write to ${SUPPORT_EMAIL}.`,
        },
      ],
    },
  ],
  imageAlt: "A person in a black blazer holding a stack of black and white prints.",
} as const;

/* ══════════════════════════════════════════════════════════════════════
   VII. THE COLLECTIVE
   Recovered, not reinterpreted. This block and the component that renders
   it are the shipped composition (`lessons.md` §32), restored verbatim.
   ══════════════════════════════════════════════════════════════════════ */

export const COLLECTIVE = {
  label: "The Collective",
  headlineBefore: "Engineering, business, and",
  headlineVerdict: "the runway",
  headlineAfter: ".",
  support: `Pholio began in ${FOUNDED}. Three people make it, between engineering, business and fashion production.`,
  people: [
    {
      given: "Leul",
      family: "Enquanhone",
      role: "Co-founder, Engineering",
      bio: "Built Pholio end to end: the application rails, the comp-card engine, the agency inbox. Studies statistics and data science at the University of Kentucky, with research work in computer vision.",
      src: "/assets/Leul_Portrait.PNG",
      alt: "Leul Enquanhone",
      focus: "50% 26%",
    },
    {
      given: "Natan",
      family: "Getahun",
      role: "Co-founder, Business",
      bio: "Runs the business side: agencies, events, and the people Pholio works with. Studied at Hult International Business School and founded PXI Labs, an events software company.",
      src: "/assets/Natan_Portrait.png",
      alt: "Natan Getahun",
      focus: "50% 34%",
    },
    {
      given: "Alexander",
      family: "Rieder",
      role: "Industry advisor",
      bio: "Co-producer of Fashion Week Brooklyn, the BK Style Foundation's twice-yearly show, and a fashion producer in New York. Pholio's event casting is built against how his seasons are actually cast.",
      src: "/assets/Alex_Portrait.jpg",
      alt: "Alexander Rieder",
      focus: "50% 40%",
    },
  ],
} as const;

/* ══════════════════════════════════════════════════════════════════════
   VIII. THE CODA
   Guide, not hero. The agency decides; this company makes the part before
   that. Small, because the page already said its large thing three times.
   ══════════════════════════════════════════════════════════════════════ */

export const CODA = {
  line: "An agency's answer is theirs. Everything before it is ours.",
  doors: [
    { term: "For talent", label: "Apply free", kind: "app" as const },
    {
      term: "For agencies, events, and press",
      label: CONTACT_EMAIL,
      kind: "mail" as const,
    },
  ],
} as const;

/** A headline fragment: plain text, a gold italic verdict, or both. */
export type Fragment = {
  readonly text?: string;
  readonly verdict?: string;
  readonly break?: boolean;
};
