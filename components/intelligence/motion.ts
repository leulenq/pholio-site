/**
 * The intelligence sequence.
 *
 * One message, composed against the camera push in that
 * `components/hero/motion.ts` drives, and one motion for all of it: **a line
 * travels into the frame from outside it, comes to rest, holds, and travels
 * out.** Nothing is revealed, nothing fades, nothing splits, and no line is
 * uncovered by an edge belonging to it (`lessons.md` §17, §18).
 *
 * The message is the talent line from `pholio-strategic-analysis-2026-08.md`
 * §9.1, split across the three beats: "sees the frame" (the camera bridge) /
 * "Every agency, right." (spec conformance — the digitals are correct for
 * wherever they're going) / "The truth, where you stand." (the tracker —
 * silence made legible instead of a void). Revised 2026-08-15 from an earlier
 * "sees you / Understood before you send" version that was atmospheric but
 * didn't say what was understood; see `lessons.md` for the reasoning if that
 * line ever looks worth reviving.
 *
 * Beats differ in where they rest, how big they are, how far they come from
 * and how long they hold. They do not differ in mechanism.
 *
 * The first line begins in the hero. It is not hidden there: it sits below the
 * frame, and as the mark leaves at the top the phrase comes up into the space
 * it vacated. That crossing is the entire transition between the two scenes.
 *
 * Authored in frame numbers against the extracted footage, because her
 * movement is the timeline.
 */

import { progressAtFrame } from "@/components/hero/motion";

export type Word = {
  t: string;
  /** The beat's one gold verdict. Italic, gold, never two in a beat. */
  verdict?: boolean;
};

export type Piece = {
  words: Word[];
  /** Type scale: [narrow stage, wide stage]. */
  type: [string, string];
  /** The quiet half of the lockup. Only the still composition reads this. */
  small?: boolean;
};

export type Lockup = {
  id: string;
  /** Resting placement: [narrow stage, wide stage]. */
  pos: [string, string];
  /**
   * How far below its rest the line starts, in vh: [narrow stage, wide stage].
   * Large enough to be off the stage entirely, so it is out of shot rather
   * than hidden behind anything. Per viewport because the resting positions
   * differ: a line resting at 6% needs a longer run than one resting at 46%.
   */
  enter: [number, number];
  /** How far above its rest it travels away, in vh. Null on the last beat. */
  exit: [number, number] | null;
  pieces: Piece[];
  /** Entrance delay for this lockup, as a fraction of the beat's entry span. */
  delay: number;
};

export type Beat = {
  key: string;
  /** in, settle, hold, out. `null` on the last beat: it does not leave. */
  frames: [number, number, number, number | null];
  lockups: Lockup[];
};

/**
 * I.   The bridge out of the hero. A long, slow arrival from below the frame,
 *      timed so the mark has cleared before it comes up.
 * II.  The sentence brackets her: the small half left, the verdict right, the
 *      camera centred on her in between.
 * III. A hanging indent, with the verdict carried by the small line so the
 *      beat is not one colour at one size.
 *
 * ── The narrow stage ──────────────────────────────────────────────────────
 *
 * Every position below is authored twice, and the pair is not one composition
 * at two sizes. A wide stage is a landscape frame with a gutter either side of
 * her: the copy can stand beside her and the beat's drama comes from the
 * horizontal distance between two fragments. A phone is a portrait frame
 * roughly 2.2 : 1 with her filling most of it, and the type layer sits behind
 * her, so the only place a line is reliably readable is the band above her
 * head. Scattering the wide placements into a narrow frame put fragments where
 * she is: at 390 the closing verdict `stand.` was rendering behind her hair for
 * most of its hold, which is the one thing §13.3 rules out.
 *
 * So the narrow stage keeps the band and varies the *lockup inside it*, which
 * is where §13.2's three compositions come from here:
 *
 *   I    one line set to the full measure, left, one weight
 *   II   split across the measure on one optical line, the small half left and
 *        the verdict right, four times its size
 *   III  a hanging indent, the small half tucked under the large one
 *
 * The band starts below the sitewide index marks, which return at the top of
 * the frame once the hero's opening has left: a line resting at 6% of a phone
 * viewport sat directly under the corner wordmark.
 */
