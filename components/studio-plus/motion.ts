/**
 * /studio-plus — the motion engine for studio-plus.html.
 *
 * Every pinned scene is a tall section with a sticky stage; each frame this
 * reads the section's scroll progress (0 → 1) off its bounding box and hands
 * it to that scene's render function. Nothing here owns the scroll: the site's
 * inertia layer moves the page, and anchors travel with `scrollPageTo`.
 *
 * `mountStudioPlus(root)` returns a cleanup that stops every loop and listener.
 */

import { scrollPageTo } from "@/components/scroll-inertia";

type Render = (p: number, r: DOMRect) => void;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const E = {
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  out4: (t: number) => 1 - Math.pow(1 - t, 4),
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

/** Unsplash CDN, sized per slot. */
const U = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=max`;

const hex = (h: string) => {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
};
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`;
};

/** The seven Studio+ comp-card themes, in their shipped names. */
const LOOKS = [
  { name: "Classic Dark", font: "'Cormorant Garamond'", d: "Jet black with warm gold accents. Dramatic, and high-fashion.", bg: "#0d0c0b", fg: "#efe8dc" },
  { name: "Studio Clean", font: "'Work Sans'", d: "Pure white with a cobalt accent. Clean, and professional.", bg: "#dfe3e8", fg: "#15171a" },
  { name: "Bold Editorial", font: "'Bodoni Moda'", d: "Neutral off-white with antique gold. Striking, and editorial.", bg: "#e7e0d2", fg: "#1a1712" },
  { name: "Cinematic Dark", font: "'Bebas Neue'", d: "Display type on deep black. Dramatic, cinematic.", bg: "#040404", fg: "#efe8dc" },
  { name: "Bold Vogue", font: "'Bodoni Moda'", d: "Oversized serif typography, high contrast. For the cover.", bg: "#6e1714", fg: "#f4ece0", it: true },
  { name: "Studio Modern", font: "'Space Grotesk'", d: "Modern sans-serif on neutral greys. Contemporary, architectural.", bg: "#c6c4c0", fg: "#141414" },
  { name: "Archive Classic", font: "'Old Standard TT'", d: "Vintage serif in sepia tones. Nostalgic, archival.", bg: "#bfa77c", fg: "#2a1d10" },
];

/** Palettes from the app's comp-card studio (pholio-app pdf/themes.js). */
const PAPERS = [
  ["Warm Cream", "#FAF9F7", "#2D2D2D", "#C9A55A"], ["Ivory", "#FFFEF9", "#1A1A1A", "#8B7355"],
  ["Deep Black", "#000000", "#FFFFFF", "#C9A55A"], ["Charcoal", "#1A1A1A", "#ECF0F1", "#F59E0B"],
  ["Vintage Paper", "#F5E6D3", "#3D2817", "#8B6F47"], ["Dark Slate", "#2C3E50", "#ECF0F1", "#3498DB"],
  ["Ice Blue", "#F0F9FF", "#1E40AF", "#3B82F6"], ["Sepia", "#F4E4BC", "#5D4037", "#8D6E63"],
];
const TYPES = [
  ["Bodoni Moda", "'Bodoni Moda'", "-.035em", "none", "15cqw"],
  ["Cormorant Garamond", "'Cormorant Garamond'", ".22em", "uppercase", "9cqw"],
  ["Bebas Neue", "'Bebas Neue'", ".02em", "uppercase", "21cqw"],
  ["Space Grotesk", "'Space Grotesk'", "-.05em", "none", "15cqw"],
  ["Old Standard TT", "'Old Standard TT'", "-.01em", "none", "15cqw"],
  ["Work Sans", "'Work Sans'", "-.04em", "none", "15cqw"],
];
const FRAMES = [
  "1779153249910-3bb21c91c7fc", "1779675259233-4a3daaebd32b", "1779398555763-2ff65b26f2a8",
  "1779406252886-33e39014ac12", "1779398645920-a3e9901784d6", "1779675397130-370aa243cff3",
];

