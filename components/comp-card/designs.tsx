"use client";

import type { CSSProperties, ReactNode } from "react";

import { Wordmark } from "@/components/header/kit";
import { useDeferredCardAsset } from "./assets";
import { LIBRARY } from "./library";
import { CARD_ASPECT, cardSrc } from "./motion";

/**
 * Five of the six directions, drawn by hand. The first, the Gold Room, is
 * composed live on the stage out of the photographs themselves (index.tsx).
 *
 * Every card is laid out in `u`, a hundredth of its own width, so one
 * design is one design at any size. Every photograph is one of Ola
 * Szkolda's own, from the same library the stage just read.
 */

export type DesignId = "noir" | "swiss" | "rouge" | "digitals" | "cover";

export const DESIGNS: readonly { id: DesignId | "gold"; name: string }[] = [
  { id: "gold", name: "Gold Room" },
  { id: "noir", name: "Noir" },
  { id: "swiss", name: "Swiss" },
  { id: "rouge", name: "Rouge" },
  { id: "digitals", name: "Digitals" },
  { id: "cover", name: "Cover" },
];

/** Published measurements (scripts/ola-talent.cjs), in agency order. */
export const STATS: readonly [string, string][] = [
  ["Height", "169"],
  ["Bust", "77"],
  ["Waist", "58"],
  ["Hips", "84"],
  ["Shoes", "38"],
  ["Hair", "Blonde"],
  ["Eyes", "Blue"],
];

const ADDRESS = "pholio.studio/ola-szkolda";

const BODONI = "var(--font-bodoni), 'Bodoni Moda', Didot, serif";
const ARCHIVO = "var(--font-archivo), 'Archivo', 'Helvetica Neue', sans-serif";
const MONO = "var(--font-mono)";
const SANS = "var(--font-sans)";

function faceOf(id: string) {
  return LIBRARY.find((i) => i.id === id)?.face;
}

/** A photograph cut to a box, framed on her face unless told otherwise. */
function Photo({
  id,
  x,
  y,
  w,
  h,
  u,
  pos,
  src,
  style,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  u: number;
  pos?: string;
  src?: string;
  style?: CSSProperties;
}) {
  const url = useDeferredCardAsset(src ?? cardSrc(id));
  const face = faceOf(id);
  const position = pos ?? (face ? `${face[0] * 100}% ${Math.max(face[1] * 100 - 8, 0)}%` : "50% 50%");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      decoding="async"
      draggable={false}
      className="absolute block object-cover"
      style={{ left: x * u, top: y * u, width: w * u, height: h * u, objectPosition: position, ...style }}
    />
  );
}

function Face({ w, bg, children, style }: { w: number; bg: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: w, height: w / CARD_ASPECT, background: bg, ...style }}
    >
      {children}
    </div>
  );
}

function Text({ u, x, y, children, style }: { u: number; x: number; y: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="absolute whitespace-nowrap" style={{ left: x * u, top: y * u, lineHeight: 1, ...style }}>
      {children}
    </div>
  );
}

// ── Noir ──────────────────────────────────────────────────────────────────
// Monochrome. A gallery print on warm white, the name in a didone italic
// that breaks across the print's lower edge. The back is black: three
// frames, and her measurements set as the largest thing on it.

function NoirFront({ w }: { w: number }) {
  const u = w / 100;
  return (
    <Face w={w} bg="#ECE8E1">
      <Photo id="y-0iCW0qQhA" u={u} x={7} y={7} w={86} h={118} pos="50% 30%" style={{ filter: "grayscale(1) contrast(1.06)" }} />
      <Text u={u} x={5.4} y={113.5} style={{ fontFamily: BODONI, fontStyle: "italic", fontSize: 15.5 * u, letterSpacing: "-0.02em", color: "#0E0D0C" }}>
        Ola Szkolda
      </Text>
      <Text u={u} x={7.2} y={145} style={{ fontFamily: SANS, fontSize: 1.75 * u, letterSpacing: "0.32em", color: "rgba(14,13,12,0.55)", textTransform: "uppercase" }}>
        Warsaw
      </Text>
      <Text u={u} x={93} y={145} style={{ fontFamily: SANS, fontSize: 1.75 * u, letterSpacing: "0.32em", color: "rgba(14,13,12,0.55)", transform: "translateX(-100%)" }}>
        169 CM
      </Text>
    </Face>
  );
}

