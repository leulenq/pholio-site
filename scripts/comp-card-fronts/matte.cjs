#!/usr/bin/env node
/**
 * Produce a subject matte for a source photograph, for the fronts that set
 * type behind the figure (The Cover Story).
 *
 *   node scripts/comp-card-fronts/matte.cjs 01-walking-columns.jpg --module /path/to/node_modules/@imgly/background-removal-node
 *
 * Writes scripts/comp-card-fronts/assets/<name>.matte.png: an 8-bit
 * grayscale alpha at the source's full size (white = subject). render.cjs
 * joins it back onto the photograph at build time; the matte is what is
 * checked in, because it is small and the cutout can always be rebuilt.
 *
 * The matting model (@imgly/background-removal-node, ISNet on ONNX) is not
 * a dependency of this site or of pholio-app; install it anywhere ad hoc
 * and point --module at it. It downloads its weights on first use.
 *
 * Check the result on a flat colour before trusting it. On the walking
 * frame the model dropped most of the handbag; type must not pass behind
 * that region, and the layout keeps the surname below it.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const SITE = path.resolve(__dirname, "..", "..");
const APP = path.resolve(SITE, "..", "pholio-app");
const sharp = require(path.join(APP, "node_modules", "sharp"));

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const moduleIndex = args.indexOf("--module");
const modulePath = moduleIndex >= 0 ? args[moduleIndex + 1] : null;
if (!file || !modulePath) {
  console.error("usage: matte.cjs <source.jpg> --module <path to @imgly/background-removal-node>");
  process.exit(2);
}

const { removeBackground } = require(path.resolve(modulePath));
const src = path.join(SITE, "01-ola-szkolda", file);
const out = path.join(__dirname, "assets", `${path.parse(file).name}.matte.png`);

(async () => {
  const blob = await removeBackground(src, { output: { format: "image/png" } });
  const cutout = Buffer.from(await blob.arrayBuffer());
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(cutout).extractChannel(3).toColourspace("b-w").png({ compressionLevel: 9 }).toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`${path.relative(SITE, out)}  ${meta.width}x${meta.height}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
