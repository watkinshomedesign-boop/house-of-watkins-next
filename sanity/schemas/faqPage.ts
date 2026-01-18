import { defineField, defineType } from "sanity";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
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
