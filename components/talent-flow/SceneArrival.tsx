"use client";

/* ═══════════════════════════════════════════════════════════════════
   Scene 1 — Arrival. The hero.

   This file is now only the mount point. The four hero directions live
   in `components/talent-hero/` and are selected by
   `DEFAULT_HERO_VARIANT` in `lib/hero-variants.ts`; `?hero=<id>` forces
   one for comparison and `?hero=reset` clears the override. Same
   pattern as the header and footer directions.

   The override is read after mount rather than during render, so the
   server and the first client pass always agree on the default and the
   preview never causes a hydration mismatch.

   Whatever variant is mounted, the scene's job inside the flow is
   unchanged: hold the frame, then recede as the card scene takes it.
   Each variant paints its own opaque field and clears it on the shared
   exit curve in `components/talent-hero/kit.tsx`.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { type MotionValue } from "framer-motion";
import { Stage, usePrm } from "./kit";
import {
  DEFAULT_HERO_VARIANT,
  isHeroVariantId,
  type HeroVariantId,
} from "@/lib/hero-variants";
import VariantRoom from "@/components/talent-hero/VariantRoom";
import VariantAccess from "@/components/talent-hero/VariantAccess";
import VariantArtifact from "@/components/talent-hero/VariantArtifact";
import VariantTitleCard from "@/components/talent-hero/VariantTitleCard";

const VARIANTS = {
  room: VariantRoom,
  access: VariantAccess,
  artifact: VariantArtifact,
  titlecard: VariantTitleCard,
} as const;

const STORAGE_KEY = "pholio:hero-variant";

function useHeroVariant(): HeroVariantId {
  const [variant, setVariant] = useState<HeroVariantId>(DEFAULT_HERO_VARIANT);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("hero");
    if (param === "reset") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      setVariant(DEFAULT_HERO_VARIANT);
      return;
    }
    if (isHeroVariantId(param)) {
      window.sessionStorage.setItem(STORAGE_KEY, param);
      setVariant(param);
      return;
    }
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (isHeroVariantId(stored)) setVariant(stored);
  }, []);

  return variant;
}

export default function SceneArrival() {
  const prm = usePrm();
  const variant = useHeroVariant();
  const Hero = VARIANTS[variant];

  return (
    <Stage id="arrival" hvh={165} z={8}>
      {(progress: MotionValue<number>) => (
        <Hero progress={progress} prm={prm} />
      )}
    </Stage>
  );
}
