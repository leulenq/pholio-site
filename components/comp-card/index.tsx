"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

import { useFrame } from "@/components/prepared-for";
import { useMediaQuery } from "@/components/hero/useMediaQuery";
import { CARDS } from "./designs";
import { createChapter, face, type Chapter } from "./engine";
import { CARD_FONTS } from "./fonts";
import { V_TOTAL, cardRest } from "./motion";
import "./chapter.css";

/**
 * The comp-card chapter on the home stage. `progress` is the stage's own
 * smoothed timeline for this chapter, 0..1 across `V_TOTAL` vh of scroll.
 *
 * The cards are built once the stage arms them (their ~6MB of photographs
 * are not needed until the intelligence is over), then every frame is a
 * function of `progress` and of a slow lean toward the pointer.
 */
export function CompCardLayers({
  progress,
  assetsArmed = true,
  w,
  h,
}: {
  progress: MotionValue<number>;
  assetsArmed?: boolean;
  w: number;
  h: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<Chapter | null>(null);
  const kickRef = useRef<() => void>(() => {});
  const compact = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const root = rootRef.current;
    if (!assetsArmed || !root) return;
    const chapter = createChapter(root, w, h, cardRest(w < 768 ? "compact" : "wide", w, h));
    chapterRef.current = chapter;

    // Pointer: the whole camera leans a little toward the hand.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastV = -1;
    let raf = 0;
    const frame = () => {
      raf = 0;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const v = progress.get() * V_TOTAL;
      const settling = Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002;
      // Nothing of this chapter is on the stage before or after it.
      if (v !== lastV || (settling && v > 0 && v < V_TOTAL)) {
        chapter.render(v, pointer);
        lastV = v;
      }
      if (settling) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    kickRef.current = () => {
      lastV = -1;
      kick();
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    const off = progress.on("change", kick);
    window.addEventListener("pointermove", onPointer);
    kick();
    return () => {
      off();
      window.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
      chapter.destroy();
      chapterRef.current = null;
    };
    // Built once per arming; the frame is passed on through `resize`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsArmed, progress]);

  useEffect(() => {
    chapterRef.current?.resize(w, h, cardRest(compact ? "compact" : "wide", w, h));
    kickRef.current();
  }, [w, h, compact]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Ola Szkolda's comp card, front and back, and five more directions made from the same library of her photographs"
      className={`ccx pointer-events-none absolute inset-0 ${CARD_FONTS}`}
    />
  );
}

/**
 * Reduced motion: a second composition, not a shorter scrub. Every card
 * flat, front beside back, at a size to be read.
 */
export default function SceneCompCard() {
  const frame = useFrame();
  const narrow = frame.w < 768;
  // A pair is two cards and a gutter; a phone shows one pair to a row.
  const cw = Math.min(300, ((narrow ? frame.w : frame.w / 2) - (narrow ? 48 : 120)) / 2);
  const k = cw / CARDS.B;
  const ch = cw * (CARDS.BH / CARDS.B);

  return (
    <section className={`ccx-sheet relative w-full bg-[#050505] ${CARD_FONTS}`}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 justify-items-center gap-x-12 gap-y-20 px-6 py-24 md:grid-cols-2">
        {CARDS.list.map((c, i) => (
          <figure key={c.id} className="m-0 flex flex-col gap-5">
            <div className="flex gap-3">
              {(["front", "back"] as const).map((side) => (
                <div
                  key={side}
                  className="flat"
                  style={{ width: cw, height: ch, background: side === "front" ? c.fbg : c.bbg }}
                >
                  <div
                    className="inner"
                    style={{ transform: `scale(${k})` }}
                    dangerouslySetInnerHTML={{ __html: face(c, side) }}
                  />
                </div>
              ))}
            </div>
            <figcaption className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#FAF7F2]/55">
              <span className="mr-[1em] text-[#C9A55A]">{String(i + 1).padStart(2, "0")}</span>
              {c.name} — {c.sub}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
