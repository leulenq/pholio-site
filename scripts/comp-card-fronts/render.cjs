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
const SITE_SOURCE_DIR = path.join(SITE, "public", "generated", "comp-card", "source");

function cell({ x, y, w, h, file, dir, src: explicitSrc, ratio = SRC_RATIO, zoom = 1, top = 0, left = 0, cls = "" }) {
  const imgW = w * zoom;
  const imgH = imgW * ratio;
  const offX = -left * imgW;
  const offY = -top * imgH;
  if (imgW + offX < w - 0.5 || imgH + offY < h - 0.5 || offX > 0 || offY > 0) {
    throw new Error(
      `${file}: framing under-fills its ${w}x${h} cell (img ${imgW.toFixed(1)}x${imgH.toFixed(1)} at ${offX.toFixed(1)},${offY.toFixed(1)})`,
    );
  }
  const src = explicitSrc || `file://${path.join(dir === "site-source" ? SITE_SOURCE_DIR : SOURCE_DIR, file)}`;
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
const HEIGHT_CM =
  TALENT.height_cm == null ? "" : `${Math.round(TALENT.height_cm)} CM`;
const HEIGHT_FT =
  TALENT.height_cm == null ? "" : cmToFeetInches(TALENT.height_cm);
const HEIGHT = [HEIGHT_CM, HEIGHT_FT].filter(Boolean).join(" / ");


/* --------------------------------------------------------- the cover story */

const COVER = {
  MARGIN_X: 16,
  MARGIN_TOP: 16,
  MARGIN_FOOT: 16,
  TRACKING: -0.04,
  SIZE_MAX: 150,
  // A surname that would have to drop below this to span the width is
  // broken at its own hyphen or space into lines that each span it.
  STACK_BELOW: 64,
  INK_SWITCH: 0.45,
};

const ASSETS_DIR = path.join(__dirname, "assets");
const CUTOUT_DIR = path.join(WORK_DIR, "cutouts");

/**
 * The figure alone: the source photograph with its stored matte
 * (assets/<name>.matte.png, from matte.cjs) joined back on as alpha, built
 * into the work dir. Returns null when there is no matte, in which case the
 * type sits in front of the photograph and the card says so on stdout.
 */
async function figureCutout(file, dir) {
  const name = path.parse(file).name;
  const matte = path.join(ASSETS_DIR, `${name}.matte.png`);
  if (!fs.existsSync(matte)) return null;
  const src = path.join(dir === "site-source" ? SITE_SOURCE_DIR : SOURCE_DIR, file);
  const out = path.join(CUTOUT_DIR, `${name}.png`);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(matte).mtimeMs) {
    fs.mkdirSync(CUTOUT_DIR, { recursive: true });
    const sharp = appRequire("sharp");
    const { data: alpha, info } = await sharp(matte).toColourspace("b-w").raw().toBuffer({ resolveWithObject: true });
    const { data: rgb, info: rgbInfo } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    if (rgbInfo.width !== info.width || rgbInfo.height !== info.height) {
      throw new Error(`${file}: matte ${info.width}x${info.height} does not match the photograph ${rgbInfo.width}x${rgbInfo.height}`);
    }
    // Interleave RGB + matte into RGBA by hand; sharp's channel join does
    // not mark the fourth band as alpha for a PNG.
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0, j = 0, k = 0; i < rgba.length; i += 4, j += 3, k += 1) {
      rgba[i] = rgb[j];
      rgba[i + 1] = rgb[j + 1];
      rgba[i + 2] = rgb[j + 2];
      rgba[i + 3] = alpha[k];
    }
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(out);
    const meta = await sharp(out).metadata();
    if (!meta.hasAlpha) throw new Error(`${out}: cutout has no alpha channel`);
  }
  return out;
}

/**
 * Luminance of the photograph as the card will show it, on a coarse grid
 * (one cell per LUMA_CELL px of the page), so the page can choose light or
 * dark ink for each word from what is actually beneath it. Computed here
 * because a file-served image cannot be read back from a canvas in-page.
 */
