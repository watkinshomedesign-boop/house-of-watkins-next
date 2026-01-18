import { defineField, defineType } from "sanity";

export const housePlansPage = defineType({
  name: "housePlansPage",
  title: "House Plans Page",
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
    defineField({ name: "headerTitle", title: "Header title", type: "string" }),
    defineField({ name: "headerDescription", title: "Header description", type: "text" }),
    defineField({ name: "searchIcon", title: "Search icon", type: "image", options: { hotspot: true } }),
    defineField({ name: "searchIconAlt", title: "Search icon alt", type: "string" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "pageSection" }],
    }),
  ],
});
