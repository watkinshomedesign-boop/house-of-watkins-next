import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({ name: "fromPath", title: "From path", type: "string", validation: (r) => r.required() }),
    defineField({ name: "toPath", title: "To path", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "statusCode",
      title: "Status code",
      type: "number",
      initialValue: 301,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "enabled",
      options: {
        list: [
          { title: "Enabled", value: "enabled" },
          { title: "Disabled", value: "disabled" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { fromPath: "fromPath", toPath: "toPath", statusCode: "statusCode", status: "status" },
    prepare(selection) {
      const code = selection.statusCode ?? 301;
      const state = selection.status === "disabled" ? "Disabled" : "Enabled";
      return { title: `${selection.fromPath} → ${selection.toPath}`, subtitle: `${state} • ${code}` };
    },
  },
});
