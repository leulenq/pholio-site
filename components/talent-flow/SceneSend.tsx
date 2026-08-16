"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 4 — Send (ink).
   GESTURE: catch-sheet → the read (a stepped flip-through) → launch.

   ── WHAT THIS SECTION IS ────────────────────────────────────────────
   The subject is the app's own artifact: the REPRESENTATION SUBMISSION,
   the composed document on page 07 of the /apply workspace
   ("Review & send"). Not an abstraction of it, not a stack of blank
   panels — the actual instrument, reproduced from
   `client/src/domains/talent/pages/ApplyPage/ApplyExperience.{jsx,css}`
   in pholio-app and staged at scale on the ink field.

   The app's review page is one spread: `.apply-review` is a grid of the
   document (`.apply-package`, 1fr) against the terms rail
   (`.apply-seal`, 248–320px). That spread is the composition here,
   whole. Everything in it is transcribed, not invented:

   MASTHEAD (`.apply-package__masthead`) — centred. The lockup is
     `PHOLIO` · a 1×13px divider · the agency, then the italic-serif
     kicker "Representation submission", then the TALENT'S NAME as the
     h1 in uppercase spaced serif, "Based in …", a centred gold rule at
     62% width, and a mono destination line.
     NOTE: `PHOLIO` in this lockup is MONO — 11px, weight 600, 0.34em,
     gold (`.apply-package__pholio`). That is deliberate and it is the
     app's value. Do NOT "correct" it to the serif `Wordmark` from
     CLAUDE.md's ported-talent-system section; that mark belongs to the
     header and the footer. This lockup is its own thing.

   SECTIONS (`.apply-package__sec`) — hairline-topped, numbered in ROMAN
     NUMERALS (`ROMAN` in ApplyExperience.jsx): I Digitals ·
     II Stats · III Book · IV Comp card · V Note. Each head is mono
     10px/0.2em with a quiet gold "Modify" opposite it.
     Their bodies keep the app's grammar exactly: polaroid figures with
     mono figcaptions; a bordered measurement table whose values are
     SERIF, not mono; an auto-fill book grid with a mono frame count; a
     comp-card face beside its spec and "Composed live from your book";
     the note as a serif-italic blockquote over the contact strip.

   RAIL (`.apply-seal`) — "Submission Terms" as gold mono followed by a
     gold hairline that runs to the edge (the app's `::after`), the real
     handling sentence, the 24-month retention fact — and then the thing
     that makes the section's argument.

   ── WHY IT'S THE ANSWER TO "ARRIVE COMPLETE" ────────────────────────
   "Complete" is not a promise about assembly. It is a GATE Pholio
   enforces: `evaluateSendReadiness` (client/src/shared/utils/
   sendReadiness.js) returns `isSendReady: sendBlockers.length === 0`,
   and until that is true The Market's agency action reads "Prepare",
   not "Compose". You cannot send an incomplete package. The six
   requirements in the rail are the app's own `checks` array, label for
   label. They clear as the document is read, and the verdict flips
   SEND — LOCKED → SEND — CLEARED.

   ── THE HERO MOVE: THE READ ─────────────────────────────────────────
   The sheet is a fixed aperture and the submission runs THROUGH it —
   six sheets of exactly the aperture's height, advanced in stepped
   holds so each one lands like a page turned rather than sliding past.
   The gesture is the act the page is named for: reviewing the package
   before it goes. Nothing else in the take does this — Arrival dollies,
   Card deals, Book tilts, Signal wipes, Address folds, Wallet rises.
   A gold hairline along the sheet's foot fills as the read progresses.

   Entrance catches the sheet Book tips away (`useCatchSheet`), so the
   paper carries across the seam; exit keeps the old scene's one good
   idea and launches the whole spread at the lens — dispatch, not
   disappearance — leaving a gold tick to seed Signal.

   ── NOTES ───────────────────────────────────────────────────────────
   · Paper is brand cream, not the app's near-white: the sheet is CREAM
     and the rail and inset panels are CREAM_WARM, which reproduces the
     app's three-step paper hierarchy (14% / 30% / 40% cream-warm mixes)
     using only palette colours.
   · The app tints a cleared state green (`.app-status--accepted`). The
     marketing palette is three colours, so a cleared gate reads
     full-strength GOLD. Gold is a state, not a surface.
   · One identity throughout — the three real Mara Voss source frames.
     The digitals, the book and the comp-card face are all the same
     person, because the app's review page shows one talent's package.
     Don't mix in FACES/RENDERS here: RENDERS is Elara Keats and belongs
     to the Card scene.
   ═══════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import {
  Stage,
  Frame,
  Caption,
  Mono,
  V,
  usePrm,
  SOURCE_FRAMES,
  CREAM,
  CREAM_WARM,
  ON_INK_FAINT,
  ON_CREAM,
  ON_CREAM_SOFT,
  ON_CREAM_FAINT,
  GOLD,
  MONO,
  SERIF,
  SANS,
} from "./kit";
import { useScrub, useDraw, useCatchSheet, useLaunchForward } from "./motion";

/* ── Opacity is state here, not a MotionValue ──────────────────────
   Scroll-driven TRANSFORMS render fine in this tree (the page track,
   the gate ticks, the read rule all scrub correctly), but a MotionValue
   bound to `opacity` — or to `clipPath` — writes its initial value and
   then never updates the DOM again. That is what left the terms rail
   clipped mid-word and the verdict stuck on SEND — LOCKED.
   So: every fade in this scene is React state crossing a threshold plus
   a CSS transition on the house ease, which is also the pattern
   CLAUDE.md prescribes for the comp-card scene ("`phase` state
   (thresholds) drives only the text"). Keep transforms scrubbed and
   fades stateful; do not reintroduce `opacity: someMotionValue`. */
const FADE = "opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1)";

type Phase = {
  caption: boolean;
  rail: boolean;
  cleared: number; // how many of the six requirements have cleared
  verdict: boolean;
  dispatched: boolean;
  handoff: boolean;
};

/* ── Paper ─────────────────────────────────────────────────────────
   `--app-hair` / `--app-hair-strong` / `--app-hair-gold`. */
const HAIR = "rgba(26, 26, 26, 0.09)";
const HAIR_STRONG = "rgba(26, 26, 26, 0.16)";
const HAIR_GOLD = "rgba(201, 165, 90, 0.24)";
const FAINT = "rgba(26, 26, 26, 0.38)"; // --app-text-faint

/* ── Geometry. The aperture is the document's window; every sheet is
      exactly this tall, which is what makes the read step. ────────── */
/* The aperture is a CSS variable, set responsively on the document root
   (`SHEET_H`), so it can shrink on small or short screens. That is only
   possible because the page track below moves the strip by PERCENTAGES OF
   ITSELF — each sheet is exactly 1/SHEETS of the strip — rather than by a
   pixel offset. Don't turn it back into a number. */
const APERTURE = "var(--sheet-h)";
/* `min()` guards short laptops; the breakpoint guards narrow phones */
const SHEET_H = "[--sheet-h:min(236px,32vh)] md:[--sheet-h:min(392px,46vh)]";
const SHEET_PAD = "clamp(20px, 2.6vh, 28px) clamp(20px, 4.4vw, 38px)";
const SHEETS = 6; // masthead + I…V

/* ── The score. One place to retime the scene. ────────────────────── */
const T = {
  /* the spread arrives late on purpose: Book's exiting sheet plays over
     this scene through the shared pin window, and it must not land on
     top of the paper */
  spreadIn: [0.1, 0.26] as [number, number],
  captionIn: [0.06, 0.16] as [number, number],
  railIn: [0.2, 0.29] as [number, number],
  read: [0.26, 0.74] as [number, number],
  gateFirst: 0.3,
  gateStep: 0.06,
  gateSpan: 0.05,
  verdict: [0.72, 0.8] as [number, number],
  captionOut: [0.86, 0.94] as [number, number],
  launch: [0.84, 1] as [number, number],
  handoff: [0.9, 0.98] as [number, number],
};

/* ── Content. The app's own values. ──────────────────────────────── */

const TALENT = "Mara Voss";
const AGENCY = "Atelier North";
const CITY = "New York";
const BOARD = "Women — Main";

/* the app's digital slot taxonomy (DIGITAL_SLOTS in ApplyExperience) */
const DIGITALS = [
  /* crops are matched to what each frame actually shows — a slot labelled
     "full length" that reads as a headshot is the kind of thing a booker
     notices immediately */
  {
    label: "Headshot",
    src: SOURCE_FRAMES.crossedArm,
    pos: "57% 14%",
    zoom: 2.4,
  },
  {
    label: "¾ length",
    src: SOURCE_FRAMES.crossedArm,
    pos: "54% 34%",
    zoom: 1.3,
  },
  { label: "Full length", src: SOURCE_FRAMES.profile, pos: "50% 50%", zoom: 1 },
  { label: "Profile", src: SOURCE_FRAMES.profile, pos: "54% 20%", zoom: 1.85 },
];

/* `.apply-package__stats` — mono key, SERIF value */
const STATS = [
  ["Height", "178 cm"],
  ["Bust", "82 cm"],
  ["Waist", "61 cm"],
  ["Hips", "89 cm"],
];

/* `.apply-package__traits` */
const TRAITS = [
  ["Division", BOARD],
  ["Shoe", "39 EU"],
  ["Eyes", "Green"],
  ["Hair", "Dark brown"],
];

/* twelve book frames off one identity — the house re-framing trick */
const BOOK = [
  /* one shoot, twelve framings — the crops vary hard (tight beauty to full
     figure) so the grid reads as a book rather than twelve of the same frame */
  { src: SOURCE_FRAMES.redHero, pos: "50% 12%", zoom: 3.1 },
  { src: SOURCE_FRAMES.crossedArm, pos: "52% 50%", zoom: 1 },
  { src: SOURCE_FRAMES.profile, pos: "55% 20%", zoom: 2.2 },
  { src: SOURCE_FRAMES.redHero, pos: "50% 55%", zoom: 1.15 },
  { src: SOURCE_FRAMES.crossedArm, pos: "57% 13%", zoom: 2.8 },
  { src: SOURCE_FRAMES.profile, pos: "48% 52%", zoom: 1 },
  { src: SOURCE_FRAMES.redHero, pos: "52% 30%", zoom: 1.7 },
  { src: SOURCE_FRAMES.crossedArm, pos: "50% 62%", zoom: 1.35 },
  { src: SOURCE_FRAMES.profile, pos: "56% 12%", zoom: 3.3 },
  { src: SOURCE_FRAMES.redHero, pos: "46% 44%", zoom: 1.25 },
  { src: SOURCE_FRAMES.crossedArm, pos: "53% 26%", zoom: 2 },
  { src: SOURCE_FRAMES.profile, pos: "50% 38%", zoom: 1.5 },
];

const NOTE =
  "Three seasons of resort and swim in Cape Town. I’d like to be seen for Main.";

/* the app's `checks` array in ApplyExperience.jsx, label for label */
const GATE = [
  "Digital headshot",
  "Full-length digital",
  "Current digitals",
  "Measurements",
  "Contact",
  "Distribution rights",
];

/* ── Primitives ──────────────────────────────────────────────────── */

/** `.apply-package__sec-head` — roman numeral, title, quiet gold Modify. */
function SecHead({ roman, title }: { roman: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 20,
      }}
    >
      <Mono color={FAINT} size={10} tracking="0.2em">
        {roman} · {title}
      </Mono>
      <Mono color={GOLD} size={9} tracking="0.16em">
        Modify
      </Mono>
    </div>
  );
}

