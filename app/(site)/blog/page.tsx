import { BlogIndexPage, BlogIndexPageMobile } from "@/sitePages/BlogIndexPage";
import { getBlogProvider } from "@/lib/blog/getProvider";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { Suspense } from "react";

export const revalidate = 60;

export default async function Page() {
  try {
    const provider = getBlogProvider();
    const posts = await provider.listPosts();
    const categories = await provider.listCategories();
    const popularPosts = await provider.listPopularPosts(3);

    return (
      <>
        <div className="how-blog-desktop">
          <InteriorHeader />
          <Suspense>
            <BlogIndexPage posts={posts} categories={categories} popularPosts={popularPosts} />
          </Suspense>
          <Footer />
        </div>

        <div className="how-blog-mobile">
          <Suspense>
            <BlogIndexPageMobile posts={posts} categories={categories} popularPosts={popularPosts} />
          </Suspense>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .how-blog-desktop { display: none; }
            .how-blog-mobile { display: block; }
          }
          @media (min-width: 769px) {
            .how-blog-desktop { display: block; }
            .how-blog-mobile { display: none; }
          }
        `}</style>
      </>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Blog provider error";
    return (
      <>
        <div className="how-blog-desktop">
          <InteriorHeader />
          <main className="mx-auto w-full max-w-5xl px-4 py-12">
            <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
            <p className="mt-4 text-sm text-neutral-600">{message}</p>
          </main>
          <Footer />
        </div>

        <div className="how-blog-mobile">
          <Suspense>
            <BlogIndexPageMobile posts={[]} categories={[]} popularPosts={[]} errorMessage={message} />
          </Suspense>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .how-blog-desktop { display: none; }
            .how-blog-mobile { display: block; }
          }
          @media (min-width: 769px) {
            .how-blog-desktop { display: block; }
            .how-blog-mobile { display: none; }
          }
        `}</style>
      </>
    );
  }
}
