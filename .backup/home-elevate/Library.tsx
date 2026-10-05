"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

import { LIBRARY, SHOTS, librarySrc } from "./her-library";
import { progressAtFrame } from "./motion";

/**
 * Her library, understood, and then reasoned across.
 *
 * One set of objects, her own photographs, carried across two chapters of
 * the stage (`lessons.md` §49). Nothing here is made by Pholio:
 *
 *   arrives     while "sees the frame" holds, her library pours up into the
 *               dark room behind her: sixty frames, every sitting, every
 *               orientation, in no order and unlit
 *   understood  then it is read. Group by group, each photograph travels to
 *               the pile of what it actually is, and comes into the light as
 *               it lands: the order is the proof. Each pile carries its
 *               taxonomy label, set as data under it
 *   reasoned    in the card chapter the hero rises out of the full-length
 *               pile and becomes the card's front; four complementary frames
 *               leave their piles and go behind the card, and the card's
 *               turn shows them composed on its back. The rest of the library
 *               falls away beneath the frame
 *
 * Unread is darkness, not transparency: an unread frame is the photograph
 * at low exposure, which is the key light's language, and nothing is ever
 * half there (§26.1). Positions are set imperatively from one rAF loop that
 * reads the two timelines; no scroll listener.
 */

type Rect = { x: number; y: number; w: number; h: number; r: number; b: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const out = (t: number) => 1 - Math.pow(1 - t, 3);
const inout = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const accel = (t: number) => t * t * t;
const P = (frame: number) => progressAtFrame(frame);
const mix = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
  r: a.r + (b.r - a.r) * t,
  b: a.b + (b.b - a.b) * t,
});

/** Deterministic scatter, so a reload lands every frame in the same place. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Exposure of a frame not yet read. */
const UNREAD = 0.3;

/** Frames (of the footage) at which the library starts arriving / sorting. */
const ARRIVE_FROM = 62;
const ARRIVE_SPAN = 30;
const ARRIVE_EACH = 16;
const SORT_FROM = 100;
const SORT_GROUP_STEP = 6.5;
const SORT_EACH = 10;

/** Card-beat timeline (`components/comp-card/motion.ts` T). */
const CARD = {
  heroFrom: 0.02,
  heroTo: 0.205,
  /** Hand over to the real card a hair after it is shown at the same rect. */
  heroRelease: 0.225,
  backFrom: 0.215,
  backEach: 0.016,
  backSpan: 0.085,
  fallFrom: 0.3,
  fallTo: 0.44,
};

const ORDER = LIBRARY.map((item, i) => ({ item, i }));
/**
 * Each pile, bottom to top. Landscape frames lie lowest; the frames the card
 * is made from lie on top, the hero uppermost, so the frame that leads is in
 * sight on its pile before it is chosen.
 */
const weight = ({ item }: { item: (typeof LIBRARY)[number] }) =>
  (item.aspect > 1 ? -1 : 0) + (item.role === "back" ? 1 : 0) + (item.role === "hero" ? 2 : 0);
const BY_SHOT = SHOTS.map(({ shot }) =>
  ORDER.filter(({ item }) => item.shot === shot).sort((a, b) => weight(a) - weight(b)),
);
const BACKS = ORDER.filter(({ item }) => item.role === "back").map(({ i }) => i);

