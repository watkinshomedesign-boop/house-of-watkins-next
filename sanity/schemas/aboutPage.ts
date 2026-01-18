import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "heroImageAlt", title: "Hero image alt", type: "string" }),
    defineField({
      name: "houseWideImage",
      title: "House wide image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "houseWideImageAlt", title: "House wide image alt", type: "string" }),
    defineField({
      name: "teamImage1",
      title: "Team image 1",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "teamImage1Alt", title: "Team image 1 alt", type: "string" }),
    defineField({
      name: "teamImage2",
      title: "Team image 2",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "teamImage2Alt", title: "Team image 2 alt", type: "string" }),
    defineField({
      name: "teamImage3",
      title: "Team image 3",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "teamImage3Alt", title: "Team image 3 alt", type: "string" }),
    defineField({
      name: "ctaHouseImage",
      title: "CTA house image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "ctaHouseImageAlt", title: "CTA house image alt", type: "string" }),
    defineField({
      name: "blueprintImage",
      title: "Blueprint image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "blueprintImageAlt", title: "Blueprint image alt", type: "string" }),
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
