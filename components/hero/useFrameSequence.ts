"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Streams a frame sequence and paints it to one canvas.
 *
 * One canvas rather than stacked <img> layers: 127 promoted layers is the
 * memory problem `04-scroll-craft.md` §3 warns about, and a single drawImage
 * per changed frame keeps the work off layout entirely.
 */

const CONCURRENCY = 6;

export function useFrameSequence(
  frames: number[],
  srcFor: (frame: number) => string,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const lastDrawnRef = useRef(-1);
  const [posterReady, setPosterReady] = useState(false);

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(frames.length);
    const loaded: boolean[] = new Array(frames.length).fill(false);
    imagesRef.current = images;
    loadedRef.current = loaded;
    lastDrawnRef.current = -1;

    let cancelled = false;
    let cursor = 0;

    const loadAt = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.decoding = "async";
        images[index] = image;
        image.onload = () => {
          if (!cancelled) {
            loaded[index] = true;
            if (index === 0) setPosterReady(true);
          }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = srcFor(frames[index]);
      });

    // Sequential order, so the opening frames are always the first to arrive.
    const pump = async (): Promise<void> => {
      while (!cancelled) {
        const index = cursor;
        cursor += 1;
        if (index >= frames.length) return;
        await loadAt(index);
      }
    };

    void Promise.all(Array.from({ length: CONCURRENCY }, pump));

    return () => {
      cancelled = true;
    };
  }, [frames, srcFor]);

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

  return { canvasRef, draw, posterReady };
}
