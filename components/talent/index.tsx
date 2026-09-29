/**
 * /talent — one talent's set followed through the whole loop: the digitals,
 * guided capture, stats, the comp card, the Pholio ID, the market's shot
 * lists, the submission, the review window, the ledger, Intel, likeness and
 * the price.
 *
 * Like /about and /studio-plus, the page is plain HTML (talent.html) with its
 * own stylesheet (talent.css) and motion engine (motion.js). This component
 * only places it between the site's global header and footer.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { PHOLIO_APP_ORIGIN } from "@/lib/pholio-app-origin";

import TalentMotion from "./TalentMotion";
import "./talent.css";

const SIGNUP_HREF = `${PHOLIO_APP_ORIGIN}/onboarding`;

export function TalentPage() {
  // Read per render: static in production, and live-editable in development.
  const html = readFileSync(
    path.join(process.cwd(), "components/talent/talent.html"),
    "utf8",
  ).replaceAll("{{SIGNUP_HREF}}", SIGNUP_HREF);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <TalentMotion />
    </>
  );
}
