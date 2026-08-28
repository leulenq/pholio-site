#!/usr/bin/env node
/**
 * Render the real Studio+ public portfolio, through pholio-app's actual views.
 *
 *   node scripts/render-portfolio.cjs
 *
 * Same principle as `render-comp-cards.cjs` (`lessons.md` §21.2): the home page
 * shows genuine product output, so the artifact is produced by driving the
 * product rather than rebuilt from divs. This renders
 * `views/portfolio/show.ejs` inside the chrome-less `portfolio-pro` layout with
 * the same talent record the comp cards use, serves pholio-app's own
 * `public/` over http so every stylesheet and script resolves exactly as it
 * does in production, and screenshots the result full-page.
 *
 * Set INSPECT=1 to leave the server running and print the URL instead of
 * screenshotting, which is how you check what the product actually looks like.
 */

"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const APP = path.resolve(__dirname, "..", "..", "pholio-app");
const SITE = path.resolve(__dirname, "..");

const appRequire = (name) => require(path.join(APP, "node_modules", name));
const ejs = appRequire("ejs");

const { TALENT, PHOTOS, HERO_PHOTO } = require("./ola-talent.cjs");

const { buildCanonicalStats } = require(
  path.join(APP, "src", "shared", "lib", "stats-formatter"),
);
const { toFeetInches } = require(
  path.join(APP, "src", "domains", "talent", "services", "stats"),
);

const VIEWS = path.join(APP, "views");
const APP_PUBLIC = path.join(APP, "public");
const SOURCE_DIR = path.join(SITE, "01-ola-szkolda");
const OUT_DIR = path.join(SITE, "public", "generated", "portfolio");

/**
 * The public portfolio's own audience rules, applied here rather than assumed.
 *
 * Measurements default to agency-only and render publicly only on an explicit
 * opt in (`profile_field_visibility`); age is published as a BAND, never the
 * exact number. Both are decided by the product, so this render asks the
 * product's own formatter rather than composing a stats list by hand.
 */
const STATS_ARE_PUBLIC = true;

/** The image set the site renders, in the order the gallery shows them. */
const GALLERY = PHOTOS.map((photo, index) => ({
  id: `ola-img-${index + 1}`,
  profile_id: TALENT.id,
  path: `/talent/${photo.file}`,
  label: photo.label,
  sort: index + 1,
  created_at: new Date(),
}));

const MIME = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

function ageBandFor(age) {
  if (typeof age !== "number") return null;
  if (age < 18) return "Under 18";
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  return "35+";
}

function renderHtml() {
  const profile = {
    ...TALENT,
    hero_image_path: `/talent/${HERO_PHOTO}`,
  };

  const body = ejs.render(
    fs.readFileSync(path.join(VIEWS, "portfolio", "show.ejs"), "utf8"),
    {
      profile,
      images: GALLERY,
      heightFeet: toFeetInches(profile.height_cm),
      stats: STATS_ARE_PUBLIC ? buildCanonicalStats(profile) : null,
      ageBand: ageBandFor(profile.age),
      currentPage: "portfolio",
    },
    { filename: path.join(VIEWS, "portfolio", "show.ejs") },
  );

  const page = ejs.render(
    fs.readFileSync(path.join(VIEWS, "portfolio-pro.ejs"), "utf8"),
    { title: `${profile.first_name} ${profile.last_name}`, body },
    { filename: path.join(VIEWS, "portfolio-pro.ejs") },
  );

  // PATCH=1 renders the page as it WOULD look if pholio-app linked the
  // stylesheet and script that were written for this template. Neither is
  // referenced anywhere in the app, so the shipped Studio+ portfolio is
  // currently unstyled markup on a black background. This flag exists to
  // measure that gap, not to paper over it: the site must not show a product
  // surface the product does not actually serve.
  if (!process.env.PATCH) return page;

  return page
    .replace(
      '<link rel="stylesheet" href="/styles/global.css">',
      '<link rel="stylesheet" href="/styles/global.css">\n    <link rel="stylesheet" href="/styles/portfolio-pro.css">',
    )
    .replace("<body>", '<body class="portfolio-pro-body">')
    .replace(
      '<script src="/scripts/cookie-consent.js" defer></script>',
      '<script src="/scripts/portfolio-pro.js" defer></script>',
    );
}

function serve(html) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);

    if (url === "/" || url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(html);
    }

    // Talent photography, from this repo. Everything else is pholio-app's own
    // public/ tree, so stylesheets and scripts resolve as they do in the app.
    const file = url.startsWith("/talent/")
      ? path.join(SOURCE_DIR, url.slice("/talent/".length))
      : path.join(APP_PUBLIC, url);

    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      console.warn(`[portfolio] 404 ${url}`);
      res.writeHead(404);
      return res.end("not found");
    }

    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

/** Desktop and phone, because the section shows the site at both. */
const SHOTS = [
  { name: "desktop", width: 1440, height: 900, scale: 1 },
  { name: "mobile", width: 390, height: 844, scale: 2 },
];

async function main() {
  const html = renderHtml();
  const { server, port } = await serve(html);
  const url = `http://127.0.0.1:${port}/`;

  if (process.env.INSPECT) {
    console.log(`\n  ${url}\n\n(ctrl-c to stop)`);
    return;
  }

  const puppeteer = appRequire("puppeteer");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport({
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: shot.scale,
    });
    await page.goto(url, { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 600));

    const out = path.join(OUT_DIR, `ola-portfolio-${shot.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    const { height } = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
    }));
    console.log(`[portfolio] ${shot.name} ${shot.width}x${height} -> ${out}`);
    await page.close();
  }

  await browser.close();
  server.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
