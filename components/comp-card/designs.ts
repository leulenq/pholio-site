/*
 * Six comp cards for Ola Szkolda, front and back, drawn by hand.
 * Every photograph is her own (Unsplash, @olaszkolda).
 *
 * Each is a professional comp card first and a direction second:
 *
 *   front  one image chosen to sell her, and her name, legible across a
 *          table. Nothing else.
 *   back   three to five frames that each do a job (beauty, an honest full
 *          length, and range: commercial, editorial, evening, profile),
 *          never two from one sitting; her name again, so the card still
 *          identifies her face down; the stats in agency order (height,
 *          bust, waist, hips, shoes, hair, eyes) in cm with inches; and
 *          where to book her.
 *
 * Laid out at a base width of 1000px in `u` (10px), a hundredth of the
 * card's width, 5.5 × 8.5 in. Measurements are the ones she and her agency
 * publish (scripts/ola-talent.cjs); dress size is unpublished and absent.
 */
const U = 10;
const B = 1000;
const BH = Math.round(B / (5.5 / 8.5)); // 1545
const H = BH / U;

const SRC = (id: string) => `/home/card/${id}.webp`;

// [face cx, face cy, face height, aspect], fractions of the photograph.
const FACE: Record<string, [number, number, number, number]> = {"riHmBtbm-JE":[0.5046,0.2618,0.1394,0.6667],"bov3dwNWm-4":[0.4466,0.1318,0.0786,0.6667],"4wU52Mi1MKA":[0.4162,0.4023,0.2706,0.8],"eo1ZFYlx4MA":[0.574,0.4315,0.2735,0.6625],"8PNDUQtixvs":[0.6082,0.2979,0.1839,0.6625],"dtneDawQn9s":[0.4575,0.3927,0.2608,0.8],"Q-4Xq4919xk":[0.54,0.3125,0.1056,0.6625],"f1bGNPDeDO0":[0.5587,0.2804,0.0655,0.7319],"eo_eBIDuJkQ":[0.5879,0.2917,0.0573,0.7319],"sOYqoWidOFU":[0.5317,0.1902,0.066,0.6625],"p250tH4k74A":[0.5648,0.5053,0.2856,0.6625],"zWvQ7tPaQHw":[0.422,0.2231,0.2912,0.6625],"9V9qS-dgGzE":[0.3229,0.3372,0.3844,0.6667],"Y7Z11Dhre6E":[0.362,0.2879,0.327,0.6667],"C4FiV6JCA4Y":[0.6213,0.3853,0.4457,0.8],"T6QKnkoltks":[0.4442,0.3266,0.0991,0.6667],"t29xtYbNvLQ":[0.602,0.4817,0.4603,0.6667],"RZq30SQCTW8":[0.5485,0.2842,0.238,0.6667],"m60lHgYnxAI":[0.5,0.43,0.249,0.6625],"nYL1Eh2q2fA":[0.6343,0.3323,0.3638,0.6667],"gUZApw7sR_w":[0.5278,0.3468,0.2995,0.8],"QNnhd54SVAA":[0.4899,0.3629,0.1387,0.6667],"XGvrHo4DSuw":[0.535,0.2575,0.0667,0.6667],"r4gxJYebyWA":[0.447,0.5735,0.4565,1.5597],"vx_KGS9LhDk":[0.6344,0.3309,0.3589,0.6667],"rT4CrEMZNPQ":[0.5024,0.3727,0.1109,0.6667],"4g8S87dVQ98":[0.52,0.2925,0.3266,0.6667],"OUzZ2vbALsQ":[0.4289,0.3086,0.223,0.8],"YRFzBvyrHfI":[0.5775,0.346,0.2955,0.8]};

/**
 * A photograph framed in a box by a landmark, never centre-cropped. Box
 * in u. `ty` is where her face lands in the box (fraction of its height);
 * a full length is framed by its own `ty` so the feet stay in. `zoom`
 * past 1 crops tighter than cover.
 */
interface PhotoOptions {
  focus?: [number, number];
  ty?: number;
  tx?: number;
  zoom?: number;
  cls?: string;
  filter?: string;
  src?: string;
  style?: string;
}

