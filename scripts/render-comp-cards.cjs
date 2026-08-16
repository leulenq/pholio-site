#!/usr/bin/env node
/**
 * Render real comp cards for the home page, through pholio-app's actual engine.
 *
 *   node scripts/render-comp-cards.cjs
 *
 * The home page's comp-card beat must show genuine product output, not a
 * mock built from divs (`03-banned-ui.md` §4.6). This drives
 * `composeCompCard` from `pholio-app` directly — the same function the
 * product's PDF route calls — over the real photographs in
 * `01-ola-szkolda/`, with `aiAdvice: false` so the result is deterministic
 * and needs no network, no database and no Groq key.
 *
 * Editions are requested by id rather than drawn, so the caption on the site
 * and the artwork it labels cannot disagree. Labels are read back out of the
 * shipped catalog for the same reason: the spec's catalog and the code's have
 * already drifted once (`fresh-commercial` in the spec is `the-strip` in
 * code), and the site must follow the code.
 *
 * No filter is applied to the photography. The engine's "Never" list starts
 * with photo manipulation, and every edition's paper is white or ivory apart
 * from `ink-noir`; a desaturated card would misrepresent the product.
 */

"use strict";

const fs = require("fs");
const path = require("path");


const APP = path.resolve(__dirname, "..", "..", "pholio-app");

// Resolved from pholio-app so this script needs no dependencies of its own.
const appRequire = (name) => require(path.join(APP, "node_modules", name));
const ejs = appRequire("ejs");
const SITE = path.resolve(__dirname, "..");

const { composeCompCard, ENGINE_VERSION } = require(
  path.join(APP, "src", "domains", "pdf", "composition"),
);
const { forensicsForImages } = require(
  path.join(APP, "src", "domains", "pdf", "composition", "image-forensics"),
);
const { fontFaceCss, FONT_DIR } = require(
  path.join(APP, "src", "domains", "pdf", "composition", "perception", "font-files"),
);
const { listEditions } = require(
  path.join(APP, "src", "domains", "pdf", "composition", "editions"),
);

const TEMPLATE_PATH = path.join(
  APP, "src", "domains", "pdf", "templates", "compcard-composed.ejs",
);

/** 5.5in × 8.5in at CSS 96dpi — the industry card, unchanged. */
const PAGE_W = 528;
const PAGE_H = 816;

const SOURCE_DIR = path.join(SITE, "01-ola-szkolda");
const WORK_DIR = path.join(SITE, ".comp-card-build");
const OUT_DIR = path.join(SITE, "public", "generated", "comp-card");

// The talent, the photo pool and the locked hero are shared with the Studio+
// portfolio render so the card and the website on the same page cannot
// disagree. Measurements are deliberately null there; see the file's header.
const { TALENT, ARCHETYPE, PHOTOS, HERO_PHOTO } = require("./ola-talent.cjs");

/**
 * The four editions the page shows.
 *
 * These mirror the four directions the earlier comp-card beat used, matched
 * to the shipped catalog after rendering all nine:
 *
 *   house-classic      full bleed photo, name set into the foot
 *   gallery-monograph   photo inset on an ivory mat, name below
 *   editorial-masthead  photo over a cream band carrying the name
 *   ink-noir            the one dark paper, name reversed out
 *
 * `house-classic` is also the card the capture beat morphs into, because a
 * full bleed photo is the only structure a full bleed source plate can
 * become without the crop jumping. A matted card here is what made that
 * transition read as misaligned.
 */
const SHOW = process.env.EDITIONS
  ? process.env.EDITIONS.split(",")
  : ["house-classic", "gallery-monograph", "editorial-masthead", "ink-noir"];

async function buildRows() {
  const sharp = appRequire("sharp");
  fs.mkdirSync(path.join(WORK_DIR, "source"), { recursive: true });

  const rows = [];
  for (const [index, photo] of PHOTOS.entries()) {
    const from = path.join(SOURCE_DIR, photo.file);
    if (!fs.existsSync(from)) throw new Error(`missing source photo: ${from}`);
    const id = `ola-${String(index + 1).padStart(2, "0")}`;
    const to = path.join(WORK_DIR, "source", `${id}.jpg`);
    // Re-encode at a sane working size. No colour operation of any kind.
    await sharp(from).resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 92 }).toFile(to);
    const meta = await sharp(to).metadata();
    rows.push({
      id,
      profile_id: TALENT.id,
      path: `source/${id}.jpg`,
      label: photo.label,
      sort: index + 1,
      shot_type: photo.shot_type,
      style_type: null,
      width: meta.width,
      height: meta.height,
      is_primary: Boolean(photo.is_primary),
      usage_rights: "granted",
      created_at: new Date().toISOString(),
    });
  }
  return rows;
}

