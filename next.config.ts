import type { NextConfig } from "next";

/*
 * Security headers on every response. Only the ones that cannot break the
 * site: no Content-Security-Policy (Next inlines its own scripts), no HSTS
 * (that belongs to the HTTPS edge, as in the API's Caddyfile).
 */
const securityHeaders = [
  // Files are what they say they are: no MIME sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see where a visitor came from, not the full address.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site cannot be framed by another one (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // The site uses none of these; say so, so nothing embedded can ask.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // The second entry is this machine's address on the local network: from another
  // PC (http://192.168.100.22:3200) Next would otherwise refuse its own dev scripts
  // (403) and the page would stay static. Update it if the address changes.
  allowedDevOrigins: ["127.0.0.1", "192.168.100.22"],
  // Do not advertise the framework in every response.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The brand files are not fingerprinted, so not "immutable": a week
        // in caches, then revalidated, so a replaced logo still propagates.
        source: "/brand/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
