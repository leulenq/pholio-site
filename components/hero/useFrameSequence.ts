"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Streams a frame sequence and paints it to one canvas.
 *
 * One canvas rather than stacked <img> layers: 127 promoted layers is the
 * memory problem `04-scroll-craft.md` §3 warns about, and a single drawImage
 * per changed frame keeps the work off layout entirely.
 *
 * ── What this scrub actually costs, and where ─────────────────────────────
 *
 * Traced on the home stage at 390x844, DPR 3, under a 4x CPU throttle, on a
 * production build with the whole sequence already downloaded so nothing
 * waits on the network. One pass over the hero and intelligence beats:
 *
 *   Decode Image      9045ms across 59 events   (153ms each)
 *   Commit           12211ms
 *   RasterTask        1301ms
 *   FunctionCall      1319ms
 *
 * With the sequence blocked and everything else identical, the same pass is
 * 484ms of decode and 2202ms of commit. So the footage is the scrub, the
 * decode is the footage, and script, raster, layout and the observers
 * together are a rounding error against it. Per frame it is one synchronous
 * decode of a 970x1640 plate inside `Commit`, ~38ms of real phone time, and
 * it lands on the frame that needs it: a median of 17ms with a p90 of 250ms
 * and a p99 of 433ms, which is a scrub that looks fine on average and stalls
 * in the hand.
 *
 * Decode is paid per source pixel, so the fix is to stop sending a phone
 * pixels it cannot paint (`motion.ts`, FRAME_PLATE): at 728x1231 the same
 * frame decodes in a little over half the time, and the decoded bitmap is
 * 3.6MB rather than 6.4MB, so more of the sequence survives in the image
 * cache between passes. `stride` — loading every Nth frame — was the earlier
 * answer to the same number and is kept for when a stage genuinely cannot
 * afford the whole sequence; it is 1 everywhere now. `draw` snaps to the
 * nearest frame that has arrived either way, which is the same code path
 * that carries a slow network.
 */

const CONCURRENCY = 6;

/**
 * Read-ahead: tried, measured, not kept.
 *
 * `drawImage` on a loaded-but-undecoded image records a lazy reference and
 * the decode is resolved later, inside the compositor's `Commit` — which is
 * what `Decode LazyPixelRef` in the trace above is, and why the cost lands
 * as a stall rather than as script. `HTMLImageElement.decode()` resolves
 * that reference in advance and off the main thread, so priming a few frames
 * into the direction of travel looks like it should take the decode off the
 * frame that needs it.
 *
 * It does not, on this scrub. Priming four frames ahead took total blocking
 * across one pass from 1829ms to 2111ms, and two frames ahead to 2238ms.
 * Under a 4x throttle the decode cannot finish before the scroll has already
 * consumed the frames it was primed for, so the primes are work done twice:
 * once speculatively and once again in the commit that needed it. The window
 * that would help is one long enough to outrun a thumb, and that window is
 * more decoded bitmap than a phone should hold.
 *
 * If this is revisited, measure before believing it.
 */

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
  /** The plate's own size, which is also the canvas's backing store. Two
      scalars rather than an object: this feeds a dependency array. */
  plateWidth?: number,
  plateHeight?: number,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const lastDrawnRef = useRef(-1);
  /** The frame the scrub last asked for, and the painter, so an arriving
      frame can put itself on screen without waiting for a scroll event. */
  const wantedRef = useRef(0);
  const drawRef = useRef<(target: number) => void>(() => {});
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
            /* Paint if the stage is empty or this is the frame it is
               waiting on. A plate swap — crossing the narrow breakpoint,
               or a phone turned on its side — clears the canvas and drops
               every loaded flag, and nothing else repaints until the next
               scroll event, which on a stage the visitor is reading rather
               than scrolling is a blank frame held indefinitely. */
            if (lastDrawnRef.current === -1 || index === Math.round(wantedRef.current)) {
              drawRef.current(wantedRef.current);
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

    /* Start on the next frame, not this one.
     *
     * The stage picks its plate from a media query, and a media query has no
     * server answer: `useMediaQuery` hydrates with `false`, so the first
     * client render of a phone is the wide stage, and React corrects it
     * immediately afterwards. Firing the pump synchronously means that
     * correction arrives after six full-size frames — 544KB and six of the
     * most expensive decodes on the page — are already in flight on the
     * device that can least afford them. A frame's delay costs nothing here
     * (the preloader is still up) and the cleanup cancels it, so the wrong
     * plate is never requested at all. */
    const start = requestAnimationFrame(() => {
      if (!cancelled) void Promise.all(Array.from({ length: CONCURRENCY }, pump));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(start);
    };
  }, [frames, srcFor, stride]);

  /* Changing a canvas's width or height clears it. The stage does that when
     it crosses the narrow breakpoint and swaps plates, so the frame the
     scrub last drew is no longer on screen even though its index is still
     the one we hold. Forget it, and let the caller's redraw repaint. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !plateWidth || !plateHeight) return;
    if (canvas.width !== plateWidth) canvas.width = plateWidth;
    if (canvas.height !== plateHeight) canvas.height = plateHeight;
    lastDrawnRef.current = -1;
  }, [plateWidth, plateHeight]);

  const draw = useCallback(
    (target: number) => {
      wantedRef.current = target;
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

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  return { canvasRef, draw, posterReady, openingReady };
}
