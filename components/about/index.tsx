/**
 * /about — the clearest public statement of what Pholio believes, why it
 * exists, who makes it, and why it can be trusted.
 *
 * Four sections, in the order the argument needs them:
 *
 *   Hero        ink    the belief, the figure, the invitation, the thread
 *   Position    cream  why it exists, the commitments, the one sentence
 *   Work        ink    the product's own output, so the claims are checkable
 *   Collective  cream  who makes it, and the two doors out
 *
 * Every section carries an opaque field so the header's polarity sampler
 * can read the paper beneath it; every field change has an element carrying
 * it (the thread across the first, the artifact across the second, the
 * people across the third).
 */

import Collective from "./Collective";
import Hero from "./Hero";
import Position from "./Position";
import Work from "./Work";

export function AboutPage() {
  return (
    <>
      <Hero />
      <Position />
      <Work />
      <Collective />
    </>
  );
}
