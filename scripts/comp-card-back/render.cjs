#!/usr/bin/env node
/**
 * Render the hand-composed back of Ola Szkolda's comp card.
 *
 *   node scripts/comp-card-back/render.cjs
 *
 * The front (public/generated/comp-card/ola-editorial-masthead-front.png) is
 * still the composed engine's output, edition `editorial-masthead`. The back
 * is composed here instead, because the engine's generic back centre-crops
 * every photograph into an equal square and reads as a card grid.
 *
 * What this composes: four photographs in a flat 2x2 grid of portrait cells,
 * each framed by hand (its own scale and offset — no centre crop, no filter),
 * over a quiet stats band at the foot. The stats print only the fields the
 * talent record actually carries; nothing is invented and nothing is stubbed.
 *
 * Puppeteer and the vendored TTFs come from the sibling pholio-app checkout,
 * exactly as scripts/render-comp-cards.cjs loads them. Nothing is fetched.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const SITE = path.resolve(__dirname, "..", "..");
const APP = path.resolve(SITE, "..", "pholio-app");
const appRequire = (name) => require(path.join(APP, "node_modules", name));
const puppeteer = appRequire("puppeteer");

const FONT_DIR = path.join(APP, "public", "fonts", "compcard");
const SOURCE_DIR = path.join(SITE, "01-ola-szkolda");
const WORK_DIR = path.join(SITE, ".comp-card-build");
const OUT_PATH = path.join(
  SITE,
  "public",
  "generated",
  "comp-card",
  "ola-editorial-masthead-back-composed.png",
);

const { TALENT } = require(path.join(SITE, "scripts", "ola-talent.cjs"));

/* ---------------------------------------------------------------- geometry */

/** 5.5in x 8.5in at CSS 96dpi; deviceScaleFactor 2 gives the 1056x1632 plate. */
const PAGE_W = 528;
const PAGE_H = 816;

const MARGIN = PAGE_W * 0.05; // 26.4 — uniform cream frame, no bleed
const GUTTER = PAGE_W * 0.03; // 15.84 — identical horizontally and vertically

const CONTENT_W = PAGE_W - MARGIN * 2;
const CELL_W = (CONTENT_W - GUTTER) / 2;
const CELL_H = CELL_W * 1.35; // portrait cells, 1 : 1.35
const GRID_H = CELL_H * 2 + GUTTER;
const BAND_TOP = MARGIN + GRID_H + GUTTER;

/** Source photographs are all 1800x2700 — 2:3 portrait. */
const SRC_RATIO = 1.5;

/**
 * Per-cell framing. `zoom` is the image width as a multiple of the cell width;
 * `top`/`left` are the source-image fractions that land on the cell's top-left
 * corner. Every number below was chosen against a named landmark in the
 * photograph, not by centring it.
 */
const CELLS = [
  {
    // Beauty reference, native B&W. Tight: the crown breaks the top edge the
    // way a beauty crop does, eye line at 30% of the cell, collar at the foot.
    file: "07-studio-closeup-bw.jpg",
    zoom: 1.06,
    top: 0.135,
    left: 0.028,
  },
  {
    // Editorial half-body. Framed so the eye line matches cell 1 at 30% and
    // the top row scans as one line of sight; foot of the cell at the waist.
    file: "05-editorial-standing.jpg",
    zoom: 1.42,
    top: 0.0,
    left: 0.158,
  },
  {
    // The full-length. Headroom above the crown, floor beneath the shoes; the
    // head is deliberately small here — this cell is proportion, not face.
    file: "02-full-body-columns.jpg",
    zoom: 1.142,
    top: 0.212,
    left: 0.074,
  },
  {
    // The commercial look. Face high in the cell, both hands and the bag
    // inside the frame — this is the cell that reads as a booking.
    file: "04-front-with-bag.jpg",
    zoom: 1.06,
    top: 0.102,
    left: 0.048,
  },
];

/* ------------------------------------------------------------------- stats */