/** One sheet of the document: exactly the aperture's height. */
function Sheet({
  children,
  rule = true,
  center = false,
}: {
  children: React.ReactNode;
  rule?: boolean;
  center?: boolean;
}) {
  return (
    <div
      style={{
        height: APERTURE,
        padding: SHEET_PAD,
        borderTop: rule ? `1px solid ${HAIR}` : undefined,
        display: "flex",
        flexDirection: "column",
        justifyContent: center ? "center" : "flex-start",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

/** The body of a section sheet: takes the space between the head and the
    running foot and centres in it, so a short section (Stats, Comp card)
    sits in the middle of its page rather than clinging to the head. */
function Body({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

/** A running foot. Every section sheet closes on one — which is what
    keeps a page from ending in dead cream. The masthead has none: title
    pages don't carry a folio. */
function Folio({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: 14, borderTop: `1px solid ${HAIR}` }}>
      {children}
    </div>
  );
}

/** `.app-status` — a hairline rectangle. Never a pill. */
function Chip({
  children,
  color,
  border,
}: {
  children: React.ReactNode;
  color: string;
  border: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 26,
        padding: "0 11px",
        border: `1px solid ${border}`,
        borderRadius: 0,
        whiteSpace: "nowrap",
      }}
    >
      <Mono color={color} size={9} tracking="0.16em">
        {children}
      </Mono>
    </span>
  );
}

/* ═══ THE DOCUMENT ════════════════════════════════════════════════ */

/** 00 — the masthead. A title page: who, to whom, for what. */
function Masthead() {
  return (
    <Sheet rule={false} center>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          textAlign: "center",
          gap: 13,
        }}
      >
        {/* the lockup: PHOLIO · divider · agency */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 13,
            marginBottom: 1,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.34em",
              color: GOLD,
            }}
          >
            PHOLIO
          </span>
          <span
            aria-hidden="true"
            style={{ width: 1, height: 13, background: HAIR_STRONG }}
          />
          <Mono color={FAINT} size={10} tracking="0.18em">
            {AGENCY}
          </Mono>
        </span>

        <p
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "0.95rem",
            letterSpacing: "0.03em",
            color: FAINT,
          }}
        >
          Representation submission
        </p>

        <h3
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: "clamp(2rem, 3.4vw, 2.9rem)",
            letterSpacing: "0.06em",
            lineHeight: 1,
            textTransform: "uppercase",
            color: ON_CREAM,
          }}
        >
          {TALENT}
        </h3>

        <p
          style={{
            margin: "2px 0 0",
            fontFamily: SANS,
            fontSize: "0.82rem",
            color: ON_CREAM_SOFT,
          }}
        >
          Based in {CITY}
        </p>

        <span
          aria-hidden="true"
          style={{
            width: "min(280px, 62%)",
            height: 1,
            margin: "7px 0",
            background: `linear-gradient(to right, transparent, ${HAIR_GOLD}, transparent)`,
          }}
        />

        <Mono color={FAINT} size={9} tracking="0.18em">
          {CITY} · {BOARD}
        </Mono>
      </div>
    </Sheet>
  );
}