export function mountStudioPlus(root: HTMLElement): () => void {
  const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = root) => r.querySelector(s) as T;
  const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = root) => [...r.querySelectorAll(s)] as T[];

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
  root.classList.toggle("rm", RM);

  let alive = true;
  const offs: Array<() => void> = [];
  const on = <K extends keyof WindowEventMap>(t: Window, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    offs.push(() => t.removeEventListener(type, fn));
  };
  const loop = (fn: () => void) => {
    const tick = () => { if (!alive) return; fn(); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };

  /* ── images ──────────────────────────────────────────────── */
  $$<HTMLImageElement>("img[data-src]").forEach((img) => {
    const id = img.dataset.src!, w = Number(img.dataset.w) || 800, h = Math.round(w / 2), d = Math.min(w * 2, 2800);
    img.srcset = `${U(id, h)} ${h}w, ${U(id, w)} ${w}w, ${U(id, d)} ${d}w`;
    img.src = U(id, w);
    img.decoding = "async";
    if (!img.closest("#overture")) img.loading = "lazy";
  });

  /* ── anchors travel on the page's own weight ─────────────── */
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    const go = (e: MouseEvent) => {
      const t = document.querySelector<HTMLElement>(a.getAttribute("href")!);
      if (!t) return;
      e.preventDefault();
      let y = t.getBoundingClientRect().top + scrollY;
      if (t.id === "finale") y += innerHeight * 0.2;
      scrollPageTo(y, { reduce: RM });
    };
    a.addEventListener("click", go);
    offs.push(() => a.removeEventListener("click", go));
  });

  /* ── pointer ─────────────────────────────────────────────── */
  const ptr = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 };
  on(window, "pointermove", (e) => {
    ptr.x = e.clientX; ptr.y = e.clientY;
    ptr.nx = (e.clientX / innerWidth) * 2 - 1; ptr.ny = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  /* ── cursor: the film's own, on fine pointers only ────────── */
  if (FINE) {
    const cur = document.createElement("div");
    cur.className = "sp-cursor";
    cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = "<i></i><b>View</b>";
    document.body.appendChild(cur);
    const html = document.documentElement;
    html.classList.add("has-custom-cursor");
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const v = !!t?.closest?.("[data-cursor=view]");
      const h = !!t?.closest?.("a,button,[role=switch]");
      cur.classList.toggle("view", v);
      cur.classList.toggle("hover", h && !v);
    };
    document.addEventListener("pointerover", over);
    let cx = ptr.x, cy = ptr.y;
    loop(() => {
      cx = RM ? ptr.x : lerp(cx, ptr.x, 0.22);
      cy = RM ? ptr.y : lerp(cy, ptr.y, 0.22);
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    });
    offs.push(() => {
      document.removeEventListener("pointerover", over);
      html.classList.remove("has-custom-cursor");
      cur.remove();
    });
  }

  /* ── scene registry ──────────────────────────────────────── */
  const scenes: Array<{ el: HTMLElement; render: Render }> = [];
  const scene = (id: string, render: Render) => { const el = root.querySelector<HTMLElement>(`#${id}`); if (el) scenes.push({ el, render }); };
  const prog = (r: DOMRect) => { const total = r.height - innerHeight; return total > 0 ? clamp(-r.top / total) : r.top <= 0 ? 1 : 0; };

  /* The header stands down while her site owns the frame: its takeover hook
     reads the first [data-footer-trigger] in the document, so this marker
     carries the attribute only while it is pinned to the top of the view.
     The rest of the time it has none, the footer's own marker answers, and
     the header stays up over the footer (lessons.md §46.6). */
  const trigger = document.querySelector<HTMLElement>(".sp-trigger");
  const hush = (v: boolean) => {
    if (!trigger) return;
    trigger.classList.toggle("hush", v);
    trigger.toggleAttribute("data-footer-trigger", v);
  };

  /* ═══ OVERTURE ═══════════════════════════════════════════ */
  {
    const photo = $("#ovPhoto"), cross = $("#ovCross"), H = $("#ovH"), V = $("#ovV"), pre = $("#ovPre"),
      qs = $$("#overture .ov-q"), letters = $$("#ovTitle .m > span"), plus = $("#ovPlus"), sub = $("#ovSub"), hint = $("#ovHint");
    const dirs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    scene("overture", (p) => {
      cross.classList.toggle("idle", p < 0.004);
      pre.style.opacity = String(1 - seg(p, 0, 0.07));
      hint.style.opacity = String(1 - seg(p, 0, 0.04));
      const c = E.inOut(seg(p, 0.02, 0.26));
      H.style.transform = `translate(-50%,-50%) scaleX(${lerp(36 / innerWidth, 1, c)})`;
      V.style.transform = `translate(-50%,-50%) scaleY(${lerp(36 / innerHeight, 1, c)})`;
      const o = E.inOut(seg(p, 0.24, 0.6));
      qs.forEach((q, i) => (q.style.transform = `translate(${dirs[i][0] * o * 101}%,${dirs[i][1] * o * 101}%)`));
      H.style.opacity = V.style.opacity = String(1 - seg(p, 0.42, 0.66) * 0.88);
      photo.style.transform = `scale(${lerp(1.38, 1.04, E.out(seg(p, 0.22, 0.95)))})`;
      photo.style.filter = `brightness(${lerp(0.55, 1, seg(p, 0.3, 0.7))})`;
      letters.forEach((l, i) => {
        const t = E.out4(seg(p, 0.5 + i * 0.028, 0.7 + i * 0.028));
        l.style.transform = `translateY(${(1 - t) * 160}%)`;
      });
      const pt = E.out4(seg(p, 0.7, 0.86));
      plus.style.transform = `scale(${pt}) rotate(${(1 - pt) * -180}deg)`;
      const s = seg(p, 0.74, 0.9);
      sub.style.opacity = String(s);
      sub.style.transform = `translateY(${(1 - E.out(s)) * 20}px)`;
    });
  }

  /* ═══ PROLOGUE: the sentence lights word by word ═════════ */
  {
    const box = $("#words");
    if (!box.dataset.split) {
      box.dataset.split = "1";
      const frag = document.createDocumentFragment();
      box.childNodes.forEach((node) => {
        const it = node.nodeName === "I", g = node.nodeName === "G";
        (node.textContent || "").split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          const s = document.createElement("span");
          s.className = "w" + (it ? " it" : "") + (g ? " it g" : "");
          s.textContent = tok;
          frag.appendChild(s);
        });
      });
      box.innerHTML = "";
      box.appendChild(frag);
    }
    const ws = $$(".w", box);
    scenes.push({
      el: box,
      render: (_, r) => {
        const n = clamp((innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.25)) * ws.length * 1.05;
        ws.forEach((w, i) => (w.style.opacity = String(lerp(0.14, 1, clamp(n - i)))));
      },
    });
  }

  /* ── programme: the act's picture follows the hand ──────── */
  if (FINE) {
    const fl = $("#pgFloat"), imgs = $$("img", fl);
    let fx = ptr.x, fy = ptr.y, over = false;
    $$<HTMLAnchorElement>(".pg-list a").forEach((a) => {
      const enter = () => { over = true; fl.classList.add("on"); imgs.forEach((im, i) => im.classList.toggle("on", String(i) === a.dataset.float)); };
      const leave = () => { over = false; fl.classList.remove("on"); };
      a.addEventListener("pointerenter", enter);
      a.addEventListener("pointerleave", leave);
      offs.push(() => { a.removeEventListener("pointerenter", enter); a.removeEventListener("pointerleave", leave); });
    });
    loop(() => {
      fx = lerp(fx, ptr.x, 0.12); fy = lerp(fy, ptr.y, 0.12);
      fl.style.transform = `translate(${fx + 36}px,${fy - fl.offsetHeight / 2}px) rotate(${clamp((ptr.x - fx) * 0.04, -8, 8)}deg) scale(${over ? 1 : 0.85})`;
    });
  }

  /* ═══ I · THE CARD ═══════════════════════════════════════ */
  {
    const stage = $("#cdStage"), hold = $("#cdHold"), layers = $$("#cc .cl"), scan = $("#ccScan"), sheen = $("#ccSheen"),
      shadow = $("#cdShadow"), numBox = $("#cdNum"), names = $("#cdNames"), descs = $("#cdDescs"), list = $("#cdList");
    names.innerHTML = descs.innerHTML = list.innerHTML = numBox.innerHTML = "";
    LOOKS.forEach((l, i) => {
      const h = document.createElement("h3");
      h.textContent = l.name; h.style.fontFamily = l.font;
      if (l.it) h.style.fontStyle = "italic";
      if (l.name === "Cinematic Dark") h.style.letterSpacing = ".02em";
      names.appendChild(h);
      const p = document.createElement("p"); p.textContent = l.d; descs.appendChild(p);
      const li = document.createElement("li"); li.textContent = l.name; list.appendChild(li);
      const n = document.createElement("span"); n.textContent = String(i + 1).padStart(2, "0"); numBox.appendChild(n);
    });
    const free = document.createElement("li");
    free.className = "free"; free.innerHTML = "Pholio Standard and three<br>more themes stay free";
    list.appendChild(free);
    const hs = $$("h3", names), ps = $$("p", descs), lis = $$("li:not(.free)", list), ns = $$("span", numBox);
    let active = -1, tx = 0, ty = 0;
    const setActive = (a: number) => {
      if (a === active) return;
      active = a;
      hs.forEach((h, i) => { h.classList.toggle("on", i === a); h.classList.toggle("past", i < a); });
      ps.forEach((p, i) => p.classList.toggle("on", i === a));
      lis.forEach((l, i) => l.classList.toggle("on", i === a));
      ns.forEach((n, i) => (n.style.transform = `translateY(${(i - a) * 100}%)`));
    };
    const N = LOOKS.length;
    scene("card", (p) => {
      const intro = E.out4(seg(p, 0, 0.07));
      const f = seg(p, 0.06, 0.97) * N;
      let a = 0, bg = LOOKS[0].bg, fg = LOOKS[0].fg, scanning = -1;
      for (let i = 1; i < N; i++) {
        // each theme is re-printed from the foot of the card up
        const raw = seg(f, i - 0.55, i - 0.02), e = E.inOut(raw);
        layers[i].style.clipPath = e >= 1 ? "none" : `inset(${(1 - e) * 100}% 0 0 0)`;
        if (raw > 0 && raw < 1) { scanning = 1 - e; bg = mix(LOOKS[i - 1].bg, LOOKS[i].bg, e); fg = mix(LOOKS[i - 1].fg, LOOKS[i].fg, e); }
        else if (raw >= 1) { bg = LOOKS[i].bg; fg = LOOKS[i].fg; }
        if (raw >= 0.5) a = i;
      }
      stage.style.setProperty("--bg", bg);
      stage.style.setProperty("--fg", fg);
      if (scanning >= 0) { scan.style.opacity = "1"; scan.style.top = `${scanning * 100}%`; } else scan.style.opacity = "0";
      setActive(a);
      tx = lerp(tx, ptr.nx, 0.08); ty = lerp(ty, ptr.ny, 0.08);
      const sway = Math.sin(f * Math.PI) * 5;
      hold.style.transform = `translate3d(0,${(1 - intro) * 60}vh,0) rotateX(${(1 - intro) * 28 + ty * -5}deg) rotateY(${sway + tx * 9}deg) rotateZ(${(1 - intro) * -6}deg)`;
      shadow.style.opacity = String(intro * 0.9);
      sheen.style.setProperty("--sx", `${50 + tx * 40}%`);
      sheen.style.setProperty("--sy", `${30 + ty * 30}%`);
    });
  }

  /* ── the fitting ─────────────────────────────────────────── */
  {
    const fc = $("#fc"), name = $("#fcName"), ph = $("#fcPh"), sheen = $("#fcSheen");
    const oP = $("#optPaper"), oT = $("#optType"), oF = $("#optFrame");
    const st = { p: 0, t: 0, f: 0 };
    const timers: number[] = [];
    offs.push(() => timers.forEach(clearTimeout));
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const mark = (box: HTMLElement, i: number) => [...box.children].forEach((c, j) => c.classList.toggle("on", i === j));
    const setPaper = (i: number) => {
      st.p = i; const p = PAPERS[i];
      fc.style.setProperty("--pb", p[1]); fc.style.setProperty("--pt", p[2]); fc.style.setProperty("--pa", p[3]);
      $("#lblPaper").textContent = p[0]; mark(oP, i);
    };
    const setType = (i: number) => {
      st.t = i; const t = TYPES[i];
      $("#lblType").textContent = t[0]; mark(oT, i);
      name.classList.add("swap");
      later(() => {
        fc.style.setProperty("--pf", t[1]); fc.style.setProperty("--ls", t[2]); fc.style.setProperty("--tt", t[3]);
        name.style.fontSize = t[4];
        name.classList.remove("swap");
      }, 260);
    };
    const setFrame = (i: number) => {
      mark(oF, i);
      if (i === st.f) return;
      st.f = i; $("#lblFrame").textContent = String(i + 1).padStart(2, "0");
      const old = [...ph.children] as HTMLElement[];
      const im = new Image(); im.alt = "Selected frame"; im.className = "out"; im.src = U(FRAMES[i], 900);
      ph.appendChild(im);
      const go = () => requestAnimationFrame(() => {
        im.classList.remove("out");
        old.forEach((o) => { o.classList.add("out"); later(() => o.remove(), 900); });
      });
      im.decode().then(go, go);
    };
    oP.innerHTML = oT.innerHTML = oF.innerHTML = "";
    PAPERS.forEach((p, i) => { const b = document.createElement("button"); b.className = "opt"; b.innerHTML = `<span class="sw" style="background:${p[1]}"></span>${p[0]}`; b.onclick = () => setPaper(i); oP.appendChild(b); });
    TYPES.forEach((t, i) => { const b = document.createElement("button"); b.className = "opt"; b.textContent = t[0]; b.style.fontFamily = t[1]; b.onclick = () => setType(i); oT.appendChild(b); });
    FRAMES.forEach((id, i) => { const b = document.createElement("button"); b.setAttribute("aria-label", `Frame ${i + 1}`); b.innerHTML = `<img alt="" src="${U(id, 160)}" loading="lazy">`; b.onclick = () => setFrame(i); oF.appendChild(b); });
    setPaper(0); setType(0); mark(oF, 0);
    $("#shuffle").onclick = () => {
      let i = 0;
      const run = () => {
        setPaper(Math.floor(Math.random() * PAPERS.length));
        if (i % 2 === 0) setType(Math.floor(Math.random() * TYPES.length));
        if (++i < 6) later(run, 170);
        else setFrame((st.f + 1 + Math.floor(Math.random() * (FRAMES.length - 1))) % FRAMES.length);
      };
      run();
    };
    let rx = 0, ry = 0, tRx = 0, tRy = 0;
    const host = fc.parentElement!;
    const move = (e: PointerEvent) => {
      const r = fc.getBoundingClientRect();
      tRy = ((e.clientX - r.left) / r.width - 0.5) * 18;
      tRx = -((e.clientY - r.top) / r.height - 0.5) * 14;
      sheen.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
      sheen.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const leave = () => { tRx = tRy = 0; };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    offs.push(() => { host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); });
    if (!RM) loop(() => { rx = lerp(rx, tRx, 0.08); ry = lerp(ry, tRy, 0.08); fc.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; });
  }

  /* ═══ II · THE SITE ══════════════════════════════════════ */
  {
    const reel = $("#reel"), typed = $("#typed"), tx = $("#typedTx"), head = $("#stHead"), cap = $("#stCap"),
      backs = $$("#mastBack i"), fig = $("#mastFig"), front = $("#mastFront"), nav = $("#znNav"), foot = $("#znFoot");
    const NAME = "zofia-nowicka";
    scene("site", (p) => {
      const W = reel.clientWidth, Hh = reel.clientHeight, G = W * 0.1;
      // a. the name is typed
      const n = Math.round(seg(p, 0.03, 0.19) * NAME.length);
      if (tx.textContent!.length !== n) tx.textContent = NAME.slice(0, n);
      const tOut = seg(p, 0.2, 0.25);
      typed.style.opacity = String(1 - tOut);
      typed.style.filter = `blur(${tOut * 10}px)`;
      typed.style.transform = `translate(-50%,-50%) scale(${1 + tOut * 0.3})`;
      head.style.opacity = String(1 - seg(p, 0.17, 0.23));
      // b. and becomes her masthead
      backs.forEach((b, i) => { const t = E.out4(seg(p, 0.22 + i * 0.018, 0.32 + i * 0.018)); b.style.transform = `translateY(${(1 - t) * 160}%)`; });
      const ft = E.out4(seg(p, 0.26, 0.38));
      fig.style.opacity = String(seg(p, 0.26, 0.3));
      fig.style.transform = `translateY(${(1 - ft) * 40}%)`;
      const fr = E.out4(seg(p, 0.31, 0.4));
      front.style.opacity = String(fr);
      front.style.transform = `translateX(${(1 - fr) * 30}%)`;
      nav.style.opacity = foot.style.opacity = String(seg(p, 0.36, 0.41));
      // c. the camera pulls back and walks her site
      const s = lerp(1, W < 760 ? 0.64 : 0.4, E.inOut(seg(p, 0.44, 0.57)));
      const raw = seg(p, 0.58, 0.9) * 4, k = Math.min(3, Math.floor(raw));
      const f = raw >= 4 ? 4 : k + E.inOut(clamp((raw - k) * 1.35 - 0.12));
      const fx = f * (W + G) + W / 2, fy = Hh / 2;
      reel.style.transform = `translate3d(${W / 2 - fx * s}px,${Hh / 2 - fy * s - (1 - s) * Hh * 0.04}px,0) scale(${s})`;
      reel.style.setProperty("--s", String(s));
      reel.classList.toggle("floating", s < 0.985);
      hush(p > 0.2 && p < 0.47);
      const c = E.out(seg(p, 0.9, 0.97));
      cap.style.opacity = String(c);
      cap.style.transform = `translateY(${(1 - c) * 20}px)`;
    });
  }

  /* ═══ III · THE RECORD ═══════════════════════════════════ */
  {
    const DAYS = 90, start = new Date(2026, 6, 1);
    // an illustrative record, seeded so every visit draws the same ninety days
    let seed = 20260701;
    const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const EVENTS = [
      { d: 5, img: "1779400203231-102e4e62a5f3", l: "Digitals" }, { d: 16, img: "1779153249718-d713742e2600", l: "Leopard" },
      { d: 29, img: "1779398645852-b7a98f0cb7c3", l: "Corridor" }, { d: 43, img: "1779763320618-508808d8d5e3", l: "Gold" },
      { d: 58, img: "1779406338045-59b7b488f4c8", l: "Leather" }, { d: 71, img: "1779399147755-cb3c1a62c3de", l: "Feather" },
      { d: 84, img: "1779398970521-5c3cfd9dc381", l: "Turtleneck" },
    ];
    type Day = { d: number; date: Date; visits: number; opens: number; pulls: number };
    type Key = "visits" | "opens" | "pulls";
    const data: Day[] = [];
    for (let d = 0; d < DAYS; d++) {
      let burst = 0;
      EVENTS.forEach((ev) => { const k = d - ev.d; if (k >= 0 && k < 5) burst += [1, 0.55, 0.3, 0.15, 0.06][k]; });
      const wk = (d + 3) % 7 < 5 ? 1 : 0.55;
      data.push({
        d, date: new Date(start.getTime() + d * 864e5),
        visits: Math.max(0, Math.round((2.2 + Math.sin(d / 8) * 1.3 + rnd() * 3) * wk + burst * 9)),
        opens: Math.max(0, Math.round(rnd() * 2 * wk + burst * 5)),
        pulls: Math.max(0, Math.round(rnd() * 1.1 * wk + burst * 3.2 - 0.3)),
      });
    }
    const maxV = Math.max(...data.map((x) => x.visits));
    const X = (d: number) => (d / (DAYS - 1)) * 1000, Y = (v: number) => 292 - (v / maxV) * 262;
    const path = (key: Key) => {
      const pts = data.map((x) => [X(x.d), Y(x[key])]);
      let s = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, Math.min(292, p1[1] + (p2[1] - p0[1]) / 6)];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, Math.min(292, p2[1] - (p3[1] - p1[1]) / 6)];
        s += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      return s;
    };
    root.querySelector("#rcVisits")!.setAttribute("d", path("visits"));
    root.querySelector("#rcOpens")!.setAttribute("d", path("opens"));
    root.querySelector("#rcPulls")!.setAttribute("d", path("pulls"));
    root.querySelector("#rcArea")!.setAttribute("d", path("visits") + " L1000,296 L0,296 Z");
    const fmt = (dt: Date, o: Intl.DateTimeFormatOptions) => dt.toLocaleDateString("en-GB", o);
    const axis = $("#rcAxis"), shots = $("#rcShots");
    axis.innerHTML = shots.innerHTML = "";
    for (let d = 0; d < DAYS; d++) { const i = document.createElement("i"); i.style.left = `${(d / (DAYS - 1)) * 100}%`; if (d % 7 === 0) i.className = "w"; axis.appendChild(i); }
    [0, 30, 61, 89].forEach((d) => { const s = document.createElement("span"); s.className = "mono"; s.style.left = `${(d / (DAYS - 1)) * 100}%`; s.textContent = fmt(data[d].date, { day: "numeric", month: "short" }); axis.appendChild(s); });
    const shotEls = EVENTS.map((ev) => {
      const el = document.createElement("div");
      el.className = "rc-shot";
      el.style.left = `${X(ev.d) / 10}%`;
      el.style.top = `${Y(data[ev.d].visits) / 3}%`;
      el.innerHTML = `<span>${ev.l} · opened</span><img alt="" src="${U(ev.img, 200)}" loading="lazy">`;
      shots.appendChild(el);
      return el;
    });
    const clip = root.querySelector("#rcClipR")!, win = $("#rcWin"), pen = $("#rcPen"), nEl = $("#rcN"), dEl = $("#rcD"), lab = $("#rcLab"), end = $("#rcEnd"), plot = $("#rcPlot");
    let drawnDay = 0, lastDay = -1;
    const valAt = (key: Key, day: number) => { const i = Math.floor(day); return lerp(data[Math.min(i, DAYS - 1)][key], data[Math.min(i + 1, DAYS - 1)][key], day - i); };
    scene("record", (p) => {
      // a week, a pause on what free keeps, then the season
      const day = p < 0.3 ? seg(p, 0.06, 0.24) * 7 : 7 + E.inOut(seg(p, 0.32, 0.86)) * (DAYS - 1 - 7);
      drawnDay = day;
      clip.setAttribute("width", String(X(day) + 10));
      const wEnd = Math.max(7, day);
      win.style.width = `${X(Math.min(wEnd, DAYS - 1)) / 10}%`;
      win.style.opacity = String(seg(p, 0.04, 0.1));
      win.classList.toggle("narrow", wEnd < 30);
      lab.textContent = p < 0.31 ? "Free keeps a week" : "Studio+ keeps the season";
      pen.style.left = `${X(day) / 10}%`;
      pen.style.top = `${Y(valAt("pulls", day)) / 3}%`;
      pen.style.opacity = day > 0.05 && p < 0.9 ? "1" : "0";
      const di = Math.min(DAYS - 1, Math.round(day));
      if (di !== lastDay) {
        lastDay = di;
        nEl.innerHTML = `<small>Day</small>${String(di + 1).padStart(2, "0")}`;
        dEl.textContent = fmt(data[di].date, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      }
      shotEls.forEach((el, i) => el.classList.toggle("on", day >= EVENTS[i].d - 0.2));
      end.classList.toggle("on", p > 0.88);
    });
    const scrub = $("#rcScrub"), read = $("#rcRead");
    const move = (e: PointerEvent) => {
      const r = plot.getBoundingClientRect(), x = clamp((e.clientX - r.left) / r.width), d = Math.round(x * (DAYS - 1));
      if (d > drawnDay + 0.5) { plot.classList.remove("live"); return; }
      plot.classList.add("live");
      const row = data[d];
      scrub.style.left = read.style.left = `${X(d) / 10}%`;
      read.style.transform = x > 0.72 ? "translate(calc(-100% - 12px),-100%)" : "translate(12px,-100%)";
      read.innerHTML = `<b>${fmt(row.date, { weekday: "long", day: "numeric", month: "long" })}</b>Card pulls ${row.pulls} · Link opens ${row.opens}<br>Page visits ${row.visits}`;
    };
    const leave = () => plot.classList.remove("live");
    plot.addEventListener("pointermove", move);
    plot.addEventListener("pointerleave", leave);
    offs.push(() => { plot.removeEventListener("pointermove", move); plot.removeEventListener("pointerleave", leave); });
    $("#rcCsv").onclick = () => {
      const rows = [["date", "page_visits", "link_opens", "card_pulls"], ...data.map((r) => [r.date.toISOString().slice(0, 10), r.visits, r.opens, r.pulls])];
      const blob = new Blob(["# Illustrative sample record, Studio+ demo\n" + rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pholio-record-sample-90d.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
  }

  /* ═══ IV · THE RULE ══════════════════════════════════════ */
  {
    const sw = $("#ruSwitch"), labs = $$(".lab", sw), scan = $("#ruScan"), diff = $("#ruDiff"), stamp = $("#ruStamp"),
      count = $("#ruCount"), nots = $$("#ruNots li"), fin = $("#ruFinal");
    let studio = false, flips = 0, lastZone = -1, diffT = 0, diffT2 = 0;
    offs.push(() => { clearTimeout(diffT); clearTimeout(diffT2); });
    const setState = (v: boolean, fromUser = false) => {
      if (v === studio && !fromUser) return;
      studio = v;
      sw.classList.toggle("studio", v);
      sw.setAttribute("aria-checked", String(v));
      labs[0].classList.toggle("on", !v); labs[1].classList.toggle("on", v);
      // the agency's copy is scanned on every flip, and nothing on it moves
      scan.classList.remove("go"); void scan.offsetWidth; scan.classList.add("go");
      count.textContent = `Identical ×${++flips}`;
      clearTimeout(diffT); clearTimeout(diffT2); diff.classList.remove("on");
      diffT = window.setTimeout(() => { diff.classList.add("on"); diffT2 = window.setTimeout(() => diff.classList.remove("on"), 1600); }, 900);
    };
    const click = () => setState(!studio, true);
    const key = (e: KeyboardEvent) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setState(!studio, true); } };
    sw.addEventListener("click", click);
    sw.addEventListener("keydown", key);
    offs.push(() => { sw.removeEventListener("click", click); sw.removeEventListener("keydown", key); });
    const TH = [0.14, 0.32, 0.5, 0.66];
    scene("rule", (p) => {
      const zone = TH.filter((t) => p >= t).length;
      if (zone !== lastZone) { if (lastZone !== -1) setState(zone % 2 === 1); lastZone = zone; }
      nots.forEach((li, i) => li.classList.toggle("on", p > 0.16 + i * 0.15));
      stamp.classList.toggle("on", p > 0.8);
      fin.classList.toggle("on", p > 0.84);
    });
  }

  /* ═══ FINALE: the price, then the curtain closes ═════════ */
  {
    const photo = $("#fnPhoto"), body = $("#fnBody"), qs = $$("#finale .fn-q"), H = $("#fnH"), V = $("#fnV"), fin = $("#fnFin");
    const amt = $("#fnAmt"), bill = $("#fnBill"), fine = $("#fnFine"), ints = $$<HTMLButtonElement>(".fn-int button");
    const dirs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    const FINE_COPY = (price: string) =>
      `Free for 14 days, then ${price}, auto-renewing. Cancel anytime in Settings; access runs to the end of the paid period. Studio+ is a software subscription. Pholio is not a talent agency and does not guarantee representation, bookings, or income.`;
    ints.forEach((b) => (b.onclick = () => {
      ints.forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", String(x === b)); });
      const annual = b.dataset.int === "a";
      amt.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-12px)" }], { duration: 220, easing: "ease-in" }).onfinish = () => {
        amt.innerHTML = `<sup>$</sup>${annual ? "7.99" : "9.99"}`;
        amt.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" });
      };
      bill.textContent = annual ? "Billed $95.88 a year" : "Billed monthly";
      fine.textContent = FINE_COPY(annual ? "$95.88 a year" : "$9.99 a month");
    }));
    scene("finale", (p) => {
      photo.style.transform = `scale(${lerp(1.12, 1, E.out(seg(p, 0, 0.6)))})`;
      const c = E.inOut(seg(p, 0.64, 0.84));
      qs.forEach((q, i) => (q.style.transform = `translate(${dirs[i][0] * (1 - c) * 101}%,${dirs[i][1] * (1 - c) * 101}%)`));
      body.style.opacity = String(1 - seg(p, 0.6, 0.72));
      const shrink = E.inOut(seg(p, 0.84, 0.97));
      H.style.opacity = V.style.opacity = String(seg(p, 0.7, 0.82));
      H.style.transform = `translate(-50%,-50%) scaleX(${lerp(1, 36 / innerWidth, shrink)})`;
      V.style.transform = `translate(-50%,-50%) scaleY(${lerp(1, 36 / innerHeight, shrink)})`;
      fin.style.opacity = String(seg(p, 0.9, 0.98));
    });
  }

  /* ── reveals ─────────────────────────────────────────────── */
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { rootMargin: "0px 0px -10% 0px" },
  );
  $$(".rv").forEach((el) => io.observe(el));
  offs.push(() => io.disconnect());

  /* ── timecode and scene name; both leave before the footer ─ */
  const tc = $("#tc"), sceneName = $("#sceneName"), named = $$("[data-name]"), credits = $("#credits");
  const RUNTIME = 7 * 60 + 12;
  const pad = (n: number) => String(n).padStart(2, "0");
  let lastName = "";
  const chrome = () => {
    const rr = root.getBoundingClientRect();
    const t = clamp(-rr.top / (rr.height - innerHeight)) * RUNTIME;
    tc.textContent = `TC 00:${pad(Math.floor(t / 60))}:${pad(Math.floor(t % 60))}:${pad(Math.floor((t % 1) * 24))}`;
    let cur = named[0];
    for (const el of named) if (el.getBoundingClientRect().top <= innerHeight * 0.5) cur = el;
    if (cur.id !== "site") hush(false);
    if (cur.dataset.name !== lastName) { lastName = cur.dataset.name!; sceneName.textContent = lastName; }
    root.classList.toggle("done", credits.getBoundingClientRect().bottom < innerHeight * 1.05);
  };

  /* ── the loop ────────────────────────────────────────────── */
  const RM_P: Record<string, number> = { overture: 1, card: 1, site: 0.41, record: 1, rule: 0.9, finale: 0.3 };
  const render = () => {
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -innerHeight * 0.5 || r.top > innerHeight * 1.5) continue;
      s.render(RM && RM_P[s.el.id] !== undefined ? RM_P[s.el.id] : prog(r), r);
    }
    chrome();
  };
  loop(render);
  on(window, "resize", render);

  return () => {
    alive = false;
    hush(false);
    offs.forEach((off) => off());
  };
}
