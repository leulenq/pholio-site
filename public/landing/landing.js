/*
 * Pholio, the landing: hero, intelligence, comp card. One take.
 *
 *   a dark room   Ola, seated, and her whole library of photographs hanging
 *                 in depth around her, drifting toward you. Your pointer is
 *                 the key light: it relights her, catches the wordmark in
 *                 gold, and pulls photographs out of the dark where it falls.
 *   the library   scroll and the camera flies: she rises and passes the lens,
 *                 and you travel through everything she has shot.
 *   understood    the flight stops on a wall. Every frame finds its place by
 *                 what it is, a reading light crosses it, and three frames
 *                 come forward to show what Pholio sees in each.
 *   composed      Pholio reasons across the wall: only fronts stay lit, then
 *                 three, then one. The one lifts out and the card is built
 *                 around it, its back made from the frames that complement
 *                 it. Then other heroes, other cards. Same library.
 *
 * Canvas for everything photographic (depth-sorted, relit), DOM for type and
 * for the cards (true 3D turns, crisp at any size). One rAF; no scroll
 * listeners for motion; nothing fetched (file:// works).
 */
(() => {
  "use strict";

  const LIB = window.LIB;
  const SEQ = window.SEQ;
  const HEADS = window.HEADS;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s) => document.querySelector(s);
  const canvas = $("#stage");
  const ctx = canvas.getContext("2d");
  const fig = document.createElement("canvas");
  fig.width = 970;
  fig.height = 1640;
  const fctx = fig.getContext("2d");

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (v, a, b) => clamp((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const io = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = (t) => 1 - Math.pow(1 - t, 3);
  const out5 = (t) => 1 - Math.pow(1 - t, 5);
  const inq = (t) => t * t * t;
  const rnd = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const mixR = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

  /* ── the timeline, in viewport heights of scroll ─────────────────────── */
  const T = {
    heroOut: [0.12, 0.5],
    rise: [1.0, 2.1],
    walk: [2.1, 3.1],
    flight: [0.45, 3.0],
    markPass: [0.95, 1.8],
    figPass: [2.0, 3.15],
    bring: [0.95, 1.35, 2.6, 3.0],
    wall: [3.1, 4.05],
    read: [4.0, 4.45, 5.75, 5.98],
    sweep: [4.35, 5.55],
    focus: [[5.95, 6.85], [6.85, 7.75], [7.75, 8.65]],
    compose: [8.7, 9.1, 9.7, 10.0],
    reason: [[8.8, 9.05], [9.1, 9.3], [9.32, 9.5]],
    heroFly: [9.5, 10.15],
    name: [10.2, 10.75],
    front: [10.45, 10.8, 11.25, 11.5],
    backFly: [10.75, 11.35],
    flip: [11.35, 12.05],
    back: [11.8, 12.15, 12.55, 12.8],
    unflip: [12.55, 13.05],
    dir: [13.15, 13.55],
    toRow: [13.15, 13.75],
    ed: 13.45,
    edStep: 0.36,
    fall: [13.5, 14.4],
    end: [14.75, 15.1],
    total: 16.2,
  };

  /* ── state ───────────────────────────────────────────────────────────── */
  let W = 0;
  let H = 0;
  let DPR = 1;
  let narrow = false;
  let S = 0;
  let started = 0;
  const pointer = { x: 0, y: 0, has: false };
  const cam = { x: 0, y: 0 };
  const light = { x: -200, y: 200 };

  /* ── assets ──────────────────────────────────────────────────────────── */
  const seqImgs = SEQ.map((n) => {
    const im = new Image();
    im.decoding = "async";
    im.dataset.src = `../hero/seq/seq-${String(n).padStart(3, "0")}.webp`;
    return im;
  });
  const libImgs = {};
  LIB.forEach((it) => {
    const im = new Image();
    im.decoding = "async";
    im.dataset.src = `../home/library/${it.id}.webp`;
    libImgs[it.id] = im;
  });

  /* ── the library's objects ───────────────────────────────────────────── */
  const SHOTS = [
    ["headshot", "Headshot"],
    ["half_body", "Half body"],
    ["three_quarter", "Three-quarter"],
    ["full_length", "Full length"],
    ["profile", "Profile"],
    ["back", "Back"],
    ["detail", "Detail"],
  ];
  const items = LIB.map((it, i) => {
    const side = i % 2 ? 1 : -1;
    return {
      ...it,
      i,
      img: libImgs[it.id],
      sx: side * (0.34 + rnd(i * 3 + 1) * 1.15),
      sy: (rnd(i * 5 + 2) - 0.5) * 1.9,
      sz: rnd(i * 7 + 3),
      sh: 0.2 + rnd(i * 11 + 4) * 0.18,
      rot: (rnd(i * 13 + 5) - 0.5) * 0.1,
      g: SHOTS.findIndex((s) => s[0] === it.shot),
    };
  });
  /** The stream is denser than the library: each frame passes more than once. */
  const ghosts = [];
  for (let c = 1; c <= 2; c++) {
    items.forEach((it, i) => {
      const n = i + c * 100;
      const side = n % 2 ? 1 : -1;
      ghosts.push({ ...it, ghost: true, sx: side * (0.3 + rnd(n * 3 + 1) * 1.3), sy: (rnd(n * 5 + 2) - 0.5) * 2.1, sz: rnd(n * 7 + 3), sh: 0.18 + rnd(n * 11 + 4) * 0.22, rot: (rnd(n * 13 + 5) - 0.5) * 0.12 });
    });
  }
  const byId = Object.fromEntries(items.map((it) => [it.p, it]));
  const HERO = items.find((it) => it.role === "hero");
  const BACKS = items.filter((it) => it.role === "back");
  const CANDIDATES = [HERO, byId[876], byId[1215]];
  const EDITIONS = ["cutout", "night", "strip"].map((r) => items.find((it) => it.role === r));

  /** The three frames read up close, with what is measured in each. */
  const FOCUS = [
    {
      it: byId[1235],
      box: [0.33, 0.12, 0.74, 0.5],
      mark: { label: "EYE LINE", y: 0.29 },
      rows: [["Shot", "Headshot"], ["Style", "Beauty"], ["Setting", "Studio, red seamless"], ["Frame", "Eye line in the upper third"]],
    },
    {
      it: byId[876],
      box: [0.358, 0.044, 0.678, 0.931],
      lines: [["CROWN", 0.044], ["FEET", 0.931]],
      rows: [["Shot", "Full length"], ["Style", "Editorial"], ["Setting", "Studio"], ["Frame", "Head to toe, feet in"]],
    },
    {
      it: byId[805],
      box: [0.4, 0.06, 0.86, 0.99],
      rows: [["Shot", "Profile"], ["Style", "Editorial"], ["Orientation", "Landscape"], ["Frame", "Side of face, clean line"]],
    },
  ];

  /* ── layout ──────────────────────────────────────────────────────────── */
  let WALL = [];
  let LABELS = [];
  let CARD = { x: 0, y: 0, w: 0, h: 0 };
  let ROW = [];

  function layout() {
    W = innerWidth;
    H = innerHeight;
    narrow = W < 760;
    PH = narrow ? Math.min(H, W * 1.15) : H;
    DPR = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    document.getElementById("track").style.height = `${T.total * 100}vh`;

    // The wall: her library in the order of what each frame is.
    const top = narrow ? 0.27 * H : 0.24 * H;
    const bottom = H - (narrow ? 0.05 : 0.06) * H;
    const left = narrow ? 14 : 0.045 * W;
    const right = W - left;
    const ordered = [];
    SHOTS.forEach((s, g) => items.filter((it) => it.g === g).forEach((it) => ordered.push(it)));
    const labelH = narrow ? 14 : 20;
    const gap = narrow ? 4 : 7;
    const gGap = narrow ? 12 : 26;
    let h = (narrow ? 0.085 : 0.15) * H;
    for (let tries = 0; tries < 40; tries++) {
      let x = left;
      let y = top + labelH;
      let lastG = -1;
      const rects = [];
      const labels = [];
      ordered.forEach((it) => {
        const w = h * it.a;
        const newG = it.g !== lastG;
        if (newG && lastG >= 0) x += gGap;
        if (x + w > right) {
          x = left;
          y += h + gap + labelH;
        }
        if (newG) labels.push({ g: it.g, x, y: y - 6 });
        rects[it.i] = { x, y, w, h };
        x += w + gap;
        lastG = it.g;
      });
      if (y + h <= bottom) {
        // Centre the block in its band.
        const slack = (bottom - (y + h)) / 2;
        rects.forEach((r) => r && (r.y += slack));
        labels.forEach((l) => (l.y += slack));
        WALL = rects;
        LABELS = labels;
        break;
      }
      h *= 0.95;
    }

    const ch = narrow ? Math.min(0.6 * H, (0.78 * W) / 0.647) : 0.7 * H;
    CARD = { w: ch * 0.647, h: ch, x: W / 2 - (ch * 0.647) / 2, y: H / 2 - ch / 2 + (narrow ? -0.02 * H : 0.02 * H) };

    // The row of four.
    ROW = [];
    if (narrow) {
      const rh = Math.min(0.28 * H, ((W - 3 * 18) / 2) / 0.647);
      const rw = rh * 0.647;
      const y0 = 0.21 * H;
      for (let k = 0; k < 4; k++) {
        const col = k % 2;
        const row = Math.floor(k / 2);
        ROW.push({ w: rw, h: rh, x: W / 2 + (col ? 9 : -9 - rw), y: y0 + row * (rh + 40) });
      }
    } else {
      const rh = Math.min(0.5 * H, ((0.86 * W) / 4 - 30) / 0.647);
      const rw = rh * 0.647;
      const span = 4 * rw + 3 * Math.max(30, 0.035 * W);
      const g = (span - 4 * rw) / 3;
      for (let k = 0; k < 4; k++) ROW.push({ w: rw, h: rh, x: W / 2 - span / 2 + k * (rw + g), y: 0.56 * H - rh / 2 });
    }
  }

  /* ── projection ──────────────────────────────────────────────────────── */
  const F = 1100;
  /** Photo scale reference: the frame's height, or on a portrait frame less. */
  let PH = 1;
  function project(x, y, z) {
    const s = F / (F - z);
    return { x: W / 2 + (x - cam.x) * s, y: H / 2 + (y - cam.y) * s, s };
  }

  /* ── the key light ───────────────────────────────────────────────────── */
  function paintFigure(im, lx, ly, lr, k) {
    fctx.globalCompositeOperation = "source-over";
    fctx.clearRect(0, 0, 970, 1640);
    fctx.drawImage(im, 0, 0, 970, 1640);
    if (k <= 0.001) return;
    const shade = fctx.createRadialGradient(lx, ly, 0, lx, ly, lr * 1.7);
    const floor = Math.round(255 * (1 - 0.64 * k));
    shade.addColorStop(0, "rgb(255,255,255)");
    shade.addColorStop(0.3, "rgb(255,251,246)");
    shade.addColorStop(1, `rgb(${floor},${floor - 4},${floor - 10})`);
    fctx.globalCompositeOperation = "multiply";
    fctx.fillStyle = shade;
    fctx.fillRect(0, 0, 970, 1640);
    const warm = fctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    warm.addColorStop(0, `rgba(255,224,180,${0.95 * k})`);
    warm.addColorStop(0.5, `rgba(236,198,140,${0.4 * k})`);
    warm.addColorStop(1, "rgba(201,165,90,0)");
    fctx.globalCompositeOperation = "soft-light";
    fctx.fillStyle = warm;
    fctx.fillRect(0, 0, 970, 1640);
    fctx.globalCompositeOperation = "destination-in";
    fctx.drawImage(im, 0, 0, 970, 1640);
    fctx.globalCompositeOperation = "source-over";
  }

  /* ── drawing a photograph ────────────────────────────────────────────── */
  function drawPhoto(it, r, bright, alpha = 1, rot = 0, outline = 0) {
    const im = it.img;
    if (!im.complete || !im.naturalWidth || alpha <= 0.002 || r.w < 1) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
    if (rot) ctx.rotate(rot);
    // cover-fit the photograph into the rect
    const ia = im.naturalWidth / im.naturalHeight;
    const ra = r.w / r.h;
    let sw = im.naturalWidth;
    let sh = im.naturalHeight;
    let sx = 0;
    let sy = 0;
    if (ia > ra) {
      sw = sh * ra;
      sx = (im.naturalWidth - sw) / 2;
    } else {
      sh = sw / ra;
      sy = (im.naturalHeight - sh) * 0.3;
    }
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = Math.min(40, r.h * 0.12);
    ctx.shadowOffsetY = Math.min(24, r.h * 0.06);
    ctx.drawImage(im, sx, sy, sw, sh, -r.w / 2, -r.h / 2, r.w, r.h);
    ctx.shadowColor = "transparent";
    if (bright < 0.999) {
      ctx.fillStyle = `rgba(5,5,5,${(1 - bright).toFixed(3)})`;
      ctx.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
    }
    if (outline > 0.01) {
      ctx.strokeStyle = `rgba(227,196,134,${outline.toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-r.w / 2 - 3, -r.h / 2 - 3, r.w + 6, r.h + 6);
    }
    ctx.restore();
  }

  /* ── type helpers (DOM) ──────────────────────────────────────────────── */
  function line(el, a, b, c, d) {
    const parts = el.querySelectorAll(".m > span");
    const vis = S > a - 0.05 && S < d + 0.05;
    el.style.visibility = vis ? "visible" : "hidden";
    if (!vis) return;
    parts.forEach((p, k) => {
      const lag = k * 0.07;
      const tin = out5(seg(S, a + lag, b + lag));
      const tout = inq(seg(S, c + lag * 0.6, d + lag * 0.6));
      p.style.transform = `translateY(${(1 - tin) * 110 - tout * 110}%)`;
    });
  }
  function side(el, a, b, c, d, dir) {
    const tin = out(seg(S, a, b));
    const tout = inq(seg(S, c, d));
    el.style.opacity = (tin * (1 - tout)).toFixed(3);
    el.style.transform = `translate(${dir * ((1 - tin) * 40 + tout * -30)}px, -50%)`;
  }

  /* ── cards (DOM) ─────────────────────────────────────────────────────── */
  const leadEl = $("#lead");
  const leadIn = $("#leadIn");
  const leadName = $("#leadName");
  const leadShades = leadEl.querySelectorAll(".face__shade");
  const leadLabel = $("#leadLabel");
  const edEls = [...document.querySelectorAll(".card.ed")];
  edEls.forEach((el, k) => {
    el.querySelector("[data-photo]").src = `../home/library/${EDITIONS[k].id}.webp`;
  });
  function place(el, r) {
    el.style.width = `${r.w}px`;
    el.style.height = `${r.h}px`;
    el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
  }
  function turn(inner, shades, deg, lift = 0, tilt = 0) {
    inner.style.transform = `translateZ(${lift}px) rotateX(${tilt}deg) rotateY(${deg}deg)`;
    const shade = 0.5 * (1 - Math.abs(Math.cos((deg * Math.PI) / 180)));
    shades.forEach((s) => (s.style.opacity = shade.toFixed(3)));
  }

  /* ── readout (DOM) ───────────────────────────────────────────────────── */
  const readout = $("#readout");
  let readoutFor = -1;
  function setReadout(k) {
    if (readoutFor === k) return;
    readoutFor = k;
    readout.innerHTML = k < 0 ? "" : FOCUS[k].rows.map(([a, b]) => `<div class="ro__row"><span class="ro__k">${a}</span><span class="ro__v">${b}</span></div>`).join("");
  }

  /* ── one frame ───────────────────────────────────────────────────────── */
  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const target = scrollY / H;
    S = reduce ? target : S + (target - S) * (1 - Math.exp(-dt / 0.13));
    // Reduced motion: no drift, no rush, no sweep; scroll still tells the story.
    const time = reduce ? 100 : (now - started) / 1000;

    // camera and light follow the hand, with weight
    const px = pointer.has ? pointer.x / W - 0.5 : 0;
    const py = pointer.has ? pointer.y / H - 0.5 : 0;
    const kc = 1 - Math.exp(-dt / 0.6);
    cam.x += (px * W * 0.07 - cam.x) * kc;
    cam.y += (py * H * 0.05 - cam.y) * kc;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, W, H);

    /* ── where she is ── */
    const rise = io(seg(S, ...T.rise));
    const walk = seg(S, ...T.walk);
    let idx;
    if (S < T.rise[0]) {
      const ping = reduce ? 0 : (time * 3) % 22;
      idx = Math.round(ping < 11 ? ping : 22 - ping);
    } else if (S < T.walk[0]) idx = Math.round(11 + rise * 48);
    else idx = Math.round(59 + walk * 31);
    idx = clamp(idx, 0, SEQ.length - 1);
    while (idx > 0 && !(seqImgs[idx].complete && seqImgs[idx].naturalWidth)) idx--;
    const figPass = io(seg(S, ...T.figPass));
    const fz = figPass * 820;
    const fx = -figPass * W * 0.5;
    const figH = narrow ? 0.8 * H : 1.14 * H;
    const fp = project(fx, H / 2, fz);
    const fh = figH * fp.s;
    const fw = fh * (970 / 1640);
    const figRect = { x: fp.x - fw / 2, y: fp.y - fh, w: fw, h: fh };
    const figAlpha = 1 - seg(fz, 520, 760);

    /* ── the light ── */
    const head = HEADS[idx] || [0.45, 0.12];
    const face = { x: figRect.x + head[0] * fw, y: figRect.y + head[1] * fh };
    const sweep = out(clamp((time - 0.2) / 2.6));
    const rest = { x: face.x - 0.17 * W, y: face.y - 0.05 * H };
    let want = { x: lerp(-0.3 * W, rest.x, sweep), y: lerp(rest.y - 0.15 * H, rest.y, sweep) };
    if (pointer.has && sweep >= 1) want = { x: pointer.x, y: pointer.y };
    const toFace = seg(S, 0.95, 1.8);
    want = { x: lerp(want.x, face.x - 0.12 * fh, toFace), y: lerp(want.y, face.y - 0.06 * fh, toFace) };
    const kl = sweep < 1 ? 1 : 1 - Math.exp(-dt / 0.28);
    light.x += (want.x - light.x) * kl;
    light.y += (want.y - light.y) * kl;
    const lightK = 0;
    const LR = Math.max(W, H) * 0.34;

    /* ── the field ── */
    const flight = io(seg(S, ...T.flight));
    // An opening rush that settles, then the slow drift; the flight on scroll.
    const rush = 3200 * (1 - out(clamp(time / 2.8)));
    const drift = (reduce ? 0 : time * 55) + rush + flight * 11000;
    const ambient = 0.18 + 0.5 * seg(S, 0.6, 1.6);
    // The library is out of shot until the camera dives through the page.
    const fieldIn = seg(S, 0.5, 1.0);
    const L = 6000;
    const draws = [];

    const wallT0 = T.wall[0];
    // Ghosts: stream only, gone before the wall forms.
    const ghostA = (0.25 + 0.75 * seg(S, 1.3, 2.2)) * (1 - seg(S, wallT0 - 0.2, wallT0 + 0.35));
    if (ghostA > 0.003) {
      ghosts.forEach((it) => {
        const zr = (((it.sz * L + drift) % L) + L) % L;
        const z = -5300 + zr;
        const p = project(it.sx * W, it.sy * H * 0.5, z);
        const h0 = it.sh * PH * p.s;
        const r = { x: p.x - (h0 * it.a) / 2, y: p.y - h0 / 2, w: h0 * it.a, h: h0 };
        const fog = seg(z, -5300, -3600) * (1 - seg(z, 380, 620));
        const d = Math.hypot(p.x - light.x, p.y - light.y);
        const lit = Math.exp(-Math.pow(d / LR, 2)) * lightK;
        const bright = clamp(ambient + (1 - ambient) * lit) * lerp(0.35, 1, seg(z, -4500, -800));
        draws.push({ kind: "photo", it, r, bright, alpha: fog * ghostA * fieldIn, rot: it.rot, depth: z, outline: 0 });
      });
    }
    items.forEach((it) => {
      // the stream rect (projected) ...
      const zr = (((it.sz * L + drift) % L) + L) % L;
      const z = -5300 + zr;
      const wx = it.sx * W;
      const wy = it.sy * H * 0.5;
      const p = project(wx, wy, z);
      const h0 = it.sh * PH * p.s;
      const sr = { x: p.x - (h0 * it.a) / 2, y: p.y - h0 / 2, w: h0 * it.a, h: h0 };
      const fog = seg(z, -5300, -3600) * (1 - seg(z, 380, 620));
      const d = Math.hypot(p.x - light.x, p.y - light.y);
      const lit = Math.exp(-Math.pow(d / LR, 2)) * lightK;
      let bright = clamp(ambient + (1 - ambient) * lit) * lerp(0.35, 1, seg(z, -4500, -800));
      let alpha = fog * fieldIn;
      let r = sr;
      let rot = it.rot;
      let depth = z;
      let outline = 0;

      // ... settling onto the wall, group by group
      const wt = io(seg(S, wallT0 + it.g * 0.075 + (it.i % 7) * 0.012, wallT0 + it.g * 0.075 + (it.i % 7) * 0.012 + 0.6));
      if (wt > 0 && WALL[it.i]) {
        r = mixR(sr, WALL[it.i], wt);
        alpha = lerp(fog * fieldIn, 1, wt);
        rot = lerp(rot, 0, wt);
        depth = lerp(z, 2000, wt);
        // read by the light that crosses the wall
        const sx = lerp(-0.15 * W, W + 260, seg(S, ...T.sweep));
        const read = clamp((sx - (WALL[it.i].x + WALL[it.i].w / 2)) / 140);
        const unread = 0.2;
        bright = lerp(bright, unread + (1 - unread) * read, wt);
        outline = read > 0 && read < 1 ? Math.sin(read * Math.PI) * 0.9 : 0;
      }

      // reasoning across it: fronts, then three, then one
      const r1 = io(seg(S, ...T.reason[0]));
      const r2 = io(seg(S, ...T.reason[1]));
      const r3 = io(seg(S, ...T.reason[2]));
      const isFront = it.shot === "full_length" || it.shot === "three_quarter";
      const isCand = CANDIDATES.includes(it);
      let dim = 1;
      if (!isFront) dim *= lerp(1, 0.16, r1);
      if (isFront && !isCand) dim *= lerp(1, 0.22, r2);
      if (isCand && it !== HERO) dim *= lerp(1, 0.3, r3);
      bright *= dim;
      if (isCand) outline = Math.max(outline, 0.85 * r2 * (it === HERO ? 1 : 1 - r3));

      // focus: three frames come forward to be read
      FOCUS.forEach((f, k) => {
        const [a, b] = T.focus[k];
        const tin = io(seg(S, a, a + 0.24));
        const tout = io(seg(S, b - 0.22, b));
        const live = S > a - 0.3 && S < b + 0.3;
        if (live) {
          if (f.it === it) {
            const fr = focusRect(it);
            r = mixR(r, fr, tin * (1 - tout));
            depth = 4000 + k;
            bright = lerp(bright, 1, tin * (1 - tout));
            outline = 0;
          } else {
            bright *= lerp(1, 0.1, tin * (1 - tout));
          }
        }
      });

      // the hero lifts out and becomes the card
      if (it === HERO) {
        const t = io(seg(S, ...T.heroFly));
        if (t > 0) {
          r = mixR(r, CARD, t);
          depth = 5000;
          bright = lerp(bright, 1, t);
          outline *= 1 - t;
        }
        if (S >= T.heroFly[1] + 0.03) alpha = 0;
      }
      // the back's frames leave the wall and go behind the card
      const bi = BACKS.indexOf(it);
      if (bi >= 0) {
        const a = T.backFly[0] + bi * 0.08;
        const t = io(seg(S, a, a + 0.42));
        if (t > 0) {
          const behind = { x: CARD.x + CARD.w * 0.1, y: CARD.y + CARD.h * 0.1, w: CARD.w * 0.8, h: CARD.h * 0.8 };
          r = mixR(r, behind, t);
          depth = 4500 + bi;
          bright = lerp(bright, 1, t);
          rot = lerp(0, (bi - 1.5) * 0.06, Math.sin(t * Math.PI));
          if (t >= 1) alpha = 0;
        }
      }
      // other heroes, other cards
      const ek = EDITIONS.indexOf(it);
      if (ek >= 0) {
        const a = T.ed + ek * T.edStep;
        const t = io(seg(S, a, a + 0.45));
        if (t > 0) {
          r = mixR(r, ROW[ek + 1], t);
          depth = 5000 + ek;
          bright = lerp(bright, 1, t);
          outline *= 1 - t;
          rot = 0;
        }
        if (S >= a + 0.47) alpha = 0;
      }
      // the rest of the library falls away
      if (it !== HERO && bi < 0 && ek < 0) {
        const t = inq(seg(S, T.fall[0] + (WALL[it.i] ? WALL[it.i].x / W : 0) * 0.3, T.fall[1]));
        if (t > 0) r = { ...r, y: r.y + t * (H * 1.15 - r.y) };
      }
      // in the composing, the wall is the room around the card
      bright *= lerp(1, 0.55, seg(S, 9.6, 10.2));

      draws.push({ kind: "photo", it, r, bright, alpha, rot, depth, outline });
    });

    // the wordmark, hung in depth behind her, passing the lens on the way in
    const mp = io(seg(S, ...T.markPass));
    const mz = lerp(-420, 1000, mp);


    draws.sort((a, b) => a.depth - b.depth);
    for (const d of draws) {
      if (d.kind === "photo") drawPhoto(d.it, d.r, d.bright, d.alpha, d.rot, d.outline);
      else if (d.kind === "mark") drawMark(d.z);
      else if (d.kind === "fig" && figAlpha > 0.002) {
        const im = seqImgs[idx];
        if (im.complete && im.naturalWidth) {
          const sc = 970 / fw;
          paintFigure(im, (light.x - figRect.x) * sc, (light.y - figRect.y) * sc, LR * 0.85 * sc, lightK * 0.95);
          ctx.globalAlpha = figAlpha;
          ctx.drawImage(fig, figRect.x, figRect.y, fw, fh);
          ctx.globalAlpha = 1;
        }
      }
    }

    // the light's spill on the dark, in the hero
    if (lightK > 0.01) {
      const g = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, LR * 1.4);
      g.addColorStop(0, `rgba(201,165,90,${0.1 * lightK})`);
      g.addColorStop(1, "rgba(201,165,90,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }

    drawWallLabels();
    drawFocusMarks();
    drawSweep();
    domFrame();
  }

  function focusRect(it) {
    if (narrow) {
      const h = it.a > 1 ? (0.86 * W) / it.a : 0.44 * H;
      const w = h * it.a;
      return { x: W / 2 - w / 2, y: 0.1 * H, w, h };
    }
    let h = 0.74 * H;
    let w = h * it.a;
    if (w > 0.5 * W) {
      w = 0.5 * W;
      h = w / it.a;
    }
    return { x: 0.08 * W, y: (H - h) / 2 + 0.02 * H, w, h };
  }

  function drawMark(z) {
    const p = project(0, -0.16 * H, z);
    const size = (narrow ? 0.29 : 0.39) * W * p.s;
    if (size > W * 3) return;
    const a = (1 - seg(z, 600, 950)) * 0.92;
    if (a <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = `300 ${size}px "Noto Serif Display", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const lk = 1 - seg(S, 0.95, 1.6);
    const g = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, Math.max(W, H) * 0.3);
    g.addColorStop(0, lk > 0.05 ? "#e7c47e" : "#efe9df");
    g.addColorStop(0.45, lk > 0.05 ? "#d9bf8c" : "#efe9df");
    g.addColorStop(1, "#e9e3d8");
    ctx.fillStyle = g;
    ctx.fillText("PHOLIO", p.x, p.y + size * 0.36);
    ctx.restore();
  }

  function focusAmount() {
    let m = 0;
    T.focus.forEach(([a, b]) => (m = Math.max(m, io(seg(S, a, a + 0.24)) * (1 - io(seg(S, b - 0.22, b))))));
    return m;
  }

  function drawWallLabels() {
    const a = seg(S, T.sweep[0], T.sweep[0] + 0.2) * (1 - seg(S, T.reason[0][0], T.reason[0][1])) * (1 - focusAmount());
    if (a <= 0.01) return;
    const sx = lerp(-0.15 * W, W + 260, seg(S, ...T.sweep));
    ctx.save();
    ctx.font = `500 ${narrow ? 8 : 10}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "alphabetic";
    LABELS.forEach((l) => {
      const shown = clamp((sx - l.x) / 120);
      if (shown <= 0) return;
      const n = items.filter((it) => it.g === l.g).length;
      const name = SHOTS[l.g][1].toUpperCase().split("").join(String.fromCharCode(8202));
      ctx.globalAlpha = a * shown;
      ctx.fillStyle = "rgba(250,247,242,0.82)";
      ctx.fillText(name, l.x, l.y);
      const w = ctx.measureText(name).width;
      ctx.fillStyle = "#c9a55a";
      ctx.fillText(String(n), l.x + w + 8, l.y);
    });
    ctx.restore();
  }

  function drawSweep() {
    const t = seg(S, ...T.sweep);
    if (t <= 0 || t >= 1) return;
    const sx = lerp(-0.15 * W, W + 260, t);
    const g = ctx.createLinearGradient(sx - 160, 0, sx + 40, 0);
    g.addColorStop(0, "rgba(201,165,90,0)");
    g.addColorStop(0.8, "rgba(227,196,134,0.10)");
    g.addColorStop(1, "rgba(227,196,134,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(sx - 160, 0, 200, H);
    ctx.globalCompositeOperation = "source-over";
  }

  function drawFocusMarks() {
    FOCUS.forEach((f, k) => {
      const [a, b] = T.focus[k];
      const p = seg(S, a + 0.22, a + 0.55) * (1 - seg(S, b - 0.3, b - 0.22));
      if (p <= 0) return;
      const r = focusRect(f.it);
      const [x0, y0, x1, y1] = f.box;
      const bx = r.x + x0 * r.w;
      const by = r.y + y0 * r.h;
      const bw = (x1 - x0) * r.w;
      const bh = (y1 - y0) * r.h;
      ctx.save();
      ctx.strokeStyle = `rgba(227,196,134,${0.95 * p})`;
      ctx.lineWidth = 1.5;
      const c = Math.min(bw, bh) * 0.12 * out(p);
      // corner marks drawn from the corners out
      [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(x + sx * c, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + sy * c);
        ctx.stroke();
      });
      ctx.font = `500 ${narrow ? 8 : 10}px "JetBrains Mono", monospace`;
      ctx.fillStyle = `rgba(227,196,134,${p})`;
      (f.lines || []).forEach(([label, y]) => {
        const ly = r.y + y * r.h;
        const len = (r.w + 26) * out(p);
        ctx.beginPath();
        ctx.moveTo(r.x - 26, ly);
        ctx.lineTo(r.x - 26 + len, ly);
        ctx.stroke();
        if (!narrow) ctx.fillText(label, r.x + r.w + 10, ly + 3);
      });
      if (f.mark) {
        const ly = r.y + f.mark.y * r.h;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(bx - 12, ly);
        ctx.lineTo(bx - 12 + (bw + 24) * out(p), ly);
        ctx.stroke();
        ctx.setLineDash([]);
        if (!narrow) ctx.fillText(f.mark.label, bx + bw + 18, ly + 3);
      }
      ctx.restore();
    });
  }

  /* ── the DOM half of the frame ───────────────────────────────────────── */
  const nav = $("#nav");
  function domFrame() {
    const ho = io(seg(S, ...T.heroOut));
    const intro = out(clamp((performance.now() - started - 900) / 1400));
    nav.style.opacity = (intro * (1 - ho)).toFixed(3);
    nav.style.transform = `translateY(${-ho * 40}px)`;
    bookFrame(intro);

    line($("#lBring"), ...T.bring);
    line($("#lRead"), ...T.read);
    line($("#lCompose"), ...T.compose);
    line($("#lDir"), T.dir[0], T.dir[1], 99, 99);
    side($("#lFront"), ...T.front, -1);
    side($("#lBack"), ...T.back, 1);

    // the reading of one frame
    let fk = -1;
    T.focus.forEach(([a, b], k) => S > a + 0.18 && S < b - 0.2 && (fk = k));
    setReadout(fk);
    if (fk >= 0) {
      const [a, b] = T.focus[fk];
      const r = focusRect(FOCUS[fk].it);
      readout.style.opacity = "1";
      const left = narrow ? 18 : Math.min(r.x + r.w + 0.07 * W, W - Math.min(0.34 * W, 460) - 0.04 * W);
      const top = narrow ? r.y + r.h + 22 : r.y + r.h * 0.18;
      readout.style.transform = `translate(${left}px, ${top}px)`;
      readout.querySelectorAll(".ro__row").forEach((row, k) => {
        const t = out(seg(S, a + 0.2 + k * 0.05, a + 0.36 + k * 0.05)) * (1 - seg(S, b - 0.32, b - 0.22));
        row.style.opacity = t.toFixed(3);
        row.style.transform = `translateY(${(1 - t) * 14}px)`;
      });
    } else readout.style.opacity = "0";

    // the lead card
    const shown = S >= T.heroFly[1];
    leadEl.style.visibility = shown ? "visible" : "hidden";
    if (shown) {
      const toRow = io(seg(S, ...T.toRow));
      place(leadEl, mixR(CARD, ROW[0], toRow));
      const n = io(seg(S, ...T.name));
      leadName.style.transform = `translateX(${(1 - n) * 104}%)`;
      const f = io(seg(S, ...T.flip));
      const u = io(seg(S, ...T.unflip));
      const deg = -180 * f - 180 * u;
      const lift = Math.sin(f * Math.PI) * 90 + Math.sin(u * Math.PI) * 50;
      const tilt = Math.sin(f * Math.PI) * 7 + Math.sin(u * Math.PI) * 4;
      turn(leadIn, leadShades, deg, lift, tilt);
      const la = seg(S, T.toRow[1], T.toRow[1] + 0.25);
      leadLabel.style.opacity = la.toFixed(3);
      const r0 = ROW[0];
      leadLabel.style.transform = `translate(${r0.x + r0.w / 2 - 120}px, ${r0.y + r0.h + 14}px)`;
    } else leadLabel.style.opacity = "0";

    edEls.forEach((el, k) => {
      const a = T.ed + k * T.edStep;
      const on = S >= a + 0.45;
      el.style.visibility = on ? "visible" : "hidden";
      if (!on) return;
      place(el, ROW[k + 1]);
      const t = io(seg(S, a + 0.5, a + 0.95));
      turn(el.querySelector(".card__in"), el.querySelectorAll(".face__shade"), 180 * t, Math.sin(t * Math.PI) * 60, Math.sin(t * Math.PI) * 5);
      el.querySelector(".ed__l").style.opacity = seg(S, a + 0.9, a + 1.1).toFixed(3);
    });

    const end = $("#end");
    const e = out(seg(S, ...T.end));
    end.style.opacity = e.toFixed(3);
    end.style.transform = `translateY(${(1 - e) * 20}px)`;
  }


  /* ── the hero: her book, opened ──────────────────────────────────────── *
   * Eight spreads of her real work, each a pair from one sitting. On
   * arrival the book riffles open and comes to rest on the colonnade. Then
   * the hand is the riffle: sweep across and the pages turn under it (drag
   * on touch); left alone it turns a page now and then. Scroll and the
   * camera dives into the page, into everything she has shot.
   */
  const SPREADS = [
    [["0", "50% 30%"], ["3", "50% 30%"]],
    [["1235", "50% 22%"], ["1237", "50% 26%"]],
    [["871", "50% 30%"], ["872", "50% 26%"]],
    [["55", "50% 26%"], ["71", "50% 24%"]],
    [["795", "50% 30%"], ["797", "50% 30%"]],
    [["1065", "50% 30%"], ["1073", "50% 30%"]],
    [["876", "50% 22%"], ["870", "50% 34%"]],
    [["1218", "50% 26%"], ["1217", "50% 40%"]],
  ];
  const NS = SPREADS.length;
  const pageImgs = SPREADS.flat().map(([id]) => {
    const im = new Image();
    im.decoding = "async";
    im.dataset.src = `book/${id}.jpg`;
    return im;
  });
  const bookEl = $("#book");
  const bookIn = $("#bookIn");
  const bookType = $("#bookType");
  const pgL = bookEl.querySelector(".pg--l");
  const pgR = bookEl.querySelector(".pg--r");
  const leaf = $("#leaf");
  const leafF = leaf.querySelector(".leaf__f");
  const leafB = leaf.querySelector(".leaf__b");
  const mod = (k) => ((k % NS) + NS) % NS;
  const setPage = (el, k, side) => {
    const [id, pos] = SPREADS[mod(k)][side];
    const img = el.querySelector("img");
    const src = `book/${id}.jpg`;
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    img.style.objectPosition = pos;
  };
  const book = { cur: 0, flip: null, queue: [], idleAt: 0, opened: false, target: null, lastX: null };
  // The riffle: fast through the book, slowing onto the colonnade.
  const RIFFLE = [0.95, 0.42, 0.3, 0.26, 0.26, 0.3, 0.42, 1.05];
  function startFlip(dir, dur) {
    const k = book.cur;
    const n = mod(k + dir);
    book.flip = { dir, dur, t: 0, from: k, to: n };
    if (narrow) {
      if (dir > 0) {
        setPage(pgR, n, 1);
        setPage(leafF, k, 1);
      } else {
        setPage(pgR, k, 1);
        setPage(leafF, n, 1);
      }
      leaf.classList.remove("is-back");
    } else if (dir > 0) {
      setPage(pgL, k, 0);
      setPage(pgR, n, 1);
      setPage(leafF, k, 1);
      setPage(leafB, n, 0);
      leaf.classList.remove("is-back");
    } else {
      setPage(pgL, n, 0);
      setPage(pgR, k, 1);
      setPage(leafF, k, 0);
      setPage(leafB, n, 1);
      leaf.classList.add("is-back");
    }
    leaf.style.visibility = "visible";
  }
  function settle(k) {
    setPage(pgL, k, 0);
    setPage(pgR, k, 1);
    leaf.style.visibility = "hidden";
    pgL.querySelector(".pg__shade").style.opacity = "0";
    pgR.querySelector(".pg__shade").style.opacity = "0";
  }
  settle(0);
  let bookLast = performance.now();
  function bookFrame(intro) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - bookLast) / 1000);
    bookLast = now;

    // arrival: the riffle, once the veil has lifted
    if (!book.opened && started && $("#ld").classList.contains("is-done")) {
      book.opened = true;
      if (!reduce) {
        book.queue = RIFFLE.slice(0, NS - 1).map((d, i) => [1, i === NS - 2 ? 1.05 : d]);
      } else {
        book.cur = NS - 1;
        settle(book.cur);
      }
      book.idleAt = now + 7000;
    }

    // the hand
    if (book.opened && !book.queue.length && !book.flip && !reduce) {
      if (now > book.idleAt && S < 0.1) {
        startFlip(1, 1.2);
        book.target = null;
        book.idleAt = now + 5200;
      }
    }
    if (!book.flip && book.queue.length) {
      const [dir, dur] = book.queue.shift();
      startFlip(dir, dur);
    }

    if (book.flip) {
      const f = book.flip;
      f.t = Math.min(1, f.t + dt / f.dur);
      // A page leaves slowly, falls fast, lands soft.
      const e = f.t < 0.5 ? 2 * f.t * f.t : 1 - Math.pow(-2 * f.t + 2, 2.4) / 2;
      let deg;
      if (narrow) deg = f.dir > 0 ? -180 * e : -180 * (1 - e);
      else deg = f.dir > 0 ? -180 * e : 180 * e;
      const lift = Math.sin(e * Math.PI);
      leaf.style.transform = `rotateY(${deg}deg) translateZ(${lift * 2}px)`;
      const cos = Math.abs(Math.cos((deg * Math.PI) / 180));
      leafF.querySelector(".pg__shade").style.opacity = ((1 - cos) * 0.55 * (Math.abs(deg) < 90 ? 1 : 0)).toFixed(3);
      leafB.querySelector(".pg__shade").style.opacity = ((1 - cos) * 0.45).toFixed(3);
      // the page beneath falls into the leaf's shadow, then out of it
      const under = narrow || f.dir > 0 ? pgR : pgL;
      under.querySelector(".pg__shade").style.opacity = (0.5 * Math.max(0, 1 - Math.abs(deg) / 180) * (narrow && f.dir < 0 ? 0 : 1)).toFixed(3);
      const other = f.dir > 0 ? pgL : pgR;
      if (!narrow) other.querySelector(".pg__shade").style.opacity = (0.4 * Math.max(0, Math.abs(deg) / 180 - 0.5) * 2 * (1 - f.t)).toFixed(3);
      if (f.t >= 1) {
        book.cur = f.to;
        book.flip = null;
        settle(book.cur);
      }
    }

    // the dive: scroll pushes the camera into the open page
    const dive = io(seg(S, 0.15, 1.2));
    bookIn.style.transform = `scale(${1 + dive * 2.4})`;
    bookEl.style.opacity = (1 - seg(S, 0.7, 1.15)).toFixed(3);
    bookEl.style.visibility = S > 1.2 ? "hidden" : "visible";
    const ty = io(seg(S, 0.05, 0.5));
    bookType.style.opacity = (intro * (1 - ty)).toFixed(3);
    bookType.style.transform = `translateY(${(1 - intro) * 30 + ty * 80}px)`;
  }
  // The riffle is in the movement, not the position: each sweep of a tenth
  // of the frame turns one page, in the direction of the hand.
  let handAcc = 0;
  let handX = null;
  const onHand = (x) => {
    if (handX === null) handX = x;
    const dx = x - handX;
    handX = x;
    if (!book.opened || reduce || book.queue.length > 1 || S > 0.2) return;
    handAcc += dx;
    if (Math.abs(handAcc) > W / 10) {
      book.queue.push([Math.sign(handAcc), 0.38]);
      handAcc = 0;
      book.idleAt = performance.now() + 7000;
    }
  };
  addEventListener("pointermove", (e) => e.pointerType !== "touch" && onHand(e.clientX), { passive: true });
  let touchX = null;
  addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  addEventListener("touchmove", (e) => {
    if (touchX === null || book.flip) return;
    const dx = e.touches[0].clientX - touchX;
    if (Math.abs(dx) > 40) {
      book.target = null;
      book.queue.push([dx < 0 ? 1 : -1, 0.5]);
      book.idleAt = performance.now() + 7000;
      touchX = e.touches[0].clientX;
    }
  }, { passive: true });

  /* ── boot ────────────────────────────────────────────────────────────── */
  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.has = true;
  }, { passive: true });
  addEventListener("resize", layout);

  function load(list, onEach) {
    return Promise.all(list.map((im) => new Promise((res) => {
      im.onload = im.onerror = () => {
        onEach();
        res();
      };
      im.src = im.dataset.src;
    })));
  }

  function boot() {
    layout();
    const all = [...pageImgs, ...Object.values(libImgs)];
    let n = 0;
    const ldn = $("#ldn");
    const tick = () => {
      n++;
      ldn.textContent = String(Math.round((n / all.length) * 100)).padStart(3, "0");
    };
    // The opening needs her first frames and the wordmark's face; the rest
    // streams behind the veil and after it.
    const opening = pageImgs;
    const rest = all.filter((im) => !opening.includes(im));
    Promise.all([
      load(opening, tick),
      document.fonts ? document.fonts.load('300 100px "Noto Serif Display"') : Promise.resolve(),
      new Promise((r) => setTimeout(r, 700)),
    ]).then(() => {
      load(rest, tick).then(() => (ldn.textContent = "100"));
      const veil = () => {
        $("#ld").classList.add("is-done");
        started = performance.now();
      };
      // Hold the veil until most of the library is in, or 3.5s, whichever first.
      const until = performance.now() + 3500;
      const wait = () => (n / all.length > 0.8 || performance.now() > until ? veil() : setTimeout(wait, 80));
      wait();
    });
    started = performance.now();
    requestAnimationFrame(frame);
  }
  boot();
})();
