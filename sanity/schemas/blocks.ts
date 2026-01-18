import { defineField, defineType } from "sanity";

export const imageBlock = defineType({
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
          { title: "Full", value: "full" },
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
});

export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "videoFile",
      title: "Video file",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({ name: "url", title: "YouTube/Vimeo URL", type: "url" }),
  ],
});

export const pageSection = defineType({
  name: "pageSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "imageBlock" }, { type: "videoBlock" }],
    }),
  ],
});
