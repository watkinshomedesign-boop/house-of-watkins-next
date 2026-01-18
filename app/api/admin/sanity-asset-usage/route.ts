import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type UsageRow = {
  planId: string;
  slug: string;
  name: string;
  fields: string[];
};

function matchesAssetId(value: any, assetId: string) {
  const s = String(value || "").trim();
  return s && s === assetId;
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const assetId = String(url.searchParams.get("assetId") || "").trim();
  if (!assetId) {
    return NextResponse.json({ error: "Missing assetId" }, { status: 400 });
  }

  const admin = getSupabaseAdmin() as any;

  try {
    const { data, error } = await admin
      .from("plans")
      .select("id, slug, name, filters")
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const out: UsageRow[] = [];
    for (const p of data ?? []) {
      const f = (p.filters ?? {}) as any;
      const fields: string[] = [];

      if (matchesAssetId(f.frontCardImage, assetId) || matchesAssetId(f.frontSanityImageRef, assetId)) fields.push("frontCardImage");
      if (matchesAssetId(f.planCardImage, assetId) || matchesAssetId(f.planSanityImageRef, assetId)) fields.push("planCardImage");

      if (Array.isArray(f.galleryImages) && f.galleryImages.some((x: any) => matchesAssetId(x, assetId))) fields.push("galleryImages[]");
      if (Array.isArray(f.floorplanImages) && f.floorplanImages.some((x: any) => matchesAssetId(x, assetId))) fields.push("floorplanImages[]");

      if (fields.length > 0) {
        out.push({
          planId: String(p.id),
          slug: String(p.slug),
          name: String(p.name || ""),
          fields,
        });
      }
    }

    return NextResponse.json({ assetId, plans: out, count: out.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
