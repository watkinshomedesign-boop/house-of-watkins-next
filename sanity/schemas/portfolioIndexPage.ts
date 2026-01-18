import { defineField, defineType } from "sanity";

export const portfolioMosaicTile = defineType({
  name: "portfolioMosaicTile",
  title: "Portfolio Mosaic Tile",
  type: "object",
  fields: [
    defineField({
      name: "imageOverride",
      title: "Image override",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});

export const portfolioIndexPage = defineType({
  name: "portfolioIndexPage",
  title: "Portfolio Index Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "portfolioParentImage1",
      title: "1 (Header image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage2",
      title: "2 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage3",
      title: "3 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage4",
      title: "4 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage5",
      title: "5 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage6",
      title: "6 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage7",
      title: "7 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage8",
      title: "8 (House image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage9",
      title: "9 (House image - extra)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portfolioParentImage10",
      title: "10 (Portrait image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mosaicTiles",
      title: "Mosaic Tiles",
      type: "array",
      of: [{ type: "portfolioMosaicTile" }],
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
    defineField({
      name: "image01",
      title: "Portfolio Image 1 (Top Hero)",
      description: "Top wide hero image",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image02",
      title: "Portfolio Image 2",
      description: "Upper-left tile (beneath the tagline block)",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image03",
      title: "Portfolio Image 3",
      description: "Upper-middle tile",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image04",
      title: "Portfolio Image 4",
      description: "Tall right tile (spans two rows)",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image05",
      title: "Portfolio Image 5",
      description: "Large middle-wide tile (left + middle columns)",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image06",
      title: "Portfolio Image 6",
      description: "Lower-left tile",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image07",
      title: "Portfolio Image 7",
      description: "Lower-right wide tile (middle + right columns)",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "image08",
      title: "Portfolio Image 8",
      description: "Bottom full-width tile",
      type: "object",
      hidden: true,
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),

    defineField({
      name: "portfolioImage1",
      title: "Portfolio Image 1",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage2",
      title: "Portfolio Image 2",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage3",
      title: "Portfolio Image 3",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage4",
      title: "Portfolio Image 4",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage5",
      title: "Portfolio Image 5",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage6",
      title: "Portfolio Image 6",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage7",
      title: "Portfolio Image 7",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "portfolioImage8",
      title: "Portfolio Image 8",
      type: "object",
      fields: [
        defineField({
          name: "project",
          title: "Linked project",
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
  ],
});