const LUMA_CELL = 8;
async function lumaGrid(photo) {
  const sharp = appRequire("sharp");
  const { file, dir, ratio = SRC_RATIO, zoom = 1, top = 0, left = 0 } = photo;
  const src = path.join(dir === "site-source" ? SITE_SOURCE_DIR : SOURCE_DIR, file);
  const imgW = Math.round(PAGE_W * zoom);
  const imgH = Math.round(imgW * ratio);
  const cols = Math.ceil(PAGE_W / LUMA_CELL);
  const rows = Math.ceil(PAGE_H / LUMA_CELL);
  // Two pipelines: sharp allows one resize per pipeline.
  const window = await sharp(src)
    .resize(imgW, imgH)
    .extract({ left: Math.round(left * imgW), top: Math.round(top * imgH), width: PAGE_W, height: PAGE_H })
    .toBuffer();
  const { data } = await sharp(window)
    .toColourspace("b-w")
    .resize(cols, rows, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { cols, rows, cell: LUMA_CELL, data: Array.from(data) };
}

const escapeXml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function coverValues({ given, family, photo }) {
  const cutout = await figureCutout(photo.file, photo.dir);
  const frame = { x: 0, y: 0, w: PAGE_W, h: PAGE_H, ...photo };
  return {
    ...COVER,
    LUMA_JSON: JSON.stringify(await lumaGrid(photo)),
    GIVEN_JSON: JSON.stringify(String(given || "").toUpperCase()),
    FAMILY_JSON: JSON.stringify(String(family || "").toUpperCase()),
    PHOTO: cell({ ...frame, cls: "photo" }),
    FIGURE: cutout ? cell({ ...frame, src: `file://${cutout}`, cls: "figure" }) : "",
    HAS_FIGURE: Boolean(cutout),
  };
}

/**
 * The design as a system: the same template over other names and
 * photographs. `node render.cjs --cover-tests` writes them to the build dir.
 * These records are fixtures, not people; the names are invented. Only the
 * walking frame has a matte, so only it sets the type behind the figure.
 */
const COVER_FIXTURES = [
  { id: "long-family", given: "Aleksandra", family: "Wiśniewska-Nowakowska",
    photo: { file: "02-full-body-columns.jpg", zoom: 1.2, top: 0.08, left: 0.1 } },
  { id: "short", given: "Mia", family: "Li",
    photo: { dir: "site-source", file: "mara-voss-red-hero.jpg", zoom: 1.1, top: 0.0, left: 0.06 } },
  { id: "long-given", given: "Maria Fernanda", family: "Ibarra",
    photo: { dir: "site-source", file: "mara-voss-crossed-arm.jpg", ratio: 2087 / 1400, zoom: 1.1, top: 0.0, left: 0.06 } },
  { id: "diacritics", given: "Zoë", family: "Østergaard",
    photo: { file: "05-editorial-standing.jpg", zoom: 1.15, top: 0.02, left: 0.08 } },
  { id: "dark-frame", given: "Ola", family: "Szkolda",
    photo: { dir: "site-source", file: "ola-night-street.jpg", ratio: 1640 / 970, zoom: 1.02, top: 0.0, left: 0.01 } },
  { id: "high-key", given: "Ola", family: "Szkolda",
    photo: { file: "07-studio-closeup-bw.jpg", zoom: 1.1, top: 0.0, left: 0.05 } },
  { id: "single-name", given: "", family: "Szkolda",
    photo: { file: "01-walking-columns.jpg", zoom: 1.2, top: 0.1, left: 0.06 } },
];

/* ------------------------------------------------------------------- cards */

/**
 * Each card is a template plus the values it interpolates. The geometry is
 * written out as numbers here, not tuned in CSS, so a crop is a recorded
 * decision.
 */
const CARDS = {
  /*
   * THE COVER STORY — the photograph is the whole page and the name is the
   * only intervention. Display grotesque at trim-to-trim scale, set behind
   * the figure: the surname across the foot with her stride in front of
   * it, the given name at the head on the right, the two words bracketing
   * her. Each word takes light or dark ink from the luminance of the
   * photograph beneath it. No mark, no metadata.
   *
   * The figure layer comes from a stored matte (assets/, matte.cjs); the
   * words are fitted to the trims by measured ink in-page
   * (cover-story.html).
   */
  cover: {
    out: "ola-cover-story-composed.png",
    template: "cover-story.html",
    fonts: [fontFace("CardDisplay", "archivo-700.ttf", 700)],
    values: () =>
      coverValues({
        given: TALENT.first_name,
        family: TALENT.last_name,
        photo: {
          // The walking frame nearly whole: crown near a quarter of the
          // page, the stride on the foot line where the surname sits.
          file: "01-walking-columns.jpg",
          zoom: 1.2,
          top: 0.1,
          left: 0.06,
        },
      }),
    ready: "__ready",
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

async function buildHtml(card) {
  const template = fs.readFileSync(path.join(__dirname, card.template), "utf8");
  const values = {
    FONT_FACES: card.fonts.join("\n  "),
    PAGE_W,
    PAGE_H,
    NAME,
    CITY,
    HEIGHT,
    ...(await card.values()),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`${card.template}: unknown key ${key}`);
    return String(values[key]);
  });
}

async function renderCard(browser, card, htmlPath, outPath) {
  fs.writeFileSync(htmlPath, await buildHtml(card));
  const page = await browser.newPage();
  await page.setViewport({ width: PAGE_W, height: PAGE_H, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  if (card.ready) await page.evaluate((key) => window[key], card.ready);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: PAGE_W, height: PAGE_H } });
  const layout = await page.evaluate(() => window.__layout || null);
  await page.close();
  return layout;
}

const describeLayout = (layout) =>
  layout
    ? layout.words.map((w) => `${w.text} ${w.size.toFixed(0)}px ${w.fill === "#111111" ? "dark" : "light"} (luma ${w.luma.toFixed(2)})`).join("  ")
    : "";

async function coverTests(browser) {
  const dir = path.join(WORK_DIR, "cover-tests");
  fs.mkdirSync(dir, { recursive: true });
  const cover = CARDS.cover;
  for (const fx of COVER_FIXTURES) {
    const card = { ...cover, values: () => coverValues({ given: fx.given, family: fx.family, photo: fx.photo }) };
    const out = path.join(dir, `${fx.id}.png`);
    const layout = await renderCard(browser, card, path.join(dir, `${fx.id}.html`), out);
    console.log(`${path.relative(SITE, out)}  ${describeLayout(layout)}`);
  }
}

async function main() {
  const wanted = process.argv.slice(2);
  const tests = wanted.includes("--cover-tests");
  const ids = tests ? [] : wanted.length ? wanted : Object.keys(CARDS);
  for (const id of ids) if (!CARDS[id]) throw new Error(`unknown card ${id}`);

  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--allow-file-access-from-files"],
  });
  try {
    if (tests) await coverTests(browser);
    for (const id of ids) {
      const card = CARDS[id];
      const htmlPath = path.join(WORK_DIR, `comp-card-front-${id}.html`);
      const outPath = path.join(OUT_DIR, card.out);
      const rail = await renderCard(browser, card, htmlPath, outPath);
      if (rail) console.log(`layout: ${describeLayout(rail)}`);

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
