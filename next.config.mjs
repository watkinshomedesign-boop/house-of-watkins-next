/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
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
    ];
  },
};
export default nextConfig;
