#!/usr/bin/env node
/**
 * Render a library of real comp cards through pholio-app's composed engine.
 *
 *   node scripts/render-comp-cards.cjs
 *
 * Drives composeCompCard — the same function the product's PDF route calls —
 * over 01-ola-szkolda/, with the leaning three-quarter locked as the hero.
 * Editions that require an alpha matte are skipped (JPEG sources have none).
 *
 * Writes PNG fronts/backs into this site and copies them to pholio-landing
 * for the marketing surface.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const APP = path.resolve(__dirname, "..", "..", "pholio-app");
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
  APP,
  "src",
  "domains",
  "pdf",
  "templates",
  "compcard-composed.ejs",
);

/** 5.5in × 8.5in at CSS 96dpi. */
const PAGE_W = 528;
const PAGE_H = 816;

const SOURCE_DIR = path.join(SITE, "01-ola-szkolda");
const WORK_DIR = path.join(SITE, ".comp-card-build");
const OUT_DIR = path.join(SITE, "public", "generated", "comp-card");
const LANDING_OUT = path.resolve(
  SITE,
  "..",
  "pholio-landing",
  "public",
  "generated",
  "comp-card",
);

const { TALENT, ARCHETYPE, PHOTOS, HERO_PHOTO } = require("./ola-talent.cjs");

const SKIP_EDITIONS = new Set(["cover-story", "studio-cutout"]);
const SHOW = process.env.EDITIONS
  ? process.env.EDITIONS.split(",")
  : listEditions()
      .map((edition) => edition.id)
      .filter((id) => !SKIP_EDITIONS.has(id));

// Match the Elara/Mara landing artifact: full-bleed photo, name set on the
// photograph (house-classic + photo-dominant + over).
const FORCE_STRUCTURE = process.env.FORCE_STRUCTURE || null;
const FORCE_TREATMENT = process.env.FORCE_TREATMENT || null;
const OUTPUT_STEM = process.env.OUTPUT_STEM || null;
const EDITIONS_ON = process.env.EDITIONS_ENABLED !== "0";

const PROFILE = {
  ...TALENT,
  first_name: TALENT.first_name,
  last_name: TALENT.last_name,
  hair_color: TALENT.hair_color,
  eye_color: TALENT.eye_color,
};

async function buildRows() {
  const sharp = appRequire("sharp");
  fs.mkdirSync(path.join(WORK_DIR, "source"), { recursive: true });

  const rows = [];
  for (const [index, photo] of PHOTOS.entries()) {
    const from = path.join(SOURCE_DIR, photo.file);
    if (!fs.existsSync(from)) throw new Error(`missing source photo: ${from}`);
    const id = `ola-${String(index + 1).padStart(2, "0")}`;
    const to = path.join(WORK_DIR, "source", `${id}.jpg`);
    await sharp(from)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 92 })
      .toFile(to);
    const meta = await sharp(to).metadata();
    rows.push({
      id,
      profile_id: PROFILE.id,
      path: `source/${id}.jpg`,
      label: photo.label,
      sort: index + 1,
      shot_type: photo.shot_type,
      shot_type: photo.shot_type,
      style_type: null,
      width: meta.width,
      height: meta.height,
      is_primary: Boolean(photo.is_primary),
      is_primary: Boolean(photo.is_primary),
      usage_rights: "granted",
      created_at: new Date().toISOString(),
    });
  }
  return rows;
}

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

function polishCanonicalFront(htmlPath) {
  let html = fs.readFileSync(htmlPath, "utf8");
  if (!html.includes("#front .hero img")) {
    html = html.replace(
      `.cell img, .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }`,
      `.cell img, .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    #front .hero img {
      filter: contrast(1.18) saturate(0.92) brightness(0.97);
    }`,
    );
  }
  if (!html.includes('data-scrim')) {
    html = html.replace(
      `</div>
        
      
    
      
        
        <div class="abs name-block"`,
      `</div>
        <div class="abs" data-scrim style="left:0;right:0;bottom:0;height:2.55in;pointer-events:none;z-index:12;background:linear-gradient(to top, rgba(10,9,8,0.62) 0%, rgba(10,9,8,0.34) 38%, rgba(10,9,8,0) 100%);"></div>
        
      
    
      
        
        <div class="abs name-block"`,
    );
  }
  html = html.replace(
    /white-space: nowrap;">Ola<\/span>/,
    `white-space: nowrap; text-shadow: 0 1px 12px rgba(10,9,8,0.35);">Ola</span>`,
  );
  html = html.replace(
    /white-space: nowrap;">Szkolda<\/span>/,
    `white-space: nowrap; text-shadow: 0 1px 10px rgba(10,9,8,0.4);">Szkolda</span>`,
  );
  fs.writeFileSync(htmlPath, html);
}

