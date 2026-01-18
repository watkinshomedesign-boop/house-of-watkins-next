import { defineField, defineType } from "sanity";

const categories = [
  "Design Ideas",
  "Building Tips",
  "Product Reviews",
  "Case Studies",
  "Inspiration",
];

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text" }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: categories },
      validation: (r) => r.required(),
    }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
    defineField({ name: "readTimeMinutes", title: "Read time (minutes)", type: "number" }),
    defineField({ name: "isPopular", title: "Popular post", type: "boolean", initialValue: false }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "H2", value: "h2" }, { title: "H3", value: "h3" }], lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }] },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({
              name: "alignment",
              title: "Alignment",
              type: "string",
              options: { list: ["left", "center", "right"], layout: "radio" },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: { list: ["small", "medium", "large", "full"], layout: "radio" },
              initialValue: "large",
            }),
          ],
        },
        {
          name: "videoEmbed",
          title: "Video embed",
          type: "object",
          fields: [
            defineField({ name: "url", title: "URL", type: "url", validation: (r) => r.required() }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
        {
          name: "twoColumn",
          title: "Two column",
          type: "object",
          fields: [
            defineField({
              name: "left",
              title: "Left column",
              type: "array",
              of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" })] }],
            }),
            defineField({
              name: "right",
              title: "Right column",
              type: "array",
              of: [{ type: "block" }, { type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" })] }],
            }),
          ],
        },
      ],
    }),
  ],
});
