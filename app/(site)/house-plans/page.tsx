import { HousePlansPageResponsive } from "@/sitePages/HousePlansPageResponsive.client";
import { getHousePlansPage } from "@/lib/contentPages/sanity";
import { urlForImage } from "@/lib/sanity/image";
import type { Metadata } from "next";

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com";
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  const canonicalUrl = `${baseUrl}/house-plans`;

  const title = "House Plans | Browse Custom Home Designs | House of Watkins";
  const description =
    "Browse our collection of custom house plans and architectural designs. Find the perfect home plan for your lifestyle, from small homes to luxury estates. Filter by bedrooms, square footage, style, and more.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "House of Watkins",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function getImageUrl(source: unknown): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(128).height(128).fit("max").url();
  } catch {
    return null;
  }
}

export default async function Page() {
  const cms = await getHousePlansPage();
  const media = (cms as any)?.housePlansMedia;
  const searchIconSrc = getImageUrl(media?.searchIcon);

  return (
    <HousePlansPageResponsive
      headerTitle={media?.headerTitle ?? null}
      headerDescription={media?.headerDescription ?? null}
      searchIconSrc={searchIconSrc}
      searchIconAlt={media?.searchIconAlt ?? null}
    />
  );
}
