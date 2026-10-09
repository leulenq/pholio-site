import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const fontfile = `${root}scripts/social-assets/Inter-Regular.ttf`;
const wordmark = await readFile(`${root}public/press/kit/wordmark/pholio-wordmark-gold.svg`);
const cards = {
  home: ["A better introduction.", "Model portfolios, comp cards and agency applications."],
  talent: ["Your book. Your applications.", "For models. Free to apply."],
  "studio-plus": ["Studio+", "Comp-card themes. Your own site. Your own record."],
  agencies: ["What agencies actually ask for.", "Published requirements, with sources and review dates."],
  about: ["The people behind Pholio.", "A platform for models and the agencies they apply to."],
  careers: ["Build Pholio with us.", "Open roles on a small, remote team."],
  contact: ["Talk to Pholio.", "Support, agencies, guardians and press."],
  press: ["The Pholio press kit.", "Company facts, founder portraits and the wordmark."],
};
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
await mkdir(`${root}public/social`, { recursive: true });
for (const [name, [heading, description]] of Object.entries(cards)) {
  const mark = await sharp(wordmark).resize({ width: 920 }).png().toBuffer();
  const markInfo = await sharp(mark).metadata();
  const layers = [{ input: mark, left: 140, top: 165 }];
  for (const [text, size, color, top] of [[heading, 40, "#FAF7F2", 365], [description, 24, "#FAF7F2", 433], ["www.pholio.studio", 19, "#C9A55A", 543]]) {
    const input = await sharp({ text: { text: `<span foreground="${color}">${escape(text)}</span>`, font: `Inter ${size}`, fontfile, rgba: true, width: 1000, align: "centre", dpi: 72 } }).png().toBuffer();
    const info = await sharp(input).metadata();
    if (info.height > size * 1.6) throw new Error(`Share text wraps unexpectedly: ${name}`);
    layers.push({ input, left: Math.round((1200 - info.width) / 2), top });
  }
  if (markInfo.width !== 920) throw new Error("Wordmark scaling failed");
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#050505" } }).composite(layers).png({ compressionLevel: 9 }).toFile(`${root}public/social/${name}.png`);
  console.log(`Generated public/social/${name}.png (1200 × 630)`);
}
