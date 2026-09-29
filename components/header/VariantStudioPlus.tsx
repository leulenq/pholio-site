"use client";

/**
 * 02 — THE STUDIO+ HEADER
 *
 * The Index, carried into Studio+'s own world. Everything that makes it
 * Pholio's is kept exactly: the wordmark, the INDEX trigger, the full-screen
 * index, the band's geometry. Two things change, each because the page under
 * it is a film rather than a document.
 *
 * - **No paper over the film, and no sweep.** The Index lays opaque paper and
 *   its gold sweep across the top of the page once it is scrolled, which over
 *   a pinned scene cuts a strip off the photograph and rules a line through
 *   the stage (the same reason the home stage keeps its scrim, `kit.tsx`).
 *   So while any scene's stage is under the band the marks sit bare: the
 *   title scrim over dark frames, nothing over light ones, polarity sampled
 *   live. Between scenes (prologue, programme, fitting, credits) type scrolls
 *   under the marks, and there the band takes that section's own paper,
 *   opaque, so it reads as the section's top margin rather than a bar. The
 *   sweep is never drawn: on this page it would appear and vanish at every
 *   scene boundary.
 *
 * - **A running title.** Once the overture's own title has left the frame,
 *   "Studio+" joins the wordmark in the film's face, the way a book's running
 *   head names the work under the publisher. The word is set as the home
 *   stage sets STUDIO (capitals, the site serif, 0.05em) beside the
 *   overture's drawn gold cross, arriving as one mark
 *   (`lessons.md` §35.4), and it never shares the frame with the full-size
 *   title, so the name is on screen once. It returns to the programme, the
 *   page's own list of acts.
 *
 * Off /studio-plus (a `?header=studio-plus` review walking the site) there is
 * no film and no title to run, so it behaves as the Index without the paper.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { scrollPageTo } from "@/components/scroll-inertia";
import {
  EASE,
  FieldProvider,
  SERIF,
  IndexPanel,
  IndexTrigger,
  Wordmark,
  useHeaderState,
  type HeaderVariantProps,
} from "./kit";

/** STUDIO as the home stage sets it (`components/studio-site`, `WORDS`). */
const STUDIO_TRACKING = "0.05em";

/** Bottom of the marks' band. */
const BAND = 84;

/** The page's pinned scenes: sticky stages the band must never paper over. */
const FILM_SCENES = "[data-studio-plus] .scene";

/** True while any pinned scene's stage is under the band. */
function filmUnderBand(): boolean {
  return Array.from(document.querySelectorAll(FILM_SCENES)).some((scene) => {
    const rect = scene.getBoundingClientRect();
    return rect.top < BAND && rect.bottom > 0;
  });
}

/** True once the overture's title has travelled out of the top of the frame. */
function overturePassed(): boolean {
  const overture = document.querySelector("[data-studio-plus] #overture");
  if (!overture) return false;
  return overture.getBoundingClientRect().bottom < BAND;
}

/** What is under the band: whether the title has run, and whether it is film. */
function useFilmBand(enabled: boolean): { titled: boolean; onFilm: boolean } {
  const { scrollY } = useScroll();
  const [state, setState] = useState({ titled: false, onFilm: false });

  const measure = () =>
    setState((prev) => {
      const next = { titled: overturePassed(), onFilm: filmUnderBand() };
      return prev.titled === next.titled && prev.onFilm === next.onFilm
        ? prev
        : next;
    });

  useEffect(() => {
    if (!enabled) return;
    const frame = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(frame);
  }, [enabled]);

  useMotionValueEvent(scrollY, "change", () => {
    if (enabled) measure();
  });

  return enabled ? state : { titled: false, onFilm: false };
}

