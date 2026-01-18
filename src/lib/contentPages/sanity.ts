import { getServerSanityClient, getServerSanityClientPreferDrafts, hasSanity } from "@/lib/sanity/serverClient";
import type { ContentPage } from "@/lib/contentPages/types";

const PAGE_FIELDS = `{
  _id,
  title,
  status,
  provideImage03,
  "provideImage03Url": provideImage03.asset->url,
  provideImage03Alt,
  provideImage06,
  "provideImage06Url": provideImage06.asset->url,
  provideImage06Alt,
  provideImage09,
  "provideImage09Url": provideImage09.asset->url,
  provideImage09Alt,
  featureIcon,
  "featureIconUrl": featureIcon.asset->url,
  featureIconAlt,
  videoPosterImage,
  "videoPosterImageUrl": videoPosterImage.asset->url,
  videoPosterImageAlt,
  includedInteriorImage,
  "includedInteriorImageUrl": includedInteriorImage.asset->url,
  includedInteriorImageAlt,
  includedWindowsImage,
  "includedWindowsImageUrl": includedWindowsImage.asset->url,
  includedWindowsImageAlt,
  includedHomeImage,
  "includedHomeImageUrl": includedHomeImage.asset->url,
  includedHomeImageAlt,
  includedPlanImage01,
  "includedPlanImage01Url": includedPlanImage01.asset->url,
  includedPlanImage01Alt,
  includedPlanImage02,
  "includedPlanImage02Url": includedPlanImage02.asset->url,
  includedPlanImage02Alt,
  includedPlanImage03,
  "includedPlanImage03Url": includedPlanImage03.asset->url,
  includedPlanImage03Alt,
  includedPlanImage04,
  "includedPlanImage04Url": includedPlanImage04.asset->url,
  includedPlanImage04Alt,
  includedPlanImage05,
  "includedPlanImage05Url": includedPlanImage05.asset->url,
  includedPlanImage05Alt,
  includedPlanImage06,
  "includedPlanImage06Url": includedPlanImage06.asset->url,
  includedPlanImage06Alt,
  ctaCarouselImages,
  headerTitle,
  headerDescription,
  searchIcon,
  searchIconAlt,
  heroImage,
  "heroImageUrl": heroImage.asset->url,
  heroImageAlt,
  houseWideImage,
  "houseWideImageUrl": houseWideImage.asset->url,
  houseWideImageAlt,
  teamImage1,
  "teamImage1Url": teamImage1.asset->url,
  teamImage1Alt,
  teamImage2,
  "teamImage2Url": teamImage2.asset->url,
  teamImage2Alt,
  teamImage3,
  "teamImage3Url": teamImage3.asset->url,
  teamImage3Alt,
  ctaHouseImage,
  "ctaHouseImageUrl": ctaHouseImage.asset->url,
  ctaHouseImageAlt,
  blueprintImage,
  "blueprintImageUrl": blueprintImage.asset->url,
  blueprintImageAlt,
  sideImage,
  "sideImageUrl": sideImage.asset->url,
  sideImageAlt,
  portfolioParentImage1,
  "portfolioParentImage1Url": portfolioParentImage1.asset->url,
  portfolioParentImage2,
  "portfolioParentImage2Url": portfolioParentImage2.asset->url,
  portfolioParentImage3,
  "portfolioParentImage3Url": portfolioParentImage3.asset->url,
  portfolioParentImage4,
  "portfolioParentImage4Url": portfolioParentImage4.asset->url,
  portfolioParentImage5,
  "portfolioParentImage5Url": portfolioParentImage5.asset->url,
  portfolioParentImage6,
  "portfolioParentImage6Url": portfolioParentImage6.asset->url,
  portfolioParentImage7,
  "portfolioParentImage7Url": portfolioParentImage7.asset->url,
  portfolioParentImage8,
  "portfolioParentImage8Url": portfolioParentImage8.asset->url,
  portfolioParentImage9,
  "portfolioParentImage9Url": portfolioParentImage9.asset->url,
  portfolioParentImage10,
  "portfolioParentImage10Url": portfolioParentImage10.asset->url,
  "image01": {
    "projectSlug": image01.project->slug.current,
    "projectTitle": image01.project->title,
    "image": image01.image,
    "imageAlt": coalesce(image01.alt, image01.project->title)
  },
  "image02": {
    "projectSlug": image02.project->slug.current,
    "projectTitle": image02.project->title,
    "image": image02.image,
    "imageAlt": coalesce(image02.alt, image02.project->title)
  },
  "image03": {
    "projectSlug": image03.project->slug.current,
    "projectTitle": image03.project->title,
    "image": image03.image,
    "imageAlt": coalesce(image03.alt, image03.project->title)
  },
  "image04": {
    "projectSlug": image04.project->slug.current,
    "projectTitle": image04.project->title,
    "image": image04.image,
    "imageAlt": coalesce(image04.alt, image04.project->title)
  },
  "image05": {
    "projectSlug": image05.project->slug.current,
    "projectTitle": image05.project->title,
    "image": image05.image,
    "imageAlt": coalesce(image05.alt, image05.project->title)
  },
  "image06": {
    "projectSlug": image06.project->slug.current,
    "projectTitle": image06.project->title,
    "image": image06.image,
    "imageAlt": coalesce(image06.alt, image06.project->title)
  },
  "image07": {
    "projectSlug": image07.project->slug.current,
    "projectTitle": image07.project->title,
    "image": image07.image,
    "imageAlt": coalesce(image07.alt, image07.project->title)
  },
  "image08": {
    "projectSlug": image08.project->slug.current,
    "projectTitle": image08.project->title,
    "image": image08.image,
    "imageAlt": coalesce(image08.alt, image08.project->title)
  },
  "portfolioImage1": {
    "projectSlug": portfolioImage1.project->slug.current,
    "projectTitle": portfolioImage1.project->title,
    "image": portfolioImage1.image,
    "imageUrl": portfolioImage1.image.asset->url,
    "imageAlt": coalesce(portfolioImage1.alt, portfolioImage1.project->title)
  },
  "portfolioImage2": {
    "projectSlug": portfolioImage2.project->slug.current,
    "projectTitle": portfolioImage2.project->title,
    "image": portfolioImage2.image,
    "imageUrl": portfolioImage2.image.asset->url,
    "imageAlt": coalesce(portfolioImage2.alt, portfolioImage2.project->title)
  },
  "portfolioImage3": {
    "projectSlug": portfolioImage3.project->slug.current,
    "projectTitle": portfolioImage3.project->title,
    "image": portfolioImage3.image,
    "imageUrl": portfolioImage3.image.asset->url,
    "imageAlt": coalesce(portfolioImage3.alt, portfolioImage3.project->title)
  },
  "portfolioImage4": {
    "projectSlug": portfolioImage4.project->slug.current,
    "projectTitle": portfolioImage4.project->title,
    "image": portfolioImage4.image,
    "imageUrl": portfolioImage4.image.asset->url,
    "imageAlt": coalesce(portfolioImage4.alt, portfolioImage4.project->title)
  },
  "portfolioImage5": {
    "projectSlug": portfolioImage5.project->slug.current,
    "projectTitle": portfolioImage5.project->title,
    "image": portfolioImage5.image,
    "imageUrl": portfolioImage5.image.asset->url,
    "imageAlt": coalesce(portfolioImage5.alt, portfolioImage5.project->title)
  },
  "portfolioImage6": {
    "projectSlug": portfolioImage6.project->slug.current,
    "projectTitle": portfolioImage6.project->title,
    "image": portfolioImage6.image,
    "imageUrl": portfolioImage6.image.asset->url,
    "imageAlt": coalesce(portfolioImage6.alt, portfolioImage6.project->title)
  },
  "portfolioImage7": {
    "projectSlug": portfolioImage7.project->slug.current,
    "projectTitle": portfolioImage7.project->title,
    "image": portfolioImage7.image,
    "imageUrl": portfolioImage7.image.asset->url,
    "imageAlt": coalesce(portfolioImage7.alt, portfolioImage7.project->title)
  },
  "portfolioImage8": {
    "projectSlug": portfolioImage8.project->slug.current,
    "projectTitle": portfolioImage8.project->title,
    "image": portfolioImage8.image,
    "imageUrl": portfolioImage8.image.asset->url,
    "imageAlt": coalesce(portfolioImage8.alt, portfolioImage8.project->title)
  },
  sections[] {
    title,
    content[] {
      ...,
      _type == "videoBlock" => {
        ...,
        "videoFileAsset": videoFile.asset-> { url }
      }
    }
  }
}`;

