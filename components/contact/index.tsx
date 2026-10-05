/**
 * /contact — how to reach Pholio.
 *
 * Written as plain HTML (contact.html) with its own stylesheet (contact.css)
 * and a small vanilla script (motion.ts). This component only places it
 * between the site's global header and footer: the HTML is read at build
 * time and rendered as-is.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import ContactMotion from "./ContactMotion";
import "./contact.css";

export function ContactPage() {
  const html = readFileSync(
    path.join(process.cwd(), "components/contact/contact.html"),
    "utf8",
  );
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <ContactMotion />
    </>
  );
}
