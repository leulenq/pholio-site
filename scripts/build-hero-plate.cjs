/**
 * Builds the narrow hero plate from the extracted sequence.
 *
 * `public/hero/seq` is the footage as extracted, 970x1640, and it is what a
 * landscape stage paints. `public/hero/seq-sm` is the same frames at the size
 * a phone actually paints them, which is the only thing that makes this scrub
 * affordable there: decode is paid per source pixel, and the measurements are
 * in `components/hero/useFrameSequence.ts`.
 *
 * The width is not a device-pixel-ratio calculation. It was chosen by scaling
 * candidates up to 1707px — what a DPR 3 phone asks for at the widest this
 * stage ever paints her — and comparing them with the original at 1:1. See
 * `components/hero/motion.ts`, FRAME_PLATE.
 *
 *   node scripts/build-hero-plate.cjs
 */
const sharp = require("sharp");
const fs = require("node:fs/promises");
const path = require("node:path");

const SRC = path.join(__dirname, "..", "public", "hero", "seq");
const OUT = path.join(__dirname, "..", "public", "hero", "seq-sm");
const WIDTH = 728;
const QUALITY = 82;

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const files = (await fs.readdir(SRC)).filter((f) => f.endsWith(".webp")).sort();
  let total = 0;
  for (const file of files) {
    const buffer = await sharp(path.join(SRC, file))
      .resize({ width: WIDTH, kernel: "lanczos3", fit: "inside" })
      .webp({ quality: QUALITY, alphaQuality: 90, effort: 6 })
      .toBuffer();
    await fs.writeFile(path.join(OUT, file), buffer);
    total += buffer.length;
  }
  const meta = await sharp(path.join(OUT, files[0])).metadata();
  console.log(
    `${files.length} frames at ${meta.width}x${meta.height} -> ${(total / 1e6).toFixed(2)}MB`,
  );
}

main();
