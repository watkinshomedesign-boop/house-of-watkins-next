import { MetadataRoute } from "next";
import { getPublishedPlans } from "@/lib/plans";
import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com"; // Fallback domain
}

async function getPublishedSitePages(): Promise<Array<{ slug: string; updatedAt?: string }>> {
  if (!hasSanity()) return [];
  
  const client = getServerSanityClient();
  const pages = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(
    `*[_type == "sitePage" && status == "published" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`,
    {},
    { next: { revalidate: 3600 } }
  );
  
  return (pages ?? []).map((p) => ({
    slug: p.slug || "",
    updatedAt: p._updatedAt,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getSiteUrl();
  const currentDate = new Date().toISOString();

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/house-plans`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Get all published house plans
  try {
    const plans = await getPublishedPlans();
    for (const plan of plans) {
      if (plan.slug) {
        // Note: Plan type doesn't include created_at/updated_at, so we use currentDate
        routes.push({
          url: `${baseUrl}/house/${plan.slug}`,
          lastModified: currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error("[sitemap] Error fetching plans:", error);
  }

  // Get all published site pages from Sanity
  try {
    const sitePages = await getPublishedSitePages();
    for (const page of sitePages) {
      if (page.slug && page.slug !== "/" && !page.slug.startsWith("/house/")) {
        routes.push({
          url: `${baseUrl}${page.slug.startsWith("/") ? page.slug : `/${page.slug}`}`,
          lastModified: page.updatedAt ? new Date(page.updatedAt).toISOString() : currentDate,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error("[sitemap] Error fetching site pages:", error);
  }

  return routes;
}
