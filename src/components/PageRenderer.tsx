import React from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";

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
    h2: ({ children }: any) => <h2 className="text-xl font-semibold tracking-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-semibold tracking-tight">{children}</h3>,
    normal: ({ children }: any) => <p className="text-sm leading-6 text-neutral-700">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-orange-600 pl-4 text-sm italic text-neutral-700">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-700">{children}</ol>,
  },
  marks: {
    link: ({ children, value }: any) => (
      <a href={value?.href} className="text-orange-600 underline" rel="noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    imageBlock: ({ value }: any) => {
      const alignment = value?.alignment ?? "center";
      const widthOpt = value?.width ?? value?.size ?? "lg";
      const caption = value?.caption;
      const alt = value?.alt ?? value?.asset?.altText ?? "";

      let width = 900;
      if (widthOpt === "sm" || widthOpt === "small") width = 420;
      if (widthOpt === "md" || widthOpt === "medium") width = 640;
      if (widthOpt === "lg" || widthOpt === "large") width = 900;
      if (widthOpt === "full") width = 1400;

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
            <img src={src} alt={alt} className="w-full object-cover" />
          </div>
          {caption ? <figcaption className="text-xs text-neutral-500">{caption}</figcaption> : null}
        </figure>
      );
    },
    image: ({ value }: any) => {
      const alignment = value?.alignment ?? "center";
      const widthOpt = value?.width ?? value?.size ?? "lg";
      const caption = value?.caption;
      const alt = value?.alt ?? value?.asset?.altText ?? "";

      let width = 900;
      if (widthOpt === "sm" || widthOpt === "small") width = 420;
      if (widthOpt === "md" || widthOpt === "medium") width = 640;
      if (widthOpt === "lg" || widthOpt === "large") width = 900;
      if (widthOpt === "full") width = 1400;

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
            <img src={src} alt={alt} className="w-full object-cover" />
          </div>
          {caption ? <figcaption className="text-xs text-neutral-500">{caption}</figcaption> : null}
        </figure>
      );
    },
    videoBlock: ({ value }: any) => {
      const caption = value?.caption;
      const fileUrl = value?.videoFileAsset?.url;

      if (typeof fileUrl === "string" && fileUrl) {
        return (
          <figure className="space-y-2">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-black">
              <video className="w-full" controls preload="metadata" src={fileUrl} />
            </div>
            {caption ? <figcaption className="text-xs text-neutral-500">{caption}</figcaption> : null}
          </figure>
        );
      }

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
    columnsBlock: ({ value }: any) => {
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
    ctaBlock: ({ value }: any) => {
      const label = String(value?.label ?? "");
      const href = String(value?.href ?? "");
      const style = value?.style === "secondary" ? "secondary" : "primary";

      if (!label || !href) return null;

      const className =
        style === "primary"
          ? "inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
          : "inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900";

      return (
        <div>
          <Link href={href} className={className}>
            {label}
          </Link>
        </div>
      );
    },
    spacerBlock: ({ value }: any) => {
      const size = value?.size ?? "md";
      if (size === "sm") return <div className="h-4" />;
      if (size === "lg") return <div className="h-12" />;
      return <div className="h-8" />;
    },
    quoteBlock: ({ value }: any) => {
      const text = value?.text;
      const author = value?.author;
      if (!text) return null;
      return (
        <blockquote className="rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm italic leading-6 text-neutral-700">{text}</p>
          {author ? <p className="mt-3 text-xs font-semibold text-neutral-600">{author}</p> : null}
        </blockquote>
      );
    },
  },
};

export function PageRenderer(props: { content: any[] }) {
  return (
    <div className="space-y-5">
      <PortableText value={props.content ?? []} components={portableTextComponents as any} />
    </div>
  );
}

export default PageRenderer;
