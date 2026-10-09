import { CARDS, type CardDesign } from "./designs";

/**
 * The comp-card chapter's camera, as imperative DOM: six real cards that
 * turn in 3D and stay crisp, a room around them, and a few notes anchored
 * to the object. The story is in `./motion.ts`. Every pose is a function
 * of `v` alone, so the stage can scrub it backwards and forwards.
 *
 * The prologue's figure is the hero's own (`prologueCamera`); this layer is
 * empty until the black of her top is the frame.
 */

const { B, BH, list } = CARDS;
const P = 1200; // perspective, px
const PLANE = 230; // distance between the cover's planes, taken apart

// ── Easing and time ─────────────────────────────────────────────────────

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const out = (t: number) => 1 - Math.pow(1 - t, 3);
const outQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const inn = (t: number) => t * t * t;
const linear = (t: number) => t;
const seg = (v: number, a: number, b: number, ease: (t: number) => number = inOut) =>
  ease(clamp((v - a) / (b - a)));
const smooth = (x: number, a: number, b: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Her name crosses the room once over the chapter proper. */
const NAME_TRAVEL = 2000;

// ── Poses ───────────────────────────────────────────────────────────────

interface Pose {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
  explode?: number;
  fog?: number;
  drop?: number;
  hidden?: false;
}
type MaybePose = Pose | { hidden: true };

const HIDDEN = { hidden: true } as const;

const FLY = [1185, 1290, 1720]; // pull back, travel start, travel end
const D = 2500; // depth between cards in the dark
const HAND = [1, 2, 4, 0, 3, 5]; // order in the hand, left to right
const HAND_IN = 1735;
/** Handed on: the finale leaves, the five go, the cover is set at its rest. */
const HANDOFF = { chrome: [2000, 2040], finale: [2020, 2080], others: [2040, 2110], cover: [2060, 2150], room: [2050, 2130] } as const;

interface Card extends CardDesign {
  i: number;
  el: HTMLDivElement;
  layers: HTMLElement[];
  shades: HTMLElement[];
  sheens: HTMLElement[];
  edge: HTMLElement;
  proofs: HTMLElement[];
  drop: HTMLElement;
  m: string | null;
  p: Pose | null;
}

interface Note {
  card: number;
  at: [number, number];
  plane?: number;
  back?: boolean;
  k: string;
  label: string;
  sub: string;
  v?: [number, number];
  off: [number, number];
  align?: "right";
  screen?: [number, number];
  fly?: boolean;
  el?: HTMLDivElement;
  line?: SVGLineElement;
  dot?: SVGCircleElement;
}

export interface Rest {
  cx: number;
  cy: number;
  width: number;
}

export interface Chapter {
  render(v: number, pointer: { x: number; y: number }): void;
  resize(w: number, h: number, rest: Rest): void;
  destroy(): void;
}

/*
 * The proof: what a printer's sheet carries around a card before it is
 * cut. Crop marks at the trim, registration targets, a tonal step bar
 * in the house's own values, and the job's slug. Drawn in the card's own
 * plane, so it turns with it.
 */
function proof(c: CardDesign, side: string) {
  const L = 64;
  const G = 34;
  const marks = [
    [-G - L, 0, L, 0], [0, -G - L, 0, L],
    [B + G, 0, L, 0], [B, -G - L, 0, L],
    [-G - L, BH, L, 0], [0, BH + G, 0, L],
    [B + G, BH, L, 0], [B, BH + G, 0, L],
  ]
    .map(([x, y, w, h]) => `<i style="left:${x}px;top:${y}px;width:${w || 2}px;height:${h || 2}px"></i>`)
    .join("");
  const target = (x: number, y: number) => `<b class="reg" style="left:${x - 22}px;top:${y - 22}px"></b>`;
  const steps = ["#050505", "#1a1814", "#3a352d", "#6b6253", "#a39783", "#d4cabb", "#faf7f2", "#c9a55a"]
    .map((col, i) => `<u style="left:${i * 30}px;background:${col}"></u>`)
    .join("");
  const slug = `OLA SZKOLDA&nbsp;&nbsp;·&nbsp;&nbsp;${c.name.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;${side.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;5.5 × 8.5 IN&nbsp;&nbsp;·&nbsp;&nbsp;350 GSM MATT`;
  return `${marks}${target(B / 2, -G - 46)}${target(B / 2, BH + G + 46)}${target(-G - 46, BH / 2)}${target(B + G + 46, BH / 2)}
    <div class="steps" style="left:0;top:${BH + G + 26}px">${steps}</div>
    <div class="slug" style="left:${B}px;top:${BH + G + 30}px">${slug}</div>`;
}

const OVERLAYS = '<div class="grain"></div><div class="shade"></div><div class="sheen"></div>';

/** One face of a card. Shared with the reduced-motion sheet. */
export function face(c: CardDesign, side: "front" | "back") {
  if (side === "back") return `<div class="face back" style="background:${c.bbg}">${c.back()}${OVERLAYS}</div>`;
  const planes = c.id === "cover";
  return `<div class="face front${planes ? " planes" : ""}" style="background:${c.fbg}">${c.front()}${planes ? "" : OVERLAYS}</div>`;
}

export function createChapter(root: HTMLElement, w: number, h: number, rest: Rest): Chapter {
  let W = w;
  let H = h;
  let narrow = W < 768;
  let S0 = 1;
  let R = rest;
  const measure = () => {
    narrow = W < 768;
    S0 = Math.min((0.74 * H) / BH, ((narrow ? 0.78 : 0.5) * W) / B);
  };
  measure();

  root.innerHTML = `
    <div class="ccx-room"><div class="ccx-light"></div><div class="ccx-bgname">Ola Szkolda</div></div>
    <div class="ccx-world"></div>
    <div class="ccx-vignette"></div>
    <svg class="ccx-leaders"></svg>
    <div class="ccx-notes"></div>
    <div class="ccx-finale"><div class="ccx-finale__a">One library.</div><div class="ccx-finale__b">Six <em>directions.</em></div></div>
    <div class="ccx-slug"></div>
    <div class="ccx-count"></div>`;
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as T;

  // ── Cards ─────────────────────────────────────────────────────────────

  const world = $(".ccx-world");
  const cards: Card[] = list.map((c, i) => {
    const el = document.createElement("div");
    el.className = "card";
    const planes = c.id === "cover";
    el.innerHTML = `
      <div class="drop"></div>
      ${face(c, "back")}
      ${face(c, "front")}
      <div class="edge"></div>
      <div class="proof front">${proof(c, "front")}</div>
      <div class="proof back">${proof(c, "back")}</div>`;
    world.appendChild(el);
    // Blend modes flatten a 3D context, so on the cover's planes the paper's
    // overlays live on the photograph's own plane.
    if (planes) el.querySelector('.layer[data-z="0"]')!.insertAdjacentHTML("beforeend", OVERLAYS);
    return {
      ...c,
      i,
      el,
      layers: [...el.querySelectorAll<HTMLElement>(".layer")],
      shades: [...el.querySelectorAll<HTMLElement>(".shade")],
      sheens: [...el.querySelectorAll<HTMLElement>(".sheen")],
      edge: el.querySelector<HTMLElement>(".edge")!,
      proofs: [...el.querySelectorAll<HTMLElement>(".proof")],
      drop: el.querySelector<HTMLElement>(".drop")!,
      m: null,
      p: null,
    };
  });

  /** Cover: the hero of the chapter, from the edge to the turn. */
  function coverPose(v: number): MaybePose {
    if (v < 168) return HIDDEN;
    const p: Pose = { x: 0, y: 0, z: -9000, rx: 0, ry: 90, rz: 0, s: S0, explode: 0 };

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
    const drift = seg(v, 785, 845, linear);
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
    p.ry += seg(v, 1100, 1180, linear) * 10;
    return p;
  }

  // ── Directions: slots in the dark ─────────────────────────────────────

  const slot = (k: number) => {
    const side = k % 2 === 0 ? -1 : 1;
    return { side, x: side * (narrow ? 0.1 : 0.22) * W, y: (k % 2 ? 0.02 : -0.015) * H, z: -k * D };
  };
  const camZAt = (v: number) => {
    const back = seg(v, FLY[0], FLY[1], inOut) * 900;
    const travel = seg(v, FLY[1], FLY[2], (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2));
    return back - travel * (5 * D + 2300);
  };
  /** Facing you as you come; turning to show its back as you pass. */
  const passRy = (side: number, zr: number) => lerp(-side * 26, 180 - side * 26, smooth(zr, -1300, 250));

  function flyPose(k: number, v: number): Pose {
    const s = slot(k);
    const zr = s.z - camZAt(v);
    return { x: s.x, y: s.y, z: zr, rx: 2, ry: passRy(s.side, zr), rz: s.side * -1.2, s: S0, fog: clamp((-zr - 2500) / 9000) };
  }

  // ── The hand ──────────────────────────────────────────────────────────

  function handPose(k: number, v: number): Pose {
    const pos = HAND.indexOf(k);
    const n = HAND.length;
    const a = (pos - (n - 1) / 2) * (narrow ? 5.5 : 8.5);
    const Rad = (narrow ? 0.75 : 1.15) * H;
    const sF = S0 * (narrow ? 0.5 : 0.66);
    const fan = {
      x: Math.sin((a * Math.PI) / 180) * Rad,
      y: -H * 0.03 + Rad - Math.cos((a * Math.PI) / 180) * Rad,
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
    type Key = keyof typeof deck;
    const mix = (key: Key) => lerp(lerp(from[key], fan[key], come), deck[key], sq);
    const p: Pose = { x: mix("x"), y: mix("y"), z: mix("z"), rx: mix("rx"), ry: mix("ry"), rz: mix("rz"), s: mix("s"), drop: sq };

    if (k === 0) {
      // Set down flat at its rest, where the next chapter picks it up.
      const e = seg(v, HANDOFF.cover[0], HANDOFF.cover[1], inOut);
      p.x = lerp(p.x, R.cx - W / 2, e);
      p.y = lerp(p.y, R.cy - H / 2, e);
      p.z = lerp(p.z, 0, e);
      p.rx = lerp(p.rx, 0, e);
      p.ry = lerp(p.ry, 0, e);
      p.rz = lerp(p.rz, 0, e);
      p.s = lerp(p.s, R.width / B, e);
    } else {
      // The rest leave from under it, down through the bottom of the frame.
      const stagger = pos * 7;
      const go = seg(v, HANDOFF.others[0] + stagger, HANDOFF.others[1] + stagger, inn);
      p.y += go * H * 1.3;
      p.rz += go * (pos < 3 ? -6 : 6);
    }
    return p;
  }

  function pose(k: number, v: number): MaybePose {
    if (v >= HAND_IN) return handPose(k, v);
    if (k === 0) {
      if (v < FLY[0]) return coverPose(v);
      // From the back it shows into its slot, and the dark opens behind it.
      const from = coverPose(FLY[0]) as Pose;
      const f = flyPose(0, v);
      const e = seg(v, FLY[0], FLY[1] + 40, inOut);
      return { ...f, x: lerp(from.x, f.x, e), y: lerp(from.y, f.y, e), z: lerp(from.z, f.z, e), rx: lerp(from.rx, f.rx, e), ry: lerp(from.ry, f.ry + 360, e), rz: lerp(0, f.rz, e) };
    }
    if (v < FLY[0]) return HIDDEN;
    const f = flyPose(k, v);
    // The far ones come up out of the dark as the camera pulls back.
    f.fog = Math.max(f.fog || 0, 1 - seg(v, FLY[0], FLY[1], linear));
    return f;
  }

  /** The proof sheet shows while the cover is held to be read. */
  const proofAt = (v: number) =>
    smooth(v, 395, 440) * (1 - smooth(v, 468, 500)) + smooth(v, 1095, 1130) * (1 - smooth(v, 1175, 1200));

  const cardMatrix = (p: Pose, crx: number, cry: number) =>
    `translate(${W / 2}px, ${H / 2}px) perspective(${P}px) rotateX(${crx}deg) rotateY(${cry}deg) translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.s}) translate(${-B / 2}px, ${-BH / 2}px)`;

  function renderCards(v: number, lean: { x: number; y: number }) {
    const crx = -lean.y * 2.2;
    const cry = lean.x * 3.2;
    const order: [number, Card][] = [];
    cards.forEach((c, k) => {
      const p = pose(k, v);
      // Gone below the frame on the way out counts as gone.
      if (p.hidden || p.z > P * 0.8 || (k !== 0 && v > HANDOFF.others[1] + 50)) {
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
      const sheen = 50 - Math.sin(ry) * 140 + lean.x * 22 - p.rx * 2;
      c.sheens.forEach((s) => (s.style.backgroundPosition = `${sheen}% 0`));
      c.edge.style.opacity = String(Math.pow(Math.abs(Math.sin(ry)), 40) * (1 - fog));
      c.drop.style.opacity = String((p.drop || 0) * 0.9);
      // Foil catches the light as the card turns and as the hand moves.
      c.el.style.setProperty("--foil", `${50 + Math.sin(ry) * 90 - p.rx * 3 + lean.x * 26}%`);
      const pr = k === 0 ? proofAt(v) : 0;
      c.proofs.forEach((el) => (el.style.opacity = String(pr)));
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
    order.sort((a, b) => a[0] - b[0]);
    order.forEach(([, c], i) => (c.el.style.zIndex = String(10 + i)));
  }

  // ── Notes: a few small annotations, anchored to the object ────────────

  const notesEl = $(".ccx-notes");
  const svg = $<SVGSVGElement>(".ccx-leaders");
  const NS = "http://www.w3.org/2000/svg";

  /*
   * Each note points at a place on a card: [x, y] in the face's own
   * pixels, the plane it lies on (cover only), the side of the card it
   * is on, the window in `v` it shows in, and where its label stands
   * from the point, in px.
   */
  const NOTES: Note[] = [
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

  function project(c: Card, x: number, y: number, z: number) {
    const m = new DOMMatrix(c.m!);
    const q = m.transformPoint(new DOMPoint(x, y, z, 1));
    return { x: q.x / q.w, y: q.y / q.w };
  }

  const hideNote = (n: Note) => {
    n.el!.style.opacity = "0";
    if (n.line) {
      n.line.style.opacity = "0";
      n.dot!.style.opacity = "0";
    }
  };

  function renderNotes(v: number) {
    NOTES.forEach((n) => {
      const c = cards[n.card];
      const el = n.el!;
      if (n.fly) {
        let a = 0;
        if (c.m && c.p && v > FLY[1] - 60 && v < HAND_IN) {
          const zr = c.p.z;
          a = smooth(zr, -3400, -2300) * (1 - smooth(zr, -900, -300));
          const q = project(c, 0, 0, 0);
          const r = project(c, B, 0, 0);
          const x = c.p.x > 0 ? Math.max(q.x, r.x) + 28 : Math.min(q.x, r.x) - 28;
          const y = Math.min(q.y, r.y) + 6;
          el.classList.toggle("right", c.p.x <= 0);
          el.style.transform = `translate(${x}px, ${y}px) translateX(${c.p.x <= 0 ? -100 : 0}%)`;
        }
        el.style.opacity = String(a);
        return;
      }
      // A phone has no margin beside the card for a note to stand in; the
      // slug and the captions carry it there.
      if (narrow && !n.screen) return hideNote(n);
      const [v0, v1] = n.v!;
      const a = smooth(v, v0, v0 + 18) * (1 - smooth(v, v1 - 18, v1));
      if (!c.m || a <= 0) return hideNote(n);
      if (n.screen) {
        el.style.opacity = String(a);
        el.style.transform = `translate(${n.screen[0] * W}px, ${n.screen[1] * H + (1 - a) * 14}px)`;
        return;
      }
      const e = (c.p && c.p.explode) || 0;
      const z = n.back ? -1.5 : 1.5 + (n.plane != null ? n.plane * PLANE * e : 0);
      const lx = n.back ? B - n.at[0] : n.at[0];
      const pt = project(c, lx, n.at[1], z);
      const lx2 = pt.x + n.off[0];
      const ly2 = pt.y + n.off[1];
      el.style.opacity = String(a);
      const shift = n.align === "right" ? "-100%" : "0%";
      el.style.transform = `translate(${lx2 + (n.align === "right" ? -10 : 10)}px, ${ly2 - 8 + (1 - a) * 10}px) translateX(${shift})`;
      const line = n.line!;
      const dot = n.dot!;
      line.setAttribute("x1", String(pt.x));
      line.setAttribute("y1", String(pt.y));
      line.setAttribute("x2", String(lx2));
      line.setAttribute("y2", String(ly2));
      line.style.opacity = String(a);
      dot.setAttribute("cx", String(pt.x));
      dot.setAttribute("cy", String(pt.y));
      dot.style.opacity = String(a);
    });
  }

  // ── The room ──────────────────────────────────────────────────────────
  //
  // The dark is a room, not a void: a pool of warm light that follows the
  // card the camera is on, her name at architectural scale in the house's
  // gold hairline drifting in the depth behind it, and the job's slug at
  // the foot of the frame saying what we are looking at.

  const light = $(".ccx-light");
  const bgname = $(".ccx-bgname");
  const vignette = $(".ccx-vignette");
  const slugEl = $(".ccx-slug");
  const countEl = $(".ccx-count");
  let lastSlug = "";

  function focusCard(v: number) {
    if (v < FLY[0] || v >= HAND_IN) return cards[0];
    // The subject is the nearest card still in front of the lens.
    let best: Card | null = null;
    let bestZ = -Infinity;
    cards.forEach((c) => {
      if (!c.m || !c.p || c.p.z > 450) return;
      if (c.p.z > bestZ) {
        bestZ = c.p.z;
        best = c;
      }
    });
    return best || cards[0];
  }

  function renderRoom(v: number, lean: { x: number; y: number }) {
    const f = focusCard(v);
    let lx = W / 2;
    let ly = H / 2;
    if (f.m) {
      const q = project(f, B / 2, BH / 2, 0);
      lx = q.x;
      ly = q.y;
    }
    // Everything but the card goes before it is handed on: the next chapter
    // moves this whole layer, and only the card may travel with it.
    const away = 1 - smooth(v, HANDOFF.room[0], HANDOFF.room[1]);
    light.style.transform = `translate(${lx}px, ${ly}px)`;
    light.style.opacity = String(smooth(v, 240, 360) * away);
    // The vignette comes in while the frame is still her black.
    vignette.style.opacity = String(smooth(v, 150, 190) * away);

    // Her name, behind everything, travelling the chapter once.
    const k = Math.min(v, NAME_TRAVEL) / NAME_TRAVEL;
    const depth = 1 + seg(v, FLY[1], FLY[2], linear) * 0.9;
    const x = lerp(18, -78, k) * (W / 100);
    bgname.style.transform = `translate(${x - lean.x * 18}px, ${-lean.y * 10}px) translateY(-50%) scale(${depth})`;
    bgname.style.opacity = String(smooth(v, 300, 420) * (1 - smooth(v, 700, 760) * 0.85 + smooth(v, 900, 980) * 0.85) * away);

    // The slug: what this is, where we are in it.
    let slug = "";
    let idx = 1;
    const side = (c: Card) => {
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
    const chrome = String(smooth(v, 240, 300) * (1 - smooth(v, HANDOFF.chrome[0], HANDOFF.chrome[1])));
    slugEl.style.opacity = chrome;
    countEl.style.opacity = chrome;
  }

  // ── Finale ────────────────────────────────────────────────────────────

  const finA = $(".ccx-finale__a");
  const finB = $(".ccx-finale__b");
  function renderFinale(v: number) {
    // In from below; then, ahead of the card, up and out.
    const up = seg(v, HANDOFF.finale[0], HANDOFF.finale[1], inn) * -H;
    const a = seg(v, 1880, 1960, outQuint);
    const b = seg(v, 1900, 1980, outQuint);
    finA.style.transform = `translateY(${(1 - a) * H * 0.8 + up}px)`;
    finB.style.transform = `translateY(${(1 - b) * H * 0.8 + up * 1.15}px)`;
    const gone = v >= HANDOFF.finale[1];
    finA.style.visibility = a > 0 && !gone ? "visible" : "hidden";
    finB.style.visibility = b > 0 && !gone ? "visible" : "hidden";
  }

  return {
    render(v, pointer) {
      // The camera's lean toward the hand settles out as the card is set
      // down, so its rest is exactly the rest.
      const hold = 1 - seg(v, HANDOFF.cover[0] - 40, HANDOFF.cover[1], inOut);
      const lean = { x: pointer.x * hold, y: pointer.y * hold };
      renderCards(v, lean);
      renderNotes(v);
      renderRoom(v, lean);
      renderFinale(v);
    },
    resize(w2, h2, rest2) {
      W = w2;
      H = h2;
      R = rest2;
      measure();
    },
    destroy() {
      root.innerHTML = "";
    },
  };
}