function NoirBack({ w }: { w: number }) {
  const u = w / 100;
  const g = { filter: "grayscale(1) contrast(1.05)" };
  const big = [
    ["169", "Height"],
    ["77", "Bust"],
    ["58", "Waist"],
    ["84", "Hips"],
  ];
  return (
    <Face w={w} bg="#0D0D0C">
      <Photo id="WTXNjg-vNH0" u={u} x={6} y={6} w={55} h={92} pos="45% 50%" style={g} />
      <Photo id="m60lHgYnxAI" u={u} x={63} y={6} w={31} h={45} style={g} />
      <Photo id="U0QrIfsGFc4" u={u} x={63} y={53} w={31} h={45} style={g} />
      <div className="absolute flex" style={{ left: 6 * u, top: 105 * u, gap: 6.5 * u }}>
      {big.map(([v, k]) => (
        <div key={k}>
          <div style={{ fontFamily: BODONI, fontSize: 13 * u, lineHeight: 1, color: "#F2EEE7", letterSpacing: "-0.03em" }}>{v}</div>
          <div style={{ fontFamily: SANS, fontSize: 1.6 * u, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(242,238,231,0.5)", marginTop: 1.6 * u }}>{k}</div>
        </div>
      ))}
      </div>
      <Text u={u} x={6} y={137} style={{ fontFamily: SANS, fontSize: 1.6 * u, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(242,238,231,0.5)" }}>
        Shoes 38 &nbsp;&nbsp; Hair Blonde &nbsp;&nbsp; Eyes Blue
      </Text>
      <Text u={u} x={6} y={146.5} style={{ fontFamily: BODONI, fontStyle: "italic", fontSize: 3.4 * u, color: "#F2EEE7" }}>
        Ola Szkolda
      </Text>
      <Text u={u} x={94} y={147.4} style={{ fontFamily: SANS, fontSize: 1.7 * u, letterSpacing: "0.08em", color: "rgba(242,238,231,0.55)", transform: "translateX(-100%)" }}>
        {ADDRESS}
      </Text>
    </Face>
  );
}

// ── Swiss ─────────────────────────────────────────────────────────────────
// A grid with one red square in it. The figure takes the right three fifths
// edge to edge; the name and her height hold the left column in a
// condensed grotesque. The back is a numbered sheet of six.

const VERMILION = "#E3412B";

function SwissFront({ w }: { w: number }) {
  const u = w / 100;
  const name = { fontFamily: ARCHIVO, fontStretch: "68%", fontWeight: 800, fontSize: 10.2 * u, letterSpacing: "-0.01em", color: "#111", lineHeight: 0.86 } as const;
  return (
    <Face w={w} bg="#F3F2EE">
      <Photo id="bov3dwNWm-4" u={u} x={40} y={0} w={60} h={154.6} pos="46% 50%" />
      <div className="absolute" style={{ left: 6 * u, top: 6.4 * u }}>
        <div style={name}>OLA</div>
        <div style={name}>SZKOL</div>
        <div style={name}>DA</div>
      </div>
      <div className="absolute" style={{ left: 6 * u, top: 44 * u, width: 9 * u, height: 9 * u, background: VERMILION }} />
      <div className="absolute" style={{ left: 5.2 * u, top: 117 * u, fontFamily: ARCHIVO, fontStretch: "75%", fontWeight: 300, fontSize: 25 * u, letterSpacing: "-0.04em", color: "#111", lineHeight: 0.8 }}>
        169
      </div>
      <Text u={u} x={6} y={142} style={{ fontFamily: ARCHIVO, fontWeight: 600, fontSize: 2.3 * u, color: "#111" }}>
        cm&nbsp;&nbsp;&nbsp;Warsaw
      </Text>
    </Face>
  );
}

function SwissBack({ w }: { w: number }) {
  const u = w / 100;
  const frames = ["4wU52Mi1MKA", "eo1ZFYlx4MA", "8PNDUQtixvs", "tw50-AerHOg", "dtneDawQn9s", "Q-4Xq4919xk"];
  const cw = (100 - 12 - 4) / 3;
  return (
    <Face w={w} bg="#F3F2EE">
      {frames.map((id, i) => {
        const x = 6 + (i % 3) * (cw + 2);
        const y = 6 + Math.floor(i / 3) * 44;
        return (
          <div key={id}>
            <Photo id={id} u={u} x={x} y={y} w={cw} h={38} />
            <Text u={u} x={x} y={y + 39.4} style={{ fontFamily: ARCHIVO, fontWeight: 600, fontSize: 1.9 * u, color: "#111" }}>
              {String(i + 1).padStart(2, "0")}
            </Text>
          </div>
        );
      })}
      <div className="absolute grid" style={{ left: 6 * u, top: 100 * u, gridTemplateColumns: "repeat(4, auto)", columnGap: 6 * u, rowGap: 2.4 * u, justifyContent: "start" }}>
        {STATS.map(([k, v]) => (
          <div key={k} style={{ fontFamily: ARCHIVO, fontSize: 2.4 * u, lineHeight: 1.15 }}>
            <div style={{ color: "rgba(17,17,17,0.45)", fontWeight: 500 }}>{k}</div>
            <div style={{ color: "#111", fontWeight: 700 }}>{v}{k === "Height" ? " cm" : ""}</div>
          </div>
        ))}
      </div>
      <div className="absolute" style={{ left: 6 * u, top: 139 * u, width: 6 * u, height: 6 * u, background: VERMILION }} />
      <Text u={u} x={15} y={139.4} style={{ fontFamily: ARCHIVO, fontWeight: 800, fontStretch: "75%", fontSize: 3.6 * u, color: "#111" }}>
        Ola Szkolda
      </Text>
      <Text u={u} x={15} y={144.2} style={{ fontFamily: ARCHIVO, fontWeight: 500, fontSize: 1.9 * u, color: "rgba(17,17,17,0.55)" }}>
        {ADDRESS}
      </Text>
    </Face>
  );
}

// ── Rouge ─────────────────────────────────────────────────────────────────
// Red seamless. The beauty frame to every edge, the surname run up the
// left side in a heavy condensed face at the height of the card. The back
// takes its field from the seamless itself.

const ROUGE = "#C91F17";

function RougeFront({ w }: { w: number }) {
  const u = w / 100;
  const h = 100 / CARD_ASPECT;
  return (
    <Face w={w} bg={ROUGE}>
      <Photo id="Y7Z11Dhre6E" u={u} x={0} y={0} w={100} h={h} pos="58% 30%" />
      <div
        className="absolute whitespace-nowrap"
        style={{
          left: 3.4 * u,
          bottom: 4 * u,
          transformOrigin: "0 100%",
          transform: "rotate(-90deg) translateY(100%)",
          fontFamily: ARCHIVO,
          fontStretch: "62%",
          fontWeight: 900,
          fontSize: 31 * u,
          letterSpacing: "-0.02em",
          lineHeight: 0.8,
          color: "#FFF6EE",
        }}
      >
        SZKOLDA
      </div>
      <Text u={u} x={30} y={145} style={{ fontFamily: ARCHIVO, fontStretch: "80%", fontWeight: 700, fontSize: 4.2 * u, letterSpacing: "0.04em", color: "#FFF6EE" }}>
        OLA
      </Text>
    </Face>
  );
}

function RougeBack({ w }: { w: number }) {
  const u = w / 100;
  const cream = "#FFF1E6";
  return (
    <Face w={w} bg={ROUGE}>
      <Photo id="Q7o-22z-yQw" u={u} x={6} y={6} w={57} h={86} />
      <Photo id="rQ6NqGFWoX0" u={u} x={65} y={6} w={29} h={42} pos="45% 40%" />
      <Photo id="C4FiV6JCA4Y" u={u} x={65} y={50} w={29} h={42} />
      <Photo id="wSpCmF1PYRY" u={u} x={6} y={94} w={88} h={26} pos="50% 42%" />
      <Text u={u} x={6} y={125.5} style={{ fontFamily: ARCHIVO, fontStretch: "62%", fontWeight: 900, fontSize: 9.2 * u, letterSpacing: "-0.01em", color: cream, lineHeight: 0.85 }}>
        OLA SZKOLDA
      </Text>
      <Text u={u} x={6} y={137.5} style={{ fontFamily: ARCHIVO, fontStretch: "80%", fontWeight: 600, fontSize: 2.3 * u, letterSpacing: "0.06em", color: cream, textTransform: "uppercase" }}>
        169 cm&nbsp;&nbsp;/&nbsp;&nbsp;77–58–84&nbsp;&nbsp;/&nbsp;&nbsp;EU 38&nbsp;&nbsp;/&nbsp;&nbsp;Blonde&nbsp;&nbsp;/&nbsp;&nbsp;Blue
      </Text>
      <Text u={u} x={6} y={146.5} style={{ fontFamily: ARCHIVO, fontWeight: 500, fontSize: 1.9 * u, letterSpacing: "0.06em", color: "rgba(255,241,230,0.7)" }}>
        {ADDRESS}
      </Text>
    </Face>
  );
}

// ── Digitals ──────────────────────────────────────────────────────────────
// The working card. A digital, unretouched, mounted like a print on grey
// stock with the facts typed under it; the back is the contact sheet.

function DigitalsFront({ w }: { w: number }) {
  const u = w / 100;
  const mono = { fontFamily: MONO, color: "#1A1917", letterSpacing: "0.02em" } as const;
  return (
    <Face w={w} bg="#D6D1C8">
      <div
        className="absolute"
        style={{
          left: 8 * u,
          top: 8 * u,
          width: 84 * u,
          height: 128 * u,
          background: "#FBFAF7",
          transform: "rotate(-1.4deg)",
          boxShadow: "0 1.2px 2px rgba(0,0,0,0.18), 0 10px 22px -12px rgba(0,0,0,0.35)",
        }}
      >
        <Photo id="f1bGNPDeDO0" u={u} x={4} y={4} w={76} h={100} pos="55% 40%" />
        <Text u={u} x={4} y={109} style={{ ...mono, fontSize: 4 * u, fontWeight: 500 }}>
          OLA SZKOLDA
        </Text>
        <Text u={u} x={4} y={115.5} style={{ ...mono, fontSize: 2.3 * u, color: "rgba(26,25,23,0.62)" }}>
          169 · 77-58-84 · EU38 · BLONDE · BLUE
        </Text>
      </div>
      <Text u={u} x={8} y={145} style={{ ...mono, fontSize: 1.9 * u, color: "rgba(26,25,23,0.5)" }}>
        DIGITALS / NO RETOUCH
      </Text>
      <Text u={u} x={92} y={145} style={{ ...mono, fontSize: 1.9 * u, color: "rgba(26,25,23,0.5)", transform: "translateX(-100%)" }}>
        WARSAW
      </Text>
    </Face>
  );
}

function DigitalsBack({ w }: { w: number }) {
  const u = w / 100;
  const frames = [
    "eo_eBIDuJkQ",
    "sOYqoWidOFU",
    "ZQ3NxUwRJrQ",
    "p250tH4k74A",
    "zWvQ7tPaQHw",
    "T1sohRer5hg",
    "hVKq6TpfYsQ",
    "XaSmLh9VeRA",
    "9V9qS-dgGzE",
  ];
  const cw = (100 - 12 - 6) / 3;
  const mono = { fontFamily: MONO, color: "#1A1917" } as const;
  return (
    <Face w={w} bg="#EDEAE4">
      <div className="absolute" style={{ left: 4 * u, top: 4 * u, right: 4 * u, height: 124 * u, background: "#141312" }} />
      {frames.map((id, i) => {
        const x = 6 + (i % 3) * (cw + 3);
        const y = 7 + Math.floor(i / 3) * 40;
        return (
          <div key={id}>
            <Photo id={id} u={u} x={x} y={y} w={cw} h={34} />
            <Text u={u} x={x} y={y + 35.4} style={{ ...mono, fontSize: 1.6 * u, color: "rgba(237,234,228,0.55)" }}>
              {`${String(i + 12).padStart(2, "0")}A ▸`}
            </Text>
          </div>
        );
      })}
      <div className="absolute grid" style={{ left: 6 * u, top: 133 * u, gridTemplateColumns: "repeat(4, auto)", columnGap: 4.4 * u, rowGap: 1.4 * u }}>
        {STATS.map(([k, v]) => (
          <span key={k} style={{ ...mono, fontSize: 1.9 * u, textTransform: "uppercase" }}>
            <span style={{ color: "rgba(26,25,23,0.5)" }}>{k}</span> {v}
          </span>
        ))}
      </div>
      <Text u={u} x={94} y={147} style={{ ...mono, fontSize: 1.8 * u, color: "rgba(26,25,23,0.6)", transform: "translateX(-100%)" }}>
        {ADDRESS}
      </Text>
    </Face>
  );
}

// ── Cover ─────────────────────────────────────────────────────────────────
// A magazine cover she is the whole of. The masthead is her surname, in a
// high-contrast didone, set behind her head. The back is the issue's
// opening spread folded down to a card: black, four frames from the
// colonnade sitting, and the facts set like a contributor's note.

function CoverFront({ w }: { w: number }) {
  const u = w / 100;
  const h = 100 / CARD_ASPECT;
  const figure = useDeferredCardAsset(cardSrc("riHmBtbm-JE-figure"));
  const ink = "#121110";
  return (
    <Face w={w} bg="#E9E6E1">
      <Photo id="riHmBtbm-JE" u={u} x={0} y={0} w={100} h={h} pos="50% 50%" />
      <Text u={u} x={4.6} y={6.6} style={{ fontFamily: BODONI, fontStyle: "italic", fontSize: 5.4 * u, color: ink }}>
        Ola
      </Text>
      <div
        className="absolute text-center"
        style={{ left: 0, right: 0, top: 9.5 * u, fontFamily: BODONI, fontWeight: 500, fontSize: 20.4 * u, letterSpacing: "-0.035em", lineHeight: 1, color: ink }}
      >
        SZKOLDA
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={figure} alt="" decoding="async" draggable={false} className="absolute inset-0 block h-full w-full object-cover" />
      <Text u={u} x={95} y={36} style={{ fontFamily: BODONI, fontStyle: "italic", fontSize: 4.4 * u, color: ink, lineHeight: 1.08, textAlign: "right", transform: "translateX(-100%)" }}>
        The colonnade,
        <br />
        Warsaw
      </Text>
      <Text u={u} x={95} y={145.5} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 1.9 * u, letterSpacing: "0.28em", color: ink, transform: "translateX(-100%)" }}>
        169 CM
      </Text>
    </Face>
  );
}

function CoverBack({ w }: { w: number }) {
  const u = w / 100;
  const cream = "#F1ECE3";
  return (
    <Face w={w} bg="#121110">
      <Photo id="4Zwp8O3Zmos" u={u} x={6} y={6} w={52} h={112} pos="50% 40%" />
      <Photo id="yAxlj92R9Xg" u={u} x={60} y={6} w={34} h={55} pos="52% 45%" />
      <Photo id="K8T29zb8f8Y" u={u} x={60} y={63} w={34} h={55} />
      <Text u={u} x={6} y={124} style={{ fontFamily: BODONI, fontStyle: "italic", fontSize: 7 * u, color: cream, letterSpacing: "-0.02em" }}>
        Ola Szkolda
      </Text>
      <Text u={u} x={6} y={134.5} style={{ fontFamily: BODONI, fontSize: 2.6 * u, color: "rgba(241,236,227,0.8)" }}>
        Height 169 · Bust 77 · Waist 58 · Hips 84 · Shoes 38 · Blonde · Blue
      </Text>
      <div className="absolute flex items-baseline justify-between" style={{ left: 6 * u, right: 6 * u, top: 146 * u }}>
        <Wordmark size={2.5 * u} color="#C9A55A" />
        <span style={{ fontFamily: SANS, fontSize: 1.7 * u, letterSpacing: "0.08em", color: "rgba(241,236,227,0.55)" }}>{ADDRESS}</span>
      </div>
    </Face>
  );
}

const FACES: Record<DesignId, { front: (p: { w: number }) => ReactNode; back: (p: { w: number }) => ReactNode }> = {
  noir: { front: NoirFront, back: NoirBack },
  swiss: { front: SwissFront, back: SwissBack },
  rouge: { front: RougeFront, back: RougeBack },
  digitals: { front: DigitalsFront, back: DigitalsBack },
  cover: { front: CoverFront, back: CoverBack },
};

export function CardFace({ id, side, w }: { id: DesignId; side: "front" | "back"; w: number }) {
  const Render = FACES[id][side];
  return <Render w={w} />;
}