/** I — polaroid digitals: a bordered figure, image, mono figcaption. */
function SheetDigitals() {
  return (
    <Sheet>
      <SecHead roman="I" title="Digitals" />
      <Body>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {DIGITALS.map((d) => (
            <figure
              key={d.label}
              style={{
                margin: 0,
                display: "grid",
                gap: 11,
                padding: 11,
                border: `1px solid ${HAIR}`,
                background: CREAM_WARM,
              }}
            >
              <Frame
                src={d.src}
                alt=""
                style={{ width: "100%", aspectRatio: "3 / 4" }}
                imgStyle={{
                  objectPosition: d.pos,
                  transform: `scale(${d.zoom})`,
                  transformOrigin: d.pos,
                }}
              />
              <figcaption style={{ textAlign: "center" }}>
                <Mono color={FAINT} size={9} tracking="0.14em">
                  {d.label}
                </Mono>
              </figcaption>
            </figure>
          ))}
        </div>
      </Body>
      <Folio>
        <Mono color={FAINT} size={9} tracking="0.16em">
          Unretouched · measured 11 days ago
        </Mono>
      </Folio>
    </Sheet>
  );
}

/** II — stats. The app's one table where the VALUE is serif, not mono. */
function SheetStats() {
  return (
    <Sheet>
      <SecHead roman="II" title="Stats" />
      <Body>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            margin: 0,
            borderLeft: `1px solid ${HAIR}`,
          }}
        >
          {STATS.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "grid",
                gap: 10,
                justifyItems: "center",
                padding: "20px 8px",
                borderTop: `1px solid ${HAIR}`,
                borderRight: `1px solid ${HAIR}`,
                borderBottom: `1px solid ${HAIR}`,
              }}
            >
              <dt style={{ margin: 0 }}>
                <Mono color={FAINT} size={9} tracking="0.16em">
                  {k}
                </Mono>
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 25,
                  lineHeight: 1.05,
                  whiteSpace: "nowrap",
                  color: ON_CREAM,
                }}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Body>
      <Folio>
        <dl
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 22px",
            margin: 0,
          }}
        >
          {TRAITS.map(([k, v]) => (
            <div
              key={k}
              style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}
            >
              <dt style={{ margin: 0 }}>
                <Mono color={FAINT} size={9} tracking="0.16em">
                  {k}
                </Mono>
              </dt>
              <dd
                style={{
                  margin: 0,
                  fontFamily: SANS,
                  fontSize: 13,
                  color: ON_CREAM,
                }}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Folio>
    </Sheet>
  );
}

