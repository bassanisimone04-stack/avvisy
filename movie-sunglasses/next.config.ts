import type { NextConfig } from "next";

const prod = process.env.NODE_ENV === "production";
// Moderate CSP: blocks foreign scripts, frames and form targets. 'unsafe-inline' remains for Next's inline bootstrap
// scripts and styles (a nonce-based CSP would force every page to render dynamically and lose ISR).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${prod ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ...(prod ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Blocking <head> metadata for every client (title/description always in <head>, also on dynamic pages).
  htmlLimitedBots: /.*/,
  experimental: { inlineCss: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Listing pages read searchParams (so they render per request): let the CDN reuse each URL briefly.
      { source: "/:path(sunglasses|movies|affordable-alternatives)", headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=120, stale-while-revalidate=600" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
