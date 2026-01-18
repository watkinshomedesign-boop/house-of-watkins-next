import type { PortfolioProvider } from "@/lib/portfolio/provider";
import type { PortfolioProject } from "@/lib/portfolio/types";
import { getSanityConfig } from "@/lib/sanity/client";
import { getServerSanityClient } from "@/lib/sanity/serverClient";

const PROJECT_FIELDS = `{
  title,
  "slug": slug.current,
  status,
  order,
  "oldSlugs": oldSlugs,
  coverImage,
  gallery[]{
    "image": image,
    alt,
    caption
  },
  planDetailsUrl,
  videoUrl,
  "videoFileAsset": videoFile.asset-> { url }
}`;

function toProject(p: any): PortfolioProject {
  return {
    title: p.title,
    slug: p.slug,
    status: (p.status === "draft" ? "draft" : "published") as "draft" | "published",
    order: typeof p.order === "number" ? p.order : undefined,
    oldSlugs: Array.isArray(p.oldSlugs) ? p.oldSlugs.filter((s: any) => typeof s === "string") : undefined,
    coverImage: {
      image: p.coverImage,
      alt: p.coverImage?.alt ?? undefined,
    },
    gallery: Array.isArray(p.gallery) ? p.gallery.map((g: any) => ({ image: g.image, alt: g.alt ?? undefined, caption: g.caption ?? undefined })) : [],
    planDetailsUrl: typeof p.planDetailsUrl === "string" ? p.planDetailsUrl : undefined,
    videoUrl: typeof p.videoUrl === "string" ? p.videoUrl : undefined,
    videoFileUrl: typeof p.videoFileAsset?.url === "string" ? p.videoFileAsset.url : undefined,
  };
}

export class SanityPortfolioProvider implements PortfolioProvider {
  static assertConfigured() {
    const cfg = getSanityConfig();
    if (!cfg) {
      throw new Error(
        "Sanity portfolio provider selected but not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
      );
    }
  }

  async listProjects(): Promise<PortfolioProject[]> {
    const client = getServerSanityClient();
    const rows = await client.fetch(
      `*[_type == "portfolioProject" && defined(slug.current) && status == "published"] | order(coalesce(order, 9999) asc, _createdAt desc) ${PROJECT_FIELDS}`,
    );
    return (rows ?? []).map(toProject);
  }

  async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    const client = getServerSanityClient();
    const row = await client.fetch(
      `*[_type == "portfolioProject" && defined(slug.current) && status == "published" && (slug.current == $slug || $slug in oldSlugs)][0] ${PROJECT_FIELDS}`,
      { slug },
    );
    return row ? toProject(row) : null;
  }
}

export class MisconfiguredSanityPortfolioProvider implements PortfolioProvider {
  private fail(): never {
    throw new Error(
      "PORTFOLIO_PROVIDER is set to sanity, but Sanity env vars are missing. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET (and optionally NEXT_PUBLIC_SANITY_API_VERSION).",
    );
  }

  async listProjects(): Promise<PortfolioProject[]> {
    return this.fail();
  }
  async getProjectBySlug(): Promise<PortfolioProject | null> {
    return this.fail();
  }
}