const caps = (value) => String(value).trim().toUpperCase();

const cmToFeetInches = (cm) => {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return `${feet}'${inches}"`;
};

const cmToInches = (cm) => Math.round(cm / 2.54);

/**
 * The full agency order, women's board convention: height, bust, waist, hips,
 * dress, shoes, hair, eyes. Each entry returns null when the record has no
 * value, and a null field is not printed — never a dash, never a placeholder,
 * never a guess. Inventing a measurement for a real person misrepresents her.
 */
const FIELDS = [
  {
    label: "HEIGHT",
    value: (t) =>
      t.height_cm == null
        ? null
        : `${Math.round(t.height_cm)} CM / ${cmToFeetInches(t.height_cm)}`,
  },
  {
    label: "BUST",
    value: (t) =>
      t.bust_cm == null
        ? null
        : `${Math.round(t.bust_cm)} / ${cmToInches(t.bust_cm)}`,
  },
  {
    label: "WAIST",
    value: (t) =>
      t.waist_cm == null
        ? null
        : `${Math.round(t.waist_cm)} / ${cmToInches(t.waist_cm)}`,
  },
  {
    label: "HIPS",
    value: (t) =>
      t.hips_cm == null
        ? null
        : `${Math.round(t.hips_cm)} / ${cmToInches(t.hips_cm)}`,
  },
  {
    label: "DRESS",
    value: (t) => (t.dress_size == null ? null : caps(t.dress_size)),
  },
  {
    label: "SHOES",
    // shoe_size is the EU number the profile form collects; the US women's
    // equivalent is the same number less 31.
    value: (t) => {
      if (t.shoe_size == null) return null;
      const eu = Number(t.shoe_size);
      if (!Number.isFinite(eu)) return caps(t.shoe_size);
      return `EU ${eu} / US ${eu - 31}`;
    },
  },
  {
    label: "HAIR",
    value: (t) => (t.hair_color == null ? null : caps(t.hair_color)),
  },
  {
    label: "EYES",
    value: (t) => (t.eye_color == null ? null : caps(t.eye_color)),
  },
];

function statPairs(talent) {
  return FIELDS.map((field) => ({
    label: field.label,
    value: field.value(talent),
  })).filter((pair) => pair.value != null && pair.value !== "");
}

/** Label at 60% ink, value at full ink, same size, a 2em space between pairs. */
function statsHtml(pairs) {
  return pairs
    .map(
      (pair) =>
        `<span class="label">${pair.label}</span> <span class="value">${pair.value}</span>`,
    )
    .join('<span class="gap"></span>');
}

/* -------------------------------------------------------------------- self-check */

function assertFormatting() {
  const sample = statPairs({
    height_cm: 180,
    bust_cm: 84,
    waist_cm: 61,
    hips_cm: 87,
    dress_size: "eu 34",
    shoe_size: 40,
    hair_color: "blonde",
    eye_color: "blue",
  });
  const expected = [
    ["HEIGHT", `180 CM / 5'11"`],
    ["BUST", "84 / 33"],
    ["WAIST", "61 / 24"],
    ["HIPS", "87 / 34"],
    ["DRESS", "EU 34"],
    ["SHOES", "EU 40 / US 9"],
    ["HAIR", "BLONDE"],
    ["EYES", "BLUE"],
  ];
  expected.forEach(([label, value], i) => {
    if (sample[i].label !== label || sample[i].value !== value) {
      throw new Error(
        `stats formatting: expected ${label} ${value}, got ${sample[i].label} ${sample[i].value}`,
      );
    }
  });
  const empty = statPairs({});
  if (empty.length !== 0) {
    throw new Error("stats formatting: null fields must not print");
  }
}

/* ------------------------------------------------------------------ render */

const fontFace = (family, file, weight) =>
  `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url("file://${path.join(FONT_DIR, file)}") format("truetype"); }`;

