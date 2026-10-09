/**
 * /opening — talent can join from October 31; leave an email for one message
 * that day. Every pre-launch talent CTA on this site and every talent the app
 * turns away lands here (lib/talent-launch.ts). Velvet, one field, no image:
 * a request being drawn up takes no photograph (lessons.md §37.6).
 */

import OpeningForm from "./OpeningForm";
import "./opening.css";

export function OpeningPage() {
  return (
    <section className="op" aria-labelledby="op-h">
      <h1 id="op-h" className="op-title">
        <span>Pholio opens to talent on</span> <em>October 31.</em>
      </h1>
      <p className="op-lede">Leave your email and we write once, that day. Then the address is deleted.</p>
      <OpeningForm />
      <p className="op-fine">
        Pholio opens to adults aged 18 and over. Agencies can already{" "}
        <a href="/agency/request-access">request access</a>.
      </p>
    </section>
  );
}
