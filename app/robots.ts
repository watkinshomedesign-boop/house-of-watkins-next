import { MetadataRoute } from "next";

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com"; // Fallback domain
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getSiteUrl();
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/studio/",
          "/api/",
          "/_next/",
          "/auth/",
        ],
      },
    ],
    sitemap: sitemapUrl,
  };
}
