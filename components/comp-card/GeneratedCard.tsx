"use client";

import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import CompCardBack from "./CompCardBack";
import CompCardFront from "./CompCardFront";

export const CARD_SHADOW =
  "0 50px 110px -30px rgba(0,0,0,0.82), 0 18px 50px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)";

type CardImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function CardImage({ src, alt = "", className = "" }: CardImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`block h-full w-full object-cover ${className}`}
    />
  );
}

type DoubleSidedCardProps = {
  rotateY: MotionValue<number> | number;
  scale?: MotionValue<number> | number;
  x?: MotionValue<string> | MotionValue<number> | string | number;
  y?: MotionValue<string> | MotionValue<number> | string | number;
  opacity?: MotionValue<number> | number;
  className?: string;
};

export function DoubleSidedCard({
  rotateY,
  scale = 1,
  x = 0,
  y = 0,
  opacity = 1,
  className = "",
}: DoubleSidedCardProps) {
  return (
    <div
      className={`relative w-[15.5rem] sm:w-[17rem] md:w-[19.5rem] lg:w-[21.5rem] ${className}`}
      style={{ aspectRatio: "5.5 / 8.5", perspective: 1600, perspectiveOrigin: "50% 45%" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          rotateY,
          scale,
          x,
          y,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-y-1 left-0 w-[8px] rounded-l-[0.45rem]"
          style={{
            background:
              "linear-gradient(90deg, rgba(180,170,150,0.65), rgba(250,247,242,0.92))",
            transform: "rotateY(90deg) translateX(-4px)",
            transformOrigin: "left center",
          }}
        />
        <div
          className="absolute inset-0 overflow-hidden rounded-[0.55rem]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: CARD_SHADOW,
            transform: "translateZ(1px)",
          }}
        >
          <CompCardFront />
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-[0.55rem]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
            boxShadow: CARD_SHADOW,
          }}
        >
          <CompCardBack />
        </div>
      </motion.div>
    </div>
  );
}
