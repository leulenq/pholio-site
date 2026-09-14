"use client";

/**
 * `/agency/request-access`: the threshold between the public site and the
 * agency workspace.
 *
 * The public site is velvet and cinematic. The agency dashboard is cream
 * paper, a ledger, quiet and dense. This page is the door between them, and
 * it is built the way this site already crosses from one world to the other
 * (lessons.md §36): the dark world becomes the light one. It opens on velvet
 * with one trivial question. When the agency names itself, the room is lit
 * to the workspace's paper, and the rest of the request is drawn up on it as
 * a record. Nothing leaves, nothing arrives, no wipe: every colour on the
 * page is a CSS variable, and one exposure value moves all of them.
 *
 * There is no photograph here on purpose. The site's imagery rule
 * (banned-ui §7.1) is about marketing sections; a request being drawn up is
 * the one surface where a talent photograph would be decoration, and would
 * read as a listing beside an intake form.
 *
 * What happens after you submit sits below the request (Process.tsx),
 * collapsed by default: it is for the agency that wants it, before sending or
 * after, and it is not needed to send. Nothing points at it.
 */

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

import ThemeColor from "@/components/ThemeColor";
import type { AgencyAccessRequest } from "@/lib/agency-access-request";
import { SUPPORT_EMAIL } from "@/lib/legal-constants";

import { Arrive } from "./Arrive";
import { Process } from "./Process";
import { RequestLedger } from "./RequestLedger";
import { OPENING, SUCCESS } from "./content";
import { RuleLink } from "./kit";

const INK = "#050505";
const CREAM = "#FAF7F2";
const GOLD = "#C9A55A";
const GOLD_DARK = "#A8894E";

/**
 * The light. A dimmer's curve, not a linear mix: almost nothing at first,
 * then quick, then settling.
 */
const LIGHT_DURATION = 1.4;
const LIGHT_EASE: [number, number, number, number] = [0.7, 0, 0.25, 1];

/**
 * The paper is the cream underexposed, never a mix of two colours: each
 * channel is the cream's own value times the exposure, and the exposure
 * bites harder on blue than on red so the mid-tones warm as they dim rather
 * than passing through concrete (lessons.md §35.3, §36.2). At zero it is
 * the velvet exactly.
 */
const WARMTH = { r: 0.9, g: 0.97, b: 1.07 } as const;
const paperAt = (e: number) => {
  const ch = (v: number, x: number) => Math.round(5 + (v - 5) * Math.pow(e, x));
  return `rgb(${ch(250, WARMTH.r)}, ${ch(247, WARMTH.g)}, ${ch(242, WARMTH.b)})`;
};

/**
 * The type has to invert, and any two colours that swap luminance meet in
 * the middle. So the ink does not ride the whole light: it turns over in a
 * narrow band of the exposure, which the dimmer's curve crosses fastest, and
 * is cream on a darkening room before it and ink on a lit one after.
 */
const INK_TURN = [0.42, 0.58] as const;

export function AgencyAccessPage() {
  const reduce = useReducedMotion();
  const [lit, setLit] = useState(false);
  const [sent, setSent] = useState<AgencyAccessRequest | null>(null);
  const exposure = useMotionValue(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /* The received page is read from the top: the title changes, so the reader
     is taken back to it and it takes focus. */
  useEffect(() => {
    if (!sent) return;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const timer = window.setTimeout(
      () => headingRef.current?.focus({ preventScroll: true }),
      reduce ? 0 : 500,
    );
    return () => window.clearTimeout(timer);
  }, [sent, reduce]);

  useEffect(() => {
    if (!lit) return;
    /* The header samples the paper under its band only when the page scrolls,
       so while the light comes up it is told to look again on every frame;
       otherwise it keeps whatever exposure it last read. */
    const resample = () => window.dispatchEvent(new Event("scroll"));
    const controls = animate(exposure, 1, {
      duration: reduce ? 0 : LIGHT_DURATION,
      ease: LIGHT_EASE,
      onUpdate: resample,
      onComplete: resample,
    });
    return () => controls.stop();
  }, [lit, exposure, reduce]);

  const paper = useTransform(exposure, paperAt);
  const turn = useTransform(exposure, [...INK_TURN], [0, 1], { clamp: true });
  const type = useTransform(turn, [0, 1], [CREAM, INK]);
  const muted = useTransform(turn, [0, 1], ["rgba(250,247,242,0.66)", "rgba(5,5,5,0.62)"]);
  const hair = useTransform(turn, [0, 1], ["rgba(250,247,242,0.14)", "rgba(5,5,5,0.12)"]);
  const rule = useTransform(turn, [0, 1], ["rgba(250,247,242,0.30)", "rgba(5,5,5,0.24)"]);
  const gold = useTransform(turn, [0, 1], [GOLD, GOLD_DARK]);
  const goldInverse = useTransform(turn, [0, 1], [GOLD_DARK, GOLD]);
  /* Panels take the header's own solid panel colour for each field. */
  const panel = useTransform(turn, [0, 1], ["#0A0A0A", "#FFFFFF"]);
  const panelHover = useTransform(turn, [0, 1], ["#141414", "#F5F0E8"]);

  return (
    <>
      <ThemeColor color={lit ? CREAM : INK} />
      <motion.div
        className="texture-grain relative min-h-mobile-screen"
        style={{
          background: paper,
          color: type,
          // The page's palette, moved by one exposure value.
          ["--paper" as string]: paper,
          ["--type" as string]: type,
          ["--muted" as string]: muted,
          ["--hair" as string]: hair,
          ["--rule" as string]: rule,
          ["--gold" as string]: gold,
          ["--gold-inverse" as string]: goldInverse,
          ["--panel" as string]: panel,
          ["--panel-hover" as string]: panelHover,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 pt-40 pb-32 md:px-12">
          {sent ? (
            <Arrive key="received">
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="font-editorial outline-none"
                style={{
                  fontSize: "clamp(2.75rem, 7vw, 6.5rem)",
                  lineHeight: 1.0,
                  color: "var(--type)",
                }}
              >
                {SUCCESS.heading}
              </h1>
              <p
                className="mt-8 max-w-xl font-sans text-base font-light leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {SUCCESS.bodyBefore}
                <span style={{ color: "var(--type)" }}>{sent.contactEmail}</span>
                {SUCCESS.bodyAfter}
              </p>
              <p className="mt-4 max-w-xl font-sans text-[13px]" style={{ color: "var(--muted)" }}>
                {SUCCESS.correctionBefore}
                <RuleLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</RuleLink>
                {SUCCESS.correctionAfter}
              </p>
            </Arrive>
          ) : (
            <Arrive key="opening">
              <h1
                className="font-editorial"
                style={{
                  fontSize: "clamp(2.75rem, 7vw, 6.5rem)",
                  lineHeight: 1.0,
                  maxWidth: "14ch",
                  color: "var(--type)",
                }}
              >
                {OPENING.headingPrefix}
                <span className="font-editorial-italic" style={{ color: "var(--gold)" }}>
                  {OPENING.headingItalic}
                </span>
                {OPENING.headingSuffix}
              </h1>
              <p
                className="mt-8 max-w-xl font-sans text-base font-light leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {OPENING.support}
              </p>
            </Arrive>
          )}

          <div className="mt-20 md:mt-24">
            <Arrive delay={0.15}>
              <RequestLedger onEnter={() => setLit(true)} onSent={setSent} />
            </Arrive>
          </div>

          <div className="mt-20 md:mt-24" style={{ color: "var(--type)" }}>
            <Process />
          </div>
        </div>
      </motion.div>
    </>
  );
}
