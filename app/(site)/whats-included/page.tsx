import path from "path";
import { readFile } from "fs/promises";

import { WhatsIncludedPage } from "@/sitePages/WhatsIncludedPage";
import { getWhatsIncludedPage } from "@/lib/contentPages/sanity";
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

export default async function Page() {
  let contentText = "";
  try {
    contentText = await readFile(path.join(process.cwd(), "assets", "whats_included_content.txt"), "utf8");
  } catch {
    contentText = [
      "BREADCRUMB:",
      "Main / What's included page",
      "",
      "PAGE TITLE:",
      "More Than a Plan. You're Buying a Service.",
      "",
      "VALUE PROP 1:",
      "Heading:",
      "Clarity at Every Step",
      "Body Text:",
      "You'll always know what you're getting—and what comes next.",
      "",
      "VALUE PROP 2:",
      "Heading:",
      "Pride in the Result",
      "Body Text:",
      "You deserve a home that's uniquely yours and a process that feels empowering, not exhausting.",
      "",
      "VALUE PROP 3:",
      "Heading:",
      "Relief from Overwhelm",
      "Body Text:",
      "We'll guide you through the process so you can move forward with confidence.",
      "",
      "SECTION TITLE:",
      "What's Included When You Choose House of Watkins",
      "",
      "SECTION TITLE:",
      "Our Promise to You",
      "",
      "SECTION TITLE:",
      "What's Not Included, and Why",
      "",
    ].join("\n");
  }

  const cms = await getWhatsIncludedPage();
  const visible = cms && isContentPageVisibleToRequest(cms);
  const media = visible
    ? {
        includedInteriorImageSrc: imageUrl(cms?.whatsIncludedMedia?.includedInteriorImage, 2400),
        includedInteriorImageAlt: cms?.whatsIncludedMedia?.includedInteriorImageAlt,
        includedWindowsImageSrc: imageUrl(cms?.whatsIncludedMedia?.includedWindowsImage, 1200),
        includedWindowsImageAlt: cms?.whatsIncludedMedia?.includedWindowsImageAlt,
        includedHomeImageSrc: imageUrl(cms?.whatsIncludedMedia?.includedHomeImage, 1600),
        includedHomeImageAlt: cms?.whatsIncludedMedia?.includedHomeImageAlt,
        includedPlanImageSrcs: [
          imageUrl(cms?.whatsIncludedMedia?.includedPlanImage01, 1600),
          imageUrl(cms?.whatsIncludedMedia?.includedPlanImage02, 1600),
          imageUrl(cms?.whatsIncludedMedia?.includedPlanImage03, 1600),
          imageUrl(cms?.whatsIncludedMedia?.includedPlanImage04, 1600),
          imageUrl(cms?.whatsIncludedMedia?.includedPlanImage05, 1600),
          imageUrl(cms?.whatsIncludedMedia?.includedPlanImage06, 1600),
        ],
        includedPlanImageAlts: [
          cms?.whatsIncludedMedia?.includedPlanImage01Alt,
          cms?.whatsIncludedMedia?.includedPlanImage02Alt,
          cms?.whatsIncludedMedia?.includedPlanImage03Alt,
          cms?.whatsIncludedMedia?.includedPlanImage04Alt,
          cms?.whatsIncludedMedia?.includedPlanImage05Alt,
          cms?.whatsIncludedMedia?.includedPlanImage06Alt,
        ],
        ctaCarouselImageSrcs: (Array.isArray(cms?.whatsIncludedMedia?.ctaCarouselImages)
          ? cms?.whatsIncludedMedia?.ctaCarouselImages
          : [])
          .slice(0, 8)
          .map((img: any) => imageUrl(img, 2400))
          .filter(Boolean) as string[],
      }
    : undefined;

  return (
    <WhatsIncludedPage contentText={contentText} media={media} />
  );
}
