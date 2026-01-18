export type ContentStatus = "draft" | "published";

export type PageSection = {
  title?: string;
  content?: any[];
};

export type AboutPageMedia = {
  heroImage?: any;
  heroImageAlt?: string;
  houseWideImage?: any;
  houseWideImageAlt?: string;
  teamImage1?: any;
  teamImage1Alt?: string;
  teamImage2?: any;
  teamImage2Alt?: string;
  teamImage3?: any;
  teamImage3Alt?: string;
  ctaHouseImage?: any;
  ctaHouseImageAlt?: string;
  blueprintImage?: any;
  blueprintImageAlt?: string;
};

export type ContactPageMedia = {
  sideImage?: any;
  sideImageAlt?: string;
};

export type HousePlansPageMedia = {
  headerTitle?: string;
  headerDescription?: string;
  searchIcon?: any;
  searchIconAlt?: string;
};

export type PortfolioIndexPageMedia = {
  portfolioImage1?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage2?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage3?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage4?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage5?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage6?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage7?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioImage8?: { projectSlug?: string; projectTitle?: string; image?: any; imageUrl?: string; imageAlt?: string };
  portfolioParentImage1?: any;
  portfolioParentImage1Url?: string;
  portfolioParentImage2?: any;
  portfolioParentImage2Url?: string;
  portfolioParentImage3?: any;
  portfolioParentImage3Url?: string;
  portfolioParentImage4?: any;
  portfolioParentImage4Url?: string;
  portfolioParentImage5?: any;
  portfolioParentImage5Url?: string;
  portfolioParentImage6?: any;
  portfolioParentImage6Url?: string;
  portfolioParentImage7?: any;
  portfolioParentImage7Url?: string;
  portfolioParentImage8?: any;
  portfolioParentImage8Url?: string;
  portfolioParentImage9?: any;
  portfolioParentImage9Url?: string;
  portfolioParentImage10?: any;
  portfolioParentImage10Url?: string;
};

export type ContractorsPageMedia = {
  provideImage03?: any;
  provideImage03Alt?: string;
  provideImage06?: any;
  provideImage06Alt?: string;
  provideImage09?: any;
  provideImage09Alt?: string;
  featureIcon?: any;
  featureIconAlt?: string;
  videoPosterImage?: any;
  videoPosterImageAlt?: string;
};

export type WhatsIncludedPageMedia = {
  includedInteriorImage?: any;
  includedInteriorImageAlt?: string;
  includedWindowsImage?: any;
  includedWindowsImageAlt?: string;
  includedHomeImage?: any;
  includedHomeImageAlt?: string;
  includedPlanImage01?: any;
  includedPlanImage01Alt?: string;
  includedPlanImage02?: any;
  includedPlanImage02Alt?: string;
  includedPlanImage03?: any;
  includedPlanImage03Alt?: string;
  includedPlanImage04?: any;
  includedPlanImage04Alt?: string;
  includedPlanImage05?: any;
  includedPlanImage05Alt?: string;
  includedPlanImage06?: any;
  includedPlanImage06Alt?: string;
  ctaCarouselImages?: any[];
};

export type ContentPage = {
  id?: string;
  title: string;
  status: ContentStatus;
  sections: PageSection[];
  aboutMedia?: AboutPageMedia;
  contactMedia?: ContactPageMedia;
  housePlansMedia?: HousePlansPageMedia;
  portfolioIndexMedia?: PortfolioIndexPageMedia;
  contractorsMedia?: ContractorsPageMedia;
  whatsIncludedMedia?: WhatsIncludedPageMedia;
};
