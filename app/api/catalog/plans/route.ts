import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getSanityAssetsByIds } from "@/lib/sanity/assets";
import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

function maskSupabaseUrl(url: string | null | undefined) {
  const s = String(url || "").trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    const ref = (u.host.split(".")[0] || u.host).trim();
    return `${ref}.supabase.co`;
  } catch {
    return null;
  }
}

 function collectPlanSearchText(p: { slug: string; name: string; description: string | null; tags: string[] | null; images: any }) {
   const parts: string[] = [];
   const push = (v: unknown) => {
     if (v == null) return;
     if (typeof v === "string") {
       const s = v.trim();
       if (s) parts.push(s);
       return;
     }
     if (Array.isArray(v)) {
       for (const x of v) push(x);
       return;
     }
     if (typeof v === "object") {
       for (const x of Object.values(v as any)) push(x);
     }
   };

   push(p.slug);
   push(p.name);
   push(p.description);
   push(p.tags);
   push(p.images);

   return parts.join(" ").toLowerCase();
 }

 function inferFlag(text: string, patterns: Array<string | RegExp>) {
   for (const p of patterns) {
     if (typeof p === "string") {
       if (text.includes(p.toLowerCase())) return true;
     } else if (p.test(text)) {
       return true;
     }
   }
   return false;
 }

 function inferStyles(text: string, plan: { stories?: number | null; total_sqft?: number | null }) {
   const out = new Set<string>();
   const add = (label: string, ok: boolean) => {
     if (ok) out.add(label);
   };

   add("Craftsman", inferFlag(text, [/\bcraftsman\b/i]));
   add("Farmhouse", inferFlag(text, [/\bfarmhouse\b/i]));
   add("Accessory", inferFlag(text, [/\baccessory\b/i, /\badu\b/i]));
   add("Traditional", inferFlag(text, [/\btraditional\b/i]));
   add("Cottage", inferFlag(text, [/\bcottage\b/i]));
   add("Narrow Lot", inferFlag(text, [/\bnarrow\s*lot\b/i]));
   add("Contemporary", inferFlag(text, [/\bcontemporary\b/i, /\bmodern\b/i]));
   add("Multi-Family", inferFlag(text, [/\bmulti\s*-?\s*family\b/i, /\bduplex\b/i, /\btriplex\b/i, /\bfourplex\b/i]));

   // Numeric heuristics
   add("2 Story", Number(plan?.stories ?? 0) >= 2);
   add("Small Home", Number(plan?.total_sqft ?? 0) > 0 && Number(plan?.total_sqft ?? 0) <= 1200);

   return Array.from(out);
 }

 function withDerivedFeatureFlags(plan: { slug: string; name: string; description: string | null; tags: string[] | null; images: any }, filters: any) {
   const base = filters && typeof filters === "object" ? { ...filters } : {};
   const text = collectPlanSearchText(plan);

   const derived = {
     office: inferFlag(text, [/\boffice\b/i, /\bstudy\b/i, /\bden\b/i]),
     casita: inferFlag(text, [/\bcasita\b/i]),
     rv: inferFlag(text, [/\brv\b/i, /\brv\s*garage\b/i, /\brv\s*bay\b/i]),
     sideLoad: inferFlag(text, [/\bside\s*-?\s*load\b/i, /\bsideload\b/i]),
     bonusRoom: inferFlag(text, [/\bbonus\s*room\b/i, /\bbonus\s*rm\b/i, /\bbonus\b/i]),
     basement: inferFlag(text, [/\bbasement\b/i]),
   };

   for (const [k, v] of Object.entries(derived)) {
     if (base[k] === undefined || base[k] === null) base[k] = v;
   }

   if (!Array.isArray(base.styles)) {
     base.styles = inferStyles(text, plan as any);
   }

   return base;
 }

type PlanRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tour3d_url: string | null;
  total_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number | null;
  width_ft: number | null;
  depth_ft: number | null;
  tags: string[] | null;
  images: any;
  filters: any;
};

