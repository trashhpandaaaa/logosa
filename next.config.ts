import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Destination and story plates are currently generated SVG (see
    // public/images/PLACEHOLDERS.md). Next refuses to optimise SVG by default
    // because a hostile SVG can carry script — these are all first-party files
    // under /public, and the CSP below neutralises scripting regardless.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
    // Next 16 requires an explicit allowlist; anything outside it is coerced
    // to the nearest permitted value.
    qualities: [70, 82, 92],
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/brand/**" }],
  },

  // Large binary assets are content-hashed by name and never change in place,
  // so they can be cached hard. GLB is not in Next's default asset pipeline.
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/textures/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