/** III — the book grid, and the count line the app prints under it. */
function SheetBook() {
  return (
    <Sheet>
      <SecHead roman="III" title="Book" />
      <Body>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {BOOK.map((f, i) => (
            <Frame
              key={i}
              src={f.src}
              alt=""
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                border: `1px solid ${HAIR}`,
              }}
              imgStyle={{
                objectPosition: f.pos,
                transform: `scale(${f.zoom})`,
                transformOrigin: f.pos,
              }}
            />
          ))}
        </div>
      </Body>
      <Folio>
        <Mono color={FAINT} size={9} tracking="0.16em">
          12 frames
        </Mono>
      </Folio>
    </Sheet>
  );
}

/** IV — the comp card face beside its spec. Composed, not uploaded. */
function SheetCompCard() {
  return (
    <Sheet>
      <SecHead roman="IV" title="Comp card" />
      <Body>
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-[30px]">
          {/* a comp-card front at leave-behind scale: portrait band, then
            the name over the gold sweep — the house card, in miniature */}
          <div
            style={{
              flex: "0 0 auto",
              width: 202,
              aspectRatio: "8.5 / 5.5",
              display: "flex",
              border: `1px solid ${HAIR_STRONG}`,
              background: CREAM_WARM,
              overflow: "hidden",
            }}
          >
            <Frame
              src={SOURCE_FRAMES.redHero}
              alt=""
              style={{ width: "46%", height: "100%" }}
              imgStyle={{ objectPosition: "52% 22%", transform: "scale(1.3)" }}
            />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 5,
                padding: "0 9px 10px",
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: ON_CREAM,
                }}
              >
                {TALENT}
              </span>
              <span
                aria-hidden="true"
                style={{
                  height: 1,
                  background: `linear-gradient(to right, ${GOLD}, transparent)`,
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 6,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: FAINT,
                }}
              >
                178 · 82 · 61 · 89
              </span>
            </div>
          </div>

          <div
            style={{
              minWidth: 0,
              display: "grid",
              gap: 9,
              alignContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: 22,
                lineHeight: 1.1,
                color: ON_CREAM,
              }}
            >
              {TALENT}
            </span>
            <Mono color={FAINT} size={9} tracking="0.14em">
              8.5 × 5.5 in · two-sided
            </Mono>
          </div>
        </div>
      </Body>
      <Folio>
        <span style={{ fontFamily: SANS, fontSize: 12, color: ON_CREAM_SOFT }}>
          Composed live from your book
        </span>
      </Folio>
    </Sheet>
  );
}

