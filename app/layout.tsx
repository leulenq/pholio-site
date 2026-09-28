import type { Metadata, Viewport } from "next";
import { Noto_Serif_Display, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { PHOLIO_TITLE, PHOLIO_DESCRIPTION } from "@/lib/brand";
import { VIEWPORT_INK, viewportBootScript } from "@/lib/viewport-canvas";
import SiteFooter from "@/components/footer/SiteFooter";
import HeaderWrapper from "@/components/HeaderWrapper";
import Providers from "@/components/Providers";
import ViewportCanvas from "@/components/ViewportCanvas";

/**
 * Three typefaces, three jobs. Do not add a fourth without a reason that
 * survives docs/design-language/foundations.md.
 *
 *   Noto Serif Display — display, headlines, the wordmark, the verdict italic
 *   Inter             — body copy and clerical navigation
 *   JetBrains Mono    — labels, measurements, timestamps
 */
const notoSerif = Noto_Serif_Display({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

/**
 * `viewport-fit: cover` lets the page reach the physical screen, including
 * the notch and the home indicator. Without it iOS draws its own bar in the
 * gap. `themeColor` is the fallback older browsers still read; Safari 26
 * tints from the document canvas (`--viewport-canvas`) instead.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: VIEWPORT_INK,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pholio.studio"),
  title: {
    default: PHOLIO_TITLE,
    template: "%s | Pholio",
  },
  description: PHOLIO_DESCRIPTION,
  openGraph: {
    siteName: "Pholio",
    type: "website",
    url: "https://www.pholio.studio",
  },
  robots: { index: true, follow: true },
};

import CustomCursor from "@/components/CustomCursor";
import ScrollInertia from "@/components/scroll-inertia";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Script id="viewport-canvas-boot" strategy="beforeInteractive">
          {viewportBootScript()}
        </Script>
        <ViewportCanvas />
        <Providers>
          <CustomCursor />
          <ScrollInertia />
          <HeaderWrapper />
          <main className="relative z-10 min-h-mobile-screen">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
