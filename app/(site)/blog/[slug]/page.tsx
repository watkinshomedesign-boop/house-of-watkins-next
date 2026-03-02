import { notFound } from "next/navigation";
import { BlogPostPage } from "@/sitePages/BlogPostPage";
import { getBlogProvider } from "@/lib/blog/getProvider";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { urlForImage } from "@/lib/sanity/image";
import type { Metadata } from "next";

export const revalidate = 60;

function getCoverImageUrl(coverImage: unknown): string | undefined {
  if (!coverImage) return undefined;
  if (typeof coverImage === "string") return coverImage;
  try {
    return urlForImage(coverImage).width(1200).height(630).fit("crop").url();
  } catch {
    return undefined;
  }
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.substring(0, max - 3) + "...";
}

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
  try {
    const provider = getBlogProvider();
    const post = await provider.getPost(props.params.slug);
    if (!post) {
      return { title: "Post Not Found | House of Watkins" };
    }

    const title = `${post.title} | House of Watkins`;
    const description = truncate(
      post.excerpt || "Read this article from House of Watkins.",
      155,
    );
    const url = `https://houseofwatkins.com/blog/${post.slug}`;
    const imageUrl = getCoverImageUrl(post.coverImage);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "House of Watkins",
        locale: "en_US",
        ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
        ...(imageUrl
          ? {
              images: [
                {
                  url: imageUrl,
                  width: 1200,
                  height: 630,
                  alt: post.title,
                },
              ],
            }
          : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
    return { title: "Blog | House of Watkins" };
  }
}

export default async function Page(props: { params: { slug: string } }) {
  try {
    const provider = getBlogProvider();
    const post = await provider.getPost(props.params.slug);
    if (!post) return notFound();

    const categories = await provider.listCategories();
    const popularPosts = await provider.listPopularPosts(3);

    return (
      <>
        <InteriorHeader />
        <BlogPostPage post={post} categories={categories} popularPosts={popularPosts} />
        <Footer />
      </>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Blog provider error";
    return (
      <>
        <InteriorHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-4 text-sm text-neutral-600">{message}</p>
        </main>
        <Footer />
      </>
    );
  }
}
