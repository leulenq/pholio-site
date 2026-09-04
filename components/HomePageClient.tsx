"use client";

import { useState, useCallback, useEffect } from "react";
import Hero from "@/components/hero";
import Preloader from "@/components/Preloader";

export default function HomePageClient() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
    if (typeof window !== "undefined") {
      (window as Window & { __preloaderDone?: boolean }).__preloaderDone = true;
      window.dispatchEvent(new Event("preloader-done"));
    }
  }, []);

  const handleHeroReady = useCallback(() => setHeroReady(true), []);

  /* The wordmark is set in Noto Serif Display at clamp(5rem, 28vw, 28rem).
     Revealing it in the Georgia fallback and reflowing a moment later is the
     same class of problem as revealing an unloaded hero. */
  useEffect(() => {
    let cancelled = false;
    const settle = () => {
      if (!cancelled) setFontsReady(true);
    };
    /* No FontFaceSet (older Safari) means nothing to wait on, but the resolve
       still goes through a microtask so the flag never lands synchronously. */
    const pending = document.fonts?.ready ?? Promise.resolve();
    pending.then(settle, settle);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Preloader
        ready={heroReady && fontsReady}
        onComplete={handlePreloaderComplete}
      />
      <div
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: "opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* The home stage: hero, intelligence and the comp card beat share
            one pinned container and one scroll, so there is no unpin between
            the scenes. See components/hero/motion.ts. */}
        <Hero ready={preloaderDone} onReady={handleHeroReady} />
      </div>
    </>
  );
}