function photo(id: string, x: number, y: number, w: number, h: number, o: PhotoOptions = {}) {
  const f = FACE[id] || [0.5, 0.35, 0.2, 0.6667];
  const a = f[3];
  const [fx, fy] = o.focus || [f[0], f[1]];
  const ty = o.ty == null ? 0.36 : o.ty;
  const tx = o.tx == null ? 0.5 : o.tx;
  const zoom = o.zoom || 1;
  const iw = Math.max(w, h * a) * zoom;
  const ih = iw / a;
  let left = tx * w - fx * iw;
  let top = ty * h - fy * ih;
  left = Math.min(0, Math.max(w - iw, left));
  top = Math.min(0, Math.max(h - ih, top));
  const cls = o.cls ? ` ${o.cls}` : "";
  const filter = o.filter ? `filter:${o.filter};` : "";
  const src = o.src || SRC(id);
  return `<div class="ph${cls}" style="left:${x * U}px;top:${y * U}px;width:${w * U}px;height:${h * U}px;${o.style || ""}"><img src="${src}" alt="" draggable="false" style="left:${left * U}px;top:${top * U}px;width:${iw * U}px;height:${ih * U}px;${filter}"></div>`;
}

/** Text at a point, in u. */
function t(x: number, y: number, html: string, style = "", cls = "") {
  return `<div class="tx ${cls}" style="left:${x * U}px;top:${y * U}px;${style}">${html}</div>`;
}
const px = (n: number) => `${n * U}px`;
const right = "transform:translateX(-100%);text-align:right;";
const centre = "transform:translateX(-50%);text-align:center;";

// In agency order. Inches to the nearest half, as agencies print them.
type Stat = readonly [string, string, string?];
const STATS: readonly Stat[] = [
  ["Height", "169 cm", "5′6.5″"],
  ["Bust", "77", "30.5″"],
  ["Waist", "58", "23″"],
  ["Hips", "84", "33″"],
  ["Shoes", "EU 38", "US 7"],
  ["Hair", "Blonde"],
  ["Eyes", "Blue"],
];
const ADDRESS = "pholio.studio/ola-szkolda";

const BODONI = "font-family:var(--font-bodoni),Didot,serif;";
const ARCHIVO = "font-family:var(--font-archivo),'Helvetica Neue',sans-serif;";
const MONO = "font-family:var(--font-jetbrains),monospace;";
const SANS = "font-family:var(--font-inter),sans-serif;";
const NOTO = "font-family:var(--font-noto-light),serif;";

/** The brand's mark, as a booking line carries it. */
const mark = (x: number, y: number, size: number, color: string, align = "") =>
  t(x, y, "PHOLIO", `${NOTO}font-size:${px(size)};letter-spacing:.2em;color:${color};${align}`);

