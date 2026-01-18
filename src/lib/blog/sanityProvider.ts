import type { BlogProvider } from "@/lib/blog/provider";
import type { Post } from "@/lib/blog/types";
import { getSanityConfig } from "@/lib/sanity/client";
import { getServerSanityClient } from "@/lib/sanity/serverClient";

const POST_FIELDS = `{
  "slug": slug.current,
  title,
  excerpt,
  category,
  publishedAt,
  readTimeMinutes,
  isPopular,
  coverImage,
  body
}`;

function toPost(p: any): Post {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? undefined,
    category: p.category,
    coverImage: p.coverImage,
    publishedAt: p.publishedAt ?? "",
    readTimeMinutes: typeof p.readTimeMinutes === "number" ? p.readTimeMinutes : 0,
    isPopular: Boolean(p.isPopular),
    content: p.body ?? [],
  };
}

export class SanityBlogProvider implements BlogProvider {
  static assertConfigured() {
    const cfg = getSanityConfig();
    if (!cfg) {
      throw new Error(
        "Sanity blog provider selected but not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
      );
    }
  }

  async listPosts(): Promise<Post[]> {
    const client = getServerSanityClient();
    const rows = await client.fetch(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${POST_FIELDS}`,
    );
    return (rows ?? []).map(toPost);
  }

  async getPost(slug: string): Promise<Post | null> {
    const client = getServerSanityClient();
    const row = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] ${POST_FIELDS}`,
      { slug },
    );
    return row ? toPost(row) : null;
  }

  async listCategories(): Promise<string[]> {
    return [
      "Design Ideas",
      "Building Tips",
      "Product Reviews",
      "Case Studies",
      "Inspiration",
    ];
  }

  async listPopularPosts(limit = 3): Promise<Post[]> {
    const client = getServerSanityClient();
    const popular = await client.fetch(
      `*[_type == "post" && defined(slug.current) && isPopular == true] | order(publishedAt desc)[0...$limit] ${POST_FIELDS}`,
      { limit },
    );

    const rows = Array.isArray(popular) && popular.length > 0 ? popular : await client.fetch(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit] ${POST_FIELDS}`,
      { limit },
    );

    return (rows ?? []).map(toPost);
  }
}

export class MisconfiguredSanityBlogProvider implements BlogProvider {
  private fail(): never {
    throw new Error(
      "BLOG_PROVIDER is set to sanity, but Sanity env vars are missing. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET (and optionally NEXT_PUBLIC_SANITY_API_VERSION).",
    );
  }

  async listPosts(): Promise<Post[]> {
    return this.fail();
  }
  async getPost(): Promise<Post | null> {
    return this.fail();
  }
  async listCategories(): Promise<string[]> {
    return this.fail();
  }
  async listPopularPosts(): Promise<Post[]> {
    return this.fail();
  }
}
