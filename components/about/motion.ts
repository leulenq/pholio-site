/**
 * The /about page's motion engine.
 *
 * about.html declares scenes; this writes a few numbers into each and the
 * stylesheet does the rest. Per scene, whenever the document has moved:
 *
 *   --p          progress, 0 → 1
 *                  pin   0 when the sticky stage locks, 1 when it releases
 *                  pass  0 when the element's top enters, 1 when its bottom leaves
 *   data-step    floor(p × data-steps), for scenes that change in turns
 *   --sp         progress within the current step, 0 → 1
 *   data-phase   "tempt" for the first half of a step, "real" for the second
 *                (We only: the easy ending, then the one we chose)
 *
 * Two scenes need more than progress, and declare it with data-hook:
 *
 *   stream  the wall of faces. Each [data-col] drifts on its own clock at its
 *           own data-speed, looping seamlessly (its tiles are doubled), and a
 *           flick of the scroll makes the faces rush. Reading on slows it,
 *           but never to a stop, so the faces keep moving inside the letters
 *           cut out of the dark.
 *   track   the sentence. The section's height is set from the line's width
 *           so one pixel of scroll moves the line one pixel; it comes to rest
 *           with its last photograph centred. Photographs near the centre
 *           swell (--near), and any with data-frames play a few frames of
 *           their own sitting as they pass.
 *
 * Reads the real document scroll position, so it moves with the site's
 * inertia layer rather than competing with it. Under reduced motion nothing
 * is scroll-linked: every scene is set once to its composed state
 * (data-still, default 1 for pins and 0.5 for passes).
 */

type Scene = {
  el: HTMLElement;
  pin: boolean;
  steps: number;
  last: number;
};
type Hook = {
  measure(): void;
  frame(p: number): void;
  tick?(dt: number, velocity: number): void;
  still?(): void;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (t: number) => t * t * (3 - 2 * t);
const src = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

/* ── stream ───────────────────────────────────────────────────────────── */

const DRIFT = 0.03; // viewport widths per second at a column speed of 1
const REST = 0.22; // the stream never stops: this much keeps moving inside the letters

function streamHook(scene: HTMLElement): Hook {
  const cols = Array.from(scene.querySelectorAll<HTMLElement>("[data-col]"));
  const speeds = cols.map((c) => Number(c.dataset.speed ?? 0));
  let cycles = cols.map(() => 1);
  let offsets = cols.map((_, i) => i * 997);
  let rate = 1;
  let push = 0;

  const place = () => {
    cols.forEach((col, i) => {
      const c = cycles[i];
      col.style.setProperty("--off", (-(((offsets[i] % c) + c) % c)).toFixed(1));
    });
  };

  return {
    measure() {
      // Each column holds its tiles twice; one loop is half its height.
      cycles = cols.map((c) => Math.max(1, c.scrollHeight / 2));
      place();
    },
    frame(p) {
      rate = 1 - (1 - REST) * smooth(clamp01((p - 0.06) / 0.4));
    },
    tick(dt, velocity) {
      const r = scene.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) return;
      // Scrolling pushes the stream; the push decays over about half a second.
      push = push * Math.exp(-dt * 4) + Math.min(6, Math.abs(velocity) / 400) * (1 - Math.exp(-dt * 4));
      const px = DRIFT * window.innerWidth * dt * rate * (1 + push * 3);
      offsets = offsets.map((o, i) => o + speeds[i] * px);
      place();
    },
    still() {
      cycles = cols.map((c) => Math.max(1, c.scrollHeight / 2));
      place();
    },
  };
}

/* ── track ────────────────────────────────────────────────────────────── */

const TRAVEL = 0.9;

