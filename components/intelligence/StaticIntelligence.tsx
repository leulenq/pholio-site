import { BEATS, RIBBON } from "./motion";

/**
 * The reduced-motion composition.
 *
 * Not a shortened scrub. The moving version composes each beat as a large
 * fragment against a small one with one gold verdict, so the still version
 * keeps those relationships rather than flattening everything to one size and
 * one colour. The category ribbon is set once beneath them, as the quiet fact
 * it is on the stage.
 */

const LARGE = "text-[clamp(2.6rem,6vw,6rem)] leading-[0.94] tracking-[-0.04em]";

export default function StaticIntelligence() {
  return (
    <div className="w-full px-6 py-[16vh] md:px-12">
      <div className="space-y-[12vh]">
        {BEATS.map((beat) => (
          <p key={beat.key}>
            {beat.lockups.flatMap((lockup) =>
              lockup.pieces.map((piece, index) => {
                return (
                  <span
                    key={`${lockup.id}-${index}`}
                    className={`block ${
                      piece.small
                        ? "max-w-[30ch] font-editorial text-[clamp(1.2rem,2.4vw,1.8rem)] tracking-[-0.015em] text-[#FAF7F2]"
                        : `mt-3 max-w-[14ch] ${LARGE} font-editorial text-[#FAF7F2]`
                    }`}
                  >
                    {piece.words.map((word, i) => (
                      <span
                        key={i}
                        className={
                          word.verdict
                            ? "font-editorial-italic text-[#C9A55A]"
                            : undefined
                        }
                      >
                        {word.t}
                        {i < piece.words.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </span>
                );
              }),
            )}
          </p>
        ))}

        <p className="flex flex-wrap gap-x-8 gap-y-1 font-editorial text-[clamp(1.4rem,3vw,2.4rem)] tracking-[-0.03em] text-[#FAF7F2]/45">
          {RIBBON.words.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
