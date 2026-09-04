#!/usr/bin/env node
/**
 * Render the three hand-composed fronts that sit beside The Masthead in the
 * home page's edition row.
 *
 *   node scripts/comp-card-fronts/render.cjs            # all three
 *   node scripts/comp-card-fronts/render.cjs grid strip # a subset
 *
 * The Masthead (index 0 in components/comp-card/data.ts) stays the composed
 * engine's output. These three are composed here, by hand, as three distinct
 * art directions — each with its own structure, field, photograph and
 * typographic voice — because the engine's generic fronts for the same talent
 * all resolved to the same photograph with the name moved around it, which
 * is one direction three times.
 *
 * Every crop below is framed against a landmark in the photograph (eye line,
 * crown, feet, hands), never centred by default. No photograph is filtered;
 * the one monochrome frame is monochrome as shot.
 *
 * Puppeteer and the vendored OFL fonts come from the sibling pholio-app
 * checkout, exactly as scripts/comp-card-back/render.cjs loads them.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SITE = path.resolve(__dirname, "..", "..");
const APP = path.resolve(SITE, "..", "pholio-app");
const appRequire = (name) => require(path.join(APP, "node_modules", name));
const puppeteer = appRequire("puppeteer");

const FONT_DIR = path.join(APP, "public", "fonts", "compcard");
const SOURCE_DIR = path.join(SITE, "01-ola-szkolda");
const WORK_DIR = path.join(SITE, ".comp-card-build");
const OUT_DIR = path.join(SITE, "public", "generated", "comp-card");

const { TALENT } = require(path.join(SITE, "scripts", "ola-talent.cjs"));

/* ---------------------------------------------------------------- geometry */

/** 5.5in x 8.5in at CSS 96dpi; deviceScaleFactor 2 gives the 1056x1632 plate. */
const PAGE_W = 528;
const PAGE_H = 816;

/** Source photographs are all 1800x2700 — 2:3 portrait. */
const SRC_RATIO = 1.5;

/**
 * One framed photograph. `zoom` is the image width as a multiple of the cell
 * width; `top`/`left` are the source-image fractions that land on the cell's
 * top-left corner. Throws if the framing would leave paper showing inside the
 * cell, so a crop can never silently under-fill.
 */
function cell({ x, y, w, h, file, zoom = 1, top = 0, left = 0, cls = "" }) {
  const imgW = w * zoom;
  const imgH = imgW * SRC_RATIO;
  const offX = -left * imgW;
  const offY = -top * imgH;
  if (imgW + offX < w - 0.5 || imgH + offY < h - 0.5 || offX > 0 || offY > 0) {
    throw new Error(
      `${file}: framing under-fills its ${w}x${h} cell (img ${imgW.toFixed(1)}x${imgH.toFixed(1)} at ${offX.toFixed(1)},${offY.toFixed(1)})`,
    );
  }
  const src = `file://${path.join(SOURCE_DIR, file)}`;
  return (
    `<div class="cell ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">` +
    `<img src="${src}" alt="" style="width:${imgW}px;height:${imgH}px;left:${offX}px;top:${offY}px" />` +
    `</div>`
  );
}

const fontFace = (family, file, weight, style = "normal") =>
  `@font-face { font-family: "${family}"; font-weight: ${weight}; font-style: ${style}; src: url("file://${path.join(FONT_DIR, file)}") format("truetype"); }`;

/** Boards write height to the half inch: 169 cm is 5'6½", not 5'7". */
const cmToFeetInches = (cm) => {
  const halves = Math.round((cm / 2.54) * 2);
  const feet = Math.floor(halves / 24);
  const rest = halves - feet * 24;
  return `${feet}'${Math.floor(rest / 2)}${rest % 2 ? "½" : ""}"`;
};

