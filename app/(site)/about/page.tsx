import { AboutPageResponsive } from "@/sitePages/AboutPageResponsive.client";
import type { Metadata } from "next";
import { getAboutPage } from "@/lib/contentPages/sanity";
import { isContentPageVisibleToRequest } from "@/lib/contentPages/visibility";
import { urlForImage } from "@/lib/sanity/image";

function imageUrl(source: unknown, width: number) {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(width).fit("max").url();
  } catch {
    return undefined;
  }
}

export function generateMetadata(): Metadata {
  return {
    title: "About Us | House of Watkins",
    description:
      "Meet House of Watkins and learn how we turn ideas into permit-ready house plans with a thoughtful, eco-friendly design process.",
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

  return (
    <AboutPageResponsive media={media} />
  );
}
