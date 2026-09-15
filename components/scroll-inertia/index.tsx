"use client";

/**
 * The page's weight.
 *
 * Every scroll scene on this site reads one value, the document's scroll
 * position, and until now that value was the trackpad's: it moved the
 * instant the hand did and stopped the instant it stopped. The scenes each
 * smoothed their own copy of it, but the page itself, the sticky stage, the
 * header's sampler and every plain section between them, stayed mechanical.
 *
 * This layer gives the scroll position itself mass. Lenis runs on native
 * scroll: it takes the wheel, moves a target, and eases the real
 * `scrollTop` toward that target every frame with an exponential approach
 * (`PAGE_INERTIA.lerp`). `position: sticky`, anchors, `scroll-margin`,
 * Framer's `useScroll`, the header's field sampler and everything else that
 * reads the document keep working unchanged, because the document really
 * is where it says it is. There is still one scroll source per page
 * (`lessons.md` §16.4); it is now a weighted one.
 *
 * What it deliberately does not do:
 *
 * - **Touch stays native.** A phone's own scroll physics already carry
 *   mass and momentum, and synthesising them in JavaScript is the thing
 *   that makes a hijacked page feel hijacked. `syncTouch` is off.
 * - **Reduced motion gets no layer at all.** The instance is never created
 *   under `prefers-reduced-motion: reduce`, and is destroyed if the
 *   preference flips while the page is open.
 * - **A locked page is a locked page.** The preloader locks scroll on the
 *   root and the index locks it on the body; while either is locked this
 *   layer is stopped, so the wheel cannot move the page behind a veil.
 * - **Nested scroll areas keep their own scroll.** Lenis hands the wheel
 *   to any scrollable ancestor of the pointer that can still take it.
 */

import { useEffect } from "react";
import Lenis from "lenis";
import { PAGE_INERTIA, PAGE_TRAVEL } from "./motion";

let instance: Lenis | null = null;

/** True when an inline `overflow: hidden` on the root or body has locked the page. */
function pageLocked(): boolean {
  const root = getComputedStyle(document.documentElement).overflowY;
  const body = getComputedStyle(document.body).overflowY;
  const locked = (v: string) => v === "hidden" || v === "clip";
  return locked(root) || locked(body);
}

export default function ScrollInertia() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: MutationObserver | null = null;

    const teardown = () => {
      observer?.disconnect();
      observer = null;
      instance?.destroy();
      instance = null;
    };

    const setup = () => {
      if (instance || media.matches) return;
      instance = new Lenis({
        lerp: PAGE_INERTIA.lerp,
        wheelMultiplier: PAGE_INERTIA.wheelMultiplier,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        autoRaf: true,
      });

      const sync = () => {
        if (!instance) return;
        if (pageLocked()) instance.stop();
        else instance.start();
      };
      observer = new MutationObserver(sync);
      observer.observe(document.documentElement, { attributeFilter: ["style", "class"] });
      observer.observe(document.body, { attributeFilter: ["style", "class"] });
      sync();
    };

    const onPreference = () => {
      if (media.matches) teardown();
      else setup();
    };

    setup();
    media.addEventListener("change", onPreference);
    return () => {
      media.removeEventListener("change", onPreference);
      teardown();
    };
  }, []);

  return null;
}

/**
 * Take the page somewhere, with the page's own weight.
 *
 * The one way the site should move the document itself. With the inertia
 * layer up it travels on the house ease (`PAGE_TRAVEL`); without it (reduced
 * motion, or before mount) it falls back to the browser's own behaviour, so
 * nothing here ever depends on the layer existing.
 */
export function scrollPageTo(
  target: HTMLElement | number,
  { reduce = false }: { reduce?: boolean | null } = {},
) {
  if (instance && !reduce) {
    instance.scrollTo(target, {
      duration: PAGE_TRAVEL.duration,
      easing: PAGE_TRAVEL.easing,
    });
    return;
  }
  const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
  } else {
    target.scrollIntoView({ behavior, block: "start" });
  }
}
