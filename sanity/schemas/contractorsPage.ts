import { defineField, defineType } from "sanity";

export const contractorsPage = defineType({
  name: "contractorsPage",
  title: "Contractors Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "provideImage03",
      title: "What we provide image 03",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "provideImage03Alt", title: "What we provide image 03 alt", type: "string" }),
    defineField({
      name: "provideImage06",
      title: "What we provide image 06",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "provideImage06Alt", title: "What we provide image 06 alt", type: "string" }),
    defineField({
      name: "provideImage09",
      title: "What we provide image 09",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "provideImage09Alt", title: "What we provide image 09 alt", type: "string" }),
    defineField({
      name: "featureIcon",
      title: "Key features icon",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "featureIconAlt", title: "Key features icon alt", type: "string" }),
    defineField({
      name: "videoPosterImage",
      title: "Video poster image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "videoPosterImageAlt", title: "Video poster image alt", type: "string" }),
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
