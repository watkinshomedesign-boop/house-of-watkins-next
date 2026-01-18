import { defineField, defineType } from "sanity";

export const whatsIncludedPage = defineType({
  name: "whatsIncludedPage",
  title: "What's Included Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "includedInteriorImage",
      title: "Included interior image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedInteriorImageAlt", title: "Included interior image alt", type: "string" }),
    defineField({
      name: "includedWindowsImage",
      title: "Included windows image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedWindowsImageAlt", title: "Included windows image alt", type: "string" }),
    defineField({
      name: "includedHomeImage",
      title: "Included home image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedHomeImageAlt", title: "Included home image alt", type: "string" }),
    defineField({
      name: "includedPlanImage01",
      title: "Included plan image 01",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedPlanImage01Alt", title: "Included plan image 01 alt", type: "string" }),
    defineField({
      name: "includedPlanImage02",
      title: "Included plan image 02",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedPlanImage02Alt", title: "Included plan image 02 alt", type: "string" }),
    defineField({
      name: "includedPlanImage03",
      title: "Included plan image 03",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedPlanImage03Alt", title: "Included plan image 03 alt", type: "string" }),
    defineField({
      name: "includedPlanImage04",
      title: "Included plan image 04",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedPlanImage04Alt", title: "Included plan image 04 alt", type: "string" }),
    defineField({
      name: "includedPlanImage05",
      title: "Included plan image 05",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedPlanImage05Alt", title: "Included plan image 05 alt", type: "string" }),
    defineField({
      name: "includedPlanImage06",
      title: "Included plan image 06",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "includedPlanImage06Alt", title: "Included plan image 06 alt", type: "string" }),
    defineField({
      name: "ctaCarouselImages",
      title: "CTA carousel images (8)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "pageSection" }],
    }),
  ],
});
