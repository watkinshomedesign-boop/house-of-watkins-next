import type { TextStyleKey } from "@/lib/typography";
import type { TypographyPageKey, TypographyTemplateKey } from "@/lib/typographyRegistry";

export type TypographyContentAreaType = "style_only" | "rich_text";

export type TypographyContentAreaDescriptor = {
  key: string;
  label: string;
  type: TypographyContentAreaType;
  previewText: string;
  defaultStyle: TextStyleKey;
};

export const TEMPLATE_CONTENT_AREAS: Record<TypographyTemplateKey, TypographyContentAreaDescriptor[]> = {
  house_details: [
    {
      key: "house.hero.title",
      label: "Product title/heading",
      type: "style_only",
      previewText: "Mountain Retreat",
      defaultStyle: "Title/40",
    },
    {
      key: "house.overview.description",
      label: "Product description/body text",
      type: "style_only",
      previewText: "Description coming soon.",
      defaultStyle: "Body/15",
    },
    {
      key: "house.sidebar.spec_label",
      label: "Specification labels",
      type: "style_only",
      previewText: "Total Area",
      defaultStyle: "Body/13",
    },
    {
      key: "house.sidebar.spec_value",
      label: "Specification values",
      type: "style_only",
      previewText: "1,420 Sq Ft",
      defaultStyle: "Title/13",
    },
  ],
  portfolio_project: [
    {
      key: "portfolio.title",
      label: "Project title",
      type: "style_only",
      previewText: "High Desert Contemporary",
      defaultStyle: "Title/40",
    },
  ],
};

export const PAGE_CONTENT_AREAS: Partial<Record<TypographyPageKey, TypographyContentAreaDescriptor[]>> = {
  home: [],
  about: [],
  contact: [],
  faq: [],
  catalog: [],
  house_plans: [],
  portfolio_index: [],
};
