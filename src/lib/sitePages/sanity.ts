import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";
import type { SitePage, SitePageType, SiteSettings } from "@/lib/sitePages/types";

const SITE_PAGE_FIELDS = `{
  _id,
  title,
  "slug": slug.current,
  status,
  pageType,
  oldSlugs,
  hero {
    headline,
    subhead,
    image,
    ctaText,
    ctaHref
  },
  content[] {
    ...,
    _type == "videoBlock" => {
      ...,
      "videoFileAsset": videoFile.asset-> { url }
    }
  },
  seoTitle,
  seoDescription,
  ogImage
}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!hasSanity()) return null;
  const client = getServerSanityClient();
  const row = await client.fetch(
    `*[_type == "siteSettings"][0]{
      newsletterCtaText,
      hubspotBookingLink,
      defaultSeoTitle,
      defaultSeoDescription,
      defaultOgImage,
      socialLinks
    }`,
  );
  return row ?? null;
}

export async function getSitePageByType(pageType: SitePageType): Promise<SitePage | null> {
  if (!hasSanity()) return null;
  const client = getServerSanityClient();
  const row = await client.fetch(
    `*[_type == "sitePage" && pageType == $pageType && defined(slug.current)][0] ${SITE_PAGE_FIELDS}`,
    { pageType },
  );

  if (!row?._id) return null;

  return {
    id: row._id,
    title: row.title ?? "",
    slug: row.slug ?? "",
    status: row.status === "published" ? "published" : "draft",
    pageType: row.pageType,
    oldSlugs: Array.isArray(row.oldSlugs) ? row.oldSlugs : undefined,
    hero: row.hero ?? undefined,
    content: Array.isArray(row.content) ? row.content : [],
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    ogImage: row.ogImage ?? undefined,
  } as SitePage;
}

export async function getSitePageBySlug(slugPath: string): Promise<SitePage | null> {
  if (!hasSanity()) return null;
  const client = getServerSanityClient();
  const row = await client.fetch(
    `*[_type == "sitePage" && defined(slug.current) && (slug.current == $slug || $slug in oldSlugs)][0] ${SITE_PAGE_FIELDS}`,
    { slug: slugPath },
  );

  if (!row?._id) return null;

  return {
    id: row._id,
    title: row.title ?? "",
    slug: row.slug ?? "",
    status: row.status === "published" ? "published" : "draft",
    pageType: row.pageType,
    oldSlugs: Array.isArray(row.oldSlugs) ? row.oldSlugs : undefined,
    hero: row.hero ?? undefined,
    content: Array.isArray(row.content) ? row.content : [],
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    ogImage: row.ogImage ?? undefined,
  } as SitePage;
}
