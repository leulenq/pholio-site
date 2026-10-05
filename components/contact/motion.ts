/**
 * The /contact page's behaviour. The topic switch itself is CSS; this adds:
 *
 *   mailto    each letter's "Write this email" opens the mail app with the
 *             letter's address, subject and body already in it, the
 *             [bracketed] parts left for the writer to fill in.
 *   copy      [data-copy] copies an address.
 *   pick      [data-pick] links choose a topic (the scam check's "Report it").
 *   bring     on a phone the desk sits under the list, so choosing a topic
 *             brings the letter into view.
 *   in        [data-in] elements arrive once as they enter, then hold.
 */

export function mountContactMotion(root: HTMLElement): () => void {
  const off: Array<() => void> = [];
  const on = <T extends EventTarget>(el: T, type: string, fn: EventListener) => {
    el.addEventListener(type, fn);
    off.push(() => el.removeEventListener(type, fn));
  };
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.toggle("is-still", still);

  /* ── mailto ─────────────────────────────────────────────────────────── */

  root.querySelectorAll<HTMLElement>(".ct-letter[data-to]").forEach((letter) => {
    const send = letter.querySelector<HTMLAnchorElement>("[data-send]");
    const body = letter.querySelector<HTMLElement>("[data-body]");
    if (!send || !body) return;
    const text = Array.from(body.querySelectorAll("p"))
      .map((p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "")
      .join("\n\n");
    const subject = letter.dataset.subject ?? "";
    send.href =
      `mailto:${letter.dataset.to}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(text)}`;
  });

  /* ── copy ───────────────────────────────────────────────────────────── */

  root.querySelectorAll<HTMLButtonElement>("button[data-copy]").forEach((b) => {
    const label = b.textContent ?? "";
    let timer = 0;
    on(b, "click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy ?? "");
        b.textContent = "Copied";
      } catch {
        b.textContent = b.dataset.copy ?? label;
      }
      b.classList.add("is-copied");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        b.textContent = label;
        b.classList.remove("is-copied");
      }, 1600);
    });
    off.push(() => window.clearTimeout(timer));
  });

  /* ── bring + pick ───────────────────────────────────────────────────── */

  const table = root.querySelector<HTMLElement>("[data-table]");
  const narrow = window.matchMedia("(max-width: 899px)");
  const bring = () => {
    if (!table) return;
    if (narrow.matches) {
      table.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    }
  };
  root.querySelectorAll<HTMLInputElement>('input[name="topic"]').forEach((input) => {
    on(input, "change", bring);
  });
  root.querySelectorAll<HTMLAnchorElement>("[data-pick]").forEach((a) => {
    on(a, "click", (e) => {
      const input = root.querySelector<HTMLInputElement>(`#t-${a.dataset.pick}`);
      if (!input) return;
      e.preventDefault();
      input.checked = true;
      const target = narrow.matches ? table : root;
      target?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      input.focus({ preventScroll: true });
    });
  });

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
      { rootMargin: "0px 0px -10% 0px" },
    );
    arrivals.forEach((el) => io.observe(el));
    off.push(() => io.disconnect());
  }

  return () => off.forEach((fn) => fn());
}
