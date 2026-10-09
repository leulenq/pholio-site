import { Archivo, Bodoni_Moda, Noto_Serif_Display } from "next/font/google";

/**
 * The cards' own faces. A comp card is the talent's artifact, not the
 * site's, so each design takes the voice its photograph asks for. Loaded
 * once, scoped to the comp-card layer by className.
 */
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** The house serif at the light weight the room and the Spine card set in. */
export const notoLight = Noto_Serif_Display({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-noto-light",
  display: "swap",
});

export const CARD_FONTS = `${bodoni.variable} ${archivo.variable} ${notoLight.variable}`;
