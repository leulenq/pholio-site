/**
 * /about — Pholio, the company: why it exists, what it refuses to do, who
 * makes it, and the industry it is working toward.
 *
 * The page is written as plain HTML (about.html) with its own stylesheet
 * (about.css) and a small vanilla motion engine (motion.ts). This component
 * only places it between the site's global header and footer: the HTML is
 * read at build time and rendered as-is.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import AboutMotion from "./AboutMotion";
import "./about.css";

export function AboutPage() {
  // Read per render, not at module load: the page is static in production
  // either way, and in development an edit to the HTML shows on reload.
  const html = readFileSync(
    path.join(process.cwd(), "components/about/about.html"),
    "utf8",
  );
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <AboutMotion />
    </>
  );
}
