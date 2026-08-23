"use client";

/* ═══════════════════════════════════════════════════════════════════
   /talent — one continuous take.
   Seven scenes, one camera move. The page owns a single interpolated
   background color field; scenes are transparent sticky stages that
   hand an element to the next scene at every boundary.
   Invisible logic: seen → sent → shared → remembered. Never printed.
   ═══════════════════════════════════════════════════════════════════ */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { SCENES, INK } from "./kit";
import SceneArrival from "./SceneArrival";
import SceneCard from "./SceneCard";
import SceneBook from "./SceneBook";
import SceneSend from "./SceneSend";
import SceneSignal from "./SceneSignal";
import SceneAddress from "./SceneAddress";
import SceneWallet from "./SceneWallet";
import SceneClose from "./SceneClose";
import ThemeColor from "@/components/ThemeColor";

/* Colour stops, derived from when each scene actually OWNS THE FRAME.
   A sticky stage is pinned from its own top until one viewport before
   its bottom, and overlapping stages shift those windows earlier — so
   the field has to follow the pin windows, not the document flow, or
   it arrives late and a cream scene plays over an ink field.
   Within its window a scene holds its colour; the morph happens in
   what's left at each seam, so a tight `hold` reads as a cut and a
   loose one as a dissolve. */
function buildColorTrack() {
  const VIEWPORT = 100; // vh

  /* section tops, accounting for each stage's negative pull-up */
  const tops: number[] = [];
  let flow = 0;
  SCENES.forEach((s, i) => {
    const top = i === 0 ? 0 : flow - s.overlap;
    tops.push(top);
    flow = top + s.h;
  });

  const totalHeight = flow;
  /* the flow's scrollYProgress spans (height − one viewport) */
  const denom = Math.max(totalHeight - VIEWPORT, 1);

  const stops: number[] = [];
  const colors: string[] = [];
  let previous = -1;

  SCENES.forEach((s, i) => {
    const pinStart = tops[i];
    const pinEnd = tops[i] + s.h - VIEWPORT;
    const duration = Math.max(pinEnd - pinStart, 1);
    const enter = (pinStart + duration * s.hold) / denom;
    const leave = (pinEnd - duration * s.hold) / denom;

    /* stops must stay strictly increasing for interpolation */
    for (const stop of [enter, leave]) {
      const value = Math.min(Math.max(stop, previous + 0.001), 1);
      stops.push(value);
      colors.push(s.bg);
      previous = value;
    }
  });

  return { stops, colors };
}

export default function TalentFlowPage() {
  const flowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ["start start", "end end"],
  });
  const { stops, colors } = buildColorTrack();
  const field = useTransform(scrollYProgress, stops, colors);
  const [themeColor, setThemeColor] = useState(INK);

  useEffect(() => {
    const latest = field.get();
    if (typeof latest === "string") setThemeColor(latest);
  }, [field]);

  useMotionValueEvent(field, "change", (latest) => {
    if (typeof latest === "string") setThemeColor(latest);
  });

  return (
    <main className="min-h-mobile-screen">
      <ThemeColor color={themeColor} />
      <motion.div ref={flowRef} style={{ backgroundColor: field }}>
        <SceneArrival />
        <SceneCard />
        <SceneBook />
        <SceneSend />
        <SceneSignal />
        <SceneAddress />
        <SceneWallet />
        <SceneClose />
      </motion.div>
    </main>
  );
}
