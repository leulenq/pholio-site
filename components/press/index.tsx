/**
 * /press — Pholio's press kit.
 *
 * Written as plain HTML (press.html) with its own stylesheet (press.css) and
 * a small vanilla engine (motion.ts). This component only places it between
 * the site's global header and footer: the HTML is read at build time and
 * rendered as-is. The kit's downloadable files live in public/press/.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import PressMotion from "./PressMotion";
import "./press.css";

export function PressPage() {
  const html = readFileSync(
    path.join(process.cwd(), "components/press/press.html"),
    "utf8",
  );
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <PressMotion />
    </>
  );
}
