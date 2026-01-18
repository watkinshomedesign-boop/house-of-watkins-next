import { createClient } from "@supabase/supabase-js";
import seedPlans from "@/data/plans.seed.json";
import { getSanityAssetsByIds } from "@/lib/sanity/assets";
import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

let loggedSeedFallback = false;

export type PlanImages = {
  hero_desktop?: string | null;
  hero_mobile?: string | null;
  hover?: string | null;
  gallery?: string[] | null;
  floorplan?: string[] | null;
  hero?: string | null;
};

export type Plan = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  tour3d_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_media_id?: string | null;
  filters?: Record<string, any> | null;
  heated_sqft: number;
  beds?: number | null;
  baths?: number | null;
  stories?: number | null;
  garage_bays?: number | null;
  width_ft?: number | null;
  depth_ft?: number | null;
  images?: PlanImages | null;
  galleryImages?: string[] | null;
  floorplanImages?: string[] | null;
  frontThumbnailUrl?: string | null;
  planThumbnailUrl?: string | null;
  buildFeatureExteriorUrl?: string | null;
  buildFeatureFloorplanUrl?: string | null;
  tags?: string[] | null;
  status?: string | null;
};

type PlanMediaResolved = {
  planSlug: string;
  frontThumbnailUrl: string | null;
  planThumbnailUrl: string | null;
  buildFeatureExteriorUrl: string | null;
  buildFeatureFloorplanUrl: string | null;
  galleryUrls: string[];
  floorplansUrls: string[];
};

async function getPlanMediaBySlugs(slugs: string[]): Promise<Record<string, PlanMediaResolved>> {
  const unique = Array.from(new Set((slugs ?? []).map((s) => String(s || "").trim()).filter(Boolean)));
  if (!hasSanity() || unique.length === 0) return {};

  const client = getServerSanityClient();
  const query = `*[_type == "planMedia" && planSlug in $slugs] {
    planSlug,
    "frontThumbnailUrl": frontThumbnail.asset->url,
    "planThumbnailUrl": planThumbnail.asset->url,
    "buildFeatureExteriorUrl": buildFeatureExterior.asset->url,
    "buildFeatureFloorplanUrl": buildFeatureFloorplan.asset->url,
    "galleryUrls": gallery[].asset->url,
    "floorplansUrls": floorplans[].asset->url
  }`;

  const items = (await client.fetch(query, { slugs: unique }, { next: { revalidate: 60 } })) as any[];
  const map: Record<string, PlanMediaResolved> = {};
  for (const it of items ?? []) {
    const planSlug = String(it?.planSlug || "").trim();
    if (!planSlug) continue;
    map[planSlug] = {
      planSlug,
      frontThumbnailUrl: typeof it?.frontThumbnailUrl === "string" ? it.frontThumbnailUrl : null,
      planThumbnailUrl: typeof it?.planThumbnailUrl === "string" ? it.planThumbnailUrl : null,
      buildFeatureExteriorUrl: typeof it?.buildFeatureExteriorUrl === "string" ? it.buildFeatureExteriorUrl : null,
      buildFeatureFloorplanUrl: typeof it?.buildFeatureFloorplanUrl === "string" ? it.buildFeatureFloorplanUrl : null,
      galleryUrls: Array.isArray(it?.galleryUrls)
        ? it.galleryUrls.map((u: any) => String(u || "").trim()).filter((u: any) => u)
        : [],
      floorplansUrls: Array.isArray(it?.floorplansUrls)
        ? it.floorplansUrls.map((u: any) => String(u || "").trim()).filter((u: any) => u)
        : [],
    };
  }
  return map;
}

function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

function maybeLogSeedFallback(reason: string) {
  if (loggedSeedFallback) return;
  loggedSeedFallback = true;
  // Intentional: no secrets.
  console.warn(`[plans] Using seed fallback because Supabase is not configured (${reason})`);
}