/** Copy the TTFs a plan needs next to the card and point the CSS at them. */
function vendorFonts(families) {
  const css = fontFaceCss(families);
  if (!css) throw new Error(`no vendored fonts for ${JSON.stringify(families)}`);
  const fontsDir = path.join(WORK_DIR, "fonts");
  fs.mkdirSync(fontsDir, { recursive: true });
  return css.replace(/url\('\/fonts\/compcard\/([^']+)'\)/g, (_m, file) => {
    const dst = path.join(fontsDir, file);
    if (!fs.existsSync(dst)) fs.copyFileSync(path.join(FONT_DIR, file), dst);
    return `url('../fonts/${file}')`;
  });
}

async function main() {
  const catalog = new Map(listEditions().map((e) => [e.id, e.label]));
  for (const id of SHOW) {
    if (!catalog.has(id)) throw new Error(`edition not in shipped catalog: ${id}`);
  }

  const rows = await buildRows();
  const heroRow = rows.find(
    (row, index) => PHOTOS[index].file === HERO_PHOTO,
  );
  if (!heroRow) throw new Error(`hero photo not in pool: ${HERO_PHOTO}`);
  const heroRowId = heroRow.id;
  const forensicsById = await forensicsForImages(rows, {
    fetchBuffer: async (row) => fs.promises.readFile(path.join(WORK_DIR, row.path)),
  });

  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const imagesById = Object.fromEntries(rows.map((r) => [r.id, r]));

  fs.mkdirSync(path.join(WORK_DIR, "cards"), { recursive: true });
  const manifest = [];

  for (const edition of SHOW) {
   try {
    const composed = await composeCompCard({
      profile: TALENT,
      images: rows,
      archetype: ARCHETYPE,
      options: {
        seed: `pholio-site-${edition}`,
        aiAdvice: false,
        frontEngine: "program",
        forensicsById,
        unitsPreference: "dual",
        mode: "draft",
        editionsEnabled: true,
        edition,
        locks: { heroId: heroRowId },
      },
    });

    // Fonts follow the plan: the edition chooses its own voices, so the CSS
    // has to be built per card, with the app's absolute font URLs rewritten
    // for standalone file:// rendering.
    const fontsCss = vendorFonts([
      composed.plan.typography.display,
      composed.plan.typography.body,
    ]);

    const html = ejs.render(template, {
      layout: false,
      title: `${TALENT.first_name} ${TALENT.last_name} - Comp Card`,
      profile: TALENT,
      plan: composed.plan,
      statsBlock: composed.statsBlock,
      imagesById,
      watermark: false,
      baseUrl: "..",
      printBleed: false,
      fontsCss,
      frontProgram: composed.plan.frontProgram || null,
    });

    fs.writeFileSync(path.join(WORK_DIR, "cards", `${edition}.html`), html);
    manifest.push({
      edition,
      label: catalog.get(edition),
      resolved: composed.plan.edition || null,
    });
    console.log(`[card] composed ${edition} (${catalog.get(edition)})`);
   } catch (error) {
     console.warn(`[card] SKIP ${edition}: ${error.message}`);
   }
  }

  fs.writeFileSync(
    path.join(WORK_DIR, "manifest.json"),
    JSON.stringify({ engine: ENGINE_VERSION, cards: manifest }, null, 2),
  );

  // ── Rasterise ───────────────────────────────────────────────────────────
  const puppeteer = appRequire("puppeteer");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: PAGE_W, height: PAGE_H * 2, deviceScaleFactor: 2 });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { edition } of manifest) {
    const file = path.join(WORK_DIR, "cards", `${edition}.html`);
    await page.goto(`file://${file}`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(OUT_DIR, `ola-${edition}-front.png`),
      clip: { x: 0, y: 0, width: PAGE_W, height: PAGE_H },
    });
    await page.screenshot({
      path: path.join(OUT_DIR, `ola-${edition}-back.png`),
      clip: { x: 0, y: PAGE_H, width: PAGE_W, height: PAGE_H },
    });
    console.log(`[card] rendered ${edition}`);
  }

  await browser.close();
  console.log(`\nengine ${ENGINE_VERSION}`);
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
