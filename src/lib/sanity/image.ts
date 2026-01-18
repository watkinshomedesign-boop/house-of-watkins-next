import imageUrlBuilder from "@sanity/image-url";
import { getSanityConfig } from "@/lib/sanity/client";

export function urlForImage(source: unknown) {
  const config = getSanityConfig();
  if (!config) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local.",
    );
  }

  const builder = imageUrlBuilder({
    projectId: config.projectId,
    dataset: config.dataset,
  });

  return builder.image(source as any);
}
