import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "newsletterCtaText", title: "Newsletter CTA text", type: "string" }),
    defineField({ name: "hubspotBookingLink", title: "HubSpot booking link", type: "url" }),
    defineField({ name: "defaultSeoTitle", title: "Default SEO title", type: "string" }),
    defineField({ name: "defaultSeoDescription", title: "Default SEO description", type: "text", rows: 3 }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "pinterest", title: "Pinterest", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
      ],
    }),
  ],
});
