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

function cell({ x, y, w, h, file, dir, ratio = SRC_RATIO, zoom = 1, top = 0, left = 0, cls = "" }) {
  const imgW = w * zoom;
  const imgH = imgW * ratio;
  const offX = -left * imgW;
  const offY = -top * imgH;
  if (imgW + offX < w - 0.5 || imgH + offY < h - 0.5 || offX > 0 || offY > 0) {
    throw new Error(
      `${file}: framing under-fills its ${w}x${h} cell (img ${imgW.toFixed(1)}x${imgH.toFixed(1)} at ${offX.toFixed(1)},${offY.toFixed(1)})`,
    );
  }
  const src = `file://${path.join(dir === "site-source" ? SITE_SOURCE_DIR : SOURCE_DIR, file)}`;
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


/* -------------------------------------------------------------- the grid */

/** Archivo 700's cap height, measured in Chromium (H, actualBoundingBoxAscent). */
const ARCHIVO_CAP = 0.686;

const GRID = {
  M: 24,
  NAME_MAX: 64,
  NAME_TRACKING: -0.005,
  STACK_BELOW: 40,
  CAP: ARCHIVO_CAP,
  REP_SIZE: 9,
  GAP_MIN: 32,
};
/** Rail width: cap height of the largest name plus a margin either side. */
GRID.RAIL_W = Math.round(GRID.M + ARCHIVO_CAP * GRID.NAME_MAX + GRID.M);
GRID.BASELINE_X = GRID.M + ARCHIVO_CAP * GRID.NAME_MAX;
/** Two stacked caps and a gap of a fifth of a cap fill the same slot. */
GRID.STACK_SIZE = (ARCHIVO_CAP * GRID.NAME_MAX) / (2.2 * ARCHIVO_CAP);

/**
 * Who to call. Represented talent: the agency and its office. Independent
 * talent: their own address (portfolio or email). Nothing invented; an
 * empty record yields no line and the rail carries the name alone.
 */
function representation(talent) {
  const segments = [];
  if (talent.agency_name) {
    segments.push({ text: String(talent.agency_name).toUpperCase(), kind: "caps" });
    if (talent.agency_city) segments.push({ text: String(talent.agency_city).toUpperCase(), kind: "caps" });
    return segments;
  }
  const address = talent.portfolio_url || talent.contact_email || (talent.slug ? `pholio.studio/${talent.slug}` : null);
  if (address) segments.push({ text: String(address).replace(/^https?:\/\//, ""), kind: "addr" });
  return segments;
}

const escapeXml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function repHtml(segments) {
  return segments
    .map((seg, i) => `<tspan class="${seg.kind}"${i ? ' dx="1.8em"' : ""}>${escapeXml(seg.text)}</tspan>`)
    .join("");
}

/** `module`: "bleed" (three edges), "tb" (inset head and foot, bleed right) or "all" (inset on the page margins). */
function gridValues({ name, rep, photo, module = "bleed" }) {
  const { M, RAIL_W } = GRID;
  const insetY = module !== "bleed";
  const insetR = module === "all";
  return {
    ...GRID,
    NAME: escapeXml(name),
    REP: repHtml(rep || []),
    PHOTO: cell({
      x: RAIL_W,
      y: insetY ? M : 0,
      w: PAGE_W - RAIL_W - (insetR ? M : 0),
      h: insetY ? PAGE_H - 2 * M : PAGE_H,
      ...photo,
    }),
  };
}

/**
 * The design as a system: the same template over other names, records and
 * photographs. `node render.cjs --grid-tests` writes them to the build dir.
 * These records are fixtures, not people; the names and agencies are invented.
 */
const GRID_FIXTURES = [
  { id: "long-represented", name: "Aleksandra Wiśniewska-Nowakowska", rep: [{ text: "NORTHLIGHT MANAGEMENT", kind: "caps" }, { text: "WARSAW", kind: "caps" }],
    photo: { file: "02-full-body-columns.jpg", zoom: 1.5, top: 0.16, left: 0.12 } },
  { id: "short-independent", name: "Mia Li", rep: [{ text: "mia.li@example.com", kind: "addr" }],
    photo: { dir: "site-source", file: "mara-voss-red-hero.jpg", zoom: 1.3, top: 0.02, left: 0.13 } },
  { id: "name-only", name: "Kit Sato", rep: [],
    photo: { dir: "site-source", file: "mara-voss-profile.jpg", zoom: 1.35, top: 0.0, left: 0.16 } },
  { id: "very-long", name: "Maria Fernanda de la Cruz Ibarra", rep: [{ text: "HARBOUR MANAGEMENT", kind: "caps" }, { text: "NEW YORK", kind: "caps" }, { text: "+1 212 555 0100", kind: "caps" }],
    photo: { dir: "site-source", file: "mara-voss-crossed-arm.jpg", ratio: 2087 / 1400, zoom: 1.3, top: 0.02, left: 0.1 } },
  { id: "diacritics", name: "Zoë Müller-Østergaard", rep: [{ text: "ATELIER MODELS", kind: "caps" }, { text: "PARIS", kind: "caps" }],
    photo: { file: "05-editorial-standing.jpg", zoom: 1.4, top: 0.02, left: 0.14 } },
  { id: "dark-frame", name: "Ola Szkolda", rep: [{ text: "pholio.studio/ola-szkolda", kind: "addr" }],
    photo: { dir: "site-source", file: "ola-night-street.jpg", ratio: 1640 / 970, zoom: 1.15, top: 0.02, left: 0.08 } },
  { id: "headshot", name: "Ola Szkolda", rep: [{ text: "pholio.studio/ola-szkolda", kind: "addr" }],
    photo: { file: "07-studio-closeup-bw.jpg", zoom: 1.32, top: 0.02, left: 0.16 } },
  { id: "module-tb", name: "Ola Szkolda", rep: [{ text: "pholio.studio/ola-szkolda", kind: "addr" }], module: "tb",
    photo: { file: "01-walking-columns.jpg", zoom: 1.5, top: 0.135, left: 0.1 } },
  { id: "module-all", name: "Ola Szkolda", rep: [{ text: "pholio.studio/ola-szkolda", kind: "addr" }], module: "all",
    photo: { file: "01-walking-columns.jpg", zoom: 1.58, top: 0.135, left: 0.1 } },
];

/* ------------------------------------------------------------------- cards */

/**
 * Each card is a template plus the values it interpolates. The geometry is
 * written out as numbers here, not tuned in CSS, so a crop is a recorded
 * decision.
 */
const CARDS = {
  /*
   * THE GRID — structural. White paper, two columns and nothing else: a
   * type rail on the left and the photograph as the other column.
   *
   * The photograph sits on the page margins as a module; the rail is the
 * left margin widened to carry the type. One margin system governs both.
 *
 * The rail is one line of type read upward on one shared baseline: the
   * name in a bold grotesque from the foot margin, the representation (the
   * agency and its office, or an independent talent's address) to the head
   * margin, the clear rail between them being the measure of the name. The
   * rail's width is the name's cap height plus a margin either side, so it
   * does not move from talent to talent; a long name scales down on the
   * same baseline rather than widening it. Placement is by ink, in-page,
   * from the browser's own metrics (grid.html).
   *
   * What the front carries: the name and who to call. Measurements are the
   * back's, in the agency order, and are not repeated here.
   */
  grid: {
    out: "ola-grid-composed.png",
    template: "grid.html",
    fonts: [
      fontFace("CardDisplay", "archivo-700.ttf", 700),
      fontFace("CardBody", "archivo-500.ttf", 500),
    ],
    values: () =>
      gridValues({
        name: NAME,
        rep: representation(TALENT),
        // The photograph is a module on the page margins, so the rail's
        // type and the picture start and end on the same lines. It is not
        // bled: a bleed would leave the rail's margins with nothing to
        // answer them and the grid would be asserted, not shown.
        module: "all",
        photo: {
          // The walking frame: crown near a fifth of the module, the stride
          // held just above its foot, the bag inside the right edge, and
          // the niche in the colonnade shown whole so it reads as
          // architecture.
          file: "01-walking-columns.jpg",
          zoom: 1.58,
          top: 0.135,
          left: 0.1,
        },
      }),
    ready: "__railReady",
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

async function renderCard(browser, card, htmlPath, outPath) {
  fs.writeFileSync(htmlPath, buildHtml(card));
  const page = await browser.newPage();
  await page.setViewport({ width: PAGE_W, height: PAGE_H, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  if (card.ready) await page.evaluate((key) => window[key], card.ready);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: PAGE_W, height: PAGE_H } });
  const rail = await page.evaluate(() => window.__rail || null);
  await page.close();
  return rail;
}

async function gridTests(browser) {
  const dir = path.join(WORK_DIR, "grid-tests");
  fs.mkdirSync(dir, { recursive: true });
  const grid = CARDS.grid;
  for (const fx of GRID_FIXTURES) {
    const card = { ...grid, values: () => gridValues({ name: fx.name.toUpperCase(), rep: fx.rep, photo: fx.photo, module: fx.module }) };
    const out = path.join(dir, `${fx.id}.png`);
    const rail = await renderCard(browser, card, path.join(dir, `${fx.id}.html`), out);
    console.log(`${path.relative(SITE, out)}  name ${rail.size.toFixed(1)}px${rail.stacked ? " stacked" : ""}  rep ${rail.repLength.toFixed(0)}px`);
  }
}

async function main() {
  const wanted = process.argv.slice(2);
  const tests = wanted.includes("--grid-tests");
  const ids = tests ? [] : wanted.length ? wanted : Object.keys(CARDS);
  for (const id of ids) if (!CARDS[id]) throw new Error(`unknown card ${id}`);

  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--allow-file-access-from-files"],
  });
  try {
    if (tests) await gridTests(browser);
    for (const id of ids) {
      const card = CARDS[id];
      const htmlPath = path.join(WORK_DIR, `comp-card-front-${id}.html`);
      const outPath = path.join(OUT_DIR, card.out);
      const rail = await renderCard(browser, card, htmlPath, outPath);
      if (rail) console.log(`rail: name ${rail.size.toFixed(1)}px${rail.stacked ? " stacked" : ""}, representation ${rail.repLength.toFixed(0)}px`);

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
