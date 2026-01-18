import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";
import type { HomePageSlots } from "@/lib/homePage/types";

const HOME_FIELDS = `{
  status,
  hero {
    headlineLine1,
    headlineLine2,
    subhead,
    ctaLabel,
    ctaUrl,
    heroImage,
    heroImageAlt,
    headshotImage,
    headshotImageAlt
  },
  heroCarouselImages,
  heroMaskAsset {
    asset->{
      url
    }
  },
  tripleCarouselImages,
  welcomeCardBackgroundImage,
  welcomeCardPortraitImage,
  featuredPlans {
    enabled,
    title,
    planSlugs
  },
  valueProps {
    enabled,
    title,
    bullets
  },
  consultationCta {
    enabled,
    text,
    buttonLabel,
    buttonUrl
  },
  leadCaptureImage,
  "leadCaptureImageUrl": leadCaptureImage.asset->url,
  leadCaptureImageAlt,
  secretExtraIcon1,
  secretExtraTitle1,
  secretExtraBody1,
  secretExtraIcon2,
  secretExtraTitle2,
  secretExtraBody2,
  secretExtraIcon3,
  secretExtraTitle3,
  secretExtraBody3
}`;

export async function getHomePageSlots(): Promise<HomePageSlots | null> {
  if (!hasSanity()) return null;
  const client = getServerSanityClient();
  const row = await client.fetch(`*[_type == "homePage"][0] ${HOME_FIELDS}`);
  if (!row) return null;

  return {
    status: row.status === "published" ? "published" : "draft",
    hero: row.hero ?? undefined,
    media: {
      heroCarouselImages: Array.isArray(row.heroCarouselImages) ? row.heroCarouselImages : undefined,
      heroMaskAsset: row.heroMaskAsset ?? undefined,
      heroMaskUrl: row?.heroMaskAsset?.asset?.url ? String(row.heroMaskAsset.asset.url) : undefined,
      tripleCarouselImages: Array.isArray(row.tripleCarouselImages) ? row.tripleCarouselImages : undefined,
      welcomeCardBackgroundImage: row.welcomeCardBackgroundImage ?? undefined,
      welcomeCardPortraitImage: row.welcomeCardPortraitImage ?? undefined,
      leadCaptureImage: row.leadCaptureImage ?? undefined,
      leadCaptureImageUrl: row.leadCaptureImageUrl ? String(row.leadCaptureImageUrl) : undefined,
      leadCaptureImageAlt: row.leadCaptureImageAlt ?? undefined,
    },
    featuredPlans: row.featuredPlans ?? undefined,
    valueProps: row.valueProps ?? undefined,
    consultationCta: row.consultationCta ?? undefined,
    secretExtraIcon1: row.secretExtraIcon1 ?? undefined,
    secretExtraTitle1: row.secretExtraTitle1 ?? undefined,
    secretExtraBody1: row.secretExtraBody1 ?? undefined,
    secretExtraIcon2: row.secretExtraIcon2 ?? undefined,
    secretExtraTitle2: row.secretExtraTitle2 ?? undefined,
    secretExtraBody2: row.secretExtraBody2 ?? undefined,
    secretExtraIcon3: row.secretExtraIcon3 ?? undefined,
    secretExtraTitle3: row.secretExtraTitle3 ?? undefined,
    secretExtraBody3: row.secretExtraBody3 ?? undefined,
  } as HomePageSlots;
}
