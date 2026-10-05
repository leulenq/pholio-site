/* Pholio — three directions. One file of behaviour, one rAF loop; only the
   visible direction is updated. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const outBack = (t) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrowMQ = matchMedia("(max-width: 820px)");
  let vw = innerWidth, vh = innerHeight;

  const prog = (el) => {
    const r = el.getBoundingClientRect();
    const total = r.height - vh;
    return { p: total > 0 ? clamp(-r.top / total) : 0, top: r.top, bottom: r.bottom, h: r.height, near: r.bottom > -vh * 0.3 && r.top < vh * 1.3 };
  };

  /* ── Real dates ───────────────────────────────────────────────────── */
  const today = new Date();
  const stamp = `${today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}, 14:32`;
  $$("[data-sent-stamp]").forEach((el) => (el.textContent = stamp));

  /* ── An edition card, as markup. The same nine designs serve the rack,
        the editor, the desk and the magazine. ─────────────────────────── */
  const IMG = (n) => `img/p${String(n).padStart(3, "0")}.jpg`;
  const STATS = "Height 175 · Bust 81 · Waist 61 · Hips 89 · Shoes 39";
  const EDITIONS = [
    { k: "standard", label: "The Standard", tone: "The industry card: one strong frame, a clean name band, a working back." },
    { k: "strip", label: "The Strip", tone: "The working commercial card: a full hero over a three-frame strip." },
    { k: "monograph", label: "The Monograph", tone: "Museum register: deep mats, caption typography, air as material." },
    { k: "masthead", label: "The Masthead", tone: "Magazine logic: the name set as a masthead, the photograph under it." },
    { k: "grid", label: "The Grid", tone: "Structural: a visible modular grid, grotesque type, a spine rail." },
    { k: "cover", label: "The Cover Story", tone: "Display type layered with the figure: the magazine-cover interlock." },
    { k: "night", label: "The Night Edition", tone: "Dark paper, reversed type, gold that finally sings." },
    { k: "diptych", label: "The Diptych", tone: "Two frames on a hinge: a face and a figure, read together." },
    { k: "cutout", label: "The Cutout", tone: "The figure lifted onto a flat plane, type in the space it leaves." },
  ];
  function ec(k, name = "Amara Lowe") {
    const up = name.toUpperCase();
    const first = name.split(" ")[0].toUpperCase();
    const inner = {
      standard: `<img src="${IMG(89)}" alt=""><div class="band"><p class="nm">${up}</p><p class="st">${STATS}</p></div>`,
      strip: `<img class="hero" src="${IMG(99)}" alt=""><div class="row"><i style="background-image:url(${IMG(90)})"></i><i style="background-image:url(${IMG(93)})"></i><i style="background-image:url(${IMG(95)})"></i></div><p class="nm">${name}</p><p class="st">175 cm · New York</p>`,
      monograph: `<img src="${IMG(91)}" alt=""><p class="nm">${name}</p><p class="st">New York — 175 cm — Eyes brown</p>`,
      masthead: `<p class="nm">${first}</p><img src="${IMG(88)}" alt=""><p class="st"><span>${up}</span><span>175 · 81 · 61 · 89</span></p>`,
      grid: `<div class="rail"><b>${name}</b></div><div class="g"><i style="background-image:url(${IMG(89)})"></i><i style="background-image:url(${IMG(93)})"></i><i style="background-image:url(${IMG(95)})"></i><i style="background-image:url(${IMG(99)})"></i></div><p class="st">${STATS}</p>`,
      cover: `<img src="${IMG(97)}" alt=""><p class="nm">${first}</p><p class="st">${STATS}</p>`,
      night: `<img src="${IMG(93)}" alt=""><p class="nm">${name}</p><p class="st">${STATS}</p>`,
      diptych: `<img class="l" src="${IMG(89)}" alt=""><img class="r" src="${IMG(95)}" alt=""><i class="hinge"></i><p class="nm">${up}</p>`,
      cutout: `<img src="${IMG(97)}" alt=""><p class="nm">${name}</p><p class="st">${STATS}</p>`,
    }[k];
    return `<div class="ec ec--${k}" data-k="${k}">${inner}</div>`;
  }
  const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };

  const FACES = [
    [89, "Amara Lowe", "175 cm · New York"], [41, "Lena Varga", "178 cm · London"], [278, "Mei Tanaka", "172 cm · Tokyo"],
    [173, "Adaeze Nwosu", "180 cm · Lagos"], [31, "Sasha Reid", "176 cm · London"], [36, "Inès Haddad", "174 cm · Paris"],
    [104, "Marcus Bell", "188 cm · New York"], [42, "Kemi Adeyemi", "178 cm · Lagos"], [52, "Elin Berg", "175 cm · Stockholm"],
    [120, "Theo Laurent", "187 cm · Paris"], [54, "Dara Quinn", "176 cm · New York"], [177, "Ama Mensah", "179 cm · Accra"],
    [300, "Hana Park", "173 cm · Seoul"], [113, "Luca Moretti", "186 cm · Milan"], [186, "Yasmin Karimi", "174 cm · Paris"],
    [167, "Ruby Hart", "173 cm · London"], [307, "Clara Vidal", "176 cm · Barcelona"], [27, "Kofi Boateng", "185 cm · London"],
    [189, "Leila Haddad", "171 cm · Dubai"], [10, "Zuri Okafor", "178 cm · Toronto"], [23, "Jin Ah", "177 cm · Seoul"],
    [44, "Noor Saleh", "177 cm · Milan"], [180, "Priya Nair", "172 cm · Mumbai"], [288, "Sofia Russo", "170 cm · Milan"],
  ];

  /* ══ Routing ═══════════════════════════════════════════════════════ */
  const VARIANTS = {};
  let active = "press";
  function show(name, scroll = true) {
    if (!["press", "sides", "issue"].includes(name)) name = "press";
    active = name;
    document.body.dataset.v = name;
    $$("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
    if (scroll) { lenis ? lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0); }
    requestAnimationFrame(() => VARIANTS[name]?.resize?.());
  }
  addEventListener("hashchange", () => show(location.hash.slice(1)));
  $$("[data-tab]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); history.replaceState(null, "", `#${a.dataset.tab}`); show(a.dataset.tab); }));
  $(".sw__wm").addEventListener("click", (e) => { e.preventDefault(); lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: "smooth" }); });

  /* ══ I · THE PRESS ═════════════════════════════════════════════════ */
  VARIANTS.press = (() => {
    const hero = $("[data-p-hero]"), card = $("[data-p-card]");
    const plates = { c: $('[data-plate="c"]'), m: $('[data-plate="m"]'), y: $('[data-plate="y"]') };
    const OFF = { c: [-0.62, -0.1, -7, 0], m: [0.56, 0.06, 5, 0.1], y: [0.04, 0.3, -3, 0.2] };
    const nameEl = $("[data-p-name]");
    nameEl.innerHTML = [...nameEl.textContent].map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
    const letters = $$("span", nameEl);
    const platesLabel = $("[data-p-plates]");
    const marks = $$(".p-mark", card);
    const hA = $("[data-p-a]"), hB = $("[data-p-b]"), foot = $("[data-p-foot]"), cue = $("[data-p-cue]");
    const t0 = performance.now();

    // Rack
    const rack = $("[data-p-rack]"), deck = $("[data-p-deck]");
    const cap = $("[data-p-cap]"), capB = $("b", cap), capS = $("span", cap), nEl = $("[data-p-n]");
    const cards = EDITIONS.map((e, i) => { const c = el(ec(e.k)); c.addEventListener("click", () => jump(i)); deck.appendChild(c); return c; });
    let aSmooth = 0, capShown = -1;
    const jump = (i) => {
      const r = rack.getBoundingClientRect();
      const top = scrollY + r.top + (i / (cards.length - 1)) * 0.9 * (r.height - vh) + 0.05 * (r.height - vh);
      lenis ? lenis.scrollTo(top) : scrollTo({ top, behavior: "smooth" });
    };

    // Loupe
    const loupe = $("[data-loupe]"), lens = $("[data-lens]");
    const ring = document.createElement("div"); ring.className = "p-ring"; loupe.appendChild(ring);
    let lx = 0.5, ly = 0.4, tx = 0.5, ty = 0.4, lastIn = -1e9;
    loupe.addEventListener("pointermove", (e) => {
      const r = loupe.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; lastIn = performance.now();
    });

    // Foil
    const foilSec = $("[data-p-foil]"), die = $("[data-die]"), stock = $("[data-stock]"), foil = $("[data-foil]");
    let fx = 0, fy = 0;
    foilSec.addEventListener("pointermove", (e) => { fx = e.clientX / vw - 0.5; fy = e.clientY / vh - 0.5; });

    // Price lever
    const lever = $(".p-lever"), priceEl = $("[data-price]"), perEl = $("[data-per]"), stampEl = $("[data-stamp]");
    $$("[data-bill]", lever).forEach((b) => b.addEventListener("click", () => {
      const y = b.dataset.bill === "y";
      $$("[data-bill]", lever).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      lever.classList.toggle("is-y", y);
      priceEl.textContent = y ? "$95.88" : "$9.99";
      perEl.textContent = y ? "a year" : "a month";
      stampEl.classList.toggle("is-on", y);
    }));

    // Carbon
    const carbon = $("[data-p-carbon]"), top = $("[data-sheet-top]");

    // Light table
    const box = $("[data-lightbox]");
    const slides = FACES.slice(0, 18).map(([n, name], i) => {
      const s = el(`<div class="slide"><i style="background-image:url(${IMG(n)})"></i><b>${name.split(" ")[0]} · ${String(i + 1).padStart(2, "0")}</b></div>`);
      box.appendChild(s);
      return s;
    });
    function scatter() {
      const W = box.clientWidth, H = box.clientHeight, cols = 6, rows = 3;
      slides.forEach((s, i) => {
        const cx = ((i % cols) + 0.5) / cols, cy = (Math.floor(i / cols) + 0.5) / rows;
        const jx = (Math.sin(i * 12.9) * 0.5) * 0.08, jy = (Math.cos(i * 7.3) * 0.5) * 0.1;
        s.style.left = `${(cx + jx) * W - 66}px`; s.style.top = `${(cy + jy) * H - 66}px`;
        s.style.transform = `rotate(${Math.sin(i * 3.1) * 7}deg)`;
      });
    }
    let drag = null, zTop = 10;
    box.addEventListener("pointerdown", (e) => {
      const s = e.target.closest(".slide"); if (!s) return;
      s.setPointerCapture(e.pointerId);
      drag = { s, x: e.clientX, y: e.clientY, l: parseFloat(s.style.left), t: parseFloat(s.style.top) };
      s.classList.add("is-drag"); s.style.zIndex = ++zTop;
    });
    box.addEventListener("pointermove", (e) => { if (!drag) return; drag.s.style.left = `${drag.l + e.clientX - drag.x}px`; drag.s.style.top = `${drag.t + e.clientY - drag.y}px`; });
    const endDrag = () => { if (drag) { drag.s.classList.remove("is-drag"); drag = null; } };
    box.addEventListener("pointerup", endDrag); box.addEventListener("pointercancel", endDrag);

    function update(t) {
      /* hero: three inks find register */
      const H = hero.getBoundingClientRect();
      if (H.bottom > 0) {
        const p = clamp(-H.top / (H.height - vh));
        const intro = RM ? 1 : outCubic(clamp((t - t0) / 1600));
        const ch = card.offsetHeight;
        let allIn = true;
        for (const k of ["c", "m", "y"]) {
          const [dx, dy, rot, lag] = OFF[k];
          const e = inOut(seg(p, 0.04 + lag * 0.9, 0.42 + lag * 0.9));
          if (e < 1) allIn = false;
          const far = (1 - e) * (1 + (1 - intro) * 0.9);
          plates[k].style.transform = `translate(${dx * ch * far}px, ${dy * ch * far}px) rotate(${rot * far}deg)`;
          plates[k].style.opacity = String(intro);
        }
        const nOn = Math.round(letters.length * seg(p, 0.62, 0.74));
        letters.forEach((s, i) => s.classList.toggle("is-on", i < nOn));
        platesLabel.textContent = allIn ? (nOn >= letters.length ? "In register · ready" : "In register") : "Cyan · Magenta · Yellow";
        marks.forEach((m) => (m.style.borderColor = allIn ? "var(--gold)" : ""));
        hA.style.transform = `translateX(${-p * 6}vw)`;
        hB.style.transform = `translateX(${p * 6}vw)`;
        foot.style.opacity = String(1 - seg(p, 0.85, 1) * 0.6);
        cue.style.opacity = String(1 - seg(p, 0, 0.08));
      }

      /* rack */
      const R = prog(rack);
      if (R.near) {
        const a = seg(R.p, 0.05, 0.95) * (cards.length - 1);
        aSmooth = RM ? a : lerp(aSmooth, a, 0.14);
        const ch = cards[0].offsetHeight, cw = ch * 0.647;
        const narrow = narrowMQ.matches;
        cards.forEach((c, i) => {
          const d = i - aSmooth, ad = Math.abs(d);
          const x = d * cw * (narrow ? 0.62 : 0.74), y = Math.pow(ad, 1.4) * ch * 0.05;
          const s = 1 - Math.min(ad, 4) * 0.075;
          c.style.transform = `translate(${x}px, ${y}px) rotate(${d * 5}deg) rotateY(${-d * 9}deg) scale(${s})`;
          c.style.zIndex = String(100 - Math.round(ad * 10));
          c.style.opacity = String(clamp(1 - (ad - 3.2) / 1.2));
          c.style.filter = ad > 0.5 ? `brightness(${1 - Math.min(ad, 4) * 0.05})` : "";
        });
        const idx = Math.round(aSmooth);
        if (idx !== capShown) {
          capShown = idx;
          capB.textContent = EDITIONS[idx].label; capS.textContent = EDITIONS[idx].tone;
          nEl.textContent = `${String(idx + 1).padStart(2, "0")} / 09`;
        }
      }

      /* loupe */
      const LR = loupe.getBoundingClientRect();
      if (LR.bottom > 0 && LR.top < vh) {
        if (t - lastIn > 1600) { tx = 0.5 + 0.3 * Math.sin(t / 1700); ty = 0.46 + 0.3 * Math.sin(t / 2300); }
        lx = lerp(lx, tx, 0.14); ly = lerp(ly, ty, 0.14);
        lens.style.setProperty("--x", `${lx * 100}%`); lens.style.setProperty("--y", `${ly * 100}%`);
        ring.style.left = `${lx * 100}%`; ring.style.top = `${ly * 100}%`;
      }

      /* foil: the die comes down, the foil goes on */
      const FR = foilSec.getBoundingClientRect();
      if (FR.bottom > 0 && FR.top < vh) {
        const q = RM ? 1 : seg((vh - FR.top) / vh, 0.45, 1.25);
        const contactY = stock.offsetTop - die.offsetHeight + 2;
        let dy, press = 0;
        if (q < 0.45) dy = lerp(-vh * 0.5, contactY, inOut(q / 0.45));
        else if (q < 0.6) { dy = contactY; press = Math.sin(((q - 0.45) / 0.15) * Math.PI); }
        else dy = lerp(contactY, -vh * 0.6, inOut(seg(q, 0.6, 0.95)));
        die.style.transform = `translateY(${dy}px)`;
        die.style.opacity = String(1 - seg(q, 0.8, 0.98));
        const reveal = seg(q, 0.47, 0.6);
        foil.style.clipPath = `inset(0 ${100 - reveal * 100}% 0 0)`;
        stock.style.transform = `rotateY(${fx * 16}deg) rotateX(${-fy * 12}deg) scale(${1 - press * 0.018})`;
        foil.style.setProperty("--fx", `${50 + fx * 120}%`);
      }

      /* carbon */
      const C = prog(carbon);
      if (C.near) {
        const e = inOut(seg(C.p, 0.2, 0.75));
        top.style.transform = `translate(${e * 70}vw, ${-e * 16}vh) rotate(${e * 16}deg)`;
      }
    }
    function resize() { scatter(); }
    return { update, resize };
  })();

  /* ══ II · BOTH SIDES ═══════════════════════════════════════════════ */
  VARIANTS.sides = (() => {
    const root = $(".vs");
    let seamUser = 0.5, seam = 0.5;
    const handle = $("[data-seam-h]");
    let dragging = false;
    handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    handle.addEventListener("pointermove", (e) => { if (dragging) seamUser = clamp(e.clientX / vw, 0.08, 0.92); });
    handle.addEventListener("pointerup", () => (dragging = false));
    handle.addEventListener("dblclick", () => (seamUser = 0.5));

    // Card: editor and desk
    const make = $("[data-s-make]"), desk = $("[data-s-desk]"), same = $("[data-s-same]");
    const nameIn = $("[data-s-name]");
    let ed = "standard";
    const nm = () => nameIn.value.trim().replace(/\s+/g, " ") || "Amara Lowe";
    function render(drop = true) {
      make.innerHTML = ec(ed, nm());
      const c = el(ec(ed, nm()));
      const ch = Math.min(vh * 0.54, vw * 0.32);
      c.style.left = `${-ch * 0.3235}px`; c.style.top = `${-ch * 0.5}px`;
      const rot = (Math.random() - 0.5) * 8;
      c.style.transform = `rotate(${rot}deg)`;
      desk.appendChild(c);
      while (desk.children.length > 4) desk.firstElementChild.remove();
      if (drop && !RM) c.animate([{ transform: `translate(-34vw, -60vh) rotate(${rot - 28}deg)`, opacity: 0.4 }, { transform: `rotate(${rot}deg)`, opacity: 1 }], { duration: 900, easing: "cubic-bezier(.2,.9,.25,1)" });
      same.innerHTML = ec(ed, nm());
    }
    $$("[data-ed]").forEach((b) => b.addEventListener("click", () => {
      ed = b.dataset.ed;
      $$("[data-ed]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      render();
    }));
    let nT; nameIn.addEventListener("input", () => { clearTimeout(nT); nT = setTimeout(() => render(true), 450); make.innerHTML = ec(ed, nm()); });
    // a small pile to start with
    ["night", "cover"].forEach((k) => { ed = k; render(false); });
    ed = "standard"; render(false);

    // AI
    const ai = $("[data-s-ai]"), facts = $$("[data-s-facts] span"), note = $("[data-s-note]");
    const brief = $("[data-s-brief]"), reqs = $$("[data-s-reqs] span"), results = $$("[data-s-results] figure");
    const thread = $("[data-s-thread]"), tPath = $("path", thread), tA = $("[data-thread-a]"), tB = $("[data-thread-b]");
    const NOTE = "Hi, I’m Amara: 175 cm, based in New York, working toward editorial and runway. I’m most myself in soft daylight, and these digitals are from this week. Thank you for looking.";
    const BRIEF = "editorial women, 5′9″ and up, New York, clean daylight beauty";

    // Studio+
    const bars = $("[data-s-bars]");
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    bars.innerHTML = Array.from({ length: 90 }, (_, i) => `<i style="height:${Math.round(18 + rnd() * 60 + (i > 60 ? 18 : 0) + Math.sin(i / 6) * 8)}%"></i>`).join("");
    $("[data-s-swatches]").innerHTML = ["#fcfaf6", "#fff", "#f1ebe0", "#0c0b09", "#b98a52", "#e9e2d4", "#1a1815", "#c9a55a", "#ece5d8"].map((c) => `<i style="background:${c};box-shadow:inset 0 0 0 1px rgba(26,24,21,.15)"></i>`).join("");

    // Receipts: one package, rendered twice
    const PKG = `<p class="pkg__h"><span>Application</span><span>Frozen</span></p>
      <div class="pkg__frames"><i style="background-image:url(${IMG(89)})"></i><i style="background-image:url(${IMG(93)})"></i><i style="background-image:url(${IMG(99)})"></i><i style="background-image:url(${IMG(95)})"></i></div>
      <dl><div><dt>To</dt><dd>Open call · Women’s board</dd></div><div><dt>Sent</dt><dd>${stamp}</dd></div><div><dt>Measurements</dt><dd>175 · 81 · 61 · 89</dd></div><div><dt>Note</dt><dd>“Hi, I’m Amara…”</dd></div></dl>
      <p class="pkg__seal">Snapshot ${today.toISOString().slice(0, 10).replaceAll("-", "")}-1432-A7F3</p>`;
    $$("[data-pkg]").forEach((p) => (p.innerHTML = PKG));

    // Pricing
    $$("[data-s-bill]").forEach((b) => b.addEventListener("click", () => {
      $$("[data-s-bill]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      const y = b.dataset.sBill === "y";
      $("[data-s-price]").textContent = y ? "$95.88" : "$9.99";
      $("[data-s-per]").textContent = y ? "/year" : "/month";
    }));

    // Agency inbox
    const ag = $("[data-s-ag]"), inbox = $("[data-s-inbox]");
    const figs = FACES.slice(0, 15).map(([n, name, meta], i) => {
      const f = el(`<figure${[0, 3, 8].includes(i) ? ' class="is-pick"' : ""}><img src="${IMG(n)}" alt=""><figcaption><b>${name}</b>${meta}</figcaption></figure>`);
      inbox.appendChild(f); return f;
    });

    function update() {
      if (narrowMQ.matches) return;
      // The agency section pulls the seam almost all the way left.
      const A = prog(ag);
      let target = seamUser;
      if (A.near) {
        const take = inOut(seg(A.p, 0.0, 0.22)) * (1 - inOut(seg(A.p, 0.86, 1)));
        target = lerp(seamUser, 0.035, take);
        const nOn = Math.round(figs.length * seg(A.p, 0.12, 0.6));
        figs.forEach((f, i) => f.classList.toggle("is-on", i < nOn));
      }
      seam = RM ? target : lerp(seam, target, dragging ? 0.5 : 0.12);
      root.style.setProperty("--seam", `${seam * vw}px`);

      const P = prog(ai);
      if (P.near) {
        const p = P.p;
        facts.forEach((f, i) => f.classList.toggle("is-on", p > 0.04 + i * 0.035));
        const n = Math.round(NOTE.length * seg(p, 0.2, 0.5));
        if (note.textContent.length !== n) note.textContent = NOTE.slice(0, n);
        const b = Math.round(BRIEF.length * seg(p, 0.3, 0.55));
        if (brief.textContent.length !== b) brief.textContent = BRIEF.slice(0, b);
        reqs.forEach((r, i) => r.classList.toggle("is-on", p > 0.56 + i * 0.025));
        results.forEach((r, i) => r.classList.toggle("is-on", p > 0.64 + i * 0.03));
        const th = seg(p, 0.76, 0.9);
        tA.classList.toggle("is-hot", th > 0);
        if (th > 0) {
          const pin = thread.getBoundingClientRect(), a = tA.getBoundingClientRect(), bR = tB.getBoundingClientRect();
          const x1 = a.right - pin.left, y1 = a.top + a.height / 2 - pin.top, x2 = bR.left - pin.left, y2 = bR.top + bR.height * 0.3 - pin.top;
          const mx = (x1 + x2) / 2;
          tPath.setAttribute("d", `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
          const L = tPath.getTotalLength();
          tPath.style.strokeDasharray = `${L}`; tPath.style.strokeDashoffset = `${L * (1 - th)}`;
          tPath.style.opacity = "1";
        } else tPath.style.opacity = "0";
      }
    }
    return { update, resize() { render(false); } };
  })();

  /* ══ III · THE ISSUE ═══════════════════════════════════════════════ */
  VARIANTS.issue = (() => {
    const stage = $("[data-i-stage]"), book = $("[data-i-book]"), leaves = $$("[data-leaf]"), insert = $("[data-i-insert]"), hint = $("[data-i-hint]");
    const N = leaves.length;
    // Editions spread and the directory
    $("[data-i-eds]").innerHTML = EDITIONS.map((e) => `<div>${ec(e.k).replace('class="ec', 'style="--h:calc(var(--ph) * .215)" class="ec')}<span>${e.label.replace("The ", "")}</span></div>`).join("");
    $("[data-i-dir]").innerHTML = FACES.slice(0, 20).map(([n, name, meta]) => `<figure><img src="${IMG(n)}" alt=""><figcaption><b>${name}</b>${meta}</figcaption></figure>`).join("");
    const faces = leaves.map((l) => [$(".pg--front", l), $(".pg--back", l)]);

    function update() {
      if (narrowMQ.matches) return;
      const S = prog(stage);
      if (!S.near) return;
      const u = S.p * (N + 1.15);
      const pw = book.offsetWidth / 2;
      const turns = leaves.map((_, k) => inOut(seg(u, k + 0.42, k + 1)));
      leaves.forEach((l, k) => {
        const t = turns[k];
        l.style.transform = `rotateY(${-180 * t}deg)`;
        l.style.zIndex = String(t > 0 && t < 1 ? 3 * N : t >= 1 ? N + k : N - k);
        faces[k][0].style.setProperty("--shade", String(Math.min(1, t * 1.6) * (t < 0.5 ? 1 : 0)));
        faces[k][1].style.setProperty("--shade", String(Math.min(1, (1 - t) * 1.6) * (t > 0.5 ? 1 : 0)));
      });
      const ins = inOut(seg(u, N + 0.1, N + 1.0));
      const shift = lerp(-pw / 2, 0, turns[0]) + (pw / 2) * turns[N - 1];
      book.style.transform = `translateX(${shift}px) translateY(${-ins * 6}vh) rotateX(${8 - ins * 4}deg) scale(${1 - ins * 0.12})`;
      book.style.filter = ins > 0 ? `brightness(${1 - ins * 0.45})` : "";
      insert.style.transform = `translate(-50%, ${lerp(80, -46, ins)}vh) rotate(${lerp(14, -3, ins)}deg)`;
      insert.style.opacity = String(seg(u, N + 0.05, N + 0.3));
      hint.style.opacity = String(1 - seg(u, 0.1, 0.4));
    }
    return { update };
  })();

  /* ══ Loop ══════════════════════════════════════════════════════════ */
  let lenis = null;
  function frame(t) {
    lenis?.raf(t);
    VARIANTS[active]?.update?.(t);
    requestAnimationFrame(frame);
  }
  addEventListener("resize", () => { vw = innerWidth; vh = innerHeight; VARIANTS[active]?.resize?.(); });
  addEventListener("load", () => VARIANTS[active]?.resize?.());

  if (window.Lenis && !RM) lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
  show(location.hash.slice(1) || "press", false);
  requestAnimationFrame(frame);
})();
