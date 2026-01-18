export type HomePageHeroSlot = {
  headlineLine1?: string;
  headlineLine2?: string;
  subhead?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  heroImage?: unknown;
  heroImageAlt?: string;
  headshotImage?: unknown;
  headshotImageAlt?: string;
};

export type HomePageFeaturedPlansSlot = {
  enabled?: boolean;
  title?: string;
  planSlugs?: string[];
};

export type HomePageValuePropsSlot = {
  enabled?: boolean;
  title?: string;
  bullets?: string[];
};

export type HomePageConsultationCtaSlot = {
  enabled?: boolean;
  text?: string;
  buttonLabel?: string;
  buttonUrl?: string;
};

export type HomePageMediaSlots = {
  heroCarouselImages?: unknown[];
  heroMaskAsset?: unknown;
  heroMaskUrl?: string;
  tripleCarouselImages?: unknown[];
  welcomeCardBackgroundImage?: unknown;
  welcomeCardPortraitImage?: unknown;
  leadCaptureImage?: unknown;
  leadCaptureImageUrl?: string;
  leadCaptureImageAlt?: string;
};

export type HomePageSlots = {
  status: "draft" | "published";
  hero?: HomePageHeroSlot;
  media?: HomePageMediaSlots;
  featuredPlans?: HomePageFeaturedPlansSlot;
  valueProps?: HomePageValuePropsSlot;
  consultationCta?: HomePageConsultationCtaSlot;
  secretExtraIcon1?: unknown;
  secretExtraTitle1?: string;
  secretExtraBody1?: string;
  secretExtraIcon2?: unknown;
  secretExtraTitle2?: string;
  secretExtraBody2?: string;
  secretExtraIcon3?: unknown;
  secretExtraTitle3?: string;
  secretExtraBody3?: string;
};
