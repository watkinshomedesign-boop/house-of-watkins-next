import { defineField, defineType } from "sanity";

const statuses = ["draft", "published"] as const;

const PRESET_PROJECTS_BY_ID: Record<string, { title: string; slug: string; order?: number }> = {
  "portfolioProject.high-desert-contemporary": {
    title: "High Desert Contemporary",
    slug: "3-bedroom-contemporary-house-plan-with-ofice-and-casita-and-3-car-garage-portfolio-images",
    order: 1,
  },
  "portfolioProject.transitional-farmhouse": {
    title: "Transitional Farmhouse",
    slug: "4-bedroom-contemporary-house-plan-with-office-loft-and-3-car-side-load-garage-portfolio-images",
    order: 2,
  },
  "portfolioProject.farmhouse": {
    title: "Farmhouse",
    slug: "4-bedroom-3-bath-2-story-contemporary-farmhouse-house-plan-with-loft-with-office-with-4-car-garage-portfolio-images",
    order: 3,
  },
  "portfolioProject.narrow-lot-with-casita": {
    title: "Narrow Lot with Casita",
    slug: "3-bedroom-contemporary-house-plan-with-side-entrance-portfolio-images",
    order: 4,
  },
  "portfolioProject.contemporary-home": {
    title: "Contemporary Home",
    slug: "contemporary-2-story-4-bedroom-with-office-and-loft-house-plan-with-3-car-garage-portfolio-images",
    order: 5,
  },
  "portfolioProject.modern-home": {
    title: "Modern Home",
    slug: "3-bedroom-3-bath-modern-house-plan-with-3-car-garage-portfolio-images",
    order: 6,
  },
  "portfolioProject.classic-ranch": {
    title: "Classic Ranch",
    slug: "3-bedroom-3-bath-1-story-house-plan-with-office-with-3-car-garage-portfolio-images",
    order: 7,
  },
};

function presetForDocumentId(documentId: string | undefined) {
  if (!documentId) return undefined;
  const normalizedId = documentId.startsWith("drafts.") ? documentId.slice("drafts.".length) : documentId;
  return PRESET_PROJECTS_BY_ID[normalizedId];
}

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Portfolio Project",
  type: "document",
  initialValue: async (_params, context) => {
    const id = (context as any)?.documentId as string | undefined;
    const preset = presetForDocumentId(id);
    if (!preset) return { status: "published" };

    return {
      title: preset.title,
      slug: { _type: "slug", current: preset.slug },
      status: "published",
      order: preset.order,
    };
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: statuses.map((s) => ({ title: s, value: s })) },
      initialValue: "published",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear earlier",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "object",
          name: "portfolioImage",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
              fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
            }),
            defineField({ name: "alt", title: "Alt override", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "planDetailsUrl",
      title: "Plan details URL",
      type: "url",
    }),
    defineField({
      name: "oldSlugs",
      title: "Old slugs",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
