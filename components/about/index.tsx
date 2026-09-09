/**
 * /about — what Pholio believes, why it exists, who makes it, and why it can
 * be trusted, built as a sequence of scenes rather than a stack of sections.
 *
 *   Hero        ink    the statement, the photograph as a camera, the invitation
 *   Origin      ink    why it exists, three beats travelling past a plate
 *   The Line    cream  the defining scene: three statements at viewport scale
 *   The Record  ink    the proof, deliberately quiet, in document register
 *   Collective  cream  the recovered triptych: centered header, 4:5 plates
 *   Close       ink    the one sentence, and the two doors
 *
 * The pacing is the design: loud, moving, loud, quiet, loud, still. Every
 * section carries an opaque field so the header's polarity sampler can read
 * the paper beneath it.
 */

import Close from "./Close";
import Collective from "./Collective";
import Hero from "./Hero";
import Origin from "./Origin";
import Record from "./Record";
import TheLine from "./TheLine";

export function AboutPage() {
  return (
    <>
      <Hero />
      <Origin />
      <TheLine />
      <Record />
      <Collective />
      <Close />
    </>
  );
}
