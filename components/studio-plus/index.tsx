/**
 * /studio-plus — Studio+, told as a film in four acts: the card, the site,
 * the record, and the rule that nothing an agency sees changes.
 *
 * Like /about, the page is plain HTML (studio-plus.html) with its own
 * stylesheet (studio-plus.css) and a vanilla motion engine (motion.ts). This
 * component only places it between the site's global header and footer.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import StudioPlusMotion from "./StudioPlusMotion";
import "./studio-plus.css";

export function StudioPlusPage() {
  // Read per render: static in production, and live-editable in development.
  const html = readFileSync(
    path.join(process.cwd(), "components/studio-plus/studio-plus.html"),
    "utf8",
  );
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <StudioPlusMotion />
    </>
  );
}