function resolveStoragePublicUrl(pathOrUrl: string) {
  const s = String(pathOrUrl || "").trim();
  if (!s) return null;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  if (s.startsWith("http://") || s.startsWith("https://")) {
    if (!base) return null;
    try {
      const u = new URL(s);
      const b = new URL(base);
      if (u.origin !== b.origin) return null;
      return s;
    } catch {
      return null;
    }
  }
  if (!base) return null;
  return `${base}/storage/v1/object/public/${s.replace(/^\/+/, "")}`;
}

function resolvePublicUrl(pathOrUrl: string) {
  const s = String(pathOrUrl || "").trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/")) return s;
  return resolveStoragePublicUrl(s);
}

function normalizeImageList(value: unknown): string[] {
  if (!value) return [];
  const out: string[] = [];

  const push = (v: unknown) => {
    if (!v) return;
    if (typeof v === "string") {
      const s = v.trim();
      if (s) out.push(s);
      return;
    }
    if (Array.isArray(v)) {
      for (const x of v) push(x);
      return;
    }
    if (typeof v === "object") {
      const anyV = v as any;
      const s1 = typeof anyV?.url === "string" ? anyV.url : null;
      const s2 = typeof anyV?.src === "string" ? anyV.src : null;
      const s3 = typeof anyV?.file_path === "string" ? anyV.file_path : null;
      const s4 = typeof anyV?.path === "string" ? anyV.path : null;
      const candidate = (s1 || s2 || s3 || s4 || "").trim();
      if (candidate) out.push(candidate);
    }
  };

  push(value);
  return Array.from(new Set(out));
}

export async function resolvePlanOgImageUrl(plan: Plan): Promise<string | null> {
  const hero =
    plan.images?.hero_desktop ||
    plan.images?.hero_mobile ||
    plan.images?.hero ||
    plan.images?.gallery?.[0] ||
    null;

  const supabase = supabasePublic();
  if (!supabase) {
    return hero ? resolveStoragePublicUrl(hero) : null;
  }

  if (plan.og_media_id && plan.id) {
    try {
      const { data, error } = await supabase
        .from("plan_media")
        .select("file_path")
        .eq("id", plan.og_media_id)
        .eq("plan_id", plan.id)
        .maybeSingle();

      if (error) throw error;
      const fp = (data as any)?.file_path;
      const resolved = fp ? resolveStoragePublicUrl(fp) : null;
      if (resolved) return resolved;
    } catch {
      // ignore
    }
  }

  return hero ? resolveStoragePublicUrl(hero) : null;
}

