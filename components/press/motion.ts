/**
 * The /press page's motion and the kit's few controls.
 *
 *   table     the hero is a pinned stage. Its scroll progress (--p) fades the
 *             copy, and lifts the release sheet off the table: it straightens
 *             and grows until its paper covers the screen, which is the
 *             paper the rest of the page is read on. The sheets beneath it
 *             fall away. Reads the real document scroll, so it moves with
 *             the site's inertia layer.
 *   index     the margin contents mark the section being read.
 *   in        [data-in] elements arrive once as they enter, then hold.
 *   tabs      the boilerplate's three lengths, a copy button and a count.
 *   swatches  [data-copy] copies its value.
 *
 * Under reduced motion nothing is scroll-linked: the stage is not pinned and
 * the sheet lies where it is (.is-still).
 */

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const smooth = (t: number) => t * t * (3 - 2 * t);

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function mountPressMotion(root: HTMLElement): () => void {
  const off: Array<() => void> = [];
  const listen = <K extends keyof WindowEventMap>(
    target: Window,
    type: K,
    fn: (e: WindowEventMap[K]) => void,
  ) => {
    target.addEventListener(type, fn, { passive: true });
    off.push(() => target.removeEventListener(type, fn));
  };

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.toggle("is-still", still);
  const ready = requestAnimationFrame(() => root.classList.add("is-ready"));
  off.push(() => cancelAnimationFrame(ready));

  /* ── table ──────────────────────────────────────────────────────────── */

  const hero = root.querySelector<HTMLElement>("[data-hero]");
  const stage = root.querySelector<HTMLElement>("[data-stage]");
  const sheet = root.querySelector<HTMLElement>("[data-sheet]");
  const ink = root.querySelector<HTMLElement>("[data-sheet-ink]");
  const unders = Array.from(root.querySelectorAll<HTMLElement>("[data-under]"));

  if (!still && hero && stage && sheet && ink) {
    let dx = 0;
    let dy = 0;
    let grow = 1;
    let start = 0;
    let span = 1;
    let raf = 0;
    let last = -1;

    const measure = () => {
      const prev = sheet.style.transform;
      sheet.style.transform = "none";
      const s = stage.getBoundingClientRect();
      const r = sheet.getBoundingClientRect();
      sheet.style.transform = prev;
      dx = s.left + s.width / 2 - (r.left + r.width / 2);
      dy = s.top + s.height / 2 - (r.top + r.height / 2);
      grow = Math.max(s.width / r.width, s.height / r.height) * 1.04;
      start = hero.offsetTop;
      span = Math.max(1, hero.offsetHeight - window.innerHeight);
      last = -1;
    };

    const frame = () => {
      raf = 0;
      const p = clamp01((window.scrollY - start) / span);
      if (p === last) return;
      last = p;
      hero.style.setProperty("--p", p.toFixed(4));

      // The sheet rests for the first stretch, lifts, then fills the frame.
      const t = ease(clamp01((p - 0.06) / 0.62));
      const g = 1 + (grow - 1) * smooth(clamp01((p - 0.1) / 0.58));
      sheet.style.transform = `translate(${dx * t}px, ${dy * t}px) rotate(${-2.5 * (1 - t)}deg) scale(${g})`;
      sheet.style.boxShadow =
        t >= 1 ? "none" : `0 2px 3px rgba(0,0,0,${0.25 * (1 - t)}), 0 40px 90px rgba(0,0,0,${0.55 * (1 - t)})`;
      ink.style.opacity = String(1 - clamp01((p - 0.08) / 0.24));

      unders.forEach((u, i) => {
        const k = clamp01((p - 0.04) / 0.4);
        const dir = i === 0 ? -1 : 1;
        u.style.transform = `translate(${dir * k * 18}vw, ${k * 60}vh) rotate(${(i === 0 ? -7 : 3) + dir * k * 14}deg)`;
        u.style.opacity = String(1 - k);
      });
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    measure();
    frame();
    listen(window, "scroll", request);
    listen(window, "resize", () => {
      measure();
      request();
    });
    off.push(() => cancelAnimationFrame(raf));
    // Fonts and the header settle after the first paint.
    const late = window.setTimeout(() => {
      measure();
      request();
    }, 600);
    off.push(() => window.clearTimeout(late));
  }

  /* ── in ─────────────────────────────────────────────────────────────── */

  const arrivals = Array.from(root.querySelectorAll<HTMLElement>("[data-in]"));
  if (still || !("IntersectionObserver" in window)) {
    arrivals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    arrivals.forEach((el) => io.observe(el));
    off.push(() => io.disconnect());
  }

  /* ── index ──────────────────────────────────────────────────────────── */

  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-index-link]"));
  const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-section]"));
  if (links.length && sections.length) {
    const mark = () => {
      const line = window.innerHeight * 0.35;
      let current = "";
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s.id;
      }
      for (const a of links) {
        a.classList.toggle("is-on", a.getAttribute("href") === `#${current}`);
      }
    };
    mark();
    listen(window, "scroll", mark);
  }

  /* ── tabs ───────────────────────────────────────────────────────────── */

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-tab]"));
  const panes = Array.from(root.querySelectorAll<HTMLElement>("[data-pane]"));
  const count = root.querySelector<HTMLElement>("[data-count]");
  const copyPane = root.querySelector<HTMLButtonElement>("[data-copy-pane]");
  const copyLabel = root.querySelector<HTMLElement>("[data-copy-label]");

  const activePane = () => panes.find((p) => !p.hidden);
  const paneText = (p: HTMLElement) =>
    Array.from(p.querySelectorAll("p"))
      .map((el) => el.textContent?.trim() ?? "")
      .join("\n\n");
  const showCount = () => {
    const p = activePane();
    if (!p || !count) return;
    const words = paneText(p).split(/\s+/).filter(Boolean).length;
    count.textContent = `${words} words`;
  };
  const select = (key: string, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panes.forEach((p) => (p.hidden = p.dataset.pane !== key));
    if (copyLabel) copyLabel.textContent = "Copy this version";
    showCount();
  };
  tabs.forEach((t, i) => {
    t.tabIndex = t.getAttribute("aria-selected") === "true" ? 0 : -1;
    const onClick = () => select(t.dataset.tab ?? "short");
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      select(next.dataset.tab ?? "short", true);
    };
    t.addEventListener("click", onClick);
    t.addEventListener("keydown", onKey);
    off.push(() => {
      t.removeEventListener("click", onClick);
      t.removeEventListener("keydown", onKey);
    });
  });
  showCount();

  if (copyPane) {
    const onCopy = async () => {
      const p = activePane();
      if (!p) return;
      const ok = await copyText(paneText(p));
      if (copyLabel) copyLabel.textContent = ok ? "Copied" : "Select the text to copy";
    };
    copyPane.addEventListener("click", onCopy);
    off.push(() => copyPane.removeEventListener("click", onCopy));
  }

  /* ── swatches ───────────────────────────────────────────────────────── */

  root.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) => {
    const label = b.querySelector<HTMLElement>(".pr-mono");
    const value = b.dataset.copy ?? "";
    let timer = 0;
    const onClick = async () => {
      if (!(await copyText(value)) || !label) return;
      label.textContent = "Copied";
      b.classList.add("is-copied");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        label.textContent = value;
        b.classList.remove("is-copied");
      }, 1400);
    };
    b.addEventListener("click", onClick);
    off.push(() => {
      b.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    });
  });

  return () => off.forEach((fn) => fn());
}