const NAME = `${TALENT.first_name} ${TALENT.last_name}`.toUpperCase();
const CITY = String(TALENT.city || "").toUpperCase();
const HEIGHT =
  TALENT.height_cm == null
    ? ""
    : `${Math.round(TALENT.height_cm)} CM / ${cmToFeetInches(TALENT.height_cm)}`;

/* ------------------------------------------------------------------- cards */

/**
 * Each card is a template plus the values it interpolates. The geometry is
 * written out as numbers here, not tuned in CSS, so a crop is a recorded
 * decision.
 */
const CARDS = {
  /*
   * THE GRID — structural, reversed. Ink field, the walking frame set into a
   * column module that bleeds off the top and right edges, the name run up a
   * spine rail in a bold grotesque, one rule, a two-word foot. Swiss poster
   * logic: the margin is the design.
   */
  grid: {
    out: "ola-grid-composed.png",
    template: "grid.html",
    fonts: [
      fontFace("CardDisplay", "archivo-700.ttf", 700),
      fontFace("CardBody", "archivo-500.ttf", 500),
      fontFace("CardWordmark", "noto-serif-display-400.ttf", 400),
    ],
    values() {
      const SPINE_W = 92;
      const PHOTO_H = 696;
      const M = 24;
      return {
        SPINE_W,
        PHOTO_H,
        M,
        RULE_Y: PHOTO_H + M,
        FOOT_Y: PHOTO_H + M + 26,
        NAME_SIZE: 58,
        FOOT_SIZE: 9,
        MARK_SIZE: 13,
        // The walking frame: stride at the foot of the cell, crown clear of
        // the top edge, the colonnade running off the right.
        PHOTO: cell({
          x: SPINE_W,
          y: 0,
          w: PAGE_W - SPINE_W,
          h: PHOTO_H,
          file: "01-walking-columns.jpg",
          zoom: 1.38,
          top: 0.16,
          left: 0.058,
        }),
      };
    },
  },

  /*
   * THE STRIP — the working commercial card. Warm paper, a full-bleed colour
   * hero of the frame with the clearest face, a clean-modern name band, and
   * a three-frame strip along the foot that does the back's job on the
   * front: beauty, full length, detail. Rhythm, not a single image.
   */
  strip: {
    out: "ola-strip-composed.png",
    template: "strip.html",
    fonts: [
      fontFace("CardDisplay", "manrope-700.ttf", 700),
      fontFace("CardBody", "manrope-500.ttf", 500),
      fontFace("CardWordmark", "noto-serif-display-400.ttf", 400),
    ],
    values() {
      const HERO_H = 516;
      const BAND_H = 72;
      const M = 24;
      const GUTTER = 8;
      const STRIP_Y = HERO_H + BAND_H;
      const STRIP_W = (PAGE_W - M * 2 - GUTTER * 2) / 3;
      const STRIP_H = 200;
      const stripX = (i) => M + i * (STRIP_W + GUTTER);
      return {
        HERO_H,
        BAND_H,
        M,
        NAME_SIZE: 27,
        MARK_SIZE: 12,
        HERO: cell({
          x: 0,
          y: 0,
          w: PAGE_W,
          h: HERO_H,
          file: "05-editorial-standing.jpg",
          zoom: 1.0,
          top: 0.045,
          left: 0.0,
        }),
        STRIP: [
          // Beauty, native B&W: crown breaks the top, eye line high.
          cell({ x: stripX(0), y: STRIP_Y, w: STRIP_W, h: STRIP_H, file: "07-studio-closeup-bw.jpg", zoom: 1.0, top: 0.06 }),
          // Full length in motion: feet on the floor of the cell.
          cell({ x: stripX(1), y: STRIP_Y, w: STRIP_W, h: STRIP_H, file: "01-walking-columns.jpg", zoom: 1.0, top: 0.07 }),
          // Detail: hands, jewellery, the knit.
          cell({ x: stripX(2), y: STRIP_Y, w: STRIP_W, h: STRIP_H, file: "06-close-jewelry.jpg", zoom: 1.0, top: 0.05 }),
        ].join("\n    "),
      };
    },
  },

  /*
   * THE DIPTYCH — two frames on a hinge. Warm paper, a face and a figure set
   * side by side as two tall panels, the studio beauty in black and white
   * against the full length in colour, read together. Editorial serif name
   * centred under the hinge.
   */
  diptych: {
    out: "ola-diptych-composed.png",
    template: "diptych.html",
    fonts: [
      fontFace("CardDisplay", "playfair-display-500.ttf", 500),
      fontFace("CardBody", "inter-500.ttf", 500),
      fontFace("CardWordmark", "noto-serif-display-400.ttf", 400),
    ],
    values() {
      const M = 22;
      const HINGE = 10;
      const PANEL_W = (PAGE_W - M * 2 - HINGE) / 2;
      const PANEL_H = 660;
      const fullHeight = PANEL_H / SRC_RATIO / PANEL_W; // zoom that shows the full source height
      const centreOn = (fx, zoom) => (fx * PANEL_W * zoom - PANEL_W / 2) / (PANEL_W * zoom);
      return {
        M,
        HINGE,
        PANEL_W,
        PANEL_H,
        HINGE_X: M + PANEL_W + HINGE / 2,
        NAME_SIZE: 24,
        CITY_SIZE: 8,
        MARK_SIZE: 12,
        // The face: tight beauty crop, eyes at 37% of the panel, the black
        // collar held to the foot so the panel is face, not garment.
        LEFT: cell({ x: M, y: M, w: PANEL_W, h: PANEL_H, file: "07-studio-closeup-bw.jpg", zoom: fullHeight * 1.19, top: 0.09, left: centreOn(0.58, fullHeight * 1.19) }),
        // The figure: feet on the floor of the panel, a little more presence
        // than the full frame gives.
        RIGHT: cell({ x: M + PANEL_W + HINGE, y: M, w: PANEL_W, h: PANEL_H, file: "02-full-body-columns.jpg", zoom: fullHeight * 1.1, top: 0.08, left: centreOn(0.47, fullHeight * 1.1) }),
      };
    },
  },
};