export async function getPublishedPlans(): Promise<Plan[]> {
  const supabase = supabasePublic();
  if (!supabase) {
    maybeLogSeedFallback("missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return (seedPlans as Plan[]).filter((p) => (p.status ?? "published") === "published");
  }

  if (!hasSanity()) {
    console.warn(
      "[plans] Sanity is not configured (missing NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET). Plan media from Sanity will be unavailable."
    );
  }

  const publishedStatuses = ["published", "active", "Published", "ACTIVE"];

  const selectWithTour =
    "id, slug, name, description, tour3d_url, filters, total_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, images, tags, status, created_at";
  const selectWithoutTour =
    "id, slug, name, description, filters, total_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, images, tags, status, created_at";

  const query = async (select: string) =>
    supabase
      .from("plans")
      .select(select)
      .in("status", publishedStatuses)
      .order("created_at", { ascending: false })
      .limit(5000);

  let { data, error } = (await query(selectWithTour)) as any;

  if (error) {
    const msg = String((error as any)?.message || "").toLowerCase();
    const missingTour3d = msg.includes("tour3d_url") && msg.includes("does not exist");
    if (missingTour3d) {
      ({ data, error } = (await query(selectWithoutTour)) as any);
    }
  }

  if (error) {
    // No seed fallback when Supabase is configured.
    console.error("[plans] Supabase getPublishedPlans failed", error.message);
    return [];
  }

  const rows = (data ?? []) as any[];
  const sanityRefs = new Set<string>();
  for (const r of rows) {
    const f = (r.filters ?? {}) as any;
    if (Array.isArray(f.galleryImages)) {
      for (const id of f.galleryImages) {
        const s = String(id || "").trim();
        if (s) sanityRefs.add(s);
      }
    }
    if (Array.isArray(f.floorplanImages)) {
      for (const id of f.floorplanImages) {
        const s = String(id || "").trim();
        if (s) sanityRefs.add(s);
      }
    }
  }

  const sanityAssetMap = await getSanityAssetsByIds(Array.from(sanityRefs));
  const planMediaMap = await getPlanMediaBySlugs(rows.map((r) => String(r?.slug || "").trim()));

  return rows.map((r) => {
    const pm = planMediaMap[String(r?.slug || "").trim()];
    const f = (r.filters ?? {}) as any;
    const galleryIds = Array.isArray(f.galleryImages) ? f.galleryImages : [];
    const floorplanIds = Array.isArray(f.floorplanImages) ? f.floorplanImages : [];
    const galleryImages = galleryIds
      .map((id: any) => {
        const s = String(id || "").trim();
        return s && sanityAssetMap[s] ? String(sanityAssetMap[s].url) : null;
      })
      .filter((u: any) => typeof u === "string" && u.trim())
      .map((u: any) => resolvePublicUrl(String(u || "")))
      .filter((u: any) => typeof u === "string" && u.trim());
    const floorplanImages = floorplanIds
      .map((id: any) => {
        const s = String(id || "").trim();
        return s && sanityAssetMap[s] ? String(sanityAssetMap[s].url) : null;
      })
      .filter((u: any) => typeof u === "string" && u.trim())
      .map((u: any) => resolvePublicUrl(String(u || "")))
      .filter((u: any) => typeof u === "string" && u.trim());

    const images = { ...((r as any).images ?? {}) } as any;
    images.gallery = normalizeImageList(images.gallery)
      .map((u) => resolvePublicUrl(u))
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    images.floorplan = normalizeImageList(images.floorplan)
      .map((u) => resolvePublicUrl(u))
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);

    const thumbs = new Set<string>(
      [pm?.frontThumbnailUrl, pm?.planThumbnailUrl].filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    );
    const withoutThumbs = (list: string[]) => list.filter((u) => !thumbs.has(String(u || "").trim()));

    const resolvedGallery =
      pm && pm.galleryUrls.length > 0
        ? withoutThumbs(pm.galleryUrls)
            .map((u) => resolvePublicUrl(u))
            .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
        : withoutThumbs(galleryImages)
            .map((u) => resolvePublicUrl(u))
            .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    const resolvedFloorplans =
      pm && pm.floorplansUrls.length > 0
        ? withoutThumbs(pm.floorplansUrls)
            .map((u) => resolvePublicUrl(u))
            .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
        : withoutThumbs(floorplanImages)
            .map((u) => resolvePublicUrl(u))
            .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    if (pm?.frontThumbnailUrl) {
      // Ensure thumbnail images never leak into detail-page hero fields.
      if (images.hero_desktop === pm.frontThumbnailUrl) delete images.hero_desktop;
      if (images.hero_mobile === pm.frontThumbnailUrl) delete images.hero_mobile;
      if (images.hero === pm.frontThumbnailUrl) delete images.hero;
    }
    if (pm?.planThumbnailUrl) {
      images.hover = pm.planThumbnailUrl;
    }
    if (pm && pm.galleryUrls.length > 0) {
      images.gallery = withoutThumbs(pm.galleryUrls)
        .map((u) => resolvePublicUrl(u))
        .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    }
    if (pm && pm.floorplansUrls.length > 0) {
      images.floorplan = withoutThumbs(pm.floorplansUrls)
        .map((u) => resolvePublicUrl(u))
        .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    }

    const legacyGallery = withoutThumbs(normalizeImageList(images.gallery));
    const legacyFloorplans = withoutThumbs(normalizeImageList(images.floorplan));
    const finalGallery = resolvedGallery.length > 0 ? resolvedGallery : legacyGallery;
    const finalFloorplans = resolvedFloorplans.length > 0 ? resolvedFloorplans : legacyFloorplans;

    return {
      ...r,
      heated_sqft: Number(r.total_sqft ?? 0),
      images,
      galleryImages: finalGallery,
      floorplanImages: finalFloorplans,
      frontThumbnailUrl: pm?.frontThumbnailUrl ?? null,
      planThumbnailUrl: pm?.planThumbnailUrl ?? null,
      buildFeatureExteriorUrl: pm?.buildFeatureExteriorUrl ?? null,
      buildFeatureFloorplanUrl: pm?.buildFeatureFloorplanUrl ?? null,
    };
  }) as Plan[];
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  const supabase = supabasePublic();
  if (!supabase) {
    maybeLogSeedFallback("missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return ((seedPlans as Plan[]).find((p) => p.slug === slug) as Plan | undefined) ?? null;
  }

  if (!hasSanity()) {
    console.warn(
      "[plans] Sanity is not configured (missing NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET). Plan media from Sanity will be unavailable.",
      { slug }
    );
  }

  const selectWithTour =
    "id, slug, name, description, tour3d_url, filters, total_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, images, tags, status";
  const selectWithoutTour =
    "id, slug, name, description, filters, total_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, images, tags, status";

  const query = async (select: string) =>
    supabase.from("plans").select(select).eq("slug", slug).maybeSingle();

  let { data, error } = (await query(selectWithTour)) as any;

  if (error) {
    const msg = String((error as any)?.message || "").toLowerCase();
    const missingTour3d = msg.includes("tour3d_url") && msg.includes("does not exist");
    if (missingTour3d) {
      ({ data, error } = (await query(selectWithoutTour)) as any);
    }
  }

  if (error) {
    console.error("[plans] Supabase getPlanBySlug failed", error.message);
    return null;
  }

  if (!data) return null;

  const f = ((data as any).filters ?? {}) as any;
  const sanityRefs = new Set<string>();
  if (Array.isArray(f.galleryImages)) {
    for (const id of f.galleryImages) {
      const s = String(id || "").trim();
      if (s) sanityRefs.add(s);
    }
  }
  if (Array.isArray(f.floorplanImages)) {
    for (const id of f.floorplanImages) {
      const s = String(id || "").trim();
      if (s) sanityRefs.add(s);
    }
  }

  const sanityAssetMap = await getSanityAssetsByIds(Array.from(sanityRefs));
  const galleryIds = Array.isArray(f.galleryImages) ? f.galleryImages : [];
  const floorplanIds = Array.isArray(f.floorplanImages) ? f.floorplanImages : [];
  const galleryImages = galleryIds
    .map((id: any) => {
      const s = String(id || "").trim();
      return s && sanityAssetMap[s] ? String(sanityAssetMap[s].url) : null;
    })
    .filter((u: any) => typeof u === "string" && u.trim())
    .map((u: any) => resolvePublicUrl(String(u || "")))
    .filter((u: any) => typeof u === "string" && u.trim());
  const floorplanImages = floorplanIds
    .map((id: any) => {
      const s = String(id || "").trim();
      return s && sanityAssetMap[s] ? String(sanityAssetMap[s].url) : null;
    })
    .filter((u: any) => typeof u === "string" && u.trim())
    .map((u: any) => resolvePublicUrl(String(u || "")))
    .filter((u: any) => typeof u === "string" && u.trim());

  const pmMap = await getPlanMediaBySlugs([String((data as any).slug || "").trim()]);
  const pm = pmMap[String((data as any).slug || "").trim()];
  const images = { ...(((data as any).images ?? {}) as any) } as any;
  images.gallery = normalizeImageList(images.gallery)
    .map((u) => resolvePublicUrl(u))
    .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  images.floorplan = normalizeImageList(images.floorplan)
    .map((u) => resolvePublicUrl(u))
    .filter((u): u is string => typeof u === "string" && u.trim().length > 0);

  const thumbs = new Set<string>(
    [pm?.frontThumbnailUrl, pm?.planThumbnailUrl].filter((u): u is string => typeof u === "string" && u.trim().length > 0)
  );
  const withoutThumbs = (list: string[]) => list.filter((u) => !thumbs.has(String(u || "").trim()));

  const resolvedGallery =
    pm && pm.galleryUrls.length > 0
      ? withoutThumbs(pm.galleryUrls)
          .map((u) => resolvePublicUrl(u))
          .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      : withoutThumbs(galleryImages)
          .map((u) => resolvePublicUrl(u))
          .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  const resolvedFloorplans =
    pm && pm.floorplansUrls.length > 0
      ? withoutThumbs(pm.floorplansUrls)
          .map((u) => resolvePublicUrl(u))
          .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      : withoutThumbs(floorplanImages)
          .map((u) => resolvePublicUrl(u))
          .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  if (pm?.frontThumbnailUrl) {
    // Ensure thumbnail images never leak into detail-page hero fields.
    if (images.hero_desktop === pm.frontThumbnailUrl) delete images.hero_desktop;
    if (images.hero_mobile === pm.frontThumbnailUrl) delete images.hero_mobile;
    if (images.hero === pm.frontThumbnailUrl) delete images.hero;
  }
  if (pm?.planThumbnailUrl) {
    images.hover = pm.planThumbnailUrl;
  }
  if (pm && pm.galleryUrls.length > 0) {
    images.gallery = withoutThumbs(pm.galleryUrls)
      .map((u) => resolvePublicUrl(u))
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  }
  if (pm && pm.floorplansUrls.length > 0) {
    images.floorplan = withoutThumbs(pm.floorplansUrls)
      .map((u) => resolvePublicUrl(u))
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  }

  const legacyGallery = withoutThumbs(normalizeImageList(images.gallery));
  const legacyFloorplans = withoutThumbs(normalizeImageList(images.floorplan));
  const finalGallery = resolvedGallery.length > 0 ? resolvedGallery : legacyGallery;
  const finalFloorplans = resolvedFloorplans.length > 0 ? resolvedFloorplans : legacyFloorplans;

  if (finalGallery.length === 0 && finalFloorplans.length === 0) {
    const f2 = ((data as any).filters ?? {}) as any;
    console.warn("[plans] Plan resolved to no gallery/floorplan images", {
      slug,
      sanityConfigured: hasSanity(),
      hasPlanMediaDoc: Boolean(pm),
      planMediaGalleryCount: pm?.galleryUrls?.length ?? 0,
      planMediaFloorplansCount: pm?.floorplansUrls?.length ?? 0,
      filtersGalleryRefs: Array.isArray(f2.galleryImages) ? f2.galleryImages.length : 0,
      filtersFloorplanRefs: Array.isArray(f2.floorplanImages) ? f2.floorplanImages.length : 0,
      legacyGalleryCount: legacyGallery.length,
      legacyFloorplansCount: legacyFloorplans.length,
    });
  }

  return {
    ...(data as any),
    heated_sqft: Number((data as any).total_sqft ?? 0),
    images,
    galleryImages: finalGallery,
    floorplanImages: finalFloorplans,
    frontThumbnailUrl: pm?.frontThumbnailUrl ?? null,
    planThumbnailUrl: pm?.planThumbnailUrl ?? null,
    buildFeatureExteriorUrl: pm?.buildFeatureExteriorUrl ?? null,
    buildFeatureFloorplanUrl: pm?.buildFeatureFloorplanUrl ?? null,
  } as Plan;
}
