/* ══════════════════════════════════════════════════════════════════════
   Pholio — "A better introduction."

   One take. A single cut-out film of one model (seated → rises → walks
   through the word → stands → turns) drives the first three movements on
   one canvas with no cuts:

     Arrival   She sits inside the word "introduction." — the top of each
               letter passes behind her, the bottom in front. She rises and
               walks through it; the letters part around her.
     Measure   The camera pulls back. A ruler draws her height; leaders take
               bust, waist, hips.
     Digitals  She turns. Six frames are called and taken; each one freezes,
               lifts off the live film and lands in a contact sheet, which
               then becomes her line-up. A white flash develops into paper.

   Then: the comp card built from those same frames (three editions, your
   name), the same sitting cut to a brief, the thirty-day wait, and her
   again, turnable by the pointer, in front of the wordmark.
   ══════════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const outExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const lerpR = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Piecewise-linear lookup over [[p, v], ...], eased between knots. */
  const track = (p, ks, ease = inOut) => {
    if (p <= ks[0][0]) return ks[0][1];
    for (let i = 1; i < ks.length; i++) {
      if (p <= ks[i][0]) {
        const [p0, v0] = ks[i - 1], [p1, v1] = ks[i];
        return lerp(v0, v1, ease((p - p0) / (p1 - p0)));
      }
    }
    return ks[ks.length - 1][1];
  };
  const linear = (t) => t;

  /* ── Dates, real ones ─────────────────────────────────────────────── */
  const today = new Date();
  const addDays = (d, n) => new Date(d.getTime() + n * 864e5);
  const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
  const longDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const monthYear = (d) => d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  $$("[data-today]").forEach((el) => (el.textContent = longDate(today)));
  $("[data-sent]").textContent = longDate(addDays(today, -30));
  $("[data-close]").textContent = longDate(today);
  $("[data-reapply]").textContent = monthYear(addMonths(today, 6));

  /* ── The film: frames 1–60 every frame, then every other to 193 ───── */
  const FW = 970, FH = 1640;
  const FR = [];
  for (let n = 1; n <= 60; n++) FR.push(n);
  for (let n = 61; n <= 193; n += 2) FR.push(n);
  const N = FR.length;
  const src = (f) => `seq/seq-${String(f).padStart(3, "0")}.webp`;
  const idxOf = (f) => (f <= 60 ? clamp(Math.round(f), 1, 60) - 1 : Math.min(N - 1, 60 + Math.round((f - 61) / 2)));
  const imgs = new Array(N), ready = new Uint8Array(N), boxes = new Array(N);

  /* Silhouette boxes, measured offline off each frame's alpha at 1/10 scale:
     [x0, y0, x1, y1, head centre x, head width], fractions of the frame.
     Baked in so nothing reads pixels at runtime (file:// taints canvases). */
  const BOXES = {"1":[0.1443,0.0549,0.7732,1.0,0.447,0.299],"2":[0.1443,0.0549,0.7732,1.0,0.4461,0.299],"3":[0.1443,0.0549,0.7732,1.0,0.4473,0.299],"4":[0.1443,0.0549,0.7732,1.0,0.4473,0.299],"5":[0.1443,0.0549,0.7732,1.0,0.4477,0.299],"6":[0.1443,0.0549,0.7732,1.0,0.4482,0.299],"7":[0.1443,0.0549,0.7732,1.0,0.4482,0.299],"8":[0.1443,0.0549,0.7732,1.0,0.4484,0.299],"9":[0.1443,0.0549,0.7732,1.0,0.4484,0.299],"10":[0.1443,0.0549,0.7732,1.0,0.4491,0.299],"11":[0.1443,0.0549,0.7732,1.0,0.45,0.299],"12":[0.1443,0.0549,0.7732,1.0,0.4504,0.3093],"13":[0.1443,0.0488,0.7732,1.0,0.4536,0.299],"14":[0.1443,0.0488,0.7732,1.0,0.4528,0.3196],"15":[0.1443,0.0427,0.7732,1.0,0.4561,0.3196],"16":[0.1546,0.0366,0.7732,1.0,0.4555,0.3299],"17":[0.1546,0.0305,0.7732,1.0,0.4503,0.3402],"18":[0.1546,0.0244,0.7732,1.0,0.4494,0.2887],"19":[0.1546,0.0183,0.7938,1.0,0.4499,0.2784],"20":[0.1546,0.0122,0.8351,1.0,0.4509,0.2784],"21":[0.1546,0.0122,0.8763,1.0,0.452,0.2784],"22":[0.1649,0.0122,0.9278,1.0,0.4523,0.2887],"23":[0.1649,0.0061,0.9485,1.0,0.4553,0.2784],"24":[0.1649,0.0061,0.9485,1.0,0.4568,0.2784],"25":[0.134,0.0061,0.9381,1.0,0.4594,0.2784],"26":[0.1134,0.0061,0.9072,1.0,0.4619,0.268],"27":[0.1031,0.0061,0.8763,1.0,0.4657,0.2784],"28":[0.0928,0.0061,0.8351,1.0,0.4682,0.268],"29":[0.0928,0.0061,0.7938,1.0,0.4721,0.268],"30":[0.0928,0.0061,0.7629,1.0,0.4753,0.268],"31":[0.1031,0.0061,0.7423,1.0,0.4797,0.268],"32":[0.1134,0.0061,0.732,1.0,0.4825,0.268],"33":[0.134,0.0061,0.7216,1.0,0.4861,0.2577],"34":[0.1546,0.0122,0.7216,1.0,0.4887,0.2577],"35":[0.1649,0.0122,0.7216,1.0,0.4917,0.2474],"36":[0.1856,0.0183,0.732,1.0,0.4929,0.2474],"37":[0.2062,0.0183,0.7423,1.0,0.4957,0.2474],"38":[0.2165,0.0244,0.7629,1.0,0.4959,0.2371],"39":[0.2268,0.0305,0.7835,1.0,0.4963,0.2371],"40":[0.2371,0.0305,0.7938,1.0,0.4963,0.2371],"41":[0.2474,0.0305,0.8041,1.0,0.4945,0.2371],"42":[0.2474,0.0305,0.8041,1.0,0.4922,0.2268],"43":[0.2474,0.0244,0.8041,1.0,0.4884,0.2268],"44":[0.2474,0.0244,0.7938,1.0,0.4845,0.2165],"45":[0.2474,0.0244,0.7835,1.0,0.4811,0.2268],"46":[0.2371,0.0244,0.7629,0.9939,0.4758,0.2165],"47":[0.2371,0.0244,0.7423,0.9817,0.4713,0.2165],"48":[0.2268,0.0244,0.7216,0.9695,0.4664,0.2165],"49":[0.2268,0.0244,0.7113,0.9695,0.4621,0.2165],"50":[0.2165,0.0244,0.6907,0.9695,0.4584,0.2062],"51":[0.2165,0.0244,0.6804,0.9695,0.4515,0.2165],"52":[0.2062,0.0244,0.6701,0.9695,0.4467,0.2165],"53":[0.2062,0.0305,0.6495,0.9695,0.4393,0.2062],"54":[0.2062,0.0305,0.6495,0.9695,0.4335,0.2165],"55":[0.1959,0.0305,0.6495,0.9695,0.4286,0.2062],"56":[0.1856,0.0305,0.6701,0.9695,0.4217,0.2062],"57":[0.1753,0.0366,0.6804,0.9695,0.4183,0.2062],"58":[0.1649,0.0366,0.6804,0.9695,0.4149,0.2165],"59":[0.1546,0.0366,0.6907,0.9695,0.4105,0.2062],"60":[0.1443,0.0366,0.6907,0.9695,0.4086,0.2062],"61":[0.1443,0.0427,0.6907,0.9695,0.4058,0.2165],"63":[0.1443,0.0488,0.701,0.9695,0.4032,0.2165],"65":[0.1546,0.0488,0.7113,0.9695,0.4012,0.2062],"67":[0.1649,0.0488,0.7113,0.9695,0.4019,0.2062],"69":[0.1649,0.0488,0.701,0.9695,0.4023,0.2165],"71":[0.1546,0.0427,0.6907,0.9695,0.4042,0.2165],"73":[0.1546,0.0366,0.6804,0.9695,0.4085,0.2062],"75":[0.1649,0.0305,0.6289,0.9695,0.4136,0.2165],"77":[0.1753,0.0183,0.6392,0.9695,0.4194,0.2062],"79":[0.1856,0.0183,0.6392,0.9695,0.4261,0.2165],"81":[0.1959,0.0183,0.6495,0.9695,0.4355,0.2165],"83":[0.2165,0.0244,0.6598,0.9695,0.4442,0.2165],"85":[0.2371,0.0244,0.6701,0.9695,0.4546,0.2165],"87":[0.2371,0.0305,0.6804,0.9695,0.4645,0.2165],"89":[0.2268,0.0427,0.6907,0.9695,0.4735,0.2165],"91":[0.2268,0.0427,0.6907,0.9695,0.4777,0.2165],"93":[0.2371,0.0366,0.6907,0.9695,0.4812,0.2165],"95":[0.2371,0.0366,0.6907,0.9695,0.4835,0.2165],"97":[0.2268,0.0427,0.701,0.9695,0.4838,0.2165],"99":[0.2371,0.0427,0.7113,0.9695,0.4811,0.2165],"101":[0.2577,0.0366,0.7216,0.9695,0.4735,0.2165],"103":[0.268,0.0244,0.7216,0.9695,0.4636,0.2165],"105":[0.2474,0.0183,0.7113,0.9695,0.451,0.2165],"107":[0.2371,0.0183,0.6907,0.9695,0.4352,0.2165],"109":[0.2371,0.0244,0.6804,0.9695,0.4229,0.2165],"111":[0.2268,0.0305,0.6701,0.9695,0.4129,0.2165],"113":[0.2268,0.0366,0.6701,0.9695,0.405,0.2165],"115":[0.2165,0.0427,0.6907,0.9695,0.3977,0.2165],"117":[0.2062,0.0427,0.6907,0.9695,0.3951,0.2165],"119":[0.2062,0.0427,0.6907,0.9695,0.392,0.2062],"121":[0.2062,0.0427,0.6907,0.9695,0.3908,0.2062],"123":[0.2165,0.0427,0.6907,0.9695,0.3908,0.2062],"125":[0.2165,0.0427,0.6907,0.9695,0.3905,0.2062],"127":[0.2062,0.0427,0.6804,0.9695,0.3908,0.2062],"129":[0.1959,0.0366,0.6598,0.9695,0.3955,0.2165],"131":[0.1753,0.0244,0.6289,0.9695,0.4063,0.2165],"133":[0.1649,0.0183,0.6289,0.9695,0.4178,0.2165],"135":[0.1649,0.0122,0.6186,0.9756,0.4331,0.2165],"137":[0.1856,0.0183,0.6804,0.9756,0.4448,0.2268],"139":[0.2268,0.0244,0.6907,0.9756,0.4522,0.2268],"141":[0.2165,0.0305,0.6289,0.9756,0.4539,0.2371],"143":[0.1959,0.0305,0.6186,0.9695,0.4504,0.2371],"145":[0.134,0.0244,0.6392,0.9695,0.4482,0.2474],"147":[0.0928,0.0183,0.6495,0.9756,0.4519,0.2268],"149":[0.0722,0.0122,0.6598,0.9756,0.4372,0.2577],"151":[0.0928,0.0122,0.6907,0.9695,0.4276,0.3402],"153":[0.134,0.0061,0.701,0.9695,0.391,0.3711],"155":[0.0928,0.0122,0.7113,0.9634,0.3427,0.433],"157":[0.0309,0.0122,0.6804,0.9634,0.3405,0.5052],"159":[0.0515,0.0183,0.6804,0.9634,0.3769,0.4639],"161":[0.1134,0.0183,0.7835,0.9634,0.439,0.299],"163":[0.2371,0.0183,0.8969,0.9634,0.4752,0.2268],"165":[0.1856,0.0183,0.9794,0.9634,0.4969,0.2062],"167":[0.1649,0.0183,0.9897,0.9634,0.5083,0.2062],"169":[0.1649,0.0183,0.9485,0.9634,0.512,0.2165],"171":[0.1753,0.0244,0.8763,0.9634,0.507,0.2268],"173":[0.1959,0.0244,0.7732,0.9634,0.4936,0.2268],"175":[0.2062,0.0305,0.7113,0.9634,0.4742,0.2268],"177":[0.2165,0.0366,0.701,0.9634,0.4542,0.2268],"179":[0.1959,0.0366,0.701,0.9634,0.4374,0.2268],"181":[0.1856,0.0366,0.7113,0.9634,0.4266,0.2268],"183":[0.1649,0.0427,0.732,0.9695,0.4171,0.2268],"185":[0.1443,0.0427,0.732,0.9695,0.4141,0.2268],"187":[0.134,0.0488,0.732,0.9695,0.4112,0.2165],"189":[0.134,0.0488,0.732,0.9695,0.4106,0.2165],"191":[0.134,0.0488,0.732,0.9695,0.4126,0.2268],"193":[0.1443,0.0488,0.732,0.9695,0.4126,0.2268]};
  const boxOfFrame = (f) => { const v = BOXES[f]; return v ? { x0: v[0], y0: v[1], x1: v[2], y1: v[3], hx: v[4], hw: v[5] } : null; };
  const probe = document.createElement("canvas");
  probe.width = 97; probe.height = 164;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  function measure(im) {
    try { return measureRaw(im); } catch { return null; }
  }
  function measureRaw(im) {
    pctx.clearRect(0, 0, 97, 164);
    pctx.drawImage(im, 0, 0, 97, 164);
    const d = pctx.getImageData(0, 0, 97, 164).data;
    let x0 = 97, y0 = 164, x1 = 0, y1 = 0;
    for (let y = 0; y < 164; y++) for (let x = 0; x < 97; x++) {
      if (d[(y * 97 + x) * 4 + 3] > 90) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    const headRows = Math.max(3, Math.round((y1 - y0) * 0.09));
    let hx0 = 97, hx1 = 0, sx = 0, c = 0;
    for (let y = y0 + 1; y < y0 + headRows; y++) for (let x = 0; x < 97; x++) {
      if (d[(y * 97 + x) * 4 + 3] > 90) { sx += x; c++; if (x < hx0) hx0 = x; if (x > hx1) hx1 = x; }
    }
    return { x0: x0 / 97, y0: y0 / 164, x1: (x1 + 1) / 97, y1: (y1 + 1) / 164, hx: c ? sx / c / 97 : (x0 + x1) / 194, hw: Math.max(0.12, (hx1 - hx0 + 1) / 97) };
  }
  const FALLBACK_BOX = { x0: 0.23, y0: 0.04, x1: 0.70, y1: 0.97, hx: 0.47, hw: 0.2 };
  const box = (i) => boxes[i] || boxes[nearest(i)] || FALLBACK_BOX;
  function nearest(i) {
    if (ready[i]) return i;
    for (let d = 1; d < N; d++) {
      if (i + d < N && ready[i + d]) return i + d;
      if (i - d >= 0 && ready[i - d]) return i - d;
    }
    return -1;
  }
  const frameImg = (f) => { const i = nearest(idxOf(f)); return i < 0 ? null : imgs[i]; };
  const frameBox = (f) => box(idxOf(f));

  let loaded = 0;
  function load(i) {
    return new Promise((res) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        const done = () => { imgs[i] = im; boxes[i] = boxOfFrame(FR[i]) || measure(im); ready[i] = 1; loaded++; dirty = true; res(); };
        im.decode ? im.decode().then(done, done) : done();
      };
      im.onerror = () => res();
      im.src = src(FR[i]);
    });
  }
  async function loadAll() {
    await load(0);
    for (let i = 1; i < 60; i += 8) await Promise.all(Array.from({ length: 8 }, (_, k) => i + k).filter((k) => k < 60).map(load));
    for (let i = 60; i < N; i += 8) await Promise.all(Array.from({ length: 8 }, (_, k) => i + k).filter((k) => k < N).map(load));
  }

  /* ── Stage ─────────────────────────────────────────────────────────── */
  const html = document.documentElement;
  const stage = $("[data-stage]");
  const stagePin = $(".stage__pin");
  const cv = $("[data-cv]");
  const ctx = cv.getContext("2d");
  const off = document.createElement("canvas");
  const octx = off.getContext("2d");
  const heroA = $("[data-hero-a]");
  const heroFoot = $("[data-hero-foot]");
  const heroCue = $("[data-hero-cue]");
  const walkL = $("[data-walk-l] span"), walkR = $("[data-walk-r] span");
  const msKids = [...$("[data-ms]").children];
  const tkKids = [...$("[data-tk]").children];
  const tkCount = $("[data-tk-count]"), tkN = $("[data-tk-n]"), tkDone = $("[data-tk-done]");
  const callEl = $("[data-call]");
  const flashEl = $("[data-flash]"), washEl = $("[data-wash]");

  let vw = innerWidth, vh = innerHeight, dpr = 1, narrow = false, dirty = true;

  /* Where the film is, by stage progress. Each capture holds a beat so the
     shot lands; the turn is respaced so the six captures arrive evenly. */
  const FRAME_TRACK = [
    [0, 1], [0.06, 12], [0.07, 13], [0.26, 60], [0.27, 61], [0.52, 97], [0.56, 97],
    [0.60, 103], [0.612, 103], [0.66, 133], [0.672, 133], [0.71, 139], [0.722, 139],
    [0.76, 145], [0.772, 145], [0.81, 157], [0.822, 157], [0.86, 175], [0.872, 175], [0.90, 193], [1, 193],
  ];
  const CAPS = [
    { f: 103, p: 0.60, label: "Full length", kind: "full" },
    { f: 133, p: 0.66, label: "Three-quarter", kind: "three" },
    { f: 139, p: 0.71, label: "Profile", kind: "full" },
    { f: 145, p: 0.76, label: "Back", kind: "full" },
    { f: 157, p: 0.81, label: "Movement", kind: "full" },
    { f: 175, p: 0.86, label: "Close-up", kind: "close" },
  ];

  /* Camera: scale (frame height / viewport height), centre x, bottom y. */
  const camWide = {
    s: [[0, 0.97], [0.06, 0.97], [0.26, 1.34], [0.31, 0.9], [0.5, 0.9], [0.56, 0.84]],
    cx: [[0, 0.5], [0.27, 0.5], [0.31, 0.42], [0.5, 0.42], [0.56, 0.27]],
    by: [[0, 1.0], [0.06, 1.0], [0.26, 1.33], [0.31, 0.97], [0.5, 0.97], [0.56, 0.95]],
  };
  const camNarrow = {
    s: [[0, 0.74], [0.06, 0.74], [0.26, 1.02], [0.31, 0.72], [0.5, 0.72], [0.56, 0.54]],
    cx: [[0, 0.5]],
    by: [[0, 0.86], [0.06, 0.86], [0.26, 1.1], [0.31, 0.84], [0.5, 0.84], [0.56, 0.63]],
  };
  const frameRect = (s, cx, by) => { const h = s * vh, w = (h * FW) / FH; return { x: cx * vw - w / 2, y: by * vh - h, w, h }; };
  const camAt = (p) => { const c = narrow ? camNarrow : camWide; return frameRect(track(p, c.s), track(p, c.cx), track(p, c.by)); };

  /* The word */
  const WORD = { lines: [], fs: 100, base: 0 };
  const SERIF = '"Noto Serif Display", Georgia, serif';
  function layoutWord() {
    const lines = narrow ? ["intro", "duction."] : ["introduction."];
    ctx.font = `300 100px ${SERIF}`;
    const maxW = Math.max(...lines.map((l) => ctx.measureText(l).width));
    const fs = ((narrow ? 0.94 : 0.96) * vw * 100) / maxW;
    ctx.font = `300 ${fs}px ${SERIF}`;
    const lh = fs * 0.8;
    const lastBase = narrow ? vh * 0.6 : vh * 0.79;
    WORD.fs = fs;
    WORD.lines = lines.map((text, li) => {
      const y = lastBase - (lines.length - 1 - li) * lh;
      const lw = ctx.measureText(text).width;
      const x0 = narrow ? vw * 0.03 + (li ? vw * 0.94 - lw : 0) : (vw - lw) / 2;
      const chars = [...text].map((ch, i) => {
        const x = x0 + ctx.measureText(text.slice(0, i)).width;
        return { ch, x, w: ctx.measureText(ch).width };
      });
      return { y, chars };
    });
    WORD.cx = vw / 2;
    WORD.half = Math.max(...WORD.lines.flatMap((l) => l.chars.map((c) => Math.abs(c.x + c.w / 2 - vw / 2)))) || 1;
    const firstY = WORD.lines[0].y;
    heroA.style.top = `${firstY - fs * 0.74 - heroA.offsetHeight}px`;
    WORD.cut = WORD.lines[WORD.lines.length - 1].y - fs * 0.26;
  }

  function drawWord(c, p, intro) {
    const part = inOut(seg(p, 0.075, 0.25));
    const fade = 1 - seg(p, 0.17, 0.25);
    if (fade <= 0) return;
    c.save();
    c.font = `300 ${WORD.fs}px ${SERIF}`;
    c.textBaseline = "alphabetic";
    let k = 0;
    const total = WORD.lines.reduce((a, l) => a + l.chars.length, 0);
    for (const line of WORD.lines) {
      c.save();
      c.beginPath();
      c.rect(-vw, line.y - WORD.fs * 1.2, vw * 3, WORD.fs * 1.42);
      c.clip();
      for (const ch of line.chars) {
        const rel = (ch.x + ch.w / 2 - WORD.cx) / WORD.half;
        const dir = rel < 0 ? -1 : 1;
        const dx = dir * part * vw * 0.6 * (0.3 + 0.7 * Math.abs(rel));
        const li = RM ? 1 : outExpo(seg(intro, 0.12 + (k / total) * 0.42, 0.62 + (k / total) * 0.42));
        const dy = (1 - li) * WORD.fs * 1.05 - part * WORD.fs * 0.06;
        c.globalAlpha = fade * (0.35 + 0.65 * li);
        c.fillStyle = ch.ch === "." ? "#c9a55a" : "#f5f0e8";
        c.fillText(ch.ch, ch.x + dx, line.y + dy);
        k++;
      }
      c.restore();
    }
    c.restore();
  }

  function drawFig(c, img, r, alpha = 1) {
    if (!img || alpha <= 0) return;
    c.globalAlpha = alpha;
    c.drawImage(img, r.x, r.y, r.w, r.h);
    c.globalAlpha = 1;
  }

  /* Contact sheet → line-up cells */
  function cells(mode) {
    let x0, x1, y0, y1, cols, rows, gap;
    if (narrow) {
      [x0, x1] = [vw * 0.04, vw * 0.96];
      [y0, y1] = mode === "grid" ? [vh * 0.655, vh * 0.965] : [vh * 0.2, vh * 0.92];
      cols = 3; rows = 2; gap = 6;
    } else if (mode === "grid") {
      [x0, x1, y0, y1] = [vw * 0.5, vw - GUT, vh * 0.13, vh * 0.69];
      cols = 3; rows = 2; gap = 12;
    } else {
      [x0, x1, y0, y1] = [vw * 0.04, vw * 0.96, vh * 0.2, vh * 0.86];
      cols = 6; rows = 1; gap = 12;
    }
    const cw = (x1 - x0 - gap * (cols - 1)) / cols, ch = (y1 - y0 - gap * (rows - 1)) / rows;
    return CAPS.map((_, k) => ({ x: x0 + (k % cols) * (cw + gap), y: y0 + Math.floor(k / cols) * (ch + gap), w: cw, h: ch }));
  }
  let GUT = 64;
  const LAB = () => (narrow ? 16 : 24);

  /* A figure fitted into a cell: whole body, or the head for the close-up. */
  function fitInCell(cap, cell) {
    const b = frameBox(cap.f), lab = LAB();
    const inner = { x: cell.x, y: cell.y, w: cell.w, h: cell.h - lab };
    if (cap.kind === "close") {
      const w = Math.min((inner.w * 0.8) / b.hw, ((inner.h * 0.8) / (0.24 * (b.y1 - b.y0))) * (FW / FH)), h = (w * FH) / FW;
      return { r: { x: inner.x + inner.w / 2 - b.hx * w, y: inner.y + inner.h * 0.08 - b.y0 * h, w, h }, clip: inner, close: true };
    }
    const h = (inner.h * 0.9) / (b.y1 - b.y0), w = (h * FW) / FH;
    return { r: { x: inner.x + inner.w / 2 - ((b.x0 + b.x1) / 2) * w, y: inner.y + inner.h * 0.06 - b.y0 * h, w, h }, clip: { x: inner.x - inner.w * 0.4, y: inner.y, w: inner.w * 1.8, h: inner.h } };
  }

  /* Framing guide for the next call, in the live frame's coordinates. */
  function guideFor(cap, r, b) {
    const bh = b.y1 - b.y0;
    let y0 = b.y0 - 0.025, y1 = b.y1 + 0.012, cxF = (b.x0 + b.x1) / 2;
    if (cap.kind === "three") y1 = b.y0 + bh * 0.66;
    if (cap.kind === "close") { y1 = b.y0 + bh * 0.2; cxF = b.hx; }
    const h = (y1 - y0) * r.h;
    const w = cap.kind === "full" ? Math.max((b.x1 - b.x0 + 0.06) * r.w, h * 0.42) : h * 0.8;
    return { x: r.x + cxF * r.w - w / 2, y: r.y + y0 * r.h, w, h };
  }
  let guide = null;

  function corners(c, r, len, color, lw = 1.5) {
    c.strokeStyle = color; c.lineWidth = lw;
    c.beginPath();
    const { x, y, w, h } = r;
    c.moveTo(x, y + len); c.lineTo(x, y); c.lineTo(x + len, y);
    c.moveTo(x + w - len, y); c.lineTo(x + w, y); c.lineTo(x + w, y + len);
    c.moveTo(x + w, y + h - len); c.lineTo(x + w, y + h); c.lineTo(x + w - len, y + h);
    c.moveTo(x + len, y + h); c.lineTo(x, y + h); c.lineTo(x, y + h - len);
    c.stroke();
  }

  const MONO = '"JetBrains Mono", ui-monospace, monospace';
  let introStart = 0, entered = false, lastCall = -2;

  function setCall(i) {
    if (i === lastCall) return;
    const prev = lastCall;
    lastCall = i;
    const text = i >= 0 && i < CAPS.length ? CAPS[i].label + "." : "";
    const old = callEl.querySelector("span");
    if (!text) { if (old) old.remove(); return; }
    const sp = document.createElement("span");
    sp.textContent = text;
    callEl.replaceChildren(sp);
    // Fit the word to the width: it is always the biggest thing on screen.
    callEl.style.fontSize = "100px";
    const w = sp.getBoundingClientRect().width || 1;
    callEl.style.fontSize = `${Math.min(narrow ? 0.94 : 0.92, 1) * ((vw * 100) / w) * (narrow ? 1 : 0.98)}px`;
    if (!RM) {
      const dir = i > prev ? 1 : -1;
      sp.animate(
        [{ transform: `translateY(${dir * 18}%)`, opacity: 0, filter: "blur(12px)" }, { transform: "none", opacity: 1, filter: "blur(0)" }],
        { duration: 900, easing: "cubic-bezier(.16,1,.3,1)" },
      );
    }
  }

  function drawStage(p, t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    const intro = RM ? 1 : clamp((t - introStart) / 2400);
    const f = track(p, FRAME_TRACK, linear);
    const img = frameImg(f);
    const b = frameBox(f);
    const r = camAt(p);
    const nTaken = CAPS.filter((c) => p >= c.p).length;

    /* Arrival: word / figure / the figure above the cut over the word. */
    const liveAlpha = (RM ? 1 : outCubic(seg(intro, 0, 0.55))) * (1 - seg(p, 0.885, 0.925));
    if (p < 0.27) {
      // Settle-in on the opening: a slow dolly.
      const settle = RM ? 0 : 1 - outCubic(seg(intro, 0, 1));
      const rr = { x: r.x - r.w * settle * 0.02, y: r.y - r.h * settle * 0.03, w: r.w * (1 + settle * 0.04), h: r.h * (1 + settle * 0.04) };
      drawFig(ctx, img, rr, liveAlpha);
      drawWord(ctx, p, intro);
      // Re-draw her above the cut, feathered, so the letters braid with her.
      const cutY = lerp(WORD.cut, vh * 1.6, inOut(seg(p, 0.06, 0.13)));
      if (img && cutY < vh * 1.5) {
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        octx.clearRect(0, 0, vw, vh);
        octx.globalCompositeOperation = "source-over";
        octx.drawImage(img, rr.x, rr.y, rr.w, rr.h);
        octx.globalCompositeOperation = "destination-in";
        const g = octx.createLinearGradient(0, cutY - 14, 0, cutY + 14);
        g.addColorStop(0, "#000"); g.addColorStop(1, "rgba(0,0,0,0)");
        octx.fillStyle = g;
        octx.fillRect(0, 0, vw, vh);
        octx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = liveAlpha;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(off, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = 1;
      }
    } else {
      drawFig(ctx, img, r, liveAlpha);
    }

    /* Measure */
    const mIn = seg(p, 0.305, 0.37), mOut = 1 - seg(p, 0.495, 0.53);
    if (mIn > 0 && mOut > 0 && img) {
      const crown = r.y + b.y0 * r.h, sole = r.y + b.y1 * r.h;
      const bl = r.x + b.x0 * r.w, br = r.x + b.x1 * r.w;
      const rx = br + (narrow ? 14 : 44);
      const grow = outCubic(mIn);
      const topY = lerp(sole, crown, grow);
      ctx.globalAlpha = mOut;
      ctx.strokeStyle = "#c9a55a"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rx, sole); ctx.lineTo(rx, topY); ctx.stroke();
      ctx.font = `400 ${narrow ? 8 : 9.5}px ${MONO}`;
      ctx.fillStyle = "rgba(245,240,232,.5)";
      for (let cm = 0; cm <= 170; cm += 10) {
        const y = lerp(sole, crown, cm / 178);
        if (y < topY) break;
        const major = cm % 50 === 0;
        ctx.beginPath(); ctx.moveTo(rx, y); ctx.lineTo(rx + (major ? 12 : 6), y); ctx.stroke();
        if (major && cm && !narrow) ctx.fillText(String(cm), rx + 18, y + 3);
      }
      // Crown marker and the count.
      ctx.beginPath(); ctx.moveTo(rx - 18, topY); ctx.lineTo(rx + 18, topY); ctx.stroke();
      const val = Math.round(178 * grow);
      ctx.fillStyle = "#f5f0e8";
      ctx.font = `200 ${narrow ? 34 : 64}px ${SERIF}`;
      ctx.fillText(String(val), rx + (narrow ? 8 : 26), topY + (narrow ? 32 : 56));
      const vwid = ctx.measureText(String(val)).width;
      ctx.font = `400 ${narrow ? 8.5 : 10.5}px ${MONO}`;
      ctx.fillStyle = "#c9a55a";
      ctx.fillText("CM", rx + (narrow ? 10 : 30) + vwid, topY + (narrow ? 32 : 56));
      ctx.fillStyle = "rgba(245,240,232,.55)";
      ctx.fillText("5′10″", rx + (narrow ? 8 : 28), topY + (narrow ? 48 : 80));

      // Leaders: bust, waist, hips.
      const L = [["BUST", "81 cm · 32″", 0.255], ["WAIST", "61 cm · 24″", 0.37], ["HIPS", "89 cm · 35″", 0.485]];
      L.forEach(([name, v, fr], i) => {
        const a = outCubic(seg(p, 0.37 + i * 0.022, 0.4 + i * 0.022));
        if (a <= 0) return;
        const y = lerp(crown, sole, fr);
        const lx = narrow ? bl - 4 : bl - 150;
        const x1 = lerp(br, lx, a);
        ctx.globalAlpha = mOut;
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = "rgba(201,165,90,.85)";
        ctx.beginPath(); ctx.moveTo(br - (br - bl) * 0.12, y); ctx.lineTo(x1, y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#c9a55a";
        ctx.beginPath(); ctx.arc(x1, y, 2.2, 0, 7); ctx.fill();
        ctx.globalAlpha = mOut * a;
        ctx.textAlign = narrow ? "right" : "left";
        const tx = narrow ? lx - 6 : lx;
        ctx.font = `500 ${narrow ? 8 : 10}px ${MONO}`; ctx.fillStyle = "#c9a55a";
        ctx.fillText(name, tx, y - (narrow ? 5 : 10));
        ctx.font = `400 ${narrow ? 8 : 11}px ${MONO}`; ctx.fillStyle = "#f5f0e8";
        ctx.fillText(v, tx, y + (narrow ? 10 : 18));
        ctx.textAlign = "left";
      });
      ctx.globalAlpha = 1;
    }

    /* Digitals: the empty sheet, the guide, the captures in flight. */
    const sheetIn = seg(p, 0.545, 0.585);
    if (sheetIn > 0) {
      const L = inOut(seg(p, 0.895, 0.945));
      const G = cells("grid"), Ln = cells("line");
      const lab = LAB();
      CAPS.forEach((cap, k) => {
        const cell = lerpR(G[k], Ln[k], L);
        const taken = p >= cap.p;
        ctx.globalAlpha = outCubic(seg(sheetIn, k * 0.08, 0.6 + k * 0.08));
        // Cell ground: covers the call word, reads as a sheet.
        ctx.fillStyle = `rgba(9,8,7,${0.82 * (1 - L * 0.7)})`;
        ctx.fillRect(cell.x, cell.y, cell.w, cell.h - lab);
        ctx.strokeStyle = `rgba(245,240,232,${0.12 * (1 - L)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, cell.w - 1, cell.h - lab - 1);
        ctx.font = `${taken ? 500 : 400} ${narrow ? 7.5 : 10}px ${MONO}`;
        ctx.fillStyle = taken ? "#f5f0e8" : "rgba(245,240,232,.32)";
        const num = String(k + 1).padStart(2, "0");
        ctx.fillText(narrow ? cap.label.toUpperCase() : `${num}  ${cap.label.toUpperCase()}`, cell.x, cell.y + cell.h - (narrow ? 4 : 6));
        if (taken && !narrow) { ctx.fillStyle = "#c9a55a"; ctx.fillText(num, cell.x, cell.y + cell.h - 6); }
      });
      ctx.globalAlpha = 1;

      // Captures, frozen and in flight.
      CAPS.forEach((cap, k) => {
        if (p < cap.p) return;
        const im = frameImg(cap.f);
        if (!im) return;
        const fromR = camAt(cap.p);
        const tFly = outCubic(seg(p, cap.p + 0.004, cap.p + 0.042));
        const cell = lerpR(G[k], Ln[k], L);
        const tgt = fitInCell(cap, cell);
        const rr = lerpR(fromR, tgt.r, tFly);
        ctx.save();
        if (tgt.clip) {
          const full = { x: 0, y: 0, w: vw, h: vh };
          const cl = lerpR(full, tgt.clip, tFly);
          ctx.beginPath(); ctx.rect(cl.x, cl.y, cl.w, cl.h); ctx.clip();
          const gr = ctx.createRadialGradient(cl.x + cl.w / 2, cl.y + cl.h * 0.35, 0, cl.x + cl.w / 2, cl.y + cl.h * 0.35, Math.max(cl.w, cl.h) * 0.8);
          if (tgt.close) {
            gr.addColorStop(0, `rgba(40,37,33,${tFly})`); gr.addColorStop(1, `rgba(12,11,10,${tFly})`);
            ctx.fillStyle = gr; ctx.fillRect(cl.x, cl.y, cl.w, cl.h);
          }
        }
        // The freeze reads as a print: bright on the instant, then settles.
        const ghost = tFly < 1 ? 0.55 + 0.45 * tFly : 1;
        drawFig(ctx, im, rr, ghost);
        ctx.restore();
      });

      // The framing guide for the next call.
      const next = CAPS[nTaken];
      if (next && p > 0.55 && p < 0.885 && img) {
        const g = guideFor(next, r, b);
        guide = guide ? lerpR(guide, g, 0.22) : g;
        const a = seg(p, 0.555, 0.58);
        ctx.globalAlpha = a;
        corners(ctx, guide, narrow ? 10 : 18, "#c9a55a", 1.5);
        ctx.font = `500 ${narrow ? 8 : 10}px ${MONO}`;
        ctx.fillStyle = "#c9a55a";
        ctx.fillText(`${String(nTaken + 1).padStart(2, "0")} — ${next.label.toUpperCase()}`, guide.x, guide.y - 10);
        ctx.globalAlpha = 1;
      } else guide = null;
    }

    /* DOM beats */
    const heroOut = 1 - seg(p, 0.012, 0.06);
    heroA.style.opacity = (RM ? 1 : outCubic(seg(intro, 0.3, 0.75))) * heroOut;
    heroA.style.transform = `translateY(${(1 - (RM ? 1 : outExpo(seg(intro, 0.3, 0.9)))) * 30 - p * vh * 0.8}px)`;
    heroFoot.style.opacity = (RM ? 1 : outCubic(seg(intro, 0.55, 0.95))) * heroOut;
    heroFoot.style.transform = `translateY(${(1 - (RM ? 1 : outCubic(seg(intro, 0.55, 1)))) * 14 + (1 - heroOut) * 20}px)`;
    heroFoot.style.pointerEvents = heroOut > 0.5 ? "auto" : "none";
    heroCue.style.opacity = (RM ? 1 : seg(intro, 0.8, 1)) * (1 - seg(p, 0, 0.02));

    const wl = seg(p, 0.12, 0.17) * (1 - seg(p, 0.235, 0.27));
    const wr = seg(p, 0.15, 0.2) * (1 - seg(p, 0.245, 0.28));
    walkL.style.opacity = wl;
    walkL.style.transform = `translateY(${(1 - outCubic(seg(p, 0.12, 0.17))) * 40 - seg(p, 0.235, 0.27) * 60}px)`;
    walkR.style.opacity = wr;
    walkR.style.transform = `translateY(${(1 - outCubic(seg(p, 0.15, 0.2))) * 40 - seg(p, 0.245, 0.28) * 60}px)`;

    msKids.forEach((el, i) => {
      const a = outCubic(seg(p, 0.33 + i * 0.012, 0.36 + i * 0.012)) * (1 - seg(p, 0.49, 0.52));
      el.style.opacity = a;
      el.style.transform = `translateY(${(1 - a) * 24}px)`;
    });

    const tkA = seg(p, 0.565, 0.6) * (1 - seg(p, 0.865, 0.89));
    tkKids.forEach((el, i) => {
      const a = outCubic(seg(p, 0.565 + i * 0.01, 0.6 + i * 0.01)) * (1 - seg(p, 0.865, 0.89));
      el.style.opacity = a;
      el.style.transform = `translateY(${(1 - a) * 20}px)`;
    });
    tkCount.style.opacity = tkA;
    tkN.textContent = String(nTaken).padStart(2, "0");
    const dn = seg(p, 0.905, 0.93) * (1 - seg(p, 0.955, 0.975));
    tkDone.style.opacity = dn;

    callEl.style.opacity = seg(p, 0.555, 0.585) * (1 - seg(p, 0.865, 0.89));
    setCall(p < 0.55 ? -1 : Math.min(nTaken, CAPS.length - 1));

    let fl = 0;
    if (!RM) for (const c of CAPS) { const d = p - c.p; if (d >= 0 && d < 0.009) fl = Math.max(fl, Math.pow(1 - d / 0.009, 2) * 0.85); }
    flashEl.style.opacity = fl;
    washEl.style.opacity = inOut(seg(p, 0.955, 0.995));
  }

  /* ── The card ──────────────────────────────────────────────────────── */
  const cd = $("[data-cd]"), cdPin = $("[data-cd-pin]");
  const cc = $("[data-cc]"), ccTilt = $("[data-cc-tilt]"), ccFlip = $("[data-cc-flip]");
  const cdCopy = $("[data-cd-copy]"), cdCtl = $("[data-cd-ctl]");
  const edBtns = $$("[data-ed-btn]");
  let userEd = false, edShown = "standard";
  function setEd(ed) {
    if (ed === edShown) return;
    edShown = ed;
    cc.dataset.ed = ed;
    edBtns.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.edBtn === ed)));
  }
  edBtns.forEach((b) => b.addEventListener("click", () => { userEd = true; setEd(b.dataset.edBtn); }));

  const nm = $("[data-nm]");
  const nameEls = $$("[data-name]"), mast = $("[data-name-up]");
  nm.addEventListener("input", () => {
    const v = nm.value.trim().replace(/\s+/g, " ") || "Elara Keats";
    nameEls.forEach((el) => (el.textContent = v));
    mast.textContent = v.toUpperCase();
    mast.style.fontSize = `${Math.min(17.5, (17.5 * 11) / Math.max(4, v.length))}cqw`;
  });

  // Back-of-card crops, placed off each frame's own silhouette.
  const CROP_FRAMES = { close: 175, profile: 139, back: 145, move: 157 };
  function layoutCrop(el) {
    const im = el.querySelector("img");
    if (!im.complete || !im.naturalWidth) return;
    im._b = im._b || boxOfFrame(CROP_FRAMES[el.dataset.crop]) || measure(im) || FALLBACK_BOX;
    const b = im._b, cw = el.clientWidth, ch = el.clientHeight;
    let w, h, x, y;
    if (el.dataset.crop === "close") {
      w = (cw * 0.62) / b.hw; h = (w * FH) / FW;
      x = cw / 2 - b.hx * w; y = ch * 0.1 - b.y0 * h;
    } else {
      h = (ch * 0.9) / (b.y1 - b.y0); w = (h * FW) / FH;
      x = cw / 2 - ((b.x0 + b.x1) / 2) * w; y = ch * 0.05 - b.y0 * h;
    }
    im.style.width = `${w}px`;
    im.style.transform = `translate(${x}px, ${y}px)`;
  }
  const crops = $$(".crop");
  crops.forEach((el) => el.querySelector("img").addEventListener("load", () => layoutCrop(el)));

  let tiltX = 0, tiltY = 0, tX = 0, tY = 0;
  cdPin.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    tX = (e.clientX / vw - 0.5) * 2; tY = (e.clientY / vh - 0.5) * 2;
  });
  cdPin.addEventListener("pointerleave", () => { tX = 0; tY = 0; });

  function drawCard(p) {
    const enter = RM ? 1 : outExpo(seg(p, 0, 0.13));
    const exit = inOut(seg(p, 0.86, 0.97));
    const flip = inOut(seg(p, 0.48, 0.6)) * 180;
    tiltX = lerp(tiltX, tX, 0.08); tiltY = lerp(tiltY, tY, 0.08);
    cc.style.transform = `translateY(${(1 - enter) * 50 - exit * 30}vh) scale(${lerp(0.72, 1, enter) * lerp(1, 0.7, exit)})`;
    cc.style.opacity = 1 - seg(p, 0.9, 0.97);
    ccTilt.style.transform = `rotateY(${tiltX * 7}deg) rotateX(${-tiltY * 6}deg)`;
    ccFlip.style.transform = `rotateY(${flip + (1 - enter) * -22}deg)`;
    const side = outCubic(seg(p, 0.06, 0.16)) * (1 - seg(p, 0.84, 0.9));
    cdCopy.style.opacity = side;
    cdCopy.style.transform = `translateY(${(1 - side) * 30}px)`;
    cdCtl.style.opacity = side;
    cdCtl.style.transform = `translateY(${(1 - side) * 30}px)`;
    cdCtl.style.pointerEvents = side > 0.5 ? "auto" : "none";
    // Paper to velvet as the card leaves.
    const k = inOut(seg(p, 0.88, 1));
    const c = (a, b) => Math.round(lerp(a, b, k));
    cdPin.style.background = `rgb(${c(250, 5)},${c(247, 5)},${c(242, 5)})`;
    if (!userEd) setEd(p < 0.24 ? "standard" : p < 0.34 ? "cover" : p < 0.68 ? "night" : "standard");
  }

  /* ── Requirements ──────────────────────────────────────────────────── */
  const ft = $("[data-ft]");
  const ftView = $("[data-ft-view]"), ftImg = $("[data-ft-img]"), ftCrop = $("[data-ft-crop]");
  const ftMiss = $("[data-ft-miss]"), ftSpec = $("[data-ft-spec]"), ftList = $("[data-ft-list]");
  const ftSide = $(".ft__side");
  const BRIEF = [
    { n: "Full length", s: "Head to toe · 2:3", k: "full" },
    { n: "Three-quarter", s: "Crown to knee · 4:5", k: "three" },
    { n: "Waist up", s: "Crown to waist · 4:5", k: "waist" },
    { n: "Close-up", s: "Head and shoulders · 4:5", k: "close" },
    { n: "Close-up, hair up", s: "Hair off the face · 4:5", k: "miss" },
  ];
  ftList.innerHTML = BRIEF.map((r) => `<li><span class="ft__n">${r.n}</span><span class="ft__s">${r.s}</span><span class="ft__st">${r.k === "miss" ? "Missing" : "In your set"}</span></li>`).join("");
  const ftRows = [...ftList.children];
  let ftRects = null;
  function layoutFit() {
    if (!ftImg.complete || !ftImg.naturalWidth) return;
    ftImg._b = ftImg._b || boxOfFrame(97) || measure(ftImg) || FALLBACK_BOX;
    const b = ftImg._b, W = ftView.clientWidth, H = ftView.clientHeight;
    const ih = (H * 0.9) / (b.y1 - b.y0), iw = (ih * FW) / FH;
    const ix = W / 2 - ((b.x0 + b.x1) / 2) * iw, iy = H * 0.05 - b.y0 * ih;
    ftImg.style.width = `${iw}px`;
    ftImg.style.transform = `translate(${ix}px, ${iy}px)`;
    const bh = b.y1 - b.y0;
    const mk = (y0, y1, ar, cxF) => {
      const h = (y1 - y0) * ih, w = Math.min(W, h * ar);
      return { x: ix + cxF * iw - w / 2, y: iy + y0 * ih, w, h };
    };
    const bc = (b.x0 + b.x1) / 2;
    ftRects = [
      { x: 0, y: 0, w: W, h: H },
      mk(b.y0 - 0.025, b.y1 + 0.012, 2 / 3, bc),
      mk(b.y0 - 0.025, b.y0 + bh * 0.7, 0.8, bc),
      mk(b.y0 - 0.03, b.y0 + bh * 0.4, 0.8, b.hx),
      mk(b.y0 - 0.03, b.y0 + bh * 0.21, 0.8, b.hx),
    ];
  }
  ftImg.addEventListener("load", layoutFit);

  function drawFit(p) {
    const enter = outCubic(seg(p, 0, 0.08));
    ftView.style.opacity = enter;
    ftView.style.transform = `scale(${lerp(0.94, 1, enter)})`;
    ftSide.style.opacity = outCubic(seg(p, 0.02, 0.1));
    ftSide.style.transform = `translateY(${(1 - outCubic(seg(p, 0.02, 0.1))) * 30}px)`;
    if (!ftRects) layoutFit();
    if (!ftRects) return;
    const u = seg(p, 0.08, 0.86) * 5;
    const k = Math.min(4, Math.floor(u)), f = Math.min(1, u - k);
    const move = inOut(clamp(f / 0.4));
    let r;
    if (k < 4) r = lerpR(ftRects[k], ftRects[k + 1], move);
    else r = ftRects[4];
    ftCrop.style.width = `${r.w}px`;
    ftCrop.style.height = `${r.h}px`;
    ftCrop.style.transform = `translate(${r.x}px, ${r.y}px)`;
    const miss = k === 4 ? inOut(clamp(f / 0.3)) : 0;
    ftCrop.style.opacity = 1 - miss;
    ftMiss.style.opacity = miss;
    ftMiss.style.transform = `scale(${lerp(1.04, 1, miss)})`;
    ftSpec.textContent = `${BRIEF[k].n} · ${BRIEF[k].s.split(" · ")[1]}`;
    ftRows.forEach((li, j) => {
      const on = j === k;
      const done = j < k || (on && f > 0.42);
      li.classList.toggle("is-on", on);
      li.classList.toggle("is-ok", done && BRIEF[j].k !== "miss");
      li.classList.toggle("is-miss", done && BRIEF[j].k === "miss");
    });
  }

  /* ── The wait ──────────────────────────────────────────────────────── */
  const wt = $("[data-wt]");
  const wtN = $("[data-wt-n]"), wtH = $("[data-wt-h]"), wtSent = $("[data-wt-sent]"), wtEnd = $("[data-wt-end]");
  const wtTicks = $("[data-wt-ticks]");
  wtTicks.innerHTML = "<i></i>".repeat(30);
  const ticks = [...wtTicks.children];
  const wtDay = $(".wt__day");
  let dayShown = 0;
  function drawWait(p) {
    const day = 1 + Math.floor(29 * seg(p, 0.08, 0.68));
    if (day !== dayShown) {
      dayShown = day;
      wtN.textContent = day;
      ticks.forEach((t, i) => { t.classList.toggle("is-on", i < day); t.classList.toggle("is-last", i === day - 1 && day === 30); });
    }
    wtN.style.color = day === 30 ? "#c9a55a" : "";
    const lead = 1 - seg(p, 0.72, 0.78);
    const leadIn = outCubic(seg(p, 0, 0.08));
    wtH.style.opacity = lead * leadIn;
    wtH.style.transform = `translateY(${(1 - leadIn) * 30 - (1 - lead) * 40}px)`;
    wtSent.style.opacity = lead * leadIn;
    wtDay.style.opacity = lerp(1, 0.16, seg(p, 0.74, 0.82));
    const e = outCubic(seg(p, 0.78, 0.88));
    wtEnd.style.opacity = e;
    wtEnd.style.transform = `translateY(${(1 - e) * 40}px)`;
  }

  /* ── You ───────────────────────────────────────────────────────────── */
  const yu = $("[data-yu]");
  const ycv = $("[data-yu-cv]"), yctx = ycv.getContext("2d");
  const yuWm = $("[data-yu-wm]"), yuCopy = $(".yu__copy"), yuHint = $("[data-yu-hint]");
  let yTarget = 193, yFrame = 193, lastMove = -1e9, touched = false;
  yu.addEventListener("pointermove", (e) => {
    yTarget = 97 + 96 * clamp(e.clientX / vw);
    lastMove = performance.now();
    if (!touched) { touched = true; yuHint.style.opacity = 0; }
  });
  function drawYou(enter, t) {
    yctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    yctx.clearRect(0, 0, vw, vh);
    if (t - lastMove > 2600) yTarget = 184 + Math.sin(t / 1400) * 9; // idle: she breathes through the last poses
    yFrame = lerp(yFrame, yTarget, 0.12);
    const s = narrow ? 0.6 : 0.95, cx = narrow ? 0.5 : 0.64, by = narrow ? 1.02 : 1.03;
    const r = frameRect(s, cx, by + (1 - enter) * 0.12);
    drawFig(yctx, frameImg(yFrame), r, enter);
    yuWm.style.opacity = enter;
    yuWm.style.transform = `translateY(${(1 - enter) * 20}%)`;
    yuCopy.style.opacity = enter;
    yuCopy.style.transform = `translateY(${(1 - enter) * 40}px)`;
  }

  /* ── Chrome: header theme, timecode ───────────────────────────────── */
  const hd = $("[data-hd]"), tc = $("[data-tc]");
  const tcTime = $("[data-tc-time]"), tcCh = $("[data-tc-ch]");
  const RUNTIME = 94; // seconds: the page as one take
  const fmt = (s) => {
    const fr = Math.floor((s % 1) * 25), ss = Math.floor(s) % 60, mm = Math.floor(s / 60);
    return `00:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
  };

  /* ── Layout ────────────────────────────────────────────────────────── */
  function resize() {
    vw = innerWidth;
    vh = stagePin.clientHeight || innerHeight;
    narrow = vw < 820;
    dpr = Math.min(2, devicePixelRatio || 1);
    for (const c of [cv, off, ycv]) { c.width = Math.round(vw * dpr); c.height = Math.round(vh * dpr); }
    GUT = parseFloat(getComputedStyle(heroFoot).left) || 64;
    layoutWord();
    crops.forEach(layoutCrop);
    ftRects = null; layoutFit();
    lastCall = -2;
    dirty = true;
  }
  let rT;
  addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(resize, 80); });

  /* ── Loop ──────────────────────────────────────────────────────────── */
  const prog = (el) => {
    const r = el.getBoundingClientRect();
    const total = r.height - vh;
    return { p: total > 0 ? clamp(-r.top / total) : 0, top: r.top, bottom: r.bottom, near: r.bottom > -vh * 0.2 && r.top < vh * 1.2 };
  };
  let lenis = null;

  function frame(t) {
    lenis?.raf(t);
    const S = prog(stage), C = prog(cd), F = prog(ft), W = prog(wt), Y = prog(yu);
    if (S.near) drawStage(S.p, t);
    if (C.near) drawCard(C.p);
    if (F.near) drawFit(F.p);
    if (W.near) drawWait(W.p);
    if (Y.near) drawYou(outCubic(clamp(1 - Y.top / vh)), t);

    // Header polarity: paper under it?
    const light = (S.top <= 40 && S.bottom > 40 && S.p > 0.975) || (C.top <= 40 && C.bottom > 40 && C.p < 0.93);
    hd.classList.toggle("is-light", light);
    tc.classList.toggle("is-light", light);
    tc.classList.toggle("is-hidden", narrow || Y.top < vh * 0.6 || (C.top <= vh && C.bottom > vh && C.p > 0.02 && C.p < 0.9 && vw < 1100));

    const max = document.documentElement.scrollHeight - innerHeight;
    tcTime.textContent = fmt((scrollY / Math.max(1, max)) * RUNTIME);
    let ch = "Arrival";
    if (S.top <= 0 && S.bottom > 0) ch = S.p < 0.28 ? "Arrival" : S.p < 0.54 ? "Measure" : "Digitals";
    if (C.top <= vh * 0.5 && C.bottom > vh * 0.5) ch = "Comp card";
    if (F.top <= vh * 0.5 && F.bottom > vh * 0.5) ch = "Requirements";
    if (W.top <= vh * 0.5 && W.bottom > vh * 0.5) ch = "The wait";
    if (Y.top <= vh * 0.5) ch = "You";
    if (tcCh.textContent !== ch) tcCh.textContent = ch;

    requestAnimationFrame(frame);
  }

  /* ── Start ─────────────────────────────────────────────────────────── */
  const ldN = $("[data-ld-n]");
  const ldTick = setInterval(() => { ldN.textContent = String(Math.min(100, Math.round((loaded / 60) * 100))).padStart(3, "0"); }, 60);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  scrollTo(0, 0);

  const fontsReady = document.fonts ? document.fonts.load(`300 100px "Noto Serif Display"`).then(() => document.fonts.ready) : Promise.resolve();
  const loading = loadAll();
  const firstFrames = new Promise((res) => { const iv = setInterval(() => { if (loaded >= 24) { clearInterval(iv); res(); } }, 50); });
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    try { resize(); } catch (e) { console.error(e); }
    clearInterval(ldTick);
    ldN.textContent = "100";
    html.classList.add("is-in");
    introStart = performance.now() + (RM ? 0 : 350);
    entered = true;
    if (window.Lenis && !RM) lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    requestAnimationFrame(frame);
  };
  Promise.all([fontsReady, Promise.race([firstFrames, new Promise((r) => setTimeout(r, 6000))]), new Promise((r) => setTimeout(r, RM ? 0 : 900))]).then(start, start);
  setTimeout(start, 8000); // never hold the page behind the loader
  loading.then(() => { crops.forEach(layoutCrop); });
})();