async function getSingleton(type: string, options?: { preferDrafts?: boolean }): Promise<ContentPage | null> {
  if (!hasSanity()) return null;
  const client = options?.preferDrafts ? getServerSanityClientPreferDrafts() : getServerSanityClient();
  const id = type;
  const row = await client.fetch(
    `coalesce(*[_type == $type && _id == $id][0], *[_type == $type] | order(_updatedAt desc)[0]) ${PAGE_FIELDS}`,
    { type, id },
  );
  if (!row) return null;
  return {
    id: row._id ?? undefined,
    title: row.title ?? "",
    status: row.status === "published" ? "published" : "draft",
    sections: Array.isArray(row.sections) ? row.sections : [],
    aboutMedia:
      type === "aboutPage"
        ? {
            heroImage: row.heroImageUrl ?? row.heroImage ?? undefined,
            heroImageAlt: row.heroImageAlt ?? undefined,
            houseWideImage: row.houseWideImageUrl ?? row.houseWideImage ?? undefined,
            houseWideImageAlt: row.houseWideImageAlt ?? undefined,
            teamImage1: row.teamImage1Url ?? row.teamImage1 ?? undefined,
            teamImage1Alt: row.teamImage1Alt ?? undefined,
            teamImage2: row.teamImage2Url ?? row.teamImage2 ?? undefined,
            teamImage2Alt: row.teamImage2Alt ?? undefined,
            teamImage3: row.teamImage3Url ?? row.teamImage3 ?? undefined,
            teamImage3Alt: row.teamImage3Alt ?? undefined,
            ctaHouseImage: row.ctaHouseImageUrl ?? row.ctaHouseImage ?? undefined,
            ctaHouseImageAlt: row.ctaHouseImageAlt ?? undefined,
            blueprintImage: row.blueprintImageUrl ?? row.blueprintImage ?? undefined,
            blueprintImageAlt: row.blueprintImageAlt ?? undefined,
          }
        : undefined,
    contactMedia:
      type === "contactPage"
        ? {
            sideImage: row.sideImage ?? row.sideImageUrl ?? undefined,
            sideImageAlt: row.sideImageAlt ?? undefined,
          }
        : undefined,
    housePlansMedia:
      type === "housePlansPage"
        ? {
            headerTitle: row.headerTitle ?? undefined,
            headerDescription: row.headerDescription ?? undefined,
            searchIcon: row.searchIcon ?? undefined,
            searchIconAlt: row.searchIconAlt ?? undefined,
          }
        : undefined,
    portfolioIndexMedia:
      type === "portfolioIndexPage"
        ? {
            portfolioImage1: row.portfolioImage1 ?? row.image01 ?? undefined,
            portfolioImage2: row.portfolioImage2 ?? row.image02 ?? undefined,
            portfolioImage3: row.portfolioImage3 ?? row.image03 ?? undefined,
            portfolioImage4: row.portfolioImage4 ?? row.image04 ?? undefined,
            portfolioImage5: row.portfolioImage5 ?? row.image05 ?? undefined,
            portfolioImage6: row.portfolioImage6 ?? row.image06 ?? undefined,
            portfolioImage7: row.portfolioImage7 ?? row.image07 ?? undefined,
            portfolioImage8: row.portfolioImage8 ?? row.image08 ?? undefined,
            portfolioParentImage1: row.portfolioParentImage1 ?? undefined,
            portfolioParentImage1Url: row.portfolioParentImage1Url ?? undefined,
            portfolioParentImage2: row.portfolioParentImage2 ?? undefined,
            portfolioParentImage2Url: row.portfolioParentImage2Url ?? undefined,
            portfolioParentImage3: row.portfolioParentImage3 ?? undefined,
            portfolioParentImage3Url: row.portfolioParentImage3Url ?? undefined,
            portfolioParentImage4: row.portfolioParentImage4 ?? undefined,
            portfolioParentImage4Url: row.portfolioParentImage4Url ?? undefined,
            portfolioParentImage5: row.portfolioParentImage5 ?? undefined,
            portfolioParentImage5Url: row.portfolioParentImage5Url ?? undefined,
            portfolioParentImage6: row.portfolioParentImage6 ?? undefined,
            portfolioParentImage6Url: row.portfolioParentImage6Url ?? undefined,
            portfolioParentImage7: row.portfolioParentImage7 ?? undefined,
            portfolioParentImage7Url: row.portfolioParentImage7Url ?? undefined,
            portfolioParentImage8: row.portfolioParentImage8 ?? undefined,
            portfolioParentImage8Url: row.portfolioParentImage8Url ?? undefined,
            portfolioParentImage9: row.portfolioParentImage9 ?? undefined,
            portfolioParentImage9Url: row.portfolioParentImage9Url ?? undefined,
            portfolioParentImage10: row.portfolioParentImage10 ?? undefined,
            portfolioParentImage10Url: row.portfolioParentImage10Url ?? undefined,
          }
        : undefined,
    contractorsMedia:
      type === "contractorsPage"
        ? {
            provideImage03: row.provideImage03Url ?? row.provideImage03 ?? undefined,
            provideImage03Alt: row.provideImage03Alt ?? undefined,
            provideImage06: row.provideImage06Url ?? row.provideImage06 ?? undefined,
            provideImage06Alt: row.provideImage06Alt ?? undefined,
            provideImage09: row.provideImage09Url ?? row.provideImage09 ?? undefined,
            provideImage09Alt: row.provideImage09Alt ?? undefined,
            featureIcon: row.featureIconUrl ?? row.featureIcon ?? undefined,
            featureIconAlt: row.featureIconAlt ?? undefined,
            videoPosterImage: row.videoPosterImageUrl ?? row.videoPosterImage ?? undefined,
            videoPosterImageAlt: row.videoPosterImageAlt ?? undefined,
          }
        : undefined,
    whatsIncludedMedia:
      type === "whatsIncludedPage"
        ? {
            includedInteriorImage: row.includedInteriorImageUrl ?? row.includedInteriorImage ?? undefined,
            includedInteriorImageAlt: row.includedInteriorImageAlt ?? undefined,
            includedWindowsImage: row.includedWindowsImageUrl ?? row.includedWindowsImage ?? undefined,
            includedWindowsImageAlt: row.includedWindowsImageAlt ?? undefined,
            includedHomeImage: row.includedHomeImageUrl ?? row.includedHomeImage ?? undefined,
            includedHomeImageAlt: row.includedHomeImageAlt ?? undefined,
            includedPlanImage01: row.includedPlanImage01Url ?? row.includedPlanImage01 ?? undefined,
            includedPlanImage01Alt: row.includedPlanImage01Alt ?? undefined,
            includedPlanImage02: row.includedPlanImage02Url ?? row.includedPlanImage02 ?? undefined,
            includedPlanImage02Alt: row.includedPlanImage02Alt ?? undefined,
            includedPlanImage03: row.includedPlanImage03Url ?? row.includedPlanImage03 ?? undefined,
            includedPlanImage03Alt: row.includedPlanImage03Alt ?? undefined,
            includedPlanImage04: row.includedPlanImage04Url ?? row.includedPlanImage04 ?? undefined,
            includedPlanImage04Alt: row.includedPlanImage04Alt ?? undefined,
            includedPlanImage05: row.includedPlanImage05Url ?? row.includedPlanImage05 ?? undefined,
            includedPlanImage05Alt: row.includedPlanImage05Alt ?? undefined,
            includedPlanImage06: row.includedPlanImage06Url ?? row.includedPlanImage06 ?? undefined,
            includedPlanImage06Alt: row.includedPlanImage06Alt ?? undefined,
            ctaCarouselImages: Array.isArray(row.ctaCarouselImages) ? row.ctaCarouselImages : undefined,
          }
        : undefined,
  } as ContentPage;
}

export const getHomePage = () => getSingleton("homePage");
export const getAboutPage = () => getSingleton("aboutPage");
export const getPortfolioIndexPage = () => getSingleton("portfolioIndexPage");
export const getHousePlansPage = () => getSingleton("housePlansPage");
export const getFaqPage = () => getSingleton("faqPage");
export const getWhatsIncludedPage = () => getSingleton("whatsIncludedPage");
export const getContractorsPage = () => getSingleton("contractorsPage");
export const getContactPage = () => getSingleton("contactPage", { preferDrafts: true });
