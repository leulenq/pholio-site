"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 7 — Pholio ID (the white sweep).

   This is the page's one product shot, so it is lit like one. The
   device render was always good; what surrounded it was a black void
   with a blurred gold orb in it, which is what made a considered
   render read as a mockup dropped onto a background. The scene now
   builds the SET instead of the object — a white cyclorama, the way
   /for-talent's wallet section already treats this beat, but as a
   full lit room rather than a flat white panel:

     1. a cyclorama — white under the key light, warming back toward
        the page's cream at the edges, so the backdrop is a swept
        surface and not a fill,
     2. a plane the device stands over: a gold-sweep horizon, a shaded
        floor below it, a contact shadow, and a real mirrored
        reflection dying into it,
     3. the pass's own warm spill on that floor — the only place gold
        is a surface here, because it is light coming off the object,
     4. paper grain over all of it (the house treatment for light
        fields).

   The composition is deliberate rather than centred: caption and
   device stand on the SAME horizon, one rule crossing the whole frame
   and tying the halves together. The Apple Wallet badge sits in the
   caption column as the section's one action, not stacked on the
   device like a hat.

   GESTURE (unchanged, it was right): rise-settle. The device is
   heavy — it lifts into frame, overshoots, rocks back onto its base.
   Everything else in the room is caused by that landing: the horizon
   draws outward from under it, the floor shades, the reflection and
   the shadow arrive with the contact.
   ═══════════════════════════════════════════════════════════════════ */

import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  Stage,
  Mono,
  V,
  usePrm,
  GOLD,
  INK,
  ON_CREAM,
  ON_CREAM_SOFT,
  ON_CREAM_FAINT,
  SANS,
} from "./kit";
import { useMass, useRiseSettle, useScrub, useWipe, useDraw } from "./motion";

/* the rendered mockup — pass already presenting on the glass */
const DEVICE = "/generated/wallet/pholio-id-device.webp";
const DEVICE_W = 900;
const DEVICE_H = 1883;

/* The device is sized by HEIGHT, not width — it is a tall object and
   the stage's constraint is vertical. The budget is the frame minus
   the fixed site header, minus the floor it stands on, so it never
   runs under the header or off the bottom of the stage. */
const DEVICE_SIZE =
  "block w-auto h-[min(calc(100svh-480px),290px)] max-w-[64vw] " +
  "md:h-[min(calc(100svh-274px),620px)] md:max-w-[42vw]";

/* ── When the room empties ───────────────────────────────────────────
   The field morph under this scene is white → ink, the sharpest on the
   page, and it cannot finish before the closing stage pins. Whatever is
   still on screen while it runs gets crossfaded through mid-grey and
   goes muddy — a white-screened device at 50% over grey reads as a
   render bug, not as a dim. So the whole set clears FIRST, device
   included, and the field does its work on an empty frame, where a
   white → ink morph is simply a dip to black. The field is timed to
   start its cut just after this window closes (see `hold` on the
   wallet and close scenes in kit.tsx) — the two are a pair, so move
   them together.
   Everything in the scene exits on this one window. */
const EXIT = [0.87, 0.96] as const;

/* The reflection dies inside the depth of the plane rather than
   running the device's full height down the frame — a glossy floor
   seen at this angle returns a short reflection, and a long one reads
   as a smudge under the object. */
const REFLECTION_MASK =
  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.07) 26%, transparent 38%)";

/* ── The Apple Wallet badge ──────────────────────────────────────────
   Drawn, not shipped as artwork. Apple's supplied PNG is the variant
   with a light keyline, made for dark backgrounds; on a white sweep it
   renders as a washed-out grey box next to a black serif headline.
   This is the same solid-black construction /for-talent already uses,
   so the two pages present the badge identically.
   It is a depiction, not a control — the pass is issued from inside
   the product — so it announces itself as an image rather than
   pretending to be a button that does nothing. */
function AddToWalletBadge() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/generated/wallet/badge.webp"
      alt="Add to Apple Wallet"
      style={{ height: 50, width: "auto" }}
      draggable={false}
    />
  );
}

export default function SceneWallet() {
  const prm = usePrm();
  return (
    <Stage id="wallet" hvh={280} z={2} overlap={100}>
      {(progress) => <WalletStage progress={progress} prm={prm} />}
    </Stage>
  );
}

