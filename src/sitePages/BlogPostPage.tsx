import Link from "next/link";
import type { Post } from "@/lib/blog/types";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import { Reveal } from "@/components/Reveal";

type LocalContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string };

type BlogPostPageProps = {
  post: Post;
  popularPosts: Post[];
  categories: string[];
};

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

function getCoverImageUrl(coverImage: unknown): string {
  if (!coverImage) return "/placeholders/plan-hero.svg";
  if (typeof coverImage === "string") return coverImage;
  try {
    return urlForImage(coverImage as any).width(1400).height(800).fit("crop").url();
  } catch {
    return "/placeholders/plan-hero.svg";
  }
}

function isLocalBlocks(value: unknown): value is LocalContentBlock[] {
  if (!Array.isArray(value)) return false;
  const first = value[0] as any;
  return Boolean(first && typeof first === "object" && "type" in first);
}

function isSanityPortableText(value: unknown): value is any[] {
  if (!Array.isArray(value)) return false;
  const first = value[0] as any;
  return Boolean(first && typeof first === "object" && ("_type" in first || "children" in first));
}

function LocalBlockRenderer(props: { blocks: LocalContentBlock[] }) {
  return (
    <div className="space-y-5">
      {props.blocks.map((b, idx) => {
        if (b.type === "h2") {
          return (
            <h2 key={idx} className="text-xl font-semibold tracking-tight">
              {b.text}
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3 key={idx} className="text-lg font-semibold tracking-tight">
              {b.text}
            </h3>
          );
        }
        if (b.type === "p") {
          return (
            <p key={idx} className="text-sm leading-6 text-neutral-700">
              {b.text}
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={idx} className="list-disc pl-5 text-sm leading-6 text-neutral-700">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "quote") {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-orange-600 pl-4 text-sm italic text-neutral-700"
            >
              {b.text}
            </blockquote>
          );
        }
        if (b.type === "image") {
          return (
            <div key={idx} className="overflow-hidden rounded-xl border border-neutral-200">
              <img src={b.src} alt={b.alt} className="w-full object-cover" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function getVideoEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

const portableTextComponents = {
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold tracking-tight">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-sm leading-6 text-neutral-700">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-orange-600 pl-4 text-sm italic text-neutral-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-5 text-sm leading-6 text-neutral-700">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-5 text-sm leading-6 text-neutral-700">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a href={value?.href} className="text-orange-600 underline" rel="noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => {
      const alignment = value?.alignment ?? "center";
      const size = value?.size ?? "large";
      const caption = value?.caption;
      const alt = value?.alt ?? "";

      let width = 900;
      if (size === "small") width = 420;
      if (size === "medium") width = 640;
      if (size === "large") width = 900;
      if (size === "full") width = 1400;

      let wrapperClass = "overflow-hidden rounded-xl border border-neutral-200";
      if (alignment === "left") wrapperClass += " mr-auto";
      if (alignment === "center") wrapperClass += " mx-auto";
      if (alignment === "right") wrapperClass += " ml-auto";

      let src = "/placeholders/plan-hero.svg";
      try {
        src = urlForImage(value).width(width).fit("max").url();
      } catch {
        src = "/placeholders/plan-hero.svg";
      }

      return (
        <figure className="space-y-2">
          <div className={wrapperClass}>
            <img
              src={src}
              alt={alt}
              className="w-full object-cover"
            />
          </div>
          {caption ? <figcaption className="text-xs text-neutral-500">{caption}</figcaption> : null}
        </figure>
      );
    },
    videoEmbed: ({ value }: any) => {
      const caption = value?.caption;
      const src = getVideoEmbedUrl(value?.url ?? "");
      return (
        <figure className="space-y-2">
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={src}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
              />
            </div>
          </div>
          {caption ? <figcaption className="text-xs text-neutral-500">{caption}</figcaption> : null}
        </figure>
      );
    },
    twoColumn: ({ value }: any) => {
      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <PortableText value={value?.left ?? []} components={portableTextComponents as any} />
          </div>
          <div className="space-y-5">
            <PortableText value={value?.right ?? []} components={portableTextComponents as any} />
          </div>
        </div>
      );
    },
  },
};

export function BlogPostPage(props: BlogPostPageProps) {
  const post = props.post;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <Reveal>
        <div className="text-sm">
          <Link href="/" className="font-semibold text-orange-600">
            Home
          </Link>
          <span className="mx-2 text-neutral-400">/</span>
          <Link href="/blog" className="font-semibold text-neutral-500 hover:text-orange-600">
            Blog
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
        <article>
          <Reveal delayMs={40}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                  {post.category}
                </span>
                <span className="text-xs text-neutral-500">{formatDate(post.publishedAt)}</span>
                <span className="text-xs text-neutral-500">{post.readTimeMinutes} min read</span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight">{post.title}</h1>
            </div>
          </Reveal>

          <Reveal delayMs={80}>
            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
              <img src={getCoverImageUrl(post.coverImage)} alt={post.title} className="h-64 w-full object-cover" />
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="mt-8 max-w-3xl">
              {isLocalBlocks(post.content) ? (
                <LocalBlockRenderer blocks={post.content} />
              ) : isSanityPortableText(post.content) ? (
                <div className="space-y-5">
                  <PortableText value={post.content} components={portableTextComponents as any} />
                </div>
              ) : null}
            </div>
          </Reveal>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Reveal delayMs={80}>
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

          <Reveal delayMs={140}>
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="text-sm font-semibold">Categories</div>
              <div className="mt-4 flex flex-col gap-2">
                {props.categories.map((c) => (
                  <Link
                    key={c}
                    href={`/blog?category=${encodeURIComponent(c)}`}
                    className="text-sm text-neutral-700 hover:text-orange-600"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
    </main>
  );
}

function BlogPostPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Blog Post</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default BlogPostPageRouteStub;