export default function Library({
  hero,
  card,
  narrow,
  armed,
}: {
  /** The hero's timeline, 0..1. */
  hero: MotionValue<number>;
  /** The comp-card beat's timeline, 0..1, before its own smoothing. */
  card: MotionValue<number>;
  narrow: boolean;
  armed: boolean;
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    let last = "";

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const W = window.innerWidth;
      const H = window.innerHeight;
      const p = hero.get();
      const c = card.get();
      const stamp = `${p.toFixed(5)}:${c.toFixed(5)}:${W}:${H}`;
      if (stamp === last) return;
      last = stamp;

      // Before it arrives and after it has fallen, nothing to do.
      if (p < P(ARRIVE_FROM) - 0.001) {
        itemRefs.current.forEach((el) => el && (el.style.visibility = "hidden"));
        labelRefs.current.forEach((el) => el && (el.style.visibility = "hidden"));
        return;
      }

      // ── Pile geometry ──
      const pileH = narrow ? 0.085 * H : 0.17 * H;
      const pileCentre = (g: number) => {
        if (!narrow) return { x: 0.05 * W + (g + 0.5) * ((0.9 * W) / SHOTS.length), y: 0.86 * H };
        const row = g < 4 ? 0 : 1;
        const col = row === 0 ? g : g - 4;
        const n = row === 0 ? 4 : 3;
        return { x: (W / (n + 1)) * (col + 1), y: (row === 0 ? 0.795 : 0.925) * H };
      };
      const pileRect = (g: number, k: number, aspect: number): Rect => {
        const centre = pileCentre(g);
        const h = pileH;
        const w = h * aspect;
        const jitter = (rand(g * 31 + k) - 0.5) * 2;
        return {
          x: centre.x - w / 2 + jitter * pileH * 0.06,
          y: centre.y - h - k * pileH * 0.022,
          w,
          h,
          r: jitter * 2.4,
          b: 1,
        };
      };
      const scatterRect = (i: number, aspect: number): Rect => {
        const h = (narrow ? 0.09 : 0.15) * H + rand(i * 7 + 3) * (narrow ? 0.06 : 0.12) * H;
        const w = h * aspect;
        return {
          x: rand(i * 13 + 1) * (W - w),
          y: (narrow ? 0.3 : 0.05) * H + rand(i * 17 + 5) * ((narrow ? 0.62 : 0.78) * H - h),
          w,
          h,
          r: (rand(i * 19 + 9) - 0.5) * 14,
          b: UNREAD,
        };
      };

      // ── The card's rest rect: centred on the stage, its own size ──
      const face = document.querySelector<HTMLElement>("[data-lead-card] > div");
      const cw = face?.offsetWidth ?? 0.3 * H;
      const ch = face?.offsetHeight ?? 0.46 * H;
      const cardRect: Rect = { x: W / 2 - cw / 2, y: H / 2 - ch / 2, w: cw, h: ch, r: 0, b: 1 };

      BY_SHOT.forEach((group, g) => {
        const sortStart = P(SORT_FROM + g * SORT_GROUP_STEP);
        const label = labelRefs.current[g];

        group.forEach(({ item, i }, k) => {
          const el = itemRefs.current[i];
          if (!el) return;

          const scatter = scatterRect(i, item.aspect);
          const a0 = P(ARRIVE_FROM + (i / LIBRARY.length) * ARRIVE_SPAN);
          const a1 = P(ARRIVE_FROM + (i / LIBRARY.length) * ARRIVE_SPAN + ARRIVE_EACH);
          if (p < a0) {
            el.style.visibility = "hidden";
            return;
          }
          // Arrives: up from below the frame into the scatter.
          const arrive = out(seg(p, a0, a1));
          let r: Rect = { ...scatter, y: scatter.y + (1 - arrive) * (H * 1.05 - scatter.y + scatter.h) };

          // Understood: into the pile of what it is, coming into the light.
          const s0 = P(SORT_FROM + g * SORT_GROUP_STEP + k * 0.3);
          const s1 = P(SORT_FROM + g * SORT_GROUP_STEP + k * 0.3 + SORT_EACH);
          const sort = inout(seg(p, s0, s1));
          const pile = pileRect(g, k, item.aspect);
          if (sort > 0) {
            r = mix(r, pile, sort);
            r.b = UNREAD + (1 - UNREAD) * seg(sort, 0.35, 1);
          }

          let z = 10 + k;
          let hidden = false;

          if (item.role === "hero") {
            // Reasoned: the hero rises out of its pile and becomes the card.
            const t = inout(seg(c, CARD.heroFrom, CARD.heroTo));
            if (t > 0) {
              r = mix(r, cardRect, t);
              z = 400;
            }
            if (c >= CARD.heroRelease) hidden = true;
          } else if (item.role === "back") {
            const j = BACKS.indexOf(i);
            const b0 = CARD.backFrom + j * CARD.backEach;
            const t = inout(seg(c, b0, b0 + CARD.backSpan));
            if (t > 0) {
              const behind = {
                ...cardRect,
                x: cardRect.x + cardRect.w * 0.08,
                y: cardRect.y + cardRect.h * 0.08,
                w: cardRect.w * 0.84,
                h: cardRect.h * 0.84,
              };
              r = mix(r, behind, t);
              z = 300 + j;
            }
            if (t >= 1) hidden = true;
          } else {
            // The rest falls away beneath the frame, pile by pile.
            const f = accel(seg(c, CARD.fallFrom + g * 0.008, CARD.fallTo + g * 0.008));
            if (f > 0) r = { ...r, y: r.y + f * (H * 1.1 - r.y + r.h) };
          }

          if (r.y > H || hidden) {
            el.style.visibility = "hidden";
            return;
          }
          el.style.visibility = "visible";
          el.style.zIndex = String(z);
          el.style.width = `${r.w}px`;
          el.style.height = `${r.h}px`;
          el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) rotate(${r.r}deg)`;
          el.style.filter = r.b >= 0.999 ? "none" : `brightness(${r.b.toFixed(3)})`;
        });

        // The pile's label: data under real objects, set as the pile lands.
        if (label) {
          const shown = seg(p, sortStart + (P(SORT_FROM + SORT_EACH) - P(SORT_FROM)) * 0.6, sortStart + (P(SORT_FROM + SORT_EACH + 3) - P(SORT_FROM)));
          const fall = accel(seg(c, CARD.fallFrom + g * 0.008, CARD.fallTo + g * 0.008));
          const centre = pileCentre(g);
          const y = centre.y + (narrow ? 0.008 : 0.016) * H + (1 - out(shown)) * 14 + fall * H * 0.4;
          label.style.visibility = shown > 0 && fall < 1 ? "visible" : "hidden";
          label.style.opacity = out(shown).toFixed(3);
          label.style.transform = `translate3d(${centre.x}px, ${y}px, 0) translateX(-50%)`;
        }
      });
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hero, card, narrow]);

  return (
    <>
      {LIBRARY.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 overflow-hidden"
          style={{
            visibility: "hidden",
            willChange: "transform",
            boxShadow: "0 14px 34px -14px rgba(0,0,0,0.75)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={armed ? librarySrc(item.id) : undefined}
            alt=""
            draggable={false}
            decoding="async"
            className="block h-full w-full object-cover"
          />
        </div>
      ))}
      {SHOTS.map(({ shot, label }, g) => (
        <div
          key={shot}
          ref={(el) => {
            labelRefs.current[g] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono uppercase text-[#FAF7F2]/80"
          style={{
            visibility: "hidden",
            fontSize: narrow ? 8.5 : 11,
            letterSpacing: "0.18em",
          }}
        >
          {label}
          <span className="ml-[0.9em] text-[#C9A55A]">{BY_SHOT[g].length}</span>
        </div>
      ))}
    </>
  );
}
