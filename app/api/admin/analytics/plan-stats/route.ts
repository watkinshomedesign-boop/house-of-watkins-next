import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const range = String(url.searchParams.get("range") || "30d");
  const view = range === "total" ? "plan_stats_total" : "plan_stats_30d";

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase.from(view).select("plan_slug, views_count, favorites_count, purchases_count");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as { plan_slug: string; views_count: number; favorites_count: number; purchases_count: number }[];
  const slugs = rows.map((r) => r.plan_slug).filter(Boolean);

  // Fetch plan names from Supabase plans table
  let nameMap: Record<string, string> = {};
  if (slugs.length > 0) {
    const { data: plans } = await supabase.from("plans").select("slug, name").in("slug", slugs);
    for (const p of plans ?? []) {
      if (p.slug && p.name) nameMap[p.slug] = p.name;
    }
  }

  // Fetch front elevation images from Sanity
  let imageMap: Record<string, string> = {};
  if (slugs.length > 0 && hasSanity()) {
    try {
      const client = getServerSanityClient();
      const query = `*[_type == "planMedia" && planSlug in $slugs] { planSlug, "frontThumbnailUrl": frontThumbnail.asset->url }`;
      const items = (await client.fetch(query, { slugs }, { next: { revalidate: 60 } })) as any[];
      for (const it of items ?? []) {
        if (it?.planSlug && it?.frontThumbnailUrl) imageMap[it.planSlug] = it.frontThumbnailUrl;
      }
    } catch {
      // Sanity fetch failed — continue without images
    }
  }

  const enriched = rows.map((r) => ({
    ...r,
    plan_name: nameMap[r.plan_slug] || null,
    front_image_url: imageMap[r.plan_slug] || null,
  }));

  return NextResponse.json({ data: enriched, range: range === "total" ? "total" : "30d" });
}
