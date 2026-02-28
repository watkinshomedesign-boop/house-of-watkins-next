import { notFound } from "next/navigation";
import { BlogPostPage } from "@/sitePages/BlogPostPage";
import { getBlogProvider } from "@/lib/blog/getProvider";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

export const revalidate = 60;

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
