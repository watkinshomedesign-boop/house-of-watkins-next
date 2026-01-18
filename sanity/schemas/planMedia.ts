import { defineField, defineType } from "sanity";

export const planMedia = defineType({
  name: "planMedia",
  title: "Plan Media",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Plan name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "planSlug",
      title: "Plan slug (Supabase)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "frontThumbnail",
      title: "Front thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "planThumbnail",
      title: "Plan thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "buildFeatureExterior",
      title: "Build tab image: Exterior feature",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "buildFeatureFloorplan",
      title: "Build tab image: Floorplan feature",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        },
      ],
    }),
    defineField({
      name: "floorplans",
      title: "Floor plan images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      planSlug: "planSlug",
    },
    prepare(selection) {
      const planSlug = String((selection as any).planSlug || "").trim();
      const subtitle = planSlug ? `/house/${planSlug}` : "(missing slug)";
      return { title: (selection as any).title, subtitle };
    },
  },
});
