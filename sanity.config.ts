import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { deskStructure } from "./sanity/deskStructure";
import { FilenameImageAssetSource } from "./sanity/assetSources/FilenameImageAssetSource";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
  );
}

export default defineConfig({
  name: "default",
  title: "Moss Blog",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  form: {
    image: {
      assetSources: (prev) => [
        ...prev,
        {
          name: "filenameSearch",
          title: "Search by file name",
          component: FilenameImageAssetSource,
        },
      ],
    },
  },
  schema: {
    types: schemaTypes,
  },
});
