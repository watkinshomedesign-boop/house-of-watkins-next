/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/pinterest-feed.xml",
        destination: "/api/pinterest-feed-xml",
      },
      {
        source: "/pinterest-feed.csv",
        destination: "/api/pinterest-feed-csv",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/catalog",
        destination: "/house-plans",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
