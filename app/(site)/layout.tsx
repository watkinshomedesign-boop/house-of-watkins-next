import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { ExitPreviewButton } from "@/components/ExitPreviewButton";
import { SiteIntegrations } from "@/components/integrations/SiteIntegrations";
import { getSiteSettings } from "@/lib/sitePages/sanity";
import { urlForImage } from "@/lib/sanity/image";

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com"; // Fallback domain
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const baseUrl = await getSiteUrl();

  const title = siteSettings?.defaultSeoTitle?.trim() || "House of Watkins | Custom House Plans & Design";
  const description =
    siteSettings?.defaultSeoDescription?.trim() ||
    "Discover custom house plans and architectural designs from House of Watkins. Browse our collection of unique home designs.";

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
    title: {
      default: title,
      template: "%s | House of Watkins",
    },
    description,
    metadataBase: new URL(baseUrl),
    verification: {
      google: "hK8DGctfudOnPxMIbjrNKWqrJPk1L5klr0tEPP4a5Go",
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const dm = draftMode();
  return (
    <>
      <SiteIntegrations />
      {children}
      {dm.isEnabled ? <ExitPreviewButton /> : null}
    </>
  );
}
