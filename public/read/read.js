/* Pholio · "Be read right."
   One canvas, one scroll timeline. Hero → split → the read → book → clock → silence. */
(() => {
  "use strict";

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IW = 970, IH = 1640;           // source frame space
  const MID = 680 / 970;               // mid-res scale
  const N = 127;
  const $ = (id) => document.getElementById(id);
  const Q = new URLSearchParams(location.search);
  const DBG = { intro: Q.has("intro") ? +Q.get("intro") : null, p: Q.has("p") ? +Q.get("p") : null, px: Q.has("px") ? +Q.get("px") : null };

  // scene boundaries, in viewport heights of scroll
  const H_END = 1.7, SPLIT_END = 2.9, READ_END = 5.0, BOOK_END = 7.5, CLOCK_END = 9.8, CODA_END = 11.6;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const inout = (t) => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const seg = (v, a, b) => clamp((v - a) / (b - a));
  const fade = (v, a, b, e = .18) => Math.min(seg(v, a, a + e), 1 - seg(v, b - e, b));
  const lr = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

  // ── assets ──────────────────────────────────────────────────────────
  let meta = [];
  const mid = new Array(N), hi = {};
  const HI_SET = [35, 95, 97, 99, 103, 107, ...Array.from({ length: 12 }, (_, i) => 42 + i)];
  const BOOK = [
    { src: "book/u84.jpg", fy: .18, a: 1800 / 2700, l1: "EDITORIAL · BOOK", l2: "STYLED · STUDIO SET" },
    { src: "book/u222.jpg", fy: .24, a: 1800 / 2700, l1: "LIFESTYLE · BOOK", l2: "DAYLIGHT · ON LOCATION" },
    { src: "book/u9.jpg", fy: .42, a: 1800 / 2700, l1: "COMMERCIAL · BOOK", l2: "STREET · ENVIRONMENTAL" },
    { src: "book/u3.jpg", fy: .28, a: 1800 / 2250, l1: "BEAUTY · BOOK", l2: "STYLED MAKEUP · WARM KEY" },
  ];

  const loadImg = (src) => new Promise((res) => {
    const im = new Image(); im.decoding = "async";
    im.onload = () => res(im); im.onerror = () => res(null); im.src = src;
  });

  // ── cards (the digitals set) ───────────────────────────────────────
  const CARDS = [
    { f: 35, crop: [163, 15, 520, 650], l1: "HEADSHOT", l2: "DIGITALS · NATURAL", face: true,
      sheet: [["FRAME", "HEADSHOT"], ["USE", "DIGITALS"], ["BACKDROP", "PLAIN"], ["STYLING", "NATURAL"], ["MAKEUP", "MINIMAL"]] },
    { f: 95, l1: "FULL LENGTH", l2: "DIGITALS · FRONT", face: true,
      sheet: [["FRAME", "FULL LENGTH"], ["POSE", "FRONT"], ["USE", "DIGITALS"], ["BACKDROP", "PLAIN"], ["WARDROBE", "FITTED, BLACK"]] },
    { f: 97, l1: "THREE-QUARTER", l2: "DIGITALS", face: true,
      sheet: [["FRAME", "FULL LENGTH"], ["POSE", "THREE-QUARTER"], ["USE", "DIGITALS"], ["BACKDROP", "PLAIN"], ["LIGHT", "SOFT"]] },
    { f: 99, l1: "PROFILE", l2: "DIGITALS", face: true,
      sheet: [["FRAME", "FULL LENGTH"], ["POSE", "PROFILE"], ["USE", "DIGITALS"], ["BACKDROP", "PLAIN"], ["LIGHT", "SOFT"]] },
    { f: 103, l1: "BACK", l2: "DIGITALS", face: false,
      sheet: [["FRAME", "FULL LENGTH"], ["POSE", "BACK"], ["USE", "DIGITALS"], ["BACKDROP", "PLAIN"], ["HAIR", "DOWN, UNSTYLED"]] },
    { f: 107, l1: "IN MOTION", l2: "NOT A DIGITAL", face: true, reject: true,
      sheet: [["FRAME", "FULL LENGTH"], ["POSE", "TURNING"], ["HAIR", "IN MOTION"], ["USE", "SET ASIDE"]] },
  ];

  // ── canvas ─────────────────────────────────────────────────────────
  const cv = $("stage"), ctx = cv.getContext("2d");
  let vw = 0, vh = 0, dpr = 1, narrow = false, gut = 16;
  function resize() {
    vw = innerWidth; vh = innerHeight;
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr);
    cv.style.height = vh + "px";
    narrow = vw / vh < .8;
    gut = clamp(vw * .034, 16, 56);
    $("track").style.height = (CODA_END + 1) * vh + "px";
  }

  // ── input ──────────────────────────────────────────────────────────
  const ptr = { x: -1e4, y: -1e4, px: 0, amp: 0, dir: 1, seen: false, used: false };
  addEventListener("pointermove", (e) => {
    if (ptr.seen) {
      const dx = e.clientX - ptr.x;
      ptr.amp = clamp(ptr.amp + Math.abs(dx) / (vw * .09), 0, 1);
      if (Math.abs(dx) > 1) ptr.dir = Math.sign(dx);
    }
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.seen = true;
  }, { passive: true });
  addEventListener("pointerleave", () => { ptr.seen = false; });

  let target = 0, p = 0;
  const readScroll = () => { target = scrollY / Math.max(1, vh); };
  addEventListener("scroll", readScroll, { passive: true });
  addEventListener("resize", () => { resize(); readScroll(); });

  // ── drawing helpers ────────────────────────────────────────────────
  const img = (i, preferHi) => (preferHi && hi[i]) || mid[i] || hi[i];
  function drawSrc(i, sx, sy, sw, sh, dx, dy, dw, dh, preferHi) {
    const im = img(i, preferHi); if (!im) return;
    const k = im === mid[i] ? MID : 1;
    ctx.drawImage(im, sx * k, sy * k, sw * k, sh * k, dx, dy, dw, dh);
  }
  const drawFull = (i, R, preferHi) => drawSrc(i, 0, 0, IW, IH, R.x, R.y, R.w, R.h, preferHi);

  function heroRect(t) {
    const k0 = narrow ? .78 : 1.04, k1 = narrow ? .62 : .84;
    const h = vh * lerp(k0, k1, t), w = h * IW / IH;
    const y0 = narrow ? vh * .99 - h : vh * 1.02 - h;
    return { x: vw / 2 - w / 2, y: lerp(y0, narrow ? vh * .2 : vh * .1, t), w, h };
  }

  // grid of card rects
  function rowLayout(n, cy = .58, maxH = .52) {
    const cols = narrow ? 3 : n, rows = Math.ceil(n / cols);
    const gap = Math.max(10, vw * .013);
    const W = vw - gut * 2;
    let cw = (W - gap * (cols - 1)) / cols;
    const rowGap = 46;
    cw = Math.min(cw, (vh * maxH - rowGap * (rows - 1)) / rows / 1.4);
    const ch = cw * 1.4;
    const totalH = rows * ch + (rows - 1) * rowGap;
    const top = vh * cy - totalH / 2;
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const inRow = Math.min(cols, n - r * cols);
      const rowW = inRow * cw + (inRow - 1) * gap;
      out.push({ x: vw / 2 - rowW / 2 + c * (cw + gap), y: top + r * (ch + rowGap), w: cw, h: ch });
    }
    return out;
  }
  function stripLayout(n) {
    const ch = Math.min(vh * .15, narrow ? vw * .2 : 1e4), cw = ch / 1.4, gap = 8;
    const W = n * cw + (n - 1) * gap;
    const y = vh - gut - ch - 30;
    return Array.from({ length: n }, (_, i) => ({ x: vw / 2 - W / 2 + i * (cw + gap), y, w: cw, h: ch }));
  }

  // how a card's frame sits inside its rect
  function cardFit(card, R) {
    if (card.crop) {
      const [cx, cy, cw, ch] = card.crop;
      const s = Math.max(R.w / cw, R.h / ch);
      return { src: card.crop, D: { x: R.x + R.w / 2 - cw * s / 2, y: R.y + R.h / 2 - ch * s / 2, w: cw * s, h: ch * s }, s, bb: null };
    }
    const bb = meta[card.f].bb, bh = bb[3] - bb[1];
    const s = (R.h * .84) / bh;
    const bcx = (bb[0] + bb[2]) / 2;
    const D = { x: R.x + R.w / 2 - bcx * s, y: R.y + R.h * .95 - bb[3] * s, w: IW * s, h: IH * s };
    return { src: [0, 0, IW, IH], D, s, bb };
  }

  function cardBg(R, a) {
    if (a <= 0) return;
    ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, R.y, 0, R.y + R.h);
    g.addColorStop(0, "#f6f1e9"); g.addColorStop(.72, "#efe8dd"); g.addColorStop(1, "#e6ded1");
    ctx.fillStyle = g; ctx.fillRect(R.x, R.y, R.w, R.h);
    ctx.globalAlpha = 1;
  }
  function contactShadow(x, y, w, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(1, .16);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
    g.addColorStop(0, "rgba(40,30,18,.42)"); g.addColorStop(1, "rgba(40,30,18,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, w, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  // age 0..1 → the photograph drifting away from today
  function ageOverlay(R, a) {
    if (a <= .001) return;
    ctx.save();
    ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = clamp(a * 1.1);
    ctx.fillStyle = "#808080"; ctx.fillRect(R.x, R.y, R.w, R.h);
    ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a * .55;
    ctx.fillStyle = "#e6d3ad"; ctx.fillRect(R.x, R.y, R.w, R.h);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = a * .5;
    ctx.fillStyle = "#efe7d9"; ctx.fillRect(R.x, R.y, R.w, R.h);
    ctx.restore();
  }

  function drawCard(card, R, o = {}) {
    const { bg = 1, alpha = 1, age = 0, fit = cardFit(card, R), frame = card.f } = o;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    if (alpha < 1) { ctx.globalAlpha = 1; }
    const prevA = alpha;
    ctx.globalAlpha = prevA;
    cardBg(R, bg * prevA);
    if (fit.bb) contactShadow(fit.D.x + (fit.bb[0] + fit.bb[2]) / 2 * fit.s, fit.D.y + fit.bb[3] * fit.s, (fit.bb[2] - fit.bb[0]) * fit.s * .62, bg * prevA);
    ctx.globalAlpha = prevA;
    const [sx, sy, sw, sh] = fit.src;
    drawSrc(frame, sx, sy, sw, sh, fit.D.x, fit.D.y, fit.D.w, fit.D.h, true);
    ageOverlay(R, age * prevA);
    ctx.restore();
  }

  function mono(text, x, y, color, align = "left", size = 10.5) {
    ctx.font = `400 ${size}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "1.4px";
    ctx.fillText(text, x, y);
  }
  const typed = (s, t) => s.slice(0, Math.round(s.length * clamp(t)));

  // ── state ──────────────────────────────────────────────────────────
  let introT = RM ? 1 : 0, introStart = 0, ready = false, last = performance.now();
  const els = {
    glow: $("glow"), be: $("hBe"), read: $("hRead"), right: $("hRight"),
    tRead: $("tRead"), tFace: $("tFace"), tBook: $("tBook"),
    clock: $("clock"), cDay: $("cDay"), cState: $("cState"), cDates: $("cDates"), cKeep: $("cKeep"),
    coda: $("coda"), cdSent: $("cdSent"), cdDay: $("cdDay"), cdLine: $("cdLine"),
    hudTr: $("hudTr"), hudBl: $("hudBl"), hudBr: $("hudBr"),
  };
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase().replace("SEPT", "SEP");
  const SHOT = new Date(Date.UTC(2026, 9, 1));

  // ── HERO ───────────────────────────────────────────────────────────
  function idleIndex(t) {
    if (RM) return 46;
    return 47.5 + Math.sin(t * .0009) * 3.5;
  }

  function drawHero(now) {
    const hp = seg(p, 0, H_END);
    const R = heroRect(ease(hp));
    const sc = R.h / IH;
    // base frame: idle → poses → turn → front
    const idle = idleIndex(now);
    const base = hp <= 0 ? idle : lerp(idle, 126, inout(seg(hp, 0, .96)));

    const wave = introT < 1;
    const brush = !RM && ptr.amp > .015 && p < H_END + .2;

    if (!wave && !brush) {
      const f0 = Math.floor(base), fr = base - f0;
      drawFull(f0, R, true);
      if (fr > .02 && f0 + 1 < N) { ctx.globalAlpha = fr; drawFull(f0 + 1, R, true); ctx.globalAlpha = 1; }
      els.hudBl.textContent = "FRAME " + String(meta[Math.round(base)].n).padStart(3, "0");
      return;
    }

    // slit-scan: every strip of her is its own moment
    const strip = Math.max(3, Math.round(vw / 360));
    const ix0 = 40, ix1 = 930;
    const x0 = R.x + ix0 * sc, x1 = R.x + ix1 * sc;
    const cx = R.x + R.w / 2;
    const head = lerp(-2, 46 + 26, inout(introT) * .7 + introT * .3);
    const radius = Math.max(110, vw * .15);
    let under = Math.round(base);
    const half = radius * Math.pow(ptr.amp, .7);
    for (let x = x0; x < x1; x += strip) {
      const mx = x + strip / 2;
      let f;
      if (wave) {
        const xn = Math.abs(mx - cx) / (R.w * .42);
        f = Math.min(46, head - 26 * xn);
        if (f < 0) continue;
      } else {
        const d = (mx - ptr.x) / half;
        if (Math.abs(d) <= 1) f = clamp(94 + (ptr.x / vw) * 32 + d * ptr.dir * 4, 94, 126);
        else f = base;
        if (Math.abs(mx - ptr.x) < strip) under = Math.round(f);
      }
      const fi = clamp(Math.round(f), 0, N - 1);
      const sx = (x - R.x) / sc;
      drawSrc(fi, sx, 0, strip / sc + .6, IH, x, R.y, strip + .6, R.h, false);
    }
    if (!wave && half > 4) {
      ctx.fillStyle = `rgba(201,165,90,${.8 * Math.min(1, ptr.amp * 2)})`;
      ctx.fillRect(ptr.x - half, R.y + R.h * .03, 1, R.h);
      ctx.fillRect(ptr.x + half, R.y + R.h * .03, 1, R.h);
    }
    if (wave) {
      // gold seams at the edge of the reveal
      const front = head / 26 * R.w * .42;
      const a = 1 - ease(introT);
      if (front > 2) {
        ctx.fillStyle = `rgba(201,165,90,${.85 * a})`;
        ctx.fillRect(cx - front, R.y + R.h * .02, 1, R.h);
        ctx.fillRect(cx + front, R.y + R.h * .02, 1, R.h);
      }
    }
    els.hudBl.textContent = "FRAME " + String(meta[clamp(under, 0, N - 1)].n).padStart(3, "0");
  }

  // ── SPLIT: one body becomes six moments ────────────────────────────
  function drawSplit() {
    const s = seg(p, H_END, SPLIT_END);
    const R = heroRect(1), sc = R.h / IH;
    const L = rowLayout(6, .52);
    const bb = meta[126].bb;
    const sl0 = bb[0] - 10, slw = (bb[2] - bb[0] + 20) / 6;
    CARDS.forEach((card, i) => {
      const k = inout(seg(s, .08 + i * .03, .78 + i * .03));
      const clip0 = { x: R.x + (sl0 + i * slw) * sc, y: R.y, w: slw * sc + .5, h: R.h };
      const clip = lr(clip0, L[i], k);
      const k2 = inout(seg(k, .3, 1));
      const switched = k > .22;
      const fit = cardFit(card, L[i]);
      const src = [0, 0, IW, IH].map((v, j) => lerp(v, fit.src[j], switched ? k2 : 0));
      const D = {
        x: clip.x + lerp(R.x - clip0.x, fit.D.x - L[i].x, k2),
        y: clip.y + lerp(R.y - clip0.y, fit.D.y - L[i].y, k2),
        w: lerp(R.w * src[2] / IW, fit.D.w, k2),
        h: lerp(R.h * src[3] / IH, fit.D.h, k2),
      };
      if (!switched || !card.crop) { D.w = lerp(R.w, fit.D.w, k2); D.h = lerp(R.h, fit.D.h, k2); }
      ctx.save();
      ctx.beginPath(); ctx.rect(clip.x, clip.y, clip.w, clip.h); ctx.clip();
      cardBg(clip, seg(k, .45, .7));
      if (fit.bb) {
        const ss = D.w / IW;
        contactShadow(D.x + (fit.bb[0] + fit.bb[2]) / 2 * ss, D.y + fit.bb[3] * ss, (fit.bb[2] - fit.bb[0]) * ss * .62, seg(k, .5, 1));
      }
      drawSrc(switched ? card.f : 126, src[0], src[1], src[2], src[3], D.x, D.y, D.w, D.h, true);
      ctx.restore();
      // a gold seam marks each cut while the body is still whole
      const seam = Math.sin(Math.PI * seg(s, .0, .3)) * (1 - k);
      if (seam > .01) {
        ctx.fillStyle = `rgba(201,165,90,${.85 * seam})`;
        ctx.fillRect(clip.x, clip.y, 1, clip.h);
        if (i === CARDS.length - 1) ctx.fillRect(clip.x + clip.w, clip.y, 1, clip.h);
      }
    });
  }

  // ── THE READ ───────────────────────────────────────────────────────
  let hoverCard = -1;
  function readLayout(s) {
    const L6 = rowLayout(6, .52), L5 = rowLayout(5, .54);
    const rj = ease(seg(s, .76, .88)), close = inout(seg(s, .84, 1));
    return CARDS.map((c, i) => {
      if (c.reject) return { R: { ...L6[i], y: L6[i].y + rj * vh * .35 }, a: 1 - rj, rj };
      return { R: lr(L6[i], L5[i], close), a: 1, rj: 0 };
    });
  }
  function faceBand(card, R) {
    const fit = cardFit(card, R);
    if (!card.face) return null;
    if (card.crop) return [R.y + R.h * .06, R.y + R.h * .58];
    const top = fit.D.y + fit.bb[1] * fit.s;
    return [top - 6, top + (fit.bb[3] - fit.bb[1]) * .15 * fit.s];
  }

  function drawRead() {
    const s = seg(p, SPLIT_END, READ_END);
    const L6 = rowLayout(6, .52);
    const lay = readLayout(s);
    const first = L6[0].x - 24, lastX = L6[narrow ? 2 : 5].x + L6[narrow ? 2 : 5].w + 24;
    const scanT = seg(s, .04, .7);
    const sx = lerp(first, lastX, inout(scanT));
    const scanOn = scanT > 0 && scanT < 1;

    hoverCard = -1;
    lay.forEach((o, i) => {
      const card = CARDS[i];
      if (o.a <= 0) return;
      const dim = card.reject ? 1 - .55 * seg(s, .66, .76) : 1;
      drawCard(card, o.R, { alpha: o.a * dim });
      if (card.reject && s > .66) {
        ctx.save(); ctx.globalAlpha = o.a * seg(s, .66, .72);
        ctx.strokeStyle = "rgba(201,165,90,.9)"; ctx.lineWidth = 1;
        ctx.strokeRect(o.R.x + .5, o.R.y + .5, o.R.w - 1, o.R.h - 1);
        ctx.restore();
      }
      // labels typed as the read passes
      const cxm = o.R.x + o.R.w / 2;
      const t = s >= .7 ? 1 : clamp((sx - cxm) / (o.R.w * 1.1) + .2);
      const ly = o.R.y + o.R.h + 20;
      ctx.globalAlpha = o.a;
      mono(typed(card.l1, t * 1.6), o.R.x, ly, "rgba(250,247,242,.92)");
      mono(typed(narrow ? card.l2.split(" · ")[0] : card.l2, t * 1.6 - .5), o.R.x, ly + 15, card.reject ? "rgba(201,165,90,1)" : "rgba(250,247,242,.48)");
      ctx.globalAlpha = 1;
      if (s > .7 && o.a > .5 && ptr.x > o.R.x && ptr.x < o.R.x + o.R.w && ptr.y > o.R.y && ptr.y < o.R.y + o.R.h) hoverCard = i;
    });

    // the scan line: a gold reading head that does not cross a face
    if (scanOn) {
      const a = Math.sin(Math.PI * scanT) * .95 + .05;
      lay.forEach((o, i) => {
        const R = o.R;
        if (sx < R.x || sx > R.x + R.w) return;
        const band = faceBand(CARDS[i], R);
        ctx.fillStyle = `rgba(201,165,90,${a})`;
        if (!band) ctx.fillRect(sx, R.y - 10, 1.2, R.h + 20);
        else {
          ctx.fillRect(sx, R.y - 10, 1.2, Math.max(0, band[0] - R.y + 10));
          ctx.fillRect(sx, band[1], 1.2, R.y + R.h + 10 - band[1]);
          // unread: two small ticks mark where it stops looking
          ctx.fillRect(sx - 4, band[0], 9, 1); ctx.fillRect(sx - 4, band[1], 9, 1);
        }
        // a soft wash trailing the head
        const g = ctx.createLinearGradient(sx - 60, 0, sx, 0);
        g.addColorStop(0, "rgba(201,165,90,0)"); g.addColorStop(1, `rgba(201,165,90,${.14 * a})`);
        ctx.fillStyle = g; ctx.fillRect(Math.max(R.x, sx - 60), R.y, Math.min(60, sx - R.x), R.h);
      });
    }

    // the read, said large
    if (scanOn) {
      let best = -1, bd = 1e9;
      lay.forEach((o, i) => { const d = Math.abs(sx - (o.R.x + o.R.w / 2)); if (sx > o.R.x - 8 && d < bd) { bd = d; best = i; } });
      if (best >= 0) {
        const o = lay[best], k = 1 - clamp(bd / (o.R.w * .75));
        const word = WORDS[best];
        const size = narrow ? vw * .14 : Math.min(vh * .15, vw * .1);
        ctx.font = `italic 300 ${size}px "Noto Serif Display", Georgia, serif`;
        if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = CARDS[best].reject ? `rgba(250,247,242,${.85 * k})` : `rgba(201,165,90,${k})`;
        ctx.fillText(word, gut - size * .04, vh - gut - 4);
      }
    }

    // hover: the full read of one frame
    if (hoverCard >= 0) {
      const o = lay[hoverCard], R = o.R, rows = CARDS[hoverCard].sheet;
      const h = 18 + rows.length * 15;
      ctx.fillStyle = "rgba(5,5,5,.86)"; ctx.fillRect(R.x, R.y + R.h - h, R.w, h);
      rows.forEach(([k, v], j) => {
        const y = R.y + R.h - h + 20 + j * 15;
        mono(k, R.x + 10, y, "rgba(201,165,90,.95)", "left", 9);
        mono(v, R.x + R.w - 10, y, "rgba(250,247,242,.9)", "right", 9);
      });
      cv.style.cursor = "default";
    }
  }

  // ── BOOK: same woman, different job ────────────────────────────────
  const imposter = 3;
  function cover(im, R, a = 1, fy = .35) {
    if (!im || a <= 0) return;
    const s = Math.max(R.w / im.naturalWidth, R.h / im.naturalHeight);
    const sw = R.w / s, sh = R.h / s;
    ctx.globalAlpha = a;
    ctx.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) * fy, sw, sh, R.x, R.y, R.w, R.h);
    ctx.globalAlpha = 1;
  }
  // a look arrives the way she split apart: in vertical slices
  function slices(im, t, a = 1, fy = .35) {
    if (t <= 0) return;
    const n = narrow ? 7 : 12, w = vw / n;
    for (let k = 0; k < n; k++) {
      const tk = ease(seg(t, k / n * .55, k / n * .55 + .45));
      if (tk <= 0) continue;
      ctx.save();
      ctx.beginPath(); ctx.rect(k * w + w * (1 - tk) / 2, 0, w * tk + .6, vh); ctx.clip();
      cover(im, { x: 0, y: 0, w: vw, h: vh }, a, fy);
      ctx.restore();
    }
  }
  function scrims(a) {
    let g = ctx.createLinearGradient(0, 0, 0, vh * .34);
    g.addColorStop(0, `rgba(5,5,5,${.72 * a})`); g.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh * .34);
    g = ctx.createLinearGradient(0, vh * .5, 0, vh);
    g.addColorStop(0, "rgba(5,5,5,0)"); g.addColorStop(1, `rgba(5,5,5,${.9 * a})`);
    ctx.fillStyle = g; ctx.fillRect(0, vh * .5, vw, vh * .5);
  }
  const LOOK_AT = (i) => .1 + i * .14;

  function drawBook(s, fadeOut = 0) {
    const L5 = rowLayout(5, .54), S6 = stripLayout(6);
    const t0 = inout(seg(s, 0, .12));
    const digi = CARDS.filter((c) => !c.reject);
    const keep = 1 - fadeOut;
    const go = inout(seg(s, .68, .78));     // the beauty frame tries the digitals
    const back = inout(seg(s, .87, .97));   // and goes back to the book

    // full-bleed looks
    let cur = -1;
    BOOK.forEach((b, i) => {
      const t = seg(s, LOOK_AT(i), LOOK_AT(i) + .1);
      if (t > 0) cur = i;
      if (i === imposter) return;
      // a look stays until the next one has fully arrived
      const nextDone = i < BOOK.length - 1 && seg(s, LOOK_AT(i + 1), LOOK_AT(i + 1) + .1) >= 1;
      if (!nextDone) slices(b.im, t, keep, b.fy);
    });
    const imp = BOOK[imposter];
    const ti = seg(s, LOOK_AT(imposter), LOOK_AT(imposter) + .1);
    const slot = S6[5];
    if (ti > 0) {
      if (go <= 0) slices(imp.im, ti, keep, imp.fy);
      else {
        const full = { x: 0, y: 0, w: vw, h: vh };
        cover(imp.im, full, keep * lerp(1, .14, Math.min(go, 1 - back)), imp.fy);
        const R = lr(lr(full, slot, go), full, back);
        if (go * (1 - back) > .02) cover(imp.im, R, keep, lerp(imp.fy, .2, go * (1 - back)));
      }
    }
    if (cur >= 0) scrims(keep * seg(s, LOOK_AT(0), LOOK_AT(0) + .06));

    // read label of the current look
    if (cur >= 0 && (cur !== imposter || go < .02 || back > .98)) {
      const b = BOOK[cur], t = seg(s, LOOK_AT(cur) + .04, LOOK_AT(cur) + .12);
      const ly = narrow ? S6[0].y - 46 : vh - gut - 22;
      ctx.globalAlpha = keep;
      mono(typed(b.l1, t * 1.5), gut, ly, "rgba(250,247,242,.95)", "left", 12);
      mono(typed(b.l2, t * 1.5 - .5), gut, ly + 18, "rgba(250,247,242,.55)", "left", 12);
      ctx.globalAlpha = 1;
    }

    // the digitals: cream, raw, small and constant
    digi.forEach((c, i) => drawCard(c, lr(L5[i], S6[i], t0), { alpha: keep }));
    if (t0 < 1) digi.forEach((c, i) => {
      const R = L5[i]; ctx.globalAlpha = 1 - t0;
      mono(c.l1, R.x, R.y + R.h + 20, "rgba(250,247,242,.92)");
      mono(narrow ? c.l2.split(" · ")[0] : c.l2, R.x, R.y + R.h + 35, "rgba(250,247,242,.48)");
      ctx.globalAlpha = 1;
    });
    ctx.globalAlpha = seg(s, .1, .16) * keep;
    mono("DIGITALS", S6[0].x, slot.y + slot.h + 20, "rgba(250,247,242,.6)");
    ctx.globalAlpha = 1;
    const slotA = seg(s, .62, .68) * (1 - seg(s, .95, 1)) * keep;
    if (slotA > 0 && go < 1) {
      ctx.save(); ctx.globalAlpha = slotA; ctx.setLineDash([3, 4]);
      ctx.strokeStyle = "rgba(250,247,242,.6)"; ctx.strokeRect(slot.x + .5, slot.y + .5, slot.w - 1, slot.h - 1);
      ctx.restore();
    }
    const flag = seg(s, .77, .8) * (1 - seg(s, .87, .9));
    if (flag > 0) {
      ctx.save(); ctx.globalAlpha = flag;
      ctx.strokeStyle = "#c9a55a"; ctx.lineWidth = 1.5; ctx.strokeRect(slot.x - 4, slot.y - 4, slot.w + 8, slot.h + 8);
      const rx = Math.min(slot.x + slot.w + 4, vw - gut);
      mono("STYLED. THIS IS BOOK,", rx, slot.y - 34, "#c9a55a", "right", 11);
      mono("NOT DIGITALS.", rx, slot.y - 18, "#c9a55a", "right", 11);
      ctx.restore();
    }
  }

  // ── CLOCK: digitals expire ─────────────────────────────────────────
  const ageOf = (d) => d <= 90 ? d / 90 * .22 : d <= 180 ? .22 + (d - 90) / 90 * .4 : .62 + Math.min(1, (d - 180) / 40) * .26;
  function clockDay(s) {
    if (s >= .86) return 0;
    return Math.round(lerp(0, 214, ease(seg(s, .12, .8)) * .55 + seg(s, .12, .8) * .45));
  }
  function drawClock() {
    const s = seg(p, BOOK_END, CLOCK_END);
    const S6 = stripLayout(6), C = rowLayout(5, narrow ? .64 : .66, narrow ? .4 : .46);
    if (s < .1) drawBook(1, seg(s, 0, .08));
    const t0 = inout(seg(s, .02, .14));
    const day = clockDay(s);
    const flash = Math.max(0, 1 - Math.abs(s - .865) / .025);
    const digi = CARDS.filter((c) => !c.reject);
    digi.forEach((c, i) => {
      const R = lr(S6[i], C[i], t0);
      drawCard(c, R, { age: ageOf(day) });
      ctx.globalAlpha = t0;
      mono(c.l1, R.x, R.y + R.h + 20, `rgba(250,247,242,${lerp(.9, .5, ageOf(day))})`);
      ctx.globalAlpha = 1;
    });
    if (flash > 0) { ctx.fillStyle = `rgba(250,247,242,${flash * .9})`; ctx.fillRect(0, 0, vw, vh); }

    const state = day <= 90 ? "Current." : day <= 180 ? "Aging." : "Stale.";
    if (els.cDay._d !== day) {
      els.cDay._d = day;
      els.cDay.textContent = "Day " + day;
      els.cState.textContent = state;
      els.cState.classList.toggle("is-stale", state === "Stale.");
      const today = new Date(SHOT.getTime() + day * 864e5);
      els.cDates.textContent = day === 0 && s >= .86 ? "RESHOT · " + fmt(today) : `SHOT ${fmt(SHOT)}${day ? "   ·   TODAY " + fmt(today) : ""}`;
    }
    els.cKeep.style.opacity = seg(s, .88, .94);
  }

  // ── CODA: silence ──────────────────────────────────────────────────
  function drawCoda() {
    const s = seg(p, CLOCK_END, CODA_END);
    const C = rowLayout(5, narrow ? .64 : .66, narrow ? .4 : .46);
    const digi = CARDS.filter((c) => !c.reject);
    const out = ease(seg(s, 0, .12));
    digi.forEach((c, i) => {
      if (i === 1) return;
      drawCard(c, { ...C[i], y: C[i].y + out * 30 }, { alpha: 1 - out });
    });
    // the full length is sent: it lifts away
    const send = inout(seg(s, .06, .3));
    const R0 = C[1];
    const ch = lerp(R0.h, vh * .16, send), cw = ch / 1.4;
    const R = { x: lerp(R0.x, vw / 2 - cw / 2, send), y: lerp(R0.y, -ch - 20, ease(seg(s, .18, .34))), w: cw, h: ch };
    if (R.y + R.h > 0) drawCard(digi[1], R, { alpha: 1 - seg(s, .26, .34) });

    // thirty days of nothing, marked
    const days = Math.max(1, Math.round(lerp(1, 30, seg(s, .36, .8))));
    const lineY = vh * .66, lx0 = gut * 2, lx1 = vw - gut * 2;
    const show = seg(s, .3, .38);
    if (show > 0) {
      for (let d = 1; d <= 30; d++) {
        const x = lerp(lx0, lx1, (d - 1) / 29);
        const on = d <= days && s > .36;
        ctx.fillStyle = on ? `rgba(250,247,242,${.55 * show})` : `rgba(250,247,242,${.14 * show})`;
        ctx.fillRect(x, lineY - (d % 5 === 0 ? 10 : 5), 1, d % 5 === 0 ? 10 : 5);
      }
      const gl = ease(seg(s, .8, .9));
      if (gl > 0) { ctx.fillStyle = "#c9a55a"; ctx.fillRect(lx0, lineY, (lx1 - lx0) * gl, 1); }
    }
    if (els.cdDay._d !== days) { els.cdDay._d = days; els.cdDay.textContent = "Day " + days; }
    els.cdDay.style.color = s > .84 ? "#c9a55a" : "";
    els.cdSent.style.opacity = seg(s, .2, .3);
    els.cdDay.style.opacity = seg(s, .32, .4);
    els.cdLine.style.opacity = seg(s, .86, .94);
  }

  // ── DOM type choreography ──────────────────────────────────────────
  function domType(now) {
    // warm pool of light behind her follows the pointer a little
    const gx = ptr.seen ? lerp(vw / 2, ptr.x, .25) : vw / 2;
    els.glow.style.background =
      `radial-gradient(ellipse ${Math.round(vh * .55)}px ${Math.round(vh * .7)}px at ${gx}px ${vh * .55}px, rgba(58,48,32,${.55 * (1 - seg(p, H_END - .3, H_END + .4))}), rgba(5,5,5,0) 70%)`;


    const ip = RM ? 1 : introT;
    const heroOut = seg(p, .05, .55);
    const inBe = ease(seg(ip, .45, .8)), inRight = ease(seg(ip, .62, 1));
    els.be.style.opacity = inBe * (1 - heroOut);
    els.read.style.opacity = inBe * (1 - heroOut);
    els.be.style.transform = `translate3d(${-heroOut * vw * .12 + (1 - inBe) * -40}px, ${-heroOut * vh * .1}px, 0)`;
    els.read.style.transform = `translate3d(${heroOut * vw * .12 + (1 - inBe) * 40}px, ${-heroOut * vh * .1}px, 0)`;
    els.right.style.opacity = inRight * (1 - seg(p, .05, .4));
    els.right.style.transform = `translate3d(0, ${(1 - inRight) * 30 + seg(p, 0, .5) * vh * .25}px, 0)`;

    const intel = p > H_END + .3;
    const tr = intel ? "PHOLIO INTELLIGENCE" : "OLA SZKOŁDA";
    if (els.hudTr.textContent !== tr) els.hudTr.textContent = tr;
    els.hudBl.style.opacity = (1 - seg(p, H_END - .2, H_END)) * ip;
    els.hudBr.style.opacity = RM ? 0 : (ptr.used ? 0 : 1) * (1 - seg(p, .1, .3)) * seg(ip, .9, 1);
    els.hudTr.style.opacity = seg(ip, .8, 1);

    els.tRead.style.opacity = fade(p, SPLIT_END - .35, READ_END + .1, .3);
    els.tRead.style.transform = `translate3d(0, ${(1 - seg(p, SPLIT_END - .35, SPLIT_END)) * 24}px, 0)`;
    els.tFace.style.opacity = fade(p, SPLIT_END + .9, READ_END + .1, .25);
    els.tBook.style.opacity = fade(p, READ_END + .15, BOOK_END + .05, .3);
    els.clock.style.opacity = fade(p, BOOK_END + .15, CLOCK_END + .05, .25);
    els.coda.style.opacity = fade(p, CLOCK_END + .2, CODA_END + 2, .2);
  }

  // ── loop ───────────────────────────────────────────────────────────
  function frame(now) {
    const dt = Math.min(64, now - last); last = now;
    p = RM ? target : lerp(p, target, 1 - Math.exp(-dt / 110));
    if (Math.abs(p - target) < .0005) p = target;
    if (ready && introT < 1) introT = clamp((now - introStart) / 3800);
    if (DBG.intro != null) introT = DBG.intro;
    if (DBG.p != null) p = target = DBG.p;
    if (DBG.px != null) { ptr.x = DBG.px * vw; ptr.y = vh / 2; ptr.amp = 1; ptr.seen = true; }
    ptr.amp *= Math.exp(-dt / 520);
    if (ptr.amp > .3) ptr.used = true;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    if (ready) {
      if (p < H_END) drawHero(now);
      else if (p < SPLIT_END) drawSplit();
      else if (p < READ_END) drawRead();
      else if (p < BOOK_END) drawBook(seg(p, READ_END, BOOK_END));
      else if (p < CLOCK_END) drawClock();
      else drawCoda();
      domType(now);
    }
    requestAnimationFrame(frame);
  }

  // ── boot ───────────────────────────────────────────────────────────
  async function boot() {
    resize(); readScroll();
    requestAnimationFrame(frame);
    meta = window.PHOLIO_FRAMES;
    let done = 0;
    const total = N + HI_SET.length + BOOK.length;
    const tick = () => { done++; $("ldn").textContent = String(Math.round(done / total * 100)).padStart(3, "0"); };
    // load the opening frames first so the reveal can start
    const order = Array.from({ length: N }, (_, i) => i);
    const jobs = order.map((i) => loadImg(`seq/${String(i).padStart(3, "0")}.webp`).then((im) => { mid[i] = im; tick(); }));
    HI_SET.forEach((i) => jobs.push(loadImg(`hi/${String(i).padStart(3, "0")}.webp`).then((im) => { hi[i] = im; tick(); })));
    BOOK.forEach((b) => jobs.push(loadImg(b.src).then((im) => { b.im = im; tick(); })));
    await Promise.all(jobs);
    await document.fonts.ready;
    $("ld").classList.add("is-done");
    ready = true;
    introStart = performance.now() + 350;
  }
  boot();
})();