/** V — the note in the talent's own voice, over the contact strip. */
function SheetNote() {
  return (
    <Sheet>
      <SecHead roman="V" title="Note" />
      <Body>
        <blockquote
          style={{
            margin: 0,
            padding: "26px 28px",
            border: `1px solid ${HAIR}`,
            background: CREAM_WARM,
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 17,
            lineHeight: 1.6,
            color: ON_CREAM_SOFT,
          }}
        >
          &ldquo;{NOTE}&rdquo;
        </blockquote>
      </Body>
      <Folio>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "10px 20px",
          }}
        >
          <Mono color={FAINT} size={9} tracking="0.18em">
            Enclosed
          </Mono>
          <Mono color="rgba(26,26,26,0.55)" size={9} tracking="0.14em">
            Email · phone · instagram · portfolio
          </Mono>
        </div>
      </Folio>
    </Sheet>
  );
}

const DOC_SHEETS = [
  <Masthead key="masthead" />,
  <SheetDigitals key="digitals" />,
  <SheetStats key="stats" />,
  <SheetBook key="book" />,
  <SheetCompCard key="compcard" />,
  <SheetNote key="note" />,
];

/* ═══ THE READ — the document runs through its own aperture ═══════ */

/** Stepped page track: each sheet arrives, then holds. Authored as
    hold-pairs so a turn reads as a turn and not as a slide. */