function buildHtml() {
  const template = fs.readFileSync(
    path.join(__dirname, "template.html"),
    "utf8",
  );

  const cells = CELLS.map((cell, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = MARGIN + col * (CELL_W + GUTTER);
    const y = MARGIN + row * (CELL_H + GUTTER);
    const imgW = CELL_W * cell.zoom;
    const imgH = imgW * SRC_RATIO;
    const src = `file://${path.join(SOURCE_DIR, cell.file)}`;
    return [
      `<div class="cell" style="left:${x}px;top:${y}px;width:${CELL_W}px;height:${CELL_H}px">`,
      `<img src="${src}" alt="" style="width:${imgW}px;height:${imgH}px;`,
      `left:${-cell.left * imgW}px;top:${-cell.top * imgH}px" />`,
      `</div>`,
    ].join("");
  }).join("\n    ");

  const fonts = [
    // The name is set in the face the front's masthead uses: the composed
    // engine's "romantic-didone" voice maps to Bodoni Moda (pholio-app
    // src/domains/pdf/composition/font-library.js), so both sides of the card
    // carry one display voice.
    fontFace("CardDisplay", "bodoni-moda-400.ttf", 400),
    fontFace("CardBody", "inter-400.ttf", 400),
    fontFace("CardBody", "inter-500.ttf", 500),
    // The wordmark is the site's own: Noto Serif Display 400, 0.2em tracking,
    // in the dark gold that holds contrast on cream (components/header/kit.tsx).
    fontFace("CardWordmark", "noto-serif-display-400.ttf", 400),
  ].join("\n  ");

  const statsSize = PAGE_H * 0.0106; // 8.65px — 6.5pt equivalent
  const statsLeading = statsSize * 1.9;

  const values = {
    FONT_FACES: fonts,
    PAGE_W,
    PAGE_H,
    MARGIN,
    BAND_TOP,
    CELLS: cells,
    NAME: `${TALENT.first_name} ${TALENT.last_name}`.toUpperCase(),
    NAME_SIZE: PAGE_H * 0.023, // 18.77px — a caption, a quarter of the front
    NAME_TRACKING: 0.13,
    NAME_TOP: 11,
    STATS: statsHtml(statPairs(TALENT)),
    STATS_SIZE: statsSize,
    STATS_LEADING: statsLeading,
    STATS_BLOCK: statsLeading * 2, // two lines reserved, filled or not
    STATS_GAP: 13,
    MARK_SIZE: PAGE_H * 0.016, // 13.06px
    CONTACT_SIZE: PAGE_H * 0.009, // 7.34px
    CONTACT_GAP: 5,
  };

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`template: unknown key ${key}`);
    return String(values[key]);
  });
}

async function main() {
  assertFormatting();

  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  const htmlPath = path.join(WORK_DIR, "comp-card-back.html");
  fs.writeFileSync(htmlPath, buildHtml());

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--allow-file-access-from-files"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: PAGE_W,
      height: PAGE_H,
      deviceScaleFactor: 2,
    });
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await page.screenshot({
      path: OUT_PATH,
      clip: { x: 0, y: 0, width: PAGE_W, height: PAGE_H },
    });
  } finally {
    await browser.close();
  }

  const { execFileSync } = require("child_process");
  const dims = execFileSync("sips", [
    "-g",
    "pixelWidth",
    "-g",
    "pixelHeight",
    OUT_PATH,
  ]).toString();
  const width = Number(/pixelWidth:\s*(\d+)/.exec(dims)?.[1]);
  const height = Number(/pixelHeight:\s*(\d+)/.exec(dims)?.[1]);
  if (width !== PAGE_W * 2 || height !== PAGE_H * 2) {
    throw new Error(
      `expected ${PAGE_W * 2}x${PAGE_H * 2}, got ${width}x${height}`,
    );
  }

  console.log(`${path.relative(SITE, OUT_PATH)}  ${width}x${height}`);
  console.log(
    `stats: ${statPairs(TALENT)
      .map((p) => `${p.label} ${p.value}`)
      .join("   ")}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
