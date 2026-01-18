export type SitePageStatus = "draft" | "published";

export type SitePageType =
  | "home"
  | "about"
  | "contact"
  | "faq"
  | "whats-included"
  | "contractors"
  | "privacy"
  | "terms"
  | "error"
  | "custom";

export type SitePage = {
  id: string;
  title: string;
  slug: string;
  status: SitePageStatus;
  pageType: SitePageType;
  oldSlugs?: string[];
  hero?: {
    headline?: string;
    subhead?: string;
    image?: unknown;
    ctaText?: string;
    ctaHref?: string;
  };
  content?: any[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: unknown;
};

export type SiteSettings = {
  newsletterCtaText?: string;
  hubspotBookingLink?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultOgImage?: unknown;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    pinterest?: string;
    instagram?: string;
  };
};
