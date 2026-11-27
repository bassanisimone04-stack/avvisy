import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const config: NextConfig = {
  trailingSlash: true, // keeps the original /it/restaurants/ style URLs
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  experimental: { globalNotFound: true, inlineCss: true },
  images: { formats: ["image/avif", "image/webp"], qualities: [75], deviceSizes: [360, 480, 640, 768, 1080, 1280, 1600] },
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ] },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};
export default config;
