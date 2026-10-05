/*
 * The comp-card chapter, as one camera.
 *
 *   prologue   the last frame of the previous chapter: the camera on her,
 *              "The wait has a date.", and the push in until her black is
 *              the whole frame
 *   the edge   out of that black, a card, edge-on: a hairline of light
 *              coming out of the dark, until it turns and is the whole frame
 *   the planes the cover taken apart in depth: photograph, masthead, the
 *              figure cut from the same frame, the cover lines
 *   macro      the camera down on the masthead's hairlines, then her eyes
 *   the turn   lifted and turned over in the hand; the back, read
 *   directions the camera travels through the dark past five more cards,
 *              each facing you as you come, turning as you pass
 *   the hand   they come back past you into a hand, and the hand is squared
 *
 * One scroll position, smoothed once; everything is a function of it,
 * in `v`: scroll in viewport heights × 100.
 */
(function () {
  const { B, BH, list } = window.CARDS;
  const P = 1200; // perspective, px
  const PLANE = 230; // distance between the cover's planes, taken apart

  // ── Easing and time ─────────────────────────────────────────────────────

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = (t) => 1 - Math.pow(1 - t, 3);
  const outQuint = (t) => 1 - Math.pow(1 - t, 5);
  const inn = (t) => t * t * t;
  const seg = (v, a, b, ease = inOut) => ease(clamp((v - a) / (b - a)));
  const smooth = (x, a, b) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  const TOTAL = 2000; // v

  // ── Stage ───────────────────────────────────────────────────────────────

  let W = innerWidth;
  let H = innerHeight;
  let narrow = W < 768;
  let S0 = 1;
  const measure = () => {
    W = innerWidth;
    H = innerHeight;
    narrow = W < 768;
    S0 = Math.min((0.74 * H) / BH, (narrow ? 0.78 : 0.5) * W / B);
    document.getElementById("scroll").style.height = `${(TOTAL + 100) * H / 100}px`;
  };
  measure();
  addEventListener("resize", measure);

  // ── Prologue: the previous chapter's last beat ──────────────────────────

  const seq = document.getElementById("seq");
  const ctx = seq.getContext("2d");
  const FRAMES = [];
  for (let n = 141; n <= 193; n += 2) FRAMES.push(n);
  const frames = FRAMES.map((n) => {
    const im = new Image();
    im.src = `../hero/seq/seq-${String(n).padStart(3, "0")}.webp`;
    return im;
  });
  let drawn = -1;
  const drawFrame = (i) => {
    const im = frames[i];
    if (i === drawn || !im.complete || !im.naturalWidth) return;
    ctx.clearRect(0, 0, 970, 1640);
    ctx.drawImage(im, 0, 0, 970, 1640);
    drawn = i;
  };
  frames[frames.length - 1].onload = () => drawFrame(0);
  frames[0].onload = () => drawFrame(0);

  const waitA = document.querySelector(".wait__a");
  const waitB = document.querySelector(".wait__b");
  const prologue = document.getElementById("prologue");

  function renderPrologue(v) {
    if (v > 190) {
      prologue.style.visibility = "hidden";
      return;
    }
    prologue.style.visibility = "visible";
    drawFrame(Math.round(seg(v, 0, 120, (t) => t) * (frames.length - 1)));

    // The camera as the previous chapter left it: chest up, right of frame.
    const ph = H;
    const pw = (H * 970) / 1640;
    const left = (W - pw) / 2;
    const S = narrow ? 1.46 : 1.944;
    const tx = left + (narrow ? 0.04 : 0.17) * W;
    const ty = (narrow ? 0.37 : 0.46) * H;
    const base = `translate(${tx}px, ${ty}px) translate(${pw / 2}px, ${ph / 2}px) scale(${S}) translate(${-pw / 2}px, ${-ph / 2}px)`;
    // ...and on into the black of her top, until it is the frame.
    const chest = { x: tx + pw / 2, y: ty + ph / 2 + S * (0.36 - 0.5) * ph };
    const k = seg(v, 55, 175, (t) => t * t * t * (t * (6 * t - 15) + 10));
    const zoom = lerp(1, 9, Math.pow(k, 1.4));
    const cx = lerp(chest.x, W / 2, k);
    const cy = lerp(chest.y, H / 2, k);
    seq.style.transform = `translate(${cx}px, ${cy}px) scale(${zoom}) translate(${-chest.x}px, ${-chest.y}px) ${base}`;
    seq.style.opacity = String(1 - seg(v, 150, 178, (t) => t));

    // The line leaves first, up and out, ahead of the camera.
    const up = seg(v, 30, 95, inn) * -H * 0.9;
    waitA.style.transform = `translateY(${up}px)`;
    waitB.style.transform = `translateY(${up * 1.25}px)`;
  }

  // ── Cards ───────────────────────────────────────────────────────────────

  const world = document.getElementById("world");

  /*
   * The proof: what a printer's sheet carries around a card before it is
   * cut. Crop marks at the trim, registration targets, a tonal step bar
   * in the house's own values, and the job's slug. Drawn in the card's own
   * plane, so it turns with it.
   */
  const PROOF = (c, side) => {
    const L = 64;
    const G = 34;
    const marks = [
      [-G - L, 0, L, 0], [0, -G - L, 0, L], // top left
      [B + G, 0, L, 0], [B, -G - L, 0, L],
      [-G - L, BH, L, 0], [0, BH + G, 0, L],
      [B + G, BH, L, 0], [B, BH + G, 0, L],
    ]
      .map(([x, y, w, h]) => `<i style="left:${x}px;top:${y}px;width:${w || 2}px;height:${h || 2}px"></i>`)
      .join("");
    const target = (x, y) => `<b class="reg" style="left:${x - 22}px;top:${y - 22}px"></b>`;
    const steps = ["#050505", "#1a1814", "#3a352d", "#6b6253", "#a39783", "#d4cabb", "#faf7f2", "#c9a55a"]
      .map((col, i) => `<u style="left:${i * 30}px;background:${col}"></u>`)
      .join("");
    const slug = `OLA SZKOLDA&nbsp;&nbsp;·&nbsp;&nbsp;${c.name.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;${side.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;5.5 × 8.5 IN&nbsp;&nbsp;·&nbsp;&nbsp;350 GSM MATT`;
    return `${marks}${target(B / 2, -G - 46)}${target(B / 2, BH + G + 46)}${target(-G - 46, BH / 2)}${target(B + G + 46, BH / 2)}
      <div class="steps" style="left:0;top:${BH + G + 26}px">${steps}</div>
      <div class="slug" style="left:${B}px;top:${BH + G + 30}px">${slug}</div>`;
  };
  const OVERLAYS = '<div class="grain"></div><div class="shade"></div><div class="sheen"></div>';
  const cards = list.map((c, i) => {
    const el = document.createElement("div");
    el.className = "card";
    const planes = c.id === "cover";
    el.innerHTML = `
      <div class="drop"></div>
      <div class="face back" style="background:${c.bbg}">${c.back()}<div class="grain"></div><div class="shade"></div><div class="sheen"></div></div>
      <div class="face front${planes ? " planes" : ""}" style="background:${c.fbg}">${c.front()}${planes ? "" : OVERLAYS}</div>
      <div class="edge"></div>
      <div class="proof front">${PROOF(c, "front")}</div>
      <div class="proof back">${PROOF(c, "back")}</div>`;
    world.appendChild(el);
    // Blend modes flatten a 3D context, so on the cover's planes the paper's
    // overlays live on the photograph's own plane.
    if (planes) el.querySelector('.layer[data-z="0"]').insertAdjacentHTML("beforeend", OVERLAYS);
    return {
      ...c,
      i,
      el,
      layers: [...el.querySelectorAll(".layer")],
      shades: [...el.querySelectorAll(".shade")],
      sheens: [...el.querySelectorAll(".sheen")],
      edge: el.querySelector(".edge"),
      proofs: [...el.querySelectorAll(".proof")],
      drop: el.querySelector(".drop"),
      m: null,
    };
  });

  // Pointer: the whole camera leans a little toward the hand.
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / W - 0.5) * 2;
    pointer.ty = (e.clientY / H - 0.5) * 2;
  });

  const HIDDEN = { hidden: true };

  /** Cover: the hero of the chapter, from the edge to the turn. */
  function coverPose(v) {
    if (v < 168) return HIDDEN;
    let p = { x: 0, y: 0, z: -9000, rx: 0, ry: 90, rz: 0, s: S0, explode: 0 };

    // The edge: out of the black, a hairline, coming.
    p.z = lerp(-9000, -380, seg(v, 168, 262, outQuint));
    // It turns and is the frame.
    const open = seg(v, 248, 345, inOut);
    p.ry = lerp(90, -12, open);
    p.z = lerp(p.z, 430, seg(v, 255, 345, inOut));
    // ...then settles back to arm's length.
    const settle = seg(v, 345, 430, inOut);
    p.z = lerp(p.z, 0, settle);
    p.ry = lerp(p.ry, -7, settle);
    p.rx = lerp(0, 3, settle);

    // The planes.
    const turn = seg(v, 470, 545, inOut);
    const back = seg(v, 640, 710, inOut);
    const k = turn * (1 - back);
    p.ry = lerp(p.ry, -42, k);
    p.rx = lerp(p.rx, 20, k);
    p.rz = lerp(0, -3, k);
    p.z = lerp(p.z, narrow ? -900 : -420, k);
    p.explode = seg(v, 505, 575, inOut) * (1 - seg(v, 610, 668, inOut));
    // Hold the stack of planes on the centre of the frame, not its back.
    const mid = 1.5 * PLANE * p.explode * p.s;
    p.x += -Math.sin((p.ry * Math.PI) / 180) * mid * Math.cos((p.rx * Math.PI) / 180);
    p.y += Math.sin((p.rx * Math.PI) / 180) * mid;
    p.z -= mid * 0.6;

    // Macro: the masthead's hairlines, then her eyes.
    const m1 = seg(v, 715, 785, inOut);
    const drift = seg(v, 785, 845, (t) => t);
    const m2 = seg(v, 845, 900, inOut);
    const pull = seg(v, 900, 965, inOut);
    const mz = lerp(0, P * (1 - 1 / 3.3), m1);
    const mz2 = P * (1 - 1 / 4.4);
    const mast = { x: lerp(320, -320, drift), y: 205 };
    const eyes = { x: 505, y: 372 };
    const fx = lerp(B / 2 - (B / 2 + mast.x), B / 2 - eyes.x, m2);
    const fy = lerp(BH / 2 - mast.y, BH / 2 - eyes.y, m2);
    const macro = m1 * (1 - pull);
    p.z = lerp(p.z, lerp(mz, mz2, m2), macro);
    p.x = lerp(p.x, fx * S0, macro);
    p.y = lerp(p.y, fy * S0, macro);
    p.ry = lerp(p.ry, -1.5, macro);
    p.rx = lerp(p.rx, 0, macro);

    // The turn: lifted, turned over in the hand, set down.
    const lift = seg(v, 975, 1040, out) * (1 - seg(v, 1045, 1100, inOut));
    const flip = seg(v, 990, 1085, inOut);
    p.z += lift * 260;
    p.ry = lerp(p.ry, 174, flip);
    p.rx += Math.sin(flip * Math.PI) * 9;
    p.ry += seg(v, 1100, 1180, (t) => t) * 10;
    return p;
  }

  // ── Directions: slots in the dark ───────────────────────────────────────

  const D = 2500;
  const slot = (k) => {
    const side = k % 2 === 0 ? -1 : 1;
    return { side, x: side * (narrow ? 0.1 : 0.22) * W, y: (k % 2 ? 0.02 : -0.015) * H, z: -k * D };
  };
  const FLY = [1185, 1290, 1720]; // pull back, travel start, travel end
  const camZAt = (v) => {
    const back = seg(v, FLY[0], FLY[1], inOut) * 900;
    const travel = seg(v, FLY[1], FLY[2], (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2));
    return back - travel * (5 * D + 2300);
  };
  /** Facing you as you come; turning to show its back as you pass. */
  const passRy = (side, zr) => lerp(-side * 26, 180 - side * 26, smooth(zr, -1300, 250));

  function flyPose(k, v) {
    const s = slot(k);
    const zr = s.z - camZAt(v);
    return { x: s.x, y: s.y, z: zr, rx: 2, ry: passRy(s.side, zr), rz: s.side * -1.2, s: S0, fog: clamp((-zr - 2500) / 9000) };
  }

  // ── The hand ────────────────────────────────────────────────────────────

  // Order in the hand, left to right; the cover lies on top, right of centre.
  const HAND = [1, 2, 4, 0, 3, 5];
  const HAND_IN = 1735;
  function handPose(k, v) {
    const pos = HAND.indexOf(k);
    const n = HAND.length;
    const a = (pos - (n - 1) / 2) * (narrow ? 5.5 : 8.5);
    const R = (narrow ? 0.75 : 1.15) * H;
    const sF = S0 * (narrow ? 0.5 : 0.66);
    const fan = {
      x: Math.sin((a * Math.PI) / 180) * R,
      y: -H * 0.03 + R - Math.cos((a * Math.PI) / 180) * R,
      z: (k === 0 ? 40 : pos * 4) - 120,
      rx: 6,
      ry: -4,
      rz: a,
      s: sF,
    };
    const jitter = [3.2, -2.4, 1.6, 0, -3.4, 2.6][pos];
    const deck = { x: (narrow ? 0 : 0.14 * W) + [-14, 10, -6, 0, 16, -10][pos], y: H * 0.02 - pos * 5, z: (k === 0 ? 60 : pos * 6) - 60, rx: 14, ry: -18, rz: jitter, s: S0 * 0.86 };

    const t0 = HAND_IN + pos * 9;
    const come = seg(v, t0, t0 + 70, outQuint);
    const sq = seg(v, 1840, 1910, inOut);
    // From behind the camera, past you, into the hand.
    const from = { x: (pos < n / 2 ? -1 : 1) * W * 0.55, y: -H * 0.25 + pos * 30, z: P * 0.92, rx: -10, ry: 160, rz: a * 3, s: S0 };
    const mix = (key) => lerp(lerp(from[key], fan[key], come), deck[key], sq);
    return { x: mix("x"), y: mix("y"), z: mix("z"), rx: mix("rx"), ry: mix("ry"), rz: mix("rz"), s: mix("s"), drop: sq };
  }

  function pose(k, v) {
    if (v >= HAND_IN) return handPose(k, v);
    if (k === 0) {
      if (v < FLY[0]) return coverPose(v);
      // From the back it shows into its slot, and the dark opens behind it.
      const from = coverPose(FLY[0]);
      const f = flyPose(0, v);
      const e = seg(v, FLY[0], FLY[1] + 40, inOut);
      return { ...f, x: lerp(from.x, f.x, e), y: lerp(from.y, f.y, e), z: lerp(from.z, f.z, e), rx: lerp(from.rx, f.rx, e), ry: lerp(from.ry, f.ry + 360, e), rz: lerp(0, f.rz, e) };
    }
    if (v < FLY[0]) return HIDDEN;
    const f = flyPose(k, v);
    // The far ones come up out of the dark as the camera pulls back.
    f.fog = Math.max(f.fog, 1 - seg(v, FLY[0], FLY[1], (t) => t));
    return f;
  }

  /** The proof sheet shows while the cover is held to be read. */
  const proofAt = (v) =>
    smooth(v, 395, 440) * (1 - smooth(v, 468, 500)) + smooth(v, 1095, 1130) * (1 - smooth(v, 1175, 1200));

  const cardMatrix = (p, crx, cry) =>
    `translate(${W / 2}px, ${H / 2}px) perspective(${P}px) rotateX(${crx}deg) rotateY(${cry}deg) translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.s}) translate(${-B / 2}px, ${-BH / 2}px)`;

  function renderCards(v) {
    const crx = -pointer.y * 2.2;
    const cry = pointer.x * 3.2;
    const order = [];
    cards.forEach((c, k) => {
      const p = pose(k, v);
      if (p.hidden || p.z > P * 0.8) {
        c.el.style.visibility = "hidden";
        c.m = null;
        return;
      }
      const t = cardMatrix(p, crx, cry);
      c.el.style.visibility = "visible";
      c.el.style.transform = t;
      c.m = t;
      c.p = p;
      order.push([p.z, c]);

      // Light: the face darkens as it turns away, and with distance.
      const ry = (p.ry * Math.PI) / 180;
      const turn = 1 - Math.abs(Math.cos(ry));
      const fog = p.fog || 0;
      c.shades.forEach((s) => (s.style.opacity = String(Math.min(0.92, turn * 0.55 + fog * 0.85))));
      const sheen = 50 - Math.sin(ry) * 140 + pointer.x * 22 - p.rx * 2;
      c.sheens.forEach((s) => (s.style.backgroundPosition = `${sheen}% 0`));
      c.edge.style.opacity = String(Math.pow(Math.abs(Math.sin(ry)), 40) * (1 - fog));
      c.drop.style.opacity = String((p.drop || 0) * 0.9);
      // Foil catches the light as the card turns and as the hand moves.
      c.el.style.setProperty("--foil", `${50 + Math.sin(ry) * 90 - p.rx * 3 + pointer.x * 26}%`);
      const proof = k === 0 ? proofAt(v) : 0;
      c.proofs.forEach((pr) => (pr.style.opacity = String(proof)));
      if (c.layers.length) {
        const e = p.explode || 0;
        c.layers.forEach((l) => {
          const z = Number(l.dataset.z);
          l.style.transform = e ? `translateZ(${z * PLANE * e}px)` : "";
          // Ink printed on the photograph is near-black; lifted off it into
          // the dark, the type catches the light instead.
          if (z === 1 || z === 3) l.style.filter = e ? `invert(${e * 0.94})` : "";
        });
      }
    });
    order.sort((a, b) => a[0] - b[0]).forEach(([, c], i) => (c.el.style.zIndex = String(10 + i)));
  }

  // ── Notes: a few small annotations, anchored to the object ──────────────

  const notesEl = document.getElementById("notes");
  const svg = document.getElementById("leaders");
  const NS = "http://www.w3.org/2000/svg";

  /*
   * Each note points at a place on a card: [x, y] in the face's own
   * pixels, the plane it lies on (cover only), the side of the card it
   * is on, the window in `v` it shows in, and where its label stands
   * from the point, in px.
   */
  const NOTES = [
    { card: 0, at: [0, 0], k: "01", label: "Front", sub: "one image, her name", v: [395, 470], off: [-40, -26], align: "right" },
    { card: 0, at: [1000, 1545], k: "", label: "5.5 × 8.5 in", sub: "A5 in Europe", v: [405, 470], off: [36, 6] },
    { card: 0, at: [1000, 1200], plane: 0, k: "i", label: "Photograph", sub: "hers, an editorial three-quarter", v: [540, 625], off: [60, 30] },
    { card: 0, at: [880, 210], plane: 1, k: "ii", label: "Masthead", sub: "her name, set behind her", v: [548, 625], off: [80, -40] },
    { card: 0, at: [470, 760], plane: 2, k: "iii", label: "Figure", sub: "cut from the same frame", v: [556, 625], off: [-140, 40], align: "right" },
    { card: 0, at: [140, 300], k: "", label: "Bodoni Moda", sub: "a masthead is a name", v: [770, 840], off: [0, 0], screen: [0.07, 0.8] },
    { card: 0, at: [60, 60], back: true, k: "01", label: "Back", sub: "four sittings, four jobs", v: [1100, 1182], off: [-40, -10], align: "right" },
    { card: 0, at: [60, 820], back: true, k: "", label: "Full length", sub: "proportions, honestly", v: [1108, 1182], off: [-44, 0], align: "right" },
    { card: 0, at: [60, 1290], back: true, k: "", label: "Measurements", sub: "agency order, cm and inches", v: [1116, 1182], off: [-44, 14], align: "right" },
    { card: 0, at: [60, 1480], back: true, k: "", label: "Bookings", sub: "where she is booked", v: [1124, 1182], off: [-44, 34], align: "right" },
  ];
  // One caption per card, riding it through the dark.
  list.forEach((c, k) => {
    NOTES.push({ card: k, at: [0, 0], k: String(k + 1).padStart(2, "0"), label: c.name, sub: c.sub, fly: true, off: [0, -22] });
  });

  NOTES.forEach((n) => {
    const el = document.createElement("div");
    el.className = `note${n.align === "right" ? " right" : ""}`;
    el.innerHTML = `<span class="note__k">${n.k ? `<b>${n.k}</b>` : ""}${n.label}</span>${n.sub ? `<span class="note__s">${n.sub}</span>` : ""}`;
    notesEl.appendChild(el);
    n.el = el;
    if (!n.fly && !n.screen) {
      n.line = document.createElementNS(NS, "line");
      n.dot = document.createElementNS(NS, "circle");
      n.dot.setAttribute("r", "2.5");
      svg.appendChild(n.line);
      svg.appendChild(n.dot);
    }
  });

  function project(c, x, y, z) {
    const m = new DOMMatrix(c.m);
    const q = m.transformPoint(new DOMPoint(x, y, z, 1));
    return { x: q.x / q.w, y: q.y / q.w };
  }

  function renderNotes(v) {
    NOTES.forEach((n) => {
      const c = cards[n.card];
      let a = 0;
      let x = 0;
      let y = 0;
      if (n.fly) {
        if (c.m && v > FLY[1] - 60 && v < HAND_IN) {
          const zr = c.p.z;
          a = smooth(zr, -3400, -2300) * (1 - smooth(zr, -900, -300));
          const q = project(c, 0, 0, 0);
          const r = project(c, B, 0, 0);
          const left = c.p.x > 0 ? Math.max(q.x, r.x) + 28 : Math.min(q.x, r.x) - 28;
          x = left;
          y = Math.min(q.y, r.y) + 6;
          n.el.classList.toggle("right", c.p.x <= 0);
          n.el.style.transform = `translate(${x}px, ${y}px) translateX(${c.p.x <= 0 ? -100 : 0}%)`;
        }
        n.el.style.opacity = String(a);
        return;
      }
      // A phone has no margin beside the card for a note to stand in; the
      // slug and the captions carry it there.
      if (narrow && !n.screen) {
        n.el.style.opacity = "0";
        n.line.style.opacity = "0";
        n.dot.style.opacity = "0";
        return;
      }
      const [v0, v1] = n.v;
      a = smooth(v, v0, v0 + 18) * (1 - smooth(v, v1 - 18, v1));
      if (!c.m || a <= 0) {
        n.el.style.opacity = "0";
        if (n.line) {
          n.line.style.opacity = "0";
          n.dot.style.opacity = "0";
        }
        return;
      }
      if (n.screen) {
        x = n.screen[0] * W;
        y = n.screen[1] * H;
        n.el.style.opacity = String(a);
        n.el.style.transform = `translate(${x}px, ${y + (1 - a) * 14}px)`;
        return;
      }
      const e = (c.p && c.p.explode) || 0;
      const z = n.back ? -1.5 : 1.5 + (n.plane != null ? n.plane * PLANE * e : 0);
      const lx = n.back ? B - n.at[0] : n.at[0];
      const pt = project(c, lx, n.at[1], z);
      const lx2 = pt.x + n.off[0];
      const ly2 = pt.y + n.off[1];
      n.el.style.opacity = String(a);
      const shift = n.align === "right" ? "-100%" : "0%";
      n.el.style.transform = `translate(${lx2 + (n.align === "right" ? -10 : 10)}px, ${ly2 - 8 + (1 - a) * 10}px) translateX(${shift})`;
      n.line.setAttribute("x1", pt.x);
      n.line.setAttribute("y1", pt.y);
      n.line.setAttribute("x2", lx2);
      n.line.setAttribute("y2", ly2);
      n.line.style.opacity = String(a);
      n.dot.setAttribute("cx", pt.x);
      n.dot.setAttribute("cy", pt.y);
      n.dot.style.opacity = String(a);
    });
  }

  // ── The room ────────────────────────────────────────────────────────────
  //
  // The dark is a room, not a void: a pool of warm light that follows the
  // card the camera is on, her name at architectural scale in the house's
  // gold hairline drifting in the depth behind it, and the job's slug at
  // the foot of the frame saying what we are looking at.

  const light = document.getElementById("light");
  const bgname = document.getElementById("bgname");
  const slugEl = document.getElementById("slug");
  const countEl = document.getElementById("count");
  let lastSlug = "";

  function focusCard(v) {
    if (v < FLY[0] || v >= HAND_IN) return cards[0];
    // The subject is the nearest card still in front of the lens.
    let best = null;
    let bestZ = -Infinity;
    cards.forEach((c) => {
      if (!c.m || c.p.z > 450) return;
      if (c.p.z > bestZ) {
        bestZ = c.p.z;
        best = c;
      }
    });
    return best || cards[0];
  }

  function renderRoom(v) {
    const f = focusCard(v);
    let lx = W / 2;
    let ly = H / 2;
    if (f && f.m) {
      const q = project(f, B / 2, BH / 2, 0);
      lx = q.x;
      ly = q.y;
    }
    const on = smooth(v, 240, 360);
    light.style.transform = `translate(${lx}px, ${ly}px)`;
    light.style.opacity = String(on);

    // Her name, behind everything, travelling the whole chapter once.
    const k = v / TOTAL;
    const depth = 1 + seg(v, FLY[1], FLY[2], (t) => t) * 0.9;
    const x = lerp(18, -78, k) * (W / 100);
    bgname.style.transform = `translate(${x - pointer.x * 18}px, ${-pointer.y * 10}px) translateY(-50%) scale(${depth})`;
    bgname.style.opacity = String(smooth(v, 300, 420) * (1 - smooth(v, 700, 760) * 0.85 + smooth(v, 900, 980) * 0.85));

    // The slug: what this is, where we are in it.
    let slug = "";
    let idx = 1;
    const side = (c) => {
      const a = ((((c.p ? c.p.ry : 0) % 360) + 360) % 360);
      return a > 90 && a < 270 ? "BACK" : "FRONT";
    };
    if (v >= 240 && v < 470) slug = "COVER — FRONT";
    else if (v < 700 && v >= 470) slug = "COVER — CONSTRUCTION";
    else if (v < 930 && v >= 700) slug = "COVER — DETAIL";
    else if (v < FLY[0] && v >= 930) slug = `COVER — ${side(cards[0])}`;
    else if (v >= FLY[0] && v < HAND_IN) {
      idx = f.i + 1;
      slug = `${f.name.toUpperCase()} — ${side(f)}`;
    } else if (v >= HAND_IN) {
      idx = 6;
      slug = "SIX DIRECTIONS — ONE LIBRARY";
    }
    const full = slug ? `OLA SZKOLDA&nbsp;&nbsp;·&nbsp;&nbsp;COMP CARD&nbsp;&nbsp;·&nbsp;&nbsp;${slug}` : "";
    if (full !== lastSlug) {
      slugEl.innerHTML = full;
      countEl.innerHTML = slug ? `<b>${String(idx).padStart(2, "0")}</b> / 06` : "";
      lastSlug = full;
    }
    const chrome = String(smooth(v, 240, 300));
    slugEl.style.opacity = chrome;
    countEl.style.opacity = chrome;
  }

  // ── Finale ──────────────────────────────────────────────────────────────

  const finA = document.querySelector(".finale__a");
  const finB = document.querySelector(".finale__b");
  function renderFinale(v) {
    const a = seg(v, 1880, 1960, outQuint);
    const b = seg(v, 1900, 1980, outQuint);
    finA.style.transform = `translateY(${(1 - a) * H * 0.8}px)`;
    finB.style.transform = `translateY(${(1 - b) * H * 0.8}px)`;
    finA.style.visibility = a > 0 ? "visible" : "hidden";
    finB.style.visibility = b > 0 ? "visible" : "hidden";
  }

  // ── Loop ────────────────────────────────────────────────────────────────

  const hint = document.getElementById("hint");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = (scrollY / H) * 100;
  function frame() {
    const target = (scrollY / H) * 100;
    cur += (target - cur) * (reduce ? 1 : 0.085);
    if (Math.abs(target - cur) < 0.01) cur = target;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    renderPrologue(cur);
    renderCards(cur);
    renderNotes(cur);
    renderRoom(cur);
    renderFinale(cur);
    hint.style.opacity = cur > 20 ? "0" : "1";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // For scrubbing in a browser: jump straight to a position.
  window.__seek = (v) => {
    scrollTo(0, (v / 100) * H);
    cur = v;
  };
})();
