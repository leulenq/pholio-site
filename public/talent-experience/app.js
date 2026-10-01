/* Pholio · For models
 *
 * The page is the product's first evening with you. It greets you the way
 * the dashboard does, asks what the onboarding asks, captures your digitals
 * the way Guided Capture will, drops them into the real desktop Book, turns
 * the Book's cover into your comp card, and checks your set against every
 * agency's published list in the Market.
 *
 * Product strings are the product's own (pholio-app client): the Book,
 * Digitals, the comp card workbench, edition tones (editions.js), the
 * Market's requirement panel, the tracker's review-window copy
 * (submissionTracker.js) and Intel's "a pattern needs three". Agency lists
 * are the spec registry's published revisions (data/spec-registry/v1),
 * generated from the pack, not retyped.
 */
(() => {
  "use strict";
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(pointer: fine)").matches;
  const { gsap } = window;
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
  const eo = (t) => 1 - Math.pow(1 - t, 3);
  const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const IMG = "/talent-experience/img/";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: "auto" }));

  const top = $(".top");
  const stage = $(".stage");
  const film = $("#film");
  let G = null, W = 0, H = 0;

  /* ═════════════ you: a name and a height ═════════════ */
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Good evening" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  $$(".op__time, .close__time").forEach((el) => (el.textContent = greeting));

  const FALLBACK = "Ava";
  const nameInput = $(".op__name");
  let name = FALLBACK;
  function setName(v) {
    const clean = v.replace(/[^\p{L}\p{M}' -]/gu, "").replace(/\s+/g, " ").trim();
    const shown = clean ? clean.split(" ")[0] : FALLBACK;
    name = shown.charAt(0).toUpperCase() + shown.slice(1);
    $$("[data-name]").forEach((el) => (el.textContent = name));
    $$("[data-name-upper]").forEach((el) => (el.textContent = name.toUpperCase()));
    $$("[data-initials]").forEach((el) => (el.textContent = name.slice(0, 2).toUpperCase()));
    $$("[data-handle]").forEach((el) => (el.textContent = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "you"));
    if (G) requestAnimationFrame(() => { measure(); ScrollTrigger.refresh(); });
  }
  nameInput.addEventListener("input", () => setName(nameInput.value));
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); nameInput.blur(); scrollToY(filmY(1.45)); }
  });
  if (FINE && !RM) setTimeout(() => { if (window.scrollY < 40) nameInput.focus({ preventScroll: true }); }, 900);

  // Height in centimetres, shown the way the card and the pass print it.
  let cm = 178, unit = "in";
  const inches = (c) => Math.round(c / 2.54);
  const ftin = (c) => { const i = inches(c); return `${Math.floor(i / 12)}'${i % 12}"`; };
  function showHeight() {
    const c = Math.round(cm);
    $(".tape__big").textContent = unit === "in" ? ftin(c) : `${c}`;
    $(".tape__small").textContent = unit === "in" ? `${c} cm` : `centimetres · ${ftin(c)}`;
    $$("[data-height-rail]").forEach((el) => (el.textContent = `HEIGHT ${ftin(c)} · ${c}`));
    $$("[data-height-short]").forEach((el) => (el.textContent = `${ftin(c)} · ${c}`));
    $$("[data-height-pass]").forEach((el) => (el.textContent = `${c} cm / ${ftin(c)}`));
    const t = $(".tape__track");
    t.setAttribute("aria-valuenow", String(c));
    t.setAttribute("aria-valuetext", `${c} centimetres, ${ftin(c)}`);
  }

  /* ═════════════ the tape ═════════════ */
  const MIN = 140, MAX = 205, PX = 16; // px per centimetre
  const ruler = $(".tape__ruler");
  (function buildRuler() {
    let h = "";
    for (let c = MIN; c <= MAX; c++) {
      const x = (c - MIN) * PX, major = c % 5 === 0;
      h += `<i class="tk tk--cm${major ? " tk--m" : ""}" style="left:${x}px;height:${major ? 34 : 18}px"></i>`;
      if (c % 10 === 0) h += `<span class="lb lb--cm" style="left:${x}px">${c}</span>`;
    }
    for (let i = Math.ceil(MIN / 2.54); i <= Math.floor(MAX / 2.54); i++) {
      const x = (i * 2.54 - MIN) * PX, major = i % 2 === 0;
      h += `<i class="tk tk--in${major ? " tk--m" : ""}" style="left:${x}px;height:${major ? 34 : 20}px"></i>`;
      if (major) h += `<span class="lb lb--in" style="left:${x}px">${Math.floor(i / 12)}'${i % 12}"</span>`;
    }
    ruler.innerHTML = h;
    ruler.style.width = `${(MAX - MIN) * PX}px`;
  })();
  function placeRuler() {
    const w = $(".tape__track").clientWidth || window.innerWidth;
    ruler.style.transform = `translateX(${w / 2 - (cm - MIN) * PX}px)`;
    showHeight();
  }
  const snapTo = (c) => (unit === "in" ? clamp(Math.round(c / 2.54) * 2.54, MIN, MAX) : clamp(Math.round(c), MIN, MAX));
  function glideTo(v, d = 0.5) { const o = { v: cm }; return gsap.to(o, { v, duration: RM ? 0 : d, ease: "power3.out", onUpdate: () => { cm = o.v; placeRuler(); } }); }
  function setUnit(u) {
    unit = u;
    $$(".tape__units button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.u === u)));
    $$(".tk--cm, .lb--cm", ruler).forEach((el) => (el.style.display = u === "cm" ? "" : "none"));
    $$(".tk--in, .lb--in", ruler).forEach((el) => (el.style.display = u === "in" ? "" : "none"));
    glideTo(snapTo(cm));
  }
  $$(".tape__units button").forEach((b) => b.addEventListener("click", () => setUnit(b.dataset.u)));
  (function dragTape() {
    const track = $(".tape__track");
    let down = false, lx = 0, vel = 0, lt = 0, tween = null;
    track.addEventListener("pointerdown", (e) => { down = true; lx = e.clientX; lt = performance.now(); vel = 0; if (tween) tween.kill(); track.setPointerCapture(e.pointerId); });
    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - lx, now = performance.now();
      vel = dx / Math.max(1, now - lt); lx = e.clientX; lt = now;
      cm = clamp(cm - dx / PX, MIN, MAX); placeRuler();
    });
    const up = () => { if (!down) return; down = false; tween = glideTo(snapTo(cm - (vel * 260) / PX), 1.1); };
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    track.addEventListener("keydown", (e) => {
      const step = (unit === "in" ? 2.54 : 1) * (e.shiftKey ? 5 : 1);
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { cm = snapTo(cm + step); placeRuler(); e.preventDefault(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { cm = snapTo(cm - step); placeRuler(); e.preventDefault(); }
    });
  })();
  setUnit("in");

  /* ═════════════ Guided Capture ═════════════ */
  const SHOTS = [
    ["Headshot", "d-close", "g--close"],
    ["Profile", "d-profile", "g--profile"],
    ["Three-quarter", "d-three-quarter", "g--three"],
    ["Full length", "d-full", "g--full"],
  ];
  SHOTS.forEach((s) => { new Image().src = `${IMG}${s[1]}.webp`; });
  $(".cap__agency").textContent = "Digitals · new dated set";
  let shotI = -1;
  function setShot(i) {
    if (i === shotI) return;
    shotI = i;
    const [label, img, g] = SHOTS[i];
    $(".cap__img").src = `${IMG}${img}.webp`;
    $(".cap__shotname").textContent = label;
    $(".cap__count").textContent = `${i + 1} of 4`;
    $$(".cap__guide .g").forEach((el) => el.classList.toggle("on", el.classList.contains(g)));
  }
  setShot(0);

  /* ═════════════ the desk ═════════════ */
  const slots = $$(".slot");
  slots.forEach((s, k) => {
    if (k < 4) { const im = document.createElement("img"); im.src = `${IMG}${SHOTS[k][1]}-s.webp`; im.alt = ""; $(".slot__box", s).appendChild(im); }
  });
  const reshoot = new Date(); reshoot.setMonth(reshoot.getMonth() + 3);
  $$("[data-reshoot]").forEach((el) => (el.textContent = reshoot.toLocaleDateString("en-US", { month: "long", year: "numeric" })));
  const flight = $(".flight");
  const flyers = SHOTS.map((s) => { const im = document.createElement("img"); im.src = `${IMG}${s[1]}-s.webp`; im.alt = ""; flight.appendChild(im); return im; });

  /* ═════════════ the comp card ═════════════ */
  // Shipped tone lines (editions.js); the house display rule sets their em-dashes as colons.
  const EDITIONS = [
    ["house-classic", "The Standard", "The industry card: one strong frame, a clean name band, a working back."],
    ["the-strip", "The Strip", "The working commercial card: a full hero over a three-frame strip."],
    ["gallery-monograph", "The Monograph", "Museum register: deep mats, caption typography, air as material."],
    ["editorial-masthead", "The Masthead", "Magazine logic: the name set as a masthead, the photograph under it."],
    ["swiss-modernist", "The Grid", "Structural: a visible modular grid, grotesque type, a spine rail."],
    ["ink-noir", "The Night Edition", "Dark paper, reversed type, gold that finally sings."],
    ["cover-story", "The Cover Story", "Display type layered behind the figure: the magazine-cover interlock."],
    ["duet", "The Diptych", "Two frames on a hinge: a face and a figure, read together."],
    ["studio-cutout", "The Cutout", "The figure lifted onto a flat plane, type in the silhouette's negative space."],
  ];
  const card = $(".card3d");
  const chips = $(".chips");
  chips.innerHTML = EDITIONS.map(([id, label]) => `<button type="button" class="chip" data-id="${id}">${label}</button>`).join("");
  let edId = "", touched = false;
  function setEdition(id, byUser) {
    if (byUser === true) touched = true;
    if (id === edId) return;
    edId = id;
    const e = EDITIONS.find((x) => x[0] === id);
    card.dataset.edition = id;
    $(".ed__title").textContent = e[1];
    $(".ed__tone").textContent = e[2];
    $(".ed__line .mono-meta").textContent = touched ? "Your pick" : "Pholio's choice";
    $$(".chip", chips).forEach((c) => c.classList.toggle("on", c.dataset.id === id));
    if (!RM && G) gsap.fromTo([".ed__title", ".ed__tone"], { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05 });
  }
  setEdition("ink-noir", false);
  chips.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) setEdition(b.dataset.id, true); });
  $("[data-take]").addEventListener("click", () => { const i = EDITIONS.findIndex((x) => x[0] === edId); setEdition(EDITIONS[(i + 1) % EDITIONS.length][0], true); });
  $("[data-direction]").addEventListener("click", () => { let n; do { n = EDITIONS[Math.floor(Math.random() * EDITIONS.length)][0]; } while (n === edId); setEdition(n, true); });
  $$(".bench__tabs button").forEach((b) => b.addEventListener("click", () => {
    card.classList.toggle("is-back", b.dataset.side === "back");
    $$(".bench__tabs button").forEach((x) => x.classList.toggle("on", x === b));
  }));
  $("[data-wallet]").addEventListener("click", () => scrollToY(filmY(10.5)));
  // The bench is part of the Book page, so it wears the app's bar.
  $(".bench").prepend($(".app__bar").cloneNode(true));

  // Illustrative code, not a scannable one.
  function qr(el, seed) {
    let s = seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    let h = "";
    for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
      let f = -1;
      for (const [fr, fc] of [[0, 0], [0, 14], [14, 0]]) {
        const y = r - fr, x = c - fc;
        if (y >= 0 && y < 7 && x >= 0 && x < 7) f = (y === 0 || y === 6 || x === 0 || x === 6 || (y > 1 && y < 5 && x > 1 && x < 5)) ? 1 : 0;
        else if (y >= -1 && y <= 7 && x >= -1 && x <= 7 && f === -1) f = 0;
      }
      h += f === 1 || (f === -1 && rnd() > 0.5) ? "<i></i>" : '<i class="o"></i>';
    }
    el.innerHTML = h;
  }
  qr($(".pass__qr"), 7); qr($(".b__qr"), 11);

  /* ═════════════ geometry ═════════════ */
  const phone = $(".phone"), desk = $(".desk"), page = $(".app__page"), cover = $(".cover"), bench = $(".bench"), q = $(".q"), tape = $(".tape");
  const rel = (r, s) => [r.left - s.left, r.top - s.top, r.width, r.height];
  function measure() {
    const sr = stage.getBoundingClientRect();
    W = sr.width; H = sr.height;
    gsap.set([phone, desk, page, bench, nameInput, q, tape], { clearProps: "transform" });
    gsap.set(phone, { xPercent: -50, yPercent: -50 });
    const hidden = [phone, desk, bench, q, tape];
    const prev = hidden.map((el) => [el.style.visibility, el.style.opacity]);
    hidden.forEach((el) => { el.style.visibility = "hidden"; });
    const wasBack = card.classList.contains("is-back");
    card.classList.remove("is-back");
    const nameR = nameInput.getBoundingClientRect();
    const qn = $(".q__name").getBoundingClientRect();
    const view = rel($(".cap__view").getBoundingClientRect(), sr);
    const slotsR = slots.slice(0, 4).map((s) => rel($(".slot__box", s).getBoundingClientRect(), sr));
    const bookTop = $(".book").getBoundingClientRect().top - page.getBoundingClientRect().top;
    const coverTile = rel($(".bf--cover .bf__img").getBoundingClientRect(), sr);
    const hero = rel($(".f__hero").getBoundingClientRect(), sr);
    card.classList.toggle("is-back", wasBack);
    hidden.forEach((el, k) => { el.style.visibility = prev[k][0]; });
    const fsIn = parseFloat(getComputedStyle(nameInput).fontSize);
    const fsQ = parseFloat(getComputedStyle(q).fontSize);
    const barH = $(".app__bar").getBoundingClientRect().height;
    G = {
      name: [nameR.left - sr.left, nameR.top - sr.top + (nameR.height - fsIn * 1.02) / 2],
      qn: [qn.left - sr.left, qn.top - sr.top],
      nameScale: fsQ / fsIn,
      view, slots: slotsR, coverTile, hero,
      bookShift: Math.max(0, bookTop - (barH + 12)),
    };
  }

  /* ═════════════ the film ═════════════ */
  const T = 12;
  const filmY = (p) => film.getBoundingClientRect().top + window.scrollY + (p / T) * (film.offsetHeight - window.innerHeight);
  let lastShot = -2, autoEd = null;
  const lerpR = (a, b, t) => a.map((v, k) => lerp(v, b[k], t));

  function render(p) {
    /* the greeting becomes the question */
    const g1 = eio(seg(p, 0.55, 1.15));
    gsap.set(".op__photo", { xPercent: 12 * g1, autoAlpha: 1 - seg(p, 0.5, 0.95) });
    gsap.set([".op__time", ".op__hint", ".op__lede"], { autoAlpha: 1 - seg(p, 0.45, 0.75), y: -30 * g1 });
    if (p > 0.5 && !nameInput.value.trim()) { nameInput.value = FALLBACK; nameInput.dataset.auto = "1"; }
    if (p < 0.4 && nameInput.dataset.auto) { nameInput.value = ""; delete nameInput.dataset.auto; }
    gsap.set(nameInput, { x: (G.qn[0] - G.name[0]) * g1, y: (G.qn[1] - G.name[1]) * g1, scale: lerp(1, G.nameScale, g1), autoAlpha: p < 1.12 ? 1 : 0 });
    gsap.set(".op", { autoAlpha: p < 1.2 ? 1 : 0 });

    const qOut = seg(p, 4.3, 4.6);
    gsap.set(q, { opacity: p > 0.9 && qOut < 1 ? 1 : 0 });
    gsap.set(".q__name", { opacity: p >= 1.12 ? 1 - qOut : 0 });
    gsap.set(".q__tails", { opacity: seg(p, 0.95, 1.15) * (1 - qOut) });
    const sw = seg(p, 2.3, 2.5);
    gsap.set(".q__tail--tall", { opacity: 1 - sw, y: -14 * sw });
    gsap.set(".q__tail--see", { opacity: sw, y: 14 * (1 - sw) });

    /* the tape */
    const ta = seg(p, 1.0, 1.25) * (1 - seg(p, 2.25, 2.5));
    gsap.set(tape, { autoAlpha: ta, y: 60 * seg(p, 2.25, 2.5) + 30 * (1 - seg(p, 1.0, 1.25)) });

    /* the phone rises for Guided Capture, leaves as the desk arrives, returns for Wallet */
    const up = eo(seg(p, 2.35, 2.75)), leave = eio(seg(p, 4.35, 4.9));
    const wIn = eo(seg(p, 10.0, 10.45)), wOut = eio(seg(p, 10.95, 11.35));
    const walletPhase = p > 9.9;
    const px = walletPhase ? (W < 860 ? 0 : Math.min(W * 0.36, W / 2 - 150)) : -W * 0.34 * leave;
    const py = walletPhase ? H * 0.95 * (1 - wIn) + H * 0.95 * wOut : H * 0.95 * (1 - up) + H * 0.25 * leave;
    const pVis = walletPhase ? p < 11.4 : p > 2.35 && p < 4.95;
    gsap.set(phone, { x: px, y: py, rotation: walletPhase ? 5 * (1 - wIn) : -4 * leave, autoAlpha: pVis ? 1 : 0 });
    gsap.set(".cap", { autoAlpha: walletPhase ? 0 : 1 });
    gsap.set(".wal", { autoAlpha: walletPhase ? 1 : 0 });

    /* capture: four frames against the guide */
    if (p > 2.55 && p < 4.45) {
      const k = clamp(Math.floor((p - 2.6) / 0.42), 0, 3);
      setShot(k);
      const local = (p - 2.6 - k * 0.42) / 0.42;
      const fl = clamp(1 - Math.abs(local - 0.72) / 0.08, 0, 1);
      gsap.set(".cap__flash", { opacity: fl * 0.9 });
      gsap.set(".cap__shutter i", { scale: 1 - fl * 0.12 });
      const taken = local > 0.72 ? k : k - 1;
      if (taken !== lastShot) { lastShot = taken; if (taken >= 0) $(".cap__roll img").src = `${IMG}${SHOTS[taken][1]}-s.webp`; gsap.set(".cap__roll", { opacity: taken >= 0 ? 1 : 0.25 }); }
    } else if (p <= 2.55 && lastShot !== -2) { setShot(0); gsap.set(".cap__roll", { opacity: 0.25 }); lastShot = -2; }

    /* the desk rises; the frames fly into Digitals */
    const dk = eio(seg(p, 4.35, 5.0));
    const deskY = H * (1 - dk);
    gsap.set(desk, { y: deskY, autoAlpha: p > 4.35 && p < 7.45 ? 1 : 0 });
    const shift = G.bookShift * eio(seg(p, 5.55, 6.4));
    gsap.set(page, { y: -shift });
    let filled = 0;
    flyers.forEach((im, k) => {
      const t = eio(seg(p, 4.5 + k * 0.08, 4.98 + k * 0.08));
      const from = [G.view[0] - W * 0.34 * leave, G.view[1] + H * 0.25 * leave, G.view[2], G.view[3]];
      const s = G.slots[k];
      const to = [s[0], s[1] + deskY - shift, s[2], s[3]];
      const r = lerpR(from, to, t);
      gsap.set(im, { x: r[0], y: r[1], width: r[2], height: r[3], opacity: p > 4.45 && t < 1 ? 1 : 0, rotation: Math.sin(t * Math.PI) * (k % 2 ? 3 : -3) });
      const done = t >= 1;
      slots[k].classList.toggle("is-filled", done);
      if (done) filled++;
    });
    $(".dgt__count").textContent = String(filled);
    gsap.set(".dgt__current", { opacity: seg(p, 5.2, 5.45) });

    /* the cover: from the grid to the whole screen, then into the card */
    const c1 = eio(seg(p, 6.45, 7.05)), c2 = eio(seg(p, 7.05, 7.75));
    const tile = [G.coverTile[0], G.coverTile[1] - G.bookShift, G.coverTile[2], G.coverTile[3]];
    const r = c2 > 0 ? lerpR([0, 0, W, H], G.hero, c2) : lerpR(tile, [0, 0, W, H], c1);
    gsap.set(cover, { x: r[0], y: r[1], width: r[2], height: r[3], autoAlpha: p > 6.45 && p < 7.78 ? 1 : 0 });
    gsap.set(bench, { autoAlpha: seg(p, 7.1, 7.4) });
    card.classList.toggle("is-landing", p < 7.76);

    /* the bench: Pholio's choice, then two more takes unless you've picked */
    if (!touched && p > 7.7) {
      const want = p < 8.55 ? "ink-noir" : p < 9.25 ? "cover-story" : "house-classic";
      if (want !== autoEd) { autoEd = want; setEdition(want, false); }
    }
    gsap.set("[data-wallet]", { scale: 1 - Math.sin(seg(p, 9.8, 10.0) * Math.PI) * 0.06 });
    const pd = seg(p, 10.3, 10.62);
    gsap.set(".pass", { yPercent: lerp(-140, 0, gsap.parseEase("back.out(1.4)")(pd)), opacity: pd > 0 ? 1 : 0 });

    /* the product's own bar takes over while the product is on screen */
    top.classList.toggle("is-away", p > 4.5);
  }

  /* ═════════════ the Market ═════════════ */
  const MARKET = [{"name":"Bicoastal Mgmt","where":"SELECTED MARKETS","countries":["US"],"channel":"official_web_form","url":"https://www.bicoastalmgmt.com/get-scouted","checked":"2026-08-29","shots":["CLOSE-UP","FULL BODY","SIDE PROFILE","UPPER BODY"],"shoot":[],"avoid":[],"files":[]},{"name":"CURV Management","where":"NEW YORK","countries":["US"],"channel":"official_web_form","url":"https://thecurvmanagement.com/submissions","checked":"2026-08-29","shots":["PROFILE IMAGES"],"shoot":["AS NATURAL AS POSSIBLE","FORM FITTING CLOTHING IS PREFERRED, FOR EXAMPLE FITTED TANK AND SKINNY JEANS"],"avoid":["IMAGES WITHOUT MAKEUP","NO FILTERED IMAGES"],"files":[".jpg, .jpeg, .png, .gif"]},{"name":"Elite Models","where":"SELECTED MARKETS","countries":["CA","US"],"channel":"official_web_form","url":"https://www.elitemodels.com/become-elite","checked":"2026-08-09","shots":["Full length","Full length profile","Portrait length","Close up (hair pulled back)","Close up profile (hair pulled back)","Personality pic"],"shoot":["form fitted clothing"],"avoid":["do not wear any makeup","large accessories","No smiles"],"files":[]},{"name":"Ford Models","where":"SELECTED MARKETS","countries":["US","ES"],"channel":"agency_branded_third_party_form","url":"https://www.fordmodels.com/get-scouted","checked":"2026-08-29","shots":["Close-up","Full Length","Side Profile","Upper Body"],"shoot":["We are looking for you at your most natural.","Pull your hair back.","Wear a form fitting outfit like skinny jeans and a tank top.","We need to see the shape of your body."],"avoid":["Have a clean face with absolutely no makeup."],"files":[".jpg,.jpeg,.png,image/jpeg,image/png"]},{"name":"IMG Models","where":"GLOBAL","countries":[],"channel":"official_web_form","url":"https://getscouted.imgmodels.com/","checked":"2026-08-09","shots":["upload head shot","upload profile","upload full length"],"shoot":[],"avoid":["avoid ... make-up","avoid baggy clothing","avoid ... smiling","should not be filtered","should not be ... re-touched","should not be ... professionally taken"],"files":[".webp, .png, .jpeg, .avif, .tiff, .heic, .jpg","Images cannot be over 30 MB"]},{"name":"JAG Models","where":"SELECTED MARKETS","countries":["US"],"channel":"official_web_form","url":"https://jagmodels.com/submissions/","checked":"2026-08-29","shots":["Full length","Close up","Profile"],"shoot":[],"avoid":[],"files":["Max. file size: 64 MB."]},{"name":"Muse Model Management","where":"NEW YORK","countries":["US"],"channel":"official_email","url":"https://www.musenyc.com/contact","checked":"2026-08-09","shots":["Close ups ... hair up","Close ups ... hair down","full length"],"shoot":["background is clear from clutter","Natural light is always best","show us what you look like at your most natural and relaxed","simple and form fitting","or a bikini","shirtless is ok"],"avoid":["DO NOT wear: HEELS","DO NOT wear: MAKE UP","DO NOT wear: JEWELRY"],"files":[]},{"name":"ONE Management","where":"GLOBAL","countries":["US","ES","GB"],"channel":"official_web_form","url":"https://onemanagement.com/submissions/application","checked":"2026-08-29","shots":["Full Length","Waist Up","Close Up","Profile"],"shoot":["Shoot the photos in natural daylight. Please avoid direct sunlight.","wear your hair down","A white t-shirt/tank top and skinny jeans are ideal for these photos.","These images help document your look for us - much like a passport photo does.","background... free of clutter","It is not necessary to hire a professional."],"avoid":["Please do not use makeup or hairstyling","no smiles or selfie style poses"],"files":["Formats: jpg, jpeg, or png.","File size: maximum 600 KB per image."]},{"name":"Q Management","where":"SELECTED MARKETS","countries":["US"],"channel":"official_web_form","url":"https://www.qmanagementinc.com/join","checked":"2026-08-29","shots":["Headshot","Full Length","Profile","3/4 Length"],"shoot":[],"avoid":[],"files":["Submit your photos as JPG files",".jpg, .jpeg, .png, .gif","no larger than 3MB in size"]},{"name":"State Management","where":"SELECTED MARKETS","countries":["US"],"channel":"official_web_form","url":"https://www.statemgmt.com/become-a-model","checked":"2026-08-29","shots":["close-up","waist-up","full-length","3/4 profile"],"shoot":["Digitals shot in natural daylight (not direct sunlight)","with no makeup","hair down","and neutral face"],"avoid":[],"files":[]},{"name":"The Society Management","where":"NEW YORK","countries":["US"],"channel":"official_web_form","url":"https://www.thesocietymanagement.com/become-model.web","checked":"2026-08-09","shots":["Please submit a ... close-up","Please submit a ... profile","Please submit a full-length"],"shoot":["taken in a well-lit space","Take images in front facing natural daylight","Wear either form-fitting clothing and/or your favorite outfit","and/or your favorite outfit","we would love to see your personal style","Clean and simple images are best!","phone images ... are perfectly acceptable","Professional studio photos are not necessary"],"avoid":["with no make up","with ... no hair products"],"files":["Photo (up to 5MB each)"]},{"name":"Wilhelmina","where":"SELECTED MARKETS","countries":["US","GB"],"channel":"official_web_form","url":"https://www.wilhelmina.com/become-a-model","checked":"2026-08-09","shots":[],"shoot":[],"avoid":[],"files":[]}];

  // A published slot, read as a frame from your set (or not).
  function readShot(label) {
    const s = label.toLowerCase();
    if (/personality/.test(s)) return ["Personality", null];
    if (/profile images/.test(s)) return ["Profile images", "d-close"];
    if (/close/.test(s) && /profile/.test(s)) return ["Close-up profile, hair back", null];
    if (/hair down/.test(s)) return ["Close-up, hair down", null];
    if (/full/.test(s) && /profile/.test(s)) return ["Full length profile", null];
    if (/3\/4 profile/.test(s)) return ["Three-quarter profile", null];
    if (/head|close/.test(s)) return ["Close-up", "d-close"];
    if (/3\/4|three/.test(s)) return ["Three-quarter", "d-three-quarter"];
    if (/waist|upper|portrait length/.test(s)) return ["Waist-up", null];
    if (/profile|side/.test(s)) return ["Profile", "d-profile"];
    if (/full|body/.test(s)) return ["Full length", "d-full"];
    return [label, null];
  }
  const WORD = ["None", "One", "Two", "Three", "Four", "Five", "Six"];
  const COUNTRY = { US: "United States", CA: "Canada", GB: "United Kingdom", ES: "Spain" };
  const fmtDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const list = $(".mk__list");
  list.innerHTML = MARKET.map((a, i) => {
    const shots = a.shots.map(readShot);
    const have = shots.filter((x) => x[1]).length;
    const n = shots.length;
    const lead = n === 0
      ? `No shot list published. <span>Their own page is the authority.</span>`
      : `${n} frame${n > 1 ? "s" : ""}. <span>${have === n ? (n === 1 ? "It's in your set." : `All ${WORD[n].toLowerCase()} in your set.`) : have === 0 ? "None in your set yet." : `${WORD[have]} already in your set.`}</span>`;
    const country = a.where === "SELECTED MARKETS" && a.countries.length ? a.countries.map((c) => COUNTRY[c] || c).join(", ") : "";
    const pkgExtra = a.channel === "official_email" ? " · EMAIL.txt, a draft you send from your own address" : "";
    const sizeNote = a.files.some((f) => /600 KB/.test(f)) ? " · re-encoded under 600 KB" : "";
    return `<li class="mk__row" data-i="${i}">
      <button type="button" class="mk__face" aria-expanded="false" aria-controls="mk-${i}">
        <span><span class="mk__where">${esc(a.where)}</span><span class="mk__name">${esc(a.name)}</span>${country ? `<span class="mk__country">${esc(country)}</span>` : ""}</span>
      </button>
      <div class="mk__panel" id="mk-${i}"><div>
        <p class="mk__lead">${lead}</p>
        <div class="mk__cols">
          <ul class="mk__shots">${shots.map(([l, f]) => `<li class="mk__shot"><span class="mk__thumb${f ? "" : " mk__thumb--empty"}">${f ? `<img src="${IMG}${f}-s.webp" alt="" loading="lazy">` : ""}</span><span>${esc(l)}${f ? "" : "<small>Not in your set yet</small>"}</span></li>`).join("")}</ul>
          <div class="mk__words">
            ${a.shoot.length ? `<div><h5>SHOOT</h5><p>${a.shoot.map(esc).join(" · ")}</p></div>` : ""}
            ${a.avoid.length ? `<div class="mk__avoid"><h5>AVOID</h5><p>${a.avoid.map(esc).join(" · ")}</p></div>` : ""}
            ${a.files.length ? `<div class="mk__avoid"><h5>FILES</h5><p>${a.files.map(esc).join(" · ")}</p></div>` : ""}
            ${!a.shoot.length && !a.avoid.length && !a.files.length ? `<div><p>Their page publishes the shot list and nothing more.</p></div>` : ""}
          </div>
        </div>
        <div class="mk__acts">
          <button type="button" class="mk__prep">Prepare a package <span aria-hidden="true">↗</span></button>
          <a class="mk__site" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Their own site ↗</a>
          <span class="mk__checked">Checked ${fmtDate(a.checked)}</span>
        </div>
        <p class="mk__pkg">${slug(a.name)}.zip · ${have} frame${have === 1 ? "" : "s"}, named to their list${sizeNote} · README.txt · STATS.txt${pkgExtra}</p>
      </div></div>
    </li>`;
  }).join("");

  let openRow = null, autoOpened = false;
  function toggleRow(li, force) {
    const open = force !== undefined ? force : !li.classList.contains("is-open");
    if (open && openRow && openRow !== li) toggleRow(openRow, false);
    const panel = $(".mk__panel", li);
    li.classList.toggle("is-open", open);
    $(".mk__face", li).setAttribute("aria-expanded", String(open));
    gsap.to(panel, { height: open ? "auto" : 0, duration: RM ? 0 : 0.7, ease: "expo.inOut", onComplete: () => ScrollTrigger.refresh() });
    if (open && !RM) gsap.fromTo($$(".mk__lead, .mk__shot, .mk__words > div, .mk__acts", panel), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: "power3.out", delay: 0.15 });
    openRow = open ? li : null;
  }
  list.addEventListener("click", (e) => {
    const face = e.target.closest(".mk__face");
    if (face) { autoOpened = true; toggleRow(face.closest(".mk__row")); return; }
    const prep = e.target.closest(".mk__prep");
    if (prep) gsap.to($(".mk__pkg", prep.closest(".mk__row")), { height: "auto", marginTop: 18, duration: RM ? 0 : 0.5, ease: "power3.out" });
  });
  // The Market opens one house for you on the way past.
  const oneRow = $$(".mk__row").find((li) => /ONE Management/.test(li.textContent));
  ScrollTrigger.create({ trigger: oneRow, start: "top 62%", onEnter: () => { if (!autoOpened) { autoOpened = true; toggleRow(oneRow, true); } } });
  ScrollTrigger.create({ trigger: ".market", start: "top 40px", end: "bottom 40px", onToggle: (s) => { if (s.isActive) top.dataset.tone = "light"; } });
  if (!RM) {
    gsap.from(".mk__title", { yPercent: 30, opacity: 0, ease: "power3.out", scrollTrigger: { trigger: ".market", start: "top 90%", end: "top 30%", scrub: 0.6 } });
    $$(".mk__row").forEach((li) => gsap.from($(".mk__name", li), { xPercent: 6, opacity: 0, ease: "power3.out", scrollTrigger: { trigger: li, start: "top 98%", end: "top 72%", scrub: 0.6 } }));
  }

  /* ═════════════ the silence ═════════════ */
  const qStatus = $(".ql__status"), qNext = $(".ql__next"), qDay = $(".quiet__d b"), qClock = $(".quiet__clock");
  let qClosed = null;
  ScrollTrigger.create({
    trigger: ".quiet", start: "top top", end: "bottom bottom",
    onUpdate: (s) => {
      const day = Math.min(30, 1 + Math.floor(seg(s.progress, 0.05, 0.62) * 29.999));
      qDay.textContent = day;
      qClock.style.setProperty("--pct", `${(day / 30) * 100}%`);
      const closed = day >= 30;
      if (closed !== qClosed) {
        qClosed = closed;
        qStatus.textContent = closed ? "No response" : "Awaiting reply";
        qStatus.classList.toggle("is-closed", closed);
        qNext.textContent = closed
          ? "Industry convention says treat this as a pass. Re-apply window opens Mar 30, 2027."
          : "Their review window runs to Oct 30. Nothing is expected of you until then.";
        if (!RM) gsap.fromTo([qStatus, qNext], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      }
      gsap.set(".quiet__intel", { opacity: seg(s.progress, 0.72, 0.86), y: 20 * (1 - seg(s.progress, 0.72, 0.86)) });
    },
  });
  ScrollTrigger.create({ trigger: ".quiet", start: "top 40px", end: "bottom 40px", onToggle: (s) => { if (s.isActive) top.dataset.tone = "dark"; } });
  ScrollTrigger.create({ trigger: ".close", start: "top 40px", end: "bottom top", onToggle: (s) => { if (s.isActive) top.dataset.tone = "dark"; } });
  if (!RM) gsap.from([".close__greet", ".close__cta", ".close__fine"], { y: 40, opacity: 0, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".close", start: "top 70%", end: "top 15%", scrub: 0.6 } });

  /* ═════════════ boot ═════════════ */
  setName("");
  measure();
  placeRuler();
  ScrollTrigger.create({
    trigger: film, start: "top top", end: "bottom bottom",
    onUpdate: (s) => render(s.progress * T),
    onRefresh: (s) => render(s.progress * T),
    onToggle: (s) => { if (s.isActive) top.dataset.tone = "dark"; },
  });
  render(0);
  let lw = window.innerWidth;
  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - lw) < 2 && Math.abs(stage.getBoundingClientRect().height - H) < 120) return;
    lw = window.innerWidth; measure(); placeRuler(); ScrollTrigger.refresh();
  });
  document.fonts && document.fonts.ready.then(() => { measure(); placeRuler(); ScrollTrigger.refresh(); });
  window.addEventListener("load", () => { measure(); ScrollTrigger.refresh(); });
})();
