import type { NextConfig } from "next";

/**
 * Pholio public site — build + edge configuration.
 *
 * Everything in this file is a cross-repo contract with pholio-app. It is not
 * design surface and it did not get reset with the rest of the site: the two
 * origins share a session cookie, so this config is half of a security
 * boundary. Read `docs/app-integration.md` before changing any of it.
 */

/** The web app (login, onboarding, dashboard). Every account CTA points here. */
const pholioAppOrigin =
  process.env.NEXT_PUBLIC_APP_URL || "https://app.pholio.studio";

/**
 * Proxy target for `/api/*`. This site never calls the app cross-origin — Next
 * proxies server-side and forwards the Cookie header, so the shared
 * `.pholio.studio` session cookie reaches Express without CORS.
 *
 * Override with APP_BACKEND_URL when running the app somewhere other than
 * localhost:3000.
 */
const apiBackendOrigin =
  process.env.APP_BACKEND_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : pholioAppOrigin);

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Talent avatars in the account cluster are served by the app.
    remotePatterns: [
      { protocol: "https", hostname: "app.pholio.studio" },
      { protocol: "https", hostname: "**.pholio.studio" },
      // Brought in with the /talent section: stock portraits and placeholder
      // faces used in the comp-card showcase and photo-intelligence scene.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },

  env: {
    NEXT_PUBLIC_APP_URL: pholioAppOrigin,
  },

  /**
   * Security headers.
   *
   * www and app share the `.pholio.studio` session cookie, which makes www a
   * same-site origin able to POST to /api/logout with that cookie attached.
   * The weaker of the two origins sets the trust boundary for both, so this
   * site runs headers even though it holds no credentials of its own.
   *
   * CSP is report-only. The site uses inline styles and framer-motion, so
   * enforcing it needs a browser pass first — do that pass before flipping the
   * header name to `Content-Security-Policy`, and treat flipping it as a real
   * task rather than a one-word edit.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.pholio.studio https://images.unsplash.com https://i.pravatar.cc",
      "font-src 'self' data:",
      // Same-origin only: /api/* is a server-side rewrite, not a browser call.
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${apiBackendOrigin}/api/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
