/**
 * /talent: "Call time". Behaviour for talent.html.
 *
 * One rAF loop reads the page's scroll position (the site's inertia layer
 * gives it weight) and derives each pinned scene's progress from it:
 *
 * I.   The turn. A digitals sitting drawn from a frame sequence; the pointer
 *      turns her at rest. Scroll pulls the film back into the live view of a
 *      phone held in a hand, then turns her a full 360 while Guided Capture
 *      takes four frames. The fifth (full length) is called and never taken.
 * II.  The Book. Those four frames drop into the real desktop Digitals sheet,
 *      the camera pulls back, then pushes into the freshness line.
 * III. The Market. Scroll (or a click) walks real agencies' published briefs;
 *      her set re-lays into each agency's own slots and names what's missing.
 * IV.  Silence. A clip scrubbed across thirty days, with the tracker's own
 *      words when the window closes.
 * V.   The card. "Add to Apple Wallet": the add sheet, the pass landing in
 *      Wallet, the details behind it. Every control is tappable.
 * VI.  Everyone. A wall of faces on film, and the one action.
 *
 * `mountTalent(root)` returns a cleanup.
 */

const A = "/calltime";

/* ── math ─────────────────────────────────────────────────────────────── */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/* ── dates, computed the way the product computes them ────────────────── */
const addDays = (d, n) => new Date(d.getTime() + n * 864e5);
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const longDate = (d) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const monthYear = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

/* ── Market briefs: slot labels verbatim from pholio-app
      client/src/domains/talent/content/agencyBriefs.js (checked 2026-08-19).
      Frames: h headshot, p profile, t three-quarter, b back; null = not in
      her set (she has no full-length frame, and her hair is down). ────── */
const BRIEFS = [
  { name: "Ford Models", method: "Online form", slots: [["Close-up (required)", "h"], ["Full length (required)", null], ["Side profile (optional)", "p"], ["Upper body (optional)", "t"]] },
  { name: "Q Management", method: "Online form", slots: [["Headshot", "h"], ["Full length", null], ["Profile", "p"], ["3/4 length", "t"]] },
  { name: "ONE Management", method: "Online form", slots: [["Full length", null], ["Waist up", "t"], ["Close-up", "h"], ["Profile", "p"]] },
  { name: "State Management", method: "Online form", slots: [["Close-up", "h"], ["Waist up", "t"], ["Full length", null], ["3/4 profile", "p"]] },
  { name: "Wilhelmina", method: "Online form", slots: [["Photo 1, headshot", "h"], ["Photo 2", "t"], ["Photo 3", "p"], ["Photo 4, full body", null]] },
  { name: "JAG Models", method: "Online form", slots: [["Full length", null], ["Close-up", "h"], ["Profile", "p"]] },
  { name: "Bicoastal Mgmt", method: "Online form", slots: [["Close-up", "h"], ["Full body", null], ["Side profile", "p"], ["Upper body", "t"]] },
  { name: "Muse Management", method: "Email", slots: [["Close-up, hair up", null], ["Close-up, hair down", "h"], ["Full length, head to toe", null]] },
];
const FRAME = { h: `${A}/still/headshot.jpg`, p: `${A}/still/profile.jpg`, t: `${A}/still/three.jpg`, b: `${A}/still/back.jpg` };

/* ── The four frames Guided Capture takes, as frame indices of the turn
      (158 frames, every 4th of a 25 fps, 25.2 s full turn). ──────────── */
const TURN_FRAMES = 158;
const CAPTURES = [
  { f: 6, slot: "Headshot", hint: "Face the lens. Chin level.", still: "headshot", guide: [190, 230, 36] },
  { f: 81, slot: "Back", hint: "Turn away from the lens.", still: "back", guide: [280, 520, 50] },
  { f: 122, slot: "Profile", hint: "Turn to your side. Shoulders square.", still: "profile", guide: [280, 520, 50] },
  { f: 153, slot: "Three-quarter", hint: "Face the lens. Arms relaxed.", still: "three", guide: [300, 560, 52] },
];
const NEXT = { slot: "Full length", hint: "Step back until your feet are in frame.", guide: [300, 700, 52] };

/* ── A frame sequence painted to canvas. Frame 1 first, then the rest in
      order; drawing always uses the nearest frame already decoded. ────── */