function useReadTrack(progress: MotionValue<number>) {
  const [a, b] = T.read;
  const span = b - a;
  const per = span / SHEETS; // one sheet's share of the read
  const turn = per * 0.55; // how much of that share the turn itself takes

  const input: number[] = [];
  const output: string[] = [];
  const at = (k: number) => `${(-k * 100) / SHEETS}%`;
  for (let k = 0; k < SHEETS; k += 1) {
    const holdStart = a + k * per;
    input.push(holdStart, holdStart + (per - turn));
    output.push(at(k), at(k));
  }
  input.push(b);
  output.push(at(SHEETS - 1));

  return useScrub(progress, input, output, "drive");
}

function Document({
  progress,
  prm,
}: {
  progress: MotionValue<number>;
  prm: boolean;
}) {
  const y = useReadTrack(progress);
  const readDraw = useDraw(progress, T.read, "wipe");

  return (
    <div
      className={`texture-grain ${SHEET_H}`}
      style={{
        position: "relative",
        width: "min(600px, 100%)",
        background: CREAM,
        border: `1px solid ${HAIR}`,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.18), 0 46px 90px -34px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ height: APERTURE, overflow: "hidden" }}>
        <motion.div style={{ y: prm ? 0 : y, willChange: "transform" }}>
          {DOC_SHEETS}
        </motion.div>
      </div>

      {/* the read's own progress — a gold hairline closing the sheet */}
      <motion.span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          height: 1,
          background: GOLD,
          transformOrigin: "left",
          scaleX: prm ? 1 : readDraw,
        }}
      />
    </div>
  );
}

/* ═══ THE RAIL — submission terms, then the gate ══════════════════ */

