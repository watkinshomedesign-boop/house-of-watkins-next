import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSanityAssetsByIds, listSanityAssets } from "@/lib/sanity/assets";

function parseIntParam(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const idsParam = (url.searchParams.get("ids") || "").trim();
  const q = (url.searchParams.get("q") || "").trim();
  const type = (url.searchParams.get("type") || "all").trim().toLowerCase();

  const limit = Math.min(parseIntParam(url.searchParams.get("limit"), 60), 120);
  const offset = Math.max(0, parseIntParam(url.searchParams.get("offset"), 0));

  try {
    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((s) => decodeURIComponent(String(s || "").trim()))
        .map((s) => String(s || "").trim())
        .filter(Boolean);

      const map = await getSanityAssetsByIds(ids);
      const items = ids.map((id) => map[id]).filter(Boolean);

      return NextResponse.json({
        items,
        total: items.length,
        limit: items.length,
        offset: 0,
        sanityConfigured: true,
      });
    }

    const res = await listSanityAssets({
      q,
      type: type === "images" || type === "videos" ? (type as any) : "all",
      limit,
      offset,
    });

    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
