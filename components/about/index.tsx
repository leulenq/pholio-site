/**
 * /about — why Pholio exists, what it refuses to do, and who makes it.
 *
 * Eight chapters, each given the composition and the motion its own idea
 * needs, inside one continuous narrative:
 *
 *   I    The numbers     ink     photography. A crop of one woman and her
 *                                casting tag pulls back into a queue of four.
 *   II   The sitting     ink     motion. Her own set, framed, until paper
 *                                closes around it and it is an object.
 *   III  The bill        ink     typography. No photograph but that one
 *                                print, holding the corner of an empty half.
 *   IV   The corridor    ink     absence. Everyone has gone; the longest
 *                                hold on the page, with the queue still in it.
 *   V    The turn        →cream  the field change, once, as a seam crossing
 *                                the frame. The statement inverts as it passes.
 *   VI   The colophon    cream   long form, as a spread: the reading on the
 *                                left page, one plate bleeding off the right.
 *   VII  The Collective  cream   recovered, not reinterpreted.
 *   VIII The coda        cream   one line, two doors, a lot of air.
 *
 * I to V share one pinned frame and one set of objects, so each chapter
 * inherits what the last one left on the stage rather than starting beside
 * it. The field changes exactly once.
 *
 * This is a company page. Features belong to `/talent` and `/agencies`
 * (`lessons.md` §31.8).
 */

import Coda from "./Coda";
import Collective from "./Collective";
import Colophon from "./Colophon";
import Stage from "./Stage";

export function AboutPage() {
  return (
    <>
      <Stage />
      <Colophon />
      <Collective />
      <Coda />
    </>
  );
}
