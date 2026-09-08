"use client";

import type { MotionValue } from "framer-motion";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import CompCardBack from "./CompCardBack";
import CompCardFront from "./CompCardFront";
import { useDeferredCardAsset } from "./assets";
import {
  CARD_ASPECT,
  CARD_EDGE,
  CARD_PERSPECTIVE,
  CARD_THICKNESS,
  MASTHEAD_BAND,
  SHADOW_MARGIN,
  TURN_SHADE,
} from "./motion";

export const CARD_SHADOW =
  "0 50px 110px -30px rgba(0,0,0,0.82), 0 18px 50px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)";

type CardImageProps = {
  src: string;
  alt?: string;
  className?: string;
  /** Scene images are already deferred by `assets.tsx`; lazy loading on top
      of that lets a card inside the pinned stage pop in late. */
  loading?: "eager" | "lazy";
};

export function CardImage({
  src,
  alt = "",
  className = "",
  loading = "eager",
}: CardImageProps) {
  const deferred = useDeferredCardAsset(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={deferred}
      loading={loading}
      decoding="async"
      alt={alt}
      draggable={false}
      className={`block h-full w-full object-cover ${className}`}
    />
  );
}

const BACKFACE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as const;

type DoubleSidedCardProps = {
  rotateY: MotionValue<number>;
  /** The tip back through the turn. See FLIP_TILT. */
  rotateX?: MotionValue<number> | number;
  /**
   * How much of the front is still hidden behind its own photograph:
   * 1 shows only the photo band, 0 shows the whole card. The clip's edge is
   * the photograph's top edge, so the card stock reads as rising out from
   * behind the print rather than the name being revealed by a mask of its own.
   */
  stockHidden?: MotionValue<number> | number;
  className?: string;
};

/**
 * The two-sided card.
 *
 * Two faces, backs hidden, CARD_THICKNESS apart in z so the far face is also
 * the smaller one under perspective and stays behind the near one in any
 * engine, and a flat edge behind them for the edge-on moment. Nothing in
 * the 3D context is ever seen exactly edge-on: a modelled edge slab put a
 * lit sliver outside the card at rest in Chrome and a hairline above the
 * clipped front in Firefox, both from rasterising a plane with no area.
 */
export function DoubleSidedCard({
  rotateY,
  rotateX = 0,
  stockHidden = 0,
  className = "",
}: DoubleSidedCardProps) {
  // The face catches less light as it turns away: nothing at 0 or 180,
  // TURN_SHADE at edge-on. One value serves both faces; only one shows.
  const shade = useTransform(
    rotateY,
    (deg: number) => TURN_SHADE * (1 - Math.abs(Math.cos((deg * Math.PI) / 180))),
  );
  // The edge is a flat bar at the card's centre line, behind the faces,
  // and it exists only near edge-on. A rotated edge slab inside the 3D
  // context is the correct model, but at exactly ninety degrees Firefox
  // rasterises it through a near-singular matrix as a 1px hairline (and at
  // rest, above the clipped front, as a line nothing covers). A centred
  // bar is exact for a centre pivot: until the faces are too thin to hide
  // it, they cover it, and once they are, it is the edge.
  const edgeOpacity = useTransform(rotateY, (deg: number) =>
    Math.pow(Math.abs(Math.sin((deg * Math.PI) / 180)), 12),
  );
  // The clip box is the card box grown by SHADOW_MARGIN on every side, so
  // the shadow survives the clip. Its top edge travels from the photograph's
  // top (stockHidden 1) to just above the card's top (0), where the 1px ring
  // in CARD_SHADOW still fits; the shadow above that is black on black.
  const clipPath = useMotionTemplate`inset(calc(${SHADOW_MARGIN - 2}px + ((100% - ${
    SHADOW_MARGIN * 2
  }px) * ${MASTHEAD_BAND} + 2px) * ${stockHidden}) 0px 0px 0px round 0.55rem)`;

  return (
    <div
      className={`relative ${className}`}
      style={{
        aspectRatio: CARD_ASPECT,
        perspective: CARD_PERSPECTIVE,
        perspectiveOrigin: "50% 45%",
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-y-[0.55rem] left-1/2"
        style={{
          width: CARD_THICKNESS,
          background: CARD_EDGE,
          x: "-50%",
          rotateX,
          opacity: edgeOpacity,
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          className="absolute"
          style={{
            inset: -SHADOW_MARGIN,
            clipPath,
            transform: `translateZ(${CARD_THICKNESS / 2}px)`,
            ...BACKFACE,
          }}
        >
          <div
            className="absolute overflow-hidden rounded-[0.55rem]"
            style={{ inset: SHADOW_MARGIN, boxShadow: CARD_SHADOW, ...BACKFACE }}
          >
            <CompCardFront />
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-black"
              style={{ opacity: shade }}
            />
          </div>
        </motion.div>
        <div
          className="absolute inset-0 overflow-hidden rounded-[0.55rem]"
          style={{
            ...BACKFACE,
            transform: `rotateY(180deg) translateZ(${CARD_THICKNESS / 2}px)`,
            boxShadow: CARD_SHADOW,
          }}
        >
          <CompCardBack />
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black"
            style={{ opacity: shade }}
          />
        </div>
      </motion.div>
    </div>
  );
}