function WalletStage({
  progress,
  prm,
}: {
  progress: MotionValue<number>;
  prm: boolean;
}) {
  /* ── the object ──────────────────────────────────────────────── */
  const heavy = useMass(progress, "heavy");
  const { y: phoneY, rotateX: phoneRotX, scale: phoneScale } = useRiseSettle(
    heavy,
    [0, 0.42],
    260,
  );
  const phoneOpacity = useTransform(progress, [0, 0.14, ...EXIT], [0.5, 1, 1, 0]);
  /* the device sinks back down as the closing scene takes the frame
     beneath it — without this the wallet stage scrolls away still
     holding an opaque phone over the resolution */
  const phoneExitY = useScrub(progress, [EXIT[0], 0.98], [0, 220], "depart");

  /* ── the room ────────────────────────────────────────────────── */
  /* the sweep is lit before the device arrives — the room exists,
     then the object enters it */
  const keyOpacity = useTransform(progress, [0.02, 0.24, ...EXIT], [0, 1, 1, 0]);
  /* the horizon draws outward from beneath the device as it lands */
  const horizonDraw = useDraw(progress, [0.28, 0.5], "wipe");
  const horizonOpacity = useTransform(progress, [0.28, 0.4, ...EXIT], [0, 1, 1, 0]);
  /* floor, contact shadow, reflection and spill all arrive WITH the
     contact — they are consequences of the landing, not decorations */
  const groundOpacity = useTransform(progress, [0.32, 0.52, ...EXIT], [0, 1, 1, 0]);
  const reflectionOpacity = useTransform(
    progress,
    [0.36, 0.58, ...EXIT],
    [0, 0.15, 0.15, 0],
  );

  /* ── the type ────────────────────────────────────────────────── */
  const kickerClip = useWipe(progress, [0.34, 0.44], "left");
  /* the eyebrow needs its own exit: a clip-path wipe has no fade in it,
     so without this the gold "Pholio ID" is still sitting on an empty
     darkening frame long after the rest of the scene has gone */
  const kickerOpacity = useTransform(progress, [0.34, 0.4, ...EXIT], [0, 1, 1, 0]);
  const capClip = useWipe(progress, [0.4, 0.56], "left");
  const capOpacity = useTransform(progress, [0.4, 0.5, ...EXIT], [0, 1, 1, 0]);
  const badgeOpacity = useTransform(progress, [0.66, 0.76, ...EXIT], [0, 1, 1, 0]);
  const badgeScale = useScrub(progress, [0.66, 0.78], [0.94, 1], "arrival");

  return (
    <div
      /* --floor is the depth of the plane below the horizon;
         --hx is where the horizon draws from, i.e. under the device */
      className="relative h-full w-full overflow-hidden [--floor:72px] [--hx:50%] md:[--floor:clamp(112px,15vh,164px)] md:[--hx:71%]"
    >
      {/* ── the cyclorama: white under the key, warming back toward the
             page's cream at the edges so the backdrop is a swept
             surface rather than a flat fill ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(122% 96% at var(--hx) 6%, rgba(255,255,255,0) 46%, rgba(245,240,232,0.32) 80%, rgba(242,236,226,0.72) 100%)",
          opacity: prm ? 1 : keyOpacity,
        }}
      />

      {/* ── the plane below the horizon takes a little shade, the way a
             surface does under a backdrop ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "var(--floor)",
          /* a POOL of shade under the object, not a full-width band —
             a uniform strip reads as a footer rule stuck to the
             bottom of the section, where a surface has to fall off
             away from what is standing on it */
          background:
            "radial-gradient(88% 108% at var(--hx) -2%, rgba(26,24,21,0.085) 0%, rgba(26,24,21,0.035) 34%, rgba(26,24,21,0.01) 62%, transparent 82%)",
          opacity: prm ? 1 : groundOpacity,
        }}
      />

      {/* ── the pass's own warm spill onto the floor. The only place
             gold is a surface here: it is light off the object. ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: "var(--hx)",
          bottom: "var(--floor)",
          width: "min(78vw, 660px)",
          height: 190,
          transform: "translate(-50%, 44%)",
          background:
            "radial-gradient(closest-side, rgba(201,165,90,0.16) 0%, rgba(201,165,90,0.05) 46%, transparent 76%)",
          filter: "blur(20px)",
          opacity: prm ? 1 : groundOpacity,
        }}
      />

      {/* ── the horizon: the plane's leading edge, and the house gold
             sweep. Draws outward from under the device. ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0"
        style={{
          bottom: "var(--floor)",
          height: 1,
          background: `linear-gradient(to right, transparent 2%, rgba(201,165,90,0.18) 24%, rgba(201,165,90,0.45) 52%, ${GOLD} var(--hx), rgba(201,165,90,0.24) 90%, transparent 100%)`,
          transformOrigin: "var(--hx) 50%",
          scaleX: prm ? 1 : horizonDraw,
          opacity: prm ? 0.85 : horizonOpacity,
        }}
      />

      {/* ═══ composition: caption and device stand on the same line ═══ */}
      <div
        className="relative mx-auto flex h-full w-full max-w-[1180px] flex-col items-center justify-end gap-8 px-6 md:flex-row md:items-end md:justify-between md:gap-12 lg:px-12"
        style={{ paddingBottom: "var(--floor)" }}
      >
        {/* ── caption bay ────────────────────────────────────────────
             Five elements and nothing else: eyebrow, headline, one
             paragraph, one action, one qualifier. The air between them
             is the design — an earlier pass put a three-row spec table
             in here and it turned a product shot into a datasheet.
             Optically centred against the wall (not stood on the
             horizon): the floor is the DEVICE's, and type that sits on
             it reads as a second object rather than a caption. ── */}
        <div className="order-1 w-full text-center md:order-none md:max-w-[520px] md:self-center md:text-left">
          {/* eyebrow */}
          <motion.div
            style={{
              opacity: prm ? 1 : kickerOpacity,
              clipPath: prm ? undefined : kickerClip,
              willChange: "clip-path, opacity",
            }}
          >
            <Mono color={GOLD} size={10} tracking="0.24em">
              Pholio ID
            </Mono>
          </motion.div>

          <motion.div
            style={{
              opacity: prm ? 1 : capOpacity,
              clipPath: prm ? undefined : capClip,
              willChange: "clip-path, opacity",
            }}
          >
            {/* the product shot's headline runs larger than the flow's
                shared Caption — this is the page's one hero object and
                the type beside it has to hold the same weight */}
            <h2
              className="font-editorial"
              style={{
                margin: "1.6rem 0 0",
                fontSize: "clamp(2.05rem, 5.2vw, 3.95rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.024em",
                color: ON_CREAM,
                /* deliberately NOT `text-wrap: balance` (which the
                   shared Caption uses): balancing this line strands
                   "always in" on its own and pushes "your" down with
                   the verdict. Natural wrapping breaks it
                   "Your identity, / always in your / pocket." and
                   leaves the gold word alone on the last line. */
              }}
            >
              Your identity, always in your <V>pocket.</V>
            </h2>

            <p
              style={{
                margin: "1.5rem auto 0",
                maxWidth: "42ch",
                fontFamily: SANS,
                lineHeight: 1.72,
                color: ON_CREAM_SOFT,
              }}
              className="text-[15px] md:!mx-0 md:text-[16px]"
            >
              Your verified card, held in Apple Wallet. Presented the way
              you&rsquo;d present a boarding pass.
            </p>
          </motion.div>

          {/* the section's one action, and its one qualifier */}
          <motion.div
            className="mt-9 flex flex-col items-center gap-4 md:items-start"
            style={{
              opacity: prm ? 1 : badgeOpacity,
              scale: prm ? 1 : badgeScale,
              transformOrigin: "left center",
            }}
          >
            <AddToWalletBadge />
            <p
              style={{
                margin: 0,
                fontFamily: SANS,
                fontSize: 13.5,
                lineHeight: 1.5,
                color: ON_CREAM_FAINT,
              }}
            >
              Included with Studio+.
            </p>
          </motion.div>
        </div>

        {/* ── device bay: the object, its reflection, its shadow ── */}
        <div className="order-2 flex justify-center md:order-none md:flex-1">
          <motion.div
            className="relative"
            style={{
              y: prm ? 0 : phoneY,
              translateY: prm ? 0 : phoneExitY,
              rotateX: prm ? 0 : phoneRotX,
              scale: prm ? 1 : phoneScale,
              opacity: prm ? 1 : phoneOpacity,
              transformPerspective: 1400,
              transformOrigin: "50% 100%",
              willChange: "transform, opacity",
            }}
          >
            {/* contact shadow — under the object, over the floor, and
                beneath the reflection that rises out of it */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 w-[150%] -translate-x-1/2"
              style={{
                top: "100%",
                height: 84,
                marginTop: -12,
                background:
                  "radial-gradient(closest-side, rgba(26,24,21,0.46) 0%, rgba(26,24,21,0.17) 44%, transparent 78%)",
                filter: "blur(11px)",
                opacity: prm ? 1 : groundOpacity,
              }}
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEVICE}
              alt="The Pholio ID pass presenting on an iPhone"
              width={DEVICE_W}
              height={DEVICE_H}
              draggable={false}
              className={DEVICE_SIZE}
            />

            {/* the reflection in the plane — mirrored about the device's
                own base, blurred and masked so it dies into the floor.
                The mask runs `to top` because it is applied before the
                flip: opaque at the element's bottom lands at the
                contact line once mirrored. */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0"
              style={{
                top: "100%",
                height: "100%",
                transform: "scaleY(-1)",
                opacity: prm ? 0.15 : reflectionOpacity,
                maskImage: REFLECTION_MASK,
                WebkitMaskImage: REFLECTION_MASK,
                filter: "blur(3px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEVICE}
                alt=""
                draggable={false}
                style={{ display: "block", width: "100%", height: "100%" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── paper grain: the house treatment for light fields ── */}
      <div
        aria-hidden="true"
        className="texture-grain pointer-events-none absolute inset-0"
      />
    </div>
  );
}
