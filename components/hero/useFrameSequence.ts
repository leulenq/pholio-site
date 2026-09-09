"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Streams a frame sequence and paints it to one canvas.
 *
 * One canvas rather than stacked <img> layers: 127 promoted layers is the
 * memory problem `04-scroll-craft.md` §3 warns about, and a single drawImage
 * per changed frame keeps the work off layout entirely.
 *
 * ── `stride`, and why a phone needs one ───────────────────────────────────
 *
 * Measured on the home stage at 390x844 under a 4x CPU throttle, with the
 * whole sequence already downloaded so nothing was waiting on the network:
 * scrubbing the hero and intelligence beats held a *median* frame time of
 * 130ms, against 17ms across the comp-card beat immediately after it, which
 * scrubs no footage. Eighty-four long tasks in one pass, the longest 168ms.
 * A profile put 78% of samples in native work rather than in any script.
 *
 * The cause is not drawImage. It is decode. 127 frames at 970x1640 is roughly
 * 800MB of decoded bitmap if the browser were to hold them all, so it holds
 * almost none, and every scroll step decodes its frame again from scratch on
 * the main thread.
 *
 * `stride` loads every Nth frame instead of all of them. Nothing else moves:
 * the timing model in `motion.ts` is authored against the full `FRAMES` array
 * and stays exactly as it is, and `draw` already snaps to the nearest frame
 * that has arrived, which is the same code path that carries a slow network.
 * Halving the count halves both the bytes and the number of live decodes, so
 * frames survive in the image cache long enough to be redrawn without one.
 */

const CONCURRENCY = 6;

/**
 * How many leading frames must arrive before the opening is honestly ready.
 *
 * Frames 1-12 are the held pose (`motion.ts` HERO_LAST_FRAME): across them the
 * silhouette does not move, so they are exactly what the visitor sees before
 * the first scroll. Revealing the stage with fewer than these in hand shows a
 * figure that cannot scrub.
 */
const OPENING_FRAMES = 12;

export function useFrameSequence(
  frames: number[],
  srcFor: (frame: number) => string,
  /** Load every Nth frame. 1 loads all of them. */
  stride = 1,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const lastDrawnRef = useRef(-1);
  const [posterReady, setPosterReady] = useState(false);
  const [openingReady, setOpeningReady] = useState(false);

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(frames.length);
    const loaded: boolean[] = new Array(frames.length).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;
    lastDrawnRef.current = -1;

    let cancelled = false;
    let cursor = 0;
    let openingLoaded = 0;

    /* The frames this stride actually fetches, in order. Index 0 is always
       included: it is the poster, and the composition at scroll zero. */
    const step = Math.max(1, Math.round(stride));
    const slots: number[] = [];
    for (let i = 0; i < frames.length; i += step) slots.push(i);
    if (slots[slots.length - 1] !== frames.length - 1) {
      slots.push(frames.length - 1);
    }

    const openingTarget = Math.min(
      slots.filter((i) => i < OPENING_FRAMES).length,
      slots.length,
    );

    const loadAt = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.decoding = "async";
        images[index] = image;
        image.onload = () => {
          if (!cancelled) {
            loaded[index] = true;
            if (index === 0) setPosterReady(true);
            if (index < OPENING_FRAMES) {
              openingLoaded += 1;
              if (openingLoaded >= openingTarget) setOpeningReady(true);
            }
          }
          resolve();
        };
        // A frame that 404s still counts toward the opening, so one missing
        // file degrades the scrub instead of pinning the preloader open.
        image.onerror = () => {
          if (!cancelled && index < OPENING_FRAMES) {
            openingLoaded += 1;
            if (openingLoaded >= openingTarget) setOpeningReady(true);
          }
          resolve();
        };
        image.src = srcFor(frames[index]);
      });

    // Sequential order, so the opening frames are always the first to arrive.
    const pump = async (): Promise<void> => {
      while (!cancelled) {
        const slot = cursor;
        cursor += 1;
        if (slot >= slots.length) return;
        await loadAt(slots[slot]);
      }
    };

    void Promise.all(Array.from({ length: CONCURRENCY }, pump));

    return () => {
      cancelled = true;
    };
  }, [frames, srcFor, stride]);

  const draw = useCallback(
    (target: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const loaded = loadedRef.current;
      const images = imagesRef.current;
      const wanted = Math.min(Math.max(Math.round(target), 0), frames.length - 1);

      // While the sequence is still streaming, hold the nearest frame that has
      // arrived instead of blanking the stage.
      let index = wanted;
      if (!loaded[index]) {
        let back = wanted;
        while (back >= 0 && !loaded[back]) back -= 1;
        let forward = wanted;
        while (forward < frames.length && !loaded[forward]) forward += 1;

        if (back < 0 && forward >= frames.length) return;
        if (back < 0) index = forward;
        else if (forward >= frames.length) index = back;
        else index = wanted - back <= forward - wanted ? back : forward;
      }

      if (index === lastDrawnRef.current) return;

      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
      lastDrawnRef.current = index;
    },
    [frames.length],
  );

  return { canvasRef, draw, posterReady, openingReady };
}