// ── 01 Cover ────────────────────────────────────────────────────────────
// A magazine cover she is the whole of: her surname as the masthead, set
// behind her head. Built in planes so the stage can take it apart.
// Front: an editorial three-quarter, face clear, the strongest single
// frame she has. Back: four sittings, four jobs.
const coverFront = () => {
  const ink = "#121110";
  const o = { ty: 0.26 };
  return `
    <div class="layer" data-z="0">${photo("riHmBtbm-JE", 0, 0, 100, H, o)}</div>
    <div class="layer" data-z="1">
      ${t(4.6, 6.6, "Ola", `${BODONI}font-style:italic;font-size:${px(5.4)};color:${ink}`)}
      <div class="tx" style="left:0;right:0;top:${px(9.5)};text-align:center;${BODONI}font-weight:500;font-size:${px(20.4)};letter-spacing:-0.035em;color:${ink}">SZKOLDA</div>
    </div>
    <div class="layer" data-z="2">${photo("riHmBtbm-JE", 0, 0, 100, H, { ...o, src: SRC("riHmBtbm-JE-figure") })}</div>`;
};
const coverBack = () => {
  const cream = "#F1ECE3";
  const soft = "rgba(241,236,227,.62)";
  const row = (items: readonly Stat[]) => items.map(([k, a, b]) => `<span style="margin-right:${px(3.4)}"><span style="color:${soft}">${k}</span>&nbsp;&nbsp;${a}${b ? `<span style="color:${soft}"> / ${b}</span>` : ""}</span>`).join("");
  return `
    ${photo("bov3dwNWm-4", 6, 6, 47, 104, { ty: 0.14 })}
    ${photo("nYL1Eh2q2fA", 55, 6, 39, 33.3, { ty: 0.42 })}
    ${photo("gUZApw7sR_w", 55, 41.3, 39, 33.3, { ty: 0.42 })}
    ${photo("QNnhd54SVAA", 55, 76.6, 39, 33.4, { ty: 0.34, zoom: 1.25 })}
    ${t(6, 116, "Ola Szkolda", `${BODONI}font-style:italic;font-size:${px(6.6)};color:${cream};letter-spacing:-0.02em`)}
    ${t(6, 127.5, row(STATS.slice(0, 4)), `${BODONI}font-size:${px(2.45)};color:${cream}`, "stats")}
    ${t(6, 132.5, row(STATS.slice(4)), `${BODONI}font-size:${px(2.45)};color:${cream}`)}
    ${t(6, 145.4, "Bookings", `${SANS}font-size:${px(1.45)};letter-spacing:.3em;text-transform:uppercase;color:#C9A55A`)}
    ${t(6, 148.2, ADDRESS, `${SANS}font-size:${px(1.9)};letter-spacing:.04em;color:${cream}`, "booking")}
    ${mark(94, 146.2, 2.5, "#C9A55A", right)}`;
};

// ── 02 Show ─────────────────────────────────────────────────────────────
// The show card, as the Paris and Milan agencies make them for the
// season: white stock, one beauty image, her name small in spaced caps,
// nothing else. The restraint is the direction.
// Front: a monochrome beauty, the face is the whole argument. Back: an
// honest full length, a profile, a second beauty in another light.
const showFront = () => `
    ${photo("t29xtYbNvLQ", 6, 6, 88, 124, { ty: 0.42, zoom: 1.04 })}
    ${t(50, 139.2, "OLA SZKOLDA", `${ARCHIVO}font-weight:500;font-size:${px(2.7)};letter-spacing:.62em;margin-left:.31em;color:#111;${centre}`)}`;
const showBack = () => {
  const caps = `${ARCHIVO}font-size:${px(1.62)};letter-spacing:.24em;text-transform:uppercase;color:#111`;
  const k = "color:rgba(17,17,17,.42)";
  const cell = ([lab, a, b]: Stat) => `<span style="margin-right:${px(2.6)}"><span style="${k}">${lab}</span> ${a}${b ? ` / ${b}` : ""}</span>`;
  return `
    ${photo("XGvrHo4DSuw", 6, 6, 43, 82, { ty: 0.14 })}
    ${photo("vx_KGS9LhDk", 51, 6, 43, 82, { ty: 0.4 })}
    ${photo("r4gxJYebyWA", 6, 90, 88, 34, { ty: 0.5, zoom: 1.08 })}
    ${t(50, 130.5, "OLA SZKOLDA", `${ARCHIVO}font-weight:500;font-size:${px(2.2)};letter-spacing:.62em;margin-left:.31em;color:#111;${centre}`)}
    ${t(50, 136.4, STATS.slice(0, 4).map(cell).join(""), `${caps};${centre}`, "stats")}
    ${t(50, 140.4, STATS.slice(4).map(cell).join(""), `${caps};${centre}`)}
    ${t(50, 146.6, `<span style="${k}">Bookings</span>&nbsp;&nbsp;${ADDRESS}`, `${caps};letter-spacing:.18em;text-transform:none;${centre}`, "booking")}
    ${mark(50, 150.2, 1.7, "#A8894E", centre)}`;
};

// ── 03 Letters ──────────────────────────────────────────────────────────
// The photograph is whole, and where it ends it does not stop: it
// carries on below, inside her name. The front still does its one job,
// her face first, and the name is cut from the same picture.
// Front: the red-seamless beauty. Back: a full length on location, a
// commercial smile, an editorial half body, a seated three-quarter.
const lettersFront = () => {
  const f = FACE["Y7Z11Dhre6E"];
  // One photograph sized to the whole card: shown plainly above the cut,
  // and only through the letterforms below it.
  const ih = H;
  const iw = ih * f[3];
  const left = Math.min(0, Math.max(100 - iw, 50 - f[0] * iw + 6));
  const cut = 96;
  const bg = `background-image:url(${SRC("Y7Z11Dhre6E")});background-size:${px(iw)} ${px(ih)};background-repeat:no-repeat`;
  const line = `${ARCHIVO}font-stretch:62%;font-weight:900;font-size:${px(28.6)};line-height:.8;letter-spacing:-0.014em;display:block`;
  return `
    <div class="tx" style="left:0;top:0;width:${px(100)};height:${px(cut)};overflow:hidden;${bg};background-position:${px(left)} 0"></div>
    <div class="tx" style="left:${px(3.2)};top:${px(cut + 2.2)};width:${px(96)};${bg};background-position:${px(left - 3.2)} ${px(-(cut + 2.2))};-webkit-background-clip:text;background-clip:text;color:transparent">
      <span style="${line}">OLA</span><span style="${line}">SZKOLDA</span>
    </div>`;
};
const lettersBack = () => {
  const ink = "#1b1a18";
  const soft = "rgba(27,26,24,.5)";
  return `
    ${photo("rT4CrEMZNPQ", 5, 5, 44, 92, { ty: 0.27 })}
    ${photo("4wU52Mi1MKA", 51, 5, 44, 29.3, { ty: 0.42 })}
    ${photo("4g8S87dVQ98", 51, 36.3, 44, 29.3, { ty: 0.34 })}
    ${photo("Q-4Xq4919xk", 51, 67.6, 44, 29.4, { ty: 0.3 })}
    <div class="tx" style="left:${px(5)};top:${px(102)};${ARCHIVO}font-stretch:62%;font-weight:900;font-size:${px(9.4)};line-height:.84;letter-spacing:-0.01em;background-image:url(${SRC("Y7Z11Dhre6E")});background-size:${px(64)} auto;background-position:0 38%;-webkit-background-clip:text;background-clip:text;color:transparent">OLA SZKOLDA</div>
    <div class="tx stats" style="left:${px(5)};top:${px(115)};display:grid;grid-template-columns:repeat(4,auto);column-gap:${px(5.4)};row-gap:${px(2.2)};justify-content:start">${STATS.map(([k, a, b]) => `<div style="${ARCHIVO}font-size:${px(2.15)};line-height:1.2"><div style="color:${soft};font-weight:500">${k}</div><div style="color:${ink};font-weight:700">${a}${b ? `<span style="color:${soft};font-weight:500"> ${b}</span>` : ""}</div></div>`).join("")}</div>
    ${t(5, 145.4, "Bookings", `${ARCHIVO}font-weight:600;font-size:${px(1.6)};letter-spacing:.2em;text-transform:uppercase;color:${soft}`)}
    ${t(5, 148.2, ADDRESS, `${ARCHIVO}font-weight:600;font-size:${px(2)};color:${ink}`, "booking")}
    ${mark(95, 146.3, 2.3, "#A8894E", right)}`;
};

// ── 04 Digitals ─────────────────────────────────────────────────────────
// The working card, the one a new face is asked for: unretouched, natural
// light, plain clothes. A digital mounted on grey stock like a print.
// Front: a natural headshot. Back: the digitals set, each frame named for
// the shot it is.
const digitalsFront = () => {
  const mono = `${MONO}color:#1A1917;letter-spacing:.02em`;
  return `
    <div class="tx polaroid" style="left:${px(8)};top:${px(9)};width:${px(84)};height:${px(124)};background:#FBFAF7;transform:rotate(-1.2deg);box-shadow:0 1.2px 2px rgba(0,0,0,.18),0 10px 22px -12px rgba(0,0,0,.35)">
      ${photo("eo1ZFYlx4MA", 4, 4, 76, 100, { ty: 0.42 })}
      ${t(4, 109.5, "OLA SZKOLDA", `${mono};font-size:${px(4.4)};font-weight:500`)}
      ${t(4, 116.4, "DIGITALS · UNRETOUCHED", `${mono};font-size:${px(1.9)};color:rgba(26,25,23,.55)`)}
    </div>`;
};
const digitalsBack = () => {
  const frames: [string, string, number][] = [
    ["eo_eBIDuJkQ", "Full length", 0.15],
    ["sOYqoWidOFU", "Figure", 0.12],
    ["m60lHgYnxAI", "Profile", 0.4],
    ["zWvQ7tPaQHw", "Three-quarter", 0.24],
  ];
  const mono = `${MONO}color:#1A1917`;
  let out = `<div class="tx" style="left:${px(4)};top:${px(4)};width:${px(92)};height:${px(103)};background:#141312"></div>`;
  frames.forEach(([id, label, ty], i) => {
    const x = 7 + (i % 2) * 44;
    const y = 7 + Math.floor(i / 2) * 49.5;
    out += photo(id, x, y, 42, 44, { ty });
    out += t(x, y + 45.2, `${String(i + 1).padStart(2, "0")}&nbsp;&nbsp;${label.toUpperCase()}`, `${mono};font-size:${px(1.55)};letter-spacing:.06em;color:rgba(237,234,228,.6)`);
  });
  out += t(5, 112, "OLA SZKOLDA", `${mono};font-size:${px(3.2)};font-weight:500`);
  out += `<div class="tx stats" style="left:${px(5)};top:${px(119)};display:grid;grid-template-columns:auto auto;column-gap:${px(9)};row-gap:${px(1.3)}">${STATS.map(([k, a, b]) => `<span style="${mono};font-size:${px(2)};text-transform:uppercase"><span style="color:rgba(26,25,23,.5);display:inline-block;width:${px(9)}">${k}</span>${a}${b ? `<span style="color:rgba(26,25,23,.5)"> / ${b}</span>` : ""}</span>`).join("")}</div>`;
  out += t(5, 147, `BOOKINGS&nbsp;&nbsp;${ADDRESS}`, `${mono};font-size:${px(1.85)};color:rgba(26,25,23,.75)`, "booking");
  out += mark(95, 146.6, 2.1, "#A8894E", right);
  return out;
};