export const BEATS: Beat[] = [
  {
    key: "frame",
    frames: [30, 90, 102, 122],
    lockups: [
      {
        id: "frame-line",
        delay: 0,
        pos: ["left-6 top-[16%]", "left-6 top-[27%] md:left-12"],
        enter: [100, 94],
        exit: [42, 46],
        pieces: [
          {
            // Narrow: set to the measure. At the old size the phrase was a
            // 275px line adrift in a 390 frame with her a third of a viewport
            // below it, which is the shrunken-desktop reading rather than a
            // composition.
            words: [{ t: "sees the frame" }],
            type: [
              "text-[clamp(2.3rem,11.6vw,3.9rem)]",
              "text-[clamp(3rem,6.8vw,8.2rem)]",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "you",
    frames: [114, 136, 152, 168],
    lockups: [
      {
        id: "you-small",
        delay: 0,
        // Narrow: the quiet half sits low and left on the band's own baseline,
        // so the two halves read as one line with a size jump rather than as
        // two fragments at opposite corners of an empty frame (§14.2).
        pos: ["left-6 top-[20.5%]", "left-6 top-[38%] md:left-12"],
        enter: [104, 76],
        exit: [34, 48],
        pieces: [
          {
            words: [{ t: "Every agency," }],
            small: true,
            type: [
              "text-[clamp(1.05rem,4.6vw,1.6rem)] tracking-[-0.015em]",
              "text-[clamp(1.6rem,3vw,3.4rem)] tracking-[-0.015em]",
            ],
          },
        ],
      },
      {
        id: "you-verdict",
        delay: 0.26,
        pos: [
          "right-6 top-[14%] text-right",
          "right-6 top-[47%] text-right md:right-12",
        ],
        enter: [100, 64],
        exit: [40, 72],
        pieces: [
          {
            words: [{ t: "right.", verdict: true }],
            type: [
              "text-[clamp(3rem,20vw,5rem)]",
              "text-[clamp(3.6rem,9vw,10.8rem)]",
            ],
          },
        ],
      },
    ],
  },
  {
    key: "understood",
    frames: [160, 184, 193, null],
    lockups: [
      {
        id: "understood-large",
        delay: 0,
        pos: ["left-6 top-[15%]", "left-6 top-[46%] md:left-12"],
        enter: [104, 64],
        exit: null,
        pieces: [
          {
            words: [{ t: "The truth," }],
            type: [
              "text-[clamp(2.2rem,13.5vw,3.6rem)] tracking-[-0.045em]",
              "text-[clamp(3rem,6.8vw,8rem)] tracking-[-0.045em]",
            ],
          },
        ],
      },
      {
        id: "understood-small",
        delay: 0.3,
        // Narrow: hangs directly off the large line's baseline, indented. At
        // 17% it was a third of a viewport lower, which on a phone is her hair
        // and shoulder: the closing verdict was rendering behind her.
        pos: ["left-[24%] top-[24.5%]", "left-[21%] top-[62%]"],
        enter: [96, 46],
        exit: null,
        pieces: [
          {
            words: [{ t: "where you " }, { t: "stand.", verdict: true }],
            small: true,
            type: [
              "text-[clamp(1.05rem,4.4vw,1.5rem)] tracking-[-0.015em]",
              "text-[clamp(1.2rem,2.1vw,2.4rem)] tracking-[-0.015em]",
            ],
          },
        ],
      },
    ],
  },
];

/**
 * The background ribbon: the four categories a book is read in, the same
 * register the industry itself sorts work into. Depth, not a headline, and
 * not a scored "type" — Pholio classifies the photograph (shot, exposure,
 * background), never the person. See `pholio-strategic-analysis-2026-08.md`
 * §8.2 and §9.2 on why a personality/vibe scorer of the talent is out.
 */
export const RIBBON = {
  words: ["EDITORIAL", "RUNWAY", "COMMERCIAL", "LIFESTYLE"],
  // Narrow was 15vw, which put a single word at 580px across a 390 frame: only
  // two or three letterforms were ever on the stage at once, and a fragment of
  // a word at low opacity reads as a rendering artifact rather than as depth.
  // 9vw carries a whole word across, which is what makes it a category.
  size: [9, 7.5] as [number, number],
  top: [40, 70] as [number, number],
  blur: [1.8, 4] as [number, number],
  drift: {
    at: [0, 0.28, 0.62, 1],
    x: ["22vw", "3vw", "-11vw", "-19vw"],
  },
  peak: 0.028,
  fade: {
    in: progressAtFrame(66),
    settled: progressAtFrame(92),
    start: progressAtFrame(178),
    out: progressAtFrame(193),
  },
  travel: [progressAtFrame(64), progressAtFrame(193)] as [number, number],
};

/**
 * Two curves, and they are the only reason GSAP is in the build.
 *
 * `settle` covers most of its distance early and then takes a long time to
 * finish, which is what makes an arrival read as coming to rest rather than
 * sliding in. `leave` is its opposite and shorter: things should go quietly,
 * not linger. Neither is expressible as a single `cubic-bezier()`.
 */
export const EASES = {
  settle: "M0,0 C0.05,0.35 0.15,0.75 0.35,0.9 0.55,1 0.8,1 1,1",
  leave: "M0,0 C0.25,0 0.55,0.08 0.75,0.35 0.88,0.55 0.96,0.85 1,1",
} as const;

/** When a lockup travels in, and when it travels out. */
export function lockupTiming(frames: Beat["frames"], delay: number) {
  const [inF, settleF, holdF, outF] = frames;
  const start = progressAtFrame(inF);
  const settle = progressAtFrame(settleF);
  const shift = (settle - start) * delay;
  return {
    enter: [start + shift, settle + shift] as [number, number],
    exit:
      outF === null
        ? null
        : ([progressAtFrame(holdF), progressAtFrame(outF)] as [number, number]),
  };
}
