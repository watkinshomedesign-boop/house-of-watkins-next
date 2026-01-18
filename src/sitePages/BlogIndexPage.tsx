"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Post } from "@/lib/blog/types";
import { urlForImage } from "@/lib/sanity/image";
import { Reveal } from "@/components/Reveal";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";
import { InteriorHeader } from "@/sections/InteriorHeader";

type BlogIndexPageProps = {
  posts: Post[];
  categories: string[];
  popularPosts: Post[];
};

const CATEGORY_PILLS = [
  "All Posts",
  "Design Ideas",
  "Building Tips",
  "Product Reviews",
  "Case Studies",
  "Inspiration",
];

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function formatDateMobile(date: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getCoverImageUrl(coverImage: unknown): string {
  if (!coverImage) return "/placeholders/plan-hero.svg";
  if (typeof coverImage === "string") return coverImage;
  try {
    return urlForImage(coverImage as any).width(900).height(500).fit("crop").url();
  } catch {
    return "/placeholders/plan-hero.svg";
  }
}

export function BlogIndexPage(props: BlogIndexPageProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/blog";
  const searchParams = useSearchParams();

  const selectedCategory = (searchParams?.get("category") ?? "All Posts").trim();
  const qParam = (searchParams?.get("q") ?? "").trim();
  const [queryDraft, setQueryDraft] = useState(qParam);

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeUserType, setSubscribeUserType] = useState<"homeowner" | "builder">("homeowner");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null);

  useEffect(() => {
    setQueryDraft(qParam);
  }, [qParam]);

  const filteredPosts = useMemo(() => {
    const q = qParam.toLowerCase();
    const inCategory = props.posts.filter((p) => {
      if (!selectedCategory || selectedCategory === "All Posts") return true;
      return p.category === selectedCategory;
    });

    if (!q) return inCategory;
    return inCategory.filter((p) => {
      const hay = (p.title + " " + (p.excerpt ?? "")).toLowerCase();
      return hay.includes(q);
    });
  }, [props.posts, qParam, selectedCategory]);

  function setParam(next: { category?: string; q?: string }) {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");

    if (typeof next.category !== "undefined") {
      const c = next.category.trim();
      if (!c || c === "All Posts") sp.delete("category");
      else sp.set("category", c);
    }

    if (typeof next.q !== "undefined") {
      const q = next.q.trim();
      if (!q) sp.delete("q");
      else sp.set("q", q);
    }

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  async function submitSubscribe() {
    setSubscribeError(null);
    setSubscribeSuccess(null);

    const em = subscribeEmail.trim();
    if (!em) return setSubscribeError("Email is required");
    if (!isValidEmail(em)) return setSubscribeError("Enter a valid email");

    setSubscribeLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: em,
          user_type: subscribeUserType,
          source: "blog_subscribe",
          page_path: pathname,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String((json as any)?.error ?? "Failed to submit"));

      setSubscribeSuccess("Thanks — check your inbox shortly.");
      setSubscribeEmail("");
      setSubscribeUserType("homeowner");
    } catch (e: any) {
      setSubscribeError(String(e?.message ?? "Failed to submit"));
    } finally {
      setSubscribeLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_PILLS.map((label) => {
          const active =
            (label === "All Posts" && (!selectedCategory || selectedCategory === "All Posts")) ||
            label === selectedCategory;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setParam({ category: label })}
              className={
                "rounded-full border px-3 py-1 text-sm font-semibold " +
                (active
                  ? "border-orange-600 text-orange-600"
                  : "border-neutral-200 text-neutral-600")
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="relative">
            <input
              value={queryDraft}
              onChange={(e) => {
                const next = e.target.value;
                setQueryDraft(next);
                setParam({ q: next });
              }}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <Reveal key={post.slug} delayMs={(index % 6) * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden rounded-xl border border-neutral-200 bg-white"
                >
                  <div className="relative">
                    <img
                      src={getCoverImageUrl(post.coverImage)}
                      alt={post.title}
                      className="h-44 w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-base font-semibold tracking-tight [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden"
                    >
                      {post.title}
                    </h3>
                    {post.excerpt ? (
                      <p className="mt-2 text-sm text-neutral-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                      <span>{post.readTimeMinutes} min read</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <Reveal delayMs={60}>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="text-sm font-semibold">Popular Posts</div>
              <div className="mt-4 space-y-3">
                {props.popularPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block text-sm font-semibold text-neutral-900 hover:text-orange-600"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="text-sm font-semibold">Categories</div>
              <div className="mt-4 flex flex-col gap-2">
                {props.categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setParam({ category: c })}
                    className="text-left text-sm text-neutral-700 hover:text-orange-600"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="rounded-xl bg-zinc-800 p-5 text-white">
            <div className="text-sm font-semibold">Stay Inspired</div>
            <p className="mt-2 text-sm text-white/80">
              Get the latest design tips and inspiration delivered to your inbox.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="mt-4 w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/50"
            />

            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="blog_subscribe_user_type"
                  checked={subscribeUserType === "homeowner"}
                  onChange={() => setSubscribeUserType("homeowner")}
                  className="mt-[3px] h-4 w-4 accent-orange-600"
                />
                <span>Future Dream Homeowner (Living in the Home)</span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="blog_subscribe_user_type"
                  checked={subscribeUserType === "builder"}
                  onChange={() => setSubscribeUserType("builder")}
                  className="mt-[3px] h-4 w-4 accent-orange-600"
                />
                <span>Licensed Builder (Building the Home)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={submitSubscribe}
              disabled={subscribeLoading || !isValidEmail(subscribeEmail.trim())}
              className="mt-3 w-full rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {subscribeLoading ? "Sending..." : "Subscribe"}
            </button>

            {subscribeSuccess ? <div className="mt-3 text-sm text-green-200">{subscribeSuccess}</div> : null}
            {subscribeError ? <div className="mt-3 text-sm text-red-200">{subscribeError}</div> : null}
          </div>
        </aside>
      </div>
    </main>
  );
}

export function BlogIndexPageMobile(props: BlogIndexPageProps & { errorMessage?: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/blog";
  const searchParams = useSearchParams();

  const selectedCategory = (searchParams?.get("category") ?? "All Posts").trim();
  const qParam = (searchParams?.get("q") ?? "").trim();
  const [queryDraft, setQueryDraft] = useState(qParam);
  const [visibleCount, setVisibleCount] = useState(6);

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeUserType, setSubscribeUserType] = useState<"homeowner" | "builder">("homeowner");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState<string | null>(null);

  useEffect(() => {
    setQueryDraft(qParam);
  }, [qParam]);

  const filteredPosts = useMemo(() => {
    const q = qParam.toLowerCase();
    const inCategory = props.posts.filter((p) => {
      if (!selectedCategory || selectedCategory === "All Posts") return true;
      return p.category === selectedCategory;
    });

    if (!q) return inCategory;
    return inCategory.filter((p) => {
      const hay = (p.title + " " + (p.excerpt ?? "")).toLowerCase();
      return hay.includes(q);
    });
  }, [props.posts, qParam, selectedCategory]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, Math.max(0, visibleCount));
  }, [filteredPosts, visibleCount]);

  function setParam(next: { category?: string; q?: string }) {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");

    if (typeof next.category !== "undefined") {
      const c = next.category.trim();
      if (!c || c === "All Posts") sp.delete("category");
      else sp.set("category", c);
    }

    if (typeof next.q !== "undefined") {
      const q = next.q.trim();
      if (!q) sp.delete("q");
      else sp.set("q", q);
    }

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, qParam]);

  async function submitSubscribe() {
    setSubscribeError(null);
    setSubscribeSuccess(null);

    const em = subscribeEmail.trim();
    if (!em) return setSubscribeError("Email is required");
    if (!isValidEmail(em)) return setSubscribeError("Enter a valid email");

    setSubscribeLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: em,
          user_type: subscribeUserType,
          source: "blog_subscribe_mobile",
          page_path: pathname,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String((json as any)?.error ?? "Failed to submit"));

      setSubscribeSuccess("Thanks — check your inbox shortly.");
      setSubscribeEmail("");
      setSubscribeUserType("homeowner");
    } catch (e: any) {
      setSubscribeError(String(e?.message ?? "Failed to submit"));
    } finally {
      setSubscribeLoading(false);
    }
  }

  const popularPosts = props.popularPosts.slice(0, 3);
  const categoryList = props.categories?.length ? props.categories : CATEGORY_PILLS;

  return (
    <div className="how-blog-mobile bg-[#FAF9F7] text-zinc-900 font-gilroy">
      <div className="sticky top-0 z-50">
        <InteriorHeader />
      </div>

      <div className="px-4 pt-5 pb-3">
        <h1 className="m-0 text-[32px] leading-[1.1] font-semibold tracking-[-0.5px] text-black">Blog</h1>
        <div className="mt-2 text-[14px] leading-[1.4] text-[#999999]">All Posts</div>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              value={queryDraft}
              onChange={(e) => {
                const next = e.target.value;
                setQueryDraft(next);
                setParam({ q: next });
              }}
              placeholder="Search articles..."
              className="h-[44px] w-full rounded-full border border-[#E0E0E0] bg-white px-[18px] pr-[44px] text-[14px] text-black outline-none placeholder:text-[#CCCCCC] focus:border-[#FF5C02] focus:ring-4 focus:ring-[rgba(255,92,2,0.15)]"
              aria-label="Search articles"
            />

            <div className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-[18px] w-[18px] text-[#666666]" aria-hidden="true">
                <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            aria-label="Go"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-orange-600 text-orange-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[20px] w-[20px]"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 how-blog-mobile-tabs">
        {CATEGORY_PILLS.map((label) => {
          const active =
            (label === "All Posts" && (!selectedCategory || selectedCategory === "All Posts")) ||
            label === selectedCategory;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setParam({ category: label })}
              className={
                "inline-flex shrink-0 items-center rounded-full px-4 py-2 text-[13px] font-medium transition-colors " +
                (active
                  ? "bg-orange-600 text-white"
                  : "bg-[#FFEFEB] text-[#666666] hover:bg-[#ffd8ce] hover:text-[#333333]")
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {props.errorMessage ? (
        <div className="px-4 pt-6 text-[14px] text-[#666666]">{props.errorMessage}</div>
      ) : (
        <>
          <div className="mt-4 how-blog-mobile-posts">
            {visiblePosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="how-blog-mobile-card">
                <div className="relative">
                  <img src={getCoverImageUrl(post.coverImage)} alt={post.title} className="how-blog-mobile-card-img" loading="lazy" />
                  <div className="absolute right-[10px] top-[10px] flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,92,2,0.9)] text-white">
                    <span className="text-[18px] leading-none">✓</span>
                  </div>
                </div>

                <div className="px-3 pb-3 pt-2">
                  <div className="text-[11px] font-semibold text-[#999999]">{post.category}</div>
                  <div className="mt-1 text-[14px] font-semibold leading-[1.25] text-black [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {post.title}
                  </div>
                  {post.excerpt ? (
                    <div className="mt-2 text-[12px] leading-[1.35] text-[#999999] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                      {post.excerpt}
                    </div>
                  ) : null}
                  <div className="mt-2 text-[12px] text-[#999999]">
                    {formatDateMobile(post.publishedAt)} • {post.readTimeMinutes} min read
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              className="h-[44px] w-[220px] rounded-full bg-orange-600 text-[14px] font-semibold text-white hover:bg-orange-700 active:bg-orange-800 disabled:opacity-50"
              onClick={() => setVisibleCount((c) => c + 6)}
              disabled={visibleCount >= filteredPosts.length}
            >
              Load More Posts
            </button>
          </div>

          <section className="mt-10 px-4">
            <h2 className="text-[18px] font-semibold text-black">Popular Posts</h2>
            <div className="mt-3">
              {popularPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block py-2 text-[14px] text-[#666666] hover:text-[#FF5C02]"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 px-4">
            <h2 className="text-[18px] font-semibold text-black">Categories</h2>
            <div className="mt-3">
              {categoryList.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setParam({ category: c })}
                  className="block w-full py-2 text-left text-[14px] text-[#666666] hover:text-[#FF5C02]"
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 px-4">
            <div className="rounded-[14px] bg-[#2B2A28] p-5 text-white">
              <div className="text-[18px] font-semibold">Stay Inspired</div>
              <div className="mt-2 text-[14px] leading-[1.5] text-[#CCCCCC]">
                Get the latest design tips and inspiration delivered to your inbox.
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="h-[44px] w-full rounded-full border border-white/30 bg-white/10 px-4 text-[14px] text-white outline-none placeholder:text-white/50 focus:border-[#FF5C02] focus:ring-4 focus:ring-[rgba(255,92,2,0.2)]"
                />
                <button
                  type="button"
                  onClick={submitSubscribe}
                  disabled={subscribeLoading || !isValidEmail(subscribeEmail.trim())}
                  className="h-[44px] shrink-0 rounded-full bg-orange-600 px-6 text-[14px] font-semibold text-white hover:bg-orange-700"
                >
                  {subscribeLoading ? "Sending..." : "Subscribe"}
                </button>
              </div>

              <div className="mt-4 space-y-2 text-[14px]">
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="blog_subscribe_user_type_mobile"
                    checked={subscribeUserType === "homeowner"}
                    onChange={() => setSubscribeUserType("homeowner")}
                    className="mt-[3px] h-4 w-4 accent-orange-600"
                  />
                  <span>Future Dream Homeowner (Living in the Home)</span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="blog_subscribe_user_type_mobile"
                    checked={subscribeUserType === "builder"}
                    onChange={() => setSubscribeUserType("builder")}
                    className="mt-[3px] h-4 w-4 accent-orange-600"
                  />
                  <span>Licensed Builder (Building the Home)</span>
                </label>
              </div>

              {subscribeSuccess ? <div className="mt-3 text-[14px] text-green-200">{subscribeSuccess}</div> : null}
              {subscribeError ? <div className="mt-3 text-[14px] text-red-200">{subscribeError}</div> : null}
            </div>
          </section>
        </>
      )}

      <div className="mt-10">
        <MobileFooter />
      </div>

      <style jsx>{`
        @media (min-width: 769px) {
          .how-blog-mobile {
            display: none;
          }
        }
        .how-blog-mobile-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0 16px;
        }
        .how-blog-mobile-tabs::-webkit-scrollbar {
          display: none;
        }
        .how-blog-mobile-posts {
          display: flex;
          flex-direction: row;
          gap: 12px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0 16px;
          scroll-behavior: smooth;
        }
        .how-blog-mobile-posts::-webkit-scrollbar {
          display: none;
        }
        .how-blog-mobile-card {
          flex-shrink: 0;
          width: 170px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
        }
        .how-blog-mobile-card-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  );
}

function BlogIndexPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default BlogIndexPageRouteStub;
