import { HomePage } from "@/sitePages/HomePage";
import { HomePageMobile } from "@/sitePages/HomePageMobile";
import { notFound } from "next/navigation";
import { getHomePageSlots } from "@/lib/homePage/sanity";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sitePages/sanity";
import { urlForImage } from "@/lib/sanity/image";

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com";
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const baseUrl = await getSiteUrl();

  const title = siteSettings?.defaultSeoTitle?.trim() || "House of Watkins | ADU Plans, Midcentury Modern & Contemporary House Plans";
  const description =
    siteSettings?.defaultSeoDescription?.trim() ||
    "Premium house plans designed in Bend, Oregon by David Watkins — ADU and accessory dwelling unit plans, midcentury modern, contemporary, and farmhouse designs. Curated plans for owner-builders and families, from compact backyard cottages to full-size custom homes.";

  let ogImage: string | undefined;
  if (siteSettings?.defaultOgImage) {
    try {
      const imageUrl = urlForImage(siteSettings.defaultOgImage).width(1200).height(630).url();
      ogImage = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `https:${imageUrl}`) : undefined;
    } catch (error) {
      console.error("[metadata] Error resolving OG image:", error);
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "House of Watkins",
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function Page() {
  const cms = await getHomePageSlots();

  if (cms) {
    const dm = draftMode();
    const visible = dm.isEnabled ? true : cms.status === "published";
    if (!visible && process.env.NODE_ENV === "production") return notFound();
  }

  return (
    <>
      <div className="md:hidden">
        <HomePageMobile cms={cms ?? undefined} />
      </div>
      <div className="hidden md:block">
        <HomePage cms={cms ?? undefined} />
      </div>
    </>
  );
}
