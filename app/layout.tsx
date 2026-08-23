import type { Metadata, Viewport } from "next";
import { Noto_Serif_Display, Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import SiteFooter from "@/components/footer/SiteFooter";
import HeaderWrapper from "@/components/HeaderWrapper";
import Providers from "@/components/Providers";

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

/** Edge-to-edge on notched iPhones. `themeColor` is overridden per route by
    <ThemeColor />, so the browser chrome matches the page's paper. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pholio.studio"),
  title: {
    default: "Pholio",
    template: "%s | Pholio",
  },
  description:
    "Pholio is a verified-talent portfolio platform. Talent build a professional book; agencies discover and shortlist real people.",
  openGraph: {
    siteName: "Pholio",
    type: "website",
    url: "https://www.pholio.studio",
  },
  robots: { index: true, follow: true },
};

import CustomCursor from "@/components/CustomCursor";

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
        <Providers>
          <CustomCursor />
          <HeaderWrapper />
          <main className="relative z-10 min-h-mobile-screen bg-[#050505]">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
