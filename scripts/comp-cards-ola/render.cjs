#!/usr/bin/env node
/**
 * Ola Szkolda's comp cards for the home stage, composed by hand.
 *
 *   node scripts/comp-cards-ola/render.cjs          # every card
 *   node scripts/comp-cards-ola/render.cjs cover    # a subset
 *
 * Four fronts and one back, each front a different sitting, structure,
 * field and typographic voice, labelled with the edition in pholio-app's
 * shipped catalog it is a design target for (`composition/editions.js`):
 *
 *   cover   The Cover Story    the photograph is the page; the surname in a
 *                              didone across the top, behind her head
 *   cutout  The Cutout         the figure lifted onto a flat plane, the name
 *                              in heavy condensed grotesque in her negative
 *                              space
 *   night   The Night Edition  a plate on warm black, the name once below it
 *   strip   The Strip          the working commercial card: hero over a
 *                              three-frame strip, name inline at the foot
 *   back    the Cover Story's back: four frames doing four jobs, the stats
 *           line in agency order, the mark and her address
 *
 * The cover is also emitted as three registered layers (photograph, name,
 * figure) so the stage can set the name behind her as the card is made.
 *
 * Photographs: Ola's own uploads on Unsplash (@olaszkolda), fetched into
 * `.comp-card-build/ola-src/` with their manifest. Figures cut with Apple
 * Vision (`studio+_portfolio/tools/cutout.swift`). Stats come from the one
 * talent record (`scripts/ola-talent.cjs`), which cites its sources.
 * Puppeteer is borrowed from the sibling pholio-app checkout.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const SITE = path.resolve(__dirname, "..", "..");
const APP = path.resolve(SITE, "..", "pholio-app");
const puppeteer = require(path.join(APP, "node_modules", "puppeteer"));
const { TALENT } = require(path.join(SITE, "scripts", "ola-talent.cjs"));

const SRC = path.join(SITE, ".comp-card-build", "ola-src");
const OUT = path.join(SITE, "public", "generated", "comp-card", "ola");
fs.mkdirSync(OUT, { recursive: true });

/** 5.5 x 8.5 in at 96dpi; rendered at 2x. */
const W = 528;
const H = 816;

const img = (id, cut = false) => `file://${path.join(SRC, `${id}${cut ? ".cut.png" : ".jpg"}`)}`;

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Italiana&family=Inter:wght@400;500;600&family=Noto+Serif+Display:wght@400&display=block" rel="stylesheet">`;

const BASE = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:transparent}
.card{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.ph{position:absolute;display:block;object-fit:cover}
.abs{position:absolute}
body.only-bg .name,body.only-bg .fig{visibility:hidden}
body.only-name .bgl,body.only-name .fig{visibility:hidden}
body.only-name .card{background:transparent!important}
body.only-fig .bgl,body.only-fig .name{visibility:hidden}
body.only-fig .card{background:transparent!important}
`;

/** Fits a single line's ink (not its line box) to a width, in the page. */
const FIT = `
<script>
function fitInk(el, width){
  const c=document.createElement('canvas').getContext('2d');
  const cs=getComputedStyle(el);
  let size=parseFloat(cs.fontSize);
  for(let i=0;i<6;i++){
    c.font=cs.fontStyle+' '+cs.fontWeight+' '+size+'px '+cs.fontFamily;
    if(cs.fontStretch&&cs.fontStretch!=='100%') c.fontStretch=cs.fontStretch;
    c.letterSpacing=cs.letterSpacing;
    const m=c.measureText(el.textContent);
    const ink=m.actualBoundingBoxLeft+m.actualBoundingBoxRight;
    size*=width/ink;
  }
  el.style.fontSize=size+'px';
  c.font=cs.fontStyle+' '+cs.fontWeight+' '+size+'px '+cs.fontFamily;
  const m=c.measureText(el.textContent);
  return {size, left:m.actualBoundingBoxLeft, ascent:m.actualBoundingBoxAscent};
}
</script>`;

/* ---------------------------------------------------------------- stats */

const halfInch = (cm) => {
  const inches = Math.round((cm / 2.54) * 2) / 2;
  const ft = Math.floor(inches / 12);
  const rest = inches - ft * 12;
  const frac = rest % 1 ? "½" : "";
  return `${ft}'${Math.floor(rest)}${frac}"`;
};
function statsLine() {
  const t = TALENT;
  const parts = [];
  if (t.height_cm) parts.push(["Height", `${t.height_cm} cm ${halfInch(t.height_cm)}`]);
  if (t.bust_cm) parts.push(["Bust", `${t.bust_cm}`]);
  if (t.waist_cm) parts.push(["Waist", `${t.waist_cm}`]);
  if (t.hips_cm) parts.push(["Hips", `${t.hips_cm}`]);
  if (t.dress_size) parts.push(["Dress", `${t.dress_size}`]);
  if (t.shoe_size) parts.push(["Shoes", `EU ${t.shoe_size}`]);
  if (t.hair_color) parts.push(["Hair", t.hair_color]);
  if (t.eye_color) parts.push(["Eyes", t.eye_color]);
  return parts.map(([k, v]) => `<span class="k">${k}</span> <span class="v">${v}</span>`).join("");
}

