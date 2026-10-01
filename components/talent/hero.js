/**
 * /talent hero: "Represent yourself."
 *
 * The type is the image. Two lines of Noto Serif Display span the viewport and
 * real fashion film plays inside the letterforms (a looks montage cut at the
 * pace of a title sequence). Everything is painted to one canvas at device
 * resolution: the film, then the lines as a mask over it.
 *
 * Opening, on load (~3.4 s): out of black each line rises from under its own
 * baseline already full of moving film; then the one supporting line and the
 * action.
 *
 * Scroll (pinned, 300vh): the supporting line leaves, and the camera flies into
 * the stem of the R. As it goes the film inside the letters becomes the final
 * shot (a figure in a crowded market lifts a hat and walks straight at us),
 * until the letter is wider than the screen and the film is all there is. It
 * then settles onto the next scene's first frame. The hero overlaps that scene
 * by one viewport and steps aside when its pin lets go, so there is no seam.
 *
 * `mountHero(root)` returns a cleanup.
 */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const inQuart = (t) => t * t * t * t;
const outQuint = (t) => 1 - Math.pow(1 - t, 5);

const FAMILY = '"Noto Serif Display", Georgia, serif';
const LINE1 = "Represent";
const LINE2 = "yourself.";
const NEXT_FRAME = "/calltime/turn/001.jpg";

function drawCover(ctx, src, w, h, fx = 0.5, fy = 0.5) {
  const iw = src.videoWidth || src.naturalWidth || src.width;
  const ih = src.videoHeight || src.naturalHeight || src.height;
  if (!iw || !ih) return false;
  const s = Math.max(w / iw, h / ih);
  const dw = iw * s, dh = ih * s;
  ctx.drawImage(src, (w - dw) * fx, (h - dh) * fy, dw, dh);
  return true;
}

