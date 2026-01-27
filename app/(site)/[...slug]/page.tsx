import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { PageRenderer } from "@/components/PageRenderer";
import { getSitePageBySlug } from "@/lib/sitePages/sanity";
import { isSitePageVisibleToRequest } from "@/lib/sitePages/visibility";
import { upsertRedirectServer } from "@/lib/sitePages/redirects";
import { lookupRedirectServer } from "@/lib/redirectsServer";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sitePages/sanity";
import { urlForImage } from "@/lib/sanity/image";

type PageProps = {
  params: { slug: string[] };
};

async function getSiteUrl(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "https://houseofwatkins.com";
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const slugPath = `/${(props.params.slug ?? []).join("/")}`.replace(/\/+$/, "") || "/";
  const slugKey = slugPath === "/" ? "" : slugPath.slice(1);

  const page = await getSitePageBySlug(slugKey);
  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  const siteSettings = await getSiteSettings();
  const baseUrl = await getSiteUrl();
  const canonicalPath = page.slug ? `/${page.slug}` : "/";
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const title = (page.seoTitle || "").trim() || page.title || siteSettings?.defaultSeoTitle?.trim() || "House of Watkins";
  const description =
    (page.seoDescription || "").trim() ||
    siteSettings?.defaultSeoDescription?.trim() ||
    `Visit ${page.title} on House of Watkins.`;

  let ogImage: string | undefined;
  if (page.ogImage) {
    try {
      const imageUrl = urlForImage(page.ogImage).width(1200).height(630).url();
      ogImage = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `https:${imageUrl}`) : undefined;
    } catch (error) {
      console.error("[metadata] Error resolving OG image:", error);
    }
  } else if (siteSettings?.defaultOgImage) {
    try {
      const imageUrl = urlForImage(siteSettings.defaultOgImage).width(1200).height(630).url();
      ogImage = imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `https:${imageUrl}`) : undefined;
    } catch (error) {
      console.error("[metadata] Error resolving default OG image:", error);
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "House of Watkins",
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function Page(props: PageProps) {
  const slugPath = `/${(props.params.slug ?? []).join("/")}`.replace(/\/+$/, "") || "/";
  const slugKey = slugPath === "/" ? "" : slugPath.slice(1);

  if (slugPath.startsWith("/house/")) {
    return notFound();
  }

  const existing = await lookupRedirectServer(slugPath);
  if (existing?.toPath) {
    if (existing.statusCode === 301 || existing.statusCode === 308) {
      return permanentRedirect(existing.toPath);
    }
    return redirect(existing.toPath);
  }

  const page = await getSitePageBySlug(slugKey);
  if (!page) return notFound();

  if (!isSitePageVisibleToRequest(page)) {
    return notFound();
  }

  const canonicalPath = page.slug ? `/${page.slug}` : "/";
  if (canonicalPath !== slugPath) {
    await upsertRedirectServer({ fromPath: slugPath, toPath: canonicalPath, statusCode: 301, isAuto: true });
    return permanentRedirect(canonicalPath);
  }

  return (
    <>
      <InteriorHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
        <div className="mt-8">
          <PageRenderer content={page.content ?? []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