/* ---------------------------------------------------------------- cards */

const CARDS = {
  /**
   * The Cover Story. She strides out of the colonnade toward the lens; the
   * surname is set trim to trim in a high-contrast didone across the pale
   * columns, at the height of her shoulders, and she walks in front of it.
   * The given name sits above in the same face's italic. Ink, taken from
   * the coat, on the lightest part of the photograph. Nothing else.
   */
  cover: {
    layers: true,
    html: `
<div class="card" style="background:#d9d6d0">
  <img class="ph bgl" src="${img(1217)}" style="left:-6px;top:-10px;width:${W + 12}px;height:${H + 30}px;object-position:50% 44%">
  <svg class="name abs" width="${W}" height="${H}" style="left:0;top:0;overflow:visible">
    <text id="given" x="22" y="0" style="font-family:'Bodoni Moda';font-style:italic;font-weight:400;font-variation-settings:'opsz' 40;font-size:34px" fill="#16120f">Ola</text>
    <text id="sur" x="0" y="262" style="font-family:'Bodoni Moda';font-weight:500;font-variation-settings:'opsz' 96;font-size:120px" fill="#16120f">SZKOLDA</text>
  </svg>
  <img class="ph fig" src="${img(1217, true)}" style="left:-6px;top:-10px;width:${W + 12}px;height:${H + 30}px;object-position:50% 44%">
</div>
<script>
  const s=document.getElementById('sur'); const f=fitInk(s, ${W - 40});
  s.setAttribute('x', 20 + f.left);
  const g=document.getElementById('given'); g.setAttribute('y', 262 - f.ascent - 14);
</script>`,
  },

  /**
   * The Cutout. The grey-studio full length lifted onto a flat plane of warm
   * stone, standing in the right third with her own contact shadow; the name
   * in a heavy condensed grotesque, stacked in the space she leaves, bottom
   * left, on the margin by its ink.
   */
  cutout: {
    html: `
<div class="card" style="background:#e4dccf">
  <div class="abs" style="left:280px;top:737px;width:220px;height:28px;border-radius:50%;background:radial-gradient(closest-side,rgba(40,30,20,.34),rgba(40,30,20,0))"></div>
  <img class="ph" src="${img(876, true)}" style="left:126px;top:-12px;width:548px;height:822px;object-fit:contain;object-position:50% 100%">
  <svg class="abs" width="${W}" height="${H}" style="left:0;top:0;overflow:visible">
    <text id="n1" x="24" y="0" style="font-family:Archivo;font-stretch:62%;font-weight:850;font-size:120px" fill="#141210">OLA</text>
    <text id="n2" x="24" y="${H - 30}" style="font-family:Archivo;font-stretch:62%;font-weight:850;font-size:120px" fill="#141210">SZKOLDA</text>
  </svg>
</div>
<script>
  const a=document.getElementById('n2'); const fa=fitInk(a, 352);
  const b=document.getElementById('n1'); b.style.fontSize=fa.size+'px';
  a.setAttribute('x', 24 + fa.left); b.setAttribute('x', 24 + fa.left);
  b.setAttribute('y', ${H} - 30 - fa.ascent - fa.size*0.06);
</script>`,
  },

  /**
   * The Night Edition. The gold-curtain portrait as a plate on warm black,
   * the photograph's own shadow lifted so the card's edge holds on the
   * velvet stage; the plate keeps its proportion and the margins take the
   * rest. The name once beneath it in a hairline display caps, centred on
   * the plate's axis.
   */
  night: {
    html: `
<div class="card" style="background:#14110d">
  <img class="ph" src="${img(71)}" style="left:46px;top:46px;width:${W - 92}px;height:600px;object-position:50% 30%">
  <div class="abs" style="left:0;right:0;top:690px;text-align:center;font-family:Italiana;font-size:31px;letter-spacing:.32em;margin-right:-.32em;color:#eee3cf">OLA SZKOLDA</div>
</div>`,
  },

  /**
   * The Strip. The working commercial card: the red-seamless beauty as the
   * hero, three frames from three other sittings in a strip beneath it,
   * the name inline at the foot in a clean grotesque.
   */
  strip: {
    html: `
<div class="card" style="background:#f5f0e8">
  <img class="ph" src="${img(1235)}" style="left:22px;top:22px;width:${W - 44}px;height:520px;object-position:50% 22%">
  <img class="ph" src="${img(797)}" style="left:22px;top:554px;width:154px;height:196px;object-position:50% 24%">
  <img class="ph" src="${img(1237)}" style="left:187px;top:554px;width:154px;height:196px;object-position:50% 30%">
  <img class="ph" src="${img(1220)}" style="left:352px;top:554px;width:154px;height:196px;object-position:50% 20%">
  <div class="abs" style="left:22px;top:768px;font-family:Archivo;font-stretch:100%;font-weight:600;font-size:23px;letter-spacing:-.01em;color:#141210">Ola Szkolda</div>
</div>`,
  },

  /**
   * The back. Four frames, four jobs: beauty, editorial half length, full
   * length, commercial, in one flat grid with a uniform margin, framed by
   * landmark rather than centre-cropped. The stats in agency order, label
   * and value one size apart by ink. The mark small at the foot with the
   * address a booker can use. No name: the front carries it.
   */
  back: {
    html: `
<style>
  .st{position:absolute;left:28px;right:28px;top:715px;font-family:Inter;font-size:8.6px;letter-spacing:.14em;text-transform:uppercase;line-height:1.9;color:#141210}
  .st .k{color:rgba(20,18,16,.48)} .st .v{margin-right:1.15em}
</style>
<div class="card" style="background:#f6f2ea">
  <img class="ph" src="${img(1218)}" style="left:28px;top:28px;width:229px;height:327px;object-position:42% 26%">
  <img class="ph" src="${img(866)}" style="left:271px;top:28px;width:229px;height:327px;object-position:50% 18%">
  <img class="ph" src="${img(1215)}" style="left:28px;top:369px;width:229px;height:327px;object-position:50% 72%">
  <img class="ph" src="${img(797)}" style="left:271px;top:369px;width:229px;height:327px;object-position:50% 30%">
  <div class="st">${statsLine()}</div>
  <div class="abs" style="left:28px;top:768px;font-family:'Noto Serif Display';font-weight:400;font-size:13px;letter-spacing:.2em;color:#A8894E">PHOLIO</div>
  <div class="abs" style="right:28px;top:771px;font-family:Inter;font-weight:500;font-size:9px;letter-spacing:.06em;color:rgba(20,18,16,.62)">pholio.studio/ola-szkolda</div>
</div>`,
  },
};

async function main() {
  const want = process.argv.slice(2);
  const names = want.length ? want : Object.keys(CARDS);
  const browser = await puppeteer.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });

  for (const name of names) {
    const card = CARDS[name];
    const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}</style>${FIT}</head><body>${card.html}</body></html>`;
    const file = path.join(SITE, ".comp-card-build", `ola-${name}.html`);
    fs.writeFileSync(file, html);
    await page.goto(`file://${file}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    // Fitting ran before the webfonts settled; run the page's scripts again.
    await page.goto(`file://${file}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);

    const shot = async (out, cls, transparent) => {
      await page.evaluate((c) => (document.body.className = c), cls);
      const type = out.endsWith(".webp") ? "webp" : "jpeg";
      await page.screenshot({ path: out, omitBackground: transparent, type, quality: type === "webp" ? 88 : 86 });
    };
    await shot(path.join(OUT, `${name}.jpg`), "", false);
    if (card.layers) {
      await shot(path.join(OUT, `${name}-photo.jpg`), "only-bg", false);
      await shot(path.join(OUT, `${name}-name.webp`), "only-name", true);
      await shot(path.join(OUT, `${name}-figure.webp`), "only-fig", true);
    }
    console.log("rendered", name);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
