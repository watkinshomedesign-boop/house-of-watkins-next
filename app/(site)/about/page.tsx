import { AboutPageResponsive } from "@/sitePages/AboutPageResponsive.client";
import type { Metadata } from "next";
import { getAboutPage } from "@/lib/contentPages/sanity";
import { isContentPageVisibleToRequest } from "@/lib/contentPages/visibility";
import { urlForImage } from "@/lib/sanity/image";
import JsonLd from "@/components/JsonLd";

function imageUrl(source: unknown, width: number) {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(width).fit("max").url();
  } catch {
    return undefined;
  }
}

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com";
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getSiteUrl();
  const canonicalUrl = `${baseUrl}/about`;

  return {
    title: "About Us | House of Watkins",
    description:
      "Meet House of Watkins and learn how we turn ideas into permit-ready house plans with a thoughtful, eco-friendly design process.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "About Us | House of Watkins",
      description:
        "Meet House of Watkins and learn how we turn ideas into permit-ready house plans with a thoughtful, eco-friendly design process.",
      url: canonicalUrl,
      siteName: "House of Watkins",
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function Page() {
  const cms = await getAboutPage();
  const visible = cms && isContentPageVisibleToRequest(cms);

  const media = visible
    ? {
        heroImageSrc: imageUrl(cms.aboutMedia?.heroImage, 2400),
        heroImageAlt: cms.aboutMedia?.heroImageAlt,
        houseWideImageSrc: imageUrl(cms.aboutMedia?.houseWideImage, 2400),
        houseWideImageAlt: cms.aboutMedia?.houseWideImageAlt,
        teamImage1Src: imageUrl(cms.aboutMedia?.teamImage1, 1200),
        teamImage2Src: imageUrl(cms.aboutMedia?.teamImage2, 1200),
        teamImage3Src: imageUrl(cms.aboutMedia?.teamImage3, 1200),
        ctaHouseImageSrc: imageUrl(cms.aboutMedia?.ctaHouseImage, 1600),
        ctaHouseImageAlt: cms.aboutMedia?.ctaHouseImageAlt,
      }
    : undefined;

  const heroImgUrl = media?.heroImageSrc || "";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://houseofwatkins.com/about#david-watkins",
    "name": "David Elijah Watkins",
    "jobTitle": "Residential Designer",
    "worksFor": { "@id": "https://houseofwatkins.com/#organization" },
    "description": "Award-winning residential designer with over 30 years of experience and 400+ homes designed. Educated at the Art Institute of Denver. Specializes in midcentury modern, contemporary, and ADU house plans.",
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Art Institute of Denver"
    },
    "knowsAbout": [
      "Residential Architecture",
      "Midcentury Modern Design",
      "ADU Design",
      "Contemporary House Plans",
      "Construction",
      "Site Planning"
    ],
    "award": "Award-Winning Designer",
    "url": "https://houseofwatkins.com/about",
    ...(heroImgUrl ? { "image": heroImgUrl } : {})
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <AboutPageResponsive media={media} />
    </>
  );
}
