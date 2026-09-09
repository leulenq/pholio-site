/**
 * Every string the About page puts on screen, in one file, so the copy audit
 * (banned-ui §9, pholio-site-language pre-flight) can be run by reading one
 * short file cold.
 *
 * The page's one job: leave a model, an agency, an event partner, a press
 * contact, or someone checking whether this company is real understanding
 * what Pholio believes, why it exists, who makes it, and why it can be
 * trusted. It orients; it does not convert. The rules that bite hardest:
 * zero em-dashes, no outcome promises, "free" explained within reach, every
 * fact traceable to shipped code or a public source, no résumé dumps.
 */

import { SUPPORT_EMAIL } from "@/lib/legal-constants";

export const CONTACT_EMAIL = SUPPORT_EMAIL;

/** Owner decision, 2026-09-08: the founding year may be stated. See lessons.md §30. */
export const FOUNDED = "2025";

export const HERO = {
  /** The verdict word is set separately so the composition can style it. */
  headlineBefore: "No one should pay to be",
  verdict: "considered",
  headlineAfter: ".",
  support:
    "Pholio is a free toolkit for applying to agencies, and a free intake link for the agencies that receive them.",
  invitation: "Where Pholio stands",
  figureAlt: "A model seated on a wooden stool in a studio, photographed against black.",
} as const;

export const POSITION = {
  id: "position",
  heading: "Where Pholio stands",
  why: [
    "Applying to an agency is harder than it looks, and nobody publishes why. Each agency asks for a different set of photographs under different names, in different file formats, with limits that live in the form's code rather than on the page. The photo format an iPhone shoots by default fails at some of them with no message at all. People pay for digitals, get them rejected, and pay again.",
    "Then comes the silence. Agencies receive hundreds of applications a week, and several say plainly that they cannot answer everyone. Around that silence, an industry of platforms and packages sells the one thing a legitimate agency never charges for: being looked at.",
    `Pholio began in ${FOUNDED} to take the paid part out of the middle. It gets the materials right for the agency you chose, sends or prepares the application, and keeps the record of what went where. When the conventional window passes with no reply, it says so.`,
  ],
  commitments: [
    {
      statement: "Applying is free, and no plan changes that.",
      mechanism:
        "Pholio's only revenue is Studio+, a subscription for comp-card editions and longer analytics. Nothing an agency sees or receives changes with it.",
    },
    {
      statement: "Agencies are never charged.",
      mechanism:
        "No fee, no commission, and no applicant ranked by what they pay. An agency's queue can be exported as a CSV at any time.",
    },
    {
      statement: "Pholio is not an agency.",
      mechanism:
        "It does not represent talent, negotiate, or promise work, auditions, or replies. Sending an application does not make anyone a represented model.",
    },
    {
      statement: "The book, the card and the record belong to the talent.",
      mechanism:
        "Every frame and every comp card can be exported. What was sent, to whom, and when is kept as a receipt the talent can read.",
    },
    {
      statement: "Silence gets named.",
      mechanism:
        "When an application passes the conventional window with no reply, it is marked as no response rather than left open. Nobody is asked to read hope into it.",
    },
    {
      statement: "Photographs are read. Faces never are.",
      mechanism:
        "Image analysis is off until the talent turns it on, and it classifies the shot, the use and the style of a frame, never the person in it.",
    },
    {
      statement: "Adults only, for now.",
      mechanism: `Pholio does not admit anyone under 18 today. Guardians with questions can write to ${SUPPORT_EMAIL}.`,
    },
  ],
  /** The one-sentence philosophy the language system allows a brand surface. */
  closeBefore: "The talent applies. The agency decides. Pholio makes the materials and keeps the",
  closeVerdict: "record",
  closeAfter: ".",
} as const;

export const WORK = {
  heading: "What Pholio makes.",
  lede: "Real output from the product, for a real model, with her published measurements. Nothing on it is invented.",
  front: {
    src: "/generated/comp-card/ola-editorial-masthead-front.png",
    alt: "The front of a Pholio comp card: the name Ola Szkolda set as a masthead above a full-length photograph.",
    caption: "The comp card, front. The photograph and the name, composed from the book.",
  },
  back: {
    src: "/generated/comp-card/ola-editorial-masthead-back-composed.png",
    alt: "The back of the same comp card: four photographs, a line of measurements, and the Pholio mark with a portfolio address.",
    caption: "The back. Four frames, the stats in the agency order, and the address a booker can act on.",
  },
  editions:
    "Nine editions. The same book composed again is a different card, sent inside an application or printed and left at a casting.",
  rows: [
    {
      term: "The register",
      description:
        "What each agency asks for, read from its own pages and dated. Their page is the authority if the two disagree.",
      link: { label: "Read the register", href: "/agencies" },
    },
    {
      term: "The tracker",
      description:
        "What was sent where, when, and with which digitals. After the conventional window with no reply, the entry reads no response.",
    },
  ],
} as const;

export const COLLECTIVE = {
  heading: "The Collective",
  support: `Pholio began in ${FOUNDED}. Three people make it, between engineering, business and fashion production.`,
  people: [
    {
      given: "Leul",
      family: "Enquanhone",
      role: "Co-founder. Engineering.",
      bio: "Built Pholio end to end, from the application rails to the comp-card engine and the agency inbox. Studies statistics and data science at the University of Kentucky, where his research work is in computer vision.",
      src: "/assets/Leul_Portrait.PNG",
      alt: "Leul Enquanhone",
      focus: "50% 28%",
    },
    {
      given: "Natan",
      family: "Getahun",
      role: "Co-founder. Business.",
      bio: "Runs the business side: agencies, events and the people Pholio works with. Studied at Hult International Business School and founded PXI Labs, an events software company.",
      src: "/assets/Natan_Portrait.png",
      alt: "Natan Getahun",
      focus: "50% 38%",
    },
    {
      given: "Alexander",
      family: "Rieder",
      role: "Industry advisor.",
      bio: "Co-producer of Fashion Week Brooklyn, the BK Style Foundation's twice-yearly show, and a fashion producer based in New York. Pholio's event casting is designed against how his seasons are actually cast.",
      src: "/assets/Alex_Portrait.jpg",
      alt: "Alexander Rieder",
      focus: "50% 42%",
    },
  ],
  doors: [
    { term: "For talent", label: "Apply free", kind: "app" },
    { term: "For agencies, events and press", label: CONTACT_EMAIL, kind: "mail" },
  ],
} as const;