export default function VariantStudioPlus({
  theme = "ink",
  preview = false,
  previewState,
}: HeaderVariantProps) {
  const { tokens, field, revealed, condensed, paper, pathname, reduceMotion } =
    useHeaderState({
    theme,
    preview,
    previewState,
  });
  const [open, setOpen] = useState(false);
  const { titled, onFilm } = useFilmBand(!preview && pathname === "/studio-plus");
  const onPaper = condensed && !onFilm && !open;
  const T = reduceMotion ? "0s" : `0.5s cubic-bezier(${EASE.join(",")})`;

  const toProgramme = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const programme = document.getElementById("programme");
    if (!programme) return;
    e.preventDefault();
    scrollPageTo(programme.getBoundingClientRect().top + window.scrollY, {
      reduce: reduceMotion,
    });
  };

  return (
    <FieldProvider tokens={tokens}>
      <header
        data-site-header
        className={`${preview ? "absolute" : "fixed"} inset-x-0 top-0 z-[103]`}
        style={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? "auto" : "none",
          transition: `opacity ${T}`,
        }}
        aria-hidden={!revealed}
      >
        {/* Paper between scenes: the section's own colour, opaque, sampled
            from under the band. Never over a stage, and never closed by a
            rule. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: paper ?? tokens.surface,
            opacity: onPaper ? 1 : 0,
            transition: `opacity ${T}, background ${T}`,
          }}
        />

        {/* Title scrim over dark frames of the film. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 132,
            opacity: field === "ink" && !open && !onPaper ? 1 : 0,
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.55), rgba(5,5,5,0))",
            transition: `opacity ${T}`,
          }}
        />

        <div
          className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 md:px-12"
          style={{ paddingTop: 30, paddingBottom: 26 }}
        >
          <div className="flex items-baseline" style={{ gap: "clamp(14px, 1.6vw, 22px)" }}>
            <Link
              href="/"
              aria-label="Pholio — home"
              className="focus:outline-none"
              style={{ textDecoration: "none" }}
            >
              <Wordmark size={24} style={{ transition: `color ${T}` }} />
            </Link>

            <a
              href="#programme"
              onClick={toProgramme}
              aria-label="Studio+, the programme"
              aria-hidden={!titled || open}
              tabIndex={titled && !open ? 0 : -1}
              className="focus:outline-none focus-visible:underline"
              style={{
                display: "inline-flex",
                alignItems: "flex-start",
                textDecoration: "none",
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: 24,
                lineHeight: 0.8,
                letterSpacing: STUDIO_TRACKING,
                textTransform: "uppercase",
                color: tokens.text,
                opacity: titled && !open ? 1 : 0,
                pointerEvents: titled && !open ? "auto" : "none",
                transition: `opacity ${T}, color ${T}`,
              }}
            >
              {/* Pull back the tracking's trailing gap so the cross sits on the O. */}
              <span style={{ marginRight: `-${STUDIO_TRACKING}` }}>Studio</span>
              <StudioCross color={tokens.gold} />
            </a>
          </div>

          <IndexTrigger
            open={open}
            onToggle={() => setOpen((v) => !v)}
            label="Index"
            tokens={open ? { ...tokens, text: "#FAF7F2" } : tokens}
          />
        </div>
      </header>

      <IndexPanel
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        reduceMotion={reduceMotion}
        contained={preview}
        full
        top={0}
      />
    </FieldProvider>
  );
}

/**
 * The overture's cross at header scale: two drawn gold strokes standing at the
 * word's cap height, as the full-size title sets it. Drawn rather than typed so
 * it is the same object as the title's, not a font's plus sign.
 */
function StudioCross({ color }: { color: string }) {
  const bar = {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    background: color,
    transition: "background 0.5s cubic-bezier(0.22,1,0.36,1)",
  };
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-block",
        width: 9.7,
        height: 9.7,
        margin: "0.5px 0 0 3.2px",
        flexShrink: 0,
      }}
    >
      <span style={{ ...bar, width: "100%", height: 1.5 }} />
      <span style={{ ...bar, width: 1.5, height: "100%" }} />
    </span>
  );
}
