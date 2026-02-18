import { defineField, defineType } from "sanity";

export const builderLandingPage = defineType({
  name: "builderLandingPage",
  title: "Builder Landing Page",
  type: "document",
  fields: [
    // ── Hero ──
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subheadline", title: "Sub-headline", type: "text", rows: 3 }),
        defineField({ name: "ctaLabel", title: "Primary CTA Label", type: "string" }),
        defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string" }),
        defineField({ name: "backgroundImage", title: "Background Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "backgroundImageAlt", title: "Background Image Alt", type: "string" }),
      ],
    }),

    // ── Problem ──
    defineField({
      name: "problem",
      title: "Problem Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "body", title: "Body (paragraphs)", type: "array", of: [{ type: "text" }] }),
        defineField({ name: "boldStatement", title: "Bold Closing Statement", type: "text", rows: 2 }),
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageAlt", title: "Image Alt", type: "string" }),
      ],
    }),

    // ── Solution ──
    defineField({
      name: "solution",
      title: "Solution Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "intro", title: "Intro Paragraph", type: "text", rows: 3 }),
        defineField({ name: "body", title: "Body Paragraph", type: "text", rows: 3 }),
        defineField({
          name: "benefits",
          title: "Benefits",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── Portfolio ──
    defineField({
      name: "portfolio",
      title: "Portfolio Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subheadline", title: "Sub-headline", type: "string" }),
        defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
        defineField({
          name: "images",
          title: "Portfolio Images",
          type: "array",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
            },
          ],
        }),
      ],
    }),

    // ── ROI ──
    defineField({
      name: "roi",
      title: "ROI Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
        defineField({ name: "tableNote", title: "Table Note", type: "string" }),
        defineField({
          name: "tableRows",
          title: "Table Rows",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "metric", title: "Metric", type: "string" }),
                defineField({ name: "stockValue", title: "With Stock Plans", type: "string" }),
                defineField({ name: "watkinsValue", title: "With Watkins Design", type: "string" }),
                defineField({ name: "difference", title: "The Difference", type: "string" }),
              ],
            },
          ],
        }),
        defineField({ name: "conclusion", title: "Conclusion", type: "text", rows: 3 }),
      ],
    }),

    // ── Process ──
    defineField({
      name: "process",
      title: "Process Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "number", title: "Step Number", type: "string" }),
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── Testimonials ──
    defineField({
      name: "testimonials",
      title: "Testimonials Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({
          name: "items",
          title: "Testimonials",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
                defineField({ name: "name", title: "Name", type: "string" }),
                defineField({ name: "title", title: "Title / Company", type: "string" }),
                defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── Offer ──
    defineField({
      name: "offer",
      title: "Offer Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "subheadline", title: "Sub-headline", type: "string" }),
        defineField({ name: "price", title: "Price", type: "string" }),
        defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
        defineField({
          name: "includes",
          title: "What's Included",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "partnershipNote", title: "Partnership Note", type: "text", rows: 2 }),
      ],
    }),

    // ── About ──
    defineField({
      name: "about",
      title: "About Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "body", title: "Body (paragraphs)", type: "array", of: [{ type: "text" }] }),
        defineField({ name: "boldStatement", title: "Bold Closing Statement", type: "text", rows: 2 }),
        defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageAlt", title: "Photo Alt", type: "string" }),
        defineField({
          name: "stats",
          title: "Stats",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "value", title: "Value", type: "string" }),
                defineField({ name: "label", title: "Label", type: "string" }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── FAQ ──
    defineField({
      name: "faq",
      title: "FAQ Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({
          name: "items",
          title: "FAQ Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "question", title: "Question", type: "string" }),
                defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
              ],
            },
          ],
        }),
      ],
    }),

    // ── Final CTA ──
    defineField({
      name: "finalCta",
      title: "Final CTA Section",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
        defineField({ name: "primaryCtaLabel", title: "Primary CTA Label", type: "string" }),
        defineField({ name: "secondaryCtaLabel", title: "Secondary CTA Label", type: "string" }),
      ],
    }),
  ],
});