function trackHook(scene: HTMLElement): Hook {
  const track = scene.querySelector<HTMLElement>("[data-track]");
  const lenses = Array.from(scene.querySelectorAll<HTMLElement>("[data-lens]"));
  const last = scene.querySelector<HTMLElement>("[data-last]");
  const reels = lenses.map((l) => ({
    img: l.querySelector("img"),
    frames: (l.dataset.frames ?? "").split(",").filter(Boolean),
    shown: -1,
  }));
  let travel = 0;
  let centres: number[] = [];
  let preloaded = false;

  return {
    measure() {
      if (!track || !last) return;
      const vw = window.innerWidth;
      travel = Math.max(0, last.offsetLeft + last.offsetWidth / 2 - vw / 2);
      centres = lenses.map((l) => l.offsetLeft + l.offsetWidth / 2);
      scene.style.height = `${Math.round(travel / TRAVEL + window.innerHeight)}px`;
    },
    frame(p) {
      if (!track) return;
      if (!preloaded && p > 0) {
        preloaded = true;
        reels.forEach((r) => r.frames.forEach((id) => (new Image().src = src(id, 700))));
      }
      const vw = window.innerWidth;
      const tx = Math.min(1, p / TRAVEL) * travel;
      track.style.setProperty("--tx", tx.toFixed(1));
      lenses.forEach((lens, i) => {
        const signed = (centres[i] - tx - vw / 2) / vw;
        const d = Math.abs(signed);
        lens.style.setProperty("--near", (1 + 0.45 * Math.max(0, 1 - d / 0.3)).toFixed(3));
        // A few frames of the sitting, advanced as the photograph crosses the frame.
        const reel = reels[i];
        if (reel.img && reel.frames.length > 1) {
          const k = Math.min(
            reel.frames.length - 1,
            Math.floor(clamp01(0.5 - signed / 0.8) * reel.frames.length),
          );
          if (k !== reel.shown) {
            reel.shown = k;
            reel.img.src = src(reel.frames[k], lens.classList.contains("ab-rebus--wide") ? 1200 : 700);
          }
        }
      });
    },
  };
}

/* ── engine ───────────────────────────────────────────────────────────── */

export function mountAboutMotion(root: HTMLElement): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scenes: Scene[] = Array.from(
    root.querySelectorAll<HTMLElement>("[data-scene]"),
  ).map((el) => ({
    el,
    pin: el.dataset.scene === "pin",
    steps: Number(el.dataset.steps ?? 0),
    last: -1,
  }));

  const hooks = new Map<HTMLElement, Hook>();
  for (const s of scenes) {
    if (s.el.dataset.hook === "stream") hooks.set(s.el, streamHook(s.el));
    if (s.el.dataset.hook === "track") hooks.set(s.el, trackHook(s.el));
  }

  const apply = (scene: Scene, p: number) => {
    if (Math.abs(p - scene.last) < 0.0002) return;
    scene.last = p;
    const el = scene.el;
    el.style.setProperty("--p", p.toFixed(4));
    if (scene.steps > 0) {
      const raw = p * scene.steps;
      const step = Math.min(scene.steps - 1, Math.floor(raw));
      const sp = clamp01(raw - step);
      if (el.dataset.step !== String(step)) el.dataset.step = String(step);
      el.style.setProperty("--sp", sp.toFixed(4));
      const phase = sp < 0.5 ? "tempt" : "real";
      if (el.dataset.phase !== phase) el.dataset.phase = phase;
    }
    hooks.get(el)?.frame(p);
  };

  if (reduce) {
    root.classList.add("is-still");
    for (const s of scenes) {
      s.el.style.removeProperty("height");
      const still = Number(s.el.dataset.still ?? (s.pin ? 1 : 0.5));
      s.el.style.setProperty("--p", String(still));
      delete s.el.dataset.step;
      s.el.dataset.phase = "real";
      hooks.get(s.el)?.still?.();
    }
    return () => root.classList.remove("is-still");
  }

  root.classList.add("is-moving");

  let vh = window.innerHeight;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let frame = 0;
  let dirty = true;

  const progress = (s: Scene) => {
    const r = s.el.getBoundingClientRect();
    return s.pin
      ? clamp01(-r.top / Math.max(1, r.height - vh))
      : clamp01((vh - r.top) / (vh + r.height));
  };

  const measureAll = () => {
    vh = window.innerHeight;
    hooks.forEach((h) => h.measure());
    for (const s of scenes) {
      s.last = -1;
      apply(s, progress(s));
    }
  };

  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - lastT) / 1000);
    lastT = now;
    const y = window.scrollY;
    const velocity = dt > 0 ? (y - lastY) / dt : 0;
    if (y !== lastY || dirty) {
      lastY = y;
      dirty = false;
      for (const s of scenes) {
        const r = s.el.getBoundingClientRect();
        if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue;
        apply(s, progress(s));
      }
    }
    hooks.forEach((h) => h.tick?.(dt, velocity));
    frame = requestAnimationFrame(tick);
  };

  const onResize = () => {
    measureAll();
    dirty = true;
  };

  window.addEventListener("resize", onResize);
  document.fonts?.ready.then(onResize).catch(() => {});
  measureAll();
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", onResize);
    root.classList.remove("is-moving");
  };
}