function GateRow({
  label,
  i,
  progress,
  cleared,
  prm,
}: {
  label: string;
  i: number;
  progress: MotionValue<number>;
  cleared: boolean;
  prm: boolean;
}) {
  const at = T.gateFirst + i * T.gateStep;
  /* a requirement clears by drawing its own rule — the house hairline
     tick, never a dot and never a checkbox */
  const draw = useDraw(progress, [at, at + T.gateSpan], "wipe");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "22px minmax(0, 1fr)",
        alignItems: "center",
        gap: 12,
        padding: "6px 0",
        borderBottom: `1px solid ${HAIR}`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          display: "block",
          height: 1,
          background: HAIR_STRONG,
        }}
      >
        <motion.span
          style={{
            position: "absolute",
            inset: 0,
            background: GOLD,
            transformOrigin: "left",
            scaleX: prm ? 1 : draw,
          }}
        />
      </span>
      <span
        style={{
          fontFamily: SANS,
          fontSize: 12.5,
          color: ON_CREAM,
          opacity: prm || cleared ? 1 : 0.4,
          transition: FADE,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Verdict({ on }: { on: boolean }) {
  /* the real product state: locked until the last requirement clears, at
     which point The Market's agency action turns from "Prepare" to
     "Compose". A cross-fade in place — the chip does not move. */
  return (
    <div style={{ position: "relative", minHeight: 26 }}>
      <div style={{ opacity: on ? 0 : 1, transition: FADE }}>
        <Chip color={FAINT} border={HAIR_STRONG}>
          Send — locked
        </Chip>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: on ? 1 : 0,
          transition: FADE,
        }}
      >
        <Chip color={GOLD} border="rgba(201,165,90,0.55)">
          Send — cleared
        </Chip>
      </div>
    </div>
  );
}

function Seal({
  progress,
  phase,
  prm,
}: {
  progress: MotionValue<number>;
  phase: Phase;
  prm: boolean;
}) {
  const enter = useScrub(progress, T.railIn, [26, 0], "arrival");

  return (
    <motion.aside
      className="texture-grain"
      style={{
        x: prm ? 0 : enter,
        opacity: prm || phase.rail ? 1 : 0,
        transition: FADE,
        width: "100%",
        padding: "clamp(18px, 2.4vh, 24px) 22px",
        background: CREAM_WARM,
        border: `1px solid ${HAIR}`,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.14), 0 40px 80px -36px rgba(0,0,0,0.7)",
        display: "grid",
        gap: "clamp(13px, 1.9vh, 18px)",
        alignContent: "start",
        willChange: "transform",
      }}
    >
      {/* `.apply-seal__flow` — gold mono, then a gold hairline to the edge.
          Hidden on mobile: with no room for its paragraph it is a bare label,
          and the gate is the part that carries the argument. */}
      <span
        className="hidden md:flex"
        style={{ alignItems: "center", gap: 10 }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD,
            whiteSpace: "nowrap",
          }}
        >
          Submission terms
        </span>
        <span
          aria-hidden="true"
          style={{ flex: 1, height: 1, background: HAIR_GOLD }}
        />
      </span>

      <p
        className="hidden md:block"
        style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: 300,
          lineHeight: 1.6,
          color: ON_CREAM_SOFT,
        }}
      >
        Delivered to{" "}
        <strong style={{ fontWeight: 500, color: ON_CREAM }}>{AGENCY}</strong>{" "}
        as a separate recipient for representation review. Retained up to 24
        months; withdrawal redacts the snapshot.
      </p>

      <div>
        <Mono color={FAINT} size={9} tracking="0.2em">
          The send gate
        </Mono>
        {/* two-up on mobile: six stacked rows is the single biggest block in
            the mobile budget, and the gate reads fine paired */}
        <div
          className="grid grid-cols-2 gap-x-5 md:block"
          style={{ marginTop: 13, borderTop: `1px solid ${HAIR}` }}
        >
          {GATE.map((label, i) => (
            <GateRow
              key={label}
              label={label}
              i={i}
              progress={progress}
              cleared={phase.cleared > i}
              prm={prm}
            />
          ))}
        </div>
      </div>

      <Verdict on={prm || phase.verdict} />
    </motion.aside>
  );
}

/* ═══ STAGE ═══════════════════════════════════════════════════════ */

