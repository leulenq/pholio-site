import type { Metadata, Viewport } from "next";
import { Noto_Serif_Display, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { SITE_ORIGIN, pageMetadata } from "@/lib/seo";
import { SiteStructuredData } from "@/components/seo/StructuredData";
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
  ...pageMetadata("/"),
  metadataBase: new URL(SITE_ORIGIN),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
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
        <SiteStructuredData />
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
