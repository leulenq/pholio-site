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
 */
export const BEATS: Beat[] = [
  {
    key: "frame",
    frames: [30, 90, 102, 122],
    lockups: [
      {
        id: "frame-line",
        delay: 0,
        pos: ["left-6 top-[15%]", "left-6 top-[27%] md:left-12"],
        enter: [100, 94],
        exit: [30, 46],
        pieces: [
          {
            words: [{ t: "sees the frame" }],
            type: [
              "text-[clamp(2.3rem,8.4vw,3.9rem)]",
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
        pos: ["left-6 top-[6%]", "left-6 top-[38%] md:left-12"],
        enter: [104, 76],
        exit: [20, 48],
        pieces: [
          {
            words: [{ t: "Every agency," }],
            small: true,
            type: [
              "text-[clamp(1.2rem,3.6vw,1.7rem)] tracking-[-0.015em]",
              "text-[clamp(1.6rem,3vw,3.4rem)] tracking-[-0.015em]",
            ],
          },
        ],
      },
      {
        id: "you-verdict",
        delay: 0.26,
        pos: [
          "right-6 top-[12%] text-right",
          "right-6 top-[47%] text-right md:right-12",
        ],
        enter: [100, 64],
        exit: [30, 72],
        pieces: [
          {
            words: [{ t: "right.", verdict: true }],
            type: [
              "text-[clamp(3rem,11vw,5rem)]",
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
        pos: ["left-6 top-[6%]", "left-6 top-[46%] md:left-12"],
        enter: [104, 64],
        exit: null,
        pieces: [
          {
            words: [{ t: "The truth," }],
            type: [
              "text-[clamp(2.2rem,8vw,3.6rem)] tracking-[-0.045em]",
              "text-[clamp(3rem,6.8vw,8rem)] tracking-[-0.045em]",
            ],
          },
        ],
      },
      {
        id: "understood-small",
        delay: 0.3,
        pos: ["left-[16%] top-[17%]", "left-[21%] top-[62%]"],
        enter: [96, 46],
        exit: null,
        pieces: [
          {
            words: [{ t: "where you " }, { t: "stand.", verdict: true }],
            small: true,
            type: [
              "text-[clamp(1.05rem,3.2vw,1.5rem)] tracking-[-0.015em]",
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
  size: [15, 7.5] as [number, number],
  top: [36, 70] as [number, number],
  blur: [2.4, 4] as [number, number],
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