function SendCaption({
  progress,
  phase,
  prm,
}: {
  progress: MotionValue<number>;
  phase: Phase;
  prm: boolean;
}) {
  const y = useScrub(progress, T.captionIn, [16, 0], "arrival");

  return (
    <motion.div
      style={{
        opacity: prm || phase.caption ? 1 : 0,
        transition: FADE,
        y: prm ? 0 : y,
        willChange: "transform",
      }}
    >
      <Caption
        dark
        headline={
          <>
            Applications that arrive <V>complete.</V>
          </>
        }
        maxWidth={560}
      >
        One composed document &mdash; digitals, stats, book, comp card, note
        &mdash; that Pholio won&rsquo;t let leave until all six requirements
        clear.
      </Caption>
    </motion.div>
  );
}

/** One subscription reads the score and turns it into the scene's
    discrete states. React bails out when a flag is unchanged, so this
    costs a render only at the six or so moments something actually
    happens. */
function usePhase(progress: MotionValue<number>): Phase {
  const [phase, setPhase] = useState<Phase>({
    caption: false,
    rail: false,
    cleared: 0,
    verdict: false,
    dispatched: false,
    handoff: false,
  });

  useMotionValueEvent(progress, "change", (v) => {
    let cleared = 0;
    for (let i = 0; i < GATE.length; i += 1) {
      if (v >= T.gateFirst + i * T.gateStep + T.gateSpan) cleared = i + 1;
    }
    const next: Phase = {
      caption: v >= T.captionIn[1] && v < T.captionOut[0],
      rail: v >= T.railIn[1],
      cleared,
      verdict: v >= T.verdict[1],
      dispatched: v >= T.launch[0] + (T.launch[1] - T.launch[0]) * 0.35,
      handoff: v >= T.handoff[0],
    };
    setPhase((prev) =>
      prev.caption === next.caption &&
      prev.rail === next.rail &&
      prev.cleared === next.cleared &&
      prev.verdict === next.verdict &&
      prev.dispatched === next.dispatched &&
      prev.handoff === next.handoff
        ? prev
        : next,
    );
  });

  return phase;
}

function SendStage({
  progress,
  prm,
}: {
  progress: MotionValue<number>;
  prm: boolean;
}) {
  const arrive = useCatchSheet(progress, T.spreadIn);
  const launch = useLaunchForward(progress, T.launch);
  const phase = usePhase(progress);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* the fixed site header overlays the top of this sticky stage, so
          the spread centres in a header-safe band, not in the viewport */}
      <div className="absolute inset-0 flex items-center pt-10 md:pt-20">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          {/* the caption sits in the dark above the spread, left; the
              spread is offset right so the composition stays asymmetric */}
          <div className="md:pl-[6%]">
            <SendCaption progress={progress} phase={phase} prm={prm} />
          </div>

          <motion.div
            className="mt-6 md:mt-11"
            style={{
              x: prm ? 0 : arrive.x,
              y: prm ? 0 : launch.y,
              rotateX: prm ? 0 : arrive.rotateX,
              scale: prm ? 1 : launch.scale,
              /* the spread fades only as it passes the lens */
              opacity: prm || !phase.dispatched ? 1 : 0,
              transition: FADE,
              transformPerspective: 1600,
              transformOrigin: "50% 100%",
              willChange: "transform",
            }}
          >
            {/* `.apply-review` — the document against the terms rail */}
            {/* `align-items: start` — a stretched row would pad the sheet
                out below its own aperture with dead cream */}
            <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-[minmax(0,1fr)_288px] md:items-start md:gap-10 lg:gap-12">
              <div className="flex w-full justify-center md:justify-end">
                <Document progress={progress} prm={prm} />
              </div>
              <Seal progress={progress} phase={phase} prm={prm} />
            </div>
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "14%",
          width: 10,
          height: 3,
          background: GOLD,
          transform: "translateX(-50%)",
          opacity: !prm && phase.handoff ? 1 : 0,
          transition: FADE,
        }}
      />
    </div>
  );
}

export default function SceneSend() {
  const prm = usePrm();

  return (
    <Stage id="send" hvh={285} z={5} overlap={116} clip={false}>
      {(progress) => <SendStage progress={progress} prm={prm} />}
    </Stage>
  );
}