type PlanMediaResolved = {
  planSlug: string;
  frontThumbnailUrl: string | null;
  planThumbnailUrl: string | null;
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

function storagePublicUrl(pathOrUrl: string | null | undefined) {
  const s = String(pathOrUrl || "").trim();
  if (!s) return null;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  // If this is a site-relative path (e.g. /plans/... or /placeholders/...), keep it as-is.
  // These are served by Next.js directly and should not be rewritten into Supabase storage URLs.
  if (s.startsWith("/")) return s;
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeStats = url.searchParams.get("includeStats") === "1";
  const limitParam = url.searchParams.get("limit");
  const limitRequested = limitParam ? Number(limitParam) : NaN;
  const limit = Number.isFinite(limitRequested) ? Math.min(Math.max(1, Math.floor(limitRequested)), 5000) : 5000;

  const publishedStatuses = ["published", "active", "Published", "ACTIVE"];

  // Prefer anon for the core catalog list; fall back to service role only when needed.
  const anon = createSupabaseServerClient() as any;
  const admin = getSupabaseAdmin() as any;

  if (process.env.NODE_ENV !== "production") {
    const masked = maskSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(`[catalog/plans] supabase=${masked ?? "(unknown)"} includeStats=${includeStats} limit=${limit}`);
  }

  const baseSelect = "id, slug, name, description, tour3d_url, total_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, tags, images, filters";
  const doPlansQuery = async (client: any) =>
    client.from("plans").select(baseSelect).in("status", publishedStatuses).order("created_at", { ascending: false }).limit(limit);

  let plans: any = null;
  let error: any = null;

  // Try anon first (uses RLS policies if present).
  {
    const res: any = await doPlansQuery(anon);
    plans = res.data;
    error = res.error;
  }

  // If RLS blocks anon, retry with service role.
  if (error) {
    const res: any = await doPlansQuery(admin);
    plans = res.data;
    error = res.error;
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (plans ?? []) as PlanRow[];

  let statsBySlug: Record<string, { views: number; favorites: number; purchases: number }> = {};
  if (includeStats) {
    const { data: stats, error: statsErr }: any = await admin
      .from("plan_stats_30d")
      .select("plan_slug, views_count, favorites_count, purchases_count")
      .limit(2000);

    if (!statsErr) {
      for (const s of stats ?? []) {
        statsBySlug[String(s.plan_slug)] = {
          views: Number(s.views_count ?? 0),
          favorites: Number(s.favorites_count ?? 0),
          purchases: Number(s.purchases_count ?? 0),
        };
      }
    }
  }

  // Resolve card images from plan.filters media ids if present (frontImageMediaId / planImageMediaId)
  // Otherwise fallback to existing images.* fields.
  const mediaIds = new Set<string>();
  const sanityRefs = new Set<string>();
  for (const p of rows) {
    const f = (p.filters ?? {}) as any;
    if (typeof f.frontImageMediaId === "string" && f.frontImageMediaId.trim()) mediaIds.add(f.frontImageMediaId.trim());
    if (typeof f.planImageMediaId === "string" && f.planImageMediaId.trim()) mediaIds.add(f.planImageMediaId.trim());

    // Standardized Sanity refs (preferred)
    if (typeof f.frontCardImage === "string" && f.frontCardImage.trim()) sanityRefs.add(f.frontCardImage.trim());
    if (typeof f.planCardImage === "string" && f.planCardImage.trim()) sanityRefs.add(f.planCardImage.trim());
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

    // Back-compat fields
    if (typeof f.frontSanityImageRef === "string" && f.frontSanityImageRef.trim()) sanityRefs.add(f.frontSanityImageRef.trim());
    if (typeof f.planSanityImageRef === "string" && f.planSanityImageRef.trim()) sanityRefs.add(f.planSanityImageRef.trim());
  }

  const mediaMap: Record<string, { file_path: string }> = {};
  if (mediaIds.size > 0) {
    const ids = Array.from(mediaIds);
    const { data: media, error: mediaErr }: any = await admin.from("plan_media").select("id, file_path").in("id", ids);
    if (!mediaErr) {
      for (const m of media ?? []) {
        mediaMap[String(m.id)] = { file_path: String(m.file_path) };
      }
    }
  }

  const sanityAssetMap = await getSanityAssetsByIds(Array.from(sanityRefs));
  const planMediaMap = await getPlanMediaBySlugs(rows.map((r) => String(r?.slug || "").trim()));

  const out = rows.map((p) => {
    const f = withDerivedFeatureFlags(p, p.filters ?? {});
    const pm = planMediaMap[String(p?.slug || "").trim()];
    const frontMediaId = typeof f.frontImageMediaId === "string" ? f.frontImageMediaId.trim() : "";
    const planMediaId = typeof f.planImageMediaId === "string" ? f.planImageMediaId.trim() : "";

    const frontSanityRef = typeof f.frontCardImage === "string" ? f.frontCardImage.trim() : "";
    const planSanityRef = typeof f.planCardImage === "string" ? f.planCardImage.trim() : "";

    const frontSanityRefCompat = typeof f.frontSanityImageRef === "string" ? f.frontSanityImageRef.trim() : "";
    const planSanityRefCompat = typeof f.planSanityImageRef === "string" ? f.planSanityImageRef.trim() : "";

    const frontSrc = frontMediaId && mediaMap[frontMediaId] ? storagePublicUrl(mediaMap[frontMediaId].file_path) : null;
    const planSrc = planMediaId && mediaMap[planMediaId] ? storagePublicUrl(mediaMap[planMediaId].file_path) : null;

    const frontSanitySrc = frontSanityRef && sanityAssetMap[frontSanityRef] ? String(sanityAssetMap[frontSanityRef].url) : null;
    const planSanitySrc = planSanityRef && sanityAssetMap[planSanityRef] ? String(sanityAssetMap[planSanityRef].url) : null;

    const frontSanitySrcCompat =
      frontSanityRefCompat && sanityAssetMap[frontSanityRefCompat]
        ? String(sanityAssetMap[frontSanityRefCompat].url)
        : null;
    const planSanitySrcCompat =
      planSanityRefCompat && sanityAssetMap[planSanityRefCompat]
        ? String(sanityAssetMap[planSanityRefCompat].url)
        : null;

    const galleryIds = Array.isArray(f.galleryImages) ? f.galleryImages : [];
    const floorplanIds = Array.isArray(f.floorplanImages) ? f.floorplanImages : [];
    const gallerySanity = galleryIds
      .map((id: any) => {
        const s = String(id || "").trim();
        return s && sanityAssetMap[s] ? String(sanityAssetMap[s].url) : null;
      })
      .filter((u: any) => typeof u === "string" && u.trim());
    const floorplanSanity = floorplanIds
      .map((id: any) => {
        const s = String(id || "").trim();
        return s && sanityAssetMap[s] ? String(sanityAssetMap[s].url) : null;
      })
      .filter((u: any) => typeof u === "string" && u.trim());

    const resolvedGallery = pm && pm.galleryUrls.length > 0 ? pm.galleryUrls : gallerySanity;
    const resolvedFloorplans = pm && pm.floorplansUrls.length > 0 ? pm.floorplansUrls : floorplanSanity;

    const pmFrontFallback = pm?.galleryUrls?.[0] ?? null;
    const pmPlanFallback = pm?.floorplansUrls?.[0] ?? pm?.galleryUrls?.[0] ?? null;

    const fallbackFront = storagePublicUrl(p.images?.hero_desktop || p.images?.hero_mobile || p.images?.hero || p.images?.gallery?.[0]) || "/placeholders/plan-hero.svg";
    const fallbackPlan = storagePublicUrl(p.images?.floorplan?.[0] || p.images?.hover) || "/placeholders/floorplan.svg";

    const stats = statsBySlug[p.slug] ?? { views: 0, favorites: 0, purchases: 0 };

    const resolvedFront =
      pm?.frontThumbnailUrl ?? pmFrontFallback ?? frontSanitySrc ?? frontSanitySrcCompat ?? frontSrc ?? fallbackFront;
    let resolvedPlan =
      pm?.planThumbnailUrl ?? pmPlanFallback ?? planSanitySrc ?? planSanitySrcCompat ?? planSrc ?? fallbackPlan;

    // If we have a real front image but no usable plan image, reuse the front image.
    if (
      typeof resolvedFront === "string" &&
      resolvedFront.trim() &&
      !resolvedFront.includes("/placeholders/") &&
      (typeof resolvedPlan !== "string" || !resolvedPlan.trim() || resolvedPlan.includes("/placeholders/"))
    ) {
      resolvedPlan = resolvedFront;
    }

    return {
      ...p,
      // Keep legacy field name used in UI.
      heated_sqft: Number((p as any).total_sqft ?? 0),
      filters: f,
      cardImages: {
        front: resolvedFront,
        plan: resolvedPlan,
      },
      galleryImages: resolvedGallery,
      floorplanImages: resolvedFloorplans,
      stats,
    };
  });

  return NextResponse.json({ plans: out, count: out.length });
}
