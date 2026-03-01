import { HomePage } from "@/sitePages/HomePage";
import { HomePageMobile } from "@/sitePages/HomePageMobile";
import { notFound } from "next/navigation";
import { getHomePageSlots } from "@/lib/homePage/sanity";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sitePages/sanity";
import { urlForImage } from "@/lib/sanity/image";
import JsonLd from "@/components/JsonLd";

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

  const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://houseofwatkins.com/#organization",
        "name": "House of Watkins",
        "url": "https://houseofwatkins.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://houseofwatkins.com/brand/Logo%20Images/Logo%20Stacked.png"
        },
        "description": "Custom house plans and architectural designs by award-winning designer David Watkins. 77 designer plans starting at $1,738. Over 30 years of experience and 400+ homes designed.",
        "foundingDate": "1995",
        "founder": {
          "@type": "Person",
          "name": "David Elijah Watkins"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bend",
          "addressRegion": "OR",
          "addressCountry": "US"
        },
        "sameAs": [
          "https://www.instagram.com/house.of.watkins/",
          "https://www.pinterest.com/houseofwatkins/",
          "https://www.facebook.com/houseofwatkins",
          "https://www.linkedin.com/company/house-of-watkins"
        ],
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": 3
        },
        "knowsAbout": [
          "House Plans",
          "ADU Floor Plans",
          "Midcentury Modern Architecture",
          "Contemporary House Design",
          "Oregon ADU Plans",
          "Custom Home Design",
          "Residential Architecture"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://houseofwatkins.com/#website",
        "name": "House of Watkins",
        "url": "https://houseofwatkins.com",
        "publisher": { "@id": "https://houseofwatkins.com/#organization" },
        "description": "Browse 77 designer house plans from award-winning designer David Watkins. ADU plans, midcentury modern, contemporary, and custom designs starting at $1,738."
      }
    ]
  };

  return (
    <>
      <JsonLd data={homepageSchema} />
      <div className="md:hidden">
        <HomePageMobile cms={cms ?? undefined} />
      </div>
      <div className="hidden md:block">
        <HomePage cms={cms ?? undefined} />
      </div>
    </>
  );
}