// ── 05 Spine ────────────────────────────────────────────────────────────
// The commercial card. Her name stands up the spine of the card in a
// warm serif, the way a book's title does, and the picture fills the
// rest edge to edge. Commercial work books on warmth, so it leads with it.
// Front: a real smile. Back: a full length, beauty with a product,
// lifestyle in daylight, a blazer half body.
const IVORY = "#F3EDE3";
const spineFront = () => `
    ${photo("OUzZ2vbALsQ", 21, 0, 79, H, { ty: 0.3, tx: 0.48 })}
    <div class="tx" style="left:${px(6.6)};top:${px(149)};transform-origin:0 0;transform:rotate(-90deg) translateX(0);${NOTO}font-weight:300;font-size:${px(12.4)};letter-spacing:-0.02em;color:#1E1A15;line-height:1">Ola Szkolda</div>`;
const spineBack = () => {
  const ink = "#1E1A15";
  const soft = "rgba(30,26,21,.5)";
  return `
    <div class="tx" style="left:${px(10.4)};top:${px(149)};transform-origin:0 0;transform:rotate(-90deg);${NOTO}font-weight:300;font-size:${px(7.2)};letter-spacing:-0.01em;color:${ink}">Ola Szkolda</div>
    ${photo("f1bGNPDeDO0", 21, 5, 36, 92, { ty: 0.16 })}
    ${photo("C4FiV6JCA4Y", 59, 5, 36, 29.3, { ty: 0.42 })}
    ${photo("YRFzBvyrHfI", 59, 36.3, 36, 29.3, { ty: 0.4 })}
    ${photo("8PNDUQtixvs", 59, 67.6, 36, 29.4, { ty: 0.3 })}
    <div class="tx stats" style="left:${px(21)};top:${px(104)};display:grid;grid-template-columns:repeat(4,auto);column-gap:${px(4.6)};row-gap:${px(3)};justify-content:start">${STATS.map(([k, a, b]) => `<div style="line-height:1.25"><div style="${NOTO}font-style:italic;font-size:${px(1.95)};color:${soft}">${k}</div><div style="${NOTO}font-size:${px(3)};color:${ink}">${a}</div>${b ? `<div style="${SANS}font-size:${px(1.5)};color:${soft}">${b}</div>` : ""}</div>`).join("")}</div>`
    + t(21, 143.6, "Bookings", `${NOTO}font-style:italic;font-size:${px(2)};color:${soft}`)
    + t(21, 147, ADDRESS, `${SANS}font-weight:500;font-size:${px(2)};color:${ink}`, "booking")
    + mark(95, 146.2, 2.3, "#A8894E", right);
};

