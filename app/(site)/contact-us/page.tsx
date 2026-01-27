import { ContactPageResponsive } from "@/sitePages/ContactPageResponsive.client";
import { getContactPage } from "@/lib/contentPages/sanity";
import { urlForImage } from "@/lib/sanity/image";
import { unstable_noStore as noStore } from "next/cache";
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
  const canonicalUrl = `${baseUrl}/contact-us`;

  return {
    title: "Contact Us | Get in Touch | House of Watkins",
    description:
      "Contact House of Watkins to discuss your custom house plan needs. Schedule a consultation, request a quote, or ask questions about our architectural design services.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Contact Us | Get in Touch | House of Watkins",
      description:
        "Contact House of Watkins to discuss your custom house plan needs. Schedule a consultation, request a quote, or ask questions about our architectural design services.",
      url: canonicalUrl,
      siteName: "House of Watkins",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us | Get in Touch | House of Watkins",
      description:
        "Contact House of Watkins to discuss your custom house plan needs. Schedule a consultation, request a quote, or ask questions about our architectural design services.",
    },
  };
}

function imageUrl(source: unknown, width: number) {
  if (!source) return undefined;
  if (typeof source === "string") {
    const lower = source.toLowerCase();
    if (lower.includes(".heif") || lower.includes(".heic")) return undefined;
    return source;
  }
  try {
    return urlForImage(source as any).width(width).fit("max").auto("format").url();
  } catch {
    return undefined;
  }
}

export default async function Page() {
  noStore();
  let cms: Awaited<ReturnType<typeof getContactPage>> = null;
  try {
    cms = await getContactPage();
  } catch {
    cms = null;
  }

  const resolvedSideImageSrc = cms?.contactMedia?.sideImage ? imageUrl(cms.contactMedia?.sideImage, 2000) : undefined;
  if (process.env.NODE_ENV !== "production") {
    const side = cms?.contactMedia?.sideImage as any;
    const assetRef = typeof side === "object" && side ? (side.asset?._ref ?? side.asset?._id ?? undefined) : undefined;
    // eslint-disable-next-line no-console
    console.log("[contact] cmsId=", cms?.id, "status=", cms?.status, "sideAssetRef=", assetRef, "sideSrc=", resolvedSideImageSrc);
  }

  const media = cms?.contactMedia?.sideImage
    ? {
        sideImageSrc: resolvedSideImageSrc,
        sideImageAlt: cms.contactMedia?.sideImageAlt,
      }
    : undefined;

  return <ContactPageResponsive media={media} />;
}
