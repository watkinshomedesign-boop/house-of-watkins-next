export type TypographyTemplateKey = "house_details" | "portfolio_project";

export type TypographyPageKey =
  | "home"
  | "about"
  | "contact"
  | "faq"
  | "catalog"
  | "house_plans"
  | "portfolio_index";

export type TypographyTemplateDescriptor = {
  templateKey: TypographyTemplateKey;
  label: string;
  instancesCount: number | null;
};

export type TypographyPageDescriptor = {
  pageKey: TypographyPageKey;
  label: string;
};

export const TYPOGRAPHY_TEMPLATES: TypographyTemplateDescriptor[] = [
  { templateKey: "house_details", label: "House Details Template", instancesCount: 70 },
  { templateKey: "portfolio_project", label: "Portfolio Template", instancesCount: null },
];

export const TYPOGRAPHY_PAGES: TypographyPageDescriptor[] = [
  { pageKey: "home", label: "Home" },
  { pageKey: "about", label: "About" },
  { pageKey: "contact", label: "Contact" },
  { pageKey: "faq", label: "FAQ" },
  { pageKey: "catalog", label: "Catalog" },
  { pageKey: "house_plans", label: "House Plans" },
  { pageKey: "portfolio_index", label: "Portfolio Index" },
];
