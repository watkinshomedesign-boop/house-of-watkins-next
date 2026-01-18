import { defineField, defineType } from "sanity";

export const sitePage = defineType({
  name: "sitePage",
  title: "Site Page",
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
      name: "pageType",
      title: "Page Type",
      type: "string",
      initialValue: "custom",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "About", value: "about" },
          { title: "Contact", value: "contact" },
          { title: "FAQ", value: "faq" },
          { title: "What's Included", value: "whats-included" },
          { title: "Contractors", value: "contractors" },
          { title: "Privacy", value: "privacy" },
          { title: "Terms", value: "terms" },
          { title: "Error", value: "error" },
          { title: "Custom", value: "custom" },
        ],
      },
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
      name: "oldSlugs",
      title: "Old slugs (for redirects)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subhead", title: "Subhead", type: "text", rows: 3 }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
        defineField({ name: "ctaText", title: "CTA text", type: "string" }),
        defineField({ name: "ctaHref", title: "CTA href", type: "string" }),
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          name: "imageBlock",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({
              name: "alignment",
              title: "Alignment",
              type: "string",
              initialValue: "center",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Center", value: "center" },
                  { title: "Right", value: "right" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "width",
              title: "Width",
              type: "string",
              initialValue: "lg",
              options: {
                list: [
                  { title: "Small", value: "sm" },
                  { title: "Medium", value: "md" },
                  { title: "Large", value: "lg" },
                  { title: "Full", value: "full" },
                ],
                layout: "radio",
              },
            }),
          ],
        },
        { type: "videoBlock" },
        {
          name: "columnsBlock",
          title: "Columns",
          type: "object",
          fields: [
            defineField({ name: "left", title: "Left column", type: "array", of: [{ type: "block" }, { type: "image" }] }),
            defineField({ name: "right", title: "Right column", type: "array", of: [{ type: "block" }, { type: "image" }] }),
          ],
        },
        {
          name: "ctaBlock",
          title: "Call to action",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              initialValue: "primary",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                ],
                layout: "radio",
              },
            }),
          ],
        },
        {
          name: "spacerBlock",
          title: "Spacer",
          type: "object",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              initialValue: "md",
              options: {
                list: [
                  { title: "Small", value: "sm" },
                  { title: "Medium", value: "md" },
                  { title: "Large", value: "lg" },
                ],
                layout: "radio",
              },
            }),
          ],
        },
        {
          name: "quoteBlock",
          title: "Quote",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "text", rows: 4, validation: (r) => r.required() }),
            defineField({ name: "author", title: "Author", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
    defineField({
      name: "ogImage",
      title: "OG image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      slug: "slug.current",
    },
    prepare(selection) {
      const status = selection.status === "published" ? "Published" : "Draft";
      const path = selection.slug ? `/${selection.slug}` : "(no slug)";
      return { title: selection.title, subtitle: `${status} • ${path}` };
    },
  },
});