function sequence(dir, count, onFirst) {
  const imgs = new Array(count);
  const ready = new Uint8Array(count);
  let cancelled = false;
  const load = (i) =>
    new Promise((res) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => { ready[i] = 1; imgs[i] = im; res(); };
      im.onerror = () => res();
      im.src = `${dir}/${String(i + 1).padStart(3, "0")}.jpg`;
    });
  (async () => {
    await load(0);
    onFirst?.();
    // Load in waves so every region of the scrub has something early.
    const order = [];
    for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i);
    for (let k = 0; k < order.length && !cancelled; k += 6) {
      await Promise.all(order.slice(k, k + 6).map((i) => (ready[i] ? null : load(i))));
    }
  })();
  return {
    get(i) {
      i = ((Math.round(i) % count) + count) % count;
      if (ready[i]) return imgs[i];
      for (let d = 1; d < count; d++) {
        if (ready[(i + d) % count]) return imgs[(i + d) % count];
        if (ready[(i - d + count) % count]) return imgs[(i - d + count) % count];
      }
      return null;
    },
    stop() { cancelled = true; },
  };
}

function drawCover(ctx, img, x, y, w, h, focusX = 0.5, focusY = 0.5) {
  if (!img) return;
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s, dh = img.height * s;
  ctx.drawImage(img, x + (w - dw) * focusX, y + (h - dh) * focusY, dw, dh);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

/** Absolute offset of `el` inside `ancestor`, in unscaled layout px. */
function offsetIn(el, ancestor) {
  let x = 0, y = 0, n = el;
  while (n && n !== ancestor) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/* Phone art: public/calltime/phone/air-front.webp, 863 × 1559, screen at
   (25, 21) 503 × 1094 — measured off the owner's iPhone Air mockup. */
const PH = { w: 863, h: 1559, sx: 25 / 863, sy: 21 / 1559, sw: 503 / 863, sh: 1094 / 1559 };

export function mountTalent(root) {
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) root.classList.add("is-still");

  const today = new Date();
  let vw = window.innerWidth, vh = window.innerHeight;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const narrow = () => vw < 760;
  const cleanups = [];

  const progress = (el) => {
    const r = el.getBoundingClientRect();
    const total = r.height - vh;
    return { p: total > 0 ? clamp(-r.top / total) : 0, near: r.bottom > -vh * 0.5 && r.top < vh * 1.5 };
  };

  const scrollToP = (el, p) => {
    const top = el.getBoundingClientRect().top + window.scrollY + p * (el.offsetHeight - vh);
    window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  };

  /* ══ I. THE TURN ═════════════════════════════════════════════════════ */
  const turn = $("[data-turn]");
  const tc = $("[data-turn-canvas]");
  const tctx = tc.getContext("2d");
  const cam = $("[data-cam]");
  const camUI = $("[data-cam-ui]");
  const camSlot = $("[data-cam-slot]");
  const camHint = $("[data-cam-hint]");
  const camGuide = $("[data-cam-guide]");
  const camLast = $("[data-cam-last]");
  const camCount = $("[data-cam-count]");
  const camFlash = $("[data-cam-flash]");
  const camShutter = $("[data-cam-shutter]");
  const tPhone = $("[data-turn-phone]");
  const tWord = $("[data-turn-word]");
  const tAside = $("[data-turn-aside]");
  let turnDirty = true;
  const turnSeq = sequence(`${A}/turn`, TURN_FRAMES, () => { turnDirty = true; });

  let pointer = 0, pointerSmooth = 0;
  const onPointer = (e) => { pointer = (e.clientX / vw - 0.5) * 2; };
  window.addEventListener("pointermove", onPointer, { passive: true });
  cleanups.push(() => window.removeEventListener("pointermove", onPointer));

  let capStep = -1;
  let wordShown = "";
  const setWord = (text) => {
    if (text === wordShown) return;
    const dir = !wordShown || CAPTURES.findIndex((c) => c.slot === text) >= CAPTURES.findIndex((c) => c.slot === wordShown) ? 1 : -1;
    wordShown = text;
    const old = tWord.querySelector("span");
    const next = document.createElement("span");
    next.innerHTML = text === NEXT.slot ? `Full <em>length?</em>` : `${text}.`;
    tWord.appendChild(next);
    if (!still) {
      next.animate([{ transform: `translateY(${60 * dir}vh)` }, { transform: "translateY(0)" }], { duration: 900, easing: "cubic-bezier(.16,1,.3,1)" });
      if (old) {
        old.style.position = "absolute"; old.style.top = "0";
        old.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-70 * dir}vh)` }], { duration: 700, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" }).onfinish = () => old.remove();
      }
    } else old?.remove();
  };

  const setCapture = (step, forward) => {
    if (step === capStep) return;
    const prev = capStep;
    capStep = step;
    const next = CAPTURES[step + 1] || NEXT;
    camSlot.textContent = next.slot;
    camHint.textContent = next.hint;
    const [gw, gh, gt] = next.guide;
    camGuide.style.width = `${gw}px`; camGuide.style.height = `${gh}px`; camGuide.style.top = `${gt}%`;
    camCount.textContent = `${step + 1} / 5`;
    camLast.style.backgroundImage = step >= 0 ? `url(${FRAME[CAPTURES[step].still[0]]})` : "none";
    setWord(next.slot);
    if (forward && step > prev && !still) {
      camFlash.animate([{ opacity: 0.95 }, { opacity: 0 }], { duration: 420, easing: "ease-out" });
      camShutter.classList.add("is-down");
      setTimeout(() => camShutter.classList.remove("is-down"), 140);
    }
  };

  let turnGeo;
  const layoutTurn = () => {
    tc.width = Math.round(vw * dpr); tc.height = Math.round(vh * dpr);
    const n = narrow();
    const screenH = vh * (n ? 0.6 : 0.78);
    const screenW = screenH * (503 / 1094);
    const rigH = screenH / PH.sh, rigW = rigH * (PH.w / PH.h);
    const cx = n ? vw * 0.5 : vw * 0.63;
    const cy = n ? vh * 0.44 : vh * 0.53;
    const rigL = cx - (PH.sx + PH.sw / 2) * rigW;
    const rigT = cy - screenH / 2 - PH.sy * rigH;
    turnGeo = { screenW, screenH, rigW, rigL, rigT, cx, cy, R1: { x: cx - screenW / 2, y: cy - screenH / 2, w: screenW, h: screenH, r: screenW * 0.123 } };
    tPhone.style.width = `${rigW}px`;
    cam.style.left = `${turnGeo.R1.x}px`; cam.style.top = `${turnGeo.R1.y}px`;
    cam.style.width = `${screenW}px`; cam.style.height = `${screenH}px`;
    cam.style.borderRadius = `${turnGeo.R1.r}px`;
    camUI.style.transform = `scale(${screenW / 420})`;
    const avail = n ? vw - 32 : turnGeo.R1.x - Math.max(20, vw * 0.042) - 36;
    tWord.style.fontSize = `${Math.min(vw * (n ? 0.13 : 0.086), avail / 6.9)}px`;
    tAside.style.maxWidth = n ? '' : `${Math.max(220, avail)}px`;
    turnDirty = true;
  };


  let lastTurn = { p: -1, f: -1 };
  const renderTurn = (p, now) => {
    const g = turnGeo;
    // The window narrows to portrait first, then the whole frame pulls back
    // with the phone hugging it, so the bezel never floats inside the film.
    const wT = inOut(seg(p, 0.03, 0.16));
    const hT = inOut(seg(p, 0.03, 0.26));
    const d = hT;

    // Which frame: the pointer and a slow sway at rest, then the scroll's turn.
    // The first frame (the headshot) gets room: the turn holds, the lens
    // pushes in on her face, the shutter fires, then she starts to turn.
    pointerSmooth += (pointer - pointerSmooth) * 0.06;
    const sway = still ? 0 : Math.sin(now / 1700) * 3.2;
    const restF = (pointerSmooth * 13 + sway) * (1 - d);
    const f0 = CAPTURES[0].f;
    const a = seg(p, 0.27, 0.37), b = seg(p, 0.37, 0.9);
    const turnT = p > 0.27 ? 1 : 0;
    const f = turnT ? (b > 0 ? f0 + b * (TURN_FRAMES - 1 - f0) : a * f0) : restF;
    const zoom = 1 + 0.95 * (inOut(seg(p, 0.28, 0.345)) - inOut(seg(p, 0.375, 0.43)));

    if (turnDirty || Math.abs(p - lastTurn.p) > 1e-5 || Math.abs(f - lastTurn.f) > 0.05) {
      lastTurn = { p, f }; turnDirty = false;
      // On a phone the resting film takes the upper 60%, and the words sit
      // on velvet beneath it rather than across her.
      const h0 = narrow() ? vh * 0.6 : vh;
      const R = { x: 0, y: 0, w: lerp(vw, g.R1.w, wT), h: lerp(h0, g.R1.h, hT), r: lerp(0, g.R1.r, hT) };
      R.x = lerp(vw / 2, g.cx, hT) - R.w / 2;
      R.y = lerp(h0 / 2, g.cy, hT) - R.h / 2;
      turnGeo.R = R;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.fillStyle = "#050505";
      tctx.fillRect(0, 0, vw, vh);
      tctx.save();
      roundRect(tctx, R.x, R.y, R.w, R.h, R.r);
      tctx.clip();
      // On a wide stage she stands a little right of centre at rest so the
      // headline has the left; the offset closes as the window narrows.
      const fx = narrow() ? 0.5 : lerp(0.4, 0.5, wT);
      const zw = R.w * zoom, zh = R.h * zoom;
      drawCover(tctx, turnSeq.get(f), R.x - (zw - R.w) * 0.5, R.y - (zh - R.h) * 0.06, zw, zh, fx, 0.5);
      tctx.restore();
    }

    turn.dataset.headerClear = wT < 0.5 ? "cream" : "ink";

    // The phone is scaled so its screen is exactly the film's current height.
    const R = turnGeo.R || g.R1;
    const s = R.h / g.R1.h;
    tPhone.style.opacity = String(seg(p, 0.15, 0.19));
    tPhone.style.transform = `translate(${R.x + R.w / 2}px, ${R.y + R.h / 2}px) scale(${s}) translate(${g.rigL - g.cx}px, ${g.rigT - g.cy}px)`;
    cam.style.opacity = String(seg(p, 0.245, 0.275));

    const inCapture = p >= 0.26;
    tWord.style.visibility = inCapture ? "visible" : "hidden";
    tAside.style.opacity = String(seg(p, 0.27, 0.33) * (1 - seg(p, 0.93, 0.99)));
    const step = CAPTURES.reduce((k, c, i) => (turnT && (b > 0 || a >= 1) && f >= c.f - 0.01 ? i : k), -1);
    setCapture(step, true);
    if (inCapture && !wordShown) setWord(CAPTURES[0].slot);
    // The rig leaves upward at the end, so the Book arrives under it.
    const exit = inOut(seg(p, 0.93, 1));
    const lift = exit ? `translateY(${-exit * 12}vh)` : "";
    tc.style.transform = lift;
    tPhone.style.translate = exit ? `0 ${-exit * 12}vh` : "";
    cam.style.translate = exit ? `0 ${-exit * 12}vh` : "";
  };

  /* ══ II. THE BOOK ════════════════════════════════════════════════════ */
  const book = $("[data-book]");
  const app = $("[data-app]");
  const drops = $$("[data-drop]", app);
  const emptySlot = $("[data-empty]", app);
  const fresh = $("[data-fresh]", app);
  const bookBig = $(".book__big");
  const bookSmall = $(".book__small");
  ($("[data-reshoot]") || {}).textContent = monthYear(addDays(today, 90));
  let bookGeo;
  const layoutBook = () => {
    const slots = $$(".sheet__stage", app).map((el) => offsetIn(el, app));
    const fr = offsetIn(fresh, app);
    const appH = app.offsetHeight;
    const fit = Math.min((vw - 2 * Math.max(20, vw * 0.042)) / 1280, (vh * 0.8) / appH);
    const slotZoom = (vh * (narrow() ? 0.44 : 0.6)) / slots[0].h;
    const freshZoom = Math.min((vw * 0.86) / 560, 3.4);
    bookGeo = { slots, fr, appH, fit, slotZoom, freshZoom };
  };
  // Drop order follows the slot order; the full-length slot (index 3) has nothing to drop.
  const DROP_AT = [0.05, 0.14, 0.23, null, 0.36];
  const renderBook = (p) => {
    const g = bookGeo;
    const c = (s) => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 });
    const sc = g.slots.map(c);
    // Camera stops: [p, focusX, focusY, scale, screenX, screenY]
    const cy = narrow() ? 0.42 : 0.48;
    const stops = [
      [0.0, sc[0].x - 40, sc[0].y, g.slotZoom * 1.15, 0.5, cy],
      [0.06, sc[0].x, sc[0].y, g.slotZoom, 0.5, cy],
      [0.14, sc[1].x, sc[1].y, g.slotZoom, 0.5, cy],
      [0.23, sc[2].x, sc[2].y, g.slotZoom, 0.5, cy],
      [0.3, sc[3].x, sc[3].y, g.slotZoom, 0.5, cy],
      [0.36, sc[4].x, sc[4].y, g.slotZoom, 0.5, cy],
      [0.42, sc[4].x, sc[4].y, g.slotZoom * 0.92, 0.5, cy],
      [0.58, 640, g.appH / 2, g.fit, 0.5, 0.52],
      [0.64, 640, g.appH / 2, g.fit, 0.5, 0.52],
      [0.8, g.fr.x + 280, g.fr.y + g.fr.h / 2, g.freshZoom, 0.5, narrow() ? 0.3 : 0.34],
      [1.0, g.fr.x + 280, g.fr.y + g.fr.h / 2, g.freshZoom, 0.5, narrow() ? 0.3 : 0.34],
    ];
    let i = 0;
    while (i < stops.length - 2 && p > stops[i + 1][0]) i++;
    const a = stops[i], b = stops[i + 1];
    const t = inOut(seg(p, a[0], b[0]));
    const S = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), t));
    const fx = lerp(a[1], b[1], t), fy = lerp(a[2], b[2], t);
    const sx = lerp(a[4], b[4], t) * vw, sy = lerp(a[5], b[5], t) * vh;
    app.style.transform = `translate3d(${sx - fx * S}px, ${sy - fy * S}px, 0) scale(${S})`;

    drops.forEach((img, k) => {
      const at = DROP_AT[k < 3 ? k : k + 1];
      const tt = outExpo(seg(p, at - 0.045, at));
      img.style.transform = `translateY(${(1 - tt) * -104}%)`;
    });
    emptySlot.classList.toggle("is-flag", p > 0.3);

    const lt = outCubic(seg(p, 0.74, 0.88));
    bookBig.style.transform = `translateY(${(1 - lt) * 70}vh)`;
    bookSmall.style.transform = `translateY(${(1 - outCubic(seg(p, 0.77, 0.91))) * 70}vh)`;
  };

  /* ══ III. THE MARKET ═════════════════════════════════════════════════ */
  const mk = $("[data-mk]");
  const mkList = $("[data-mk-list]");
  const mkSet = $("[data-mk-set]");
  const mkVerdict = $("[data-mk-verdict]");
  mkList.innerHTML = "";
  tWord.innerHTML = "";
  const mkButtons = BRIEFS.map((b, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = b.name;
    btn.addEventListener("click", () => {
      if (still) showAgency(i);
      else scrollToP(mk, 0.06 + ((i + 0.5) / BRIEFS.length) * 0.88);
    });
    li.appendChild(btn);
    mkList.appendChild(li);
    return btn;
  });
  let agency = -1;
  const showAgency = (i) => {
    if (i === agency) return;
    agency = i;
    const b = BRIEFS[i];
    mkButtons.forEach((btn, k) => { btn.classList.toggle("is-on", k === i); btn.setAttribute("aria-pressed", String(k === i)); });
    mkSet.innerHTML = "";
    b.slots.forEach(([label, key], k) => {
      const d = document.createElement("div");
      d.className = `mk__slot${key ? "" : " mk__slot--miss"}`;
      d.style.animationDelay = `${k * 70}ms`;
      d.innerHTML = key
        ? `<div class="mk__frame"><img src="${FRAME[key]}" alt=""></div><span class="mk__lab">${label}</span>`
        : `<div class="mk__frame mk__frame--miss">Not in your set yet</div><span class="mk__lab">${label}</span>`;
      mkSet.appendChild(d);
    });
    const missing = b.slots.filter(([, k]) => !k).map(([l]) => l.replace(/ \((required|optional)\)/, ""));
    const ready = b.slots.length - missing.length;
    mkVerdict.innerHTML = `${ready} of ${b.slots.length} ready. <b>Still needed: ${missing.join(", ").replace(/, ([^,]*)$/, " and $1")}.</b><small>Applications: ${b.method.toLowerCase()}</small>`;
  };
  const renderMk = (p) => showAgency(Math.min(BRIEFS.length - 1, Math.floor(seg(p, 0.06, 0.94) * BRIEFS.length)));

  /* ══ IV. SILENCE ═════════════════════════════════════════════════════ */
  const wt = $("[data-wt]");
  const wc = $("[data-wt-canvas]");
  const wctx = wc.getContext("2d");
  const wH = $("[data-wt-h]");
  const wNum = $("[data-wt-num]");
  const wDay = $("[data-wt-day]");
  const trk = $("[data-trk]");
  const trkLabel = $("[data-trk-label]");
  const trkNext = $("[data-trk-next]");
  const wClose = $("[data-wt-close]");
  const WAIT_FRAMES = 94;
  let waitDirty = true;
  const waitSeq = sequence(`${A}/wait`, WAIT_FRAMES, () => { waitDirty = true; });
  const closesOn = longDate(addDays(today, 30));
  const reopens = longDate(addMonths(today, 6));
  let lastWait = -1, dayShown = 0;
  const layoutWait = () => { wc.width = Math.round(vw * dpr); wc.height = Math.round(vh * dpr); waitDirty = true; };
  const renderWait = (p) => {
    const f = p * (WAIT_FRAMES - 1);
    if (waitDirty || Math.abs(f - lastWait) > 0.2) {
      lastWait = f; waitDirty = false;
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const push = 1 + p * 0.08;
      const w = vw * push, h = vh * push;
      drawCover(wctx, waitSeq.get(f), (vw - w) * 0.35, (vh - h) * 0.5, w, h, narrow() ? 0.3 : 0.5, 0.5);
    }
    const day = 1 + Math.floor(seg(p, 0.1, 0.68) * 29);
    if (day !== dayShown) { dayShown = day; wNum.textContent = String(day); }
    const closed = day >= 30;
    trk.classList.toggle("is-closed", closed);
    trkLabel.textContent = closed ? "No response" : "Awaiting reply";
    trkNext.textContent = closed
      ? `Industry convention says treat this as a pass. Re-apply window opens ${reopens}.`
      : `Their review window runs to ${closesOn}. Nothing is expected of you until then.`;
    const out = inOut(seg(p, 0.72, 0.82));
    wH.style.transform = `translateY(${-out * 60}vh)`;
    const inn = outCubic(seg(p, 0.78, 0.92));
    wClose.style.opacity = String(seg(p, 0.78, 0.84));
    wClose.style.transform = `translateY(${(1 - inn) * 40}vh)`;
    trk.style.transform = `translateY(${(1 - outCubic(seg(p, 0.04, 0.16))) * 50}vh)`;
    wDay.style.opacity = String(seg(p, 0.06, 0.12));
  };

  /* ══ V. THE CARD ═════════════════════════════════════════════════════ */
  const wl = $("[data-wl]");
  const rig = $("[data-wl-rig]");
  const ios = $("[data-ios]");
  const iosScale = $("[data-ios-scale]");
  const sheet = $("[data-ios-sheet]");
  const pass = $("[data-pass]");
  const det = $("[data-ios-det]");
  const addBtn = $("[data-ios-addbtn]");
  const hint = $("[data-wl-hint]");
  const wlAdd = $("[data-wl-add]");
  ($("[data-today]") || {}).textContent = longDate(today);
  const P_ADD = 0.44, P_DET = 0.72, P_BACK = 0.52;
  wlAdd.addEventListener("click", () => scrollToP(wl, still ? 0 : 0.3));
  $("[data-ios-addbtn]").addEventListener("click", () => scrollToP(wl, P_ADD));
  $("[data-ios-cancel]").addEventListener("click", () => scrollToP(wl, 0));
  pass.addEventListener("click", () => {
    const { p } = progress(wl);
    if (still) { det.style.transform = "translateY(0)"; return; }
    scrollToP(wl, p < 0.38 ? P_ADD : P_DET);
  });
  $("[data-ios-done]").addEventListener("click", () => {
    if (still) { det.style.transform = ""; return; }
    scrollToP(wl, P_BACK);
  });
  let wlGeo;
  const layoutWl = () => {
    const n = narrow();
    const rigH = vh * (n ? 1.05 : 1.24);
    const rigW = rigH * (PH.w / PH.h);
    const cx = n ? vw * 0.5 : vw * 0.7;
    const left = cx - (PH.sx + PH.sw / 2) * rigW;
    const top = n ? vh * 0.5 : vh * 0.06;
    wlGeo = { rigW, rigH, left, top };
    rig.style.width = `${rigW}px`;
    iosScale.style.transform = `scale(${(rigW * PH.sw) / 420})`;
    hint.style.left = `${Math.max(16, left - 150)}px`;
    hint.style.top = `${top + rigH * 0.3}px`;
  };
  const renderWl = (p) => {
    const g = wlGeo;
    const rise = outCubic(seg(p, 0.06, 0.26));
    const exit = inOut(seg(p, 0.9, 1));
    rig.style.transform = `translate3d(${g.left}px, ${g.top + (1 - rise) * vh * 1.05 + exit * vh * 0.2}px, 0)`;

    // Add sheet → Wallet. The pass is one object throughout.
    const add = inOut(seg(p, 0.37, 0.47));
    ios.classList.toggle("is-sheet", add < 0.5);
    addBtn.classList.toggle("is-press", p > 0.34 && p < 0.39);
    sheet.style.transform = `translateY(${add * 105}%)`;
    const passTop = lerp(56 + 58 + 34, 118, add);
    const passScale = lerp(0.9, 1, add);
    pass.style.transform = `translate3d(0, ${passTop}px, 0) scale(${passScale})`;
    pass.style.transformOrigin = "50% 0";
    const dt = inOut(seg(p, 0.6, 0.72));
    det.style.transform = `translateY(${(1 - dt) * 105}%)`;
    hint.style.opacity = String(seg(p, 0.48, 0.52) * (1 - seg(p, 0.58, 0.61)));
    wlAdd.style.opacity = String(1 - seg(p, 0.3, 0.38));
    wlAdd.style.pointerEvents = p > 0.34 ? "none" : "";
  };

  /* ══ VI. EVERYONE ════════════════════════════════════════════════════ */
  const cl = $("[data-cl]");
  const cols = $$(".cl__col", cl);
  const vids = $$("video", cl);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        if (!still) v.play().catch(() => {});
      } else v.pause();
    }
  }, { rootMargin: "20% 0px" });
  vids.forEach((v) => io.observe(v));
  cleanups.push(() => io.disconnect());
  const renderCl = (p) => {
    const k = [-1, 1.4, -0.7];
    cols.forEach((c, i) => { c.style.transform = `translate3d(0, ${(p - 0.5) * k[i] * 34}vh, 0)`; });
  };

  /* ══ layout + loop ═══════════════════════════════════════════════════ */
  const layout = () => {
    vw = window.innerWidth; vh = window.innerHeight;
    layoutTurn(); layoutBook(); layoutWait(); layoutWl();
  };
  layout();
  const onResize = () => { layout(); frame(performance.now(), true); };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));

  const scenes = [
    [turn, renderTurn],
    [book, renderBook],
    [mk, renderMk],
    [wt, renderWait],
    [wl, renderWl],
    [cl, renderCl],
  ];

  const STILL_P = new Map([[turn, 0], [book, 1], [mk, 0], [wt, 1], [wl, 0.5], [cl, 0.5]]);
  let raf = 0;
  function frame(now, force) {
    for (const [el, render] of scenes) {
      if (still) { render(STILL_P.get(el), now); continue; }
      const { p, near } = progress(el);
      if (near || force) render(p, now);
    }
  }
  if (still) {
    frame(0, true);
    // Frame sequences arrive late; paint again once they have.
    const t = setInterval(() => frame(0, true), 500);
    setTimeout(() => clearInterval(t), 6000);
    cleanups.push(() => clearInterval(t));
  } else {
    const loop = (now) => { frame(now); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
  }

  return () => {
    cancelAnimationFrame(raf);
    turnSeq.stop(); waitSeq.stop();
    cleanups.forEach((f) => f());
  };
}
