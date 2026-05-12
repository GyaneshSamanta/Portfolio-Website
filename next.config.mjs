/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "media.licdn.com" },
    ],
  },
  // Old standalone routes folded into home anchors / canonical /blog.
  async redirects() {
    return [
      { source: "/journey",    destination: "/#journey",      permanent: true },
      { source: "/podcast",    destination: "/#podcast",      permanent: true },
      { source: "/github",     destination: "/#now-shipping", permanent: true },
      { source: "/newsletter", destination: "/blog",          permanent: true },
      { source: "/writing",    destination: "/blog",          permanent: true },
    ];
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://app.cal.com; frame-src https://app.cal.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
