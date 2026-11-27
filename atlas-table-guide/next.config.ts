import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const isProd = process.env.NODE_ENV === "production";
const mapHosts = "https://tiles.openfreemap.org https://*.openfreemap.org";
const csp = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; nonce-based CSP would force dynamic rendering of every page (see docs/REPORT.md)
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"} https://plausible.io`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `connect-src 'self' https://plausible.io https://*.supabase.co ${mapHosts} https://api.frankfurter.app`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  isProd ? "upgrade-insecure-requests" : "",
].filter(Boolean).join("; ");

const config: NextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: { globalNotFound: true },
  images: { formats: ["image/avif", "image/webp"], qualities: [60, 75], deviceSizes: [480, 768, 1080, 1280, 1920], imageSizes: [64, 128, 256, 384] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=()" },
        ],
      },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/go/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default config;
