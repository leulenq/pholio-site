/**
 * Every string the About page puts on screen, in one file, so the copy audit
 * can be run by reading one short file cold.
 *
 * The page's job: leave a model, an agency, an event partner, a press contact,
 * or someone checking whether this company is real understanding what Pholio
 * believes, why it exists, who makes it, and why it can be trusted. It does
 * that as an experience, not as an argument laid out in paragraphs: the
 * statements are scenes, and the proof is a document set deliberately quiet
 * beneath them.
 *
 * Constraints that still bind: no outcome promises, "free" explained within
 * reach, every fact traceable to shipped code or a public source, no invented
 * numbers, zero em-dashes.
 */

import { SUPPORT_EMAIL } from "@/lib/legal-constants";

export const CONTACT_EMAIL = SUPPORT_EMAIL;

/** Owner decision, 2026-09-08: the founding year may be stated. lessons.md §30. */
export const FOUNDED = "2025";

/** The id the hero's invitation points at. */
export const LINE_ID = "the-line";

export const HERO = {
  headlineBefore: "No one should pay to be",
  verdict: "considered",
  headlineAfter: ".",
  support: [
    "A free toolkit for applying to agencies.",
    "A free intake link for the agencies that receive them.",
  ],
  invitation: "Where Pholio draws the line",
  imageAlt:
    "A model photographed in close portrait against black, lit from one side.",
} as const;

export const ORIGIN = {
  id: "origin",
  beats: [
    {
      statement: "The rules are not published.",
      support:
        "Every agency asks for a different set of photographs, under different names, in different formats. The limits that actually bind live in the form's code, not on the page. The format an iPhone shoots by default fails at some of them with no message at all.",
    },
    {
      statement: "So the same digitals get paid for twice.",
      support:
        "A set comes back rejected for a reason nobody printed. Then it gets shot again.",
    },
    {
      statement: "Then nothing comes back.",
      support:
        "Agencies read hundreds of applications a week, and several say plainly that they cannot answer everyone. Around that silence, an industry of platforms and packages sells the one thing a legitimate agency never charges for.",
    },
  ],
  imageAlt: "A model seated on a wooden stool in a studio, photographed against black.",
  turnBefore: "Pholio began in",
  turnYear: FOUNDED,
  turnMiddle: "to take the paid part out of the",
  turnVerdict: "middle",
  turnAfter: ".",
} as const;

/**
 * THE LINE. Three declaratives, each literally true and each backed by a
 * mechanism in the section below it. This replaces "manifesto": the word the
 * owner doubted, and a shape (a creed) Pholio has no standing to write. A line
 * is what the brand actually holds, and it is the brand's own mark.
 */
export const LINE = {
  id: LINE_ID,
  label: "The line",
  statements: [
    { plain: "Applying is", verdict: "free." },
    { plain: "Silence gets", verdict: "named." },
    { plain: "The work stays", verdict: "yours." },
  ],
  close: "Nothing an agency sees or receives changes with what anyone pays.",
} as const;

export const RECORD = {
  heading: "Every line above is a mechanism.",
  lede: "Here is each one, and what makes it checkable.",
  rows: [
    {
      term: "Applying is free",
      body: "Pholio's only revenue is Studio+, a subscription for comp-card editions and longer analytics. Nothing an agency sees or receives changes with it.",
    },
    {
      term: "Agencies are never charged",
      body: "No fee, no commission, and no applicant ranked by what they pay. An agency can export its queue as a CSV at any time.",
    },
    {
      term: "Pholio is not an agency",
      body: "It does not represent talent, negotiate, or promise work, auditions, or replies. Sending an application does not make anyone a represented model.",
    },
    {
      term: "Silence gets named",
      body: "When an application passes the conventional window with no reply, it is marked as no response rather than left open. Nobody is asked to read hope into it.",
    },
    {
      term: "The book and the record stay yours",
      body: "Every frame and every comp card can be exported. What was sent, to whom, and when is kept as a receipt you can read.",
    },
    {
      term: "Photographs are read. Faces never are.",
      body: "Image analysis stays off until you turn it on, and it classifies the shot, the use and the style of a frame, never the person in it.",
    },
    {
      term: "Adults only, for now",
      body: `Pholio does not admit anyone under 18 today. Guardians with questions can write to ${SUPPORT_EMAIL}.`,
    },
  ],
} as const;

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

export const CLOSE = {
  lines: [
    { plain: "The talent applies." },
    { plain: "The agency decides." },
    { plain: "Pholio makes the materials and keeps the", verdict: "record." },
  ],
  doors: [
    { term: "For talent", label: "Apply free", kind: "app" as const },
    { term: "For agencies, events and press", label: CONTACT_EMAIL, kind: "mail" as const },
  ],
} as const;