// ── 06 Foil ─────────────────────────────────────────────────────────────
// The black book. Black stock, and her name in gold foil that only shows
// as gold where the light finds it. Evening, editorial, luxury.
// Front: the dark-studio editorial, the photograph sunk into the stock.
// Back: an evening full length, an editorial beauty, a clean headshot,
// and a smile.
const FOIL = "background-image:linear-gradient(100deg,#7c6230 0%,#c9a55a 22%,#f6e7bd 38%,#b8924a 50%,#e9d29a 64%,#8d7036 82%,#c9a55a 100%);background-size:260% 100%;background-position:var(--foil,50%) 0;-webkit-background-clip:text;background-clip:text;color:transparent";
const foilFront = () => `
    ${photo("RZq30SQCTW8", 8, 8, 84, 116, { ty: 0.3 })}
    <div class="tx" style="left:0;right:0;top:${px(132.5)};text-align:center;${BODONI}font-weight:500;font-size:${px(6.6)};letter-spacing:.16em;margin-left:.08em;${FOIL}">OLA SZKOLDA</div>`;
const foilBack = () => {
  const caps = `${BODONI}font-size:${px(2.05)};letter-spacing:.14em;text-transform:uppercase`;
  const cell = ([k, a, b]: Stat) => `<span style="margin-right:${px(2.8)}"><span style="opacity:.62">${k}</span>&nbsp;${a}${b ? ` / ${b}` : ""}</span>`;
  return `
    ${photo("T6QKnkoltks", 8, 8, 41, 96, { ty: 0.3 })}
    ${photo("9V9qS-dgGzE", 51, 8, 41, 31, { ty: 0.4 })}
    ${photo("p250tH4k74A", 51, 40.5, 41, 31, { ty: 0.44 })}
    ${photo("dtneDawQn9s", 51, 73, 41, 31, { ty: 0.4 })}
    <div class="tx" style="left:0;right:0;top:${px(112)};text-align:center;${BODONI}font-weight:500;font-size:${px(4.2)};letter-spacing:.16em;${FOIL}">OLA SZKOLDA</div>
    <div class="tx stats" style="left:0;right:0;top:${px(121.5)};text-align:center;${caps};${FOIL}">${STATS.slice(0, 4).map(cell).join("")}</div>
    <div class="tx" style="left:0;right:0;top:${px(126.5)};text-align:center;${caps};${FOIL}">${STATS.slice(4).map(cell).join("")}</div>
    <div class="tx booking" style="left:0;right:0;top:${px(141)};text-align:center;${SANS}font-size:${px(1.7)};letter-spacing:.22em;color:rgba(233,210,154,.75)">BOOKINGS&nbsp;&nbsp;${ADDRESS.toUpperCase()}</div>
    <div class="tx" style="left:0;right:0;top:${px(146.2)};text-align:center;${NOTO}font-size:${px(2.3)};letter-spacing:.2em;${FOIL}">PHOLIO</div>`;
};