/* ------------------------------------------------------------------ render */

function buildHtml(card) {
  const template = fs.readFileSync(path.join(__dirname, card.template), "utf8");
  const values = {
    FONT_FACES: card.fonts.join("\n  "),
    PAGE_W,
    PAGE_H,
    NAME,
    CITY,
    HEIGHT,
    ...card.values(),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`${card.template}: unknown key ${key}`);
    return String(values[key]);
  });
}

async function main() {
  const wanted = process.argv.slice(2);
  const ids = wanted.length ? wanted : Object.keys(CARDS);
  for (const id of ids) if (!CARDS[id]) throw new Error(`unknown card ${id}`);

  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--allow-file-access-from-files"],
  });
  try {
    for (const id of ids) {
      const card = CARDS[id];
      const htmlPath = path.join(WORK_DIR, `comp-card-front-${id}.html`);
      fs.writeFileSync(htmlPath, buildHtml(card));
      const outPath = path.join(OUT_DIR, card.out);

      const page = await browser.newPage();
      await page.setViewport({ width: PAGE_W, height: PAGE_H, deviceScaleFactor: 2 });
      await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: PAGE_W, height: PAGE_H } });
      await page.close();

      const dims = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", outPath]).toString();
      const width = Number(/pixelWidth:\s*(\d+)/.exec(dims)?.[1]);
      const height = Number(/pixelHeight:\s*(\d+)/.exec(dims)?.[1]);
      if (width !== PAGE_W * 2 || height !== PAGE_H * 2) {
        throw new Error(`${id}: expected ${PAGE_W * 2}x${PAGE_H * 2}, got ${width}x${height}`);
      }
      console.log(`${path.relative(SITE, outPath)}  ${width}x${height}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