export function mountHero(root) {
  const $ = (s) => root.querySelector(s);
  const hx = $("[data-hx]");
  if (!hx) return () => {};
  const pin = hx.firstElementChild;
  const cv = $("[data-hx-cv]");
  const looks = $("[data-hx-looks]");
  const crowd = $("[data-hx-crowd]");
  const foot = $("[data-hx-foot]");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = cv.getContext("2d");
  const film = document.createElement("canvas");
  const fctx = film.getContext("2d");
  const mask = document.createElement("canvas");
  const mctx = mask.getContext("2d");
  const poster = new Image();
  poster.src = "/talent-hero/looks.jpg";
  const next = new Image();
  next.src = NEXT_FRAME;

  let vw = 0, vh = 0, dpr = 1, L = null, fontsReady = false;

  /* Set both lines at one size so the first spans the measure; the second
     hangs from the right edge beneath it. Then find the R's stem. */
  const layout = () => {
    vw = window.innerWidth; vh = window.innerHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    for (const c of [cv, film, mask]) { c.width = Math.round(vw * dpr); c.height = Math.round(vh * dpr); }
    const narrow = vw < 760;
    const gut = Math.max(20, vw * 0.042);
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.font = `600 100px ${FAMILY}`;
    const w1 = mctx.measureText(LINE1).width;
    const size = ((vw - gut * 2) / w1) * 100;
    const f1 = `600 ${size}px ${FAMILY}`;
    const f2 = `italic 600 ${size}px ${FAMILY}`;
    mctx.font = f1;
    const m1 = mctx.measureText(LINE1);
    mctx.font = f2;
    const w2 = mctx.measureText(LINE2).width;
    const lead = size * 0.84;
    const cap = m1.actualBoundingBoxAscent || size * 0.7;
    const blockH = cap + lead + size * 0.2;
    const top = (vh - blockH) / 2 - vh * (narrow ? 0.12 : 0.07);
    const b1 = top + cap;
    const b2 = b1 + lead;
    const x1 = gut + (m1.actualBoundingBoxLeft || 0);
    const x2 = vw - gut - w2;
    L = { size, f1, f2, x1, x2, b1, b2, cap, narrow };

    // The stem of the R: the first solid run on the row through mid-cap.
    const probe = document.createElement("canvas");
    probe.width = Math.ceil(vw); probe.height = Math.ceil(vh);
    const p = probe.getContext("2d");
    p.fillStyle = "#fff"; p.font = f1; p.fillText(LINE1, x1, b1);
    const y = Math.round(b1 - cap * 0.5);
    const row = p.getImageData(0, y, probe.width, 1).data;
    let s0 = -1, s1 = -1;
    for (let x = 0; x < probe.width; x++) {
      const on = row[x * 4 + 3] > 128;
      if (on && s0 < 0) s0 = x;
      if (!on && s0 >= 0) { s1 = x; break; }
    }
    L.anchor = { x: s0 >= 0 ? (s0 + s1) / 2 : x1 + size * 0.12, y, stem: s0 >= 0 ? s1 - s0 : size * 0.1 };
  };

  /* One frame of the composition. rise1/rise2: 0→1 line entrances.
     z: 0→1 the flight into the R. mix: crossfade looks → crowd.
     settle: crossfade to the next scene's first frame. */
  const paint = ({ rise1, rise2, z, mix, settle }) => {
    if (!L) return;
    const W = vw, H = vh;
    // The film.
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.globalCompositeOperation = "source-over";
    fctx.globalAlpha = 1;
    fctx.fillStyle = "#050505";
    fctx.fillRect(0, 0, W, H);
    const lk = looks.readyState >= 2 ? looks : poster;
    drawCover(fctx, lk, W, H);
    if (mix > 0) {
      fctx.globalAlpha = mix;
      if (!drawCover(fctx, crowd.readyState >= 2 ? crowd : lk, W, H)) drawCover(fctx, lk, W, H);
      fctx.globalAlpha = 1;
    }
    if (settle > 0 && next.complete) {
      fctx.globalAlpha = settle;
      drawCover(fctx, next, W, H, L.narrow ? 0.5 : 0.4, 0.5);
      fctx.globalAlpha = 1;
    }

    // The mask: the two lines, each rising inside its own line box, and the
    // flight into the stem of the R (scale about the stem, which travels to
    // the centre of the screen as it grows).
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, W, H);
    const a = L.anchor;
    const Smax = Math.max((W / a.stem) * 1.25, 1);
    const S = Math.exp(lerp(0, Math.log(Smax), inQuart(z)));
    const tx = lerp(a.x, W / 2, inOut(z)) - a.x * S;
    const ty = lerp(a.y, H / 2, inOut(z)) - a.y * S;
    mctx.setTransform(dpr * S, 0, 0, dpr * S, dpr * tx, dpr * ty);
    mctx.fillStyle = "#fff";
    const lineBox = (base, t, font, text, x) => {
      mctx.save();
      mctx.beginPath();
      mctx.rect(-1e5, base - L.size * 1.02, 2e5, L.size * 1.25);
      mctx.clip();
      mctx.font = font;
      mctx.fillText(text, x, base + (1 - t) * L.size * 1.1);
      mctx.restore();
    };
    lineBox(L.b1, rise1, L.f1, LINE1, L.x1);
    lineBox(L.b2, rise2, L.f2, LINE2, L.x2);

    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.globalCompositeOperation = "destination-in";
    fctx.drawImage(mask, 0, 0);
    fctx.globalCompositeOperation = "source-over";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.drawImage(film, 0, 0);
  };

  const STILL = { rise1: 1, rise2: 1, z: 0, mix: 0, settle: 0 };
  const onResize = () => { if (!fontsReady) return; layout(); if (still) paint(STILL); };
  window.addEventListener("resize", onResize);

  Promise.all([
    document.fonts.load(`600 100px ${FAMILY}`),
    document.fonts.load(`italic 600 100px ${FAMILY}`),
  ]).catch(() => {}).then(() => {
    fontsReady = true;
    layout();
    if (still) paint(STILL);
  });

  if (still) {
    // The finished opening, held still: the lines filled with a frame of film.
    poster.onload = () => { if (fontsReady) paint(STILL); };
    foot.style.opacity = "1";
    return () => window.removeEventListener("resize", onResize);
  }

  let t0 = 0;
  const progress = () => {
    const r = hx.getBoundingClientRect();
    // Once the pin lets go, the next scene is underneath on the same frame;
    // the hero steps aside instead of sliding away over it.
    pin.style.visibility = r.bottom < vh - 0.5 ? "hidden" : "visible";
    return { p: clamp(-r.top / (r.height - vh)), near: r.bottom > vh - 0.5 && r.top < vh * 1.2 };
  };

  let raf = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (!fontsReady) return;
    const { p, near } = progress();
    if (!near) { if (!looks.paused) looks.pause(); if (!crowd.paused) crowd.pause(); return; }
    if (!t0) t0 = now;
    if (looks.paused && p < 0.5) looks.play().catch(() => {});

    // Scrolling during the opening completes it.
    if (p > 0.004 && now - t0 < 3400) t0 = now - 3400;
    const tt = (now - t0) / 1000;
    const rise1 = outQuint(seg(tt, 0.25, 1.45));
    const rise2 = outQuint(seg(tt, 0.7, 1.9));
    const fIn = outQuint(seg(tt, 2.1, 3.2));

    const z = seg(p, 0.08, 0.7);
    const mix = inOut(seg(p, 0.1, 0.4));
    const settle = inOut(seg(p, 0.8, 0.93));
    if (mix > 0 && crowd.paused) crowd.play().catch(() => {});
    if (mix <= 0 && !crowd.paused) crowd.pause();

    foot.style.opacity = String(fIn * (1 - seg(p, 0.004, 0.06)));
    foot.style.transform = `translate3d(0, ${(1 - fIn) * 18 + seg(p, 0, 0.1) * 60}px, 0)`;
    foot.style.pointerEvents = p > 0.05 ? "none" : "";
    hx.dataset.headerClear = settle > 0.5 ? "cream" : "ink";

    paint({ rise1, rise2, z, mix, settle });
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}