export interface CardDesign {
  id: string;
  name: string;
  sub: string;
  front: () => string;
  back: () => string;
  fbg: string;
  bbg: string;
  dark: [boolean, boolean];
}

export const CARDS: { B: number; BH: number; U: number; list: CardDesign[] } = {
  B,
  BH,
  U,
  list: [
    { id: "cover", name: "Cover", sub: "her surname as the masthead", front: coverFront, back: coverBack, fbg: "#E9E6E1", bbg: "#121110", dark: [false, true] },
    { id: "show", name: "Show", sub: "white stock, the show-card idiom", front: showFront, back: showBack, fbg: "#FBFAF8", bbg: "#FBFAF8", dark: [false, false] },
    { id: "letters", name: "Letters", sub: "the picture carries on in her name", front: lettersFront, back: lettersBack, fbg: "#EEE8DF", bbg: "#EEE8DF", dark: [false, false] },
    { id: "digitals", name: "Digitals", sub: "unretouched, as she is", front: digitalsFront, back: digitalsBack, fbg: "#D6D1C8", bbg: "#EDEAE4", dark: [false, false] },
    { id: "spine", name: "Spine", sub: "the commercial card", front: spineFront, back: spineBack, fbg: IVORY, bbg: IVORY, dark: [false, false] },
    { id: "foil", name: "Foil", sub: "black stock, gold foil", front: foilFront, back: foilBack, fbg: "#12100E", bbg: "#12100E", dark: [true, true] },
  ],
};