function copyLibrary(dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(OUT_DIR)) {
    if (!name.startsWith("ola-") && name !== "manifest.json") continue;
    fs.copyFileSync(path.join(OUT_DIR, name), path.join(dest, name));
  }
}

async function main() {
  const catalog = new Map(listEditions().map((e) => [e.id, e.label]));
  for (const id of SHOW) {
    if (!catalog.has(id)) throw new Error(`edition not in shipped catalog: ${id}`);
  }

  const rows = await buildRows();
  const heroRow = rows.find((row, index) => PHOTOS[index].file === HERO_PHOTO);
  if (!heroRow) throw new Error(`hero photo not in pool: ${HERO_PHOTO}`);

  const forensicsById = await forensicsForImages(rows, {
    fetchBuffer: async (row) =>
      fs.promises.readFile(path.join(WORK_DIR, row.path)),
  });

  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const imagesById = Object.fromEntries(rows.map((r) => [r.id, r]));

  fs.mkdirSync(path.join(WORK_DIR, "cards"), { recursive: true });
  const manifest = [];

  for (const edition of SHOW) {
    try {
      const composed = await composeCompCard({
        profile: PROFILE,
        images: rows,
        archetype: ARCHETYPE,
        options: {
          seed: `pholio-landing-ola-${edition}`,
          aiAdvice: false,
          frontEngine: "program",
          forensicsById,
          unitsPreference: "dual",
          mode: "draft",
          editionsEnabled: EDITIONS_ON,
          edition,
          locks: { heroId: heroRow.id },
          forceStructure: FORCE_STRUCTURE,
          forceTreatment: FORCE_TREATMENT,
        },
      });

      const fontsCss = vendorFonts([
        composed.plan.typography.display,
        composed.plan.typography.body,
      ]);

      const html = ejs.render(template, {
        layout: false,
        title: `${PROFILE.first_name} ${PROFILE.last_name} - Comp Card`,
        profile: PROFILE,
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
        heroId: composed.plan.front && composed.plan.front.imageId,
      });
      console.log(`[card] composed ${edition} (${catalog.get(edition)})`);
    } catch (error) {
      console.warn(`[card] SKIP ${edition}: ${error.stack || error.message}`);
    }
  }

  const puppeteer = appRequire("puppeteer");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: PAGE_W,
    height: PAGE_H * 2,
    deviceScaleFactor: 2,
  });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { edition } of manifest) {
    const file = path.join(WORK_DIR, "cards", `${edition}.html`);
    const stem = OUTPUT_STEM || `ola-${edition}`;
    if (stem === "ola-szkolda") polishCanonicalFront(file);
    await page.goto(`file://${file}`, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(OUT_DIR, `${stem}-front.png`),
      clip: { x: 0, y: 0, width: PAGE_W, height: PAGE_H },
    });
    await page.screenshot({
      path: path.join(OUT_DIR, `${stem}-back.png`),
      clip: { x: 0, y: PAGE_H, width: PAGE_W, height: PAGE_H },
    });
    console.log(`[card] rendered ${stem}`);
  }

  await browser.close();

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ engine: ENGINE_VERSION, hero: HERO_PHOTO, cards: manifest }, null, 2),
  );
  copyLibrary(LANDING_OUT);

  console.log(`\nengine ${ENGINE_VERSION}`);
  console.log(`wrote ${manifest.length} cards to ${OUT_DIR}`);
  console.log(`copied library to ${LANDING_OUT}`);
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
