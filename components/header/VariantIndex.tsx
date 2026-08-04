"use client";

/**
 * 03 — THE INDEX
 *
 * Thesis: the most premium thing a header can do on this site is get out of the
 * way. The home page is a 300vh cinematic take; /talent is a continuous scroll
 * scene. Any persistent bar is a rectangle sitting on someone's photograph.
 *
 * So at rest there is no header at all — two corner marks in the page's top
 * margin: the wordmark alone, and an INDEX trigger. This is the mobile hamburger you
 * liked, promoted to the whole system, which means one navigation pattern
 * instead of a desktop bar plus a phone sheet.
 *
 * Opened, it is not a menu but an index page: mono margin numbers, serif
 * entries that turn italic-gold on hover (the site's verdict move), a clerical
 * column for everything secondary, and the positioning line at the foot. All
 * the brand weight the bar was trying to carry, spent in one place where it has
 * room to be good.
 *
 * Two surface concessions, both earned:
 *
 * - At the top of a page, a shallow scrim on ink pages so the corner marks stay
 *   legible over moving imagery. No blur, no shape, no border — a film title
 *   scrim, not a panel.
 * - Once the page is scrolled, the marks are no longer sitting in a designed top
 *   margin — they are over running body copy, and a mark with nothing behind it
 *   collides with the text (headings ran straight through the wordmark on the
 *   legal pages). So the band takes the page's own paper, opaque, closed by the
 *   gold sweep rather than a flat rule. Opaque paper rather than blur is the
 *   whole point: a header that needs a backing takes the colour of what it is
 *   covering.
 *
 * The band's geometry never changes — only the paper under it fades in — so
 * nothing shifts as you scroll.
 */

import { useState } from "react";
import Link from "next/link";

import {
  EASE,
  FieldProvider,
  GoldSweep,
  IndexPanel,
  IndexTrigger,
  Wordmark,
  useHeaderState,
  type HeaderVariantProps,
} from "./kit";

export default function VariantIndex({
  theme = "ink",
  preview = false,
  previewState,
}: HeaderVariantProps) {
  const { tokens, field, revealed, condensed, paper, pathname, reduceMotion } =
    useHeaderState({ theme, preview, previewState });
  const [open, setOpen] = useState(false);
  const T = reduceMotion ? "0s" : `0.5s cubic-bezier(${EASE.join(",")})`;

  /* Paper only once the page has moved under the marks. Open, the index owns
     the field and supplies its own. */
  const onPaper = condensed && !open;

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
        {/* Paper — the exact surface sampled from under the bar, opaque, never
            blurred. The polarity token is only the fallback. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: paper ?? tokens.surface,
            opacity: onPaper ? 1 : 0,
            transition: `opacity ${T}, background ${T}`,
          }}
        />
        {/* The band's bottom edge is the gold sweep, not a flat rule — the exact
            gradient .apply-workspace-top::after closes the app's /apply
            workspace topbar with (verified against pholio-app's source).
            Only shows once there's paper under it (condensed, index closed) —
            a permanent line at true page-top would sit on raw hero imagery. */}
        <GoldSweep
          opacity={onPaper ? 1 : 0}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            width: "auto",
          }}
        />

        {/* Legibility scrim — ink pages at the top of the page only, where there
            is no paper yet and the marks sit over imagery. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 132,
            opacity: field === "ink" && !open && !condensed ? 1 : 0,
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.55), rgba(5,5,5,0))",
            transition: `opacity ${T}`,
          }}
        />

        <div
          className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 md:px-12"
          style={{ paddingTop: 30, paddingBottom: 26 }}
        >
          {/* The resting state is the wordmark and nothing else — no descriptor,
              no clerical line. Whatever Pholio is gets said inside the index. */}
          <Link
            href="/"
            aria-label="Pholio — home"
            className="focus:outline-none"
            style={{ textDecoration: "none" }}
          >
            <Wordmark size={24} style={{ transition: `color ${T}` }} />
          </Link>

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
