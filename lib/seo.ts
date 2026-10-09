import type { Metadata } from "next";
import { LEGAL_PUBLICATION_STATUS } from "./legal-constants";
import { PHOLIO_DESCRIPTION, PHOLIO_TITLE } from "./brand";
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from "./marketing-nav-links";

/** Public identity stays canonical even on a deploy preview or localhost. */
export const SITE_ORIGIN = "https://www.pholio.studio";
export const SITE_NAME = "Pholio";
export const INDEXING_ENABLED =
  process.env.PHOLIO_INDEXING !== "disabled" &&
  !["deploy-preview", "branch-deploy", "dev"].includes(process.env.CONTEXT ?? "") &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}

export const SEARCH_ROBOTS: Metadata["robots"] = INDEXING_ENABLED
  ? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    }
  : { index: false, follow: false };

export interface SeoPage {
  title: string;
  description: string;
  image?: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}

/** Search intent and product facts, rather than a list of keyword variants. */
export const SEO_PAGES: Record<string, SeoPage> = {
  "/": {
    title: PHOLIO_TITLE,
    description: PHOLIO_DESCRIPTION,
    image: "home",
  },
  "/talent": {
    title: "Model portfolios, comp cards & agency applications",
    description: "Keep your model digitals, portfolio and comp card in one place. Prepare agency applications and track what you sent with Pholio. Free to apply.",
    image: "talent",
  },
  "/studio-plus": {
    title: "Studio+ | Comp-card themes & model portfolio websites",
    description: "Seven premium comp-card themes, your own portfolio website and 90-day analytics with CSV export. Studio+ is $9.99/month with a 14-day trial.",
    image: "studio-plus",
  },
  "/agencies": {
    title: "Modeling agency application requirements",
    description: "Read modeling agencies' published photo requirements, file limits and eligibility, with sources and review dates. Pholio is not affiliated with listed agencies.",
    image: "agencies",
    type: "CollectionPage",
  },
  "/agency/request-access": {
    title: "Request agency access",
    description: "Request Pholio access to receive and review talent applications for your agency. Every request is reviewed by a person. Agencies are never charged.",
    image: "agencies",
  },
  "/about": {
    title: "About Pholio | A platform for models & agencies",
    description: "Meet the people building Pholio, a platform for models to prepare, send and track agency applications. Pholio represents no one and takes no commission.",
    image: "about",
    type: "AboutPage",
  },
  "/careers": {
    title: "Careers at Pholio",
    description: "Explore open roles at Pholio, a small remote team building model portfolios, comp cards and the application record for modeling.",
    image: "careers",
  },
  "/contact": {
    title: "Contact Pholio | Support, agencies & press",
    description: "Find the right Pholio contact for support, agencies, guardians, privacy, copyright, urgent removals and press. Learn how to verify a message from us.",
    image: "contact",
    type: "ContactPage",
  },
  "/press": {
    title: "Pholio press kit | Facts, founders & wordmark",
    description: "Official Pholio facts, company boilerplate, founder portraits and downloadable wordmarks for editorial use. Press inquiries: press@pholio.studio.",
    image: "press",
  },
  // Legal descriptions preserve the document meaning; bodies are versioned.
  "/legal/subscriptions": { title: "Subscription Terms", description: "Draft Studio+ terms covering pricing, trial conversion, recurring payments, cancellation, refunds and account deletion." },
  "/legal/agency-terms": { title: "Agency and Recipient Terms", description: "Draft terms for agencies and other recipients reviewing talent applications, including permitted use, data responsibilities and safety." },
  "/legal/verification": { title: "Verification Notice", description: "Draft notice explaining document-and-selfie verification, age checks, biometric consent, provider processing and redaction." },
  "/legal/guardians": { title: "Guardian Notice", description: "Draft notice covering adult-only account eligibility, legacy guardian permissions and child privacy requests." },
  "/terms": { title: "Terms of Service", description: "The agreement between you and Pholio covering accounts, talent submissions, Recipients, and Studio+." },
  "/privacy": { title: "Privacy Policy", description: "What Pholio collects, why, who processes it, and the choices you have." },
  "/cookies": { title: "Cookie Policy", description: "Which cookies Pholio sets, what they do, and how to change or withdraw your analytics choice." },
  "/dmca": { title: "Copyright", description: "How to report copyright infringement on Pholio and how counter-notices work." },
  "/ai-notice": { title: "AI Notice", description: "Where Pholio uses AI, what it is used for, and how talent opt in or out." },
  "/community-guidelines": { title: "Community Guidelines", description: "What is expected of talent, agencies, and other Recipients on Pholio." },
  "/legal/submission-program": { title: "Talent Submission and Opportunity Notice", description: "How submissions to agencies, casting organizations, event producers, brands, and other Recipients work, including limits, retention, and withdrawal." },
  "/take-it-down": { title: "Take It Down", description: "Report non-consensual intimate imagery for removal within 48 hours." },
};

/** Draft legal text is reviewable but must not appear as an effective search result. */
export const DRAFT_LEGAL_PATHS = LEGAL_PUBLICATION_STATUS === "draft"
  ? LEGAL_NAV.filter((entry) => entry.built).map((entry) => entry.href)
  : [];

export function pageMetadata(path: string, page: SeoPage = SEO_PAGES[path]): Metadata {
  if (!page) throw new Error(`Missing SEO content for ${path}`);
  const title = path === "/" ? page.title : `${page.title} | ${SITE_NAME}`;
  const image = {
    url: absoluteUrl(`/social/${page.image ?? "home"}.png`),
    width: 1200,
    height: 630,
    type: "image/png",
    alt: `${SITE_NAME}: ${page.title}`,
  };
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: absoluteUrl(path) },
    robots: DRAFT_LEGAL_PATHS.includes(path)
      ? { index: false, follow: INDEXING_ENABLED }
      : SEARCH_ROBOTS,
    openGraph: {
      title,
      description: page.description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

/** Navigation's built flag is authoritative; planned pages never enter the sitemap. */
export function indexableStaticPaths() {
  return [...new Set([
    "/",
    ...[...PRIMARY_NAV, ...SECONDARY_NAV, ...LEGAL_NAV].filter((entry) => entry.built).map((entry) => entry.href),
    "/agency/request-access",
  ])].filter((path) => !DRAFT_LEGAL_PATHS.includes(path));
}
